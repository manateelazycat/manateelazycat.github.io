(function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', function onLoad() {
    navigator.serviceWorker.register('/sw.js').catch(function () {
      // Keep silent in production when registration fails.
    });
  });
})();
