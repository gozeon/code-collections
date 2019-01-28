const boom = require('boom')

const Car = require('../models/Car')

exports.getCars = async (request, reply) => {
	try {
		const cars = await Car.find()
		return cars
	} catch (err) {
		throw boom.boomify(err)
	}
}

exports.getSingelCar = async (request, reply) => {
	try {
		const id = request.params.id
		const car = await Car.findById(id)
		return car
	} catch (err) {
		throw boom.boomify(err)
	}
}

exports.addCar = async (request, reply) => {
  try {
    const car = new Car(request.body)
    return car.save()
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.updateCar = async (request, reply) => {
	try {
		const id = request.params.id
		const car = request.body
		const { ...updateData } = car
		const update = await Car.findByIdAndUpdate(id, updateData, { new: true })
		return update
	} catch (err) {
		throw boom.boomify(err)
	}
}

exports.deleteCar = async (request, reply) => {
	try {
		const id = request.params.id
		const car = await Car.findByIdAndRemove(id)
		return car
	} catch (err) {
		throw boom.boomify(err)
	}
}
