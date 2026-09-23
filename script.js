(() => {
  const SITE = "https://oh-barbara.com";
  const DEFAULT = {
    title: "oh_barbara",
    kicker: "Streamer & Model · Phuket",
    lead: "Lifestyle и fashion. Стримы Just Chatting & IRL.",
    docTitle: "oh_barbara — Streamer & Model",
    desc: "Ох_Барбара — стример и модель. Lifestyle & fashion из Пхукета. Twitch, Instagram, Telegram.",
    kw: "oh-barbara, oh_barbara, ох-барбара, Ох_Барбара, стример, модель, Twitch, Instagram, Пхукет, Just Chatting, IRL, lifestyle, fashion",
  };

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

  const host = location.hostname || "localhost";
  const parents = ["localhost", "127.0.0.1", "oh-barbara.com", "www.oh-barbara.com"];
  if (parents.indexOf(host) === -1) parents.push(host);

  const CHANNEL = "oh_barbara";

  function formatCount(n) {
    n = Math.max(0, Math.round(Number(n) || 0));
    if (n >= 1000000) {
      const v = n / 1000000;
      return (v >= 10 ? Math.round(v) : Math.round(v * 10) / 10) + "M";
    }
    if (n >= 1000) {
      const v = n / 1000;
      return (v >= 10 ? Math.round(v) : Math.round(v * 10) / 10).toString().replace(".", ",") + "K";
    }
    return String(n);
  }

  function mountTwitchEmbed(root) {
    if (!root || !window.Twitch || !Twitch.Embed) return;
    const w = Math.max(400, Math.floor(root.clientWidth || 960));
    const h = Math.max(300, Math.min(620, Math.round(w * 0.56) + (w >= 800 ? 0 : 320)));
    new Twitch.Embed("twitch-embed", {
      width: "100%",
      height: Math.max(480, Math.min(680, h)),
      channel: CHANNEL,
      layout: "video-with-chat",
      theme: "dark",
      muted: true,
      autoplay: true,
      parent: parents,
    });
  }

  function showTwitchOffline(root) {
    if (!root) return;
    root.innerHTML =
      '<div class="twitch-offline">' +
      '<p class="twitch-offline-title">Сейчас оффлайн</p>' +
      '<p class="twitch-offline-text">Стрим oh_barbara не в эфире. Можно открыть плеер и чат здесь.</p>' +
      '<button type="button" class="btn btn-primary" id="ob-open-twitch-embed">Открыть плеер с чатом</button>' +
      "</div>";
    const btn = document.getElementById("ob-open-twitch-embed");
    if (btn) {
      btn.addEventListener("click", function () {
        root.innerHTML = "";
        mountTwitchEmbed(root);
      });
    }
  }

  function pickStreamTags(tags) {
    const list = Array.isArray(tags) ? tags : [];
    const names = list
      .map(function (t) {
        return (t && (t.name || t.localizedName || "")).trim();
      })
      .filter(Boolean);
    const prefer = ["IRL", "Just Chatting", "Unboxing", "Music", "Art", "ASMR"];
    const out = [];
    prefer.forEach(function (p) {
      const hit = names.find(function (n) {
        return n.toLowerCase() === p.toLowerCase();
      });
      if (hit && out.indexOf(hit) === -1) out.push(hit);
    });
    names.forEach(function (n) {
      if (out.length >= 2) return;
      if (out.indexOf(n) === -1) out.push(n);
    });
    return out.slice(0, 2);
  }

  function applyTwitchMeta(info) {
    const meta = document.getElementById("ob-stream-meta");
    const note = document.querySelector(".stream-note");
    if (!info) return;

    const parts = [];
    if (info.game) parts.push(info.game);
    (info.tags || []).forEach(function (t) {
      if (t && parts.indexOf(t) === -1) parts.push(t);
    });
    if (info.followers != null) {
      parts.push(formatCount(info.followers) + " на Twitch");
    } else {
      parts.push("Twitch");
    }
    if (meta && parts.length) meta.textContent = parts.join(" · ");

    if (note) {
      if (info.live && info.title) {
        note.textContent = "Сейчас в эфире: " + info.title;
      } else if (info.lastTitle) {
        note.textContent = "Последний стрим: " + info.lastTitle;
      } else if (!info.live) {
        note.textContent = "Канал оффлайн · загляните позже на Twitch";
      }
    }
  }

  function fetchTwitchChannel(login) {
    return fetch("https://gql.twitch.tv/gql", {
      method: "POST",
      headers: {
        "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:
          "query($login:String!){" +
          "  user(login:$login){" +
          "    followers{ totalCount }" +
          "    stream{" +
          "      id title viewersCount" +
          "      game{ name }" +
          "      freeformTags{ name }" +
          "    }" +
          "    lastBroadcast{ title game{ name } }" +
          "  }" +
          "}",
        variables: { login: login },
      }),
    })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (json) {
        const user = json && json.data && json.data.user;
        if (!user) return null;
        const stream = user.stream;
        const last = user.lastBroadcast;
        const game =
          (stream && stream.game && stream.game.name) ||
          (last && last.game && last.game.name) ||
          "";
        return {
          live: !!stream,
          title: (stream && stream.title) || "",
          lastTitle: (last && last.title) || "",
          game: game,
          tags: pickStreamTags(stream && stream.freeformTags),
          followers:
            user.followers && user.followers.totalCount != null
              ? user.followers.totalCount
              : null,
          viewers: stream && stream.viewersCount != null ? stream.viewersCount : null,
        };
      })
      .catch(function () {
        return null;
      });
  }

  const embedRoot = document.getElementById("twitch-embed");
  if (embedRoot) {
    fetchTwitchChannel(CHANNEL).then(function (info) {
      applyTwitchMeta(info);
      if (info && info.live === false) {
        showTwitchOffline(embedRoot);
        return;
      }
      mountTwitchEmbed(embedRoot);
    });
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function currentId() {
    try {
      const p = new URLSearchParams(location.search);
      const raw = (p.get("id") || p.get("tag") || p.get("n") || p.get("name") || "").trim();
      if (!raw) return "";
      return window.OB_TAGS ? OB_TAGS.resolve(raw) : raw;
    } catch (e) {
      return "";
    }
  }

  function setJsonLd(id, data) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }

  function setMeta(id, content) {
    const el = document.getElementById(id);
    if (el) el.setAttribute("content", content || "");
  }

  function setAttr(id, name, value) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(name, value || "");
  }

  function parseDataTags(el) {
    const raw = el.getAttribute("data-tags") || "";
    return raw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => (window.OB_TAGS ? OB_TAGS.resolve(x) : x));
  }

  function applyTagFilter(slug) {
    const id = window.OB_TAGS ? OB_TAGS.resolve(slug) : slug;
    const title = document.getElementById("ob-title");
    const lead = document.getElementById("ob-lead");
    const kicker = document.getElementById("ob-kicker");
    const bc = document.getElementById("ob-bc");
    const bcCurrent = document.getElementById("ob-bc-current");
    const name = id && window.OB_TAGS ? OB_TAGS.name(id) : "";
    const leadText = id && window.OB_TAGS ? OB_TAGS.lead(id) : DEFAULT.lead;

    document.querySelectorAll(".hero-tags a, .tag-cloud a, .cat-drop-panel a").forEach((a) => {
      let s = a.getAttribute("data-tag-slug") || "";
      try {
        const u = new URL(a.href, location.href);
        if (!s) s = u.searchParams.get("id") || u.searchParams.get("tag") || "";
        if (window.OB_TAGS) s = OB_TAGS.resolve(s);
      } catch (e) {}
      a.classList.toggle("on", !!id && s === id);
    });

    document.querySelectorAll("[data-tags]").forEach((el) => {
      if (!id || /_about$|_gallery$|_stream$|_clips$|_video$|_tags$|_connect$|_comments$/.test(id)) {
        el.classList.remove("ob-dim");
        return;
      }
      const tags = parseDataTags(el);
      el.classList.toggle("ob-dim", tags.length > 0 && tags.indexOf(id) === -1);
    });

    if (!id) {
      if (title) title.textContent = DEFAULT.title;
      if (lead) lead.textContent = DEFAULT.lead;
      if (kicker) kicker.textContent = DEFAULT.kicker;
      if (bc) bc.hidden = true;
      document.title = DEFAULT.docTitle;
      setMeta("ob-desc", DEFAULT.desc);
      setMeta("ob-kw", DEFAULT.kw);
      setMeta("ob-og-title", DEFAULT.docTitle);
      setMeta("ob-og-desc", DEFAULT.desc);
      setMeta("ob-tw-title", DEFAULT.docTitle);
      setMeta("ob-tw-desc", DEFAULT.desc);
      setAttr("ob-canon", "href", SITE + "/");
      setMeta("ob-og-url", SITE + "/");
      const ld = document.getElementById("ob-ld-tagpage");
      if (ld) ld.remove();
      return;
    }

    try {
      const sp = new URLSearchParams(location.search);
      if (sp.get("id") !== id) {
        sp.set("id", id);
        sp.delete("tag");
        sp.delete("n");
        sp.delete("name");
        history.replaceState(null, "", location.pathname + "?" + sp.toString() + location.hash);
      }
    } catch (e2) {}

    const pageUrl = SITE + "/index.html?id=" + encodeURIComponent(id);
    const docTitle = name + " — oh_barbara";
    const desc = leadText;

    if (title) title.textContent = name;
    if (lead) lead.textContent = leadText;
    if (kicker) kicker.textContent = "Тема · #" + name;
    if (bc) {
      bc.hidden = false;
      if (bcCurrent) bcCurrent.textContent = name;
    }

    document.title = docTitle;
    setMeta("ob-desc", desc);
    setMeta("ob-kw", [name, "oh-barbara", "oh_barbara", "ох-барбара", "Ох_Барбара", "стример", "модель"].join(", "));
    setMeta("ob-og-title", docTitle);
    setMeta("ob-og-desc", desc);
    setMeta("ob-tw-title", docTitle);
    setMeta("ob-tw-desc", desc);
    setAttr("ob-canon", "href", pageUrl);
    setMeta("ob-og-url", pageUrl);

    const secMatch = String(id).match(/_(about|gallery|stream|clips|video|tags|connect|comments)$/);
    const anchorId = secMatch ? secMatch[1] : id === "video-oh-barbara" ? "video" : id;
    const anchor = document.getElementById(anchorId);
    if (anchor) {
      requestAnimationFrame(function () {
        const header = document.querySelector(".site-header");
        const headerH = header ? header.offsetHeight : 72;
        const gap = anchorId === "clips" ? 16 : 10;
        const y =
          window.scrollY +
          anchor.getBoundingClientRect().top -
          headerH -
          gap;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      });
    }

    setJsonLd("ob-ld-tagpage", {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl + "#page",
      url: pageUrl,
      name: docTitle,
      headline: name,
      description: desc,
      inLanguage: "ru-RU",
      isPartOf: { "@id": SITE + "/#website" },
      about: {
        "@type": "DefinedTerm",
        name: name,
        termCode: id,
        url: pageUrl,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: SITE + "/assets/hero-2.jpg",
      },
    });
  }

  function tagChip(t) {
    return (
      '<a href="' +
      esc(OB_TAGS.href(t.slug)) +
      '" data-tag-slug="' +
      esc(t.slug) +
      '">#' +
      esc(t.name) +
      "</a>"
    );
  }

  function catId(cat) {
    return String(cat || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^a-z0-9а-я]+/gi, "-")
      .replace(/^-+|-+$/g, "");
  }

  function renderTagCloud() {
    const box = document.getElementById("tagCloud");
    const hero = document.getElementById("ob-hero-tags");
    if (!window.OB_TAGS) return;

    if (box) {
      let html = '<div class="cat-drops">';
      Object.keys(OB_TAGS.byCat).forEach((cat) => {
        const list = OB_TAGS.forCategory(cat);
        if (!list.length) return;
        const id = catId(cat);
        html +=
          '<div class="cat-drop" data-cat="' +
          esc(id) +
          '">' +
          '<button type="button" class="cat-drop-btn" aria-expanded="false" aria-controls="ob-cat-' +
          esc(id) +
          '">' +
          esc(cat) +
          " ▾</button>" +
          '<div class="cat-drop-panel" id="ob-cat-' +
          esc(id) +
          '" hidden role="listbox" aria-label="' +
          esc(cat) +
          '">';
        list.forEach((t) => {
          html += tagChip(t);
        });
        html += "</div></div>";
      });
      const extras = OB_TAGS.all().filter((t) => t.user);
      if (extras.length) {
        html +=
          '<div class="cat-drop" data-cat="extra">' +
          '<button type="button" class="cat-drop-btn" aria-expanded="false" aria-controls="ob-cat-extra">Ещё ▾</button>' +
          '<div class="cat-drop-panel" id="ob-cat-extra" hidden role="listbox" aria-label="Ещё">';
        extras.forEach((t) => {
          html += tagChip(t);
        });
        html += "</div></div>";
      }
      html += "</div>";
      box.innerHTML = html;
    }

    if (hero) {
      const top = [
        "twitch-oh-barbara",
        "твич-ох-барбара",
        "instagram-oh-barbara",
        "lifestyle-oh-barbara",
        "fashion-oh-barbara",
        "phuket-oh-barbara",
        "пхукет-ох-барбара",
        "irl-oh-barbara",
      ];
      let html =
        '<div class="cat-drop hero-drop" data-cat="top">' +
        '<button type="button" class="cat-drop-btn" aria-expanded="false" aria-controls="ob-cat-top">Топ темы ▾</button>' +
        '<div class="cat-drop-panel" id="ob-cat-top" hidden role="listbox" aria-label="Топ темы">';
      top.forEach((slug) => {
        html += tagChip({ slug: slug, name: OB_TAGS.name(slug) });
      });
      html += "</div></div>";
      hero.innerHTML = html;
    }
  }

  function wireCatDrops() {
    const roots = [document.getElementById("tagCloud"), document.getElementById("ob-hero-tags")].filter(Boolean);
    const drops = roots.flatMap((root) => Array.from(root.querySelectorAll(".cat-drop")));
    if (!drops.length) return;
    function closeAll(except) {
      drops.forEach((wrap) => {
        if (except && wrap === except) return;
        const btn = wrap.querySelector(".cat-drop-btn");
        const panel = wrap.querySelector(".cat-drop-panel");
        if (!btn || !panel) return;
        wrap.classList.remove("is-open");
        panel.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        const label = btn.textContent.replace(/[▾▴]\s*$/, "").trim();
        btn.textContent = label + " ▾";
      });
    }

    function setOpen(wrap, open) {
      const btn = wrap.querySelector(".cat-drop-btn");
      const panel = wrap.querySelector(".cat-drop-panel");
      if (!btn || !panel) return;
      const label = btn.textContent.replace(/[▾▴]\s*$/, "").trim();
      if (open) closeAll(wrap);
      wrap.classList.toggle("is-open", open);
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = label + (open ? " ▴" : " ▾");
    }

    drops.forEach((wrap) => {
      const btn = wrap.querySelector(".cat-drop-btn");
      const panel = wrap.querySelector(".cat-drop-panel");
      if (!btn || !panel) return;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(wrap, panel.hidden);
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest && e.target.closest(".cat-drop")) return;
      closeAll();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
  }

  function boot() {
    const id = currentId();
    renderTagCloud();
    wireCatDrops();
    applyTagFilter(id);
  }

  function startClipsCarousel() {
    const wrap = document.getElementById("clips");
    const frame = document.querySelector("#clips iframe[data-src]");
    if (!frame || frame.getAttribute("src")) return;

    const markReady = () => {
      if (wrap) wrap.classList.add("is-ready");
      if (wrap) wrap.classList.remove("is-loading");
    };

    frame.addEventListener("load", markReady, { once: true });
    window.addEventListener("message", (e) => {
      if (e && e.data && e.data.type === "ob-clips-ready") markReady();
    });

    frame.src = frame.getAttribute("data-src");
  }

  // прогреть clips.json заранее, пока грузится сайт
  try {
    fetch("data/clips.json", { cache: "force-cache", credentials: "same-origin" }).catch(() => {});
  } catch (_) {}

  if (document.readyState === "complete") {
    startClipsCarousel();
  } else {
    window.addEventListener("load", startClipsCarousel);
  }

  if (window.OB_TAGS && OB_TAGS.loadUserTags) {
    OB_TAGS.loadUserTags().then(boot).catch(boot);
  } else {
    boot();
  }
})();