import g from "node:fs";
import $ from "node:path";
import { execSync as x } from "child_process";
function j(m, i, { signal: f, edges: r } = {}) {
  let l, e = null;
  const s = r != null && r.includes("leading"), t = r == null || r.includes("trailing"), n = () => {
    e !== null && (m.apply(l, e), l = void 0, e = null);
  }, a = () => {
    t && n(), p();
  };
  let o = null;
  const c = () => {
    o != null && clearTimeout(o), o = setTimeout(() => {
      o = null, a();
    }, i);
  }, d = () => {
    o !== null && (clearTimeout(o), o = null);
  }, p = () => {
    d(), l = void 0, e = null;
  }, u = () => {
    n();
  }, y = function(...v) {
    if (f?.aborted)
      return;
    l = this, e = v;
    const h = o == null;
    c(), s && h && n();
  };
  return y.schedule = c, y.cancel = p, y.flush = u, f?.addEventListener("abort", p, { once: !0 }), y;
}
function F(m) {
  const i = g.readFileSync(m, "utf-8"), r = /export\s+const\s+routes\s*:\s*RouteRecordRaw\[\]\s*=\s*(\[\s*{[\s\S]*?\n\])/.exec(i), l = /* @__PURE__ */ new Map();
  if (r) {
    let e = function(a) {
      for (const o of a) {
        const { name: c, meta: d, redirect: p, children: u } = o;
        l.set(c, {
          meta: d,
          redirect: p
        }), u && u.length > 0 && e(u);
      }
    };
    const t = r[1].replace(/\(\)\s*=>\s*import\(('[^']+'|"[^"]+")\)/g, "$1").replace(/\n/g, "").replace(/\s+/g, " "), n = new Function(`return ${t};`)();
    return e(n), l;
  } else
    throw new Error("Failed to parse routes");
}
function b(m) {
  const i = [];
  function f(r) {
    r.name && i.push(r.name), r.children && r.children.forEach(f);
  }
  return m.forEach(f), i;
}
function N(m) {
  const i = [], f = /:([a-zA-Z0-9_]+)(\+|\*)?/g;
  let r;
  for (; (r = f.exec(m)) !== null; ) {
    const l = r[1], e = r[2];
    l && i.push({
      name: l,
      isOptional: e === "*",
      isArray: e === "+"
    });
  }
  return i;
}
function T(m) {
  let i = `// 此文件由vite-plugin-routes自动生成，请勿手动修改
import type { RouteRecordInfo } from 'vue-router'
export {}

declare global {
  interface RouteNamedMap {`;
  function f(e) {
    const s = [];
    for (const t of e)
      s.push(t.name), t.children && t.children.length > 0 && s.push(...f(t.children));
    return s;
  }
  function r(e, s = "") {
    let t = "", n = e.path;
    s && (s.startsWith("/") && !e.path.startsWith("/") ? n = `${s}/${e.path}` : !s.startsWith("/") && !e.path.startsWith("/") ? n = `${s}/${e.path}` : n = e.path);
    const a = N(n);
    let o = "Record<never, never>";
    a.length > 0 && (o = `{
${a.map((u) => u.isArray ? `      ${u.name}: string | number | (string | number)[]` : `      ${u.name}: string | number`).join(`,
`)}
    }`);
    let c = "Record<never, never>";
    a.length > 0 && (c = `{
${a.map((u) => u.isArray ? `      ${u.name}: string[]` : `      ${u.name}: string`).join(`,
`)}
    }`);
    const d = e.children && e.children.length > 0 ? f(e.children).map((p) => `'${p}'`).join(" | ") : "never";
    if (t += `
    // ${e.meta.title || e.name}
`, t += `    '${e.name}': RouteRecordInfo<
`, t += `      '${e.name}',
`, t += `      '${n}',
`, t += `      ${o},
`, t += `      ${c},
`, t += `      ${d}
`, t += "    >", e.children && e.children.length > 0)
      for (const p of e.children)
        t += r(p, n);
    return t;
  }
  for (const e of m)
    i += r(e);
  i += `
  }
`;
  const l = b(m);
  return i += `
  type RouteRecordName =
    ${l.map((e) => `| '${e}'`).join(`
    `)}
`, i += `
}
`, i;
}
function A(m, i) {
  let r = `// 此文件由vite-plugin-routes自动生成，仅限meta、redirect属性手动修改
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
`;
  function l(e, s = 1) {
    const t = "  ".repeat(s);
    let n = t + `{
`;
    if (e.name && (n += `${t}  name: '${e.name}',
`), n += `${t}  path: '${e.path}',
`, e.component && (n += `${t}  component: () => import('${e.component}'),
`), i.get(e.name)?.redirect)
      if (typeof i.get(e.name)?.redirect == "string")
        n += `${t}  redirect: '${i.get(e.name)?.redirect}',
`;
      else {
        n += `${t}  redirect: {
`;
        for (const [o, c] of Object.entries(i.get(e.name)?.redirect || {})) {
          const d = typeof c == "string" ? `'${c}'` : Array.isArray(c) ? JSON.stringify(c).replace(/"/g, "'") : c;
          n += `${t}    ${o}: ${d},
`;
        }
        n += `${t}  },
`;
      }
    if (i.get(e.name)?.meta) {
      n += `${t}  meta: {
`;
      for (const [a, o] of Object.entries(i.get(e.name)?.meta || {})) {
        const c = typeof o == "string" ? `'${o}'` : Array.isArray(o) ? JSON.stringify(o).replace(/"/g, "'") : o;
        n += `${t}    ${a}: ${c},
`;
      }
      n += `${t}  },
`;
    } else
      n += `${t}  meta: {
`, n += `${t}    title: '${e.meta.title}'
`, n += `${t}  },
`;
    return e.children && e.children.length > 0 && (n += `${t}  children: [
`, n += e.children.map((a) => l(a, s + 2)).join(`,
`), n += `
${t}  ]
`), n += `${t}}`, n;
  }
  return r += m.map((e) => l(e)).join(`,
`), r += `
]
`, r;
}
function w(m, i) {
  const f = process.cwd(), r = [], l = g.readdirSync(m);
  for (const e of l) {
    const s = $.join(m, e);
    if (g.statSync(s).isDirectory()) {
      const n = g.existsSync($.join(s, "index.vue")) || g.readdirSync(s).some((h) => h.match(/^\[.*?\]\.vue$/)), a = w(s, i), o = $.relative($.join(f, "src/views"), s), c = o.split($.sep), d = g.readdirSync(s).find((h) => h.match(/^\[.*?\]\.vue$/))?.match(/\[(.*?)\]/)?.[1], p = d ? c.length === 1 ? `/${e}/:${d}` : `${e}/:${d}` : c.length === 1 ? `/${e}` : e, u = c.map((h) => h.replace(/\[.*?\]$/, "")), y = u.join("-"), v = u.join("_");
      if (n || a.length > 0) {
        const h = !a.length, R = {
          path: p,
          name: y,
          level: c.length,
          meta: {
            title: v
          }
        }, S = `@${$.relative(f, i).replace("src", "").split($.sep).join("/")}/${o.split($.sep).join("/")}/${d ? `[${d}].vue` : "index.vue"}`;
        (h || n) && (R.component = S), R.children = a, r.push(R);
      }
    }
  }
  return r;
}
function O(m) {
  const { entry: i, output: f, typeDir: r } = m, l = process.cwd(), e = $.resolve(l, i), s = $.resolve(l, f), t = $.resolve(l, r);
  let n = /* @__PURE__ */ new Map();
  function a(d = !1) {
    d && console.log("监听到文件变化，重新生成路由..."), n.clear(), n = F(s);
    const p = w(e, e), u = A(p, n);
    g.writeFileSync(s, u, "utf-8");
    const y = T(p);
    g.writeFileSync(t, y, "utf-8"), x(`npx prettier --write ${s} ${t}`), console.log("\x1B[32mvite-plugin-vue-routes: 路由生成成功\x1B[0m");
  }
  const o = j(a, 300), c = g.watch(e, { recursive: !0 }, (d) => {
    d === "rename" && o();
  });
  return {
    name: "vite-plugin-vue-routes",
    enforce: "pre",
    buildStart() {
      a();
    },
    buildEnd() {
      c.close();
    }
  };
}
export {
  O as vitePluginRoutes
};
