import React from 'react';
import { FiAward } from 'react-icons/fi';
import { profile } from '../../data/profile';
import CrewNote from './CrewNote';

export default function About() {
  return (
    <section className="portfolio-about" id="about" aria-labelledby="about-title">
      <div className="portfolio-about-inner">
        <h2 id="about-title" data-scroll-reveal="rise">About Me</h2>
        <div className="portfolio-about-grid">
          <figure className="portfolio-about-portrait" data-scroll-reveal="depth">
            <img src="/images/portrait/nihar-portrait-480.webp" alt={profile.name}
              width="480" height="640" loading="lazy" decoding="async" />
            <figcaption><FiAward aria-hidden="true" /> Smart India Hackathon 2022 winner</figcaption>
          </figure>
          <div className="portfolio-about-copy">
            <p data-scroll-reveal="rise">I’m a Software Engineer at Cisco in Bengaluru. I build backend services for engineering workflows and work on distributed embedding pipelines.</p>
            <p data-scroll-reveal="rise">Before Cisco, I worked on Java and Spring Boot applications at Evolvision Technologies.</p>
            <CrewNote guide="scout" prompt="Tell me about Nihar’s engineering experience">
              Nihar’s team built a shared academic calendar for Indian universities at Smart India Hackathon.
            </CrewNote>
          </div>
        </div>
      </div>
    </section>
  );
}
