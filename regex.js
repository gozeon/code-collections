const r = '@abc'.replace(/(.@+)/g,'/') // "@abc"
const r1 = '@abc@edf'.replace(/(.@+)/g,'/') // "@ab/edf"
const r2 = '@abc@edf@1.0.0'.replace(/(.@+)/g,'/') // "@ab/ed/1.0.0"