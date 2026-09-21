(function () {
  var API = "https://wild-union-f245.otziv.workers.dev";
  var OZ_TS_KEY = "0x4AAAAAAD01AYnC8EuRja7z";
  var REVIEW_SLUG = "oh-barbara";
  var REVIEW_ID = "muajr3ej5o2c2y";
  var ozTsWidget = null;

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stars(n) {
    var v = Math.min(5, Math.max(0, Math.round(+n || 0)));
    var s = "";
    for (var i = 1; i <= 5; i++) s += i <= v ? "★" : "☆";
    return s;
  }

  function fmtDate(d) {
    if (!d) return "";
    try {
      var dt = new Date(d);
      if (isNaN(dt.getTime())) return String(d);
      return dt.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return String(d);
    }
  }

  function slugify(name) {
    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^a-z0-9а-я]+/gi, "-")
      .replace(/^-+|-+$/g, "");
  }

  function resolveReviewId() {
    return fetch("https://ot-ziv.com/data/published.json?t=" + Date.now())
      .then(function (r) {
        return r.ok ? r.json() : [];
      })
      .then(function (data) {
        var list = Array.isArray(data) ? data : [];
        for (var i = 0; i < list.length; i++) {
          var it = list[i];
          if (!it) continue;
          if (slugify(it.name) === REVIEW_SLUG || String(it.id || "") === REVIEW_ID) {
            REVIEW_ID = it.id;
            return REVIEW_ID;
          }
          var tags = String(it.tags || "").split(",");
          for (var t = 0; t < tags.length; t++) {
            if (slugify(tags[t]) === REVIEW_SLUG) {
              REVIEW_ID = it.id;
              return REVIEW_ID;
            }
          }
        }
        return REVIEW_ID;
      })
      .catch(function () {
        return REVIEW_ID;
      });
  }

  function renderComments(comments) {
    var list = document.getElementById("oz-clist");
    if (!list) return;
    list.innerHTML = "";
    if (!comments || !comments.length) {
      list.innerHTML =
        '<p class="oz-c-empty">Пока нет комментариев. Будьте первым.</p>';
      return;
    }
    comments.forEach(function (c) {
      if (!c) return;
      var div = document.createElement("div");
      div.className = "oz-c";
      div.setAttribute("data-cid", c.id || "");
      div.innerHTML =
        '<div class="oz-c-head"><span class="oz-c-name">' +
        esc(c.user) +
        '</span><span class="g" aria-label="' +
        (+c.rating || 0) +
        ' из 5">' +
        stars(c.rating) +
        "</span><span>" +
        esc(fmtDate(c.date) || c.date || "") +
        '</span></div><p class="oz-c-text">' +
        esc(c.text) +
        "</p>";
      list.appendChild(div);
    });
  }

  function applyScore(avg, count) {
    var n = Math.max(0, parseInt(count, 10) || 0);
    var show = n > 0 ? +avg || 5 : 5;
    var rounded = Math.min(5, Math.max(1, Math.round(show)));
    var score = (Math.round(show * 10) / 10).toFixed(1);
    var starEl = document.getElementById("ob-oz-stars");
    var scoreEl = document.getElementById("ob-oz-score");
    if (starEl) {
      starEl.setAttribute(
        "aria-label",
        score + " из 5" + (n > 0 ? ", по оценкам в комментариях" : "")
      );
      starEl.textContent = stars(rounded);
    }
    if (scoreEl) {
      scoreEl.textContent = score + " / 5" + (n > 0 ? " · " + n : "");
    }
  }

  function loadComments() {
    fetch(
      API +
        "/comments?review=" +
        encodeURIComponent(REVIEW_ID) +
        "&t=" +
        Date.now()
    )
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        renderComments((d && d.comments) || []);
        applyScore(d && d.avgRating, d && d.ratingCount);
      })
      .catch(function () {
        var list = document.getElementById("oz-clist");
        if (list)
          list.innerHTML =
            '<p class="oz-c-empty">Не удалось загрузить комментарии.</p>';
      });
  }

  function ozRenderTurnstile() {
    var box = document.getElementById("h");
    if (!box || !OZ_TS_KEY) return;
    function run() {
      if (typeof turnstile === "undefined") {
        setTimeout(run, 80);
        return;
      }
      if (ozTsWidget !== null) {
        try {
          turnstile.remove(ozTsWidget);
        } catch (ex) {}
        ozTsWidget = null;
        box.innerHTML = "";
      }
      ozTsWidget = turnstile.render(box, {
        sitekey: OZ_TS_KEY,
        theme: "dark",
        size: "flexible",
      });
    }
    run();
  }

  var form = document.getElementById("oz-c-form");
  var formErr = document.getElementById("bj");
  var ratingInput = document.getElementById("oz-c-rating");
  var starBtns = document.querySelectorAll("#oz-c-db .ds");

  function setStars(n) {
    n = Math.min(5, Math.max(1, +n || 5));
    if (ratingInput) ratingInput.value = String(n);
    starBtns.forEach(function (btn) {
      btn.classList.toggle("dv", (+btn.getAttribute("data-v") || 0) <= n);
    });
  }

  starBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setStars(btn.getAttribute("data-v"));
    });
  });
  setStars(5);

  function showErr(msg) {
    if (!formErr) return;
    formErr.textContent = msg;
    formErr.classList.add("dr");
  }

  function hideErr() {
    if (formErr) formErr.classList.remove("dr");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideErr();
      var gotchaEl = form.querySelector("[name=_gotcha]");
      if (gotchaEl && gotchaEl.value.trim()) return;
      var ts = form.querySelector("[name='cf-turnstile-response']");
      if (!ts || !ts.value) {
        showErr("Пройдите проверку Cloudflare.");
        return;
      }
      var name = ((document.getElementById("oz-c-name") || {}).value || "").trim();
      var text = ((document.getElementById("oz-c-text") || {}).value || "").trim();
      if (!name || !text) return;
      var rating = +((ratingInput && ratingInput.value) || 5) || 5;
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      fetch(API + "/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review: REVIEW_ID,
          user: name,
          text: text,
          rating: rating,
          "cf-turnstile-response": ts.value,
          _gotcha: "",
        }),
      })
        .then(function (r) {
          return r.json().then(function (d) {
            return { ok: r.ok, d: d };
          });
        })
        .then(function (x) {
          if (btn) btn.disabled = false;
          if (!x.ok) {
            showErr((x.d && x.d.error) || "Не удалось отправить");
            if (ozTsWidget !== null && window.turnstile) {
              try {
                turnstile.reset(ozTsWidget);
              } catch (ex) {}
            }
            return;
          }
          form.reset();
          setStars(5);
          if (ozTsWidget !== null && window.turnstile) {
            try {
              turnstile.reset(ozTsWidget);
            } catch (ex) {}
          }
          loadComments();
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          showErr("Сеть недоступна");
        });
    });
  }

  resolveReviewId().then(function () {
    loadComments();
    ozRenderTurnstile();
    setInterval(loadComments, 20000);
  });
})();