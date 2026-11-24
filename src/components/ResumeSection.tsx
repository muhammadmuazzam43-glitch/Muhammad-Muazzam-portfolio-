import React, { useRef, useState } from 'react';
import { Download, Eye, FileText, Upload, X, Printer } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ResumeSection: React.FC = () => {
  const { data, updateData } = usePortfolio();
  const { profile, education, skills, projects } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setUploadFeedback('Please upload a PDF file smaller than 4 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            uploadedCvName: file.name,
            uploadedCvDataUrl: reader.result as string,
            uploadedCvUpdatedAt: new Date().toLocaleDateString(),
          },
        }));
        setUploadFeedback(`Uploaded "${file.name}" successfully.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadCv = () => {
    if (profile.uploadedCvDataUrl && profile.uploadedCvName) {
      const link = document.createElement('a');
      link.href = profile.uploadedCvDataUrl;
      link.download = profile.uploadedCvName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Generate clean printable ATS-structured HTML CV from verified portfolio fields only
    const htmlContent = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${profile.name} — Curriculum Vitae</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; max-width: 820px; margin: 36px auto; padding: 0 24px; line-height: 1.55; }
  h1 { margin: 0 0 4px; font-size: 26px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.06em; color: #1d4ed8; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin: 22px 0 10px; }
  p, li { font-size: 13px; margin: 4px 0; }
  .meta { font-size: 13px; color: #475569; margin-bottom: 12px; }
</style>
</head>
<body>
  <h1>${profile.name}</h1>
  <div class="meta">${profile.roleLine}</div>
  <div class="meta">${profile.location} · ${profile.email} · ${profile.linkedinUrl} · ${profile.githubUrl}</div>

  <h2>Career Vision</h2>
  <p>${profile.careerVision}</p>

  <h2>Education</h2>
  <p><strong>${education.degree}</strong> — ${education.institution}, ${education.department} (${education.location})</p>
  <p>Status: ${education.period} · ${education.semester}</p>
  <p><strong>Coursework:</strong> ${education.relevantCoursework.join(', ')}</p>

  <h2>Technical Skills</h2>
  ${skills.map((s) => `<p><strong>${s.title}:</strong> ${s.skills.join(', ')}</p>`).join('\n  ')}

  <h2>Selected Projects</h2>
  ${projects
    .map(
      (p) =>
        `<p><strong>${p.title}</strong> (${p.category})<br/>${p.summary}<br/><em>Tools:</em> ${p.technologies.join(', ')}</p>`
    )
    .join('\n  ')}

  <h2>Academic &amp; Professional Goals</h2>
  <ul>${profile.goals.map((g) => `<li>${g}</li>`).join('')}</ul>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, '_')}_CV.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="resume"
      className="py-16 lg:py-24 border-b border-slate-200 dark:border-[#182642]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                09. Curriculum Vitae
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                Resume &amp; Academic CV
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Download my structured academic and technical CV containing verified coursework, database &amp; analytics skills, and documented project work—or upload a custom PDF CV version directly below.
              </p>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  {profile.uploadedCvName
                    ? `Uploaded CV active: ${profile.uploadedCvName} (updated ${profile.uploadedCvUpdatedAt})`
                    : 'Using structured academic CV generated strictly from verified portfolio records (no fabricated employment).'}
                </span>
              </div>

              {uploadFeedback && (
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {uploadFeedback}
                </p>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <button
                type="button"
                onClick={handleDownloadCv}
                className="w-full sm:w-auto lg:w-72 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {profile.uploadedCvName ? 'Download Uploaded CV' : 'Download Structured CV'}
                </span>
              </button>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto lg:w-72">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview CV</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload PDF CV</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleCvUpload}
                className="hidden"
                aria-label="Upload PDF CV"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Structured CV Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Structured CV Preview"
        >
          <div
            className="max-w-3xl w-full max-h-[88vh] overflow-y-auto rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between no-print">
              <p className="text-sm font-semibold">Structured CV Preview — {profile.name}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                  aria-label="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 text-sm">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-display text-2xl font-bold text-slate-950">{profile.name}</h3>
                <p className="text-slate-700 mt-1">{profile.roleLine}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {profile.location} · {profile.email}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                  Career Vision
                </h4>
                <p className="text-slate-700 leading-relaxed">{profile.careerVision}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                  Education
                </h4>
                <p className="font-semibold text-slate-900">
                  {education.degree} — {education.institution}
                </p>
                <p className="text-slate-600">
                  {education.department} · {education.location} · {education.semester}
                </p>
                <p className="text-slate-600 mt-1">
                  <strong>Coursework:</strong> {education.relevantCoursework.join(', ')}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                  Technical Skills
                </h4>
                <div className="space-y-1.5">
                  {skills.map((group) => (
                    <p key={group.id} className="text-slate-700">
                      <strong className="text-slate-900">{group.title}:</strong>{' '}
                      {group.skills.join(', ')}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                  Projects &amp; Independent Work
                </h4>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p.id}>
                      <p className="font-semibold text-slate-900">
                        {p.title} ({p.category})
                      </p>
                      <p className="text-slate-600">{p.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
