const { cosmiconfig, cosmiconfigSync } = require('cosmiconfig')
const explorer = cosmiconfig('ss')

explorer
  .search()
  .then((result) => {
    console.log(result)
  })
  .catch((err) => {
    console.log(err)
  })

const explorerSync = cosmiconfigSync('ss')
const searchedFor = explorerSync.search()
console.log('searchedFor', searchedFor)
