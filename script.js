// 页面交互与数据模块渲染。内容统一维护在 data.js。
document.addEventListener('DOMContentLoaded', function(){
  const data = window.resumeData;
  if (!data) return;

  const render = () => {
    document.title = data.site.title;
    document.querySelector('[data-brand]').textContent = data.site.brand;
    document.querySelector('[data-footer]').textContent = `© ${data.site.year} ${data.site.brand}. ${data.site.footer}`;
    document.querySelector('[data-navigation]').innerHTML = data.navigation.map(item => `<li><a href="#${item.target}">${item.label}</a></li>`).join('');

    document.querySelector('[data-module="hero"]').innerHTML = `
      <div class="hero-left"><h1>${data.profile.headline}</h1><p class="lead">${data.profile.role} · ${data.profile.introduction}</p><p class="quick">${data.profile.location}</p><div class="hero-cta"><a class="btn primary" href="#projects">查看作品</a><a class="btn ghost" href="#contact">联系我们</a></div></div>
      <aside class="hero-right"><div class="avatar"><svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${data.profile.avatarLabel}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#6C5CE7"/><stop offset="1" stop-color="#00b894"/></linearGradient></defs><rect width="120" height="120" rx="18" fill="url(#g)"/><g transform="translate(20,20)" fill="#fff"><circle cx="40" cy="28" r="16" opacity=".95"/><rect x="6" y="56" width="68" height="28" rx="8" opacity=".9"/></g></svg><img class="avatar-photo" src="${data.profile.avatarImage}" alt="${data.profile.name} 的照片" /></div><div class="at-a-glance">${data.profile.summary.map(item => `<div><strong>${item.label}</strong><span>${item.value}</span></div>`).join('')}</div></aside>`;
    document.querySelector('[data-module="about"]').innerHTML = `<h2>${data.about.title}</h2><p>${data.about.content}</p>`;
    document.querySelector('[data-module="skills"]').innerHTML = `<h2>${data.sections.skills}</h2><div class="skills-grid">${data.skills.map(skill => `<div class="skill-card"><h3>${skill.title}</h3><p>${skill.content}</p></div>`).join('')}</div>`;
    document.querySelector('[data-module="metrics"]').innerHTML = `<div class="metrics-intro"><div><span class="section-kicker">04 / ${data.metrics.title}</span><h2>${data.metrics.title}</h2><p>${data.metrics.description}</p></div><div class="metrics-stats">${data.metrics.stats.map(stat => `<div><strong>${stat.value}</strong><span>${stat.label}</span></div>`).join('')}</div></div><div class="data-viz-module"><div class="viz-panel viz-bars"><span class="viz-label">${data.metrics.flowLabel}</span><div class="bar-chart">${Array.from({ length: 8 }, (_, index) => `<i style="--bar-height:${30 + ((index * 17) % 58)}%;--bar-delay:-${index * 0.3}s"></i>`).join('')}</div></div><div class="viz-panel viz-ring"><div class="progress-ring"><span>${data.metrics.stats[1].value}</span></div><span class="viz-label">${data.metrics.syncLabel}</span></div><div class="viz-panel viz-wave"><span class="viz-label">${data.metrics.activityLabel}</span><svg viewBox="0 0 180 52" preserveAspectRatio="none"><polyline points="0,39 15,34 28,42 42,20 55,29 69,12 82,26 96,23 112,36 127,18 142,28 158,8 180,17" /></svg></div></div>`;
    document.querySelector('[data-module="experience"]').innerHTML = `<h2>${data.sections.experience}</h2><div class="timeline">${data.experience.map(item => `<article class="timeline-item"><h3>${item.title}</h3><span class="meta">${item.period}</span><p>${item.description}</p></article>`).join('')}</div>`;
    document.querySelector('[data-module="projects"]').innerHTML = `<h2>${data.sections.projects}</h2><div class="projects-grid">${data.projects.map(project => `<a class="project-card" href="${project.url}"><div class="thumb"><span>${project.category}</span></div><h3>${project.title}</h3><p>${project.description}</p></a>`).join('')}</div>`;
    document.querySelector('[data-module="contact"]').innerHTML = `<h2>${data.contact.title}</h2><p>${data.contact.description}</p><ul class="contacts">${data.contact.items.map(item => `<li>${item.label}: <a href="${item.href}" ${item.external ? 'target="_blank" rel="noreferrer"' : ''}>${item.value}</a></li>`).join('')}</ul>`;
  };
  render();

  const ambientDecor = document.createElement('div');
  ambientDecor.className = 'ambient-decor';
  ambientDecor.setAttribute('aria-hidden', 'true');
  ambientDecor.innerHTML = '<span class="ambient-orbit"></span><span class="ambient-ring ring-top"></span><span class="ambient-ring ring-bottom"></span><span class="ambient-stream stream-left"></span><span class="ambient-stream stream-right"></span>' + Array.from({ length: 12 }, (_, index) => `<i class="ambient-particle particle-${index + 1}"></i>`).join('');
  document.body.appendChild(ambientDecor);

  // 发光箭头与基于历史轨迹的粒子尾迹，只在鼠标设备上启用
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursorLayer = document.createElement('div');
    cursorLayer.className = 'cursor-layer';
    cursorLayer.innerHTML = '<span class="cursor-arrow"></span>';
    document.body.appendChild(cursorLayer);
    document.body.classList.add('custom-cursor-enabled');

    const arrow = cursorLayer.querySelector('.cursor-arrow');
    const particles = Array.from({ length: 14 }, (_, index) => {
      const particle = document.createElement('i');
      particle.className = 'cursor-particle';
      particle.style.setProperty('--particle-size', `${2 + Math.max(0, 2 - index * 0.1)}px`);
      cursorLayer.appendChild(particle);
      return { element: particle, x: -80, y: -80, index, side: index % 2 === 0 ? -1 : 1 };
    });
    let pointer = { x: -80, y: -80 };
    const history = Array.from({ length: 30 }, () => ({ ...pointer }));
    let motionEnergy = 0;

    window.addEventListener('mousemove', event => {
      const nextPointer = { x: event.clientX, y: event.clientY };
      document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
      const distance = Math.hypot(nextPointer.x - pointer.x, nextPointer.y - pointer.y);
      pointer = { x: event.clientX, y: event.clientY };
      history.unshift(nextPointer);
      history.length = 30;
      motionEnergy = Math.min(1, motionEnergy + Math.min(distance / 100, 0.2));
      cursorLayer.classList.add('is-active');
    });
    window.addEventListener('mousedown', () => cursorLayer.classList.add('is-clicking'));
    window.addEventListener('mouseup', () => cursorLayer.classList.remove('is-clicking'));
    window.addEventListener('mouseleave', () => cursorLayer.classList.remove('is-active'));
    window.addEventListener('mouseenter', () => cursorLayer.classList.add('is-active'));

    const animateCursor = () => {
      motionEnergy *= 0.94;
      arrow.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

      particles.forEach(particle => {
        const progress = particle.index / particles.length;
        const trailPoint = history[Math.min(particle.index * 2 + 2, history.length - 1)];
        const nextPoint = history[Math.min(particle.index * 2 + 1, history.length - 1)];
        const directionX = pointer.x - nextPoint.x;
        const directionY = pointer.y - nextPoint.y;
        const length = Math.hypot(directionX, directionY) || 1;
        const perpendicularX = -directionY / length;
        const perpendicularY = directionX / length;
        const spread = particle.side * (1 + particle.index * 0.42) * motionEnergy;
        const targetX = trailPoint.x + perpendicularX * spread;
        const targetY = trailPoint.y + perpendicularY * spread;
        particle.x += (targetX - particle.x) * 0.2;
        particle.y += (targetY - particle.y) * 0.2;
        particle.element.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0)`;
        particle.element.style.opacity = Math.max(0, (1 - progress) * motionEnergy * 0.9);
      });
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);
  }

  // 移动导航开关
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle && toggle.addEventListener('click', ()=>{
    const shown = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(shown));
  });
  links && links.addEventListener('click', event => {
    if (event.target.matches('a')) {
      links.classList.remove('is-open');
      toggle && toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // 滚动 reveal：IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('show');
        // 取消观察以提高性能
        io.unobserve(e.target);
      }
    })
  },{threshold:0.15});
  reveals.forEach(r=>io.observe(r));

  // 快速滚动或直接跳转时，补显示已经经过视口的模块。
  const revealScrolledModules = () => {
    reveals.forEach(module => {
      const bounds = module.getBoundingClientRect();
      if (bounds.top < window.innerHeight + 120 || bounds.bottom < 0) {
        module.classList.add('show');
      }
    });
  };
  revealScrolledModules();
  window.addEventListener('scroll', revealScrolledModules, { passive: true });

  // 鼠标滑过 project 卡片时添加轻微倾斜效果
  document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-10px) scale(1.01) rotateX(${ -y * 4 }deg) rotateY(${ x * 6 }deg)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
    });
  });
});
