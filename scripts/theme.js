(function () {
  var root = document.documentElement;

  // Theme toggle (initial theme is set by the inline snippet in <head>)
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.classList.add("theme-anim");
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      setTimeout(function () {
        root.classList.remove("theme-anim");
      }, 450);
    });
  }

  // Follow the OS theme until the visitor picks one manually
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (e) {
        try {
          if (localStorage.getItem("theme")) return;
        } catch (err) {}
        root.setAttribute("data-theme", e.matches ? "dark" : "light");
      });
  }

  // Mobile menu
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el, i) {
      el.style.setProperty("--d", (i % 4) * 70 + "ms");
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // Project search
  var search = document.querySelector(".search");
  if (search) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
    var count = document.querySelector(".result-count");
    var empty = document.querySelector(".empty");
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var hit = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
        c.style.display = hit ? "" : "none";
        if (hit) shown++;
      });
      if (count) count.textContent = shown + " of " + cards.length + " projects";
      if (empty) empty.style.display = shown ? "none" : "block";
    });
  }

  // Contact form -> opens the visitor's mail app with the message filled in
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body =
        d.get("message") + "\n\n— " + d.get("name") + " (" + d.get("email") + ")";
      window.location.href =
        "mailto:franciscoalfarobusiness@gmail.com?subject=" +
        encodeURIComponent("Hello from " + d.get("name")) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  // Broken project image -> gradient fallback with the first letter
  document.querySelectorAll(".card-media img").forEach(function (img) {
    img.addEventListener("error", function () {
      var f = document.createElement("div");
      f.className = "fallback";
      f.textContent = img.alt ? img.alt.charAt(0) : "•";
      img.replaceWith(f);
    });
  });
})();
