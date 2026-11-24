import React from 'react';
import { Award, CheckCircle2, ExternalLink, Pencil } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ExperienceAndAchievements: React.FC = () => {
  const { data, openEditorAt } = usePortfolio();

  return (
    <>
      {/* Achievements & Certifications Section */}
      <section
        id="achievements"
        className="py-16 lg:py-24 border-b border-slate-200 dark:border-[#182642] bg-slate-50/70 dark:bg-[#070F1E]"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                06. Verified Milestones &amp; Credentials
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white mt-1.5">
                Achievements &amp; Certifications
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                Verified academic milestones and project progress. Reserved placeholders mark where completed certificates, workshops, or seminar credentials can be added cleanly.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openEditorAt('achievements')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-500/60 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Manage Credentials</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.achievements.map((item) => (
              <div
                key={item.id}
                className={`p-6 rounded-xl border ${
                  item.isPlaceholder
                    ? 'border-dashed border-slate-300 dark:border-[#182642] bg-white/60 dark:bg-[#0A1222]/50'
                    : 'border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {item.verified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-3.5 h-3.5 text-slate-400" />
                        <span>Placeholder Slot</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>{item.date}</span>
                  </span>
                </div>

                <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white mt-3">
                  {item.title}
                </h3>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {item.issuer}
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {item.description}
                </p>

                {item.credentialUrl && (
                  <a
                    href={item.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 mt-4 hover:underline"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Learning & Experience Timeline (Truthful, Zero Fake Employment) */}
      <section
        id="experience"
        className="py-16 lg:py-24 border-b border-slate-200 dark:border-[#182642]"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              07. Practical Development &amp; Learning
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white mt-1.5">
              Academic Projects &amp; Technical Experience
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              An honest timeline of independent software engineering, mathematical research, and hands-on technical experimentation.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-[#182642] border-t border-b border-slate-200 dark:border-[#182642]">
            {data.timeline.map((item) => (
              <div
                key={item.id}
                className="py-7 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start"
              >
                <div className="lg:col-span-4">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {item.type}
                  </p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                    {item.period} · {item.context}
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                    {item.focusAreas.map((area, idx) => (
                      <React.Fragment key={area}>
                        <span>{area}</span>
                        {idx < item.focusAreas.length - 1 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
