if (!self.define) {
  let e,
    t = {};
  const i = (i, o) => (
    (i = new URL(i + '.js', o).href),
    t[i] ||
      new Promise((t) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = i), (e.onload = t), document.head.appendChild(e);
        } else (e = i), importScripts(i), t();
      }).then(() => {
        let e = t[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (o, r) => {
    const n =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (t[n]) return;
    let s = {};
    const l = (e) => i(e, n),
      d = { module: { uri: n }, exports: s, require: l };
    t[n] = Promise.all(o.map((e) => d[e] || l(e))).then((e) => (r(...e), s));
  };
}
define(['./workbox-21d7d4fd'], function (e) {
  'use strict';
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: 'registerSW.js', revision: '3ca0b8505b4bec776b69afdba2768812' },
        { url: 'index.html', revision: '0.j27tee065ao' },
      ],
      {},
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL('index.html'), {
        allowlist: [/^\/$/],
      }),
    );
});
