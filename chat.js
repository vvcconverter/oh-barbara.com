(() => {
  const CHANNEL = "oh_barbara";
  const CHAT_IDS = { chat:1, "oh-barbara_chat":1 }; const CHAT_ID = "chat";
  const parents = ["oh-barbara.com", "www.oh-barbara.com", "localhost", "127.0.0.1"];

  function chatSrc() {
    const host = location.hostname || "localhost";
    const list = parents.slice();
    if (host && list.indexOf(host) === -1) list.push(host);
    const q = list.map((p) => "parent=" + encodeURIComponent(p)).join("&");
    return "https://www.twitch.tv/embed/" + CHANNEL + "/chat?" + q + "&darkpopout";
  }

  function isChatId() {
    try {
      const p = new URLSearchParams(location.search);
      let id = (p.get("id") || p.get("tag") || "").trim().toLowerCase();
      if (window.OB_TAGS && OB_TAGS.resolve) id = String(OB_TAGS.resolve(id) || id).toLowerCase();
      return !!(CHAT_IDS[id] || id === CHAT_ID || id === "oh-barbara_chat");
    } catch (e) {
      return false;
    }
  }

  function setChatUrl() {
    try {
      const u = new URL(location.href);
      u.searchParams.set("id", CHAT_ID);
      u.searchParams.delete("tag");
      u.searchParams.delete("n");
      u.searchParams.delete("name");
      const next = u.pathname + "?" + u.searchParams.toString() + u.hash;
      if (location.pathname + location.search + location.hash !== next) {
        history.pushState({ obChat: true }, "", next);
      }
    } catch (e) {}
    try {
      document.title = "Чат Twitch — oh_barbara";
      const og = document.getElementById("ob-og-url");
      if (og) og.setAttribute("content", "https://oh-barbara.com/index.html?id=chat");
      const canon = document.getElementById("ob-canon");
      if (canon) canon.setAttribute("href", "https://oh-barbara.com/index.html?id=chat");
    } catch (e) {}
  }

  function clearChatUrl() {
    try {
      const u = new URL(location.href);
      let id = (u.searchParams.get("id") || "").toLowerCase();
      if (window.OB_TAGS && OB_TAGS.resolve) id = String(OB_TAGS.resolve(id) || id).toLowerCase();
      if (!(CHAT_IDS[id] || id === CHAT_ID || id === "oh-barbara_chat")) return;
      u.searchParams.delete("id");
      u.searchParams.delete("tag");
      const qs = u.searchParams.toString();
      const next = u.pathname + (qs ? "?" + qs : "") + u.hash;
      history.pushState({ obChat: false }, "", next);
    } catch (e) {}
  }

  function mountFrame(box) {
    if (!box || box.querySelector("iframe")) return;
    box.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = chatSrc();
    iframe.title = "Чат Twitch oh_barbara";
    iframe.allow = "clipboard-write; fullscreen";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    box.appendChild(iframe);
  }

  function initWidget() {
    const fab = document.getElementById("ob-chat-fab");
    const panel = document.getElementById("ob-chat-panel");
    const closeBtn = document.getElementById("ob-chat-close");
    const frame = document.getElementById("ob-chat-frame");
    if (!fab || !panel || !frame) return;

    let syncing = false;

    function open(fromUrl) {
      panel.hidden = false;
      fab.setAttribute("aria-expanded", "true");
      mountFrame(frame);
      if (!fromUrl && !syncing) setChatUrl();
    }
    function close(fromUrl) {
      panel.hidden = true;
      fab.setAttribute("aria-expanded", "false");
      if (!fromUrl && !syncing) clearChatUrl();
    }
    function toggle() {
      if (panel.hidden) open(false);
      else close(false);
    }

    fab.addEventListener("click", toggle);
    if (closeBtn) closeBtn.addEventListener("click", () => close(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) close(false);
    });

    window.addEventListener("popstate", () => {
      syncing = true;
      if (isChatId()) open(true);
      else close(true);
      syncing = false;
    });

    if (isChatId()) open(true);

    window.__obOpenChat = () => open(false);
    window.__obCloseChat = () => close(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
