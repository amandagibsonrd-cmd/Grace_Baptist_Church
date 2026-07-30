(() => {
  'use strict';

  const config = window.CHURCH_SITE || {};
  const address = config.address || {};
  const times = config.serviceTimes || {};
  const mission = config.mission || {};

  const fullAddressText = [address.street, address.city, address.state, address.zip]
    .filter(Boolean)
    .join(', ')
    .replace(`, ${address.state},`, `, ${address.state} `);

  const fullAddressHtml = `${address.street || ''}<br>${address.city || ''}, ${address.state || ''} ${address.zip || ''}`;
  const mapQuery = encodeURIComponent(fullAddressText);
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  const values = {
    churchName: config.churchName,
    cityState: config.cityState,
    pastorName: config.pastorName,
    missionLine1: mission.line1,
    missionLine2: mission.line2,
    missionLine3: mission.line3,
    sundayMorning: times.sundayMorning,
    wednesdayEvening: times.wednesdayEvening,
    shortAddress: address.street,
    fullAddress: fullAddressHtml,
    fullAddressText
  };

  Object.entries(values).forEach(([key, value]) => {
    if (!value) return;
    document.querySelectorAll(`[data-site="${key}"]`).forEach((element) => {
      if (key === 'fullAddress') element.innerHTML = value;
      else element.textContent = value;
    });
  });

  document.querySelectorAll('.facebook-link, .facebook-events-link').forEach((link) => {
    if (config.facebookUrl) link.href = config.facebookUrl;
  });

  document.querySelectorAll('.directions-link').forEach((link) => {
    link.href = directionsUrl;
  });

  const mapFrame = document.getElementById('church-map');
  if (mapFrame && fullAddressText) mapFrame.src = mapEmbedUrl;


  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('menu-open', !open);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }
})();
