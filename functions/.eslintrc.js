module.exports = {
  root: true,
  ecmaVersion: "8",
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    //"google",
  ],
  rules: {
    quotes: ["error", "double"],
  },
};
