const { deepStrictEqual } = require("assert")

let counter = 0
let counter2 = counter

counter2++
deepStrictEqual(counter, 0)
deepStrictEqual(counter2, 1)

const item = { counter: 0 }
const item2 = item

item2.counter++
deepStrictEqual(item, { counter: 1 })

item.counter++
deepStrictEqual(item2, { counter: 2 })