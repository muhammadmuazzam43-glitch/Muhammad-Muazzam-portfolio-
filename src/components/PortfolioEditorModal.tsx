import React, { useEffect, useState } from 'react';
import { Download, Plus, RotateCcw, Trash2, Upload, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PERMANENT_PORTRAIT_URL } from '../data/defaultPortfolio';
import { AchievementItem, ProjectCategory, ProjectItem } from '../types/portfolio';

export const PortfolioEditorModal: React.FC = () => {
  const {
    data,
    updateData,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
    isEditorOpen,
    setIsEditorOpen,
    editorInitialTab,
    connectGithubAccount,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<string>(editorInitialTab);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    data.projects[0]?.id || ''
  );
  const [githubDraft, setGithubDraft] = useState(
    data.profile.githubUsername || data.profile.githubUrl || ''
  );
  const [githubSyncMsg, setGithubSyncMsg] = useState<string | null>(null);

  // New project form state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjSubtitle, setNewProjSubtitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState<ProjectCategory>('Analytics');
  const [newProjSummary, setNewProjSummary] = useState('');
  const [newProjTools, setNewProjTools] = useState('Python, SQL, Excel');

  useEffect(() => {
    setActiveTab(editorInitialTab);
    setGithubDraft(data.profile.githubUsername || '');
    setGithubSyncMsg(null);
  }, [editorInitialTab, isEditorOpen, data.profile.githubUsername]);

  if (!isEditorOpen) return null;

  const selectedProject = data.projects.find((p) => p.id === selectedProjectId) || data.projects[0];

  const handleImageFileUpload = (
    file: File | undefined,
    onLoaded: (dataUrl: string) => void
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLoaded(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;
    const num = String(data.projects.length + 1).padStart(2, '0');
    const slug = newProjTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const created: ProjectItem = {
      id: `proj-${Date.now()}`,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      number: num,
      title: newProjTitle.trim(),
      subtitle: newProjSubtitle.trim() || 'Applied Technical Case Study',
      category: newProjCategory,
      statusLabel: 'Active Portfolio Project',
      summary: newProjSummary.trim() || 'Project summary editable in Portfolio Editor.',
      overview: newProjSummary.trim() || 'Full overview editable in Portfolio Editor.',
      visualType: 'custom',
      technologies: newProjTools
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      learningOutcomes: ['Documented technical and mathematical learnings from this project.'],
      methodologySteps: ['Define problem scope, structure dataset/model, and evaluate results.'],
      screenshots: [],
    };

    addProject(created);
    setSelectedProjectId(created.id);
    setNewProjTitle('');
    setNewProjSubtitle('');
    setNewProjSummary('');
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'muhammad_muazzam_portfolio_backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddAchievement = () => {
    const item: AchievementItem = {
      id: `ach-${Date.now()}`,
      category: 'Technical Certification',
      title: 'New Verified Achievement or Certification',
      issuer: 'Issuing Institution',
      date: '2026',
      description: 'Describe verified scope and key takeaways.',
      verified: true,
      isPlaceholder: false,
    };
    updateData((prev) => ({
      ...prev,
      achievements: [item, ...prev.achievements],
    }));
  };

  const handleSyncGithub = async () => {
    if (!githubDraft.trim()) return;
    setGithubSyncMsg('Syncing...');
    const ok = await connectGithubAccount(githubDraft);
    setGithubSyncMsg(
      ok ? 'Connected and synced live GitHub repositories.' : 'Could not verify GitHub username.'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
      onClick={() => setIsEditorOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio Content Editor"
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#182642] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">Portfolio Content Editor</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Changes save automatically. Your uploaded portrait photo stays preserved across sessions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#182642] text-xs font-medium hover:border-blue-500 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={() => resetToDefaults()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#182642] text-xs font-medium text-rose-500 hover:border-rose-500 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              aria-label="Close editor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-2.5 border-b border-slate-200 dark:border-[#182642] flex flex-wrap gap-1.5 bg-slate-50 dark:bg-[#050B16]">
          {[
            { id: 'profile', label: 'Profile, GitHub & Photo' },
            { id: 'about', label: 'About & Goals' },
            { id: 'skills', label: 'Skills' },
            { id: 'projects', label: 'Projects & Screenshots' },
            { id: 'education', label: 'Education' },
            { id: 'achievements', label: 'Achievements' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={data.profile.name}
                    onChange={(e) =>
                      updateData((p) => ({ ...p, profile: { ...p.profile, name: e.target.value } }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#182642] bg-slate-50 dark:bg-[#050B16] text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Location
                  </span>
                  <input
                    type="text"
                    value={data.profile.location}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        profile: { ...p.profile, location: e.target.value },
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#182642] bg-slate-50 dark:bg-[#050B16] text-sm"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Tagline
                </span>
                <input
                  type="text"
                  value={data.profile.tagline}
                  onChange={(e) =>
                    updateData((p) => ({
                      ...p,
                      profile: { ...p.profile, tagline: e.target.value },
                    }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#182642] bg-slate-50 dark:bg-[#050B16] text-sm"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Hero Introduction
                </span>
                <textarea
                  rows={3}
                  value={data.profile.heroIntro}
                  onChange={(e) =>
                    updateData((p) => ({
                      ...p,
                      profile: { ...p.profile, heroIntro: e.target.value },
                    }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#182642] bg-slate-50 dark:bg-[#050B16] text-sm"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Email
                  </span>
                  <input
                    type="email"
                    value={data.profile.email}
                    onChange={(e) =>
                      updateData((p) => ({ ...p, profile: { ...p.profile, email: e.target.value } }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#182642] bg-slate-50 dark:bg-[#050B16] text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    LinkedIn URL
                  </span>
                  <input
                    type="url"
                    value={data.profile.linkedinUrl}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        profile: { ...p.profile, linkedinUrl: e.target.value },
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#182642] bg-slate-50 dark:bg-[#050B16] text-sm"
                  />
                </label>
              </div>

              {/* GitHub Integration Sync */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#182642] bg-slate-50 dark:bg-[#050B16] space-y-2.5">
                <p className="text-xs font-semibold">Connected GitHub Account</p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={githubDraft}
                    onChange={(e) => setGithubDraft(e.target.value)}
                    placeholder="GitHub username or https://github.com/username"
                    className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-slate-300 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleSyncGithub}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium cursor-pointer"
                  >
                    Connect &amp; Sync
                  </button>
                </div>
                {githubSyncMsg && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">{githubSyncMsg}</p>
                )}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#182642] bg-slate-50 dark:bg-[#050B16] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold">Profile Portrait Photograph</p>
                  <button
                    type="button"
                    onClick={() =>
                      updateData((p) => ({
                        ...p,
                        profile: {
                          ...p.profile,
                          portraitUrl: PERMANENT_PORTRAIT_URL,
                          portraitIsPlaceholder: false,
                        },
                      }))
                    }
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Use My Saved Portrait
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e.target.files?.[0], (url) =>
                          updateData((p) => ({
                            ...p,
                            profile: {
                              ...p.profile,
                              portraitUrl: url,
                              portraitIsPlaceholder: false,
                            },
                          }))
                        )
                      }
                    />
                  </label>
                  <input
                    type="text"
                    value={data.profile.portraitUrl}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        profile: {
                          ...p.profile,
                          portraitUrl: e.target.value,
                          portraitIsPlaceholder: false,
                        },
                      }))
                    }
                    placeholder="Or paste an image URL"
                    className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-slate-300 dark:border-[#182642] bg-white dark:bg-[#0A1222] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Career Vision
                </span>
                <textarea
                  rows={2}
                  value={data.profile.careerVision}
                  onChange={(e) =>
                    updateData((p) => ({
                      ...p,
                      profile: { ...p.profile, careerVision: e.target.value },
                    }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  About Me Paragraphs (separate paragraphs with a blank line)
                </span>
                <textarea
                  rows={10}
                  value={data.profile.aboutParagraphs.join('\n\n')}
                  onChange={(e) =>
                    updateData((p) => ({
                      ...p,
                      profile: {
                        ...p.profile,
                        aboutParagraphs: e.target.value
                          .split(/\n\s*\n/)
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm leading-relaxed"
                />
              </label>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.skills.map((group) => (
                <div
                  key={group.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] space-y-2"
                >
                  <p className="text-sm font-semibold">{group.title}</p>
                  <textarea
                    rows={3}
                    value={group.skills.join('\n')}
                    onChange={(e) => {
                      const nextSkills = e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean);
                      updateData((prev) => ({
                        ...prev,
                        skills: prev.skills.map((g) =>
                          g.id === group.id ? { ...g, skills: nextSkills } : g
                        ),
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500">One skill per line</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Add New Project Form */}
              <form
                onSubmit={handleCreateProject}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] space-y-3"
              >
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Add New Project
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    placeholder="Project Title"
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] text-xs"
                  />
                  <input
                    type="text"
                    value={newProjSubtitle}
                    onChange={(e) => setNewProjSubtitle(e.target.value)}
                    placeholder="Short Subtitle"
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] text-xs"
                  />
                  <select
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value as ProjectCategory)}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] text-xs"
                  >
                    <option value="Systems & SQL">Systems &amp; SQL</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Machine Learning">Machine Learning</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={newProjSummary}
                  onChange={(e) => setNewProjSummary(e.target.value)}
                  placeholder="Project summary and goals..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] text-xs"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <input
                    type="text"
                    value={newProjTools}
                    onChange={(e) => setNewProjTools(e.target.value)}
                    placeholder="Tools (comma-separated)"
                    className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] text-xs"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>
              </form>

              {/* Edit Existing Project */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <select
                    value={selectedProject?.id || ''}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm font-medium"
                  >
                    {data.projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        Project {p.number}: {p.title}
                      </option>
                    ))}
                  </select>

                  {selectedProject && data.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteProject(selectedProject.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-500 text-xs font-medium hover:bg-rose-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Selected Project</span>
                    </button>
                  )}
                </div>

                {selectedProject && (
                  <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-[#1E2D4A]">
                    <input
                      type="text"
                      value={selectedProject.title}
                      onChange={(e) =>
                        updateProject(selectedProject.id, {
                          ...selectedProject,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm font-semibold"
                    />
                    <textarea
                      rows={3}
                      value={selectedProject.overview}
                      onChange={(e) =>
                        updateProject(selectedProject.id, {
                          ...selectedProject,
                          overview: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-xs leading-relaxed"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="url"
                        value={selectedProject.githubUrl || ''}
                        onChange={(e) =>
                          updateProject(selectedProject.id, {
                            ...selectedProject,
                            githubUrl: e.target.value,
                          })
                        }
                        placeholder="GitHub Repository URL (optional)"
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-xs"
                      />
                      <input
                        type="url"
                        value={selectedProject.liveDemoUrl || ''}
                        onChange={(e) =>
                          updateProject(selectedProject.id, {
                            ...selectedProject,
                            liveDemoUrl: e.target.value,
                          })
                        }
                        placeholder="Live Demo / Documentation URL (optional)"
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-xs"
                      />
                    </div>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] text-xs font-medium cursor-pointer hover:border-blue-500">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Screenshot to Project</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e.target.files?.[0], (url) =>
                              updateProject(selectedProject.id, {
                                ...selectedProject,
                                heroImageUrl: selectedProject.heroImageUrl || url,
                                screenshots: [
                                  ...selectedProject.screenshots,
                                  {
                                    id: `shot-${Date.now()}`,
                                    title: 'Uploaded Project Screenshot',
                                    caption: 'Real application screenshot uploaded by author.',
                                    imageUrl: url,
                                  },
                                ],
                              })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Current Semester
                  </span>
                  <input
                    type="text"
                    value={data.education.semester}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        education: { ...p.education, semester: e.target.value },
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Program Period
                  </span>
                  <input
                    type="text"
                    value={data.education.period}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        education: { ...p.education, period: e.target.value },
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm"
                  />
                </label>
              </div>

              {(
                [
                  { key: 'relevantCoursework', label: 'Relevant Coursework (one per line)' },
                  { key: 'academicProjects', label: 'Academic Projects (one per line)' },
                  { key: 'researchInterests', label: 'Research Interests (one per line)' },
                  { key: 'academicAchievements', label: 'Academic Achievements (one per line)' },
                ] as const
              ).map((field) => (
                <label key={field.key} className="block">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {field.label}
                  </span>
                  <textarea
                    rows={3}
                    value={data.education[field.key].join('\n')}
                    onChange={(e) =>
                      updateData((p) => ({
                        ...p,
                        education: {
                          ...p.education,
                          [field.key]: e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        },
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-xs"
                  />
                </label>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddAchievement}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Verified Achievement</span>
                </button>
              </div>
              {data.achievements.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          achievements: p.achievements.map((a) =>
                            a.id === item.id
                              ? { ...a, title: e.target.value, isPlaceholder: false }
                              : a
                          ),
                        }))
                      }
                      className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] text-xs font-semibold"
                    />
                    <label className="inline-flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={item.verified}
                        onChange={(e) =>
                          updateData((p) => ({
                            ...p,
                            achievements: p.achievements.map((a) =>
                              a.id === item.id
                                ? { ...a, verified: e.target.checked, isPlaceholder: !e.target.checked }
                                : a
                            ),
                          }))
                        }
                      />
                      <span>Verified</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.issuer}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          achievements: p.achievements.map((a) =>
                            a.id === item.id ? { ...a, issuer: e.target.value } : a
                          ),
                        }))
                      }
                      placeholder="Issuer"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] text-xs"
                    />
                    <input
                      type="url"
                      value={item.credentialUrl || ''}
                      onChange={(e) =>
                        updateData((p) => ({
                          ...p,
                          achievements: p.achievements.map((a) =>
                            a.id === item.id ? { ...a, credentialUrl: e.target.value } : a
                          ),
                        }))
                      }
                      placeholder="Credential URL (optional)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#0B1324] text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
