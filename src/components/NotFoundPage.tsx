import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const NotFoundPage: React.FC = () => {
  const { navigate } = usePortfolio();

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full text-center space-y-5 p-8 rounded-2xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324]">
        <p className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
          404 · Route Not Found
        </p>
        <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
          This page could not be located.
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The URL you navigated to does not match an active section or project case study in this portfolio.
        </p>
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/#projects')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Explore Projects</span>
          </button>
        </div>
      </div>
    </main>
  );
};
