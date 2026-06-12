/* Sun Strategy Group — shared behaviour
   Header scroll state, mobile nav, scroll reveals,
   team headshot fallback, contact form → mailto. */

(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var closeNav = function () {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  /* ---------- Scroll reveals ---------- */

  var revealEls = document.querySelectorAll("[data-reveal]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Team headshot fallback ----------
     If a headshot image is missing from /images, swap it for a
     styled initials avatar so the card never shows a broken image.
     Real photos take over automatically once the files exist. */

  document.querySelectorAll(".member-photo img").forEach(function (img) {
    var swapToInitials = function () {
      var name = img.getAttribute("data-name") || "";
      var initials = name
        .split(/\s+/)
        .filter(Boolean)
        .map(function (word) {
          return word.charAt(0).toUpperCase();
        })
        .slice(0, 2)
        .join("");
      var fallback = document.createElement("span");
      fallback.className = "avatar-fallback";
      fallback.setAttribute("aria-hidden", "true");
      fallback.textContent = initials;
      img.replaceWith(fallback);
    };

    if (img.complete && img.naturalWidth === 0) {
      swapToInitials();
    } else {
      img.addEventListener("error", swapToInitials);
    }
  });

  /* ---------- Contact form → mailto compose ---------- */

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var get = function (fieldName) {
        var field = form.elements[fieldName];
        return field ? field.value.trim() : "";
      };

      var name = get("name");
      var email = get("email");
      var company = get("company");
      var message = get("message");

      var subject =
        "Consultation inquiry from " + name + (company ? " — " + company : "");
      var body = [
        "Name: " + name,
        "Email: " + email,
        "Company: " + (company || "—"),
        "",
        message,
      ].join("\r\n");

      window.location.href =
        "mailto:sunstrategygroup@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      var note = document.querySelector(".form-after");
      if (note) note.hidden = false;
    });
  }
})();
