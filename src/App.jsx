// App.jsx - Root component and modal orchestrator
//
// I chose to keep all modal state here rather than using a router or global store.
// There are only three modals (contact, case study, article) and they never nest
// in ways that need URL history, so useState at the root keeps things simple.
//
// The heavy modals (ContactModal, CaseStudy, ArticleModal, ThoughtsFab) are
// lazy-loaded with React.lazy. They contain large SVG illustrations, GSAP timelines,
// and syntax highlighting logic that would bloat the initial bundle. The user sees
// the main page sections instantly; modal code only loads on first interaction.

import { useState, useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import BackgroundCanvas from "./components/BackgroundCanvas";
import Navbar from "./components/sections/Navbar";

const ContactModal = lazy(() => import("./components/ContactModal"));
const CaseStudy = lazy(() => import("./components/CaseStudy"));
const ArticleModal = lazy(() => import("./components/ArticleModal"));
const DownloadModal = lazy(() => import("./components/DownloadModal"));
const ThoughtsFab = lazy(() => import("./components/ThoughtsFab"));
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import DesignSystem from "./components/sections/DesignSystem";
import Thinking from "./components/sections/Thinking";
import Experience from "./components/sections/Experience";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";

export default function App() {
  const [isNavigationScrolled, setIsNavigationScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [openArticleId, setOpenArticleId] = useState(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsNavigationScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ThemeProvider>
      <BackgroundCanvas />
      <main className="page-wrapper">
        <Navbar isScrolled={isNavigationScrolled} onOpenContact={() => setIsContactOpen(true)} />
        <Hero onOpenArticle={(id) => setOpenArticleId(id)} onOpenDownload={() => setIsDownloadOpen(true)} />
        <hr className="full-width-rule" />
        <About />
        <hr className="full-width-rule" />
        <Skills />
        <hr className="full-width-rule" />
        <Projects onOpenCaseStudy={() => setIsCaseStudyOpen(true)} onOpenArticle={(id) => setOpenArticleId(id)} />
        <hr className="full-width-rule" />
        <DesignSystem />
        <hr className="full-width-rule" />
        <Thinking onOpenArticle={(id) => setOpenArticleId(id)} />
        <hr className="full-width-rule" />
        <Experience />
        <hr className="full-width-rule" />
        <Contact onOpenContact={() => setIsContactOpen(true)} />
        <hr className="full-width-rule" />
        <Footer onOpenContact={() => setIsContactOpen(true)} />
      </main>
      <Suspense fallback={null}>
        {isContactOpen && <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />}
        {isCaseStudyOpen && <CaseStudy isOpen={isCaseStudyOpen} onClose={() => setIsCaseStudyOpen(false)} onOpenArticle={(id) => setOpenArticleId(id)} />}
        {openArticleId && <ArticleModal articleId={openArticleId} isOpen={!!openArticleId} onClose={() => setOpenArticleId(null)} />}
        {isDownloadOpen && <DownloadModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />}
        <ThoughtsFab onOpenArticle={(id) => setOpenArticleId(id)} />
      </Suspense>
    </ThemeProvider>
  );
}
