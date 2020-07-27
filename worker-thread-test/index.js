const task = require('./worker')

async function run() {
	const result = await task(+process.argv.slice(2))
	// console.log("\n")
	console.log(result)
}

const NS_PER_SEC = 1e9
const time = process.hrtime()
run()
const diff = process.hrtime(time)
console.log(`[ ${__filename}]Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`)
