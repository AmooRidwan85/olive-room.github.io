
"use strict";

/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.textContent = isOpen ? "×" : "☰";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
  });
});


/* INTERACTIVE MENU FILTERS */

const menuTabs = document.getElementById("menuTabs");
const menuCards = document.querySelectorAll(".menu-card");

menuTabs.addEventListener("click", event => {
  const button = event.target.closest("[data-menu]");
  if (!button) return;

  const category = button.dataset.menu;

  document.querySelectorAll(".menu-tab").forEach(tab => {
    tab.classList.toggle("active", tab === button);
  });

  menuCards.forEach(card => {
    const matches = category === "all" ||
      card.dataset.category === category;

    card.hidden = !matches;
  });
});


/* RESERVATION DATE VALIDATION */

const visitDate = document.getElementById("visitDate");

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

visitDate.min = getLocalDateString();


/* RESERVATION FORM */

const reservationForm = document.getElementById("reservationForm");
const reservationMessage = document.getElementById("reservationMessage");

reservationForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!reservationForm.reportValidity()) return;

  const formData = new FormData(reservationForm);
  const selectedDate = formData.get("visitDate");

  if (selectedDate < getLocalDateString()) {
    reservationMessage.textContent = "Please select today or a future date.";
    return;
  }

  const reservation = {
    reference: "OR-" + Date.now().toString().slice(-7),
    name: formData.get("guestName"),
    email: formData.get("guestEmail"),
    phone: formData.get("guestPhone"),
    guests: formData.get("guestCount"),
    date: selectedDate,
    time: formData.get("visitTime"),
    message: formData.get("guestMessage"),
    status: "Awaiting confirmation",
    createdAt: new Date().toISOString()
  };

  // This is a browser-only demo request.
  // A real restaurant needs a secure reservation backend.
  try {
    const previous = JSON.parse(
      localStorage.getItem("oliveRoomReservations") || "[]"
    );

    if (!Array.isArray(previous)) {
      throw new Error("Invalid reservation data");
    }

    previous.push(reservation);

    localStorage.setItem(
      "oliveRoomReservations",
      JSON.stringify(previous)
    );

    reservationMessage.textContent =
      `Your sample request ${reservation.reference} has been recorded in this browser. It is not a confirmed reservation.`;

    reservationForm.reset();
    visitDate.min = getLocalDateString();

    showToast("Demo reservation request saved.");
  } catch {
    reservationMessage.textContent =
      "We couldn't save this demo request. Please try again.";
  }
});


/* SCROLL REVEAL ANIMATIONS */

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});


/* TOAST MESSAGE */

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}


/* FOOTER YEAR */

document.getElementById("year").textContent =
  new Date().getFullYear();


/* ACCESSIBILITY: ESCAPE CLOSES MOBILE MENU */

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    navigation.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
