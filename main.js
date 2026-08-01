/* GRUPO PÁEZ — motor de scroll inmersivo (sin dependencias) */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("done"), 900);
  });
  // Fallback si load tarda
  setTimeout(() => preloader.classList.add("done"), 3200);

  /* ---------- Header + barra de progreso ---------- */
  const header = document.getElementById("siteHeader");
  const progressBar = document.getElementById("progressBar");

  /* ---------- Manifiesto: palabras que se encienden con el scroll ---------- */
  const manifestoText = document.getElementById("manifestoText");
  let words = [];
  if (manifestoText) {
    const walk = (node) => {
      const out = [];
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((piece) => {
            if (/^\s+$/.test(piece) || piece === "") {
              frag.appendChild(document.createTextNode(piece));
            } else {
              const span = document.createElement("span");
              span.className = "w";
              span.textContent = piece;
              frag.appendChild(span);
              out.push(span);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          out.push(...walk(child));
        }
      });
      return out;
    };
    words = walk(manifestoText);
  }

  /* ---------- Reveals con IntersectionObserver ---------- */
  // Revelado por posición, no por IntersectionObserver: un salto instantáneo
  // (ancla, scroll brusco) puede llevar una sección de "debajo" a "encima" sin
  // que el ratio de intersección cambie nunca, y el observer jamás dispara.
  let pending = Array.from(document.querySelectorAll("[data-project], [data-step], [data-reveal]"));
  let pendingStats = Array.from(document.querySelectorAll(".stat"));

  const runCounter = (stat) => {
    const target = parseInt(stat.dataset.count, 10);
    const suffix = stat.dataset.suffix || "";
    const numEl = stat.querySelector(".stat-num");
    // Sin rAF (pestaña oculta) la animación nunca avanza: mostrar el valor final.
    if (document.hidden || reduceMotion) {
      numEl.textContent = target + suffix;
      return;
    }
    const t0 = performance.now();
    const dur = 1600;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      numEl.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Totales de la memoria de obra: mismo contador, distinto marcado
  let pendingTotals = Array.from(document.querySelectorAll(".rt"));
  const runTotal = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const numEl = el.querySelector(".rt-num");
    if (document.hidden || reduceMotion) {
      numEl.textContent = target.toLocaleString("es-DO") + suffix;
      return;
    }
    const t0 = performance.now();
    const dur = 1900;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      numEl.textContent = Math.round(target * eased).toLocaleString("es-DO") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const revealPass = () => {
    const trigger = window.innerHeight * 0.85;
    if (pending.length) {
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top >= trigger) return true;
        el.classList.add("in-view");
        return false;
      });
    }
    if (pendingStats.length) {
      pendingStats = pendingStats.filter((el) => {
        if (el.getBoundingClientRect().top >= trigger) return true;
        runCounter(el);
        return false;
      });
    }
    if (pendingTotals.length) {
      pendingTotals = pendingTotals.filter((el) => {
        if (el.getBoundingClientRect().top >= trigger) return true;
        runTotal(el);
        return false;
      });
    }
  };

  /* ---------- Filtros de la memoria de obra ---------- */
  const filterBtns = Array.from(document.querySelectorAll(".rf"));
  const records = Array.from(document.querySelectorAll(".rec"));
  const emptyMsg = document.getElementById("recordEmpty");
  if (filterBtns.length && records.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
        let shown = 0;
        records.forEach((rec) => {
          const match = f === "todos" || rec.dataset.tags.split(" ").includes(f);
          rec.classList.toggle("is-hidden", !match);
          if (match) shown++;
        });
        if (emptyMsg) emptyMsg.hidden = shown > 0;
      });
    });
  }

  /* ---------- Nav de capítulos ---------- */
  const navLinks = Array.from(document.querySelectorAll(".chapter-nav a"));
  const sections = navLinks
    .map((a) => document.getElementById(a.dataset.chapter))
    .filter(Boolean);
  const chapterNav = document.getElementById("chapterNav");
  const darkSections = new Set(["manifiesto", "metodo"]);

  /* ---------- Parallax + scroll unificado en rAF ---------- */
  const parallaxEls = Array.from(document.querySelectorAll("[data-parallax]"));
  let ticking = false;

  const onScroll = () => {
    // Fuera del rAF: en pestañas ocultas rAF no corre y el contenido
    // se quedaría invisible hasta que el usuario vuelva y haga scroll.
    revealPass();
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight - vh;

      // Barra de progreso
      progressBar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";

      // Header
      header.classList.toggle("scrolled", y > vh * 0.6);

      // Parallax
      if (!reduceMotion) {
        parallaxEls.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax) || 0.1;
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > vh) return;
          const center = rect.top + rect.height / 2 - vh / 2;
          el.style.transform = "translateY(" + (-center * speed).toFixed(1) + "px)";
        });
      }

      // Manifiesto: encender palabras
      if (words.length) {
        const rect = manifestoText.getBoundingClientRect();
        const start = vh * 0.85;
        const end = vh * 0.25;
        const p = Math.min(Math.max((start - rect.top) / (start - end + rect.height), 0), 1);
        const lit = Math.floor(p * words.length);
        words.forEach((w, i) => w.classList.toggle("lit", i <= lit));
      }

      // Capítulo activo
      let active = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= vh * 0.5) active = i;
      });
      navLinks.forEach((a, i) => a.classList.toggle("active", i === active));
      chapterNav.classList.toggle("on-dark", darkSections.has(sections[active] && sections[active].id));
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", onScroll);
  document.addEventListener("visibilitychange", onScroll);
  onScroll();

  /* ---------- Botones magnéticos ---------- */
  if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + dx * 0.18 + "px," + dy * 0.22 + "px)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }
})();
