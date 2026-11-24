import React from 'react';
import { Pencil } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const SkillsSection: React.FC = () => {
  const { data, openEditorAt } = usePortfolio();

  return (
    <section
      id="skills"
      className="py-16 lg:py-24 border-b border-slate-200 dark:border-[#182642] bg-slate-50/70 dark:bg-[#070F1E]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              02. Technical Capabilities
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white mt-1.5">
              Technical Skills &amp; Expertise
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              Core disciplines and technical tools I study and apply across mathematics, relational databases, analytics, and software development.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openEditorAt('skills')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-500/60 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Skills</span>
          </button>
        </div>

        {/* Architectural Specification Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200 dark:border-[#182642] rounded-2xl overflow-hidden bg-white dark:bg-[#0A1222]">
          {data.skills.map((group, idx) => (
            <div
              key={group.id}
              className="p-6 sm:p-7 border-r border-b border-slate-200 dark:border-[#182642] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#182642]">
                  <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                    {group.title}
                  </h3>
                  <span className="font-mono text-xs text-blue-600 dark:text-blue-400 tabular-nums">
                    0{idx + 1}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                  {group.description}
                </p>

                <ul className="mt-5 space-y-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-[#182642]/70 last:border-b-0"
                    >
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
