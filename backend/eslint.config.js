const globals = require("globals");

module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    files: ["**/*.js"],
    rules: {
      "no-unused-vars": "off",
      "no-undef": "error"
    }
  }
];