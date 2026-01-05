import g from "node:fs";
import p from "node:path";
import { execSync as x } from "child_process";
function b(m, o, { signal: f, edges: c } = {}) {
  let t, e = null;
  const i = c != null && c.includes("leading"), r = c == null || c.includes("trailing"), n = () => {
    e !== null && (m.apply(t, e), t = void 0, e = null);
  }, u = () => {
    r && n(), d();
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
  }, y = function(...R) {
    if (f?.aborted)
      return;
    t = this, e = R;
    const h = s == null;
    l(), i && h && n();
  };
  return y.schedule = l, y.cancel = d, y.flush = $, f?.addEventListener("abort", d, { once: !0 }), y;
}
function j(m) {
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
    const r = c[1].replace(/\(\)\s*=>\s*import\(('[^']+'|"[^"]+")\)/g, "$1").replace(/\n/g, "").replace(/\s+/g, " "), n = new Function(`return ${r};`)();
    return e(n), t;
  } else
    throw new Error("Failed to parse routes");
}
function F(m) {
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
    for (const i of t)
      e.push(i.name), i.children && i.children.length > 0 && e.push(...f(i.children));
    return e;
  }
  function c(t, e = "") {
    let i = "", r = t.path;
    e && (e.startsWith("/") && !t.path.startsWith("/") ? r = `${e}/${t.path}` : !e.startsWith("/") && !t.path.startsWith("/") ? r = `${e}/${t.path}` : r = t.path);
    const n = F(r);
    let u = "Record<string, string | number>";
    n.length > 0 && (u = `{
${n.map((d) => d.isArray ? `      ${d.name}: string | number | (string | number)[]` : `      ${d.name}: string | number`).join(`,
`)}
    } & ${u}`);
    let s = "Record<string, string>";
    n.length > 0 && (s = `{
${n.map((d) => d.isArray ? `      ${d.name}: string[]` : `      ${d.name}: string`).join(`,
`)}
    } & ${s}`);
    const l = t.children && t.children.length > 0 ? f(t.children).map((a) => `'${a}'`).join(" | ") : "never";
    if (i += `
    // ${t.meta.title || t.name}
`, i += `    '${t.name}': RouteRecordInfo<
`, i += `      '${t.name}',
`, i += `      '${r}',
`, i += `      ${u},
`, i += `      ${s},
`, i += `      ${l}
`, i += "    >", t.children && t.children.length > 0)
      for (const a of t.children)
        i += c(a, r);
    return i;
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
  function t(e, i = 1) {
    const r = "  ".repeat(i);
    let n = r + `{
`;
    if (e.name && (n += `${r}  name: '${e.name}',
`), n += `${r}  path: '${e.path}',
`, e.component && (n += `${r}  component: () => import('${e.component}'),
`), o.get(e.name)?.redirect)
      if (typeof o.get(e.name)?.redirect == "string")
        n += `${r}  redirect: '${o.get(e.name)?.redirect}',
`;
      else {
        n += `${r}  redirect: {
`;
        for (const [s, l] of Object.entries(o.get(e.name)?.redirect || {})) {
          const a = typeof l == "string" ? `'${l}'` : Array.isArray(l) ? JSON.stringify(l).replace(/"/g, "'") : l;
          n += `${r}    ${s}: ${a},
`;
        }
        n += `${r}  },
`;
      }
    if (o.get(e.name)?.meta) {
      n += `${r}  meta: {
`;
      for (const [u, s] of Object.entries(o.get(e.name)?.meta || {})) {
        const l = typeof s == "string" ? `'${s}'` : Array.isArray(s) ? JSON.stringify(s).replace(/"/g, "'") : s;
        n += `${r}    ${u}: ${l},
`;
      }
      n += `${r}  },
`;
    } else
      n += `${r}  meta: {
`, n += `${r}    title: '${e.meta.title}'
`, n += `${r}  },
`;
    return e.children && e.children.length > 0 && (n += `${r}  children: [
`, n += e.children.map((u) => t(u, i + 2)).join(`,
`), n += `
${r}  ]
`), n += `${r}}`, n;
  }
  return c += m.map((e) => t(e)).join(`,
`), c += `
]
`, c;
}
function w(m, o) {
  const f = process.cwd(), c = [], t = g.readdirSync(m);
  for (const e of t) {
    const i = p.join(m, e);
    if (g.statSync(i).isDirectory()) {
      const n = g.existsSync(p.join(i, "index.vue")) || g.readdirSync(i).some((h) => h.match(/^\[.*?\]\.vue$/)), u = w(i, o), s = p.relative(p.join(f, "src/views"), i), l = s.split(p.sep), a = g.readdirSync(i).find((h) => h.match(/^\[.*?\]\.vue$/))?.match(/\[(.*?)\]/)?.[1], d = a ? l.length === 1 ? `/${e}/:${a}` : `${e}/:${a}` : l.length === 1 ? `/${e}` : e, $ = l.map((h) => h.replace(/\[.*?\]$/, "")), y = $.join("-"), R = $.join("_");
      if (n || u.length > 0) {
        const h = !u.length, v = {
          path: d,
          name: y,
          level: l.length,
          meta: {
            title: R
          }
        }, S = `@${p.relative(f, o).replace("src", "").split(p.sep).join("/")}/${s.split(p.sep).join("/")}/${a ? `[${a}].vue` : "index.vue"}`;
        (h || n) && (v.component = S), v.children = u, c.push(v);
      }
    }
  }
  return c;
}
function E(m) {
  const { entry: o, output: f, typeDir: c } = m, t = process.cwd(), e = p.resolve(t, o), i = p.resolve(t, f), r = p.resolve(t, c);
  let n = /* @__PURE__ */ new Map();
  function u(a = !1) {
    a && console.log("监听到文件变化，重新生成路由..."), n.clear(), n = j(i);
    const d = w(e, e), $ = T(d, n);
    g.writeFileSync(i, $, "utf-8");
    const y = N(d);
    g.writeFileSync(r, y, "utf-8"), x(`npx prettier --write ${i} ${r}`), console.log("\x1B[32mvite-plugin-vue-routes: 路由生成成功\x1B[0m");
  }
  const s = b(u, 300), l = g.watch(e, { recursive: !0 }, (a) => {
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
