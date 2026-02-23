import PhotoSwipeLightbox from "https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.min.js";

const APPLE_CLOSE_SVG = `
<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 24 24" width="24" height="24">
  <path d="M6 6L18 18M18 6L6 18"/>
</svg>`;

const APPLE_ZOOM_SVG = `
<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="11" cy="11" r="6"></circle>
  <path class="pswp__zoom-icn-bar-h" d="M8 11H14"></path>
  <path class="pswp__zoom-icn-bar-v" d="M11 8V14"></path>
  <path d="M16 16L20 20"></path>
</svg>`;

const APPLE_ARROW_PREV_SVG = `
<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 24 24" width="24" height="24">
  <path d="M15 6L9 12L15 18"></path>
</svg>`;

const APPLE_ARROW_NEXT_SVG = `
<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 24 24" width="24" height="24">
  <path d="M9 6L15 12L9 18"></path>
</svg>`;

const APPLE_OPEN_ORIGINAL_SVG = `
<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 24 24" width="24" height="24">
  <path d="M14 4H20V10"></path>
  <path d="M20 4L10 14"></path>
  <path d="M20 14V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6C4 4.9 4.9 4 6 4H10"></path>
</svg>`;

function isSkippableImage(img) {
  return Boolean(img.closest("pre, code, .highlighter-rouge"));
}

function getImageSize(img) {
  const attrWidth = Number.parseInt(img.getAttribute("width") || "", 10);
  const attrHeight = Number.parseInt(img.getAttribute("height") || "", 10);

  if (Number.isFinite(attrWidth) && attrWidth > 0 && Number.isFinite(attrHeight) && attrHeight > 0) {
    return { width: attrWidth, height: attrHeight };
  }

  if (img.naturalWidth > 0 && img.naturalHeight > 0) {
    return { width: img.naturalWidth, height: img.naturalHeight };
  }

  return { width: 1600, height: 1200 };
}

function ensureAnchor(img) {
  const existing = img.closest("a.post-image-link");
  if (existing) {
    return existing;
  }

  const anchor = document.createElement("a");
  anchor.className = "post-image-link";
  anchor.href = img.currentSrc || img.src;

  img.parentNode.insertBefore(anchor, img);
  anchor.appendChild(img);

  return anchor;
}

function ensureAnchorMetadata(anchor) {
  const img = anchor.querySelector("img");
  if (!img) {
    return;
  }

  const imageSrc = img.currentSrc || img.getAttribute("src") || "";
  const imageSrcset = img.getAttribute("srcset") || "";
  const imageSizes = img.getAttribute("sizes") || "100vw";
  const existingHref = anchor.getAttribute("href") || "";
  const existingOriginal = anchor.getAttribute("data-original-src") || "";
  const imgOriginal = img.dataset.originalSrc || "";
  const originalSrc = existingOriginal || imgOriginal || existingHref || imageSrc;

  if (!existingOriginal && originalSrc) {
    anchor.setAttribute("data-original-src", originalSrc);
  }

  if (!existingHref || (existingHref === originalSrc && imageSrc && imageSrc !== originalSrc)) {
    anchor.setAttribute("href", imageSrc || originalSrc);
  }

  if (!anchor.getAttribute("data-pswp-src")) {
    anchor.setAttribute("data-pswp-src", anchor.getAttribute("href") || imageSrc || originalSrc);
  }

  if (!anchor.getAttribute("data-pswp-srcset") && imageSrcset) {
    anchor.setAttribute("data-pswp-srcset", imageSrcset);
  }

  if (!anchor.getAttribute("data-pswp-sizes")) {
    anchor.setAttribute("data-pswp-sizes", imageSizes);
  }

  const size = getImageSize(img);
  anchor.setAttribute("data-pswp-width", String(size.width));
  anchor.setAttribute("data-pswp-height", String(size.height));
}

function getCurrentOriginalUrl(pswp) {
  const slide = pswp?.currSlide;
  if (!slide?.data) {
    return "";
  }

  const element = slide.data.element;
  return (
    element?.getAttribute("data-original-src") ||
    element?.dataset?.originalSrc ||
    slide.data.originalSrc ||
    slide.data.src ||
    ""
  );
}

function bootstrapGallery() {
  const images = Array.from(document.querySelectorAll(".content img"));
  const anchors = [];

  for (const img of images) {
    if (isSkippableImage(img)) {
      continue;
    }

    const anchor = ensureAnchor(img);
    ensureAnchorMetadata(anchor);
    anchors.push(anchor);

    if (!img.complete) {
      img.addEventListener(
        "load",
        () => {
          ensureAnchorMetadata(anchor);
        },
        { once: true }
      );
    }
  }

  return anchors;
}

const galleryItems = bootstrapGallery();
if (galleryItems.length > 0) {
  const lightbox = new PhotoSwipeLightbox({
    gallery: ".content",
    children: "a.post-image-link",
    preload: [0, 1],
    closeSVG: APPLE_CLOSE_SVG,
    zoomSVG: APPLE_ZOOM_SVG,
    arrowPrevSVG: APPLE_ARROW_PREV_SVG,
    arrowNextSVG: APPLE_ARROW_NEXT_SVG,
    pswpModule: () => import("https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.min.js"),
  });

  lightbox.on("uiRegister", () => {
    lightbox.pswp.ui.registerElement({
      name: "open-original",
      order: 15,
      isButton: true,
      title: "View original image",
      ariaLabel: "View original image in new tab",
      html: APPLE_OPEN_ORIGINAL_SVG,
      onClick: (_event, _el, pswp) => {
        const originalUrl = getCurrentOriginalUrl(pswp);
        if (originalUrl) {
          window.open(originalUrl, "_blank", "noopener,noreferrer");
        }
      },
    });
  });

  lightbox.init();
}
