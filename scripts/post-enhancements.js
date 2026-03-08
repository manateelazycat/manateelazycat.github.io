(function initPostEnhancements() {
  const content = document.querySelector(".content");
  if (!content) {
    return;
  }

  initNavigatebarAlignment(content);
  initTableOfContents(content);
  initCodeCopyButtons(content);
})();

function initNavigatebarAlignment(content) {
  const syncLayout = () => {
    alignNavigatebarWithContent(content);
  };

  syncLayout();
  window.addEventListener("resize", syncLayout);
  window.addEventListener("load", syncLayout);
}

function initTableOfContents(content) {
  const headings = Array.from(content.querySelectorAll("h2, h3, h4"))
    .map((heading, index) => ensureHeadingId(heading, index))
    .filter(Boolean);

  if (headings.length <= 1) {
    return;
  }

  const postLayout = document.querySelector(".post-layout");
  if (postLayout) {
    postLayout.classList.add("has-toc");
  }

  const tocSidebar = document.querySelector(".toc-sidebar");
  const tocDesktopPanel = document.querySelector(".toc-desktop-panel");
  const tocMobile = document.querySelector(".toc-mobile");
  const tocMobilePanel = document.querySelector(".toc-mobile-panel");
  const tocToggle = document.querySelector(".toc-toggle");
  const tocMobileDrawer = document.querySelector(".toc-mobile-drawer");
  const tocMobileOverlay = document.querySelector(".toc-mobile-overlay");
  const tocClose = document.querySelector(".toc-close");

  if (!tocSidebar || !tocDesktopPanel || !tocMobile || !tocMobilePanel || !tocToggle || !tocMobileDrawer || !tocMobileOverlay || !tocClose) {
    return;
  }

  const tocList = buildTocList(headings);
  tocDesktopPanel.appendChild(tocList);
  tocMobilePanel.appendChild(buildTocList(headings));

  tocSidebar.hidden = false;
  tocMobile.hidden = false;

  const setMobileTocOpen = (isOpen) => {
    tocToggle.setAttribute("aria-expanded", String(isOpen));
    tocMobile.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("toc-mobile-open", isOpen);
    document.documentElement.classList.toggle("toc-mobile-open", isOpen);
  };

  tocToggle.addEventListener("click", () => {
    const isExpanded = tocToggle.getAttribute("aria-expanded") === "true";
    setMobileTocOpen(!isExpanded);
  });

  tocClose.addEventListener("click", () => {
    setMobileTocOpen(false);
  });

  tocMobileOverlay.addEventListener("click", () => {
    setMobileTocOpen(false);
  });

  const mobileLinks = Array.from(tocMobilePanel.querySelectorAll("a"));
  for (const link of mobileLinks) {
    link.addEventListener("click", () => {
      setMobileTocOpen(false);
    });
  }

  bindTocLinkScroll(tocMobilePanel.querySelectorAll("a"));
  bindTocLinkScroll(tocDesktopPanel.querySelectorAll("a"));

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileTocOpen(false);
    }
  });

  const tocLinks = Array.from(document.querySelectorAll(".toc-item a"));

  const syncLayout = () => {
    alignTocWithContent(content, tocSidebar);
    syncActiveHeading(headings, tocLinks);
  };

  syncLayout();

  let ticking = false;
  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      syncActiveHeading(headings, tocLinks);
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", syncLayout);
  window.addEventListener("load", syncLayout);
}

function alignNavigatebarWithContent(content) {
  const navigatebar = document.querySelector(".navigatebar");
  const navigatebarMine = document.querySelector(".navigatebar-mine");
  const contentArea = document.querySelector(".content-area");
  const postLayout = document.querySelector(".post-layout");

  if (!navigatebar || !navigatebarMine || !contentArea || !postLayout) {
    return;
  }

  if (window.innerWidth <= 600) {
    navigatebar.style.width = "";
    navigatebar.style.paddingLeft = "";
    return;
  }

  const targetWidth = postLayout.classList.contains("has-toc")
    ? Math.round(postLayout.getBoundingClientRect().width)
    : Math.round(contentArea.getBoundingClientRect().width);

  navigatebar.style.width = `${targetWidth}px`;
  navigatebar.style.boxSizing = "border-box";

  const desiredLeft = Math.round(content.getBoundingClientRect().left);
  const currentLeft = Math.round(navigatebarMine.getBoundingClientRect().left);
  const currentPaddingLeft = Number.parseFloat(window.getComputedStyle(navigatebar).paddingLeft) || 0;
  const nextPaddingLeft = Math.max(0, Math.round(currentPaddingLeft + desiredLeft - currentLeft));

  navigatebar.style.paddingLeft = `${nextPaddingLeft}px`;
}

function alignTocWithContent(content, tocSidebar) {
  if (window.innerWidth <= 1200 || tocSidebar.hidden) {
    tocSidebar.style.marginTop = "";
    return;
  }

  const contentArea = document.querySelector(".content-area");
  if (!contentArea) {
    return;
  }

  const offset = Math.max(
    0,
    Math.round(content.getBoundingClientRect().top - contentArea.getBoundingClientRect().top) + 20
  );

  tocSidebar.style.marginTop = `${offset}px`;
}

function ensureHeadingId(heading, index) {
  const text = heading.textContent ? heading.textContent.trim() : "";
  if (!text) {
    return null;
  }

  if (!heading.id) {
    heading.id = createHeadingId(text, index);
  }

  return heading;
}

function createHeadingId(text, index) {
  const usedIds = new Set(
    Array.from(document.querySelectorAll("[id]"))
      .map((node) => node.id)
      .filter(Boolean)
  );

  const normalized = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\u4E00-\u9FFF\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const baseId = normalized || `section-${index + 1}`;
  let uniqueId = baseId;
  let suffix = 2;

  while (usedIds.has(uniqueId)) {
    uniqueId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return uniqueId;
}

function buildTocList(headings) {
  const list = document.createElement("ul");
  list.className = "toc-list";

  for (const heading of headings) {
    const item = document.createElement("li");
    item.className = `toc-item toc-level-${heading.tagName.slice(1)}`;

    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.dataset.targetId = heading.id;
    link.textContent = heading.textContent.trim();

    item.appendChild(link);
    list.appendChild(item);
  }

  return list;
}

function bindTocLinkScroll(links) {
  for (const link of links) {
    link.addEventListener("click", (event) => {
      const targetId = link.dataset.targetId;
      if (!targetId) {
        return;
      }

      const target = document.getElementById(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      smoothScrollToHeading(target, 240);

      if (window.location.hash === `#${targetId}`) {
        history.replaceState(null, "", `#${targetId}`);
      } else {
        history.pushState(null, "", `#${targetId}`);
      }
    });
  }
}

function smoothScrollToHeading(target, duration) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startY = window.scrollY;
  const scrollMarginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
  const targetY = Math.max(0, Math.round(startY + target.getBoundingClientRect().top - scrollMarginTop));

  if (prefersReducedMotion || duration <= 0 || Math.abs(targetY - startY) < 2) {
    jumpToPosition(targetY);
    return;
  }

  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    const nextY = Math.round(startY + ((targetY - startY) * eased));

    jumpToPosition(nextY);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

function jumpToPosition(top) {
  const html = document.documentElement;
  const body = document.body;
  const previousHtmlBehavior = html.style.scrollBehavior;
  const previousBodyBehavior = body.style.scrollBehavior;

  html.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  html.style.scrollBehavior = previousHtmlBehavior;
  body.style.scrollBehavior = previousBodyBehavior;
}

function easeInOutCubic(progress) {
  if (progress < 0.5) {
    return 4 * progress * progress * progress;
  }

  return 1 - (Math.pow(-2 * progress + 2, 3) / 2);
}

function syncActiveHeading(headings, tocLinks) {
  const offset = window.innerWidth <= 600 ? 96 : 120;
  let activeHeading = headings[0];

  for (const heading of headings) {
    if (heading.getBoundingClientRect().top - offset <= 0) {
      activeHeading = heading;
      continue;
    }

    break;
  }

  for (const link of tocLinks) {
    link.classList.toggle("is-active", link.dataset.targetId === activeHeading.id);
  }
}

function initCodeCopyButtons(content) {
  const codeBlocks = Array.from(content.querySelectorAll("pre code"));

  for (const code of codeBlocks) {
    const pre = code.closest("pre");
    if (!pre) {
      continue;
    }

    const container = pre.closest("figure.highlight, div.highlight, div.highlighter-rouge") || pre;
    if (container.dataset.copyReady === "true") {
      continue;
    }

    container.dataset.copyReady = "true";
    container.classList.add("code-block-container", "has-copy-button");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.textContent = "复制";

    button.addEventListener("click", async () => {
      const codeText = code.textContent || "";
      const copied = await copyText(codeText);
      button.textContent = copied ? "已复制" : "复制失败";
      button.classList.toggle("is-success", copied);
      button.classList.toggle("is-failed", !copied);

      window.setTimeout(() => {
        button.textContent = "复制";
        button.classList.remove("is-success", "is-failed");
      }, 1800);
    });

    container.appendChild(button);
  }
}

async function copyText(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_error) {
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "readonly");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch (_error) {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}
