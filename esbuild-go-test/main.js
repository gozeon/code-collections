
document.querySelector('#dy').addEventListener('click', function () {
    import('./a').then(m => (new m.A().sayA()))
}, true)


import { b } from './b'

b()

import { format } from 'date-fns'

const date = new Date()

document.querySelector('#time').innerText = format(date, 'yyyy-MM-dd HH:mm:ss')
