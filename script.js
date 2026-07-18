// 스크롤 리빌 애니메이션
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");

  const groups = new Map();
  revealEls.forEach((el) => {
    const parent = el.parentElement;
    const key = parent && (parent.classList.contains("skills-grid") || parent.classList.contains("projects-grid"))
      ? parent
      : el;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });
  groups.forEach((els) => {
    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.12}s`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

// 히어로 타이핑 효과
(function initTyping() {
  const titleEl = document.querySelector("[data-typing]");
  if (!titleEl) return;
  const text = titleEl.getAttribute("data-typing") || "";
  const textSpan = titleEl.querySelector(".typing-text");
  let i = 0;

  function typeNext() {
    if (i <= text.length) {
      textSpan.textContent = text.slice(0, i);
      i++;
      setTimeout(typeNext, 160);
    }
  }
  typeNext();
})();

// 기술 스택 모달
(function initSkillModals() {
  const triggers = document.querySelectorAll("[data-modal-target]");
  const modals = document.querySelectorAll("[data-modal]");
  let activeModal = null;

  modals.forEach((modal) => {
    modal.querySelectorAll(".tool-item, .teaching-item").forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.09}s`;
    });
  });

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    activeModal = modal;
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    activeModal = null;
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = document.getElementById(trigger.getAttribute("data-modal-target"));
      openModal(target);
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
    modal.querySelectorAll("[data-modal-close]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(modal));
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeModal) closeModal(activeModal);
  });
})();

// AI 네트워크 파티클 배경
(function initAiNetwork() {
  const canvas = document.getElementById("ai-net");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  let width, height, nodes;

  const colors = ["#7c3aed", "#ec4899", "#06b6d4"];

  function resize() {
    width = canvas.width = hero.clientWidth;
    height = canvas.height = hero.clientHeight;
  }

  function createNodes() {
    const count = Math.max(24, Math.floor((width * height) / 22000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130;
        if (dist < maxDist) {
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.18 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.fillStyle = n.color;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(step);
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  resize();
  createNodes();
  requestAnimationFrame(step);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createNodes();
    }, 200);
  });
})();
