/* global test, expect */
const {encode, decode, BASE} = require('./base64')

test('numbers in range 0..63 to base64 string of length 1', () => {
  expect(encode(0)).toBe('-')
  expect(encode(63)).toBe('z')
  for (let num = 0; num < BASE; num++) {
    expect(encode(num)).toMatch(/^[\w-]$/)
  }
})

test('ensure base64 symbols are in char ascending order', () => {
  for (let num = 0, prev; num < BASE; num++) {
    let symbol = encode(num)
    if (prev) expect(symbol > prev).toBe(true)
    prev = symbol
  }
})

test('encode and decode zero', () => {
  expect(encode(0)).toBe('-')
  expect(decode('-')).toBe(0)
})

test('encode and decode 1000', () => {
  expect(encode(1000)).toBe('Ec')
  expect(decode('Ec')).toBe(1000)
})

test('encode and decode Number.MAX_SAFE_INTEGER', () => {
  expect(encode(Number.MAX_SAFE_INTEGER)).toBe('Uzzzzzzzz')
  expect(decode('Uzzzzzzzz')).toBe(Number.MAX_SAFE_INTEGER)
})

test('encode to and decode Fibonacci numbers', () => {
  let a = 1
  let b = 1
  while (b < Number.MAX_SAFE_INTEGER) {
    expect(decode(encode(b))).toBe(b)
    let temp = a + b
    a = b
    b = temp
  }
})
