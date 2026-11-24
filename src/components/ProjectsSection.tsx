import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Plus, Search } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCategory } from '../types/portfolio';
import { EoqModelExplorer } from './visuals/EoqModelExplorer';
import { BiDashboardPreview } from './visuals/BiDashboardPreview';
import { MlDecisionExplorer } from './visuals/MlDecisionExplorer';

const CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Systems & SQL',
  'Mathematics',
  'Analytics',
  'Machine Learning',
];

export const ProjectsSection: React.FC = () => {
  const { data, navigate, openEditorAt } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | ProjectCategory>('All');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.projects.filter((project) => {
      const matchesCat = activeCategory === 'All' || project.category === activeCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      const haystack = [
        project.title,
        project.subtitle,
        project.summary,
        project.category,
        ...project.technologies,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data.projects, searchQuery, activeCategory]);

  return (
    <section id="projects" className="py-16 lg:py-24 border-b border-slate-200 dark:border-[#182642]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              03. Selected &amp; Ongoing Work
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white mt-1.5">
              Featured Projects
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              Case studies across database architecture, applied mathematical optimization, business intelligence, and statistical learning.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openEditorAt('projects')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add / Manage Projects</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0A1222] border border-slate-200 dark:border-[#182642]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or tools..."
              aria-label="Search projects"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222]">
            <p className="text-base font-medium text-slate-900 dark:text-white">
              No projects matched “{searchQuery}”.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => {
              const isFlagship = index === 0 && activeCategory === 'All' && !searchQuery;
              return (
                <article
                  key={project.id}
                  className={`rounded-2xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] overflow-hidden flex flex-col justify-between transition-colors hover:border-blue-500/60 ${
                    isFlagship ? 'lg:col-span-2' : ''
                  }`}
                >
                  <div className={`grid grid-cols-1 ${isFlagship ? 'lg:grid-cols-12' : ''} gap-0`}>
                    {/* Visual Preview Slot */}
                    <div
                      className={`${
                        isFlagship ? 'lg:col-span-6' : ''
                      } bg-slate-50 dark:bg-[#050B16] border-b ${
                        isFlagship ? 'lg:border-b-0 lg:border-r' : ''
                      } border-slate-200 dark:border-[#182642] p-4 flex items-center justify-center`}
                    >
                      {project.heroImageUrl && !brokenImages[project.id] ? (
                        <img
                          src={project.heroImageUrl}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setBrokenImages((prev) => ({ ...prev, [project.id]: true }))
                          }
                          className="w-full h-full max-h-80 object-cover rounded-lg border border-slate-200 dark:border-[#182642]"
                        />
                      ) : project.visualType === 'eoq' ? (
                        <div className="w-full">
                          <EoqModelExplorer compact />
                        </div>
                      ) : project.visualType === 'bi' ? (
                        <div className="w-full">
                          <BiDashboardPreview compact />
                        </div>
                      ) : project.visualType === 'ml' ? (
                        <div className="w-full">
                          <MlDecisionExplorer compact />
                        </div>
                      ) : (
                        <div className="w-full h-56 rounded-lg bg-gradient-to-br from-[#0A1222] to-[#111C33] border border-[#182642] flex flex-col items-center justify-center p-6 text-center">
                          <span className="font-mono text-xs text-blue-400">
                            Project {project.number}
                          </span>
                          <p className="font-display text-lg font-semibold text-white mt-2">
                            {project.title}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Details Slot */}
                    <div
                      className={`${
                        isFlagship ? 'lg:col-span-6' : ''
                      } p-6 sm:p-8 flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                            Project {project.number}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{project.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{project.statusLabel}</span>
                        </div>

                        <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mt-3 leading-snug">
                          {project.title}
                        </h3>

                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                          {project.summary}
                        </p>

                        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-[#1E2D4A] flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          {project.technologies.map((tech, tIdx) => (
                            <React.Fragment key={tech}>
                              <span className="font-mono text-slate-700 dark:text-slate-300">
                                {tech}
                              </span>
                              {tIdx < project.technologies.length - 1 && (
                                <span aria-hidden="true">/</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/projects/${project.slug}`)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
                        >
                          <span>View Full Project Details</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
