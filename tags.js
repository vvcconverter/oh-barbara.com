(function (w) {
  var BY_CAT = {
    Площадки: [
      { slug: "twitch-oh-barbara", name: "Twitch oh_barbara" },
      { slug: "твич-ох-барбара", name: "Твич Ох_Барбара" },
      { slug: "instagram-oh-barbara", name: "Instagram oh_barbara" },
      { slug: "инстаграм-ох-барбара", name: "Инстаграм Ох_Барбара" },
      { slug: "telegram-oh-barbara", name: "Telegram oh_barbara" },
      { slug: "телеграм-ох-барбара", name: "Телеграм Ох_Барбара" },
      { slug: "boosty-oh-barbara", name: "Boosty oh_barbara" },
      { slug: "бусти-ох-барбара", name: "Бусти Ох_Барбара" },
      { slug: "donationalerts-oh-barbara", name: "DonationAlerts oh_barbara" },
      { slug: "донат-ох-барбара", name: "Донат Ох_Барбара" },
      { slug: "youtube-oh-barbara", name: "YouTube oh_barbara" },
      { slug: "ютуб-ох-барбара", name: "Ютуб Ох_Барбара" },
      { slug: "kick-oh-barbara", name: "Kick oh_barbara" },
      { slug: "кик-ох-барбара", name: "Kick Ох_Барбара" },
      { slug: "trovo-oh-barbara", name: "Trovo oh_barbara" },
      { slug: "трово-ох-барбара", name: "Trovo Ох_Барбара" },
    ],
    Контент: [
      { slug: "just-chatting-oh-barbara", name: "Just Chatting oh_barbara" },
      { slug: "джест-чатинг-ох-барбара", name: "Just Chatting Ох_Барбара" },
      { slug: "irl-oh-barbara", name: "IRL oh_barbara" },
      { slug: "ирл-ох-барбара", name: "IRL Ох_Барбара" },
      { slug: "lifestyle-oh-barbara", name: "Lifestyle oh_barbara" },
      { slug: "лайфстайл-ох-барбара", name: "Лайфстайл Ох_Барбара" },
      { slug: "fashion-oh-barbara", name: "Fashion oh_barbara" },
      { slug: "фешен-ох-барбара", name: "Fashion Ох_Барбара" },
      { slug: "unboxing-oh-barbara", name: "Unboxing oh_barbara" },
      { slug: "анпакинг-ох-барбара", name: "Анпакинг Ох_Барбара" },
      { slug: "streamer-oh-barbara", name: "streamer oh_barbara" },
      { slug: "стример-oh-barbara", name: "стример oh_barbara" },
      { slug: "стример-ох-барбара", name: "стример Ох_Барбара" },
      { slug: "model-oh-barbara", name: "model oh_barbara" },
      { slug: "модель-ох-барбара", name: "модель Ох_Барбара" },
      { slug: "video-oh-barbara", name: "video oh_barbara" },
    ],
    Локация: [
      { slug: "phuket-oh-barbara", name: "Phuket oh_barbara", pin: true },
      { slug: "пхукет-ох-барбара", name: "Пхукет Ох_Барбара", pin: true },
      { slug: "thailand-oh-barbara", name: "ประเทศไทย oh_barbara", pin: true },
      { slug: "таиланд-ох-барбара", name: "Таиланд Ох_Барбара", pin: true },
      { slug: "russia-oh-barbara", name: "Russia oh_barbara" },
      { slug: "россия-ох-барбара", name: "Россия Ох_Барбара" },
      { slug: "kazakhstan-oh-barbara", name: "Qazaqstan oh_barbara" },
      { slug: "казахстан-ох-барбара", name: "Казахстан Ох_Барбара" },
      { slug: "belarus-oh-barbara", name: "Bielaruś oh_barbara" },
      { slug: "беларусь-ох-барбара", name: "Беларусь Ох_Барбара" },
      { slug: "ukraine-oh-barbara", name: "Україна oh_barbara" },
      { slug: "украина-ох-барбара", name: "Украина Ох_Барбара" },
      { slug: "uzbekistan-oh-barbara", name: "Oʻzbekiston oh_barbara" },
      { slug: "узбекистан-ох-барбара", name: "Узбекистан Ох_Барбара" },
      { slug: "armenia-oh-barbara", name: "Hayastan oh_barbara" },
      { slug: "армения-ох-барбара", name: "Армения Ох_Барбара" },
      { slug: "azerbaijan-oh-barbara", name: "Azərbaycan oh_barbara" },
      { slug: "азербайджан-ох-барбара", name: "Азербайджан Ох_Барбара" },
      { slug: "georgia-oh-barbara", name: "Sakartvelo oh_barbara" },
      { slug: "грузия-ох-барбара", name: "Грузия Ох_Барбара" },
      { slug: "kyrgyzstan-oh-barbara", name: "Kyrgyzstan oh_barbara" },
      { slug: "кыргызстан-ох-барбара", name: "Кыргызстан Ох_Барбара" },
      { slug: "moldova-oh-barbara", name: "Moldova oh_barbara" },
      { slug: "молдова-ох-барбара", name: "Молдова Ох_Барбара" },
      { slug: "tajikistan-oh-barbara", name: "Tojikiston oh_barbara" },
      { slug: "таджикистан-ох-барбара", name: "Таджикистан Ох_Барбара" },
      { slug: "turkmenistan-oh-barbara", name: "Türkmenistan oh_barbara" },
      { slug: "туркменистан-ох-барбара", name: "Туркменистан Ох_Барбара" },
      { slug: "krasnodar-oh-barbara", name: "Krasnodar oh_barbara" },
      { slug: "краснодар-ох-барбара", name: "Краснодар Ох_Барбара" },
      { slug: "germany-oh-barbara", name: "Deutschland oh_barbara" },
      { slug: "германия-ох-барбара", name: "Германия Ох_Барбара" },
      { slug: "france-oh-barbara", name: "France oh_barbara" },
      { slug: "франция-ох-барбара", name: "Франция Ох_Барбара" },
      { slug: "italy-oh-barbara", name: "Italia oh_barbara" },
      { slug: "италия-ох-барбара", name: "Италия Ох_Барбара" },
      { slug: "spain-oh-barbara", name: "España oh_barbara" },
      { slug: "испания-ох-барбара", name: "Испания Ох_Барбара" },
      { slug: "poland-oh-barbara", name: "Polska oh_barbara" },
      { slug: "польша-ох-барбара", name: "Польша Ох_Барбара" },
      { slug: "czech-oh-barbara", name: "Česko oh_barbara" },
      { slug: "чехия-ох-барбара", name: "Чехия Ох_Барбара" },
      { slug: "netherlands-oh-barbara", name: "Nederland oh_barbara" },
      { slug: "нидерланды-ох-барбара", name: "Нидерланды Ох_Барбара" },
      { slug: "belgium-oh-barbara", name: "België oh_barbara" },
      { slug: "бельгия-ох-барбара", name: "Бельгия Ох_Барбара" },
      { slug: "austria-oh-barbara", name: "Österreich oh_barbara" },
      { slug: "австрия-ох-барбара", name: "Австрия Ох_Барбара" },
      { slug: "switzerland-oh-barbara", name: "Schweiz oh_barbara" },
      { slug: "швейцария-ох-барбара", name: "Швейцария Ох_Барбара" },
      { slug: "uk-oh-barbara", name: "United Kingdom oh_barbara" },
      { slug: "великобритания-ох-барбара", name: "Великобритания Ох_Барбара" },
      { slug: "portugal-oh-barbara", name: "Portugal oh_barbara" },
      { slug: "португалия-ох-барбара", name: "Португалия Ох_Барбара" },
      { slug: "greece-oh-barbara", name: "Ελλάδα oh_barbara" },
      { slug: "греция-ох-барбара", name: "Греция Ох_Барбара" },
      { slug: "sweden-oh-barbara", name: "Sverige oh_barbara" },
      { slug: "швеция-ох-барбара", name: "Швеция Ох_Барбара" },
      { slug: "norway-oh-barbara", name: "Norge oh_barbara" },
      { slug: "норвегия-ох-барбара", name: "Норвегия Ох_Барбара" },
      { slug: "finland-oh-barbara", name: "Suomi oh_barbara" },
      { slug: "финляндия-ох-барбара", name: "Финляндия Ох_Барбара" },
      { slug: "denmark-oh-barbara", name: "Danmark oh_barbara" },
      { slug: "дания-ох-барбара", name: "Дания Ох_Барбара" },
      { slug: "romania-oh-barbara", name: "România oh_barbara" },
      { slug: "румыния-ох-барбара", name: "Румыния Ох_Барбара" },
      { slug: "hungary-oh-barbara", name: "Magyarország oh_barbara" },
      { slug: "венгрия-ох-барбара", name: "Венгрия Ох_Барбара" },
      { slug: "bulgaria-oh-barbara", name: "България oh_barbara" },
      { slug: "болгария-ох-барбара", name: "Болгария Ох_Барбара" },
      { slug: "serbia-oh-barbara", name: "Srbija oh_barbara" },
      { slug: "сербия-ох-барбара", name: "Сербия Ох_Барбара" },
      { slug: "croatia-oh-barbara", name: "Hrvatska oh_barbara" },
      { slug: "хорватия-ох-барбара", name: "Хорватия Ох_Барбара" },
      { slug: "slovakia-oh-barbara", name: "Slovensko oh_barbara" },
      { slug: "словакия-ох-барбара", name: "Словакия Ох_Барбара" },
      { slug: "slovenia-oh-barbara", name: "Slovenija oh_barbara" },
      { slug: "словения-ох-барбара", name: "Словения Ох_Барбара" },
      { slug: "lithuania-oh-barbara", name: "Lietuva oh_barbara" },
      { slug: "литва-ох-барбара", name: "Литва Ох_Барбара" },
      { slug: "latvia-oh-barbara", name: "Latvija oh_barbara" },
      { slug: "латвия-ох-барбара", name: "Латвия Ох_Барбара" },
      { slug: "estonia-oh-barbara", name: "Eesti oh_barbara" },
      { slug: "эстония-ох-барбара", name: "Эстония Ох_Барбара" },
      { slug: "ireland-oh-barbara", name: "Éire oh_barbara" },
      { slug: "ирландия-ох-барбара", name: "Ирландия Ох_Барбара" },
      { slug: "usa-oh-barbara", name: "USA oh_barbara" },
      { slug: "сша-ох-барбара", name: "США Ох_Барбара" },
    ],
    Персона: [
      { slug: "oh-barbara", name: "oh_barbara" },
      { slug: "ох-барбара", name: "Ох_Барбара" },
    ],
    Разделы: [
      { slug: "oh-barbara_about", name: "О себе oh_barbara" },
      { slug: "oh-barbara_gallery", name: "Галерея oh_barbara" },
      { slug: "oh-barbara_stream", name: "Стрим oh_barbara" },
      { slug: "oh-barbara_clips", name: "Клипы oh_barbara" },
      { slug: "oh-barbara_video", name: "Видео oh_barbara" },
      { slug: "oh-barbara_tags", name: "Теги oh_barbara" },
      { slug: "oh-barbara_connect", name: "Связь oh_barbara" },
      { slug: "oh-barbara_comments", name: "Комментарии oh_barbara" },
    ],
  };

  var ALIAS = {
    oh_barbara: "oh-barbara",
    ohbarbara: "oh-barbara",
    "о-барбара": "ох-барбара",
    ох_барбара: "ох-барбара",
    барбара: "ох-барбара",
    barbara: "oh-barbara",
    "ох барбара": "ох-барбара",
    ox_barbara: "oh-barbara",
    "ох_barbara": "ох-барбара",
    "ox-barbara": "oh-barbara",

    "oh-barbara-about": "oh-barbara_about",
    "oh-barbara-gallery": "oh-barbara_gallery",
    "oh-barbara-stream": "oh-barbara_stream",
    "oh-barbara-clips": "oh-barbara_clips",
    "oh-barbara-video": "oh-barbara_video",
    "oh-barbara-tags": "oh-barbara_tags",
    "oh-barbara-connect": "oh-barbara_connect",
    "oh-barbara-comments": "oh-barbara_comments",
    about: "oh-barbara_about",
    gallery: "oh-barbara_gallery",
    stream: "oh-barbara_stream",
    clips: "oh-barbara_clips",
    video: "oh-barbara_video",
    tags: "oh-barbara_tags",
    connect: "oh-barbara_connect",
    comments: "oh-barbara_comments",

    twitch: "twitch-oh-barbara",
    твич: "твич-ох-барбара",
    instagram: "instagram-oh-barbara",
    инстаграм: "инстаграм-ох-барбара",
    инста: "инстаграм-ох-барбара",
    telegram: "telegram-oh-barbara",
    телеграм: "телеграм-ох-барбара",
    телега: "телеграм-ох-барбара",
    boosty: "boosty-oh-barbara",
    бусти: "бусти-ох-барбара",
    донат: "донат-ох-барбара",
    донейшн: "донат-ох-барбара",
    "donation-alerts": "donationalerts-oh-barbara",
    donationalerts: "donationalerts-oh-barbara",
    youtube: "youtube-oh-barbara",
    ютуб: "ютуб-ох-барбара",
    kick: "kick-oh-barbara",
    кик: "кик-ох-барбара",
    trovo: "trovo-oh-barbara",
    трово: "трово-ох-барбара",

    "just-chatting": "just-chatting-oh-barbara",
    чаттинг: "джест-чатинг-ох-барбара",
    "джест-чатинг": "джест-чатинг-ох-барбара",
    irl: "irl-oh-barbara",
    ирл: "ирл-ох-барбара",
    lifestyle: "lifestyle-oh-barbara",
    лайфстайл: "лайфстайл-ох-барбара",
    fashion: "fashion-oh-barbara",
    фешен: "фешен-ох-барбара",
    мода: "фешен-ох-барбара",
    unboxing: "unboxing-oh-barbara",
    анпакинг: "анпакинг-ох-барбара",
    распаковка: "анпакинг-ох-барбара",
    model: "model-oh-barbara",
    модель: "модель-ох-барбара",
    streamer: "streamer-oh-barbara",
    стример: "стример-ох-барбара",
    стримы: "стример-ох-барбара",

    phuket: "phuket-oh-barbara",
    пхукет: "пхукет-ох-барбара",
    thailand: "thailand-oh-barbara",
    тайланд: "таиланд-ох-барбара",
    таиланд: "таиланд-ох-барбара",
    thai: "thailand-oh-barbara",
    "prathet-thai": "thailand-oh-barbara",
    krasnodar: "krasnodar-oh-barbara",
    краснодар: "краснодар-ох-барбара",
    russia: "russia-oh-barbara",
    россия: "россия-ох-барбара",
    рф: "россия-ох-барбара",
    kazakhstan: "kazakhstan-oh-barbara",
    казахстан: "казахстан-ох-барбара",
    qazaqstan: "kazakhstan-oh-barbara",
    belarus: "belarus-oh-barbara",
    беларусь: "беларусь-ох-барбара",
    белоруссия: "беларусь-ох-барбара",
    bielarus: "belarus-oh-barbara",
    "bielaruś": "belarus-oh-barbara",
    ukraine: "ukraine-oh-barbara",
    украина: "украина-ох-барбара",
    ukraina: "ukraine-oh-barbara",
    україна: "ukraine-oh-barbara",
    uzbekistan: "uzbekistan-oh-barbara",
    узбекистан: "узбекистан-ох-барбара",
    ozbekiston: "uzbekistan-oh-barbara",
    "oʻzbekiston": "uzbekistan-oh-barbara",
    armenia: "armenia-oh-barbara",
    армения: "армения-ох-барбара",
    hayastan: "armenia-oh-barbara",
    azerbaijan: "azerbaijan-oh-barbara",
    азербайджан: "азербайджан-ох-барбара",
    azerbaycan: "azerbaijan-oh-barbara",
    "azərbaycan": "azerbaijan-oh-barbara",
    georgia: "georgia-oh-barbara",
    грузия: "грузия-ох-барбара",
    sakartvelo: "georgia-oh-barbara",
    kyrgyzstan: "kyrgyzstan-oh-barbara",
    кыргызстан: "кыргызстан-ох-барбара",
    киргизия: "кыргызстан-ох-барбара",
    moldova: "moldova-oh-barbara",
    молдова: "молдова-ох-барбара",
    tajikistan: "tajikistan-oh-barbara",
    таджикистан: "таджикистан-ох-барбара",
    tojikiston: "tajikistan-oh-barbara",
    turkmenistan: "turkmenistan-oh-barbara",
    туркменистан: "туркменистан-ох-барбара",
    "türkmenistan": "turkmenistan-oh-barbara",
    germany: "germany-oh-barbara",
    германия: "германия-ох-барбара",
    deutschland: "germany-oh-barbara",
    france: "france-oh-barbara",
    франция: "франция-ох-барбара",
    italy: "italy-oh-barbara",
    италия: "италия-ох-барбара",
    italia: "italy-oh-barbara",
    spain: "spain-oh-barbara",
    испания: "испания-ох-барбара",
    espana: "spain-oh-barbara",
    "españa": "spain-oh-barbara",
    poland: "poland-oh-barbara",
    польша: "польша-ох-барбара",
    polska: "poland-oh-barbara",
    czech: "czech-oh-barbara",
    чехия: "чехия-ох-барбара",
    "czech-republic": "czech-oh-barbara",
    cesko: "czech-oh-barbara",
    "česko": "czech-oh-barbara",
    netherlands: "netherlands-oh-barbara",
    нидерланды: "нидерланды-ох-барбара",
    голландия: "нидерланды-ох-барбара",
    nederland: "netherlands-oh-barbara",
    holland: "netherlands-oh-barbara",
    belgium: "belgium-oh-barbara",
    бельгия: "бельгия-ох-барбара",
    belgie: "belgium-oh-barbara",
    "belgië": "belgium-oh-barbara",
    belgique: "belgium-oh-barbara",
    austria: "austria-oh-barbara",
    австрия: "австрия-ох-барбара",
    osterreich: "austria-oh-barbara",
    "österreich": "austria-oh-barbara",
    switzerland: "switzerland-oh-barbara",
    швейцария: "швейцария-ох-барбара",
    schweiz: "switzerland-oh-barbara",
    suisse: "switzerland-oh-barbara",
    svizzera: "switzerland-oh-barbara",
    uk: "uk-oh-barbara",
    великобритания: "великобритания-ох-барбара",
    англия: "uk-oh-barbara",
    england: "uk-oh-barbara",
    "united-kingdom": "uk-oh-barbara",
    britain: "uk-oh-barbara",
    portugal: "portugal-oh-barbara",
    португалия: "португалия-ох-барбара",
    greece: "greece-oh-barbara",
    греция: "греция-ох-барбара",
    ellada: "greece-oh-barbara",
    hellas: "greece-oh-barbara",
    "ελλάδα": "greece-oh-barbara",
    sweden: "sweden-oh-barbara",
    швеция: "швеция-ох-барбара",
    sverige: "sweden-oh-barbara",
    norway: "norway-oh-barbara",
    норвегия: "норвегия-ох-барбара",
    norge: "norway-oh-barbara",
    finland: "finland-oh-barbara",
    финляндия: "финляндия-ох-барбара",
    suomi: "finland-oh-barbara",
    denmark: "denmark-oh-barbara",
    дания: "дания-ох-барбара",
    danmark: "denmark-oh-barbara",
    romania: "romania-oh-barbara",
    румыния: "румыния-ох-барбара",
    "românia": "romania-oh-barbara",
    hungary: "hungary-oh-barbara",
    венгрия: "венгрия-ох-барбара",
    magyarorszag: "hungary-oh-barbara",
    "magyarország": "hungary-oh-barbara",
    bulgaria: "bulgaria-oh-barbara",
    болгария: "болгария-ох-барбара",
    българия: "bulgaria-oh-barbara",
    serbia: "serbia-oh-barbara",
    сербия: "сербия-ох-барбара",
    srbija: "serbia-oh-barbara",
    croatia: "croatia-oh-barbara",
    хорватия: "хорватия-ох-барбара",
    hrvatska: "croatia-oh-barbara",
    slovakia: "slovakia-oh-barbara",
    словакия: "словакия-ох-барбара",
    slovensko: "slovakia-oh-barbara",
    slovenia: "slovenia-oh-barbara",
    словения: "словения-ох-барбара",
    slovenija: "slovenia-oh-barbara",
    lithuania: "lithuania-oh-barbara",
    литва: "литва-ох-барбара",
    lietuva: "lithuania-oh-barbara",
    latvia: "latvia-oh-barbara",
    латвия: "латвия-ох-барбара",
    latvija: "latvia-oh-barbara",
    estonia: "estonia-oh-barbara",
    эстония: "эстония-ох-барбара",
    eesti: "estonia-oh-barbara",
    ireland: "ireland-oh-barbara",
    ирландия: "ирландия-ох-барбара",
    eire: "ireland-oh-barbara",
    "éire": "ireland-oh-barbara",
    usa: "usa-oh-barbara",
    сша: "сша-ох-барбара",
    америка: "сша-ох-барбара",
    "united-states": "usa-oh-barbara",
    "united states": "usa-oh-barbara",
  };

  var MAX = 4;
  var BY_SLUG = {};
  var CAT_SLUGS = {};
  Object.keys(BY_CAT).forEach(function (cat) {
    BY_CAT[cat].forEach(function (t) {
      BY_SLUG[t.slug] = t;
      CAT_SLUGS[t.slug] = true;
    });
  });

  function slugify(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[^a-z0-9а-я]+/gi, "-")
      .replace(/^-+|-+$/g, "");
  }

  function resolveId(raw) {
    var s = String(raw || "").trim();
    if (!s) return "";
    var low = s.toLowerCase();
    if (ALIAS[low]) return ALIAS[low];
    if (BY_SLUG[s]) return s;
    if (BY_SLUG[low]) return low;
    var sl = slugify(s);
    if (ALIAS[sl]) return ALIAS[sl];
    if (BY_SLUG[sl]) return sl;
    return sl;
  }

  function mergeUserTags(list) {
    (list || []).forEach(function (t) {
      if (!t) return;
      var slug = resolveId(t.slug || t.id || t.name) || slugify(t.name);
      var name = String(t.name || "").trim() || slug;
      if (!slug) return;
      if (!BY_SLUG[slug]) {
        BY_SLUG[slug] = { slug: slug, name: name, user: true };
      } else if (!CAT_SLUGS[slug] && name) {
        BY_SLUG[slug].name = name;
      }
    });
  }

  function loadUserTags() {
    return fetch("data/tags.json?t=" + Date.now())
      .then(function (r) {
        if (!r.ok) return [];
        return r.json();
      })
      .then(function (d) {
        var list = Array.isArray(d) ? d : [];
        mergeUserTags(list);
        return list;
      })
      .catch(function () {
        return [];
      });
  }

  function fromName(name) {
    var n = String(name || "").trim();
    if (!n) return null;
    var slug = resolveId(n) || slugify(n);
    if (!slug) return null;
    if (BY_SLUG[slug] && BY_SLUG[slug].name) {
      return { slug: slug, name: BY_SLUG[slug].name, kind: "name" };
    }
    return { slug: slug, name: n, kind: "name" };
  }

  function isCategorySlug(slug) {
    return !!CAT_SLUGS[resolveId(slug)];
  }

  function parseTagSlugs(raw) {
    if (Array.isArray(raw)) {
      return raw
        .map(function (x) {
          if (!x) return "";
          if (typeof x === "object") return String(x.slug || x.id || x.name || "").trim();
          return String(x).trim();
        })
        .filter(Boolean)
        .map(resolveId)
        .filter(Boolean);
    }
    return String(raw || "")
      .split(",")
      .map(function (x) {
        return x.trim();
      })
      .filter(Boolean)
      .map(resolveId)
      .filter(Boolean);
  }

  function tagName(slug) {
    var id = resolveId(slug);
    var t = BY_SLUG[id];
    return (t && t.name) || id || slug;
  }

  function tagHref(slug) {
    return "index.html?id=" + encodeURIComponent(resolveId(slug));
  }

  function tagsForCategory(catName) {
    return BY_CAT[catName] || [];
  }

  function allTags() {
    var out = [];
    var seen = {};
    Object.keys(BY_SLUG).forEach(function (slug) {
      if (seen[slug]) return;
      seen[slug] = true;
      out.push(BY_SLUG[slug]);
    });
    return out;
  }

  function tagLead(slug) {
    var id = resolveId(slug);
    var leads = {
      "twitch-oh-barbara": "Twitch streamer oh_barbara — Just Chatting & IRL from Phuket.",
      "твич-ох-барбара": "Стример Ох_Барбара на Twitch — Just Chatting и IRL с Пхукета.",
      "instagram-oh-barbara": "Instagram @oh_barbara_ — lifestyle & fashion.",
      "инстаграм-ох-барбара": "Инстаграм @oh_barbara_ — lifestyle и fashion.",
      "telegram-oh-barbara": "Telegram @oh_barbara — updates and contact.",
      "телеграм-ох-барбара": "Телеграм @oh_barbara — апдейты и связь.",
      "boosty-oh-barbara": "Boosty oh_barbara — support the streamer.",
      "бусти-ох-барбара": "Бусти Ох_Барбара — поддержка стримера.",
      "donationalerts-oh-barbara": "DonationAlerts oh_barbara — tips and donations.",
      "донат-ох-барбара": "Донаты Ох_Барбаре — DonationAlerts.",
      "youtube-oh-barbara": "YouTube oh_barbara — streamer & model.",
      "ютуб-ох-барбара": "Ютуб Ох_Барбара — стример и модель.",
      "kick-oh-barbara": "Kick oh_barbara — streamer profile.",
      "кик-ох-барбара": "Kick Ох_Барбара — профиль стримера.",
      "trovo-oh-barbara": "Trovo oh_barbara — streamer profile.",
      "трово-ох-барбара": "Trovo Ох_Барбара — профиль стримера.",
      "just-chatting-oh-barbara": "Just Chatting streams by oh_barbara on Twitch.",
      "джест-чатинг-ох-барбара": "Just Chatting стримы Ох_Барбары на Twitch.",
      "irl-oh-barbara": "IRL streams by oh_barbara from Phuket.",
      "ирл-ох-барбара": "IRL-стримы Ох_Барбары с Пхукета.",
      "lifestyle-oh-barbara": "Lifestyle content by oh_barbara.",
      "лайфстайл-ох-барбара": "Лайфстайл-контент Ох_Барбары.",
      "fashion-oh-barbara": "Fashion content by oh_barbara.",
      "фешен-ох-барбара": "Fashion-контент Ох_Барбары.",
      "unboxing-oh-barbara": "Unboxing streams by oh_barbara.",
      "анпакинг-ох-барбара": "Анпакинг на стримах Ох_Барбары.",
      "streamer-oh-barbara": "Streamer oh_barbara — Twitch Just Chatting & IRL.",
      "стример-oh-barbara": "Стример oh_barbara — Twitch Just Chatting & IRL.",
      "стример-ох-барбара": "Стример Ох_Барбара — Twitch Just Chatting и IRL.",
      "model-oh-barbara": "Model oh_barbara — lifestyle & fashion.",
      "модель-ох-барбара": "Модель Ох_Барбара — lifestyle и fashion.",
      "video-oh-barbara": "Видео oh_barbara.",
      "phuket-oh-barbara": "Phuket: streams and lifestyle from Thailand — oh_barbara.",
      "пхукет-ох-барбара": "Пхукет: стримы и lifestyle — Ох_Барбара.",
      "thailand-oh-barbara": "Content from Thailand — Phuket, oh_barbara.",
      "таиланд-ох-барбара": "Контент из Таиланда — Пхукет, Ох_Барбара.",
      "krasnodar-oh-barbara": "Krasnodar → Phuket: oh_barbara path.",
      "краснодар-ох-барбара": "Краснодар → Пхукет: путь Ох_Барбары.",
      "russia-oh-barbara": "Audience in Russia — oh_barbara.",
      "россия-ох-барбара": "Аудитория в России — Ох_Барбара.",
      "kazakhstan-oh-barbara": "Audience in Kazakhstan — oh_barbara.",
      "казахстан-ох-барбара": "Аудитория в Казахстане — Ох_Барбара.",
      "usa-oh-barbara": "Audience in the USA — oh_barbara.",
      "сша-ох-барбара": "Аудитория в США — Ох_Барбара.",
      "oh-barbara": "oh_barbara — streamer & model from Phuket.",
      "ох-барбара": "Ох_Барбара — стример и модель из Пхукета.",
      "oh-barbara_about": "О себе — oh_barbara / Ох_Барбара.",
      "oh-barbara_gallery": "Галерея — lifestyle & fashion oh_barbara.",
      "oh-barbara_stream": "Стрим Twitch — oh_barbara.",
      "oh-barbara_clips": "Клипы Twitch — oh_barbara.",
      "oh-barbara_video": "Видео — oh_barbara.",
      "oh-barbara_tags": "Теги страницы oh_barbara.",
      "oh-barbara_connect": "Связь и площадки oh_barbara.",
      "oh-barbara_comments": "Комментарии к отзыву oh-barbara на ot-ziv.",
    };
    if (leads[id]) return leads[id];
    var name = tagName(id);
    if (CAT_SLUGS[id] && BY_CAT["Локация"] && BY_CAT["Локация"].some(function (t) { return t.slug === id; })) {
      return name + " — аудитория и контент oh_barbara / Ох_Барбара.";
    }
    return name + " — oh_barbara / Ох_Барбара, стример и модель.";
  }

  function tagLinkHtml(t) {
    return (
      '<a href="' +
      tagHref(t.slug) +
      '" data-tag-slug="' +
      t.slug +
      '">#' +
      (t.name || t.slug) +
      "</a>"
    );
  }

  w.OB_TAGS = {
    MAX: MAX,
    byCat: BY_CAT,
    bySlug: BY_SLUG,
    alias: ALIAS,
    slugify: slugify,
    resolve: resolveId,
    parse: parseTagSlugs,
    name: tagName,
    href: tagHref,
    lead: tagLead,
    forCategory: tagsForCategory,
    fromName: fromName,
    isCategory: isCategorySlug,
    loadUserTags: loadUserTags,
    mergeUserTags: mergeUserTags,
    all: allTags,
    linkHtml: tagLinkHtml,
  };
})(window);