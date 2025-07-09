import v from "node:fs";
import g from "node:path";
import { execSync as b } from "child_process";
function F(f, c, { signal: e, edges: o } = {}) {
  let s, n = null;
  const $ = o != null && o.includes("leading"), r = o == null || o.includes("trailing"), t = () => {
    n !== null && (f.apply(s, n), s = void 0, n = null);
  }, y = () => {
    r && t(), a();
  };
  let i = null;
  const m = () => {
    i != null && clearTimeout(i), i = setTimeout(() => {
      i = null, y();
    }, c);
  }, u = () => {
    i !== null && (clearTimeout(i), i = null);
  }, a = () => {
    u(), s = void 0, n = null;
  }, l = () => {
    u(), t();
  }, p = function(...d) {
    if (e != null && e.aborted)
      return;
    s = this, n = d;
    const h = i == null;
    m(), $ && h && t();
  };
  return p.schedule = m, p.cancel = a, p.flush = l, e == null || e.addEventListener("abort", a, { once: !0 }), p;
}
function T(f) {
  const c = v.readFileSync(f, "utf-8"), o = /export\s+const\s+routes\s*:\s*RouteRecordRaw\[\]\s*=\s*(\[\s*{[\s\S]*?\n\])/.exec(c), s = /* @__PURE__ */ new Map();
  if (o) {
    let n = function(y) {
      for (const i of y) {
        const { name: m, meta: u, redirect: a, children: l } = i;
        s.set(m, {
          meta: u,
          redirect: a
        }), l && l.length > 0 && n(l);
      }
    };
    const r = o[1].replace(/\(\)\s*=>\s*import\(('[^']+'|"[^"]+")\)/g, "$1").replace(/\n/g, "").replace(/\s+/g, " "), t = new Function(`return ${r};`)();
    return n(t), s;
  } else
    throw new Error("Failed to parse routes");
}
function E(f) {
  const c = [];
  function e(o) {
    o.name && c.push(o.name), o.children && o.children.forEach(e);
  }
  return f.forEach(e), c;
}
function N(f) {
  return `// 此文件由vite-plugin-routes自动生成，请勿手动修改

type RouteRecordName =
  ${f.map((c) => `| '${c}'`).join(`
  `)}
`;
}
function P(f, c) {
  const e = "  ";
  let o = `// 此文件由vite-plugin-routes自动生成，仅限meta、redirect属性手动修改
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
`;
  function s(n, $ = 1) {
    var y, i, m, u, a, l;
    const r = e.repeat($);
    let t = r + `{
`;
    if (n.name && (t += `${r}${e}name: '${n.name}',
`), t += `${r}${e}path: '${n.path}',
`, n.component && (t += `${r}${e}component: () => import('${n.component}'),
`), (y = c.get(n.name)) != null && y.redirect)
      if (typeof ((i = c.get(n.name)) == null ? void 0 : i.redirect) == "string")
        t += `${r}${e}redirect: '${(m = c.get(n.name)) == null ? void 0 : m.redirect}',
`;
      else {
        t += `${r}${e}redirect: {
`;
        for (const [d, h] of Object.entries(((u = c.get(n.name)) == null ? void 0 : u.redirect) || {})) {
          const S = typeof h == "string" ? `'${h}'` : Array.isArray(h) ? JSON.stringify(h).replace(/"/g, "'") : h;
          t += `${r}${e}${e}${d}: ${S},
`;
        }
        t += `${r}${e}},
`;
      }
    if ((a = c.get(n.name)) != null && a.meta) {
      t += `${r}${e}meta: {
`;
      for (const [p, d] of Object.entries(((l = c.get(n.name)) == null ? void 0 : l.meta) || {})) {
        const h = typeof d == "string" ? `'${d}'` : Array.isArray(d) ? JSON.stringify(d).replace(/"/g, "'") : d;
        t += `${r}${e}${e}${p}: ${h},
`;
      }
      t += `${r}${e}},
`;
    } else
      t += `${r}${e}meta: {
`, t += `${r}${e}${e}title: '${n.meta.title}'
`, t += `${r}${e}},
`;
    return n.children && n.children.length > 0 && (t += `${r}${e}children: [
`, t += n.children.map((p) => s(p, $ + 2)).join(`,
`), t += `
${r}${e}]
`), t += `${r}}`, t;
  }
  return o += f.map((n) => s(n)).join(`,
`), o += `
]
`, o;
}
function j(f, c) {
  var n, $;
  const e = process.cwd(), o = [], s = v.readdirSync(f);
  for (const r of s) {
    const t = g.join(f, r);
    if (v.statSync(t).isDirectory()) {
      const i = v.existsSync(g.join(t, "index.vue")) || v.readdirSync(t).some((R) => R.match(/^\[.*?\]\.vue$/)), m = j(t, c), u = g.relative(g.join(e, "src/views"), t), a = u.split(g.sep), l = ($ = (n = v.readdirSync(t).find((R) => R.match(/^\[.*?\]\.vue$/))) == null ? void 0 : n.match(/\[(.*?)\]/)) == null ? void 0 : $[1], p = l ? a.length === 1 ? `/${r}/:${l}` : `${r}/:${l}` : a.length === 1 ? `/${r}` : r, d = a.map((R) => R.replace(/\[.*?\]$/, "")), h = d.join("-"), S = d.join("_");
      if (i || m.length > 0) {
        const R = !m.length, w = {
          path: p,
          name: h,
          level: a.length,
          meta: {
            title: S
          }
        }, x = `@${g.relative(e, c).replace("src", "").split(g.sep).join("/")}/${u.split(g.sep).join("/")}/${l ? `[${l}].vue` : "index.vue"}`;
        (R || i) && (w.component = x), w.children = m, o.push(w);
      }
    }
  }
  return o;
}
function k(f) {
  const { entry: c, output: e, typeDir: o } = f, s = process.cwd(), n = g.resolve(s, c), $ = g.resolve(s, e), r = g.resolve(s, o);
  let t = /* @__PURE__ */ new Map();
  function y() {
    t.clear(), t = T($);
    const u = j(n, n), a = P(u, t);
    v.writeFileSync($, a, "utf-8");
    const l = E(u), p = N(l);
    v.writeFileSync(r, p, "utf-8"), b(`npx prettier --write ${$} ${r}`);
  }
  const i = F(y, 300), m = v.watch(n, { recursive: !0 }, (u) => {
    u === "rename" && (console.log("监听到文件变化，重新生成路由..."), i());
  });
  return {
    name: "vite-plugin-vue-routes",
    enforce: "pre",
    buildStart() {
      y();
    },
    buildEnd() {
      m.close();
    }
  };
}
export {
  k as vitePluginRoutes
};
