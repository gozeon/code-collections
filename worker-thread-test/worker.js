const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

if (isMainThread) {
	// console.log("--------------------------")
	// console.log("isMainThread", isMainThread)
	module.exports = function task(data) {
		// console.log("task -> data", data)
		return new Promise((resolve, reject) => {
			const worker = new Worker(__filename, {
				workerData: data
			});
			worker.on('message', resolve);
			worker.on('error', reject);
			worker.on('exit', (code) => {
				if (code !== 0)
					reject(new Error(`Worker stopped with exit code ${code}`));
			});
		})
	}
} else {
	const fibonacci = require('./fib')
	// console.log("--------------------------")
	// console.log("isMainThread", isMainThread)
	// console.log("workerData", workerData)

	parentPort.postMessage(fibonacci(workerData))
}
