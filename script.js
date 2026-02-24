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
    // 0: Pathogen WGS Pipeline — bacterium flinching from approaching stimuli
    `<div class="bio-illustration bio-pathogen">
      <div class="stimulus stim-1"></div>
      <div class="stimulus stim-2"></div>
      <div class="stimulus stim-3"></div>
      <div class="stimulus stim-4"></div>
      <div class="stim-ring ring-1"></div>
      <div class="stim-ring ring-2"></div>
      <div class="bacterium">
        <div class="bact-membrane"></div>
        <div class="bact-cytoplasm"></div>
        <div class="bact-nucleus"></div>
        <div class="bact-flagellum flag-1"></div>
        <div class="bact-flagellum flag-2"></div>
        <div class="bact-flagellum flag-3"></div>
        <div class="bact-pilus pilus-1"></div>
        <div class="bact-pilus pilus-2"></div>
        <div class="bact-pilus pilus-3"></div>
        <div class="bact-pilus pilus-4"></div>
        <div class="bact-pilus pilus-5"></div>
        <div class="bact-pilus pilus-6"></div>
      </div>
    </div>`,

    // 1: SARS-CoV-2 Variant Classifier — capsid actively packaging code
    `<div class="bio-illustration bio-capsid">
      <div class="capsid-shell">
        <div class="capsid-facet facet-1"></div>
        <div class="capsid-facet facet-2"></div>
        <div class="capsid-facet facet-3"></div>
        <div class="capsid-facet facet-4"></div>
        <div class="capsid-facet facet-5"></div>
        <div class="capsid-facet facet-6"></div>
        <div class="capsid-inner"></div>
        <div class="capsid-packed packed-1">ATGC</div>
        <div class="capsid-packed packed-2">0110</div>
        <div class="capsid-packed packed-3">seq</div>
      </div>
      <div class="capsid-glow"></div>
      <div class="code-fly fly-l fly-1">def classify(seq):</div>
      <div class="code-fly fly-l fly-2">SPIKE_P681R</div>
      <div class="code-fly fly-l fly-3">embedding = encode(s)</div>
      <div class="code-fly fly-l fly-4">score: 0.97</div>
      <div class="code-fly fly-r fly-5">return model.predict(x)</div>
      <div class="code-fly fly-r fly-6">variant: B.1.617.2</div>
      <div class="code-fly fly-r fly-7">loss = cross_entropy(y)</div>
      <div class="code-fly fly-r fly-8">ACE2 binding: HIGH</div>
    </div>`,

    // 2: Pathogen Surveillance — covid particles drifting like pollen
    `<div class="bio-illustration bio-pollen">
      <div class="air-current current-1"></div>
      <div class="air-current current-2"></div>
      <div class="air-current current-3"></div>
      <div class="pollen-virus pv-1">
        <div class="pv-body"></div>
        <div class="pv-spike ps-1"></div>
        <div class="pv-spike ps-2"></div>
        <div class="pv-spike ps-3"></div>
        <div class="pv-spike ps-4"></div>
        <div class="pv-spike ps-5"></div>
        <div class="pv-spike ps-6"></div>
        <div class="pv-spike ps-7"></div>
        <div class="pv-spike ps-8"></div>
      </div>
      <div class="pollen-virus pv-2">
        <div class="pv-body"></div>
        <div class="pv-spike ps-1"></div>
        <div class="pv-spike ps-2"></div>
        <div class="pv-spike ps-3"></div>
        <div class="pv-spike ps-4"></div>
        <div class="pv-spike ps-5"></div>
        <div class="pv-spike ps-6"></div>
        <div class="pv-spike ps-7"></div>
        <div class="pv-spike ps-8"></div>
      </div>
      <div class="pollen-virus pv-3">
        <div class="pv-body"></div>
        <div class="pv-spike ps-1"></div>
        <div class="pv-spike ps-2"></div>
        <div class="pv-spike ps-3"></div>
        <div class="pv-spike ps-4"></div>
        <div class="pv-spike ps-5"></div>
        <div class="pv-spike ps-6"></div>
        <div class="pv-spike ps-7"></div>
        <div class="pv-spike ps-8"></div>
      </div>
      <div class="pollen-virus pv-4">
        <div class="pv-body"></div>
        <div class="pv-spike ps-1"></div>
        <div class="pv-spike ps-2"></div>
        <div class="pv-spike ps-3"></div>
        <div class="pv-spike ps-4"></div>
        <div class="pv-spike ps-5"></div>
        <div class="pv-spike ps-6"></div>
        <div class="pv-spike ps-7"></div>
        <div class="pv-spike ps-8"></div>
      </div>
      <div class="pollen-virus pv-5">
        <div class="pv-body"></div>
        <div class="pv-spike ps-1"></div>
        <div class="pv-spike ps-2"></div>
        <div class="pv-spike ps-3"></div>
        <div class="pv-spike ps-4"></div>
        <div class="pv-spike ps-5"></div>
        <div class="pv-spike ps-6"></div>
        <div class="pv-spike ps-7"></div>
        <div class="pv-spike ps-8"></div>
      </div>
      <div class="pollen-dust pd-1"></div>
      <div class="pollen-dust pd-2"></div>
      <div class="pollen-dust pd-3"></div>
      <div class="pollen-dust pd-4"></div>
      <div class="pollen-dust pd-5"></div>
      <div class="pollen-dust pd-6"></div>
      <div class="pollen-dust pd-7"></div>
      <div class="pollen-dust pd-8"></div>
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
