import x from "node:fs";
import h from "node:path";
import { execSync as w } from "child_process";
import * as f from "typescript";
function N(m, l, { signal: p, edges: u } = {}) {
  let n, t = null;
  const s = u != null && u.includes("leading"), o = u == null || u.includes("trailing"), i = () => {
    t !== null && (m.apply(n, t), n = void 0, t = null);
  }, d = () => {
    o && i(), c();
  };
  let e = null;
  const r = () => {
    e != null && clearTimeout(e), e = setTimeout(() => {
      e = null, d();
    }, l);
  }, a = () => {
    e !== null && (clearTimeout(e), e = null);
  }, c = () => {
    a(), n = void 0, t = null;
  }, g = () => {
    i();
  }, $ = function(...v) {
    if (p?.aborted)
      return;
    n = this, t = v;
    const y = e == null;
    r(), s && y && i();
  };
  return $.schedule = r, $.cancel = c, $.flush = g, p?.addEventListener("abort", c, { once: !0 }), $;
}
function j(m) {
  const l = x.readFileSync(m, "utf-8"), p = f.createSourceFile(m, l, f.ScriptTarget.Latest, !0), u = /* @__PURE__ */ new Map();
  let n = [];
  function t(e) {
    if (f.isVariableStatement(e))
      for (const r of e.declarationList.declarations)
        f.isIdentifier(r.name) && r.name.text === "routes" && r.initializer && f.isArrayLiteralExpression(r.initializer) && (n = s(r.initializer));
    f.forEachChild(e, t);
  }
  function s(e) {
    return e.elements.map((r) => i(r));
  }
  function o(e) {
    const r = {};
    for (const a of e.properties)
      if (f.isPropertyAssignment(a)) {
        const c = f.isIdentifier(a.name) || f.isStringLiteral(a.name) ? a.name.text : "", g = i(a.initializer);
        c && (r[c] = g);
      }
    return r;
  }
  function i(e) {
    if (f.isStringLiteral(e))
      return e.text;
    if (f.isNumericLiteral(e))
      return Number(e.text);
    if (e.kind === f.SyntaxKind.TrueKeyword)
      return !0;
    if (e.kind === f.SyntaxKind.FalseKeyword)
      return !1;
    if (e.kind === f.SyntaxKind.ArrayLiteralExpression)
      return s(e);
    if (e.kind === f.SyntaxKind.ObjectLiteralExpression)
      return o(e);
    if (e.kind === f.SyntaxKind.CallExpression) {
      const r = e;
      if (r.expression.kind === f.SyntaxKind.Identifier && r.expression.text === "import") {
        const c = r.arguments[0];
        return c && c.kind === f.SyntaxKind.StringLiteral ? c.text : "";
      }
    } else {
      if (e.kind === f.SyntaxKind.ArrowFunction)
        return;
      if (e.kind === f.SyntaxKind.AsExpression)
        return i(e.expression);
      if (e.kind === f.SyntaxKind.Identifier)
        return e.text;
    }
  }
  function d(e) {
    for (const r of e) {
      const { name: a, meta: c, redirect: g, children: $ } = r;
      u.set(a, {
        meta: c,
        redirect: g
      }), $ && $.length > 0 && d($);
    }
  }
  if (t(p), n.length > 0)
    return d(n), u;
  throw new Error("Failed to parse routes");
}
function F(m) {
  const l = [], p = /:([a-zA-Z0-9_]+)(\+|\*)?/g;
  let u;
  for (; (u = p.exec(m)) !== null; ) {
    const n = u[1], t = u[2];
    n && l.push({
      name: n,
      isOptional: t === "*",
      isArray: t === "+"
    });
  }
  return l;
}
function k(m) {
  let l = `// 此文件由vite-plugin-routes自动生成，请勿手动修改
import type { RouteRecordInfo } from 'vue-router'
export {}

declare global {
  interface RouteNamedMap {`;
  function p(n) {
    const t = [];
    for (const s of n)
      t.push(s.name), s.children && s.children.length > 0 && t.push(...p(s.children));
    return t;
  }
  function u(n, t = "") {
    let s = "", o = n.path;
    t && (t.startsWith("/") && !n.path.startsWith("/") ? o = `${t}/${n.path}` : !t.startsWith("/") && !n.path.startsWith("/") ? o = `${t}/${n.path}` : o = n.path);
    const i = F(o);
    let d = "Record<string, string | number>";
    i.length > 0 && (d = `{
${i.map((c) => c.isArray ? `      ${c.name}: string | number | (string | number)[]` : `      ${c.name}: string | number`).join(`,
`)}
    } & ${d}`);
    let e = "Record<string, string>";
    i.length > 0 && (e = `{
${i.map((c) => c.isArray ? `      ${c.name}: string[]` : `      ${c.name}: string`).join(`,
`)}
    } & ${e}`);
    const r = n.children && n.children.length > 0 ? p(n.children).map((a) => `'${a}'`).join(" | ") : "never";
    if (s += `
    // ${n.meta.title || n.name}
`, s += `    '${n.name}': RouteRecordInfo<
`, s += `      '${n.name}',
`, s += `      '${o}',
`, s += `      ${d},
`, s += `      ${e},
`, s += `      ${r}
`, s += "    >", n.children && n.children.length > 0)
      for (const a of n.children)
        s += u(a, o);
    return s;
  }
  for (const n of m)
    l += u(n);
  return l += `
  }
`, l += `
  type RouteRecordName = keyof RouteNamedMap
`, l += `
}
`, l;
}
function A(m, l) {
  let u = `// 此文件由vite-plugin-routes自动生成，仅限meta、redirect属性手动修改
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
`;
  function n(t, s = 1) {
    const o = "  ".repeat(s);
    let i = o + `{
`;
    if (t.name && (i += `${o}  name: '${t.name}',
`), i += `${o}  path: '${t.path}',
`, t.component && (i += `${o}  component: () => import('${t.component}'),
`), l.get(t.name)?.redirect)
      if (typeof l.get(t.name)?.redirect == "string")
        i += `${o}  redirect: '${l.get(t.name)?.redirect}',
`;
      else {
        i += `${o}  redirect: {
`;
        for (const [e, r] of Object.entries(l.get(t.name)?.redirect || {})) {
          const a = typeof r == "string" ? `'${r}'` : Array.isArray(r) ? JSON.stringify(r).replace(/"/g, "'") : r;
          i += `${o}    ${e}: ${a},
`;
        }
        i += `${o}  },
`;
      }
    if (l.get(t.name)?.meta) {
      i += `${o}  meta: {
`;
      for (const [d, e] of Object.entries(l.get(t.name)?.meta || {})) {
        const r = typeof e == "string" ? `'${e}'` : Array.isArray(e) ? JSON.stringify(e).replace(/"/g, "'") : e;
        i += `${o}    ${d}: ${r},
`;
      }
      i += `${o}  },
`;
    } else
      i += `${o}  meta: {
`, i += `${o}    title: '${t.meta.title}'
`, i += `${o}  },
`;
    return t.children && t.children.length > 0 && (i += `${o}  children: [
`, i += t.children.map((d) => n(d, s + 2)).join(`,
`), i += `
${o}  ]
`), i += `${o}}`, i;
  }
  return u += m.map((t) => n(t)).join(`,
`), u += `
]
`, u;
}
function R(m, l) {
  const p = process.cwd(), u = [], n = x.readdirSync(m);
  for (const t of n) {
    const s = h.join(m, t);
    if (x.statSync(s).isDirectory()) {
      const i = x.existsSync(h.join(s, "index.vue")) || x.readdirSync(s).some((y) => y.match(/^\[.*?\]\.vue$/)), d = R(s, l), e = h.relative(h.join(p, "src/views"), s), r = e.split(h.sep), a = x.readdirSync(s).find((y) => y.match(/^\[.*?\]\.vue$/))?.match(/\[(.*?)\]/)?.[1], c = a ? r.length === 1 ? `/${t}/:${a}` : `${t}/:${a}` : r.length === 1 ? `/${t}` : t, g = r.map((y) => y.replace(/\[.*?\]$/, "")), $ = g.join("-"), v = g.join("_");
      if (i || d.length > 0) {
        const y = !d.length, S = {
          path: c,
          name: $,
          level: r.length,
          meta: {
            title: v
          }
        }, b = `@${h.relative(p, l).replace("src", "").split(h.sep).join("/")}/${e.split(h.sep).join("/")}/${a ? `[${a}].vue` : "index.vue"}`;
        (y || i) && (S.component = b), S.children = d, u.push(S);
      }
    }
  }
  return u;
}
function L(m) {
  const { entry: l, output: p, typeDir: u } = m, n = process.cwd(), t = h.resolve(n, l), s = h.resolve(n, p), o = h.resolve(n, u);
  let i = /* @__PURE__ */ new Map();
  function d(a = !1) {
    a && console.log("监听到文件变化，重新生成路由..."), i.clear(), i = j(s);
    const c = R(t, t), g = A(c, i);
    x.writeFileSync(s, g, "utf-8");
    const $ = k(c);
    x.writeFileSync(o, $, "utf-8"), w(`npx prettier --write ${s} ${o}`), console.log("\x1B[32mvite-plugin-vue-routes: 路由生成成功\x1B[0m");
  }
  const e = N(d, 300), r = x.watch(t, { recursive: !0 }, (a) => {
    a === "rename" && e();
  });
  return {
    name: "vite-plugin-vue-routes",
    enforce: "pre",
    buildStart() {
      d();
    },
    buildEnd() {
      r.close();
    }
  };
}
export {
  L as vitePluginRoutes
};
