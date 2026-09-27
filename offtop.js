(() => {
  const GH = {
    owner: "vvcconverter",
    repo: "oh-barbara.com",
    branch: "main",
  };
  // default password: ohbarbara  — смените PASS_HASH в offtop.js после деплоя
  const PASS_HASH =
    "acaff93184f85d24e4c78d891dd060a6f2e072604008d0a2f8ce966ee1417d1a";

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const feed = document.getElementById("ob-blog-feed");
  const empty = document.getElementById("ob-blog-empty");
  const modal = document.getElementById("ob-blog-modal");
  const closeBtn = document.getElementById("ob-blog-modal-close");
  // offtop.html?id=%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD  (не в tags/sitemap)
  const GATE = decodeURIComponent("%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD");
  const loginForm = document.getElementById("ob-blog-login");
  const editorForm = document.getElementById("ob-blog-editor");
  const logoutBtn = document.getElementById("ob-blog-logout");
  const loginErr = document.getElementById("ob-blog-login-err");
  const saveErr = document.getElementById("ob-blog-save-err");
  const saveOk = document.getElementById("ob-blog-save-ok");

  let blogData = { updated: null, posts: [] };
  let blogSha = null;
  let tagsSha = null;
  let sitemapSha = null;
  let knownSlugs = Object.create(null);
  let pendingTags = [];

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function slugify(raw) {
    return String(raw || "")
      .trim()
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^a-z0-9а-я]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72);
  }

  function fmtDate(iso) {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  }

  function typeLabel(t) {
    if (t === "news") return "Новость";
    if (t === "offtop") return "Offtop";
    return "Публикация";
  }

  function mdToHtml(src) {
    let s = esc(src);
    s = s.replace(
      /!\[([^\]]*)\]\(([^)\s]+)(?:\s+\"([^\"]*)\")?\)/g,
      function (_, alt, url, title) {
        const t = title ? ' title="' + esc(title) + '"' : "";
        return (
          '<img src="' +
          esc(url) +
          '" alt="' +
          esc(alt) +
          '"' +
          t +
          " loading=\"lazy\" decoding=\"async\" />"
        );
      }
    );
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, text, url) {
      return (
        '<a href="' +
        esc(url) +
        '" target="_blank" rel="noopener noreferrer">' +
        text +
        "</a>"
      );
    });
    return s.replace(/\n/g, "<br>");
  }

  function render() {
    if (!feed) return;
    const posts = Array.isArray(blogData.posts) ? blogData.posts.slice() : [];
    posts.sort(function (a, b) {
      return String(b.created || "").localeCompare(String(a.created || ""));
    });
    feed.querySelectorAll("article.ob-blog-post").forEach(function (n) {
      n.remove();
    });
    if (empty) empty.hidden = true;
    posts.forEach(function (p) {
      const art = document.createElement("article");
      art.className = "ob-blog-post reveal is-in";
      art.setAttribute("itemprop", "blogPost");
      art.setAttribute("itemscope", "");
      art.setAttribute("itemtype", "https://schema.org/BlogPosting");
      if (p.id) art.id = p.id;
      art.innerHTML =
        '<header class="ob-blog-post-head">' +
        '<span class="ob-blog-type">' +
        esc(typeLabel(p.type)) +
        "</span>" +
        '<time datetime="' +
        esc(p.created || "") +
        '" itemprop="datePublished">' +
        esc(fmtDate(p.created)) +
        "</time>" +
        "</header>" +
        "<h2 itemprop=\"headline\">" +
        esc(p.title) +
        "</h2>" +
        '<div class="ob-blog-body" itemprop="articleBody">' +
        mdToHtml(p.body || "") +
        "</div>";
      feed.appendChild(art);
    });
  }

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map(function (b) {
        return b.toString(16).padStart(2, "0");
      })
      .join("");
  }

  function apiHeaders(token) {
    return {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    };
  }

  function contentUrl(path) {
    return (
      "https://api.github.com/repos/" +
      GH.owner +
      "/" +
      GH.repo +
      "/contents/" +
      path
    );
  }

  function decodeGhContent(json) {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(String(json.content || "").replace(/\n/g, "")), function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  async function fetchFile(token, path) {
    const res = await fetch(contentUrl(path) + "?ref=" + encodeURIComponent(GH.branch), {
      headers: apiHeaders(token),
    });
    if (res.status === 404) return { sha: null, text: null };
    if (!res.ok) {
      const t = await res.text();
      throw new Error("GitHub GET " + path + " " + res.status + ": " + t.slice(0, 160));
    }
    const json = await res.json();
    return { sha: json.sha || null, text: decodeGhContent(json) };
  }

  async function putFile(token, path, text, sha, message) {
    const content = btoa(unescape(encodeURIComponent(text)));
    const payload = {
      message: message || "update " + path,
      content: content,
      branch: GH.branch,
    };
    if (sha) payload.sha = sha;
    const res = await fetch(contentUrl(path), {
      method: "PUT",
      headers: apiHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error("GitHub PUT " + path + " " + res.status + ": " + t.slice(0, 200));
    }
    const json = await res.json();
    return (json.content && json.content.sha) || sha;
  }

  function markSlug(slug) {
    if (slug) knownSlugs[String(slug).toLowerCase()] = true;
  }

  function rememberSlugsFromTags(list) {
    (list || []).forEach(function (t) {
      if (t && t.slug) markSlug(t.slug);
    });
  }

  function uniqueSlug(base) {
    var root = slugify(base) || "tag";
    var slug = root;
    var n = 1;
    while (knownSlugs[slug] || pendingTags.some(function (t) { return t.slug === slug; })) {
      slug = root + String(n);
      n += 1;
    }
    return slug;
  }

  function queuePendingTag(name, extra) {
    var slug = uniqueSlug(name);
    var tag = {
      slug: slug,
      name: String(name || slug).trim() || slug,
      offtop: true,
    };
    if (extra && typeof extra === "object") {
      Object.keys(extra).forEach(function (k) {
        tag[k] = extra[k];
      });
    }
    pendingTags.push(tag);
    markSlug(slug);
    return tag;
  }

  function insertAtCursor(textarea, text) {
    if (!textarea) return;
    var start = textarea.selectionStart || 0;
    var end = textarea.selectionEnd || 0;
    var val = textarea.value || "";
    var pad = val && !/\n$/.test(val.slice(0, start)) && start > 0 ? "\n" : "";
    var chunk = pad + text + "\n";
    textarea.value = val.slice(0, start) + chunk + val.slice(end);
    var pos = start + chunk.length;
    textarea.focus();
    textarea.setSelectionRange(pos, pos);
  }

  async function refreshKnownSlugs(token) {
    knownSlugs = Object.create(null);
    try {
      if (window.OB_TAGS && OB_TAGS.bySlug) {
        Object.keys(OB_TAGS.bySlug).forEach(markSlug);
      }
    } catch (e) {}
    try {
      const local = await fetch("data/tags.json?t=" + Date.now(), {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (local.ok) rememberSlugsFromTags(await local.json());
    } catch (e) {}
    if (token) {
      try {
        const remote = await fetchFile(token, "data/tags.json");
        if (remote.text) {
          tagsSha = remote.sha;
          rememberSlugsFromTags(JSON.parse(remote.text));
        }
      } catch (e) {}
    }
    pendingTags.forEach(function (t) {
      markSlug(t.slug);
    });
  }

  function sitemapHas(xml, loc) {
    return xml.indexOf("<loc>" + loc + "</loc>") !== -1;
  }

  function appendSitemapUrls(xml, urls) {
    var block = urls
      .map(function (u) {
        return (
          "  <url>\n" +
          "    <loc>" +
          u +
          "</loc>\n" +
          "    <lastmod>" +
          new Date().toISOString().slice(0, 10) +
          "</lastmod>\n" +
          "    <changefreq>weekly</changefreq>\n" +
          "    <priority>0.7</priority>\n" +
          "  </url>\n"
        );
      })
      .join("");
    if (xml.indexOf("</urlset>") === -1) return xml + "\n" + block;
    return xml.replace("</urlset>", block + "</urlset>");
  }

  async function commitPendingMeta(token) {
    if (!pendingTags.length) return;
    const tagsFile = await fetchFile(token, "data/tags.json");
    tagsSha = tagsFile.sha;
    let list = [];
    try {
      list = tagsFile.text ? JSON.parse(tagsFile.text) : [];
    } catch (e) {
      list = [];
    }
    if (!Array.isArray(list)) list = [];
    const have = Object.create(null);
    list.forEach(function (t) {
      if (t && t.slug) have[String(t.slug).toLowerCase()] = true;
    });
    const fresh = [];
    pendingTags.forEach(function (t) {
      if (!t || !t.slug || have[String(t.slug).toLowerCase()]) return;
      list.push({ slug: t.slug, name: t.name, offtop: true });
      have[String(t.slug).toLowerCase()] = true;
      fresh.push(t);
    });
    if (fresh.length) {
      tagsSha = await putFile(
        token,
        "data/tags.json",
        JSON.stringify(list, null, 2) + "\n",
        tagsSha,
        "blog: tags " + fresh.map(function (t) { return t.slug; }).join(", ")
      );
    }

    const sm = await fetchFile(token, "sitemap.xml");
    sitemapSha = sm.sha;
    let xml = sm.text || "";
    const addLocs = [];
    fresh.forEach(function (t) {
      const a = "https://oh-barbara.com/offtop.html?id=" + encodeURIComponent(t.slug);
      const b = "https://oh-barbara.com/index.html?id=" + encodeURIComponent(t.slug);
      if (!sitemapHas(xml, a)) addLocs.push(a);
      if (!sitemapHas(xml, b)) addLocs.push(b);
    });
    if (addLocs.length && xml) {
      xml = appendSitemapUrls(xml, addLocs);
      sitemapSha = await putFile(token, "sitemap.xml", xml, sitemapSha, "blog: sitemap tags");
    }

    pendingTags = [];
  }

  async function loadBlog() {
    try {
      const res = await fetch("data/blog.json?t=" + Date.now(), {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!res.ok) throw new Error("blog.json " + res.status);
      blogData = await res.json();
      if (!blogData || typeof blogData !== "object") blogData = { posts: [] };
      if (!Array.isArray(blogData.posts)) blogData.posts = [];
      render();
    } catch (e) {
      if (empty) {
        empty.hidden = false;
        empty.textContent = "Не удалось загрузить блог.";
      }
    }
  }

  async function fetchRemoteBlog(token) {
    const file = await fetchFile(token, "data/blog.json");
    blogSha = file.sha;
    if (!file.text) return { updated: new Date().toISOString(), posts: [] };
    const parsed = JSON.parse(file.text);
    if (!parsed.posts) parsed.posts = [];
    return parsed;
  }

  async function commitBlog(token, data, message) {
    blogSha = await putFile(
      token,
      "data/blog.json",
      JSON.stringify(data, null, 2) + "\n",
      blogSha,
      message || "blog: update posts"
    );
  }

  function isAuthed() {
    return !!(sessionStorage.getItem("ob_blog_ok") && sessionStorage.getItem("ob_blog_gh"));
  }

  function showEditor(on) {
    if (loginForm) loginForm.hidden = !!on;
    if (editorForm) editorForm.hidden = !on;
  }

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    showEditor(isAuthed());
    if (loginErr) loginErr.hidden = true;
    if (saveErr) saveErr.hidden = true;
    if (saveOk) saveOk.hidden = true;
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function gateOpen() {
    try {
      const raw = new URLSearchParams(location.search).get("id") || "";
      let id = raw;
      try {
        id = decodeURIComponent(raw);
      } catch (e) {}
      return id === GATE || raw === GATE;
    } catch (e) {
      return false;
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  (function titleTip() {
    var btn = document.getElementById("ob-blog-title-tip");
    var msg = document.getElementById("ob-blog-title-tip-msg");
    if (!btn || !msg) return;
    btn.addEventListener("click", function () {
      var open = msg.hidden;
      msg.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  })();

  (function typeSeg() {
    var wrap = document.querySelector(".ob-blog-types");
    var input = document.getElementById("ob-blog-type");
    if (!wrap || !input) return;
    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".ob-blog-type-btn");
      if (!btn || !wrap.contains(btn)) return;
      var t = btn.getAttribute("data-type") || "post";
      input.value = t;
      wrap.querySelectorAll(".ob-blog-type-btn").forEach(function (b) {
        b.classList.toggle("is-on", b === btn);
      });
    });
  })();

  (function mdTools() {
    var body = document.getElementById("ob-blog-body");
    var linkBtn = document.getElementById("ob-md-link");
    var imgBtn = document.getElementById("ob-md-img");
    var linkPanel = document.getElementById("ob-md-link-panel");
    var imgPanel = document.getElementById("ob-md-img-panel");
    var linkOk = document.getElementById("ob-md-link-ok");
    var imgOk = document.getElementById("ob-md-img-ok");

    function showPanel(which) {
      var linkOn = which === "link";
      var imgOn = which === "img";
      if (linkPanel) linkPanel.hidden = !linkOn;
      if (imgPanel) imgPanel.hidden = !imgOn;
      if (linkBtn) linkBtn.setAttribute("aria-expanded", linkOn ? "true" : "false");
      if (imgBtn) imgBtn.setAttribute("aria-expanded", imgOn ? "true" : "false");
    }

    if (linkBtn) {
      linkBtn.addEventListener("click", function () {
        showPanel(linkPanel && linkPanel.hidden ? "link" : "");
      });
    }
    if (imgBtn) {
      imgBtn.addEventListener("click", function () {
        showPanel(imgPanel && imgPanel.hidden ? "img" : "");
      });
    }

    if (linkOk) {
      linkOk.addEventListener("click", function () {
        var name = ((document.getElementById("ob-md-link-name") || {}).value || "").trim();
        var tagsRaw = ((document.getElementById("ob-md-link-tags") || {}).value || "").trim();
        var url = ((document.getElementById("ob-md-link-url") || {}).value || "").trim();
        if (!name || !url) return;
        var main = queuePendingTag(name);
        tagsRaw.split(",").forEach(function (part) {
          var n = part.trim();
          if (!n) return;
          queuePendingTag(n);
        });
        var md =
          "[" +
          name.replace(/[\[\]]/g, "") +
          "](" +
          url +
          ") · [#" +
          main.slug +
          "](offtop.html?id=" +
          encodeURIComponent(main.slug) +
          ")";
        insertAtCursor(body, md);
        if (document.getElementById("ob-md-link-name")) document.getElementById("ob-md-link-name").value = "";
        if (document.getElementById("ob-md-link-tags")) document.getElementById("ob-md-link-tags").value = "";
        if (document.getElementById("ob-md-link-url")) document.getElementById("ob-md-link-url").value = "";
        showPanel("");
      });
    }

    if (imgOk) {
      imgOk.addEventListener("click", function () {
        var name = ((document.getElementById("ob-md-img-name") || {}).value || "").trim();
        var url = ((document.getElementById("ob-md-img-url") || {}).value || "").trim();
        if (!name || !url) return;
        var tag = queuePendingTag(name);
        var safe = name.replace(/[\[\]\"]/g, "");
        var md =
          "[![" +
          safe +
          "](" +
          url +
          ' "' +
          safe +
          '")](offtop.html?id=' +
          encodeURIComponent(tag.slug) +
          ")";
        insertAtCursor(body, md);
        if (document.getElementById("ob-md-img-name")) document.getElementById("ob-md-img-name").value = "";
        if (document.getElementById("ob-md-img-url")) document.getElementById("ob-md-img-url").value = "";
        showPanel("");
      });
    }
  })();

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (loginErr) {
        loginErr.hidden = true;
        loginErr.textContent = "";
      }
      const pass = (document.getElementById("ob-blog-pass") || {}).value || "";
      const token = ((document.getElementById("ob-blog-token") || {}).value || "").trim();
      try {
        const h = await sha256(pass);
        if (h !== PASS_HASH) throw new Error("Неверный пароль");
        if (!token) throw new Error("Нужен GitHub token");
        await fetchRemoteBlog(token);
        await refreshKnownSlugs(token);
        sessionStorage.setItem("ob_blog_ok", "1");
        sessionStorage.setItem("ob_blog_gh", token);
        showEditor(true);
      } catch (err) {
        if (loginErr) {
          loginErr.hidden = false;
          loginErr.textContent = err.message || String(err);
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem("ob_blog_ok");
      sessionStorage.removeItem("ob_blog_gh");
      pendingTags = [];
      showEditor(false);
    });
  }

  if (editorForm) {
    editorForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (saveErr) {
        saveErr.hidden = true;
        saveErr.textContent = "";
      }
      if (saveOk) saveOk.hidden = true;
      const token = sessionStorage.getItem("ob_blog_gh") || "";
      const title = ((document.getElementById("ob-blog-title") || {}).value || "").trim();
      const type = (document.getElementById("ob-blog-type") || {}).value || "post";
      const body = ((document.getElementById("ob-blog-body") || {}).value || "").trim();
      if (!title || !body) return;
      try {
        const remote = await fetchRemoteBlog(token);
        const post = {
          id: "post-" + Date.now().toString(36),
          title: title,
          type: type,
          body: body,
          created: new Date().toISOString(),
          author: "oh_barbara",
          tags: pendingTags.map(function (t) {
            return t.slug;
          }),
        };
        remote.posts = Array.isArray(remote.posts) ? remote.posts : [];
        remote.posts.unshift(post);
        remote.updated = post.created;
        await commitPendingMeta(token);
        await commitBlog(token, remote, "blog: " + title.slice(0, 72));
        blogData = remote;
        render();
        document.getElementById("ob-blog-title").value = "";
        document.getElementById("ob-blog-body").value = "";
        if (saveOk) {
          saveOk.hidden = false;
          saveOk.textContent = "Опубликовано. Через минуту появится на сайте после деплоя GitHub Pages.";
        }
      } catch (err) {
        if (saveErr) {
          saveErr.hidden = false;
          saveErr.textContent = err.message || String(err);
        }
      }
    });
  }

  document.querySelectorAll(".ob-offtop .section-label a[data-ob-page]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var page = a.getAttribute("data-ob-page") || "offtop.html";
      var id = "";
      try {
        id = new URL(a.href, location.href).searchParams.get("id") || "";
      } catch (err) {}
      location.href = id ? page + "?id=" + encodeURIComponent(id) : page;
    });
  });

  loadBlog();
  refreshKnownSlugs("");
  if (gateOpen()) openModal();

  (function sunLogo() {
    function run() {
      var el = document.querySelector(".site-header .logo");
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      el.classList.remove("is-sunlit");
      void el.offsetWidth;
      el.classList.add("is-sunlit");
      el.addEventListener(
        "animationend",
        function (e) {
          if (e.animationName === "ob-logo-warm") el.classList.remove("is-sunlit");
        },
        { once: true }
      );
    }
    if (document.readyState === "complete") setTimeout(run, 180);
    else window.addEventListener("load", function () { setTimeout(run, 180); });
  })();
})();
