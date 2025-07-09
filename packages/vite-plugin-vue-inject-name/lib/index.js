import { parse as m } from "vue/compiler-sfc";
import { createFilter as d } from "@rollup/pluginutils";
import i from "node:path";
function w(u = "src/views") {
  const p = i.resolve(process.cwd(), u).replace(/\\/g, "/"), f = d(/(index\.vue|\[[^/]+\]\.vue)$/);
  return {
    name: "vite-plugin-vue-inject-name",
    enforce: "pre",
    transform(e, n) {
      if (!n.startsWith(p) || !f(n)) return;
      const { descriptor: c } = m(e, {
        ignoreEmpty: !1
      });
      if (!c.scriptSetup) return;
      const o = i.relative(p, n).split(i.sep);
      o.pop();
      const s = o.join("-"), { content: t } = c.scriptSetup;
      if (t.includes("defineOptions")) {
        const r = t.replace(/defineOptions\((\{[\s\S]*?\})\)/, (v, a) => {
          const l = a.replace(/(name\s*:\s*)(['"][^'"]*['"]|[\w\.]+)/, `$1'${s}'`);
          return l.includes("name:") ? `defineOptions(${l})` : `defineOptions({
              ${a.trim().slice(1, -1)},
              name: '${s}',
            })`;
        });
        return {
          code: e.replace(t, r),
          map: null
        };
      } else {
        const r = e.match(/<script[\s\S]*?setup[\s\S]*?>/g);
        if (!r)
          throw new Error("script setup 标签匹配错误");
        return {
          code: e.replace(
            /<script[\s\S]*?setup[\s\S]*?>([\s\S]*?)<\/script>/,
            `${r[0]}
          ${t}
defineOptions({
  name: '${s}',
});
<\/script>`
          ),
          map: null
        };
      }
    }
  };
}
export {
  w as injectFolderNamePlugin
};
