(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const field = document.getElementById("jellyfish-field");
  if (field) {
    const jellySvg = `
      <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <ellipse cx="32" cy="22" rx="18" ry="14" fill="rgba(215,240,234,0.55)"/>
        <path d="M18 28c2 10 4 22 5 34M26 30c1 12 2 24 2 34M32 31c0 12 0 24 0 34M38 30c-1 12-2 24-2 34M46 28c-2 10-4 22-5 34"
          stroke="rgba(215,240,234,0.45)" stroke-width="1.4" stroke-linecap="round"/>
        <ellipse cx="26" cy="18" rx="3" ry="2" fill="rgba(126,184,173,0.7)"/>
        <ellipse cx="38" cy="20" rx="2.5" ry="1.8" fill="rgba(126,184,173,0.55)"/>
      </svg>`;

    const count = window.matchMedia("(max-width: 700px)").matches ? 4 : 7;
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement("div");
      el.className = "jelly";
      el.style.setProperty("--size", `${48 + Math.random() * 70}px`);
      el.style.setProperty("--dur", `${10 + Math.random() * 10}s`);
      el.style.setProperty("--delay", `${-Math.random() * 8}s`);
      el.style.left = `${8 + Math.random() * 84}%`;
      el.style.top = `${10 + Math.random() * 75}%`;
      el.innerHTML = jellySvg;
      field.appendChild(el);
    }
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // Twitch parent must match the host — fix embed when opened via file or custom host
  const frame = document.querySelector(".stream-frame iframe");
  if (frame) {
    const host = location.hostname || "localhost";
    const parents = new Set(["localhost", "127.0.0.1", "oh-barbara.com", "www.oh-barbara.com", host]);
    const parentQuery = [...parents].map((p) => `parent=${encodeURIComponent(p)}`).join("&");
    frame.src = `https://player.twitch.tv/?channel=oh_barbara&${parentQuery}&muted=true`;
  }
})();
