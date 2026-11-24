import React from 'react';
import { Pencil } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AboutSection: React.FC = () => {
  const { data, openEditorAt } = usePortfolio();
  const { profile } = data;

  return (
    <section id="about" className="py-16 lg:py-24 border-b border-slate-200 dark:border-[#182642]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                01. My Professional Story
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white mt-1.5">
                About Me
              </h2>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222]">
              <p className="font-mono text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Career Vision
              </p>
              <p className="font-serif-editorial italic mt-2.5 text-base text-slate-800 dark:text-slate-100 leading-relaxed">
                “{profile.careerVision}”
              </p>
            </div>

            <button
              type="button"
              onClick={() => openEditorAt('about')}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit About Story</span>
            </button>
          </div>

          <div className="lg:col-span-8 space-y-5">
            {profile.aboutParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base text-slate-700 dark:text-slate-300 leading-[1.8]"
              >
                {paragraph}
              </p>
            ))}

            <div className="pt-8 mt-8 border-t border-slate-200 dark:border-[#182642] grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Mathematical Rigour
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white mt-1.5 leading-relaxed">
                  First-principles reasoning and structured problem decomposition
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Systems Thinking
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white mt-1.5 leading-relaxed">
                  Normalized relational schemas, data integrity, and operational logic
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Continuous Learning
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white mt-1.5 leading-relaxed">
                  Bridging academic mathematics with analytics, BI, and machine learning
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
