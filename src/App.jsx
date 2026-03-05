import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import BackgroundCanvas from "./components/BackgroundCanvas";
import ContactModal from "./components/ContactModal";
import CaseStudy from "./components/CaseStudy";
import Navbar from "./components/sections/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";

export default function App() {
  const [isNavigationScrolled, setIsNavigationScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsNavigationScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ThemeProvider>
      <BackgroundCanvas />
      <div className="page-wrapper">
        <Navbar isScrolled={isNavigationScrolled} onOpenContact={() => setIsContactOpen(true)} />
        <Hero />
        <hr className="full-width-rule" />
        <About />
        <hr className="full-width-rule" />
        <Skills />
        <hr className="full-width-rule" />
        <Projects onOpenCaseStudy={() => setIsCaseStudyOpen(true)} />
        <hr className="full-width-rule" />
        <Experience />
        <hr className="full-width-rule" />
        <Contact onOpenContact={() => setIsContactOpen(true)} />
        <hr className="full-width-rule" />
        <Footer />
      </div>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <CaseStudy isOpen={isCaseStudyOpen} onClose={() => setIsCaseStudyOpen(false)} />
    </ThemeProvider>
  );
}
