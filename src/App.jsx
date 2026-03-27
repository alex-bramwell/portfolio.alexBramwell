import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import BackgroundCanvas from "./components/BackgroundCanvas";
import ContactModal from "./components/ContactModal";
import CaseStudy from "./components/CaseStudy";
import ArticleModal from "./components/ArticleModal";
import ThoughtsFab from "./components/ThoughtsFab";
import Navbar from "./components/sections/Navbar";
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
        <Hero />
        <hr className="full-width-rule" />
        <About />
        <hr className="full-width-rule" />
        <Skills />
        <hr className="full-width-rule" />
        <Projects onOpenCaseStudy={() => setIsCaseStudyOpen(true)} />
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
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <CaseStudy isOpen={isCaseStudyOpen} onClose={() => setIsCaseStudyOpen(false)} />
      <ArticleModal articleId={openArticleId} isOpen={!!openArticleId} onClose={() => setOpenArticleId(null)} />
      <ThoughtsFab onOpenArticle={(id) => setOpenArticleId(id)} />
    </ThemeProvider>
  );
}
