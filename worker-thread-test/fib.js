/**
 * https://it.wikipedia.org/wiki/Successione_di_Fibonacci
 * @param {*} num
 */
function fibonacci(num) {
	if (num <= 1) return 1;
	return fibonacci(num - 1) + fibonacci(num - 2);
}

module.exports = fibonacci
