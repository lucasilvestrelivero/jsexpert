const { describe, it, before, beforeEach, afterEach } = require("mocha")
const CarService = require("./../../src/services/carService")
const { join } = require("path")
const { expect } = require("chai")
const sinon = require("sinon")
const Transaction = require("../../src/entities/transaction")
const carsDatabasePath = join(__dirname, "./../../database", "cars.json")

const mocks = {
  validCarCategory: require("./../mocks/valid-carCategory.json"),
  validCar: require("./../mocks/valid-car.json"),
  validCustomer: require("./../mocks/valid-customer.json"),
}

describe("CarService Suite Test", () => {
  let carService
  let sandbox
  before(() => {
    carService = new CarService({ cars: carsDatabasePath })
  })
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })
  afterEach(() => {
    sandbox.restore()
  })
  it("should retrieve a random position from an array", async () => {
    const data = [0, 1, 2, 3, 4]
    const result = carService.getRandomPositionFromArray(data)

    expect(result).to.be.lte(data.length).and.be.gte(0)
  })
  it("should choose the first id from carIds in carCategory", async () => {
    const carCategory = mocks.validCarCategory
    const carIdIndex = 0

    sinon.stub(
      carService,
      carService.getRandomPositionFromArray.name
    ).returns(carIdIndex)

    const result = carService.chooseRandomCar(carCategory)
    const expected = carCategory.carIds[carIdIndex]
    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok 
    expect(result).to.be.equal(expected)
  })
  it("Given a carCategory it should return an available car", async () => {
    const car = mocks.validCar
    const carCategory = Object.create(mocks.validCarCategory)
    carCategory.carIds = [car.id]

    sandbox.stub(carService.carRepository, carService.carRepository.find.name).resolves(car)
    sandbox.spy(carService, carService.chooseRandomCar.name)

    const result = await carService.getAvailableCar(carCategory)
    const expected = car
    expect(carService.chooseRandomCar.calledOnce).to.be.ok
    expect(carService.carRepository.find.calledOnce).to.be.ok
    expect(result).to.be.deep.equal(expected)
  })
  it("given a carCategory, customer and numberOfDays it should calculate final in real", async () => {
    const customer = Object.create(mocks.validCustomer)
    customer.age = 50

    sandbox.stub(carService, "taxesBasedOnAge").get(() => [{ from: 40, to: 50, then: 1.3}])

    const carCategory = Object.create(mocks.validCarCategory)
    carCategory.price = 37.6
    const numberOfDays = 5
    const expected = carService.currencyFormat.format(244.40)
    const result = carService.calculateFinalPrice(customer, carCategory, numberOfDays)
    expect(result).to.be.deep.equal(expected)
  })
  it("given a customer and a car category it should return a transaction receipt", async () => {
    const car = mocks.validCar
    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id]
    }
    const customer = Object.create(mocks.validCustomer)
    customer.age = 20

    const numberOfDays = 5
    const dueDate = "10 de novembro de 2020"
    const initialDate = new Date(2020, 10, 5)
    sandbox.useFakeTimers(initialDate.getTime())
    sandbox.stub(carService.carRepository, carService.carRepository.find.name).resolves(car)

    const expectedPrice = carService.currencyFormat.format(206.8)
    const result = await carService.rent(customer, carCategory, numberOfDays)
    const expected = new Transaction({ customer, car, dueDate, amount: expectedPrice})
    expect(result).to.be.deep.equal(expected)
  })
})