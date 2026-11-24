import 'dotenv/config';
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PERMANENT_PORTRAIT_URL = '/assets/aistudio/IMG-20260929-WA0007_3fbcb075.jpg';
const WORKSPACE_DIR = path.resolve(__dirname, 'workspace');
const CONFIG_FILE_PATH = path.resolve(WORKSPACE_DIR, 'portfolio-config.json');

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  organization: string;
  message: string;
  submittedAt: string;
}

interface PersistedPortfolioConfig {
  portraitUrl: string;
  githubUsername: string;
  linkedinUrl: string;
  updatedAt: string;
}

interface GitHubRepoSummary {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  watchersCount: number;
  openIssuesCount: number;
  topics: string[];
  updatedAt: string;
  pushedAt: string;
  fork: boolean;
  archived: boolean;
}

interface GitHubLanguageStat {
  language: string;
  count: number;
  percentage: number;
}

interface GitHubIntegrationPayload {
  profile: {
    login: string;
    name: string | null;
    bio: string | null;
    htmlUrl: string;
    avatarUrl: string;
    followers: number;
    following: number;
    publicRepos: number;
    location: string | null;
    company: string | null;
    blog: string | null;
    createdAt: string;
  };
  repos: GitHubRepoSummary[];
  languages: GitHubLanguageStat[];
  totalStars: number;
  totalForks: number;
  fetchedAt: string;
}

const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
const GITHUB_CACHE_TTL_MS = 5 * 60 * 1000;
const githubCache = new Map<string, { expiresAt: number; payload: GitHubIntegrationPayload }>();
const recentSubmissions: ContactSubmission[] = [];

function getSafeConfigPath(): string {
  if (!CONFIG_FILE_PATH.startsWith(WORKSPACE_DIR + path.sep)) {
    throw new Error('Invalid configuration path.');
  }
  return CONFIG_FILE_PATH;
}

function readPersistedConfig(): PersistedPortfolioConfig {
  const defaults: PersistedPortfolioConfig = {
    portraitUrl: PERMANENT_PORTRAIT_URL,
    githubUsername: '',
    linkedinUrl: '',
    updatedAt: new Date().toISOString(),
  };

  try {
    const filePath = getSafeConfigPath();
    if (!fs.existsSync(filePath)) {
      return defaults;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<PersistedPortfolioConfig>;
    const safeUsername =
      typeof parsed.githubUsername === 'string' && GITHUB_USERNAME_REGEX.test(parsed.githubUsername.trim())
        ? parsed.githubUsername.trim()
        : '';

    return {
      portraitUrl:
        typeof parsed.portraitUrl === 'string' && parsed.portraitUrl.trim().length > 0
          ? parsed.portraitUrl.trim()
          : PERMANENT_PORTRAIT_URL,
      githubUsername: safeUsername,
      linkedinUrl:
        typeof parsed.linkedinUrl === 'string' && /^https?:\/\//i.test(parsed.linkedinUrl.trim())
          ? parsed.linkedinUrl.trim()
          : '',
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : defaults.updatedAt,
    };
  } catch {
    return defaults;
  }
}

function writePersistedConfig(next: PersistedPortfolioConfig): void {
  if (!fs.existsSync(WORKSPACE_DIR)) {
    fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
  }
  const filePath = getSafeConfigPath();
  fs.writeFileSync(filePath, JSON.stringify(next, null, 2), 'utf-8');
}

function extractGithubUsername(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let candidate = trimmed;
  if (/^https?:\/\//i.test(trimmed) || trimmed.includes('github.com/')) {
    try {
      const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      const parsed = new URL(normalized);
      if (!parsed.hostname.toLowerCase().endsWith('github.com')) {
        return null;
      }
      const segments = parsed.pathname.split('/').filter(Boolean);
      candidate = segments[0] || '';
    } catch {
      return null;
    }
  }

  candidate = candidate.replace(/^@+/, '').trim();
  if (!GITHUB_USERNAME_REGEX.test(candidate)) {
    return null;
  }
  if (candidate.toLowerCase().includes('placeholder')) {
    return null;
  }
  return candidate;
}

async function fetchGitHubProfileData(username: string): Promise<GitHubIntegrationPayload> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Muhammad-Muazzam-Portfolio/1.0',
  };

  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim().length > 0) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN.trim()}`;
  }

  const encoded = encodeURIComponent(username);
  const [userResp, reposResp] = await Promise.all([
    fetch(`https://api.github.com/users/${encoded}`, { headers }),
    fetch(`https://api.github.com/users/${encoded}/repos?sort=updated&per_page=100&type=owner`, {
      headers,
    }),
  ]);

  if (userResp.status === 404) {
    const err = new Error(`GitHub user "${username}" was not found.`);
    (err as Error & { statusCode?: number }).statusCode = 404;
    throw err;
  }

  if (userResp.status === 403 || userResp.status === 429 || reposResp.status === 403 || reposResp.status === 429) {
    const err = new Error('GitHub API rate limit reached. Please try again in a few minutes or add GITHUB_TOKEN.');
    (err as Error & { statusCode?: number }).statusCode = 429;
    throw err;
  }

  if (!userResp.ok) {
    const err = new Error(`GitHub returned status ${userResp.status}.`);
    (err as Error & { statusCode?: number }).statusCode = 502;
    throw err;
  }

  const userJson = (await userResp.json()) as Record<string, unknown>;
  const reposRaw = reposResp.ok ? ((await reposResp.json()) as Record<string, unknown>[]) : [];

  const repos: GitHubRepoSummary[] = (Array.isArray(reposRaw) ? reposRaw : []).map((r) => ({
    id: Number(r.id) || 0,
    name: String(r.name || ''),
    fullName: String(r.full_name || ''),
    description: typeof r.description === 'string' ? r.description : null,
    htmlUrl: String(r.html_url || ''),
    homepage:
      typeof r.homepage === 'string' && /^https?:\/\//i.test(r.homepage.trim())
        ? r.homepage.trim()
        : null,
    language: typeof r.language === 'string' ? r.language : null,
    stargazersCount: Number(r.stargazers_count) || 0,
    forksCount: Number(r.forks_count) || 0,
    watchersCount: Number(r.watchers_count) || 0,
    openIssuesCount: Number(r.open_issues_count) || 0,
    topics: Array.isArray(r.topics) ? r.topics.filter((t): t is string => typeof t === 'string') : [],
    updatedAt: String(r.updated_at || ''),
    pushedAt: String(r.pushed_at || ''),
    fork: Boolean(r.fork),
    archived: Boolean(r.archived),
  }));

  const languageCounts = new Map<string, number>();
  let totalTaggedRepos = 0;
  let totalStars = 0;
  let totalForks = 0;

  for (const repo of repos) {
    totalStars += repo.stargazersCount;
    totalForks += repo.forksCount;
    if (repo.language && !repo.fork) {
      languageCounts.set(repo.language, (languageCounts.get(repo.language) || 0) + 1);
      totalTaggedRepos += 1;
    }
  }

  const languages: GitHubLanguageStat[] = Array.from(languageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([language, count]) => ({
      language,
      count,
      percentage: totalTaggedRepos > 0 ? Math.round((count / totalTaggedRepos) * 100) : 0,
    }));

  return {
    profile: {
      login: String(userJson.login || username),
      name: typeof userJson.name === 'string' ? userJson.name : null,
      bio: typeof userJson.bio === 'string' ? userJson.bio : null,
      htmlUrl: String(userJson.html_url || `https://github.com/${username}`),
      avatarUrl: String(userJson.avatar_url || ''),
      followers: Number(userJson.followers) || 0,
      following: Number(userJson.following) || 0,
      publicRepos: Number(userJson.public_repos) || 0,
      location: typeof userJson.location === 'string' ? userJson.location : null,
      company: typeof userJson.company === 'string' ? userJson.company : null,
      blog: typeof userJson.blog === 'string' && userJson.blog.trim() ? userJson.blog.trim() : null,
      createdAt: String(userJson.created_at || ''),
    },
    repos,
    languages,
    totalStars,
    totalForks,
    fetchedAt: new Date().toISOString(),
  };
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '100kb' }));

  app.get('/api/portfolio-config', (_req: Request, res: Response) => {
    const config = readPersistedConfig();
    res.json({ ok: true, config });
  });

  app.put('/api/portfolio-config', (req: Request, res: Response) => {
    const current = readPersistedConfig();
    const { githubUsername, linkedinUrl, portraitUrl } = req.body ?? {};

    let nextGithubUsername = current.githubUsername;
    if (typeof githubUsername === 'string') {
      if (githubUsername.trim() === '') {
        nextGithubUsername = '';
      } else {
        const parsed = extractGithubUsername(githubUsername);
        if (!parsed) {
          res.status(400).json({
            ok: false,
            error: 'Please enter a valid GitHub username or github.com profile URL.',
          });
          return;
        }
        nextGithubUsername = parsed;
      }
    }

    let nextLinkedin = current.linkedinUrl;
    if (typeof linkedinUrl === 'string') {
      const trimmed = linkedinUrl.trim();
      if (trimmed === '' || /^https?:\/\/(www\.)?linkedin\.com\//i.test(trimmed)) {
        nextLinkedin = trimmed;
      }
    }

    let nextPortrait = current.portraitUrl;
    if (typeof portraitUrl === 'string' && portraitUrl.trim().length > 0) {
      const trimmed = portraitUrl.trim();
      if (trimmed.startsWith('/assets/') || /^https?:\/\//i.test(trimmed)) {
        nextPortrait = trimmed;
      }
    }

    const updated: PersistedPortfolioConfig = {
      portraitUrl: nextPortrait,
      githubUsername: nextGithubUsername,
      linkedinUrl: nextLinkedin,
      updatedAt: new Date().toISOString(),
    };

    writePersistedConfig(updated);
    res.json({ ok: true, config: updated });
  });

  app.get('/api/github/profile', async (req: Request, res: Response) => {
    const rawUsername = typeof req.query.username === 'string' ? req.query.username : '';
    const forceRefresh = req.query.refresh === '1';

    const username = extractGithubUsername(rawUsername);
    if (!username) {
      res.status(400).json({
        ok: false,
        error: 'Invalid GitHub username. Provide a valid username or github.com profile URL.',
      });
      return;
    }

    const cacheKey = username.toLowerCase();
    const cached = githubCache.get(cacheKey);
    if (!forceRefresh && cached && cached.expiresAt > Date.now()) {
      res.json({ ok: true, cached: true, data: cached.payload });
      return;
    }

    try {
      const payload = await fetchGitHubProfileData(username);
      githubCache.set(cacheKey, {
        expiresAt: Date.now() + GITHUB_CACHE_TTL_MS,
        payload,
      });
      res.json({ ok: true, cached: false, data: payload });
    } catch (err) {
      const status = (err as Error & { statusCode?: number }).statusCode || 502;
      const message = err instanceof Error ? err.message : 'Failed to load GitHub profile.';
      res.status(status).json({ ok: false, error: message });
    }
  });

  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, subject, organization, message } = req.body ?? {};

    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim() : '';
    const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
    const cleanOrg = typeof organization === 'string' ? organization.trim() : '';
    const cleanMessage = typeof message === 'string' ? message.trim() : '';

    const errors: Record<string, string> = {};

    if (cleanName.length < 2 || cleanName.length > 120) {
      errors.name = 'Please enter your name (2–120 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 160) {
      errors.email = 'Please provide a valid email address.';
    }

    if (cleanSubject.length < 3 || cleanSubject.length > 160) {
      errors.subject = 'Please include a short subject (3–160 characters).';
    }

    if (cleanMessage.length < 15 || cleanMessage.length > 4000) {
      errors.message = 'Please write a message of at least 15 characters.';
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ ok: false, errors });
      return;
    }

    const submission: ContactSubmission = {
      id: `inq_${Date.now().toString(36)}`,
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      organization: cleanOrg,
      message: cleanMessage,
      submittedAt: new Date().toISOString(),
    };

    recentSubmissions.unshift(submission);
    if (recentSubmissions.length > 50) {
      recentSubmissions.length = 50;
    }

    res.status(201).json({
      ok: true,
      id: submission.id,
      receivedAt: submission.submittedAt,
      deliveryMode: 'validated-api-inbox',
    });
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
