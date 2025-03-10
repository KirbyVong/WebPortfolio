document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-item");

  // Toggle menu when clicking the button
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".side-nav")) {
      navLinks.classList.remove("show");
    }
  });

  // Close menu when clicking a nav item
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("show");
      }
    });
  });

  // Highlight active section in navigation
  const sections = document.querySelectorAll("section[id]");
  let isManualScroll = false;
  let currentSection = null;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -30% 0px",
    threshold: 0.3,
  };

  function highlightNavItem(entries) {
    if (isManualScroll) return;

    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const navItem = document.querySelector(
        `.nav-item[href="#${id === "socials" ? "about" : id}"]`
      );

      if (entry.isIntersecting && navItem) {
        // Only update if the section is significantly visible
        if (!currentSection || entry.intersectionRatio >= 0.3) {
          currentSection = entry;
          navItems.forEach((item) => item.classList.remove("active"));
          navItem.classList.add("active");
        }
      }
    });
  }

  const observer = new IntersectionObserver(highlightNavItem, observerOptions);
  sections.forEach((section) => observer.observe(section));

  // Smooth scroll to section when clicking nav items
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = item.getAttribute("href");

      // If clicking About Me, scroll to socials section instead
      const targetSection = document.querySelector(
        targetId === "#about" ? "#socials" : targetId
      );

      // Set manual scroll flag
      isManualScroll = true;
      currentSection = null;

      // Update active state immediately
      navItems.forEach((navItem) => navItem.classList.remove("active"));
      item.classList.add("active");

      targetSection.scrollIntoView({ behavior: "smooth" });

      // Reset manual scroll flag after animation
      setTimeout(() => {
        isManualScroll = false;
      }, 1000);
    });
  });

  // Reset current section on scroll end
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        currentSection = null;
      }, 150);
    },
    { passive: true }
  );
});
