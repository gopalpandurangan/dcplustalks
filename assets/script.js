// Sample event data

//Copy the section below and paste it after the last event under const events to create a new event, date format is YYYY-MM-DD
// {
//   startDate: '2025-11-30',
//   endDate: '2025-11-30',
//   startTime: '11:00',
//   endTime: '12:00',
//   title: 'Event Name Goes Here',
//   description: 'Description Goes Here<br><a href="LINK OR THE URL GOES HERE">Zoom Link</a>'
// },

const events = [
{
  startDate: '2025-11-30',
  endDate: '2025-11-30',
  startTime: '11:00',
  endTime: '12:00',
  title: 'Test Event',
  description: 'University of Houston<br><a href="https://aayush714.github.io/seminar-site/index.html">Zoom link</a>'
},
{
  startDate: '2025-12-15',
  endDate: '2025-12-15',
  startTime: '12:00',
  endTime: '13:00',
  title: 'Test Event 2',
  description: 'University of Houston<br><a href="https://aayush714.github.io/seminar-site/index.html">Zoom link</a>'
}
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let popupOpen = false;

// Function to generate an ICS file URL
function generateICSFile(event) {
  const startDate = new Date(`${event.startDate}T${event.startTime}`);
  const endDate = new Date(`${event.endDate}T${event.endTime}`);
  const title = event.title;
  const description = event.description;

  const formatICSDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const icsString =
    `BEGIN:VCALENDAR
VERSION:2.0
PRODID:MyCalendar
BEGIN:VEVENT
UID:${Date.now()}
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

  const encodedICSString = encodeURIComponent(icsString);
  const downloadLink = `data:text/calendar;charset=utf-8,${encodedICSString}`;
  const fileName = `${title.replace(/\s/g, '_')}.ics`;

  const a = document.createElement('a');
  a.href = downloadLink;
  a.download = fileName;
  a.click();

  return false;
}

// Function to open the event details popup
function openEventDetails(event, cell) {
  if (popupOpen) {
    return;
  }

  const popup = document.createElement('div');
  popup.classList.add('eventPopup');

  const titleElement = document.createElement('h3');
  titleElement.textContent = event.title;

  const dateElement = document.createElement('p');
  dateElement.textContent = `Date: ${event.startDate}`;

  const startTime = formatTime12Hr(event.startTime);
  const endTime = formatTime12Hr(event.endTime);

  const timeElement = document.createElement('p');
  timeElement.textContent = `Time: ${startTime} - ${endTime}`;

  const descriptionElement = document.createElement('p');
  descriptionElement.innerHTML = `Description: ${event.description}`;

  const addButton = document.createElement('button');
  addButton.textContent = 'Add to Calendar';
  addButton.addEventListener('click', () => {
    generateICSFile(event);
  });

  popup.appendChild(titleElement);
  popup.appendChild(dateElement);
  popup.appendChild(timeElement);
  popup.appendChild(descriptionElement);
  popup.appendChild(addButton);

  const rect = cell.getBoundingClientRect();
  popup.style.top = `${rect.top + window.pageYOffset}px`;
  popup.style.left = `${rect.left + window.pageXOffset}px`;

  document.body.appendChild(popup);
  popupOpen = true;

  // Close the popup when clicking outside the popup area
  document.addEventListener('click', (event) => {
    if (!popup.contains(event.target)) {
      document.body.removeChild(popup);
      popupOpen = false;
    }
  });
}

// Function to format time in 12-hour format
function formatTime12Hr(time) {
  const [hours, minutes] = time.split(':');
  let period = 'AM';
  let formattedHours = parseInt(hours, 10);

  if (formattedHours >= 12) {
    period = 'PM';
    if (formattedHours > 12) {
      formattedHours -= 12;
    }
  } else if (formattedHours === 0) {
    formattedHours = 12;
  }

  return `${formattedHours}:${minutes.padStart(2, '0')} ${period}`;
}


// Render the calendar
function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const monthYear = document.getElementById('monthYear');
  const daysOfWeek = document.getElementById('daysOfWeek');
  const datesContainer = document.getElementById('datesContainer');

  // Clear previous calendar
  monthYear.textContent = '';
  daysOfWeek.innerHTML = '';
  datesContainer.innerHTML = '';

  // Set month and year
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // Set days of week
  const daysOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < daysOfWeekNames.length; i++) {
    const dayOfWeek = document.createElement('div');
    dayOfWeek.classList.add('dayOfWeek');
    dayOfWeek.textContent = daysOfWeekNames[i];
    daysOfWeek.appendChild(dayOfWeek);
  }

  // Get the first day and the total number of days in the month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create a table for the dates
  const datesTable = document.createElement('table');
  datesTable.classList.add('datesTable');

  // Render dates
  let dateIndex = 1;
  for (let i = 0; i < 6; i++) {
    const weekRow = document.createElement('tr');

    for (let j = 0; j < 7; j++) {
      const dateCell = document.createElement('td');

      if (i === 0 && j < firstDay) {
        // Empty cells before the first day of the month
        weekRow.appendChild(dateCell);
      } else if (dateIndex <= totalDays) {
        // Render date and events
        dateCell.textContent = dateIndex;

        if (
          dateIndex === currentDate.getDate() &&
          currentMonth === currentDate.getMonth() &&
          currentYear === currentDate.getFullYear()
        ) {
          dateCell.classList.add('currentMonth');
        }

        const eventContainer = document.createElement('div');
        eventContainer.classList.add('eventContainer');

        for (let k = 0; k < events.length; k++) {
          const event = events[k];
          const eventStart = new Date(`${event.startDate}T${event.startTime || '00:00'}`);
          const eventEnd = new Date(`${event.endDate}T${event.endTime || '23:59'}`);

          if (
            dateIndex >= eventStart.getDate() &&
            dateIndex <= eventEnd.getDate() &&
            currentMonth === eventStart.getMonth() &&
            currentYear === eventStart.getFullYear()
          ) {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.textContent = event.title;
            eventElement.style.backgroundColor = '#ba0c2f';

            eventElement.addEventListener('click', (e) => {
              e.stopPropagation();
              openEventDetails(event, dateCell);
            });

            eventContainer.appendChild(eventElement);
          }
        }

        dateCell.appendChild(eventContainer);
        weekRow.appendChild(dateCell);
        dateIndex++;
      } else {
        // Empty cells after the last day of the month
        weekRow.appendChild(dateCell);
      }
    }

    datesTable.appendChild(weekRow);

    // Break the loop if all days have been rendered
    if (dateIndex > totalDays) {
      break;
    }
  }

  datesContainer.appendChild(datesTable);
}

// Update openEventDetails to show "All Day" if no times
function openEventDetails(event, cell) {
  if (popupOpen) {
    return;
  }

  const popup = document.createElement('div');
  popup.classList.add('eventPopup');

  const titleElement = document.createElement('h3');
  titleElement.textContent = event.title;

  const dateElement = document.createElement('p');
  dateElement.textContent = `Date: ${event.startDate}`;

  let timeElement = document.createElement('p');
  if (event.startTime) {
    const startTime = formatTime12Hr(event.startTime);
    const endTime = formatTime12Hr(event.endTime || event.startTime);
    timeElement.textContent = `Time: ${startTime} - ${endTime}`;
  } else {
    timeElement.textContent = `Time: All Day`;
  }

  const descriptionElement = document.createElement('p');
  descriptionElement.innerHTML = `Description: ${event.description}`;

  const addButton = document.createElement('button');
  addButton.textContent = 'Add to Calendar';
  addButton.addEventListener('click', () => {
    generateICSFile(event);
  });

  popup.appendChild(titleElement);
  popup.appendChild(dateElement);
  popup.appendChild(timeElement);
  popup.appendChild(descriptionElement);
  popup.appendChild(addButton);

  const rect = cell.getBoundingClientRect();
  popup.style.top = `${rect.top + window.pageYOffset}px`;
  popup.style.left = `${rect.left + window.pageXOffset}px`;

  document.body.appendChild(popup);
  popupOpen = true;

  // Close the popup when clicking outside the popup area
  document.addEventListener('click', (event) => {
    if (!popup.contains(event.target)) {
      document.body.removeChild(popup);
      popupOpen = false;
    }
  });
}
// Event listeners for prev/next month buttons
const prevMonthBtn = document.getElementById('prevMonthBtn');
prevMonthBtn.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

const nextMonthBtn = document.getElementById('nextMonthBtn');
nextMonthBtn.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

renderCalendar();
