// Mobile navigation, active section links, and contact form validation.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll(".nav-link");

// Open and close the mobile navigation menu.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

// Close the mobile menu after a navigation link is selected.
navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// Highlight the navigation link for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navAnchors.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isActive);
      });
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((section) => sectionObserver.observe(section));

// Keep the copyright year current.
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form validation. This is a front-end demo only: no data is sent.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const validators = {
  name: (value) => value.trim().length >= 2 ? "" : "Please enter at least 2 characters for your name.",
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email address.",
  subject: (value) => value.trim().length >= 3 ? "" : "Please enter a subject (at least 3 characters).",
  message: (value) => value.trim().length >= 10 ? "" : "Please enter a message of at least 10 characters."
};

function showFieldError(fieldName, message) {
  const field = document.getElementById(fieldName);
  const error = document.getElementById(`${fieldName}Error`);
  error.textContent = message;
  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
}

Object.keys(validators).forEach((fieldName) => {
  const field = document.getElementById(fieldName);
  field.addEventListener("input", () => {
    showFieldError(fieldName, validators[fieldName](field.value));
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let isValid = true;

  Object.keys(validators).forEach((fieldName) => {
    const message = validators[fieldName](document.getElementById(fieldName).value);
    showFieldError(fieldName, message);
    if (message) isValid = false;
  });

  if (!isValid) {
    formStatus.textContent = "Please correct the highlighted fields and try again.";
    formStatus.className = "form-status error";
    const firstInvalid = contactForm.querySelector(".invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  formStatus.textContent = "Thanks! Your details passed the demo validation. This static page does not send your message; connect a backend or form service to receive submissions.";
  formStatus.className = "form-status success";
  contactForm.reset();
  Object.keys(validators).forEach((fieldName) => showFieldError(fieldName, ""));
});
