/* global test, expect */
const createCounter = require('./counter')
const {BASE, encode} = require('./base64')

test('return unchanged single symbol counter', () => {
  let {encodeCounter} = createCounter(1)
  expect(encode(10, 1)).toBe('9')
  expect(encodeCounter(10)).toBe('9')
})

test('swap symbols in 2 symbols counter', () => {
  let {encodeCounter} = createCounter(2)
  expect(encode(BASE - 1, 2)).toBe('-z')
  expect(encodeCounter(BASE - 1)).toBe('z-')
  expect(encode(BASE ** 2 - 2, 2)).toBe('zy')
  expect(encodeCounter(BASE ** 2 - 2)).toBe('yz')
})

test('swap symbols in 3 symbols counter', () => {
  let {encodeCounter} = createCounter(3)
  expect(encode(BASE - 1, 3)).toBe('--z')
  expect(encodeCounter(BASE - 1, 3)).toBe('z--')
  expect(encode(BASE ** 2 - 2, 3)).toBe('-zy')
  expect(encodeCounter(BASE ** 2 - 2)).toBe('yz-')
  expect(encode(BASE ** 2 + 3, 3)).toBe('0-2')
  expect(encodeCounter(BASE ** 2 + 3)).toBe('2-0')
})

test('swap symbols in 4 symbols counter', () => {
  let {encodeCounter} = createCounter(4)
  expect(encode(BASE - 1, 4)).toBe('---z')
  expect(encodeCounter(BASE - 1)).toBe('z---')
  expect(encode(BASE + 3, 4)).toBe('--02')
  expect(encodeCounter(BASE + 3)).toBe('20--')
  expect(encode(BASE ** 2 + 3, 4)).toBe('-0-2')
  expect(encodeCounter(BASE ** 2 + 3)).toBe('2-0-')
  expect(encode(556789, 4)).toBe('16vp')
  expect(encodeCounter(556789)).toBe('pv61')
})
