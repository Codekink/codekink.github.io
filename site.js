const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav, nav[aria-label="Main navigation"]');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
  });
}

const currentYear = document.querySelector('#current-year');
if (currentYear) currentYear.textContent = new Date().getFullYear();

const dateInput = document.querySelector('input[name="event_date"]');
if (dateInput) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  dateInput.min = localToday;

  let dateStatus = document.querySelector('#date-status');
  if (!dateStatus) {
    dateStatus = document.createElement('span');
    dateStatus.className = 'date-status';
    dateStatus.id = 'date-status';
    dateStatus.setAttribute('role', 'status');
    dateStatus.textContent = 'Choose a date to check availability.';
    dateInput.insertAdjacentElement('afterend', dateStatus);
  }

  dateInput.addEventListener('change', () => {
    if (!dateInput.value) {
      dateStatus.textContent = 'Choose a date to check availability.';
      return;
    }
    const selectedDate = new Date(`${dateInput.value}T12:00:00`);
    dateStatus.textContent = `Selected ${selectedDate.toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    })}. Send the form to confirm availability.`;
  });
}

const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    if (form.action.includes('YOUR_FORM_ID')) {
      event.preventDefault();
      alert('Thanks! Connect a Formspree form ID to receive inquiries, then this form is ready to go.');
    } else if (form.action.includes('formsubmit.co')) {
      // FormSubmit will submit the form normally
      // Redirect after FormSubmit processes it (2 second delay to ensure submission completes)
      setTimeout(() => {
        window.location.href = 'what-to-expect.html';
      }, 1500);
    }
  });
}
