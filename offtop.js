(() => {
  const GH = {
    owner: "vvcconverter",
    repo: "oh-barbara.com",
    path: "data/blog.json",
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

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  function render() {
    if (!feed) return;
    const posts = Array.isArray(blogData.posts) ? blogData.posts.slice() : [];
    posts.sort(function (a, b) {
      return String(b.created || "").localeCompare(String(a.created || ""));
    });
    feed.querySelectorAll("article.ob-blog-post").forEach(function (n) {
      n.remove();
    });
    if (empty) empty.hidden = posts.length > 0;
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
        esc(p.body).replace(/\n/g, "<br>") +
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

  function contentUrl() {
    return (
      "https://api.github.com/repos/" +
      GH.owner +
      "/" +
      GH.repo +
      "/contents/" +
      GH.path
    );
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

  async function fetchRemote(token) {
    const res = await fetch(contentUrl() + "?ref=" + encodeURIComponent(GH.branch), {
      headers: apiHeaders(token),
    });
    if (res.status === 404) {
      blogSha = null;
      return { updated: new Date().toISOString(), posts: [] };
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error("GitHub GET " + res.status + ": " + t.slice(0, 180));
    }
    const json = await res.json();
    blogSha = json.sha || null;
    const raw = atob(String(json.content || "").replace(/\n/g, ""));
    const parsed = JSON.parse(raw);
    if (!parsed.posts) parsed.posts = [];
    return parsed;
  }

  async function commitBlog(token, data, message) {
    const body = JSON.stringify(data, null, 2);
    const content = btoa(unescape(encodeURIComponent(body)));
    const payload = {
      message: message || "blog: update posts",
      content: content,
      branch: GH.branch,
    };
    if (blogSha) payload.sha = blogSha;
    const res = await fetch(contentUrl(), {
      method: "PUT",
      headers: apiHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error("GitHub PUT " + res.status + ": " + t.slice(0, 220));
    }
    const json = await res.json();
    blogSha = (json.content && json.content.sha) || blogSha;
    return json;
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
        await fetchRemote(token);
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
        const remote = await fetchRemote(token);
        const post = {
          id: "post-" + Date.now().toString(36),
          title: title,
          type: type,
          body: body,
          created: new Date().toISOString(),
          author: "oh_barbara",
        };
        remote.posts = Array.isArray(remote.posts) ? remote.posts : [];
        remote.posts.unshift(post);
        remote.updated = post.created;
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

  loadBlog();
  if (gateOpen()) openModal();
})();
