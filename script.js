const deg = 6;
const hr = document.querySelector("#hr");
const mn = document.querySelector("#mn");
const sc = document.querySelector("#sc");
setInterval(() => {
  let day = new Date();
  let hh = day.getHours() * 30;
  let mm = day.getMinutes() * deg;
  let ss = day.getSeconds() * deg;
  hr.style.transform = `rotateZ(${hh + mm / 12}deg)`;
  mn.style.transform = `rotateZ(${mm}deg)`;
  sc.style.transform = `rotateZ(${ss}deg)`;
});

// Function to get the current date in the desired format
function getCurrentDate() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const day = days[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  return `${day}, ${month} ${date}, ${year}`;
}

// Update the current date element
document.getElementById("currentDate").textContent = getCurrentDate();

function updateClock() {
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();
  var ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format hours, minutes, and seconds to have leading zeros if needed
  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");

  // Display the current time in the format 00:00:00 AM/PM
  var currentTimeString = hours + ":" + minutes + ":" + seconds + " " + ampm;
  document.getElementById("currentTime").textContent = currentTimeString;

  // Check for holidays
  var holidays = ["2023-07-04", "2023-12-25"]; // Example holidays
  var currentDate = new Date().toISOString().slice(0, 10);
  if (holidays.includes(currentDate)) {
    document.getElementById("holidayMessage").textContent =
      "Today is a holiday!";
  } else {
    document.getElementById("holidayMessage").textContent = "";
  }
}
/**Check for holidays
  var holidays = ['2023-07-04', '2023-12-25']; // Example holidays
  var currentDate = new Date().toISOString().slice(0, 10);
  if (holidays.includes(currentDate)) {
    document.getElementById('holidayMessage').textContent = 'Today is a holiday!';
  } else {
    document.getElementById('holidayMessage').textContent = '';
  }
} */

// Update the clock every second
setInterval(updateClock, 1000);
