module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
    ],
    "globals": {
        "describe": "readonly",
        "beforeEach": "readonly",
        "afterEach": "readonly",
        "it": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "plugins": [
        "@typescript-eslint",
    ],
    "rules": {
        "quote-props": ["error", "as-needed"],
        "quotes": [2, "single", { "avoidEscape": true }],
        "sort-imports": "error",
        "no-unused-vars": 0,  // eslint flags imported types as unused variables.
        "no-trailing-spaces": "error"
    },
};