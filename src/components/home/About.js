import React, { useRef } from 'react';
import { FiAward, FiCode, FiCpu, FiDatabase, FiServer, FiStar } from 'react-icons/fi';
import { awards, profile } from '../../data/profile';
import { research } from '../../data/research';
import useMotionVisibility from './useMotionVisibility';

const { smartIndia, solvingForIndia } = awards;
const paperLinkLabels = { 'Read PDF': 'PDF', 'Read paper': 'Paper' };

const specialties = [
  { title: 'Languages', detail: 'Java, Python, JavaScript', icon: FiCode },
  { title: 'Backend', detail: 'Spring Boot, FastAPI, Flask, REST APIs', icon: FiServer },
  { title: 'Data', detail: 'MongoDB, SQL, Milvus', icon: FiDatabase },
  { title: 'AI systems', detail: 'LangGraph, LangChain, ReAct', icon: FiCpu },
];

function AwardCornerMedal() {
  const medal = useRef(null);
  const visible = useMotionVisibility(medal, 0.85);

  return (
    <span ref={medal} className="portfolio-award-medal portfolio-award-corner-medal"
      data-medal-visible={visible ? '' : undefined} aria-hidden="true">
      <span className="portfolio-award-medallion"><FiStar /></span>
    </span>
  );
}

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
          <div className="portfolio-about-copy" data-scroll-reveal="rise">
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

        <section id="awards" className="portfolio-awards" aria-labelledby="awards-title">
          <h3 id="awards-title" data-scroll-reveal="rise">Awards and Achievements</h3>
          <div className="portfolio-award-groups">
            <section className="portfolio-award-group" aria-labelledby="award-group-title">
              <h4 id="award-group-title" data-scroll-reveal="rise">Awards</h4>
              <div className="portfolio-award-list">
                <article className="portfolio-award-feature" data-scroll-reveal="depth">
                  <img className="portfolio-award-team-photo" src="/images/albums/sih/cover.avif"
                    alt="The Smart India Hackathon 2022 winning team receiving their award on stage"
                    width="900" height="600" loading="lazy" decoding="async" />
                  <div className="portfolio-award-feature-copy">
                    <h5>{smartIndia.name} {smartIndia.year}</h5>
                    <p className="portfolio-award-organizers">{smartIndia.organizers}</p>
                    <p className="portfolio-award-result">{smartIndia.result}</p>
                  </div>
                  <AwardCornerMedal />
                </article>
                <article className="portfolio-award-feature" data-scroll-reveal="depth">
                  <div className="portfolio-award-medal-art" aria-hidden="true">
                    <span className="portfolio-award-medal">
                      <span className="portfolio-award-medallion"><FiStar /></span>
                    </span>
                  </div>
                  <div className="portfolio-award-feature-copy">
                    <h5>{solvingForIndia.name}</h5>
                    <p className="portfolio-award-organizers">GFG × AMD ’{String(solvingForIndia.year).slice(-2)}</p>
                    <p className="portfolio-award-result">{solvingForIndia.result}</p>
                  </div>
                  <AwardCornerMedal />
                </article>
              </div>
            </section>

            <section id="research" className="portfolio-award-group portfolio-research" aria-labelledby="research-title">
              <h4 id="research-title" data-scroll-reveal="rise">Research</h4>
              <div className="portfolio-award-list">
                {research.map(({ id, shortTitle, venue, image, imageAlt, sources }) => (
                  <article key={id} className="portfolio-award-feature" data-scroll-reveal="depth">
                    <img src={image} alt={imageAlt} width="1440" height="600" loading="lazy" decoding="async" />
                    <div className="portfolio-award-feature-copy">
                      <h5>{shortTitle}</h5>
                      <p className="portfolio-research-venue">{venue}</p>
                      <footer className="portfolio-research-links">
                        {Object.values(sources).map(({ href, label }) => {
                          const linkLabel = paperLinkLabels[label] ?? label;
                          return (
                            <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${linkLabel} · ${shortTitle}`}>
                              {linkLabel}
                            </a>
                          );
                        })}
                      </footer>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </section>
  );
}
