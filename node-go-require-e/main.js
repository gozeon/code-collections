require('node-go-require');

var petGo = require('./pet.go');

var pet = petGo.pet.New('my pet');
console.log(pet.Name());
pet.SetName('new name...');
console.log(pet.Name());
