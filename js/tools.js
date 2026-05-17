// Functions that should be accessible across multiple tabs go here (e.g. date formatting, PDF opening, etc)

function openPDF(path) {
    if (path !== "") {
        window.open(path, "_blank");
    }
}

function toggleResources() {
    const list = document.getElementById("resources-list");

    if (list.style.display === "block") {
        list.style.display = "none";
    } else {
        list.style.display = "block";
    }
}

function convertTo12Hour(time24) {
    const [hour, minute] = time24.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;
    if (h === 0) h = 12;

    return `${h}:${minute} ${ampm}`;
}

function convertTo24Hour(timeStr) {
    if (!timeStr) return "";

    const [time, modifier] = timeStr.split(" "); // "7:00", "PM"
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours);

    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
        hours = 0;
    }

    // format to HH:MM
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateWithYear(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatDateWithYearNoDOW(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function toggleDropdown(element) {
    const dropdown = element.parentElement;
    dropdown.classList.toggle("open");
}

function showToast(message, type) {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast");

    let icon = `<i class="fa-solid fa-check"></i>`;
    if (type === "error") {
        toast.classList.add("error");
        icon = `<i class="fa-solid fa-xmark"></i>`;
    }

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = "fadeOut 0.6s forwards";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}