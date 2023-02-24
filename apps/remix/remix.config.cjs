/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  server: "./app/server.ts",
  serverMinify: true,
  serverPlatform: "browser",
  serverModuleFormat: "esm",
  serverDependenciesToBundle: [/^(?!(__STATIC_CONTENT_MANIFEST)$).*$/u],
  serverConditions: ["workerd", "worker", "browser"],
  ignoredRouteFiles: ["**/.*"],
  devServerBroadcastDelay: 500,
  watchPaths: [
    "../../packages/trpc/**/*"
  ],
  future: {
    v2_routeConvention: true,
    unstable_tailwind: true,
    unstable_postcss: true,
  }
};
