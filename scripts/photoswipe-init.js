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
    pswpModule: () => import("https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.min.js"),
  });

  lightbox.on("uiRegister", () => {
    lightbox.pswp.ui.registerElement({
      name: "open-original",
      order: 9,
      isButton: true,
      title: "Open original image",
      ariaLabel: "Open original image in new tab",
      html: {
        isCustomSVG: true,
        size: 32,
        inner:
          '<path d="M8 24h24v-4H12V0H8v24zm16-16h-4v4h7.17L16.59 22.59 19.41 25.41 30 14.83V22h4V8H24z"/>',
        outlineID: "pswp__icn-open-original",
      },
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
