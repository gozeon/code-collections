let squarer;

console.time('loading & compiling wasm file');

function loadWebAssembly(fileName) {
	return fetch(fileName)
		.then(response => response.arrayBuffer())
		.then(buffer => WebAssembly.compile(buffer))
		.then(module => {
			return new WebAssembly.Instance(module);
		});
}

loadWebAssembly("squarer.wasm").then(instance => {
	squarer = instance.exports._Z7squareri;
	console.timeEnd('loading & compiling wasm file');
	console.log("Finished compiling! Ready when you are...");
});
