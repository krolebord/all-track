/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "cloudflare-workers",
  server: "./server.js",
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ["**/.*"],
  future: {
    v2_routeConvention: true,
    unstable_tailwind: true,
    unstable_postcss: true,
  }
};
