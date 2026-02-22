import PhotoSwipeLightbox from "https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.min.js";

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
  anchor.href = img.dataset.originalSrc || img.currentSrc || img.src;

  img.parentNode.insertBefore(anchor, img);
  anchor.appendChild(img);

  return anchor;
}

function ensureAnchorMetadata(anchor) {
  const img = anchor.querySelector("img");
  if (!img) {
    return;
  }

  if (!anchor.getAttribute("href")) {
    anchor.setAttribute("href", img.dataset.originalSrc || img.currentSrc || img.src);
  }

  const size = getImageSize(img);
  anchor.setAttribute("data-pswp-width", String(size.width));
  anchor.setAttribute("data-pswp-height", String(size.height));
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
    pswpModule: () => import("https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.min.js"),
  });
  lightbox.init();
}
