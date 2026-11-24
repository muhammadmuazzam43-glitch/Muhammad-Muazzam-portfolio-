import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { GitHubSection } from './components/GitHubSection';
import { EducationSection } from './components/EducationSection';
import { ExperienceAndAchievements } from './components/ExperienceAndAchievements';
import { GoalsSection } from './components/GoalsSection';
import { ResumeSection } from './components/ResumeSection';
import { ContactSection } from './components/ContactSection';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { NotFoundPage } from './components/NotFoundPage';
import { PortfolioEditorModal } from './components/PortfolioEditorModal';
import { Footer } from './components/Footer';

const PortfolioRouterView: React.FC = () => {
  const { currentPath, data } = usePortfolio();
  const normalizedPath = currentPath === '/' ? '/' : currentPath.replace(/\/+$/, '');

  if (normalizedPath === '/') {
    return (
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <GitHubSection />
        <EducationSection />
        <ExperienceAndAchievements />
        <GoalsSection />
        <ResumeSection />
        <ContactSection />
      </main>
    );
  }

  if (normalizedPath.startsWith('/projects/')) {
    const slug = normalizedPath.replace('/projects/', '');
    const matchedProject = data.projects.find((p) => p.slug === slug);
    if (matchedProject) {
      return <ProjectDetailPage project={matchedProject} />;
    }
    return <NotFoundPage />;
  }

  return <NotFoundPage />;
};

export default function App() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 dark:bg-[#050B16] dark:text-slate-100 transition-colors duration-200">
        <Navbar />
        <div className="flex-1">
          <PortfolioRouterView />
        </div>
        <Footer />
        <PortfolioEditorModal />
      </div>
    </PortfolioProvider>
  );
}
