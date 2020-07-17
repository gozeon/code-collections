import {a} from './a'

a()


import('./b').then(m => m.b()).catch(e => console.error(e))

