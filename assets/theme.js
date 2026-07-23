/* Pre-paint theme script: OS preference on first visit, an explicit choice
   (persisted in localStorage) wins after that. Runs synchronously in <head>,
   before the stylesheet paints, so there's no flash. Any element with a
   [data-theme-toggle] attribute flips the theme when clicked. */
(function () {
  var stored = null;
  try {
    stored = localStorage.getItem('workshop-theme');
  } catch (e) {}
  var theme =
    stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
})();

document.addEventListener('click', function (e) {
  var btn = e.target.closest('[data-theme-toggle]');
  if (!btn) return;
  var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('workshop-theme', next);
  } catch (err) {}
});
