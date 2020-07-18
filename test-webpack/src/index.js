import {a} from './a'

console.log(a())


import('./b').then(m => m.b()).catch(e => console.error(e))


const d = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    })
})

async function c() {
    const d = await d()
    console.log(d)
}

import $ from 'jquery';
console.log($)

console.log(Array.isArray('ss'))