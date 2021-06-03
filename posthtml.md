# posthtml

https://github.com/posthtml/

```js
const posthtml = require('posthtml')
const parser = require('posthtml-parser')

const tmpHtml = `
<a class="animals" href="#">
    <span class="animals__cat" style="background: url(cat.png)">Cat</span>
</a>`

posthtml()
    .use(tree => {
        const ast = parser.default(tmpHtml)
        console.log(ast)
        return ast
    })
    .process('', {})
    .then(result => {
        const { html } = result
        console.log(html)
    })

```

output

```txt
[
  '\n',
  {
    tag: 'a',
    attrs: { class: 'animals', href: '#' },
    content: [ '\n    ', [Object], '\n' ]
  }
]

<a class="animals" href="#">
    <span class="animals__cat" style="background: url(cat.png)">Cat</span>
</a>
```
