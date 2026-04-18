import { useEffect, useState } from "react";
import { projects } from "./data/projects";

const services = [
  ["SaaS Product UX Design", "User flows, dashboards and product experiences for founders who need clear, usable software."],
  ["Web App & Mobile App UI", "Clean responsive interfaces for early-stage products, marketplaces, portals and booking platforms."],
  ["Dashboard UX & Enterprise Tools", "Complex data, tables, workflows and approvals simplified into decision-friendly screens."],
  ["Design Systems & Developer Handoff", "Reusable components, visual rules and Figma files that help developers build faster."],
  ["Prototyping & Wireframing", "Clickable prototypes and structured layouts to validate ideas before engineering time is spent."],
  ["Product Strategy Support", "Feature structure, UX priorities and user journeys shaped around business goals and real behavior."],
];

const process = [
  ["01", "Understand", "Product goals and user problems"],
  ["02", "Structure", "User flows and information architecture"],
  ["03", "Design", "Intuitive interfaces and visual systems"],
  ["04", "Deliver", "Developer-ready assets and support"],
];

const testimonials = [
  [
    "Pranav has a strong grasp of design psychology and user behavior. His work is thoughtful, refined, and always on point.",
    "Ashish Choudhury, Innovation Strategy Lead, Frog",
  ],
  [
    "His design thinking has helped us turn complex ideas into user-friendly interfaces.",
    "Dr. Radhakrishna Sanka, CEO, Aegion Dynamic",
  ],
  [
    "He understood our needs instantly and delivered designs that exceeded expectations.",
    "Gowtham Chandala, Founder, Wecrews",
  ],
];

const socialLinks = [
  "https://www.linkedin.com/in/pranav-boggavarupu/",
  "https://www.instagram.com/pranavboggavarapu/",
  "https://www.behance.net/pranavboggavarapu",
  "https://dribbble.com/BRPRANAV",
  "https://www.fiverr.com/s/DBYZ10V",
  "https://www.upwork.com/freelancers/~0121c9191d3adfce95?mp_source=share",
];

const faqs = [
  [
    "Do you work with clients outside India?",
    "Yes. I work remotely with founders and product teams in the USA, UK, Dubai, UAE and other international markets.",
  ],
  [
    "What kind of design projects do you take?",
    "I design SaaS products, web apps, mobile apps, dashboards, e-commerce experiences, booking platforms and enterprise tools.",
  ],
  [
    "Can you prepare developer-ready UI files?",
    "Yes. I deliver organized Figma files, reusable components, responsive layouts and handoff notes so developers can implement with fewer questions.",
  ],
  [
    "Can you redesign an existing product?",
    "Yes. I can audit an existing interface, identify friction, restructure the UX and redesign screens while keeping the product goals intact.",
  ],
];

const setMeta = (selector, attribute, value) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://brpranav.com/#person",
      name: "Pranav R Boggavarapu",
      alternateName: "Pranav Boggavarapu",
      url: "https://brpranav.com",
      jobTitle: "Freelance UI/UX and Product Designer",
      email: "contact@brpranav.com",
      address: { "@type": "PostalAddress", addressCountry: "IN" },
      knowsAbout: [
        "UI Design",
        "UX Research",
        "Interaction Design",
        "Wireframing",
        "Product Strategy",
        "Design Systems",
        "SaaS Design",
        "Dashboard UX Design",
        "Mobile App Design",
      ],
      sameAs: socialLinks,
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://brpranav.com/#service",
      name: "Pranav Boggavarapu UI/UX Design",
      url: "https://brpranav.com",
      image: projects[0].cover,
      founder: { "@id": "https://brpranav.com/#person" },
      areaServed: ["United States", "United Kingdom", "United Arab Emirates", "Dubai", "India"],
      serviceType: [
        "UI/UX Design",
        "SaaS Product Design",
        "Web App Design",
        "Mobile App Design",
        "Dashboard UX Design",
        "Design System Design",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://brpranav.com/#website",
      name: "Pranav Boggavarapu Portfolio",
      url: "https://brpranav.com",
      publisher: { "@id": "https://brpranav.com/#person" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://brpranav.com/#faq",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function NewralApp() {
  const [theme, setTheme] = useState(() => localStorage.getItem("pranav-theme") || "dark");
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("pranav-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const navigate = (href) => {
    window.history.pushState({}, "", href);
    setPath(window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const projectId = path.match(/^\/work\/([^/]+)/)?.[1];
  const activeProject = projects.find((project) => project.id === projectId);

  useEffect(() => {
    const pageTitle = activeProject
      ? `${activeProject.client} UX Case Study | Pranav Boggavarapu`
      : "UI/UX Designer for SaaS Startups | Pranav Boggavarapu";
    const description = activeProject
      ? `${activeProject.title}. A UI/UX case study by Pranav Boggavarapu covering the problem, design decisions, outcome and product impact.`
      : "Hire Pranav Boggavarapu, a freelance UI/UX and product designer for SaaS startups, web apps, mobile apps, dashboards and design systems. Remote for USA, UK, Dubai and UAE clients.";
    const canonical = activeProject
      ? `https://brpranav.com/work/${activeProject.id}/`
      : "https://brpranav.com/";
    const previewImage = activeProject?.cover || projects[0].cover;

    document.title = pageTitle;
    setMeta('meta[name="description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", canonical);
    setMeta('meta[property="og:title"]', "content", pageTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:image"]', "content", previewImage);
    setMeta('meta[name="twitter:title"]', "content", pageTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", previewImage);
  }, [activeProject]);

  return (
    <div className="site-shell">
      <div className="custom-cursor" aria-hidden="true" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <header className="nav">
        <a
          className="wordmark"
          href="/"
          aria-label="Pranav R Boggavarapu home"
          onClick={(event) => {
            event.preventDefault();
            navigate("/");
          }}
        >
          PRANAV R BOGGAVARAPU
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/#work">Work</a>
          <a href="/#about">About</a>
          <a href="/#services">Services</a>
          <a href="/#contact">Contact</a>
        </nav>
        <div className="nav-actions">
          <button
            className="theme-toggle"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 15.3A8.2 8.2 0 0 1 8.7 4a8.7 8.7 0 1 0 11.3 11.3Z" />
              </svg>
            )}
          </button>
          <a className="nav-contact" href="mailto:contact@brpranav.com">Contact Me</a>
        </div>
      </header>

      {activeProject ? (
        <ProjectPage project={activeProject} navigate={navigate} />
      ) : (
        <HomePage navigate={navigate} />
      )}

      <Footer />
    </div>
  );
}

function HomePage({ navigate }) {
  return (
    <main id="home">
      <section className="hero section">
          <div className="hero-copy">
            <p className="kicker">Freelance UI/UX Designer / SaaS Product Design / Available for Remote Work</p>
            <h1>
              <span>I turn startup ideas</span>
              <span>into products people</span>
              <span>actually use.</span>
            </h1>
            <p className="hero-lede">
              I help founders and product teams in the USA, UK, Dubai and UAE design developer-ready SaaS,
              web app, mobile app and dashboard experiences that feel clear from the first click.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#work">See My Work</a>
              <a className="button secondary" href="mailto:contact@brpranav.com">Start a Project</a>
            </div>
          </div>
        </section>

        <section className="metrics" aria-label="Portfolio highlights">
          <span>5 products shipped</span>
          <span>Remote for USA, UK, Dubai and UAE</span>
          <span>SaaS, healthcare, e-commerce, travel and enterprise UX</span>
          <span>Remote-first collaboration</span>
        </section>

        <section className="section" id="work">
          <div className="section-heading">
            <p className="kicker">My Work</p>
            <h2>UX case studies for serious product teams.</h2>
            <p>Developer-ready product design work built around clarity, trust and measurable user confidence.</p>
          </div>

          <div className="work-grid">
            {projects.map((project) => (
              <a
                key={project.id}
                className="project-card"
                href={`/work/${project.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(`/work/${project.id}`);
                }}
              >
                <img src={project.cover} alt={project.alt} loading="lazy" />
                <span>{project.eyebrow}</span>
                <strong>{project.title}</strong>
                <em>View case study</em>
              </a>
            ))}
          </div>
        </section>

        <section className="section about" id="about">
          <div className="section-heading">
            <p className="kicker">About Me</p>
            <h2>A product designer for founders who need clarity, speed and trust.</h2>
            <p>
              I am Pranav, a UI/UX and product designer based in India working remotely with startups and
              international clients across the USA, UK, Dubai and UAE. I design web apps, mobile apps,
              dashboards and digital platforms focused on usability, conversion and clarity.
            </p>
          </div>
          <div className="about-grid">
            <div className="mission-visual" aria-hidden="true">
              <span className="mission-word word-one">empathy</span>
              <span className="mission-word word-two">clarity</span>
              <span className="mission-word word-three">systems</span>
              <div className="mission-path">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div>
              <h3>My Mission</h3>
              <p>
                My mission is to make technology easier to understand and more comfortable to use.
                Good design should remove frustration, guide users naturally, and help businesses
                communicate clearly with their audience.
              </p>
              <p>
                By combining empathy, usability, and clean visual design, I create products that
                people trust and enjoy using.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-heading">
            <p className="kicker">What I Help Teams With</p>
            <h2>Hire a UI/UX designer who can move from rough idea to polished interface.</h2>
          </div>
          <div className="service-grid">
            {services.map(([title, text]) => (
              <article key={title} className="service-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section global-clients">
          <div>
            <p className="kicker">Remote Collaboration</p>
            <h2>Built for founders hiring across time zones.</h2>
          </div>
          <div className="global-grid">
            <article>
              <span>USA Startups</span>
              <p>Async-friendly design process, clean handoff and product thinking for SaaS and web app teams.</p>
            </article>
            <article>
              <span>UK Product Teams</span>
              <p>Structured UX flows, polished UI systems and practical communication for fast-moving teams.</p>
            </article>
            <article>
              <span>Dubai & UAE</span>
              <p>Premium digital product design for marketplaces, service platforms, dashboards and mobile apps.</p>
            </article>
          </div>
        </section>

        <section className="process-band section">
          <div className="section-heading">
            <p className="kicker">My Design Approach</p>
            <h2>A structured process that turns ideas into usable products.</h2>
          </div>
          <div className="process-grid">
            {process.map(([number, title, text]) => (
              <article key={number} className="process-step">
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section resume">
          <div>
            <p className="kicker">Experience</p>
            <h2>Interaction Designer at Aegion Dynamic</h2>
            <p>
              Mar 2024 - Present. Leading interaction design for digital products by creating
              intuitive user flows, structured information architecture, and seamless interface behaviors.
            </p>
          </div>
          <div>
            <p className="kicker">Education</p>
            <h2>B.Tech - Computer Science & Engineering</h2>
            <p>
              2021-2025, CGPA 8.20. Andhra University College of Engineering, Andhra University.
            </p>
          </div>
          <div className="skills">
            <span>UI Design</span><span>UX Research</span><span>Interaction Design</span><span>Wireframing</span>
            <span>Prototyping</span><span>Design Systems</span><span>Figma</span><span>Framer</span>
            <span>Webflow</span><span>Flutter Flow</span><span>Notion</span><span>Git / GitHub</span>
          </div>
        </section>

        <section className="section testimonials">
          <div className="section-heading">
            <p className="kicker">What Founders Say</p>
            <h2>Thoughtful, refined, and on point.</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map(([quote, person]) => (
              <figure key={person}>
                <blockquote>"{quote}"</blockquote>
                <figcaption>- {person}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading">
            <p className="kicker">FAQ</p>
            <h2>Quick answers before we work together.</h2>
            <p>Clear expectations help projects move faster from first call to final handoff.</p>
          </div>
          <div className="faq-grid">
            {faqs.map(([question, answer]) => (
              <article key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact section" id="contact">
          <div>
            <p className="kicker">Contact</p>
            <h2>Need a UI/UX designer for your startup or product?</h2>
            <p>Send the product idea, redesign problem or Figma brief. I will get back within 24 hours.</p>
          </div>
          <div className="contact-actions">
            <a className="button primary" href="mailto:contact@brpranav.com">contact@brpranav.com</a>
          </div>
        </section>
    </main>
  );
}

function ProjectPage({ project, navigate }) {
  const related = projects.filter((item) => item.id !== project.id).slice(0, 2);
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url: `https://brpranav.com/work/${project.id}/`,
    image: project.cover,
    creator: { "@id": "https://brpranav.com/#person" },
    about: project.eyebrow,
    description: project.objective,
  };

  return (
    <main className="project-page">
      <script type="application/ld+json">{JSON.stringify(projectJsonLd)}</script>
      <section className="case-study section">
        <a
          className="back-link"
          href="/#work"
          onClick={(event) => {
            event.preventDefault();
            navigate("/");
            window.setTimeout(() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }), 80);
          }}
        >
          Back to work
        </a>

        <div className="case-hero">
          <div>
            <p className="kicker">{project.eyebrow}</p>
            <h1>{project.title}</h1>
            <p>{project.objective}</p>
          </div>
          <img src={project.cover} alt={project.alt} loading="eager" />
        </div>

        <div className="case-meta" aria-label={`${project.title} details`}>
          <div><span>Client</span><strong>{project.client}</strong></div>
          <div><span>Role</span><strong>{project.role}</strong></div>
          <div><span>Platform</span><strong>{project.platform}</strong></div>
        </div>

        <div className="case-content">
          <article>
            <h3>Project Overview</h3>
            <p>{project.summary}</p>
          </article>
          <article>
            <h3>The Problem</h3>
            <p>{project.problem}</p>
          </article>
          <article>
            <h3>Users</h3>
            <p>{project.users}</p>
          </article>
          <article>
            <h3>My Approach</h3>
            <p>{project.approach}</p>
          </article>
        </div>

        <div className="split-lists">
          <div>
            <h3>Key Challenges</h3>
            <ul>{project.challenges.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <h3>Key Design Decisions</h3>
            <ul>{project.decisions.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>

        <div className="gallery">
          {project.gallery.map((src, index) => (
            <img key={src} src={src} alt={`${project.client} project gallery image ${index + 1}`} loading="lazy" />
          ))}
        </div>

        <div className="outcome">
          <div>
            <span>Outcome / Impact</span>
            <p>{project.outcome}</p>
          </div>
          <div>
            <span>What I Learned</span>
            <p>{project.learned}</p>
          </div>
        </div>

        <section className="related-work" aria-label="Related case studies">
          <div className="related-heading">
            <p className="kicker">Next Case Studies</p>
            <p>Keep browsing without losing focus on the project you just read.</p>
          </div>
          <div className="related-links">
            {related.map((item) => (
              <a
                key={item.id}
                className="related-link"
                href={`/work/${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(`/work/${item.id}`);
                }}
              >
                <span>{item.eyebrow}</span>
                <strong>{item.title}</strong>
              </a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>PRANAV R BOGGAVARAPU</span>
      <span>Available for remote collaboration worldwide</span>
      <div>
        <a className="social-link linkedin" href="https://www.linkedin.com/in/pranav-boggavarupu/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a className="social-link instagram" href="https://www.instagram.com/pranavboggavarapu/" target="_blank" rel="noreferrer">Instagram</a>
        <a className="social-link dribbble" href="https://dribbble.com/BRPRANAV" target="_blank" rel="noreferrer">Dribbble</a>
        <a className="social-link behance" href="https://www.behance.net/pranavboggavarapu" target="_blank" rel="noreferrer">Behance</a>
        <a className="social-link fiverr" href="https://www.fiverr.com/s/DBYZ10V" target="_blank" rel="noreferrer">Fiverr</a>
        <a className="social-link upwork" href="https://www.upwork.com/freelancers/~0121c9191d3adfce95?mp_source=share" target="_blank" rel="noreferrer">Upwork</a>
      </div>
    </footer>
  );
}
