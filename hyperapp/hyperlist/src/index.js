import { app } from 'hyperapp'

import state from './js/state.js'
import actions from './js/actions.js'
import view from './js/view.js'

import './scss/index.scss'

const main = app(state, actions, view, document.body);
