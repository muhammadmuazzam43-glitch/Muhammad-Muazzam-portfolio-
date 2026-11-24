import React, { useState } from 'react';
import {
  ArrowRight,
  Download,
  Mail,
  Github,
  Linkedin,
  Sun,
  Moon,
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { PERMANENT_PORTRAIT_URL } from '../data/defaultPortfolio';

const MARQUEE_ITEMS = [
  'Mathematical Modelling',
  'PostgreSQL Architecture',
  'FMCG Supply Chain Intelligence',
  'Business Intelligence & Power BI',
  'Statistical Learning',
  'Data Analytics',
];

export const HeroSection: React.FC = () => {
  const { data, theme, toggleTheme, navigate, openEditorAt, githubData } = usePortfolio();
  const [imgError, setImgError] = useState(false);

  const { profile, education } = data;
  const resolvedPortrait =
    !imgError && profile.portraitUrl ? profile.portraitUrl : PERMANENT_PORTRAIT_URL;

  const hasConnectedGithub = Boolean(profile.githubUsername?.trim());

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-[#182642] bg-architectural-grid">
        {/* Subtle top atmospheric electric-blue wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_75%_60%_at_70%_0%,rgba(37,99,235,0.14),transparent)] dark:bg-[radial-gradient(ellipse_75%_60%_at_70%_0%,rgba(37,99,235,0.22),transparent)]"
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-14 lg:pt-14 lg:pb-20">
          {/* Utility Toolbar: Clean Metadata Strip + Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-7 mb-10 border-b border-slate-200/80 dark:border-[#182642]">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <span>{education.degree}</span>
              <span aria-hidden="true">·</span>
              <span>CASPAM</span>
              <span aria-hidden="true">·</span>
              <span>BZU Multan</span>
              <span aria-hidden="true">·</span>
              <span>{profile.location}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#182642] bg-white/90 dark:bg-[#0A1222] text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-blue-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dark Navy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => openEditorAt('profile')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#182642] bg-white/90 dark:bg-[#0A1222] text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Edit Portfolio</span>
              </button>
            </div>
          </div>

          {/* Split-Screen Editorial Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-7 flex flex-col justify-between py-1"
            >
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
                  {profile.roleLine}
                </p>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.04] text-balance">
                  {profile.name}
                </h1>

                <p className="font-serif-editorial italic mt-5 text-xl sm:text-2xl text-slate-800 dark:text-slate-100 leading-snug max-w-2xl text-balance">
                  “{profile.tagline}”
                </p>

                <p className="mt-5 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {profile.heroIntro}
                </p>
              </div>

              <div className="mt-9 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('#projects')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-blue-600/20"
                  >
                    <span>Explore My Projects</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('#resume')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-[#182642] bg-white dark:bg-[#0A1222] hover:border-blue-500 text-slate-900 dark:text-slate-100 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Download Resume</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('#contact')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-[#182642] bg-transparent hover:bg-slate-100 dark:hover:bg-[#0E192E] text-slate-800 dark:text-slate-200 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>Contact Me</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-slate-600 dark:text-slate-400">
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>

                  {hasConnectedGithub ? (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>
                        GitHub (@{profile.githubUsername}
                        {githubData ? ` · ${githubData.profile.publicRepos} repos` : ''})
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('#github')}
                      className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <Github className="w-4 h-4" />
                      <span>Connect GitHub Profile</span>
                    </button>
                  )}

                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-mono text-xs"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Permanent User Portrait Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="lg:col-span-5 flex flex-col"
            >
              <div className="relative flex-1 min-h-[380px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1E335A] bg-[#0B172B] shadow-2xl shadow-blue-950/20">
                <img
                  src={resolvedPortrait}
                  alt={`${profile.name} — Portrait`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-top"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050B16]/95 via-[#050B16]/60 to-transparent px-6 pb-5 pt-14">
                  <p className="font-display text-base font-bold text-white tracking-tight">
                    {profile.name}
                  </p>
                  <p className="text-xs text-blue-200/90 mt-0.5">
                    {education.degree} · CASPAM, Bahauddin Zakariya University
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Full-Width 4-Column Discipline Strip Below Split */}
          <div className="mt-14 pt-8 border-t border-slate-200 dark:border-[#182642] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Academic Foundation
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                BS Mathematics — CASPAM, BZU
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Primary Software Focus
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                FMCG Inventory &amp; PostgreSQL Systems
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Analytical Stack
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                Excel · Power Query · Power BI · SQL
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Modelling &amp; AI Track
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                Mathematical Modelling &amp; ML Concepts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Typographic Section Ribbon */}
      <div
        aria-hidden="true"
        className="border-b border-slate-200 dark:border-[#182642] bg-white dark:bg-[#070F1E] py-3 overflow-hidden select-none"
      >
        <div className="animate-marquee flex items-center gap-8 text-xs font-mono uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              <span className="text-blue-500/60">·</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};
