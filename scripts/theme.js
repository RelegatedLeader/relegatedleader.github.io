(function () {
  var root = document.documentElement;
  var body = document.body;
  var reduce =
    window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- theme toggle ---- */
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.classList.add("theme-anim");
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      setTimeout(function () {
        root.classList.remove("theme-anim");
      }, 500);
    });
  }

  /* ---- mobile menu ---- */
  var menuBtn = document.querySelector(".menu-toggle");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open);
    });
  }

  /* ---- header state + scroll progress + parallax ---- */
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".progress");
  var media = Array.prototype.slice.call(
    document.querySelectorAll(".chapter-media img")
  );
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("solid", y > 40 || !body.classList.contains("has-hero"));
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(y / h, 1) : 0) + ")";
    }
    if (!reduce) {
      var vh = window.innerHeight;
      media.forEach(function (img) {
        var r = img.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
        img.style.transform = "translateY(" + (-p * 6).toFixed(2) + "%)";
      });
    }
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---- scroll reveal ---- */
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
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach(function (el) {
      var col = el.parentNode.classList.contains("grid")
        ? Array.prototype.indexOf.call(el.parentNode.children, el) % 3
        : 0;
      el.style.setProperty("--d", col * 90 + "ms");
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---- page transitions ---- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var url = a.href;
    if (!url || a.origin !== location.origin || a.hash || /\.pdf$/i.test(url)) return;
    if (url === location.href) return;
    e.preventDefault();
    body.classList.add("leaving");
    setTimeout(function () {
      location.href = url;
    }, 260);
  });
  window.addEventListener("pageshow", function () {
    body.classList.remove("leaving");
    body.classList.remove("menu-open");
  });

  /* ---- project search ---- */
  var search = document.querySelector(".search");
  if (search) {
    var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
    var count = document.querySelector(".result-count");
    var empty = document.querySelector(".empty");
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      tiles.forEach(function (t) {
        var hit = !q || t.textContent.toLowerCase().indexOf(q) !== -1;
        t.style.display = hit ? "" : "none";
        if (hit) shown++;
      });
      if (count) count.textContent = shown + " / " + tiles.length;
      if (empty) empty.style.display = shown ? "none" : "block";
    });
  }

  /* ---- contact form: sends through FormSubmit, falls back to the mail app ---- */
  var form = document.getElementById("contact-form");
  if (form) {
    var TO = "frankalfaro105@proton.me";
    // Paste a free access key from web3forms.com (sent to TO) for guaranteed delivery.
    var WEB3FORMS_KEY = "";
    var status = form.querySelector(".form-status");
    var btn = form.querySelector("button[type=submit]");
    var say = function (msg, ok) {
      status.textContent = msg;
      status.className = "form-status mono " + (ok ? "ok" : "err");
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      if (d.get("_honey")) return; // bot
      var name = d.get("name"),
        email = d.get("email"),
        message = d.get("message");
      btn.disabled = true;
      btn.textContent = "Sending…";
      say("", true);
      var payload = {
        name: name,
        email: email,
        message: message,
        subject: "Portfolio message from " + name,
        _subject: "Portfolio message from " + name,
        _replyto: email,
        _template: "table",
        _captcha: "false",
      };
      var url = "https://formsubmit.co/ajax/" + TO;
      if (WEB3FORMS_KEY) {
        url = "https://api.web3forms.com/submit";
        payload.access_key = WEB3FORMS_KEY;
      }
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (r) {
          return r.json().then(function (j) {
            return { ok: r.ok && String(j.success) !== "false", j: j };
          });
        })
        .then(function (res) {
          if (!res.ok) throw new Error("send failed");
          form.reset();
          say("Message sent. I'll reply to " + email + ".", true);
        })
        .catch(function () {
          say("Couldn't send it from here — opening your email app instead.", false);
          location.href =
            "mailto:" + TO + "?subject=" + encodeURIComponent("Message from " + name) +
            "&body=" + encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = "Send message";
        });
    });
  }

  /* ---- copy email ---- */
  document.querySelectorAll("[data-copy]").forEach(function (el) {
    el.addEventListener("click", function () {
      var v = el.getAttribute("data-copy");
      var done = function () {
        var old = el.textContent;
        el.textContent = "Copied";
        setTimeout(function () {
          el.textContent = old;
        }, 1400);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, function () {});
    });
  });

  /* ---- broken images -> quiet placeholder ---- */
  document.querySelectorAll(".tile-media img").forEach(function (img) {
    img.addEventListener("error", function () {
      var f = document.createElement("div");
      f.className = "fallback";
      f.textContent = (img.alt || "•").charAt(0);
      img.replaceWith(f);
    });
  });

  /* ---- hero starfield ---- */
  var cv = document.getElementById("stars");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d");
    var stars = [];
    var W = 0,
      H = 0,
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    var mx = 0,
      my = 0,
      tx = 0,
      ty = 0;
    var visible = true;

    function size() {
      var r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round((W * H) / 5500);
      stars = [];
      for (var i = 0; i < n; i++) {
        var z = Math.random();
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: z,
          r: 0.3 + z * 1.3,
          s: 0.05 + z * 0.25,
          p: Math.random() * 6.28,
          tw: 0.5 + Math.random() * 1.5,
        });
      }
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      mx += (tx - mx) * 0.04;
      my += (ty - my) * 0.04;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!reduce) {
          s.x -= s.s;
          if (s.x < -2) s.x = W + 2;
        }
        var x = s.x + mx * s.z * 40;
        var y = s.y + my * s.z * 40;
        var a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 1000 * s.tw + s.p));
        ctx.globalAlpha = a * (0.4 + s.z * 0.6);
        ctx.fillStyle = s.z > 0.85 ? "#cfe0ff" : "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function loop(t) {
      if (visible) draw(t);
      if (!reduce) requestAnimationFrame(loop);
    }
    size();
    window.addEventListener("resize", size);
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
      }).observe(cv);
    }
    if (reduce) draw(0);
    else requestAnimationFrame(loop);
  }
})();
