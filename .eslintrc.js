module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "./bin/www"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["prettier"],
  rules: {
    semi: "warn",
    "no-var": "error",
    "no-unused-vars": "warn",
    "no-param-reassign": 0,
    "no-console": "warn",
    "no-underscore-dangle": 0,
    "func-names": "off",
  },
};
