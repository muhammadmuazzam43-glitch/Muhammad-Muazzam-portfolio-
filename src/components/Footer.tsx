import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { data, navigate } = usePortfolio();
  const { profile, education } = data;
  const hasConnectedGithub = Boolean(profile.githubUsername?.trim());

  return (
    <footer className="border-t border-slate-200 dark:border-[#182642] bg-white dark:bg-[#050B16] py-12 no-print">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-200 dark:border-[#182642]">
          <div className="md:col-span-5 space-y-2">
            <p className="font-display text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
              {profile.name}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {education.degree} · {education.institution} (CASPAM). Exploring applied mathematics, database engineering, analytics, and machine learning.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Navigation</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
              {[
                { label: 'About', to: '#about' },
                { label: 'Skills', to: '#skills' },
                { label: 'Projects', to: '#projects' },
                { label: 'GitHub', to: '#github' },
                { label: 'Education', to: '#education' },
                { label: 'Resume', to: '#resume' },
                { label: 'Contact', to: '#contact' },
              ].map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.to);
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Connect</p>
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email Muhammad Muazzam"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              {hasConnectedGithub ? (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('#github')}
                  aria-label="Connect GitHub"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p>{profile.location}</p>
        </div>
      </div>
    </footer>
  );
};
