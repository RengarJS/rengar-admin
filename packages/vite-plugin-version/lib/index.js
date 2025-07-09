import { writeFileSync as a } from "node:fs";
function d(t) {
  const {
    fileName: r = "version.json",
    versionPrefix: s = "v",
    includeBuildTime: l = !0,
    useShortTimestamp: c = !1
  } = t || {};
  let o = null;
  return {
    name: "vite-plugin-git-version",
    apply: "build",
    enforce: "post",
    configResolved(e) {
      o = e;
    },
    async closeBundle() {
      try {
        const e = Date.now(), i = { version: `${s}${c ? Math.floor(e / 1e3) : e}` };
        l && (i.buildTime = (/* @__PURE__ */ new Date()).toISOString(), i.buildTimestamp = e);
        const n = `${process.cwd()}/${o == null ? void 0 : o.build.outDir}/${r}`;
        a(n, JSON.stringify(i, null, 2)), console.log(`\x1B[32mVersion file generated: ${n}\x1B[0m`);
      } catch (e) {
        console.error("Failed to generate and commit version file:", e);
      }
    }
  };
}
export {
  d as timestampVersionPlugin
};
