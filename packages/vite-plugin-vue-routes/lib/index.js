import h from "node:fs";
import m from "node:path";
import { execSync as j } from "child_process";
function x(f, o, { signal: d, edges: i } = {}) {
  let s, e = null;
  const l = i != null && i.includes("leading"), n = i == null || i.includes("trailing"), t = () => {
    e !== null && (f.apply(s, e), s = void 0, e = null);
  }, u = () => {
    n && t(), $();
  };
  let r = null;
  const c = () => {
    r != null && clearTimeout(r), r = setTimeout(() => {
      r = null, u();
    }, o);
  }, a = () => {
    r !== null && (clearTimeout(r), r = null);
  }, $ = () => {
    a(), s = void 0, e = null;
  }, p = () => {
    t();
  }, y = function(...v) {
    if (d?.aborted)
      return;
    s = this, e = v;
    const g = r == null;
    c(), l && g && t();
  };
  return y.schedule = c, y.cancel = $, y.flush = p, d?.addEventListener("abort", $, { once: !0 }), y;
}
function b(f) {
  const o = h.readFileSync(f, "utf-8"), i = /export\s+const\s+routes\s*:\s*RouteRecordRaw\[\]\s*=\s*(\[\s*{[\s\S]*?\n\])/.exec(o), s = /* @__PURE__ */ new Map();
  if (i) {
    let e = function(u) {
      for (const r of u) {
        const { name: c, meta: a, redirect: $, children: p } = r;
        s.set(c, {
          meta: a,
          redirect: $
        }), p && p.length > 0 && e(p);
      }
    };
    const n = i[1].replace(/\(\)\s*=>\s*import\(('[^']+'|"[^"]+")\)/g, "$1").replace(/\n/g, "").replace(/\s+/g, " "), t = new Function(`return ${n};`)();
    return e(t), s;
  } else
    throw new Error("Failed to parse routes");
}
function F(f) {
  const o = [];
  function d(i) {
    i.name && o.push(i.name), i.children && i.children.forEach(d);
  }
  return f.forEach(d), o;
}
function T(f) {
  return `// 此文件由vite-plugin-routes自动生成，请勿手动修改

type RouteRecordName =
  ${f.map((o) => `| '${o}'`).join(`
  `)}
`;
}
function E(f, o) {
  let i = `// 此文件由vite-plugin-routes自动生成，仅限meta、redirect属性手动修改
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
`;
  function s(e, l = 1) {
    const n = "  ".repeat(l);
    let t = n + `{
`;
    if (e.name && (t += `${n}  name: '${e.name}',
`), t += `${n}  path: '${e.path}',
`, e.component && (t += `${n}  component: () => import('${e.component}'),
`), o.get(e.name)?.redirect)
      if (typeof o.get(e.name)?.redirect == "string")
        t += `${n}  redirect: '${o.get(e.name)?.redirect}',
`;
      else {
        t += `${n}  redirect: {
`;
        for (const [r, c] of Object.entries(o.get(e.name)?.redirect || {})) {
          const a = typeof c == "string" ? `'${c}'` : Array.isArray(c) ? JSON.stringify(c).replace(/"/g, "'") : c;
          t += `${n}    ${r}: ${a},
`;
        }
        t += `${n}  },
`;
      }
    if (o.get(e.name)?.meta) {
      t += `${n}  meta: {
`;
      for (const [u, r] of Object.entries(o.get(e.name)?.meta || {})) {
        const c = typeof r == "string" ? `'${r}'` : Array.isArray(r) ? JSON.stringify(r).replace(/"/g, "'") : r;
        t += `${n}    ${u}: ${c},
`;
      }
      t += `${n}  },
`;
    } else
      t += `${n}  meta: {
`, t += `${n}    title: '${e.meta.title}'
`, t += `${n}  },
`;
    return e.children && e.children.length > 0 && (t += `${n}  children: [
`, t += e.children.map((u) => s(u, l + 2)).join(`,
`), t += `
${n}  ]
`), t += `${n}}`, t;
  }
  return i += f.map((e) => s(e)).join(`,
`), i += `
]
`, i;
}
function S(f, o) {
  const d = process.cwd(), i = [], s = h.readdirSync(f);
  for (const e of s) {
    const l = m.join(f, e);
    if (h.statSync(l).isDirectory()) {
      const t = h.existsSync(m.join(l, "index.vue")) || h.readdirSync(l).some((g) => g.match(/^\[.*?\]\.vue$/)), u = S(l, o), r = m.relative(m.join(d, "src/views"), l), c = r.split(m.sep), a = h.readdirSync(l).find((g) => g.match(/^\[.*?\]\.vue$/))?.match(/\[(.*?)\]/)?.[1], $ = a ? c.length === 1 ? `/${e}/:${a}` : `${e}/:${a}` : c.length === 1 ? `/${e}` : e, p = c.map((g) => g.replace(/\[.*?\]$/, "")), y = p.join("-"), v = p.join("_");
      if (t || u.length > 0) {
        const g = !u.length, R = {
          path: $,
          name: y,
          level: c.length,
          meta: {
            title: v
          }
        }, w = `@${m.relative(d, o).replace("src", "").split(m.sep).join("/")}/${r.split(m.sep).join("/")}/${a ? `[${a}].vue` : "index.vue"}`;
        (g || t) && (R.component = w), R.children = u, i.push(R);
      }
    }
  }
  return i;
}
function O(f) {
  const { entry: o, output: d, typeDir: i } = f, s = process.cwd(), e = m.resolve(s, o), l = m.resolve(s, d), n = m.resolve(s, i);
  let t = /* @__PURE__ */ new Map();
  function u() {
    t.clear(), t = b(l);
    const a = S(e, e), $ = E(a, t);
    h.writeFileSync(l, $, "utf-8");
    const p = F(a), y = T(p);
    h.writeFileSync(n, y, "utf-8"), j(`npx prettier --write ${l} ${n}`);
  }
  const r = x(u, 300), c = h.watch(e, { recursive: !0 }, (a) => {
    a === "rename" && (console.log("监听到文件变化，重新生成路由..."), r());
  });
  return {
    name: "vite-plugin-vue-routes",
    enforce: "pre",
    buildStart() {
      u();
    },
    buildEnd() {
      c.close();
    }
  };
}
export {
  O as vitePluginRoutes
};
