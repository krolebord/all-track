/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "custom",
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node"
  ],
};
