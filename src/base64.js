var BASE = 64
var SYMBOL_BITS = 6

/**
 * base64 in ASCII char code ascending order for correct records ordering in
 * the databases that use lexicographic ordering (LevelDB, RocksDB, CockroachDB).
 * This important feature allows to keep sorting by id identical to sorting by
 * record creation date encoded in id.
 * Note: standard base64 don't put symbols in lexicographic ordering.
 */
var ALPHABET = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz"
// separator between time and other parts of id

const ZERO = encode(0)

function encode(num, minLength) {
  // console.log('encode', num)
  var buf = []
  do {
    buf.push(ALPHABET[num % BASE])
    num = Math.floor(num / BASE)
    // console.log('num', num)
  } while (num > 0)
  // console.log('str', str)
  let encoded = buf.reverse().join("")
  if (minLength && encoded.length < minLength) {
    encoded = encoded.padStart(minLength, ZERO)
  }
  return encoded
}

function decode(base64Str) {
  let num = 0
  for (let lastI = base64Str.length - 1, i = lastI; i >= 0; i--) {
    let symbol = base64Str.charAt(i)
    let digit = ALPHABET.indexOf(symbol)
    num += digit * BASE ** (lastI - i)
  }
  return num
}

// maximal number for given symbol count
const maxNum = (symbols) => BASE ** symbols - 1

module.exports = {
  encode,
  decode,
  maxNum,
  BASE,
  SYMBOL_BITS,
}
