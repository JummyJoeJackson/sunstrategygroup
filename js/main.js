/* Sun Strategy Group — shared behaviour
   Header scroll state, mobile nav, scroll reveals, team headshot fallback,
   contact form → mailto, service tooltips. */

(function () {
  "use strict";

  /* ---------- Service glossary ----------
     Summaries shown when a visitor hovers, focuses, or taps a service chip.
     Keys are matched against the chip's own label, so adding a chip that
     reuses one of these names picks up its summary with no other changes.
     A chip can also carry its own data-tip="..." to override the glossary. */

  var SERVICE_GLOSSARY = {
    /* Practice areas */
    "business strategy & growth":
      "Building a clear picture of where your business is headed and the concrete steps to get there.",
    "business strategy":
      "Building a clear picture of where your business is headed and the concrete steps to get there.",
    "pricing strategy & optimization":
      "Setting prices that reflect what your customers value and what the market will support.",
    "pricing strategy":
      "Setting prices that reflect what your customers value and what the market will support.",
    "market sizing & opportunity analysis":
      "Measuring how much real demand exists in a market before you commit time and money to it.",
    "marketing & brand strategy":
      "Shaping how your business presents itself and reaches the customers you actually want.",
    "operational efficiency & process improvement":
      "Finding the friction in how your business runs day to day, and removing it.",
    "operational efficiency":
      "Getting more out of the resources you already have by streamlining how the work gets done.",

    /* Business strategy & growth */
    "market research":
      "Gathering data on your customers, competitors, and industry so decisions rest on evidence rather than guesswork.",
    "competitive analysis":
      "Mapping who you are up against, what they do well, and where the openings are for you.",
    "strategic planning & execution":
      "Turning long term goals into a concrete roadmap with owners, timelines, and measurable milestones.",
    "market segmentation":
      "Dividing your customer base into distinct groups so each one can be reached with the right offer.",

    /* Pricing */
    "pricing analysis & benchmarking":
      "Reviewing your current prices against your costs, your margins, and what comparable businesses charge.",
    "competitive pricing analysis":
      "Studying how competitors price their offerings to find room to position yours.",
    "pricing model selection and implementation":
      "Choosing the pricing structure that fits your business and putting it into practice.",

    /* Market sizing & opportunity */
    "market sizing":
      "Estimating the total demand available in a market, and how much of it your business can realistically capture.",
    "market entry strategy":
      "Planning how and where to enter a new market, from location and timing to positioning.",
    "current competitor analysis":
      "A close look at the businesses already serving your target market and how they operate.",
    "consumer demand forecasts":
      "Projecting how many customers you can expect and when, so you can plan capacity and spend.",
    "demand forecasting":
      "Projecting how many customers you can expect and when, so you can plan capacity and spend.",

    /* Marketing & brand */
    "social media marketing":
      "Building and running the channels where your customers already spend their attention.",
    "content creation":
      "Producing the posts, copy, and visuals that carry your brand to your audience.",
    "brand development":
      "Defining your identity, voice, and visual language so your business reads as consistent and recognisable.",
    "marketing analytics":
      "Measuring which marketing efforts actually bring in customers, so budget goes where it works.",
    "website design + implementation":
      "Designing and building a site that reflects your brand and turns visitors into enquiries.",

    /* Operations */
    "process analysis":
      "Breaking down how work actually flows through your business to find delays, gaps, and duplicated effort.",
    "workflow optimization":
      "Redesigning day to day processes so the same work takes less time and fewer handoffs.",
    "process improvement":
      "Refining existing procedures to cut waste and raise the quality of what comes out the other end.",
    "performance measurement":
      "Defining the metrics that show whether operations are improving, and tracking them consistently.",
    "problem solving frameworks":
      "Structured approaches your team can reuse to break down and work through complex problems.",
  };

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

  /* ---------- Reviews Carousel ---------- */

  var carousel = document.getElementById("reviews-carousel");
  var dotsContainer = document.getElementById("reviews-dots");
  if (carousel && dotsContainer) {
    var dots = dotsContainer.querySelectorAll(".carousel-dot");

    // Click handler for dots
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var slideIndex = parseInt(dot.getAttribute("data-slide"), 10);
        if (isNaN(slideIndex)) return;

        // Scroll to corresponding slide
        carousel.scrollTo({
          left: slideIndex * carousel.clientWidth,
          behavior: "smooth",
        });

        // Set active dot immediately
        updateActiveDot(slideIndex);
      });
    });

    // Scroll listener to update dots on swipe
    var scrollTimeout;
    carousel.addEventListener("scroll", function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        if (carousel.clientWidth > 0) {
          var activeIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
          updateActiveDot(activeIndex);
        }
      }, 60);
    }, { passive: true });

    function updateActiveDot(index) {
      dots.forEach(function (dot, i) {
        if (i === index) {
          dot.classList.add("is-active");
          dot.setAttribute("aria-label", "Go to review " + (i + 1) + " (current slide)");
        } else {
          dot.classList.remove("is-active");
          dot.setAttribute("aria-label", "Go to review " + (i + 1));
        }
      });
    }
  }

  /* ---------- Service tooltips ----------
     Attaches a summary bubble to every service chip whose label appears in
     SERVICE_GLOSSARY. Works on hover, keyboard focus, and tap. */

  var tipTargets = document.querySelectorAll(
    ".offer-list li, .service-box, [data-tip]"
  );

  if (tipTargets.length) {
    var normalize = function (text) {
      return text
        .replace(/\s+/g, " ")
        .trim()
        .replace(/[.,;:]+$/, "")
        .toLowerCase();
    };

    var bubble = document.createElement("div");
    bubble.className = "tip-bubble";
    bubble.id = "service-tip";
    bubble.setAttribute("role", "tooltip");

    var termEl = document.createElement("span");
    termEl.className = "tip-term";
    var textEl = document.createElement("span");
    bubble.append(termEl, textEl);
    document.body.appendChild(bubble);

    var activeTrigger = null;
    var lastPointerType = "mouse";

    var place = function (trigger) {
      var rect = trigger.getBoundingClientRect();
      var width = bubble.offsetWidth;
      var height = bubble.offsetHeight;
      var gap = 10;
      var margin = 12;

      var top = rect.top - height - gap;
      var below = top < margin;
      if (below) top = rect.bottom + gap;

      var left = rect.left + rect.width / 2 - width / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));

      bubble.classList.toggle("is-below", below);
      bubble.style.top = Math.round(top) + "px";
      bubble.style.left = Math.round(left) + "px";

      var arrowX = rect.left + rect.width / 2 - left;
      arrowX = Math.max(14, Math.min(arrowX, width - 14));
      bubble.style.setProperty("--arrow-x", Math.round(arrowX) + "px");
    };

    var hideTip = function () {
      if (!activeTrigger) return;
      activeTrigger.classList.remove("is-tip-open");
      activeTrigger.removeAttribute("aria-describedby");
      activeTrigger = null;
      bubble.classList.remove("is-open");
    };

    var showTip = function (trigger) {
      if (activeTrigger === trigger) return;
      hideTip();

      termEl.textContent = trigger.textContent.replace(/\s+/g, " ").trim();
      textEl.textContent = trigger.getAttribute("data-tip");

      place(trigger);
      bubble.classList.add("is-open");

      trigger.classList.add("is-tip-open");
      trigger.setAttribute("aria-describedby", bubble.id);
      activeTrigger = trigger;
    };

    tipTargets.forEach(function (trigger) {
      var summary =
        trigger.getAttribute("data-tip") ||
        SERVICE_GLOSSARY[normalize(trigger.textContent)];
      if (!summary) return;

      trigger.setAttribute("data-tip", summary);
      trigger.classList.add("has-tip");
      // Focusable so the summary is reachable without a pointer.
      if (!trigger.hasAttribute("tabindex")) trigger.setAttribute("tabindex", "0");

      var openBeforeTap = false;

      trigger.addEventListener("pointerenter", function (event) {
        lastPointerType = event.pointerType || "mouse";
        if (lastPointerType === "mouse") showTip(trigger);
      });

      trigger.addEventListener("pointerleave", function (event) {
        if ((event.pointerType || "mouse") === "mouse") hideTip();
      });

      trigger.addEventListener("pointerdown", function (event) {
        lastPointerType = event.pointerType || "mouse";
        openBeforeTap = activeTrigger === trigger;
      });

      // Touch and pen: tap to toggle, since there is no hover. Focus fires
      // first and opens the bubble, so only a tap on an already-open chip closes it.
      trigger.addEventListener("click", function (event) {
        if (lastPointerType === "mouse") return;
        event.stopPropagation();
        if (openBeforeTap) hideTip();
        else showTip(trigger);
      });

      trigger.addEventListener("focus", function () {
        showTip(trigger);
      });

      trigger.addEventListener("blur", hideTip);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") hideTip();
    });

    document.addEventListener("click", function () {
      if (lastPointerType !== "mouse") hideTip();
    });

    window.addEventListener(
      "scroll",
      function () {
        if (activeTrigger) place(activeTrigger);
      },
      { passive: true }
    );

    window.addEventListener("resize", function () {
      if (activeTrigger) place(activeTrigger);
    });
  }
})();
