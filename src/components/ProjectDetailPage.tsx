import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  Pencil,
  X,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem, ProjectScreenshot } from '../types/portfolio';
import { FmcgSchemaAndPreview } from './visuals/FmcgSchemaAndPreview';
import { EoqModelExplorer } from './visuals/EoqModelExplorer';
import { BiDashboardPreview } from './visuals/BiDashboardPreview';
import { MlDecisionExplorer } from './visuals/MlDecisionExplorer';

interface ProjectDetailPageProps {
  project: ProjectItem;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project }) => {
  const { navigate, openEditorAt } = usePortfolio();
  const [lightboxShot, setLightboxShot] = useState<ProjectScreenshot | null>(null);
  const [heroError, setHeroError] = useState(false);

  const implementedFeatures =
    project.featureMatrix?.filter((f) => f.status === 'Implemented') || [];
  const plannedFeatures =
    project.featureMatrix?.filter((f) => f.status === 'Planned') || [];

  return (
    <main className="py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 space-y-14">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#1E2D4A]">
          <button
            type="button"
            onClick={() => navigate('/#projects')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2D4A] text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repository</span>
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2D4A] text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Link</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => openEditorAt('projects')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Project</span>
            </button>
          </div>
        </div>

        {/* Project Hero Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
              Project {project.number}
            </span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.statusLabel}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight text-balance max-w-4xl">
            {project.title}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            {project.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">Technologies:</span>
            {project.technologies.map((tech, idx) => (
              <React.Fragment key={tech}>
                <span className="font-mono text-blue-600 dark:text-blue-400">{tech}</span>
                {idx < project.technologies.length - 1 && <span aria-hidden="true">/</span>}
              </React.Fragment>
            ))}
          </div>
        </header>

        {/* Project Overview + Primary Visual */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              Project Overview
            </h2>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {project.overview}
            </p>
          </div>

          <div className="lg:col-span-7">
            {project.heroImageUrl && !heroError ? (
              <figure className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324]">
                <img
                  src={project.heroImageUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  onError={() => setHeroError(true)}
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-[#1E2D4A]">
                  System &amp; Conceptual Architecture Overview — {project.title}
                </figcaption>
              </figure>
            ) : project.visualType === 'eoq' ? (
              <EoqModelExplorer />
            ) : project.visualType === 'bi' ? (
              <BiDashboardPreview />
            ) : project.visualType === 'ml' ? (
              <MlDecisionExplorer />
            ) : null}
          </div>
        </section>

        {/* Interactive Visual Explorer for non-hero cases if needed */}
        {project.visualType === 'fmcg' && project.problemAreas && project.coreModules && (
          <>
            {/* Problem Areas & Core Modules */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-[#1E2D4A]">
              <div className="p-6 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324]">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Domain Challenges Addressed
                </p>
                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white mt-1 mb-4">
                  FMCG Problem Areas
                </h2>
                <ul className="space-y-2.5">
                  {project.problemAreas.map((area, idx) => (
                    <li
                      key={area}
                      className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="font-mono text-xs text-blue-600 dark:text-blue-400 mt-0.5 tabular-nums">
                        0{idx + 1}
                      </span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324]">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Modular Software Scope
                </p>
                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white mt-1 mb-4">
                  Core System Modules
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.coreModules.map((mod, idx) => (
                    <div
                      key={mod}
                      className="p-3 rounded-lg border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19]"
                    >
                      <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                        Module 0{idx + 1}
                      </span>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                        {mod}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* System Architecture Layers */}
            {project.architectureLayers && (
              <section className="pt-8 border-t border-slate-200 dark:border-[#1E2D4A]">
                <div className="mb-6">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    System Architecture
                  </p>
                  <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white mt-1">
                    Layered Software &amp; Data Architecture
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {project.architectureLayers.map((layer, idx) => (
                    <div
                      key={layer.layer}
                      className="p-5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324]"
                    >
                      <span className="font-mono text-xs text-blue-600 dark:text-blue-400 tabular-nums">
                        Layer 0{idx + 1}
                      </span>
                      <h3 className="font-display text-base font-bold text-slate-950 dark:text-white mt-1">
                        {layer.layer}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                        {layer.component}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                        {layer.responsibility}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Database Design & ER Schema Explorer + Dashboard Interface Preview */}
            {project.databaseTables && (
              <section className="pt-8 border-t border-slate-200 dark:border-[#1E2D4A]">
                <div className="mb-6">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Database Design &amp; Interface Structure
                  </p>
                  <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white mt-1">
                    PostgreSQL Schema, ER Relationships &amp; Dashboard View
                  </h2>
                </div>
                <FmcgSchemaAndPreview tables={project.databaseTables} />
              </section>
            )}

            {/* Implemented vs Planned Features (Strictly Separated) */}
            {project.featureMatrix && (
              <section className="pt-8 border-t border-slate-200 dark:border-[#1E2D4A]">
                <div className="mb-6">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Transparent Engineering Roadmap
                  </p>
                  <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white mt-1">
                    Implemented vs. Planned Features
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Clear distinction between components already built/designed and modules scheduled for future development.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324]">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200 dark:border-[#1E2D4A]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                        Implemented Features ({implementedFeatures.length})
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {implementedFeatures.map((feat) => (
                        <div key={feat.name}>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {feat.name}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                            {feat.module}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {feat.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324]">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200 dark:border-[#1E2D4A]">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                        Planned Features ({plannedFeatures.length})
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {plannedFeatures.map((feat) => (
                        <div key={feat.name}>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {feat.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {feat.module} · Planned Milestone
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {feat.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* Methodology Steps for Modelling / BI / ML / Custom Projects */}
        {project.methodologySteps && project.methodologySteps.length > 0 && (
          <section className="pt-8 border-t border-slate-200 dark:border-[#1E2D4A]">
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white mb-6">
              Analytical &amp; Technical Methodology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {project.methodologySteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324]"
                >
                  <span className="font-mono text-xs text-blue-600 dark:text-blue-400 tabular-nums">
                    Step 0{idx + 1}
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-200 mt-2 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Learning Outcomes */}
        <section className="pt-8 border-t border-slate-200 dark:border-[#1E2D4A]">
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white mb-5">
            My Learning Outcomes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.learningOutcomes.map((outcome, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] flex items-start gap-3"
              >
                <span className="font-mono text-xs text-blue-600 dark:text-blue-400 mt-0.5 tabular-nums">
                  0{idx + 1}
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {outcome}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Project Screenshots Gallery */}
        {project.screenshots.length > 0 && (
          <section className="pt-8 border-t border-slate-200 dark:border-[#1E2D4A]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                Project Screenshots &amp; Diagrams
              </h2>
              <button
                type="button"
                onClick={() => openEditorAt('projects')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Upload / Edit Screenshots
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.screenshots.map((shot) => (
                <button
                  key={shot.id}
                  type="button"
                  onClick={() => setLightboxShot(shot)}
                  className="text-left rounded-xl overflow-hidden border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <img
                    src={shot.imageUrl}
                    alt={shot.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {shot.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {shot.caption}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxShot && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightboxShot(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxShot.title}
        >
          <div
            className="max-w-5xl w-full bg-[#0B1324] border border-[#1E2D4A] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E2D4A]">
              <div>
                <p className="text-sm font-semibold text-white">{lightboxShot.title}</p>
                <p className="text-xs text-slate-400">{lightboxShot.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxShot(null)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label="Close image viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-[#070D19] flex justify-center">
              <img
                src={lightboxShot.imageUrl}
                alt={lightboxShot.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
