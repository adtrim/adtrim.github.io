// What's new: the app opens this page as whats-new/#from=<installed>&to=<new>.
// The fragment never reaches the server. With no fragment (or no JavaScript) every
// highlighted release is listed. A fragment that can't be read says so and lists everything.
(function () {
  // The deployment fills in the latest version as v<version>.
  var LATEST = document.body.getAttribute('data-latest').replace(/^v/, '');
  var VERSION = /^\d{1,4}\.\d{1,4}\.\d{1,4}$/;

  function compare(a, b) {
    var x = a.split('.').map(Number), y = b.split('.').map(Number);
    for (var i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
    return 0;
  }
  // Plain page anchors (#releases, #main) carry no versions; only from=/to= pairs do.
  function isVersionLink() { return location.hash.indexOf('=') >= 0; }
  function read() {
    var raw = location.hash.replace(/^#/, ''), out = { bad: false };
    if (!raw || !isVersionLink()) return out;
    raw.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      if ((kv[0] === 'from' || kv[0] === 'to') && kv.length === 2) {
        if (VERSION.test(kv[1])) out[kv[0]] = kv[1]; else out.bad = true;
      }
    });
    if (!out.from && !out.to) out.bad = true;
    return out;
  }
  function set(id, value) { document.getElementById(id).textContent = value; }

  function render() {
    var p = read(), to = p.to || LATEST, from = p.bad ? null : p.from;
    var shown = 0;
    document.querySelectorAll('[data-version]').forEach(function (entry) {
      var v = entry.getAttribute('data-version');
      entry.hidden = !(compare(v, to) <= 0 && (!from || compare(v, from) > 0));
      if (!entry.hidden) shown++;
    });

    document.getElementById('as-download').href =
      'https://github.com/adtrim/adtrim/releases/download/v' + to + '/AdTrim-Setup-v' + to + '.exe';
    set('as-download', 'Download AdTrim v' + to + ' for Windows');
    document.getElementById('as-notes').href = 'https://github.com/adtrim/adtrim/releases/tag/v' + to;

    var fromLine = document.getElementById('as-from');
    fromLine.hidden = !from;
    if (from) fromLine.innerHTML = 'You have <b>' + from + '</b>. This page covers ' + from + ' to ' + to + '.';

    var maintenance = document.getElementById('as-maintenance');
    maintenance.hidden = shown > 0;
    maintenance.querySelector('.as-version').textContent = to + ' · Fixes and security updates';

    var here = document.getElementById('as-here');
    here.hidden = !from;
    if (from) here.querySelector('.as-version').textContent = from + ' · the version you have now';

    if (from) {
      set('as-title', shown ? "Here's what's new since " + from + '.' : 'AdTrim ' + to + ' is ready.');
      set('as-lede', shown ? 'Everything that changed in the versions after yours, newest first.'
        : 'This update fixes problems and keeps AdTrim secure. Nothing changes in how you use it.');
    } else {
      set('as-title', "What's new in AdTrim");
      set('as-lede', 'Highlights from each release, newest first. Small fixes are listed in the release notes on GitHub.');
    }
    document.getElementById('as-error').hidden = !p.bad;

  }

  // A jump to a page anchor keeps what the version link already set up.
  window.addEventListener('hashchange', function () {
    if (location.hash && location.hash !== '#' && !isVersionLink()) return;
    render(); window.scrollTo(0, 0);
  });
  render();
})();
