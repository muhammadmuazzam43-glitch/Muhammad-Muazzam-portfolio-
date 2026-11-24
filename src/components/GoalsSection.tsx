import React from 'react';
import { Compass } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const GoalsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { profile } = data;

  return (
    <section
      id="goals"
      className="py-16 lg:py-24 border-b border-slate-200 dark:border-[#182642] bg-slate-50/70 dark:bg-[#070F1E]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Compass className="w-4 h-4" />
              <span>08. Professional Trajectory</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              {profile.goalsTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              My long-term roadmap connects quantitative mathematical training with practical data science, artificial intelligence, and robust software engineering.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.goals.map((goal, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] flex items-start gap-4"
              >
                <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 tabular-nums shrink-0">
                  0{idx + 1}
                </span>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {goal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
