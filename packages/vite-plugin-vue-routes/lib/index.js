import g from "node:fs";
import p from "node:path";
import { execSync as x } from "child_process";
function j(m, o, { signal: f, edges: c } = {}) {
  let t, e = null;
  const r = c != null && c.includes("leading"), i = c == null || c.includes("trailing"), n = () => {
    e !== null && (m.apply(t, e), t = void 0, e = null);
  }, u = () => {
    i && n(), d();
  };
  let s = null;
  const l = () => {
    s != null && clearTimeout(s), s = setTimeout(() => {
      s = null, u();
    }, o);
  }, a = () => {
    s !== null && (clearTimeout(s), s = null);
  }, d = () => {
    a(), t = void 0, e = null;
  }, $ = () => {
    n();
  }, y = function(...v) {
    if (f?.aborted)
      return;
    t = this, e = v;
    const h = s == null;
    l(), r && h && n();
  };
  return y.schedule = l, y.cancel = d, y.flush = $, f?.addEventListener("abort", d, { once: !0 }), y;
}
function F(m) {
  const o = g.readFileSync(m, "utf-8"), c = /export\s+const\s+routes\s*:\s*RouteRecordRaw\[\]\s*=\s*(\[\s*{[\s\S]*?\n\])/.exec(o), t = /* @__PURE__ */ new Map();
  if (c) {
    let e = function(u) {
      for (const s of u) {
        const { name: l, meta: a, redirect: d, children: $ } = s;
        t.set(l, {
          meta: a,
          redirect: d
        }), $ && $.length > 0 && e($);
      }
    };
    const i = c[1].replace(/\(\)\s*=>\s*import\(('[^']+'|"[^"]+")\)/g, "$1").replace(/\n/g, "").replace(/\s+/g, " "), n = new Function(`return ${i};`)();
    return e(n), t;
  } else
    throw new Error("Failed to parse routes");
}
function b(m) {
  const o = [], f = /:([a-zA-Z0-9_]+)(\+|\*)?/g;
  let c;
  for (; (c = f.exec(m)) !== null; ) {
    const t = c[1], e = c[2];
    t && o.push({
      name: t,
      isOptional: e === "*",
      isArray: e === "+"
    });
  }
  return o;
}
function N(m) {
  let o = `// 此文件由vite-plugin-routes自动生成，请勿手动修改
import type { RouteRecordInfo } from 'vue-router'
export {}

declare global {
  interface RouteNamedMap {`;
  function f(t) {
    const e = [];
    for (const r of t)
      e.push(r.name), r.children && r.children.length > 0 && e.push(...f(r.children));
    return e;
  }
  function c(t, e = "") {
    let r = "", i = t.path;
    e && (e.startsWith("/") && !t.path.startsWith("/") ? i = `${e}/${t.path}` : !e.startsWith("/") && !t.path.startsWith("/") ? i = `${e}/${t.path}` : i = t.path);
    const n = b(i);
    let u = "Record<never, never>";
    n.length > 0 && (u = `{
${n.map((d) => d.isArray ? `      ${d.name}: string | number | (string | number)[]` : `      ${d.name}: string | number`).join(`,
`)}
    }`);
    let s = "Record<never, never>";
    n.length > 0 && (s = `{
${n.map((d) => d.isArray ? `      ${d.name}: string[]` : `      ${d.name}: string`).join(`,
`)}
    }`);
    const l = t.children && t.children.length > 0 ? f(t.children).map((a) => `'${a}'`).join(" | ") : "never";
    if (r += `
    // ${t.meta.title || t.name}
`, r += `    '${t.name}': RouteRecordInfo<
`, r += `      '${t.name}',
`, r += `      '${i}',
`, r += `      ${u},
`, r += `      ${s},
`, r += `      ${l}
`, r += "    >", t.children && t.children.length > 0)
      for (const a of t.children)
        r += c(a, i);
    return r;
  }
  for (const t of m)
    o += c(t);
  return o += `
  }
`, o += `
  type RouteRecordName = keyof RouteNamedMap
`, o += `
}
`, o;
}
function T(m, o) {
  let c = `// 此文件由vite-plugin-routes自动生成，仅限meta、redirect属性手动修改
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
`;
  function t(e, r = 1) {
    const i = "  ".repeat(r);
    let n = i + `{
`;
    if (e.name && (n += `${i}  name: '${e.name}',
`), n += `${i}  path: '${e.path}',
`, e.component && (n += `${i}  component: () => import('${e.component}'),
`), o.get(e.name)?.redirect)
      if (typeof o.get(e.name)?.redirect == "string")
        n += `${i}  redirect: '${o.get(e.name)?.redirect}',
`;
      else {
        n += `${i}  redirect: {
`;
        for (const [s, l] of Object.entries(o.get(e.name)?.redirect || {})) {
          const a = typeof l == "string" ? `'${l}'` : Array.isArray(l) ? JSON.stringify(l).replace(/"/g, "'") : l;
          n += `${i}    ${s}: ${a},
`;
        }
        n += `${i}  },
`;
      }
    if (o.get(e.name)?.meta) {
      n += `${i}  meta: {
`;
      for (const [u, s] of Object.entries(o.get(e.name)?.meta || {})) {
        const l = typeof s == "string" ? `'${s}'` : Array.isArray(s) ? JSON.stringify(s).replace(/"/g, "'") : s;
        n += `${i}    ${u}: ${l},
`;
      }
      n += `${i}  },
`;
    } else
      n += `${i}  meta: {
`, n += `${i}    title: '${e.meta.title}'
`, n += `${i}  },
`;
    return e.children && e.children.length > 0 && (n += `${i}  children: [
`, n += e.children.map((u) => t(u, r + 2)).join(`,
`), n += `
${i}  ]
`), n += `${i}}`, n;
  }
  return c += m.map((e) => t(e)).join(`,
`), c += `
]
`, c;
}
function w(m, o) {
  const f = process.cwd(), c = [], t = g.readdirSync(m);
  for (const e of t) {
    const r = p.join(m, e);
    if (g.statSync(r).isDirectory()) {
      const n = g.existsSync(p.join(r, "index.vue")) || g.readdirSync(r).some((h) => h.match(/^\[.*?\]\.vue$/)), u = w(r, o), s = p.relative(p.join(f, "src/views"), r), l = s.split(p.sep), a = g.readdirSync(r).find((h) => h.match(/^\[.*?\]\.vue$/))?.match(/\[(.*?)\]/)?.[1], d = a ? l.length === 1 ? `/${e}/:${a}` : `${e}/:${a}` : l.length === 1 ? `/${e}` : e, $ = l.map((h) => h.replace(/\[.*?\]$/, "")), y = $.join("-"), v = $.join("_");
      if (n || u.length > 0) {
        const h = !u.length, R = {
          path: d,
          name: y,
          level: l.length,
          meta: {
            title: v
          }
        }, S = `@${p.relative(f, o).replace("src", "").split(p.sep).join("/")}/${s.split(p.sep).join("/")}/${a ? `[${a}].vue` : "index.vue"}`;
        (h || n) && (R.component = S), R.children = u, c.push(R);
      }
    }
  }
  return c;
}
function E(m) {
  const { entry: o, output: f, typeDir: c } = m, t = process.cwd(), e = p.resolve(t, o), r = p.resolve(t, f), i = p.resolve(t, c);
  let n = /* @__PURE__ */ new Map();
  function u(a = !1) {
    a && console.log("监听到文件变化，重新生成路由..."), n.clear(), n = F(r);
    const d = w(e, e), $ = T(d, n);
    g.writeFileSync(r, $, "utf-8");
    const y = N(d);
    g.writeFileSync(i, y, "utf-8"), x(`npx prettier --write ${r} ${i}`), console.log("\x1B[32mvite-plugin-vue-routes: 路由生成成功\x1B[0m");
  }
  const s = j(u, 300), l = g.watch(e, { recursive: !0 }, (a) => {
    a === "rename" && s();
  });
  return {
    name: "vite-plugin-vue-routes",
    enforce: "pre",
    buildStart() {
      u();
    },
    buildEnd() {
      l.close();
    }
  };
}
export {
  E as vitePluginRoutes
};
