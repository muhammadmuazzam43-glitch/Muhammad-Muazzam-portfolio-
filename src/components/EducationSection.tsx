import React from 'react';
import { GraduationCap, Pencil } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const EducationSection: React.FC = () => {
  const { data, openEditorAt } = usePortfolio();
  const { education } = data;

  return (
    <section
      id="education"
      className="py-16 lg:py-24 border-b border-slate-200 dark:border-[#182642]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              05. Academic Journey
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white mt-1.5">
              Education &amp; Mathematical Training
            </h2>
          </div>

          <button
            type="button"
            onClick={() => openEditorAt('education')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-500/60 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Semester &amp; Coursework</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#182642]">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                  {education.degree}
                </h3>
                <p className="text-base font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                  {education.institution}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {education.department} · {education.location}
                </p>
              </div>
            </div>

            <div className="md:text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">Program Status</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {education.period}
              </p>
              <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-1">
                {education.semester}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">
                Relevant Coursework
              </h4>
              <ul className="space-y-2">
                {education.relevantCoursework.map((course) => (
                  <li
                    key={course}
                    className="text-sm text-slate-600 dark:text-slate-300 py-1.5 border-b border-slate-100 dark:border-[#1E2D4A]/50 last:border-b-0"
                  >
                    {course}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">
                  Academic Projects
                </h4>
                <ul className="space-y-2">
                  {education.academicProjects.map((proj) => (
                    <li key={proj} className="text-sm text-slate-600 dark:text-slate-300">
                      · {proj}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">
                  Research Interests
                </h4>
                <ul className="space-y-2">
                  {education.researchInterests.map((interest) => (
                    <li key={interest} className="text-sm text-slate-600 dark:text-slate-300">
                      · {interest}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">
                  Academic Achievements
                </h4>
                <ul className="space-y-2">
                  {education.academicAchievements.map((ach) => (
                    <li key={ach} className="text-sm text-slate-600 dark:text-slate-300">
                      · {ach}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
