const menuToggle = document.getElementById("menu-toggle");
const navList = document.getElementById("nav-list");
const themeToggle = document.getElementById("theme-toggle");
const progressBar = document.getElementById("scroll-progress-bar");
const typedText = document.getElementById("typed-text");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const revealElements = document.querySelectorAll(".reveal");
const skillCards = document.querySelectorAll(".skill-card");
const actionButtons = document.querySelectorAll(".js-btn");
const contactForm = document.getElementById("contact-form");

if (menuToggle && navList) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (themeToggle) {
  const themeIcon = themeToggle.querySelector("span");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const savedTheme = localStorage.getItem("theme");
  const enableLight = savedTheme ? savedTheme === "light" : prefersLight;

  const syncThemeIcon = (isLight) => {
    if (!themeIcon) return;
    themeIcon.textContent = isLight ? "◐" : "◑";
  };

  if (enableLight) {
    document.body.classList.add("light-theme");
  }

  syncThemeIcon(enableLight);

  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    syncThemeIcon(isLight);
  });
}

const typingWords = ["Frontend Developer", "UI Enthusiast", "JavaScript Developer"];
let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function runTypingAnimation() {
  if (!typedText) return;

  const currentWord = typingWords[wordIndex];

  if (isDeleting) {
    typedText.textContent = currentWord.substring(0, letterIndex--);
  } else {
    typedText.textContent = currentWord.substring(0, letterIndex++);
  }

  let speed = isDeleting ? 70 : 120;

  if (!isDeleting && letterIndex === currentWord.length + 1) {
    speed = 1200;
    isDeleting = true;
  }

  if (isDeleting && letterIndex < 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typingWords.length;
    speed = 240;
  }

  setTimeout(runTypingAnimation, speed);
}

runTypingAnimation();

function handleScrollProgress() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", handleScrollProgress, { passive: true });
handleScrollProgress();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      if (entry.target.classList.contains("skill-card")) {
        entry.target.classList.add("in-view");
      }

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((el) => revealObserver.observe(el));
skillCards.forEach((card) => revealObserver.observe(card));

function updateActiveNav() {
  let currentSectionId = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isActive = href === `#${currentSectionId}` || (currentSectionId === "home" && href === "#home");
    link.classList.toggle("active", isActive);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.add("clicked");
    setTimeout(() => button.classList.remove("clicked"), 180);
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thanks for reaching out. Your message has been prepared.");
    contactForm.reset();
  });
}
