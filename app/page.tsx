import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Achievements from "@/components/Achievements";
import Projects from "@/components/Projects";
import Team from "@/components/Team";
import Competitions from "@/components/Competitions";
import Skills from "@/components/Skills";
import Gallery from "@/components/Gallery";
import Organizations from "@/components/Organizations";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Achievements />
        <Projects />
        <Team />
        <Competitions />
        <Skills />
        <Gallery />
        <Organizations />
        <Contact />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
