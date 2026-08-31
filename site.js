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

// Google Calendar ID - automatically fetches booked dates
const CALENDAR_ID = 'mi6272umskps08cchq8bad0bn34mq4lp@import.calendar.google.com';
let bookedDates = [];

// Fetch booked dates from Google Calendar
async function loadBookedDates() {
  try {
    const feedUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(CALENDAR_ID)}/public/basic.ics`;
    const response = await fetch(feedUrl);
    const icsText = await response.text();
    
    // Parse ICS format to extract dates
    const dateRegex = /DTSTART[^:]*:(\d{8})/g;
    let match;
    while ((match = dateRegex.exec(icsText)) !== null) {
      const dateStr = match[1];
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const formattedDate = `${year}-${month}-${day}`;
      if (!bookedDates.includes(formattedDate)) {
        bookedDates.push(formattedDate);
      }
    }
  } catch (error) {
    console.log('Calendar sync in progress or unavailable. Using offline mode.');
  }
  
  // Update date input status after loading
  updateDateStatus();
}

// Load booked dates on page load
loadBookedDates();

function updateDateStatus() {
  const dateInput = document.querySelector('input[name="event_date"]');
  const dateStatus = document.querySelector('#date-status');
  
  if (!dateInput || !dateInput.value || !dateStatus) return;
  
  const selectedDate = new Date(`${dateInput.value}T12:00:00`);
  const isBooked = bookedDates.includes(dateInput.value);
  
  if (isBooked) {
    dateStatus.textContent = `${selectedDate.toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    })} is booked. Try another date.`;
    dateStatus.style.color = '#c65a24';
  } else {
    dateStatus.textContent = `Selected ${selectedDate.toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    })}. Send the form to confirm availability.`;
    dateStatus.style.color = 'inherit';
  }
}

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

  dateInput.addEventListener('change', updateDateStatus);
}

const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    const selectedDateInput = document.querySelector('input[name="event_date"]');
    const selectedDate = selectedDateInput ? selectedDateInput.value : null;
    
    if (form.action.includes('YOUR_FORM_ID')) {
      event.preventDefault();
      alert('Thanks! Connect a Formspree form ID to receive inquiries, then this form is ready to go.');
    } else if (form.action.includes('formsubmit.co')) {
      // Check if date is booked
      if (selectedDate && bookedDates.includes(selectedDate)) {
        event.preventDefault();
        // Redirect to apologies page
        setTimeout(() => {
          window.location.href = 'apologies.html';
        }, 300);
      } else {
        // Date is available - FormSubmit will submit the form normally
        // Redirect after FormSubmit processes it
        setTimeout(() => {
          window.location.href = 'what-to-expect.html';
        }, 1500);
      }
    }
  });
}
