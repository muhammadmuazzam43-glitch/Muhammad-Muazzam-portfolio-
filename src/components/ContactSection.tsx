import React, { useState } from 'react';
import { Check, Copy, Github, Linkedin, Mail, Send } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const ContactSection: React.FC = () => {
  const { data, navigate } = usePortfolio();
  const { profile } = data;
  const hasConnectedGithub = Boolean(profile.githubUsername?.trim());

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (subject.trim().length < 3) next.subject = 'Please provide a brief subject.';
    if (message.trim().length < 15) {
      next.message = 'Please enter a message (at least 15 characters).';
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState(null);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        if (payload.errors) {
          setErrors(payload.errors);
        }
        setSubmitState({
          type: 'error',
          text: 'Please review the highlighted fields and try again.',
        });
        return;
      }

      setSubmitState({
        type: 'success',
        text: `Inquiry validated and recorded (Reference ${payload.id}). For direct inbox delivery, you can also send via your email client below.`,
      });
      setName('');
      setEmail('');
      setOrganization('');
      setSubject('');
      setMessage('');
      setErrors({});
    } catch {
      setSubmitState({
        type: 'error',
        text: 'Unable to reach the submission endpoint right now. Please use the direct email link alongside this form.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const mailtoHref = `mailto:${encodeURIComponent(profile.email)}?subject=${encodeURIComponent(
    subject || 'Portfolio Inquiry'
  )}&body=${encodeURIComponent(
    `Name: ${name}\nOrganization: ${organization}\n\n${message}`
  )}`;

  return (
    <section id="contact" className="py-16 lg:py-24 bg-slate-50/70 dark:bg-[#070F1E]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                10. Connect &amp; Collaborate
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white mt-1.5">
                Contact &amp; Professional Network
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {profile.contactPrompt}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Direct Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-mono text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block mt-0.5"
                  >
                    {profile.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#182642] text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] flex items-center justify-between gap-3 hover:border-blue-500/60 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">LinkedIn</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate mt-0.5">
                    {profile.linkedinUrl}
                  </p>
                </div>
                <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              </a>

              {hasConnectedGithub ? (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] flex items-center justify-between gap-3 hover:border-blue-500/60 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">GitHub</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate mt-0.5">
                      @{profile.githubUsername} · {profile.githubUrl}
                    </p>
                  </div>
                  <Github className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('#github')}
                  className="w-full text-left p-4 rounded-xl border border-dashed border-slate-300 dark:border-[#182642] bg-white dark:bg-[#0A1222] flex items-center justify-between gap-3 hover:border-blue-500/60 transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">GitHub</p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                      Connect your GitHub username to display live repositories
                    </p>
                  </div>
                  <Github className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Inquiries are validated server-side via Express (<span className="font-mono">/api/contact</span>).
            </p>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#182642] bg-white dark:bg-[#0A1222] space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. / Mr. / Ms. Name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-org"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Organization / University (Optional)
                  </label>
                  <input
                    id="contact-org"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Company or Academic Dept."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Internship, Collaboration, or Project"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  {errors.subject && (
                    <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details regarding opportunities, research, or questions about my projects..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#070D19] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-y"
                />
                {errors.message && (
                  <p className="text-xs text-rose-500 mt-1">{errors.message}</p>
                )}
              </div>

              {submitState && (
                <div
                  role="status"
                  className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                    submitState.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {submitState.text}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Send Message'}</span>
                </button>

                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open in Email Client Instead</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
