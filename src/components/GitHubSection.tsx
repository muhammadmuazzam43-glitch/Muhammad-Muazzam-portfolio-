import React, { useMemo, useState } from 'react';
import {
  ExternalLink,
  GitFork,
  Github,
  RefreshCw,
  Search,
  Star,
  Unlink,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  SQL: '#E38C00',
  PLpgSQL: '#336791',
  C: '#555555',
  'C++': '#F34B7D',
  HTML: '#E34C26',
  CSS: '#563D7C',
  MATLAB: '#E16737',
  'Jupyter Notebook': '#DA5B0B',
};

export const GitHubSection: React.FC = () => {
  const {
    data,
    githubData,
    githubLoading,
    githubError,
    connectGithubAccount,
    disconnectGithubAccount,
    refreshGithubData,
  } = usePortfolio();

  const savedUsername = data.profile.githubUsername?.trim() || '';
  const [usernameInput, setUsernameInput] = useState(savedUsername);
  const [editingHandle, setEditingHandle] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('All');
  const [repoSearch, setRepoSearch] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'stars'>('updated');
  const [connecting, setConnecting] = useState(false);

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setConnecting(true);
    const ok = await connectGithubAccount(usernameInput);
    setConnecting(false);
    if (ok) {
      setEditingHandle(false);
      setSelectedLang('All');
    }
  };

  const languageTabs = useMemo(() => {
    if (!githubData) return ['All'];
    const langs = Array.from(
      new Set(
        githubData.repos
          .map((r) => r.language)
          .filter((l): l is string => Boolean(l))
      )
    );
    return ['All', ...langs];
  }, [githubData]);

  const filteredRepos = useMemo(() => {
    if (!githubData) return [];
    const q = repoSearch.trim().toLowerCase();
    const list = githubData.repos.filter((repo) => {
      const matchesLang = selectedLang === 'All' || repo.language === selectedLang;
      if (!matchesLang) return false;
      if (!q) return true;
      return [repo.name, repo.description || '', repo.language || '', ...repo.topics]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'stars') {
        return b.stargazersCount - a.stargazersCount;
      }
      return new Date(b.pushedAt || b.updatedAt).getTime() - new Date(a.pushedAt || a.updatedAt).getTime();
    });
  }, [githubData, selectedLang, repoSearch, sortBy]);

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <section
      id="github"
      className="py-16 lg:py-24 border-b border-slate-200 dark:border-[#182642] bg-slate-50/70 dark:bg-[#070F1E]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              04. Open Source &amp; Repositories
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white mt-1.5">
              GitHub Engineering Integration
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              Live public repositories, language distribution, and code activity synchronized directly from the GitHub REST API.
            </p>
          </div>

          {savedUsername && !editingHandle && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => refreshGithubData()}
                disabled={githubLoading}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500/60 transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${githubLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUsernameInput(savedUsername);
                  setEditingHandle(true);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500/60 transition-colors cursor-pointer"
              >
                <Github className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Change Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Connect or Switch GitHub Handle Form */}
        {(!savedUsername || editingHandle) && (
          <div className="rounded-2xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] p-6 sm:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <Github className="w-4 h-4" />
                  <span>{savedUsername ? 'Update Connected GitHub Username' : 'Connect Your GitHub Account'}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Display Your Live Repositories Automatically
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enter your GitHub username or full profile link (for example{' '}
                  <span className="font-mono text-xs text-slate-900 dark:text-slate-100">
                    https://github.com/your-username
                  </span>
                  ). Once saved, your repositories remain connected across reloads without affecting your portrait photo.
                </p>
              </div>

              <form
                onSubmit={handleConnectSubmit}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto lg:min-w-[420px]"
              >
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="GitHub username or profile URL"
                  aria-label="GitHub username or profile URL"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-[#182642] bg-slate-50 dark:bg-[#050B16] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={connecting || !usernameInput.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  <span>{connecting ? 'Connecting...' : 'Connect GitHub'}</span>
                </button>
                {editingHandle && (
                  <button
                    type="button"
                    onClick={() => setEditingHandle(false)}
                    className="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-[#182642] text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {savedUsername && editingHandle && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#182642] flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Currently connected as <span className="font-mono text-slate-800 dark:text-slate-200">@{savedUsername}</span>
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    await disconnectGithubAccount();
                    setUsernameInput('');
                    setEditingHandle(false);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:underline cursor-pointer"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error Callout */}
        {githubError && (
          <div
            role="alert"
            className="mb-8 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-sm text-rose-700 dark:text-rose-300 flex flex-wrap items-center justify-between gap-3"
          >
            <span>{githubError}</span>
            {savedUsername && (
              <button
                type="button"
                onClick={() => refreshGithubData()}
                className="text-xs font-semibold underline cursor-pointer"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {githubLoading && !githubData && savedUsername && (
          <div className="space-y-6">
            <div className="h-28 rounded-2xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-48 rounded-xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Live GitHub Profile & Repositories */}
        {githubData && (
          <div className="space-y-8">
            {/* GitHub Overview Bar */}
            <div className="rounded-2xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#182642]">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                      @{githubData.profile.login}
                    </span>
                    {githubData.profile.location && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{githubData.profile.location}</span>
                      </>
                    )}
                    {githubData.profile.company && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{githubData.profile.company}</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                    {githubData.profile.name || githubData.profile.login}
                  </h3>
                  {githubData.profile.bio && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                      {githubData.profile.bio}
                    </p>
                  )}
                </div>

                <a
                  href={githubData.profile.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 self-start lg:self-center"
                >
                  <Github className="w-4 h-4" />
                  <span>Open GitHub Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* 4-column Tabular Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Public Repositories</p>
                  <p className="font-display text-2xl font-bold text-slate-950 dark:text-white tabular-nums mt-1">
                    {githubData.profile.publicRepos}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Stars</p>
                  <p className="font-display text-2xl font-bold text-slate-950 dark:text-white tabular-nums mt-1">
                    {githubData.totalStars}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Forks</p>
                  <p className="font-display text-2xl font-bold text-slate-950 dark:text-white tabular-nums mt-1">
                    {githubData.totalForks}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Followers</p>
                  <p className="font-display text-2xl font-bold text-slate-950 dark:text-white tabular-nums mt-1">
                    {githubData.profile.followers}
                  </p>
                </div>
              </div>

              {/* Language Breakdown */}
              {githubData.languages.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-[#182642]">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                    Primary Languages Across Owned Repositories
                  </p>
                  <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
                    {githubData.languages.map((lang) => (
                      <div
                        key={lang.language}
                        style={{
                          width: `${Math.max(lang.percentage, 3)}%`,
                          backgroundColor: LANGUAGE_COLORS[lang.language] || '#3B82F6',
                        }}
                        title={`${lang.language}: ${lang.percentage}%`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {githubData.languages.map((lang) => (
                      <span key={lang.language} className="inline-flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: LANGUAGE_COLORS[lang.language] || '#3B82F6',
                          }}
                        />
                        <span className="font-medium">{lang.language}</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                          {lang.percentage}%
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter & Search Bar */}
            {githubData.repos.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-white dark:bg-[#0A1222] border border-slate-200 dark:border-[#182642]">
                  {languageTabs.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLang(lang)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedLang === lang
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                      placeholder="Filter repositories..."
                      aria-label="Filter GitHub repositories"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'updated' | 'stars')}
                    aria-label="Sort repositories"
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="stars">Most Starred</option>
                  </select>
                </div>
              </div>
            )}

            {/* Repositories Grid */}
            {filteredRepos.length === 0 ? (
              <div className="p-10 text-center rounded-xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222]">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {githubData.repos.length === 0
                    ? `No public repositories found on @${githubData.profile.login} yet.`
                    : 'No repositories match the selected language or search query.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRepos.map((repo) => (
                  <article
                    key={repo.id}
                    className="p-6 rounded-xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] hover:border-blue-500/60 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-display text-base font-bold text-slate-950 dark:text-white break-words">
                          {repo.name}
                        </h4>
                        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                          {repo.archived ? 'Archived' : repo.fork ? 'Fork' : 'Public'}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
                        {repo.description || 'Repository source code and documentation.'}
                      </p>

                      {repo.topics.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-blue-600 dark:text-blue-400">
                          {repo.topics.slice(0, 4).map((topic, idx) => (
                            <React.Fragment key={topic}>
                              <span>{topic}</span>
                              {idx < Math.min(repo.topics.length, 4) - 1 && (
                                <span aria-hidden="true" className="text-slate-400">
                                  ·
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-200 dark:border-[#182642] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-3">
                          {repo.language && (
                            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{
                                  backgroundColor: LANGUAGE_COLORS[repo.language] || '#3B82F6',
                                }}
                              />
                              {repo.language}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Star className="w-3.5 h-3.5" />
                            {repo.stargazersCount}
                          </span>
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <GitFork className="w-3.5 h-3.5" />
                            {repo.forksCount}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] tabular-nums">
                          {formatDate(repo.pushedAt || repo.updatedAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <span>View Code</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        {repo.homepage && (
                          <a
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
