const {encode, maxNum} = require('./base64')

// return string in reverse order to increase variability of first symbols
function reverse (str) {
  return str.split('').reverse().join('')
}

function createCounter (counterLen) {
  let maxCounter = maxNum(counterLen)
  let counter
  let counterStartSecond

  function updateCounter (seconds, time) {
    if (counterStartSecond === seconds) {
      counter += 1
      if (counter > maxCounter) {
        counter = 0
      }
    } else {
      counter = time % maxCounter
      counterStartSecond = seconds
    }
    return counter
  }

  function encodeCounter (counter) {
    return reverse(encode(counter, counterLen))
  }

  return {
    updateCounter,
    encodeCounter
  }
}

module.exports = createCounter
