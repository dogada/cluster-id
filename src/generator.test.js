/* global test, expect */
const gen = require('./generator')

const YEAR_MS = parseInt(365.26 * 24 * 60 * 60 * 1000)
const validId = /([\w-]{13}|[\w-]{26})/
// TODO: expect.extend

test('return function to generate ids', () => {
  let id = gen()
  expect(typeof id).toBe('function')
  expect(id.name).toBe('id')
})

test('return valid base64 id for default params', () => {
  let id = gen()
  expect(id()).toMatch(validId)
})

test('accept valid epoch', () => {
  expect(gen({epoch: 0})()).toMatch(validId)
  expect(gen({epoch: new Date(2000).getTime()})()).toMatch(validId)
  expect(gen({epoch: Date.now() - 1})()).toMatch(validId)
})

test('throw an error for invalid epoch', () => {
  expect(() => gen({epoch: -1})()).toThrow('Invalid epoch -1')
  expect(() => gen({epoch: Date.now() + 1000})()).toThrow('Invalid epoch')
  expect(() => gen({epoch: '123'})()).toThrow('Invalid epoch')
})

test('reserve for instance 2..4 symbols', () => {
  expect(gen({instanceLen: 2})()).toMatch(validId)
  expect(gen({instanceLen: 4})()).toMatch(validId)
  expect(() => gen({instanceLen: 1})()).toThrow('Invalid instance')
  expect(() => gen({instanceLen: 5})()).toThrow('Invalid instance')
})

test('accept segment in range 0..63', () => {
  expect(gen()({segment: 0})).toMatch(/^-/)
  expect(gen()({segment: 1})).toMatch(/^0/)
  expect(gen()({segment: 20})).toMatch(/^J/)
  expect(gen()({segment: 40})).toMatch(/^c/)
  expect(gen()({segment: 63})).toMatch(/^z/)
})

test('reject invalid segments out of range 0..63', () => {
  expect(() => gen()({segment: -1})).toThrow('Invalid segment: -1')
  expect(() => gen()({segment: 64})).toThrow('Invalid segment: 64')
  expect(() => gen()({segment: 'str'})).toThrow('Invalid segment: str')
})

test('accept time > epoch', () => {
  expect(gen()({time: Date.now()})).toMatch(validId)
  expect(gen({epoch: Date.now() - 1})({time: Date.now()})).toMatch(validId)
  expect(gen({epoch: 0})({time: 10})).toBe('-9-----------')
  expect(gen({epoch: 0})({time: 1 * YEAR_MS})).toBe('-O_z0---0sNh-')
  expect(gen({epoch: 0})({time: 100 * YEAR_MS})).toBe('-6QL6--1w5aJ-')
})

test('fail if time is 2500 years ahead', () => {
  expect(() => gen()({time: 2500 * YEAR_MS})).toThrow('Too far away')
})

test('fail with time <= epoch', () => {
  expect(() => gen()({time: 0})).toThrow()
})

test('accept root id as scope', () => {
  let id = gen({epoch: 0})({
    scope: '-YfCY--0T2I9-',
    time: 51 * YEAR_MS
  })
  expect(id).toMatch(validId)
  expect(id).toMatch('-YfCY--0T2I9--0Uvfr-wme_--')
})

test('accept scoped id as scope', () => {
  let id = gen({epoch: 0})({
    scope: '-YfCY--0T2I9--0Uvfr-_emw--',
    time: 70 * YEAR_MS
  })
  expect(id).toMatch(validId)
  expect(id).toMatch('-_emw--0Uvfr--12f0D-NtXA--')
})

test('use scope segment from provided scope by default', () => {
  let id = gen({epoch: 0})({
    scope: '-YfCY--0T2I9-S0Uvfr-_emw--', // S is segment
    time: 70 * YEAR_MS
  })
  expect(id).toMatch(validId)
  expect(id).toMatch('S_emw--0Uvfr-S12f0D-NtXA--')
})

test('use custom segment', () => {
  let id = gen({epoch: 0})({
    segment: 10,
    time: 15 * YEAR_MS
  })
  expect(id).toMatch(validId)
  expect(id).toMatch('9rktS---RCmY-')
})

test('use custom segment in child part with root id', () => {
  let id = gen({epoch: 0})({
    segment: 3,
    scope: '9Stkr---RCmY-', // 9 is segment
    time: 15 * YEAR_MS
  })
  expect(id).toMatch('9Stkr---RCmY-2-RCmY-rktS--')
})

test('use custom segment in child part with scoped id', () => {
  let id = gen({epoch: 0})({
    segment: 63, // z
    scope: '9Stkr---RCmY-2-RCmY-Stkr--', // 2 is segment
    time: 15 * YEAR_MS
  })
  expect(id).toMatch('2Stkr---RCmY-z-RCmY-rktS--')
})

test('swap use custom segment in child part with scoped id', () => {
  let id = gen({epoch: 0})({
    segment: 63, // z
    scope: '9Stkr---RCmY-2-RCmY-Stkr--', // 2 is segment
    time: 15 * YEAR_MS
  })
  expect(id).toMatch('2Stkr---RCmY-z-RCmY-rktS--')
})

test('change first symbol of counter on each step for better cardinality', () => {
  let id = gen()
  expect(id({time: YEAR_MS})).toBe('-O_z0---0sNh-')
  expect(id({time: YEAR_MS + 1})).toBe('-P_z0---0sNh-')
  expect(id({time: YEAR_MS + 2})).toBe('-Q_z0---0sNh-')
})
