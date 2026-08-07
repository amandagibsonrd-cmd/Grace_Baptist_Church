const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.site-nav a').forEach(link => link.addEventListener('click', () => {
  navigation?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
}));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();


const eventsBoard = document.getElementById('events-board');
if (eventsBoard && Array.isArray(window.GRACE_EVENTS)) {
  const groups = new Map();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sortedEvents = [...window.GRACE_EVENTS]
    .filter(event => new Date(`${event.date}T23:59:59`) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sortedEvents.length === 0) {
    eventsBoard.innerHTML = '<div class="event-empty"><h3>New events are coming soon.</h3><p>Check the church Facebook page for the latest announcements and schedule updates.</p></div>';
  } else {
    sortedEvents.forEach(event => {
    const date = new Date(`${event.date}T12:00:00`);
    const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups.has(monthKey)) groups.set(monthKey, []);
    groups.get(monthKey).push({ ...event, dateObject: date });
  });

    eventsBoard.innerHTML = [...groups.entries()].map(([month, events]) => `
    <section class="event-month" aria-labelledby="month-${month.replace(/\\s+/g, '-').toLowerCase()}">
      <h3 id="month-${month.replace(/\\s+/g, '-').toLowerCase()}">${month}</h3>
      <div class="event-list">
        ${events.map(event => `
          <article class="event-card">
            <time datetime="${event.date}">
              <span>${event.dateObject.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <strong>${event.dateObject.getDate()}</strong>
              <small>${event.dateObject.toLocaleDateString('en-US', { month: 'short' })}</small>
            </time>
            <div class="event-content">
              <span class="event-category">${event.category || 'Church Event'}</span>
              <h4>${event.title}</h4>
              ${event.time ? `<p><strong>${event.time}</strong></p>` : ''}
              ${event.location ? `<p>${event.location}</p>` : ''}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
    `).join('');
  }
}
