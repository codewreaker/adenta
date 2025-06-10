import Hero from './Hero';
import CVSection from './CVSection';
import BlogList from './Blog/BlogList';
import Projects from './Projects';

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <CVSection />
        <p className='quote'>The only way to do great work is to love what you do. <span className='highlight'> — Steve Jobs</span></p>
      <BlogList />
    </>
  );
}
