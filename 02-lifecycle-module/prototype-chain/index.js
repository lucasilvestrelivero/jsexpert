const assert = require("assert")
const obj = {}
const arr = []
const fn = () => {}

// internamente, objetos literais viram funções explicitas
console.log("new Object() is {}", new Object().__proto__ === {}.__proto__)
assert.deepStrictEqual(new Object().__proto__, {}.__proto__)

// __proto__ é a referencia do objeto que possui as propriedades nele
console.log("obj.__proto__ === Object.prototype", obj.__proto__ === Object.prototype)
assert.deepStrictEqual(obj.__proto__, Object.prototype)

console.log("arr.__proto__ === Array.prototype", arr.__proto__ === Array.prototype)
assert.deepStrictEqual(arr.__proto__, Array.prototype)

console.log("fn.__proto__ === Function.prototype", fn.__proto__ === Function.prototype)
assert.deepStrictEqual(fn.__proto__, Function.prototype)

function Employee() {}
Employee.prototype.salary = () => "Salary"

function Supervisor() {}
// Extends Employee
Supervisor.prototype = Object.create(Employee.prototype)
Supervisor.prototype.profitShare = () => "Profit Share"

function Manager() {}
Manager.prototype = Object.create(Supervisor.prototype)
Manager.prototype.monthlyBonuses = () => "Monthly Bonuses"

// Podemos chamar via prototype, mas se tentar chamar direto da erro
console.log("Manager.prototype.salary()", Manager.prototype.salary())
// console.log("Manager.prototype.salary()", Manager.salary())

/** Se não chamar o "new", o primeiro __proto__ vai ser sempre
*   a instancia de Function, sem herdar nossas classes.
*/
// Para acessar as classes sem o new, pode acessar direto via prototype
console.log("Manager.prototype.__proto__ === Supervisor.prototype", Manager.prototype.__proto__ === Supervisor.prototype)
assert.deepStrictEqual(Manager.prototype.__proto__, Supervisor.prototype)

console.log("new Manager().__proto__: %s, new Manager().salary(): %s", new Manager().__proto__, new Manager().salary())
console.log("Supervisor.prototype === new Manager().__proto__.__proto__", Supervisor.prototype === new Manager().__proto__.__proto__)
assert.deepStrictEqual(Supervisor.prototype, new Manager().__proto__.__proto__)


const manager = new Manager()
console.log("manager.salary()", manager.salary())
console.log("manager.profitShare()", manager.profitShare())
console.log("manager.monthlyBonuses()", manager.monthlyBonuses())

assert.deepStrictEqual(manager.__proto__, Manager.prototype)
assert.deepStrictEqual(manager.__proto__.__proto__, Supervisor.prototype)
assert.deepStrictEqual(manager.__proto__.__proto__.__proto__, Employee.prototype)
assert.deepStrictEqual(manager.__proto__.__proto__.__proto__.__proto__, Object.prototype)
assert.deepStrictEqual(manager.__proto__.__proto__.__proto__.__proto__.__proto__, null)


class T1 {
  ping() { return "ping" }
}

class T2 extends T1 {
  pong() { return "pong" }
}

class T3 extends T2 {
  shoot() { return "shoot" }
}

const t3 = new T3()
console.log("t3 inherits null ?", t3.__proto__.__proto__.__proto__.__proto__.__proto__ === null)
console.log("t3.ping()", t3.ping())
console.log("t3.pong()", t3.pong())
console.log("t3.shoot()", t3.shoot())

assert.deepStrictEqual(t3.__proto__, T3.prototype)
assert.deepStrictEqual(t3.__proto__.__proto__, T2.prototype)
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__, T1.prototype)
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__.__proto__, Object.prototype)
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__.__proto__.__proto__, null)