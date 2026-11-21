import React from 'react';
import { FiAward, FiCode, FiCpu, FiDatabase, FiServer } from 'react-icons/fi';
import { profile } from '../../data/profile';

const specialties = [
  { title: 'Languages', detail: 'Java, Python, JavaScript', icon: FiCode },
  { title: 'Backend', detail: 'Spring Boot, FastAPI, Flask, REST APIs', icon: FiServer },
  { title: 'Data', detail: 'MongoDB, SQL, Milvus', icon: FiDatabase },
  { title: 'AI systems', detail: 'LangGraph, LangChain, ReAct', icon: FiCpu },
];

export default function About() {
  return (
    <section className="portfolio-about" id="about" aria-labelledby="about-title">
      <div className="portfolio-about-inner">
        <h2 id="about-title">About Me</h2>
        <div className="portfolio-about-grid">
          <figure className="portfolio-about-portrait">
            <img src="/images/portrait/nihar-portrait-480.webp" alt={profile.name}
              width="480" height="640" loading="lazy" decoding="async" />
            <figcaption><FiAward aria-hidden="true" /> Smart India Hackathon 2022 winner</figcaption>
          </figure>
          <div className="portfolio-about-copy">
            <p>I’m a Software Engineer at Cisco in Bengaluru. I build backend services and LangGraph workflows that route engineering requests, coordinate specialist agents, and let engineers review changes to system state.</p>
            <p>I also work on distributed embedding pipelines. Parallel processing, caching, and thread-safe state management helped bring model initialization from 22 minutes to about 32 seconds.</p>
            <dl className="portfolio-about-specialties">
              {specialties.map(({ title, detail, icon: Icon }) => (
                <div key={title}>
                  <dt><Icon aria-hidden="true" /> {title}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
