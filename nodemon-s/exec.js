const exec = require('child_process').exec

let serve = exec(
  `npm run start:express`,
  {
    cwd: __dirname,
  }
)
serve.stdout.on('data', data => {
  console.log(data)
})
serve.stderr.on('data', data => {
  console.log(data)
  console.log(new Date())
})
