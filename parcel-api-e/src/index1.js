document.querySelectorAll('button').forEach(el => {
	el.addEventListener('click', e => {
		console.log(e)
	}, false)
})

/**
 * bundle options -- global
 * e: widnow.goze =  {a: 2}
 */
module.exports = {
	a: 2
}


/**
 * bundle options -- global
 * not work
 */
export default {
	a: 3
}
