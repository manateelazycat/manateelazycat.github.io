(function initInlineSearch() {
  const overlay = document.querySelector("[data-search-overlay]");
  const triggers = Array.from(document.querySelectorAll("[data-search-trigger]"));
  if (!overlay || !triggers.length) {
    return;
  }

  const overlayInner = overlay.querySelector(".search-overlay-inner");
  const form = overlay.querySelector(".search-inline-form");
  const input = overlay.querySelector("#search-input");
  const results = overlay.querySelector("#search-results");
  const status = overlay.querySelector("#search-status");
  const backButton = overlay.querySelector("#search-back-button");
  const searchIndexUrl = overlay.dataset.searchIndexUrl;
  const tagsUrl = overlay.dataset.tagsUrl || "/tags.html";
  const sourceBars = Array.from(document.querySelectorAll("body > .navigatebar, body > .content > .topbar"));

  let posts = [];
  let indexPromise = null;
  let isOpen = false;
  let lastTrigger = null;

  const debouncedSearch = debounce(() => {
    runSearch(input.value);
  }, 100);

  for (const trigger of triggers) {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openSearch(trigger);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(input.value);
  });

  input.addEventListener("input", () => {
    debouncedSearch();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeSearch();
    }
  });

  backButton.addEventListener("click", () => {
    closeSearch();
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeSearch();
    }
  });

  window.addEventListener("resize", () => {
    if (isOpen) {
      syncOverlayAlignment();
    }
  });

  window.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;

    if (event.key === "/" && !isTextInput(activeElement)) {
      event.preventDefault();
      openSearch(null);
      return;
    }

    if (!isOpen) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    }
  });

  function openSearch(trigger) {
    if (trigger) {
      lastTrigger = trigger;
    }

    if (!isOpen) {
      isOpen = true;
      overlay.hidden = false;
      document.documentElement.classList.add("search-open");
      document.body.classList.add("search-open");
      setSourceBarsHidden(true);
    }

    syncOverlayAlignment();
    showIdleState();

    window.requestAnimationFrame(() => {
      syncOverlayAlignment();
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });

    if (posts.length) {
      if (input.value.trim()) {
        runSearch(input.value);
      }
      return;
    }

    ensureIndexLoaded({ showLoading: false });
  }

  function closeSearch() {
    if (!isOpen) {
      return;
    }

    isOpen = false;
    overlay.hidden = true;
    document.documentElement.classList.remove("search-open");
    document.body.classList.remove("search-open");
    setSourceBarsHidden(false);
    input.value = "";
    showIdleState();

    if (lastTrigger) {
      lastTrigger.focus();
    }
  }

  function ensureIndexLoaded({ showLoading = false } = {}) {
    if (showLoading) {
      setResultsMode(true);
      status.textContent = "正在加载搜索索引...";
      results.innerHTML = "";
    }

    if (!indexPromise) {
      indexPromise = loadSearchIndex(searchIndexUrl)
        .then((loadedPosts) => {
          posts = loadedPosts;

          if (!isOpen) {
            return posts;
          }

          if (input.value.trim()) {
            runSearch(input.value);
          } else {
            showIdleState();
          }

          return posts;
        })
        .catch(() => {
          indexPromise = null;

          if (isOpen && input.value.trim()) {
            renderErrorState();
          }

          return null;
        });
    }

    return indexPromise;
  }

  function runSearch(rawQuery) {
    const query = String(rawQuery || "").trim();

    if (!query) {
      showIdleState();
      return;
    }

    if (!posts.length) {
      ensureIndexLoaded({ showLoading: true });
      return;
    }

    setResultsMode(true);

    const matches = searchPosts(posts, query);
    const visibleMatches = matches.slice(0, 60);
    const totalText = matches.length.toLocaleString("en-US");
    const visibleText = visibleMatches.length.toLocaleString("en-US");

    if (!matches.length) {
      status.textContent = `没有找到和 “${query}” 相关的文章。`;
      results.innerHTML = "";
      return;
    }

    status.textContent = matches.length > visibleMatches.length
      ? `找到 ${totalText} 篇相关文章， 当前显示前 ${visibleText} 篇。`
      : `找到 ${totalText} 篇相关文章。`;

    results.innerHTML = visibleMatches.map((entry) => renderResult(entry, tagsUrl, query)).join("");
  }

  function showIdleState() {
    setResultsMode(false);
    status.textContent = "";
    results.innerHTML = "";
  }

  function renderErrorState() {
    setResultsMode(true);
    status.textContent = "搜索索引加载失败， 请稍后刷新重试。";
    results.innerHTML = renderEmpty("搜索暂时不可用， 刷新页面后再试试。");
  }

  function setResultsMode(visible) {
    overlay.classList.toggle("search-overlay--results", visible);
  }

  function syncOverlayAlignment() {
    if (!overlayInner) {
      return;
    }

    const bounds = getContentBounds();
    overlayInner.style.setProperty("--search-content-left", `${bounds.left}px`);
    overlayInner.style.setProperty("--search-content-right", `${bounds.right}px`);
  }

  function getContentBounds() {
    const reference = findReferenceElement();
    if (!reference) {
      return {
        left: 20,
        right: 20
      };
    }

    const rect = reference.getBoundingClientRect();
    return {
      left: Math.max(0, Math.round(rect.left)),
      right: Math.max(0, Math.round(window.innerWidth - rect.right))
    };
  }

  function findReferenceElement() {
    const selectors = [
      "body > .content .post-line",
      "body > .post-layout .content-area",
      "body > .content > :not(.topbar):not(.slogan)",
      "body > .content",
      "body > .navigatebar"
    ];

    for (const selector of selectors) {
      const elements = Array.from(document.querySelectorAll(selector));
      const match = elements.find(isVisibleElement);
      if (match) {
        return match;
      }
    }

    return null;
  }

  function isVisibleElement(element) {
    if (!element || overlay.contains(element)) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function setSourceBarsHidden(hidden) {
    for (const bar of sourceBars) {
      if (hidden) {
        bar.dataset.searchPrevVisibility = bar.style.visibility || "";
        bar.dataset.searchPrevOpacity = bar.style.opacity || "";
        bar.dataset.searchPrevPointerEvents = bar.style.pointerEvents || "";
        bar.style.visibility = "hidden";
        bar.style.opacity = "0";
        bar.style.pointerEvents = "none";
        bar.classList.add("search-source-bar-hidden");
      } else {
        bar.style.visibility = bar.dataset.searchPrevVisibility || "";
        bar.style.opacity = bar.dataset.searchPrevOpacity || "";
        bar.style.pointerEvents = bar.dataset.searchPrevPointerEvents || "";
        delete bar.dataset.searchPrevVisibility;
        delete bar.dataset.searchPrevOpacity;
        delete bar.dataset.searchPrevPointerEvents;
        bar.classList.remove("search-source-bar-hidden");
      }
    }
  }
})();

function loadSearchIndex(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load search index: ${response.status}`);
      }

      return response.json();
    })
    .then((posts) => posts.map(preparePost));
}

function preparePost(post) {
  const title = cleanText(post.title);
  const categories = Array.isArray(post.categories)
    ? post.categories.map((category) => cleanText(category)).filter(Boolean)
    : [];
  const excerpt = cleanText(post.excerpt);
  const content = cleanText(post.content);
  const normalizedTitle = normalizeText(title);
  const normalizedCategories = categories.map((category) => normalizeText(category));
  const normalizedContent = normalizeText(content);
  const searchableText = normalizeText([title, categories.join(" "), content].join(" "));
  const timestamp = Number.parseInt(String(post.date || "").replace(/-/g, ""), 10) || 0;

  return {
    ...post,
    title,
    categories,
    excerpt: excerpt || content.slice(0, 120),
    content,
    normalizedTitle,
    normalizedCategories,
    normalizedContent,
    searchableText,
    timestamp
  };
}

function searchPosts(posts, rawQuery) {
  const query = normalizeText(rawQuery);
  const terms = splitQueryTerms(query);

  return posts
    .map((post) => scorePost(post, query, terms))
    .filter(Boolean)
    .sort((left, right) => right.post.timestamp - left.post.timestamp || right.score - left.score);
}

function scorePost(post, query, terms) {
  if (!query || !terms.length) {
    return null;
  }

  if (!terms.every((term) => post.searchableText.includes(term))) {
    return null;
  }

  let score = 0;

  if (post.normalizedTitle.includes(query)) {
    score += 1200;
  }

  score += terms.reduce((total, term) => total + (post.normalizedTitle.includes(term) ? 240 : 0), 0);
  score += terms.reduce((total, term) => total + categoryScore(post.normalizedCategories, term), 0);
  score += contentScore(post.normalizedContent, query, terms);
  score += Math.max(0, 80 - post.title.length);

  return {
    post,
    score
  };
}

function categoryScore(categories, term) {
  return categories.reduce((total, category) => total + (category.includes(term) ? 120 : 0), 0);
}

function contentScore(content, query, terms) {
  const fullQueryIndex = content.indexOf(query);
  if (fullQueryIndex >= 0) {
    return 320 - Math.min(fullQueryIndex, 240);
  }

  return terms.reduce((total, term) => {
    const index = content.indexOf(term);
    return total + (index >= 0 ? Math.max(40, 120 - Math.min(index, 80)) : 0);
  }, 0);
}

function splitQueryTerms(query) {
  const terms = query.split(/\s+/).filter(Boolean);
  return terms.length ? terms : [query];
}

function renderResult(entry, tagsUrl, query) {
  const { post } = entry;
  const highlightTerms = buildHighlightTerms(query);
  const categoriesHtml = post.categories
    .map((category) => renderCategory(tagsUrl, category, highlightTerms))
    .join("");
  const summaryTerms = uniqueTerms([normalizeText(query)].concat(splitQueryTerms(normalizeText(query))));
  const summary = buildSnippet(post, summaryTerms);

  return `
    <li class="post-line">
      <a class="post-title" href="${escapeAttribute(post.url)}">${highlightText(post.title, highlightTerms)}</a>
      <a href="${escapeAttribute(post.url)}">
        <div class="post-summary">${highlightText(summary, highlightTerms)}</div>
      </a>
      <div class="post-info">
        <div class="category-area">
          ${categoriesHtml}
        </div>
        <div class="right-info-area">
          <div class="char-counter">${formatNumber(post.char_count)}字</div>
          <div class="post-date">${escapeHtml(post.date || "")}</div>
        </div>
      </div>
    </li>
  `;
}

function renderCategory(tagsUrl, category, highlightTerms) {
  return `
    <a href="${escapeAttribute(tagsUrl)}#${encodeURIComponent(category)}">
      <div class="category">${highlightText(category, highlightTerms)}</div>
    </a>
  `;
}

function buildSnippet(post, terms) {
  const content = post.content || post.excerpt || "";
  const normalizedContent = normalizeText(content);
  const sortedTerms = uniqueTerms(terms).sort((left, right) => right.length - left.length);

  for (const term of sortedTerms) {
    const index = normalizedContent.indexOf(term);
    if (index < 0) {
      continue;
    }

    const start = Math.max(0, index - 28);
    const end = Math.min(content.length, index + Math.max(term.length, 52));
    const prefix = start > 0 ? "..." : "";
    const suffix = end < content.length ? "..." : "";
    return `${prefix}${content.slice(start, end).trim()}${suffix}`;
  }

  const fallback = post.excerpt || content.slice(0, 80);
  return fallback.length > 82 ? `${fallback.slice(0, 80)} ...` : fallback;
}

function renderEmpty(message) {
  return `<li class="search-empty">${escapeHtml(message)}</li>`;
}

function buildHighlightTerms(query) {
  return uniqueTerms([cleanText(query)].concat(splitQueryTerms(cleanText(query))));
}

function highlightText(text, terms) {
  const source = String(text || "");
  const normalizedTerms = uniqueTerms(terms).sort((left, right) => right.length - left.length);
  if (!normalizedTerms.length) {
    return escapeHtml(source);
  }

  const pattern = new RegExp(`(${normalizedTerms.map(escapeRegExp).join("|")})`, "gi");
  return escapeHtml(source).replace(pattern, "<mark>$1</mark>");
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeText(value) {
  return cleanText(value).toLocaleLowerCase();
}

function uniqueTerms(terms) {
  return Array.from(new Set(terms.map((term) => cleanText(term)).filter(Boolean)));
}

function formatNumber(value) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) {
    return value;
  }

  return number.toLocaleString("en-US");
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(text) {
  return escapeHtml(text);
}

function escapeRegExp(text) {
  return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function debounce(callback, delay) {
  let timerId = 0;

  return (...args) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function isTextInput(element) {
  return Boolean(element && ["INPUT", "TEXTAREA"].includes(element.tagName));
}
