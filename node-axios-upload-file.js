const fs = require('fs-extra')
const FormData = require('form-data');
const axios = require('axios')

const form = new FormData()
form.append('files', fs.createReadStream('./server.js'))
form.append('name', 'aaa')
form.append('version', '1.0.0')
console.log(form.getHeaders())

axios.create({
    headers: form.getHeaders()
}).post("http://127.0.0.1:3000/upload/multiple", form).then(response => {
    console.log(response.data);
})