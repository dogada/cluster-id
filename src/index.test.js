/* global test, expect */
const {generator: gen} = require('./index')
const YEAR_MS = parseInt(365.26 * 24 * 60 * 60 * 1000)

test('export valid generator', () => {
  let id = gen()
  expect(typeof id).toBe('function')
  expect(id.name).toBe('id')
})

test('generate valid ids', () => {
  expect(gen({epoch: 0})({time: 1 * YEAR_MS})).toBe('-O_z0---0sNh-')
  expect(gen({epoch: 0})({time: 100 * YEAR_MS})).toBe('-6QL6--1w5aJ-')
})
