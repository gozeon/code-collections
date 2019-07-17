const { successResponse } = require('./utils')

console.log(successResponse({ a: 1 }, 200, 'ok'))

const objt = {
    name: 1,
    child: [
        {
            name: 2,
            child: [
                {
                    name: 3
                },
                {
                    name: 4,
                    child: [
                        {
                            name: 5
                        }
                    ]
                }
            ]

        }
    ]
}

function aam(obj) {
    if(obj.hasOwnProperty('name')) {
        console.log(obj.name)
    }
    if(obj.hasOwnProperty('child') && Array.isArray(obj.child) ){
        Array.prototype.forEach.call(obj.child, aam)
    }
}

aam(objt)
