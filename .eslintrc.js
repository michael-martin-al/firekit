const path = require('path')

module.exports = {
  "extends": [
    "airbnb-base",
    "plugin:prettier/recommended",
  ],
  "globals": {
    "window": true,
    "document": true,
    "it": true,
    "FileReader": true
  },
  "env": {
    "browser": true,
    "jest": true,
    "es6": true,
    "node": true
  },
  "parser": 'babel-eslint',
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "ignorePatterns": [
    "**/node_modules/**",
    "**/lib",
    "**/lib/**/*.js"
  ],
  "rules": {
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "no-unused-vars": "warn"
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": ['.js', '.jsx', '.test.js'],
        "moduleDirectory": [
          "node_modules",
          "src"
        ]
      }
    }
  }
};
