module.exports = {
  env: {
    browser: true,
    es6: true,
    node: false,
  },
  extends: [
    "eslint:recommended",    
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {    
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["prettier", "@typescript-eslint"],
  rules: {   
    "@typescript-eslint/explicit-function-return-type": "off",
  },  
};
