import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import QuickSnapshot from "@/components/QuickSnapshot";
import About from "@/components/About";
import Education from "@/components/Education";
import Achievements from "@/components/Achievements";
import Journey from "@/components/Journey";
import Manifesto from "@/components/Manifesto";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Quote from "@/components/Quote";
import Terminal from "@/components/Terminal";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Top Navigation */}
      <Navigation />

      {/* Hero Presentation */}
      <Hero />

      {/* Quick Snapshot Overview */}
      <QuickSnapshot />

      {/* Main Portfolio Modules */}
      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <Projects />

      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <About />

      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <Education />

      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <Achievements />

      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <Journey />

      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <Manifesto />

      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <Blog />

      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <Quote />

      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <Terminal />

      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <Stats />

      <div className="section-divider h-[1px] bg-border mx-6 md:mx-12 relative z-10" />
      <Contact />

      {/* Footer Content */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-6 md:px-12 py-8 border-t border-border font-mono text-[0.68rem] text-muted gap-4">
        <div className="footer-copy text-center sm:text-left">
          © 2026 Sreejit Pradhan · India
        </div>
        <div className="footer-right flex gap-6">
          <a
            href="https://github.com/ogMaverick12"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-200"
          >
            github
          </a>
          <a
            href="mailto:sreejit.dev12@gmail.com"
            className="hover:text-accent transition-colors duration-200"
          >
            mail
          </a>
          <a
            href="https://x.com/SreejitX"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-200"
          >
            twitter
          </a>
        </div>
      </footer>
    </main>
  );
}
