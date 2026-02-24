/* ============================================
   Mid-Century Modern — Content Engine + Interactions

   All dynamic content is driven by content.json.
   To update your site: edit content.json and push.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Fetch and render content ----
  fetch('content.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load content.json');
      return res.json();
    })
    .then(data => {
      renderContent(data);
      initAnimations();
    })
    .catch(err => {
      console.error('Content load error:', err);
      // Fallback — show a minimal message
      document.getElementById('hero-name').innerHTML = 'Michal<br>Babinski';
      document.getElementById('hero-role').textContent = 'Senior Bioinformatics Developer';
      initAnimations();
    });

  initNav();
  initParallax();
});

/* ---- Content Renderer ---- */

function renderContent(data) {
  // Hero
  const nameParts = data.name.split(' ');
  document.getElementById('hero-name').innerHTML = nameParts.join('<br>');
  document.getElementById('hero-role').textContent = data.role;
  document.getElementById('hero-tagline').innerHTML = data.tagline.replace(/\n/g, '<br>');

  // Statement
  if (data.statement) {
    document.getElementById('statement-text').textContent = data.statement;
  }

  // About heading — convert *text* to <em>text</em>
  document.getElementById('about-heading').innerHTML = formatHeading(data.about.heading);

  // About columns
  const aboutCols = document.getElementById('about-columns');
  aboutCols.innerHTML = data.about.columns
    .map(col => `<div class="about-col"><p>${col}</p></div>`)
    .join('');

  // Skills grid
  const skillsGrid = document.getElementById('skills-grid');
  skillsGrid.innerHTML = data.skills
    .map(skill => `
      <div class="skill-item">
        <span class="skill-category">${skill.category}</span>
        <span class="skill-list">${skill.items}</span>
      </div>
    `).join('');

  // Experience timeline
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = data.experience
    .map(job => `
      <div class="timeline-item">
        <div class="timeline-period">${job.period}</div>
        <div class="timeline-body">
          <h3 class="timeline-title">${job.title}</h3>
          <span class="timeline-org">${job.org}</span>
          <p class="timeline-desc">${job.description}</p>
        </div>
      </div>
    `).join('');

  // Education
  const education = document.getElementById('education');
  education.innerHTML = `
    <div class="education-header">Education</div>
    <div class="education-items">
      ${data.education.map(ed => `
        <div class="education-item">
          <span class="education-degree">${ed.degree}</span>
          <span class="education-school">${ed.school}, ${ed.year}</span>
        </div>
      `).join('')}
    </div>
  `;

  // Projects — bioinformatics illustrations
  const accents = ['var(--olive)', 'var(--mustard)', 'var(--teak)'];
  const illustrations = [
    // 0: Pathogen WGS Pipeline — bacterium with flagella + DNA fragments
    `<div class="bio-illustration bio-pathogen">
      <div class="pathogen-body">
        <div class="pathogen-membrane"></div>
        <div class="pathogen-nucleus"></div>
      </div>
      <div class="pathogen-flagellum flag-1"></div>
      <div class="pathogen-flagellum flag-2"></div>
      <div class="pathogen-flagellum flag-3"></div>
      <div class="pathogen-pilus pilus-1"></div>
      <div class="pathogen-pilus pilus-2"></div>
      <div class="pathogen-pilus pilus-3"></div>
      <div class="pathogen-pilus pilus-4"></div>
      <div class="dna-fragment frag-1"></div>
      <div class="dna-fragment frag-2"></div>
      <div class="dna-fragment frag-3"></div>
      <div class="dna-fragment frag-4"></div>
      <div class="dna-fragment frag-5"></div>
    </div>`,

    // 1: SARS-CoV-2 Variant Classifier — coronavirus with spike proteins
    `<div class="bio-illustration bio-virus">
      <div class="virus-body">
        <div class="virus-inner"></div>
        <div class="virus-rna"></div>
      </div>
      <div class="spike spike-1"></div>
      <div class="spike spike-2"></div>
      <div class="spike spike-3"></div>
      <div class="spike spike-4"></div>
      <div class="spike spike-5"></div>
      <div class="spike spike-6"></div>
      <div class="spike spike-7"></div>
      <div class="spike spike-8"></div>
      <div class="spike spike-9"></div>
      <div class="spike spike-10"></div>
      <div class="spike spike-11"></div>
      <div class="spike spike-12"></div>
      <div class="antibody ab-1"></div>
      <div class="antibody ab-2"></div>
      <div class="antibody ab-3"></div>
    </div>`,

    // 2: Genomics Data Portal — DNA double helix with data nodes
    `<div class="bio-illustration bio-dna">
      <div class="helix-container">
        <div class="helix-strand strand-a">
          <div class="helix-node node-a1"></div>
          <div class="helix-node node-a2"></div>
          <div class="helix-node node-a3"></div>
          <div class="helix-node node-a4"></div>
          <div class="helix-node node-a5"></div>
          <div class="helix-node node-a6"></div>
          <div class="helix-node node-a7"></div>
          <div class="helix-node node-a8"></div>
        </div>
        <div class="helix-rung rung-1"></div>
        <div class="helix-rung rung-2"></div>
        <div class="helix-rung rung-3"></div>
        <div class="helix-rung rung-4"></div>
        <div class="helix-rung rung-5"></div>
        <div class="helix-rung rung-6"></div>
        <div class="helix-rung rung-7"></div>
        <div class="helix-rung rung-8"></div>
        <div class="helix-strand strand-b">
          <div class="helix-node node-b1"></div>
          <div class="helix-node node-b2"></div>
          <div class="helix-node node-b3"></div>
          <div class="helix-node node-b4"></div>
          <div class="helix-node node-b5"></div>
          <div class="helix-node node-b6"></div>
          <div class="helix-node node-b7"></div>
          <div class="helix-node node-b8"></div>
        </div>
      </div>
      <div class="data-node dn-1"></div>
      <div class="data-node dn-2"></div>
      <div class="data-node dn-3"></div>
      <div class="data-node dn-4"></div>
      <div class="data-line dl-1"></div>
      <div class="data-line dl-2"></div>
      <div class="data-line dl-3"></div>
    </div>`
  ];

  const projects = document.getElementById('projects');
  projects.innerHTML = data.projects
    .map((proj, i) => `
      <article class="project ${i % 2 === 1 ? 'project--reverse' : ''}">
        <div class="project-image">
          <div class="project-placeholder" style="--accent: ${accents[i % accents.length]};">
            ${illustrations[i] || illustrations[0]}
          </div>
        </div>
        <div class="project-info">
          <span class="project-number">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-desc">${proj.description}</p>
          <div class="project-tags">
            ${proj.tags.map(tag => `<span>${tag}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');

  // Contact heading
  document.getElementById('contact-heading').innerHTML = formatHeading(data.contact.heading);

  // Contact links
  const contactLinks = document.getElementById('contact-links');
  contactLinks.innerHTML = data.contact.links
    .map(link => `
      <a href="${escapeAttr(link.url)}" class="contact-link" ${link.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
        <span class="contact-link-label">${escapeHtml(link.label)}</span>
        <span class="contact-link-value">${escapeHtml(link.value)}</span>
        <span class="contact-arrow">&rarr;</span>
      </a>
    `).join('');
}

/* ---- Helpers ---- */

function formatHeading(text) {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ---- Animations (called after content is rendered) ---- */

function initAnimations() {
  // Scroll reveal
  const revealElements = document.querySelectorAll(
    '.statement-section, .section-grid, .project, .contact-link, .about-decorative, .timeline-item, .skill-item, .education'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Staggered reveals
  document.querySelectorAll('.project').forEach((p, i) => {
    p.style.transitionDelay = `${i * 0.1}s`;
  });
  document.querySelectorAll('.timeline-item').forEach((t, i) => {
    t.style.transitionDelay = `${i * 0.1}s`;
  });
  document.querySelectorAll('.skill-item').forEach((s, i) => {
    s.style.transitionDelay = `${i * 0.08}s`;
  });

  // Magnetic hover on contact links
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.contact-link').forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
        link.style.transform = `translateY(${y}px)`;
        link.style.transition = 'transform 0.15s ease-out, padding-left 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      });
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
        link.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), padding-left 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      });
    });
  }
}

/* ---- Navigation ---- */

function initNav() {
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      nav.style.background = 'rgba(245, 240, 232, 0.9)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.webkitBackdropFilter = 'blur(12px)';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.webkitBackdropFilter = 'none';
    }

    if (scrollY > lastScroll && scrollY > 400) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    nav.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease';

    lastScroll = scrollY;
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/* ---- Parallax on hero shapes ---- */

function initParallax() {
  const heroShape = document.querySelector('.hero-photo-composition');
  if (heroShape && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroShape.style.transform = `translate(${x}px, ${y}px)`;
      heroShape.style.transition = 'transform 0.3s ease-out';
    });
  }
}
