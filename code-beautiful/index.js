const prettier = require("prettier");
const fs = require('fs-extra')

const target = fs.readFileSync('./test.vue').toString()
console.log(target)

const result = prettier.format(target, {
    singleQuote: true,
    semi: false,
    tabWidth: 2,
    parser: "vue",
});

console.log(result)