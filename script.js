/* ===== Helpers ===== */
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
const throttle = (fn, t = 100) => {
  let wait = false;
  return (...a) => !wait && ((wait = true), fn(...a), setTimeout(() => (wait = false), t));
};

/* ===== Navbar & Menu ===== */
const navbar = $("#navbar");
const mobileMenu = $("#mobile-menu");
const navMenu = $("#nav-menu");
const navLinks = $$(".nav-link");

on(mobileMenu, "click", () => {
  mobileMenu.classList.toggle("active");
  navMenu.classList.toggle("active");
});

navLinks.forEach((l) =>
  on(l, "click", (e) => {
    e.preventDefault();
    mobileMenu.classList.remove("active");
    navMenu.classList.remove("active");
    const t = $(l.getAttribute("href"));
    t && window.scrollTo({ top: t.offsetTop - 70, behavior: "smooth" });
  })
);

/* ===== Scroll Effects ===== */
const setActiveLink = () => {
  const y = window.scrollY + 100;
  $$("section").forEach((s) => {
    if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
      navLinks.forEach((l) =>
        l.classList.toggle("active", l.getAttribute("href") === `#${s.id}`)
      );
    }
  });
};

on(window, "scroll", throttle(() => {
  navbar.classList.toggle("scrolled", window.scrollY > 100);
  setActiveLink();
}, 100));

/* ===== Intersection Animations ===== */
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.style.animation = "fadeInUp .8s ease forwards";

      if (e.target.classList.contains("skill-item")) {
        const bar = e.target.querySelector(".skill-progress");
        setTimeout(() => (bar.style.width = bar.dataset.width + "%"), 200);
      }

      if (e.target.classList.contains("stat-item")) {
        const el = e.target.querySelector(".stat-number");
        let c = 0,
          t = +el.dataset.count,
          i = setInterval(() => {
            el.textContent = Math.min((c += t / 100) | 0, t);
            c >= t && clearInterval(i);
          }, 20);
      }
    }),
  { threshold: 0.1, rootMargin: "0px 0px -50px" }
);

$$(
  ".about-card,.timeline-item,.skill-item,.project-card,.contact-item,.stat-item"
).forEach((el) => observer.observe(el));

/* ===== Typing Effect ===== */
function initTyping() {
  const el = $(".hero-role");
  if (!el) return;
  const roles = ["Full-Stack Developer", "UI/UX Designer", "Problem Solver"];
  let r = 0,
    c = 0,
    del = false;

  (function type() {
    el.textContent = roles[r].slice(0, c += del ? -1 : 1);
    if (!del && c === roles[r].length) del = true;
    else if (del && c === 0) (del = false), (r = (r + 1) % roles.length);
    setTimeout(type, del ? 50 : 100);
  })();
}

/* ===== Scroll To Top ===== */
function initScrollTop() {
  const b = document.body.appendChild(document.createElement("button"));
  b.className = "scroll-to-top";
  b.innerHTML = "↑";
  on(window, "scroll", () => (b.style.opacity = window.scrollY > 300 ? 1 : 0));
  on(b, "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ===== Dark Mode ===== */
function initDarkMode() {
  const b = document.body.appendChild(document.createElement("button"));
  b.innerHTML = "🌙";
  on(b, "click", () => document.body.classList.toggle("dark-mode"));
}

/* ===== Lazy Images ===== */
function initLazy() {
  const io = new IntersectionObserver((e) =>
    e.forEach((i) => {
      if (!i.isIntersecting) return;
      i.target.src = i.target.dataset.src;
      io.unobserve(i.target);
    })
  );
  $$("img[data-src]").forEach((img) => io.observe(img));
}

/* ===== Init ===== */
document.addEventListener("DOMContentLoaded", () => {
  initTyping();
  initScrollTop();
  initDarkMode();
  initLazy();
});
