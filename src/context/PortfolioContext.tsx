import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  GitHubIntegrationPayload,
  PortfolioData,
  ProjectItem,
} from '../types/portfolio';
import { DEFAULT_PORTFOLIO_DATA, PERMANENT_PORTRAIT_URL } from '../data/defaultPortfolio';

type ThemeMode = 'dark' | 'light';

interface PortfolioContextValue {
  data: PortfolioData;
  updateData: (updater: (prev: PortfolioData) => PortfolioData) => void;
  resetToDefaults: () => void;
  addProject: (project: ProjectItem) => void;
  updateProject: (projectId: string, updated: ProjectItem) => void;
  deleteProject: (projectId: string) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  currentPath: string;
  navigate: (to: string) => void;
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
  editorInitialTab: string;
  openEditorAt: (tab: string) => void;
  githubData: GitHubIntegrationPayload | null;
  githubLoading: boolean;
  githubError: string | null;
  connectGithubAccount: (usernameOrUrl: string) => Promise<boolean>;
  disconnectGithubAccount: () => Promise<void>;
  refreshGithubData: () => Promise<void>;
}

const STORAGE_KEY = 'mm_portfolio_data_v2';
const LEGACY_STORAGE_KEY = 'mm_portfolio_data_v1';
const THEME_KEY = 'mm_portfolio_theme';
const OLD_SYSTEM_PORTRAIT = '/src/assets/images/muazzam_profile_portrait_1795361211252.jpg';

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

function parseGithubUsernameFromUrl(urlOrUser?: string): string {
  if (!urlOrUser) return '';
  const trimmed = urlOrUser.trim();
  if (!trimmed || trimmed.toLowerCase().includes('placeholder')) return '';
  if (trimmed.includes('github.com/')) {
    try {
      const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      const u = new URL(normalized);
      const seg = u.pathname.split('/').filter(Boolean)[0] || '';
      return seg.toLowerCase().includes('placeholder') ? '' : seg;
    } catch {
      return '';
    }
  }
  if (/^https?:\/\//i.test(trimmed)) return '';
  return trimmed.replace(/^@+/, '');
}

function sanitizeStoredData(parsed: Partial<PortfolioData>): PortfolioData {
  const mergedProfile = {
    ...DEFAULT_PORTFOLIO_DATA.profile,
    ...(parsed.profile || {}),
  };

  // Permanently preserve the user's uploaded portrait and override any old system placeholder
  if (
    !mergedProfile.portraitUrl ||
    mergedProfile.portraitUrl === OLD_SYSTEM_PORTRAIT ||
    mergedProfile.portraitIsPlaceholder
  ) {
    mergedProfile.portraitUrl = PERMANENT_PORTRAIT_URL;
  }
  mergedProfile.portraitIsPlaceholder = false;

  // Clean up legacy placeholder GitHub URL
  const derivedUsername =
    parseGithubUsernameFromUrl(mergedProfile.githubUsername) ||
    parseGithubUsernameFromUrl(mergedProfile.githubUrl);

  mergedProfile.githubUsername = derivedUsername;
  mergedProfile.githubUrl = derivedUsername
    ? `https://github.com/${derivedUsername}`
    : 'https://github.com';

  return {
    ...DEFAULT_PORTFOLIO_DATA,
    ...parsed,
    profile: mergedProfile,
    education: { ...DEFAULT_PORTFOLIO_DATA.education, ...(parsed.education || {}) },
  };
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const savedV2 = localStorage.getItem(STORAGE_KEY);
      if (savedV2) {
        return sanitizeStoredData(JSON.parse(savedV2));
      }
      const savedLegacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (savedLegacy) {
        return sanitizeStoredData(JSON.parse(savedLegacy));
      }
    } catch {
      // Fallback to defaults if localStorage is unavailable or corrupted
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorInitialTab, setEditorInitialTab] = useState('profile');

  const [githubData, setGithubData] = useState<GitHubIntegrationPayload | null>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);

  const fetchGithub = useCallback(async (username: string, forceRefresh = false) => {
    if (!username) {
      setGithubData(null);
      setGithubError(null);
      return null;
    }

    setGithubLoading(true);
    setGithubError(null);
    try {
      const url = `/api/github/profile?username=${encodeURIComponent(username)}${
        forceRefresh ? '&refresh=1' : ''
      }`;
      const resp = await fetch(url);
      const payload = await resp.json();
      if (!resp.ok || !payload.ok) {
        setGithubError(payload.error || 'Could not load GitHub repositories.');
        setGithubData(null);
        return null;
      }
      setGithubData(payload.data as GitHubIntegrationPayload);
      return payload.data as GitHubIntegrationPayload;
    } catch {
      setGithubError('Unable to reach the GitHub integration endpoint.');
      return null;
    } finally {
      setGithubLoading(false);
    }
  }, []);

  // Hydrate persisted server config (portrait lock + saved GitHub username)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const resp = await fetch('/api/portfolio-config');
        if (!resp.ok) return;
        const json = await resp.json();
        if (!active || !json.ok || !json.config) return;

        const serverUser =
          typeof json.config.githubUsername === 'string' ? json.config.githubUsername.trim() : '';

        setData((prev) => {
          const nextUser = serverUser || prev.profile.githubUsername || '';
          return {
            ...prev,
            profile: {
              ...prev.profile,
              portraitUrl:
                prev.profile.portraitUrl && prev.profile.portraitUrl !== OLD_SYSTEM_PORTRAIT
                  ? prev.profile.portraitUrl
                  : PERMANENT_PORTRAIT_URL,
              portraitIsPlaceholder: false,
              githubUsername: nextUser,
              githubUrl: nextUser ? `https://github.com/${nextUser}` : prev.profile.githubUrl,
              linkedinUrl:
                json.config.linkedinUrl && json.config.linkedinUrl.trim()
                  ? json.config.linkedinUrl
                  : prev.profile.linkedinUrl,
            },
          };
        });
      } catch {
        // Ignore offline/initial server warm-up issues
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Automatically fetch live GitHub repositories whenever githubUsername is set
  useEffect(() => {
    const username = data.profile.githubUsername?.trim() || '';
    if (username) {
      fetchGithub(username, false);
    } else {
      setGithubData(null);
      setGithubError(null);
    }
  }, [data.profile.githubUsername, fetchGithub]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
  }, [data]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const connectGithubAccount = useCallback(
    async (usernameOrUrl: string): Promise<boolean> => {
      const candidate = parseGithubUsernameFromUrl(usernameOrUrl);
      if (!candidate) {
        setGithubError('Please enter a valid GitHub username or profile URL.');
        return false;
      }

      const result = await fetchGithub(candidate, true);
      if (!result) {
        return false;
      }

      const canonicalLogin = result.profile.login;
      const canonicalUrl = result.profile.htmlUrl || `https://github.com/${canonicalLogin}`;

      // Persist on server without altering user's permanent portrait image
      try {
        await fetch('/api/portfolio-config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ githubUsername: canonicalLogin }),
        });
      } catch {
        // Local persistence still updates
      }

      setData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          githubUsername: canonicalLogin,
          githubUrl: canonicalUrl,
        },
      }));

      return true;
    },
    [fetchGithub]
  );

  const disconnectGithubAccount = useCallback(async () => {
    try {
      await fetch('/api/portfolio-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUsername: '' }),
      });
    } catch {
      // ignore
    }

    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        githubUsername: '',
        githubUrl: 'https://github.com',
      },
    }));
    setGithubData(null);
    setGithubError(null);
  }, []);

  const refreshGithubData = useCallback(async () => {
    const username = data.profile.githubUsername?.trim();
    if (username) {
      await fetchGithub(username, true);
    }
  }, [data.profile.githubUsername, fetchGithub]);

  const navigate = useCallback((to: string) => {
    if (to.startsWith('#')) {
      const id = to.slice(1);
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (to.includes('#')) {
      const [pathPart, hashPart] = to.split('#');
      const targetPath = pathPart || '/';
      window.history.pushState({}, '', targetPath);
      setCurrentPath(targetPath);
      setTimeout(() => {
        document.getElementById(hashPart)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }

    window.history.pushState({}, '', to);
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateData = useCallback((updater: (prev: PortfolioData) => PortfolioData) => {
    setData((prev) => updater(prev));
  }, []);

  const resetToDefaults = useCallback(() => {
    setData({
      ...DEFAULT_PORTFOLIO_DATA,
      profile: {
        ...DEFAULT_PORTFOLIO_DATA.profile,
        portraitUrl: PERMANENT_PORTRAIT_URL,
        portraitIsPlaceholder: false,
      },
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const addProject = useCallback((project: ProjectItem) => {
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
  }, []);

  const updateProject = useCallback((projectId: string, updated: ProjectItem) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === projectId ? updated : p)),
    }));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projectId),
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const openEditorAt = useCallback((tab: string) => {
    setEditorInitialTab(tab);
    setIsEditorOpen(true);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        resetToDefaults,
        addProject,
        updateProject,
        deleteProject,
        theme,
        toggleTheme,
        currentPath,
        navigate,
        isEditorOpen,
        setIsEditorOpen,
        editorInitialTab,
        openEditorAt,
        githubData,
        githubLoading,
        githubError,
        connectGithubAccount,
        disconnectGithubAccount,
        refreshGithubData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return ctx;
}
