(() => {
  const CHANNEL = "oh_barbara";
  const parents = ["oh-barbara.com", "www.oh-barbara.com", "localhost", "127.0.0.1"];

  function chatSrc() {
    const host = location.hostname || "localhost";
    const list = parents.slice();
    if (host && list.indexOf(host) === -1) list.push(host);
    const q = list.map((p) => "parent=" + encodeURIComponent(p)).join("&");
    return "https://www.twitch.tv/embed/" + CHANNEL + "/chat?" + q + "&darkpopout";
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

    function open() {
      panel.hidden = false;
      fab.setAttribute("aria-expanded", "true");
      mountFrame(frame);
    }
    function close() {
      panel.hidden = true;
      fab.setAttribute("aria-expanded", "false");
    }
    function toggle() {
      if (panel.hidden) open();
      else close();
    }

    fab.addEventListener("click", toggle);
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();