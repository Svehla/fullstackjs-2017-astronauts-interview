module.exports = {
    "parser": "babel-eslint",
    "plugins": [
        "flowtype",
    ],
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        jasmine: true //for unit testing ('describe' & 'it' is not defined)
    },
    //"extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": "off",
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
