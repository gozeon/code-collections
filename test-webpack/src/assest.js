import './assest.css'

import Icon from '../../async-cheatsheet.png'

const element = document.createElement('div')
const myIcon = new Image()
myIcon.src = Icon
element.appendChild(myIcon)
document.body.appendChild(element)

const element1 = document.createElement('div')
element1.classList.add('bi')
document.body.appendChild(element1)

import githubSvg from '../../github.svg'
console.log(githubSvg)
const element3 = document.createElement('div')
element3.innerHTML = githubSvg
document.body.appendChild(element3)

import XmlData from './assest.xml'
console.log(XmlData)
const element2 = document.createElement('pre')
element2.innerHTML = JSON.stringify(XmlData, null, 2)
document.body.appendChild(element2)


import('./assest-dy.js').then(m => m.b()).catch(e => console.error(e))
