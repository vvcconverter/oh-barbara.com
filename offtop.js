(() => {
  const GH = {
    owner: "vvcconverter",
    repo: "oh-barbara.com",
    branch: "main",
  };
  /* Медиа-репозиторий. publicBase — после настройки Gcore замените на URL CDN. */
  const MEDIA = {
    owner: "vvcconverter",
    repo: "media",
    branch: "main",
    publicBase: "https://raw.githubusercontent.com/vvcconverter/media/main/",
    maxBytes: 40 * 1024 * 1024,
  };
  const PASS_HASH =
    "acaff93184f85d24e4c78d891dd060a6f2e072604008d0a2f8ce966ee1417d1a";

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const feed = document.getElementById("ob-blog-feed");
  const empty = document.getElementById("ob-blog-empty");
  const modal = document.getElementById("ob-blog-modal");
  const closeBtn = document.getElementById("ob-blog-modal-close");
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
  let editingId = null;

  function findPost(id) {
    var list = Array.isArray(blogData.posts) ? blogData.posts : [];
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id === id) return list[i];
    }
    return null;
  }

  function setTypeButtons(type) {
    var input = document.getElementById("ob-blog-type");
    var t = type || "post";
    if (input) input.value = t;
    document.querySelectorAll(".ob-blog-type-btn").forEach(function (b) {
      b.classList.toggle("is-on", (b.getAttribute("data-type") || "") === t);
    });
  }

  function setPublishLabel() {
    var btn = editorForm && editorForm.querySelector('button[type="submit"]');
    if (btn) btn.textContent = editingId ? "Сохранить" : "Опубликовать";
  }

  function clearEditorFields() {
    editingId = null;
    pendingTags = [];
    var titleEl = document.getElementById("ob-blog-title");
    var bodyEl = document.getElementById("ob-blog-body");
    if (titleEl) titleEl.value = "";
    if (bodyEl) bodyEl.value = "";
    setTypeButtons("news");
    setPublishLabel();
  }

  function fillEditor(post) {
    if (!post) return;
    editingId = post.id || null;
    var titleEl = document.getElementById("ob-blog-title");
    var bodyEl = document.getElementById("ob-blog-body");
    if (titleEl) titleEl.value = post.title || "";
    if (bodyEl) bodyEl.value = post.body || "";
    setTypeButtons(post.type || "post");
    setPublishLabel();
    if (saveErr) saveErr.hidden = true;
    if (saveOk) saveOk.hidden = true;
  }

  function startEdit(id) {
    var post = findPost(id);
    if (!post || !isAuthed()) return;
    openModal();
    showEditor(true);
    fillEditor(post);
  }

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

  function videoHtml(url, title) {
    return (
      '<video class="ob-blog-video" src="' +
      esc(url) +
      '" title="' +
      esc(title) +
      '" controls playsinline preload="metadata"></video>'
    );
  }

  function mdToHtml(src) {
    var s = String(src || "");
    s = s.replace(
      /\[!!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g,
      function (_, alt, vidInner, href) {
        var vidUrl = String(vidInner || "").trim().split(/\s+/)[0];
        return (
          '<a href="' +
          esc(String(href || "").trim()) +
          '">' +
          videoHtml(vidUrl, alt) +
          "</a>"
        );
      }
    );
    s = s.replace(/!!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, inner) {
      var raw = String(inner || "").trim();
      var m = raw.match(/^(\S+)(?:\s+"([^"]*)")?$/);
      var url = m ? m[1] : raw;
      var title = m && m[2] ? m[2] : alt;
      return videoHtml(url, title);
    });
    s = s.replace(
      /\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g,
      function (_, alt, imgInner, href) {
        var imgUrl = String(imgInner || "").trim().split(/\s+/)[0];
        return (
          '<a href="' +
          esc(String(href || "").trim()) +
          '"><img src="' +
          esc(imgUrl) +
          '" alt="' +
          esc(alt) +
          '" title="' +
          esc(alt) +
          '" loading="lazy" decoding="async" /></a>'
        );
      }
    );
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, inner) {
      var raw = String(inner || "").trim();
      var m = raw.match(/^(\S+)(?:\s+"([^"]*)")?$/);
      var url = m ? m[1] : raw;
      var title = m && m[2] ? m[2] : alt;
      return (
        '<img src="' +
        esc(url) +
        '" alt="' +
        esc(alt) +
        '" title="' +
        esc(title) +
        '" loading="lazy" decoding="async" />'
      );
    });
    var out = "";
    var i = 0;
    while (i < s.length) {
      var a = s.indexOf("[", i);
      if (a < 0) {
        out += s.slice(i);
        break;
      }
      out += s.slice(i, a);
      var b = s.indexOf("]", a + 1);
      if (b < 0 || s.charAt(b + 1) !== "(") {
        out += s.charAt(a);
        i = a + 1;
        continue;
      }
      var depth = 1;
      var k = b + 2;
      while (k < s.length && depth > 0) {
        if (s.charAt(k) === "(") depth += 1;
        else if (s.charAt(k) === ")") depth -= 1;
        k += 1;
      }
      if (depth !== 0) {
        out += s.charAt(a);
        i = a + 1;
        continue;
      }
      var label = s.slice(a + 1, b);
      var href = s.slice(b + 2, k - 1).trim();
      var ext = /^https?:\/\//i.test(href) || /^\/\//.test(href);
      out +=
        '<a href="' +
        esc(href) +
        '"' +
        (ext ? ' target="_blank" rel="noopener noreferrer"' : "") +
        ">" +
        esc(label) +
        "</a>";
      i = k;
    }
    return out
      .split(/(<[^>]+>)/g)
      .map(function (part) {
        if (!part) return "";
        if (part.charAt(0) === "<") return part;
        return esc(part).replace(/\n/g, "<br>");
      })
      .join("");
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
    var admin = isAuthed();
    posts.forEach(function (p) {
      const art = document.createElement("article");
      art.className = "ob-blog-post reveal is-in";
      art.setAttribute("itemprop", "blogPost");
      art.setAttribute("itemscope", "");
      art.setAttribute("itemtype", "https://schema.org/BlogPosting");
      var permalink = p.slug || postSitemapId(p.title || "");
      if (permalink) art.id = permalink;
      else if (p.id) art.id = p.id;
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
        (admin && p.id
          ? '<span class="ob-blog-admin-btns">' +
            '<button type="button" class="ob-blog-edit-btn" data-edit-id="' +
            esc(p.id) +
            '">Изменить</button>' +
            '<button type="button" class="ob-blog-del-btn" data-del-id="' +
            esc(p.id) +
            '" title="удалить безвозвратно" aria-label="удалить безвозвратно">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9zm-1 12h12a1 1 0 0 0 1-1V7H5v13a1 1 0 0 0 1 1z"/></svg>' +
            "</button></span>"
          : "") +
        "</header>" +
        "<h2 itemprop=\"headline\">" +
        esc(p.title) +
        "</h2>" +
        '<div class="ob-blog-body" itemprop="articleBody">' +
        mdToHtml(p.body || "") +
        "</div>";
      feed.appendChild(art);
    });
    document.body.classList.add("is-feed-ready");
    try {
      var raw = new URLSearchParams(location.search).get("id") || "";
      var q = raw;
      try {
        q = decodeURIComponent(raw);
      } catch (e) {}
      if (q && q !== GATE && raw !== GATE) {
        var target = document.getElementById(q);
        if (target) {
          requestAnimationFrame(function () {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
      }
    } catch (e) {}
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

  function mediaContentUrl(path) {
    return (
      "https://api.github.com/repos/" +
      MEDIA.owner +
      "/" +
      MEDIA.repo +
      "/contents/" +
      path
    );
  }

  function bytesToBase64(buffer) {
    var bytes = new Uint8Array(buffer);
    var chunk = 0x8000;
    var binary = "";
    for (var i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunk, bytes.length)));
    }
    return btoa(binary);
  }

  function safeMediaName(name) {
    return String(name || "file")
      .replace(/[^\w.\-а-яА-ЯёЁ]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "file";
  }

  function publicMediaUrl(path) {
    var base = String(MEDIA.publicBase || "").replace(/\/?$/, "/");
    return (
      base +
      String(path || "")
        .split("/")
        .map(function (p) {
          return encodeURIComponent(p);
        })
        .join("/")
    );
  }

  function mediaPathFromUrl(url) {
    var raw = String(url || "").trim().replace(/[.,;]+$/, "");
    if (!raw) return null;
    try {
      var u = new URL(raw, location.href);
      var host = u.hostname.toLowerCase();
      var parts = u.pathname.split("/").filter(Boolean);
      if (host === "raw.githubusercontent.com" || host === "cdn.jsdelivr.net") {
        // raw: /owner/repo/branch/images/file
        // jsdelivr gh: /gh/owner/repo@branch/images/file
        var start = 0;
        if (host === "cdn.jsdelivr.net" && parts[0] === "gh") {
          if (parts[1] !== MEDIA.owner) return null;
          var repoBranch = String(parts[2] || "").split("@");
          if (repoBranch[0] !== MEDIA.repo) return null;
          start = 3;
        } else {
          if (parts[0] !== MEDIA.owner || parts[1] !== MEDIA.repo) return null;
          start = 3; // skip owner/repo/branch
        }
        var path = parts.slice(start).map(decodeURIComponent).join("/");
        if (/^(images|videos)\//.test(path)) return path;
        return null;
      }
      var base = String(MEDIA.publicBase || "").replace(/\/?$/, "/");
      if (base && raw.indexOf(base) === 0) {
        var rest = decodeURIComponent(raw.slice(base.length).split(/[?#]/)[0]);
        if (/^(images|videos)\//.test(rest)) return rest;
      }
      // github.com/owner/media/blob/main/images/...
      if (host === "github.com" && parts[0] === MEDIA.owner && parts[1] === MEDIA.repo && parts[2] === "blob") {
        var p2 = parts.slice(4).map(decodeURIComponent).join("/");
        if (/^(images|videos)\//.test(p2)) return p2;
      }
    } catch (e) {}
    return null;
  }

  function extractMediaPathsFromBody(text) {
    var out = [];
    var seen = Object.create(null);
    var re = /https?:\/\/[^\s)"'\]]+/gi;
    var m;
    var s = String(text || "");
    while ((m = re.exec(s))) {
      var path = mediaPathFromUrl(m[0]);
      if (path && !seen[path]) {
        seen[path] = 1;
        out.push(path);
      }
    }
    return out;
  }

  async function deleteMediaFile(token, path) {
    if (!token || !path) return;
    var url = mediaContentUrl(path);
    var getRes = await fetch(url + "?ref=" + encodeURIComponent(MEDIA.branch), {
      headers: apiHeaders(token),
    });
    if (getRes.status === 404) return;
    if (!getRes.ok) {
      var gt = await getRes.text();
      throw new Error("GitHub media GET " + path + " " + getRes.status + ": " + gt.slice(0, 160));
    }
    var json = await getRes.json();
    var delRes = await fetch(url, {
      method: "DELETE",
      headers: apiHeaders(token),
      body: JSON.stringify({
        message: "media: delete " + path,
        sha: json.sha,
        branch: MEDIA.branch,
      }),
    });
    if (delRes.status === 404) return;
    if (!delRes.ok) {
      var dt = await delRes.text();
      throw new Error("GitHub media DELETE " + path + " " + delRes.status + ": " + dt.slice(0, 160));
    }
  }

  async function deleteMediaFromBody(token, body) {
    var paths = extractMediaPathsFromBody(body);
    var errors = [];
    for (var i = 0; i < paths.length; i++) {
      try {
        await deleteMediaFile(token, paths[i]);
      } catch (e) {
        errors.push((e && e.message) || String(e));
      }
    }
    if (errors.length) throw new Error(errors[0]);
  }

  async function uploadMediaFile(token, kind, file) {
    if (!token) throw new Error("Сначала войдите в админ (нужен GitHub token)");
    if (!file) throw new Error("Файл не выбран");
    if (file.size > MEDIA.maxBytes) {
      throw new Error(
        "Файл слишком большой для API (" +
          Math.round(file.size / 1024 / 1024) +
          " МБ). Лимит сейчас " +
          Math.round(MEDIA.maxBytes / 1024 / 1024) +
          " МБ"
      );
    }
    var ext = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (kind === "image" && !ext) ext = "jpg";
    if (kind === "video" && !ext) ext = "mp4";
    var stamp = Date.now().toString(36);
    var baseName = safeMediaName(file.name.replace(/\.[^.]+$/, ""));
    var folder = kind === "video" ? "videos" : "images";
    var path = folder + "/" + stamp + "-" + baseName + (ext ? "." + ext : "");
    var buf = await file.arrayBuffer();
    var url = mediaContentUrl(path);
    var sha = null;
    var getRes = await fetch(url + "?ref=" + encodeURIComponent(MEDIA.branch), {
      headers: apiHeaders(token),
    });
    if (getRes.ok) {
      var got = await getRes.json();
      sha = got.sha || null;
    } else if (getRes.status !== 404) {
      var gt = await getRes.text();
      throw new Error("GitHub media GET " + getRes.status + ": " + gt.slice(0, 160));
    }
    var payload = {
      message: "media: add " + path,
      content: bytesToBase64(buf),
      branch: MEDIA.branch,
    };
    if (sha) payload.sha = sha;
    var putRes = await fetch(url, {
      method: "PUT",
      headers: apiHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!putRes.ok) {
      var pt = await putRes.text();
      throw new Error("GitHub media PUT " + putRes.status + ": " + pt.slice(0, 220));
    }
    return publicMediaUrl(path);
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
    // Same name → same slug. Do not mint телега1/2/3 junk for sitemap.
    return slugify(base) || "tag";
  }

  function queuePendingTag(name, extra) {
    var slug = uniqueSlug(name);
    var reuse = pendingTags.find(function (t) {
      return t && (t.slug === slug || slugify(t.name) === slug);
    });
    if (reuse) return reuse;
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

  function normalizeOfftopHref(base, label) {
    var clean = String(label || "").trim().replace(/^#+/, "");
    if (!clean) return String(base || "");
    var tag = queuePendingTag(clean);
    return "offtop.html?id=" + encodeURIComponent(tag.slug);
  }

  function normalizeBodyLinks(bodyText) {
    var body = String(bodyText || "");

    // [#Тег](offtop.html?id=old-slug) -> rebuild id from tag label
    body = body.replace(
      /\[#([^\]]+)\]\(((?:https?:\/\/[^)\s]+\/)?offtop\.html\?id=[^)]+)\)/gi,
      function (_, label) {
        var clean = String(label || "").trim();
        if (!clean) return _;
        return "[#" + clean + "](" + normalizeOfftopHref("offtop.html", clean) + ")";
      }
    );

    // [![Alt](img)](offtop.html?id=old-slug) -> rebuild id from alt text
    body = body.replace(
      /\[!\[([^\]]*)\]\(([^)]+)\)\]\(((?:https?:\/\/[^)\s]+\/)?offtop\.html\?id=[^)]+)\)/gi,
      function (_, alt, img) {
        var cleanAlt = String(alt || "").trim();
        if (!cleanAlt) return _;
        return (
          "[![" +
          cleanAlt +
          "](" +
          String(img || "").trim() +
          ")](" +
          normalizeOfftopHref("offtop.html", cleanAlt) +
          ")"
        );
      }
    );

    // [!![Alt](video)](offtop.html?id=old-slug) -> rebuild id from alt text
    body = body.replace(
      /\[!!\[([^\]]*)\]\(([^)]+)\)\]\(((?:https?:\/\/[^)\s]+\/)?offtop\.html\?id=[^)]+)\)/gi,
      function (_, alt, vid) {
        var cleanAlt = String(alt || "").trim();
        if (!cleanAlt) return _;
        return (
          "[!![" +
          cleanAlt +
          "](" +
          String(vid || "").trim() +
          ")](" +
          normalizeOfftopHref("offtop.html", cleanAlt) +
          ")"
        );
      }
    );

    return body;
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

  function postSitemapId(title) {
    return "ох-барбара-" + (slugify(title) || "post");
  }

  function appendSitemapUrls(xml, urls) {
    var block = urls
      .map(function (u) {
        return (
          "<url><loc>" +
          u +
          "</loc><lastmod>" +
          new Date().toISOString().slice(0, 10) +
          "</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>\n"
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
    pendingTags = [];
  }

  async function commitPostSitemap(token, title) {
    const id = postSitemapId(title);
    const a = "https://oh-barbara.com/offtop.html?id=" + id;
    const aEnc = "https://oh-barbara.com/offtop.html?id=" + encodeURIComponent(id);
    const sm = await fetchFile(token, "sitemap.xml");
    sitemapSha = sm.sha;
    let xml = sm.text || "";
    if (!xml || sitemapHas(xml, a) || sitemapHas(xml, aEnc)) return;
    xml = appendSitemapUrls(xml, [a]);
    sitemapSha = await putFile(token, "sitemap.xml", xml, sitemapSha, "blog: sitemap post");
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
      document.body.classList.add("is-feed-ready");
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
    if (logoutBtn) logoutBtn.hidden = !on;
  }

  function clearAdminUrl() {
    try {
      var raw = new URLSearchParams(location.search).get("id") || "";
      var id = raw;
      try {
        id = decodeURIComponent(raw);
      } catch (e) {}
      if (id !== GATE && raw !== GATE) return;
      history.replaceState(null, "", "offtop.html" + (location.hash || ""));
    } catch (e) {}
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
    clearEditorFields();
    clearAdminUrl();
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
    var videoBtn = document.getElementById("ob-md-video");
    var linkPanel = document.getElementById("ob-md-link-panel");
    var imgPanel = document.getElementById("ob-md-img-panel");
    var videoPanel = document.getElementById("ob-md-video-panel");
    var linkOk = document.getElementById("ob-md-link-ok");
    var imgOk = document.getElementById("ob-md-img-ok");
    var videoOk = document.getElementById("ob-md-video-ok");

    function showPanel(which) {
      var linkOn = which === "link";
      var imgOn = which === "img";
      var videoOn = which === "video";
      if (linkPanel) linkPanel.hidden = !linkOn;
      if (imgPanel) imgPanel.hidden = !imgOn;
      if (videoPanel) videoPanel.hidden = !videoOn;
      if (linkBtn) linkBtn.setAttribute("aria-expanded", linkOn ? "true" : "false");
      if (imgBtn) imgBtn.setAttribute("aria-expanded", imgOn ? "true" : "false");
      if (videoBtn) videoBtn.setAttribute("aria-expanded", videoOn ? "true" : "false");
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
    if (videoBtn) {
      videoBtn.addEventListener("click", function () {
        showPanel(videoPanel && videoPanel.hidden ? "video" : "");
      });
    }

    if (linkOk) {
      linkOk.addEventListener("click", function () {
        var name = ((document.getElementById("ob-md-link-name") || {}).value || "").trim();
        var tagsRaw = ((document.getElementById("ob-md-link-tags") || {}).value || "").trim();
        var url = ((document.getElementById("ob-md-link-url") || {}).value || "").trim();
        if (!name || !url) return;
        var first = "";
        tagsRaw.split(",").forEach(function (part) {
          var n = part.trim().replace(/^#+/, "");
          if (n && !first) first = n;
        });
        var tagLabel = first || name;
        var tag = queuePendingTag(tagLabel);
        if (slugify(name) !== tag.slug) queuePendingTag(name);
        tagsRaw.split(",").forEach(function (part) {
          var n = part.trim().replace(/^#+/, "");
          if (n && slugify(n) !== tag.slug && slugify(n) !== slugify(name)) queuePendingTag(n);
        });
        var safeName = name.replace(/[\[\]]/g, "");
        var safeTag = tagLabel.replace(/[\[\]]/g, "");
        var md =
          "ссылка: [" +
          safeName +
          "](" +
          url +
          ") [#" +
          safeTag +
          "](offtop.html?id=" +
          encodeURIComponent(tag.slug) +
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
          ")](offtop.html?id=" +
          encodeURIComponent(tag.slug) +
          ")";
        insertAtCursor(body, md);
        if (document.getElementById("ob-md-img-name")) document.getElementById("ob-md-img-name").value = "";
        if (document.getElementById("ob-md-img-url")) document.getElementById("ob-md-img-url").value = "";
        showPanel("");
      });
    }

    if (videoOk) {
      videoOk.addEventListener("click", function () {
        var name = ((document.getElementById("ob-md-video-name") || {}).value || "").trim();
        var url = ((document.getElementById("ob-md-video-url") || {}).value || "").trim();
        if (!name || !url) return;
        var tag = queuePendingTag(name);
        var safe = name.replace(/[\[\]\"]/g, "");
        var md =
          "[!![" +
          safe +
          "](" +
          url +
          ")](offtop.html?id=" +
          encodeURIComponent(tag.slug) +
          ")";
        insertAtCursor(body, md);
        if (document.getElementById("ob-md-video-name")) document.getElementById("ob-md-video-name").value = "";
        if (document.getElementById("ob-md-video-url")) document.getElementById("ob-md-video-url").value = "";
        showPanel("");
      });
    }

    function wireUpload(kind) {
      var fileInput = document.getElementById(kind === "video" ? "ob-md-video-file" : "ob-md-img-file");
      var uploadBtn = document.getElementById(kind === "video" ? "ob-md-video-upload" : "ob-md-img-upload");
      var urlInput = document.getElementById(kind === "video" ? "ob-md-video-url" : "ob-md-img-url");
      var nameInput = document.getElementById(kind === "video" ? "ob-md-video-name" : "ob-md-img-name");
      var errEl = document.getElementById(kind === "video" ? "ob-md-video-upload-err" : "ob-md-img-upload-err");
      var okEl = document.getElementById(kind === "video" ? "ob-md-video-upload-ok" : "ob-md-img-upload-ok");
      if (!fileInput || !uploadBtn) return;

      function setMsg(ok, text) {
        if (errEl) {
          errEl.hidden = !!ok || !text;
          errEl.textContent = ok ? "" : text || "";
        }
        if (okEl) {
          okEl.hidden = !ok || !text;
          okEl.textContent = ok ? text || "" : "";
        }
      }

      uploadBtn.addEventListener("click", function () {
        fileInput.click();
      });

      fileInput.addEventListener("change", async function () {
        var file = fileInput.files && fileInput.files[0];
        fileInput.value = "";
        if (!file) return;
        var token = sessionStorage.getItem("ob_blog_gh") || "";
        setMsg(false, "");
        setMsg(true, "Загрузка в GitHub media…");
        uploadBtn.disabled = true;
        try {
          var url = await uploadMediaFile(token, kind === "video" ? "video" : "image", file);
          if (urlInput) urlInput.value = url;
          if (nameInput && !String(nameInput.value || "").trim()) {
            nameInput.value = String(file.name || "").replace(/\.[^.]+$/, "");
          }
          setMsg(true, "Готово. Ссылка подставлена — нажмите «Вставить " + (kind === "video" ? "видео" : "картинку") + "»");
        } catch (e) {
          setMsg(false, (e && e.message) || "Ошибка загрузки");
        }
        uploadBtn.disabled = false;
      });
    }

    wireUpload("image");
    wireUpload("video");
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
        const remote = await fetchRemoteBlog(token);
        await refreshKnownSlugs(token);
        sessionStorage.setItem("ob_blog_ok", "1");
        sessionStorage.setItem("ob_blog_gh", token);
        blogData = remote;
        showEditor(true);
        setPublishLabel();
        render();
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
      clearEditorFields();
      showEditor(false);
      render();
    });
  }

  if (feed) {
    feed.addEventListener("click", function (e) {
      var editBtn = e.target.closest("[data-edit-id]");
      if (editBtn && feed.contains(editBtn)) {
        startEdit(editBtn.getAttribute("data-edit-id"));
        return;
      }
      var delBtn = e.target.closest("[data-del-id]");
      if (!delBtn || !feed.contains(delBtn)) return;
      var delId = delBtn.getAttribute("data-del-id");
      if (!delId || !isAuthed()) return;
      (async function () {
        var token = sessionStorage.getItem("ob_blog_gh") || "";
        try {
          delBtn.disabled = true;
          var remote = await fetchRemoteBlog(token);
          var list = Array.isArray(remote.posts) ? remote.posts : [];
          var victim = null;
          for (var i = 0; i < list.length; i++) {
            if (list[i] && list[i].id === delId) {
              victim = list[i];
              break;
            }
          }
          if (victim && victim.body) {
            await deleteMediaFromBody(token, victim.body);
          }
          remote.posts = list.filter(function (p) {
            return p && p.id !== delId;
          });
          remote.updated = new Date().toISOString();
          await commitBlog(token, remote, "blog: delete " + delId);
          blogData = remote;
          if (editingId === delId) {
            clearEditorFields();
            closeModal();
          }
          render();
        } catch (err) {
          delBtn.disabled = false;
          window.alert(err.message || String(err));
        }
      })();
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
      const bodyEl = document.getElementById("ob-blog-body");
      const bodyRaw = ((bodyEl || {}).value || "").trim();
      const body = normalizeBodyLinks(bodyRaw);
      if (bodyEl && body !== bodyRaw) bodyEl.value = body;
      if (!title || !body) return;
      try {
        const remote = await fetchRemoteBlog(token);
        remote.posts = Array.isArray(remote.posts) ? remote.posts : [];
        const now = new Date().toISOString();
        if (editingId) {
          var found = null;
          for (var i = 0; i < remote.posts.length; i++) {
            if (remote.posts[i] && remote.posts[i].id === editingId) {
              found = remote.posts[i];
              break;
            }
          }
          if (!found) throw new Error("Пост не найден");
          found.title = title;
          found.type = type;
          found.body = body;
          found.slug = postSitemapId(title);
          found.updated = now;
          if (pendingTags.length) {
            found.tags = (found.tags || []).concat(
              pendingTags.map(function (t) {
                return t.slug;
              })
            );
          }
          remote.updated = now;
          await commitPendingMeta(token);
          await commitPostSitemap(token, title);
          await commitBlog(token, remote, "blog: edit " + title.slice(0, 64));
          blogData = remote;
          render();
          clearEditorFields();
          closeModal();
        } else {
          const post = {
            id: "post-" + Date.now().toString(36),
            title: title,
            type: type,
            body: body,
            slug: postSitemapId(title),
            created: now,
            author: "oh_barbara",
            tags: pendingTags.map(function (t) {
              return t.slug;
            }),
          };
          remote.posts.unshift(post);
          remote.updated = now;
          await commitPendingMeta(token);
          await commitPostSitemap(token, title);
          await commitBlog(token, remote, "blog: " + title.slice(0, 72));
          blogData = remote;
          render();
          clearEditorFields();
          if (saveOk) {
            saveOk.hidden = false;
            saveOk.textContent = "Опубликовано.";
          }
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

  (function headerScroll() {
    var head = document.querySelector(".site-header");
    if (!head) return;
    var last = window.scrollY || 0;
    var armed = false;
    function onScroll() {
      var y = window.scrollY || 0;
      if (!armed) {
        last = y;
        return;
      }
      if (y <= 8) head.classList.remove("is-hidden");
      else if (y > last && y > 64) head.classList.add("is-hidden");
      last = y;
    }
    function arm() {
      head.classList.remove("is-hidden");
      last = window.scrollY || 0;
      setTimeout(function () {
        last = window.scrollY || 0;
        armed = true;
      }, 200);
    }
    addEventListener("scroll", onScroll, { passive: true });
    if (document.readyState === "complete") arm();
    else addEventListener("load", arm);
  })();

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
