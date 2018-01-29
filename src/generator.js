/*
Generator of cluster friendly ids that can be converted
to 64-bit integers for compact storing in Redis structures.
*/

// TODO: make variable or padding encoding for both counter & sequence because no separator
// TODO: replace swap bits with 2^5 array length
// TODO: compare distribution of values (even without html5) shortid and CompactId
// make tests
// default start date for the id generator

const {encode, maxNum, BASE} = require('./base64')
const {parseScope} = require('./parse')
const createCounter = require('./counter')
const {SEGMENT_LEN, META_LEN, TIME_LEN} = require('./config')

const MIN_INSTANCE_LEN = 2
const MAX_INSTANCE_LEN = 4
const MIN_COUNTER_LEN = 2
const DEFAULT_EPOCH = 0 // 1970-01-01

function assert (condition, message) {
  if (!condition) throw new Error(message || 'Assert failed')
}

function getSegmentStr (segment, scopeIdStr) {
  if (typeof segment === 'number') {
    assert(segment >= 0 && segment < BASE, `Invalid segment: ${segment}`)
    return encode(segment, SEGMENT_LEN)
  } else if (scopeIdStr) {
    // use segment of scope
    return scopeIdStr.slice(0, SEGMENT_LEN)
  } else if (!segment) {
    return encode(0, SEGMENT_LEN)
  } else {
    throw new Error(`Invalid segment: ${segment}`)
  }
}

function _createGenerator (epoch, instance, instanceLen, counterLen) {
  let {updateCounter, encodeCounter} = createCounter(counterLen)

  return function id ({segment, scope, time} = {}) {
    let scopeIdStr = scope ? parseScope(scope) : null
    let segmentStr = getSegmentStr(segment, scopeIdStr)
    if (time === undefined) time = Date.now()
    assert(time > epoch, `Invalid time: ${time}`)
    let seconds = Math.floor((time - epoch) / 1000)
    let timeStr = encode(seconds, TIME_LEN)
    let counter = updateCounter(seconds, time)
    let metaStr = encodeCounter(counter) + encode(instance, instanceLen)
    assert(metaStr.length === META_LEN, `Invalid meta: ${counter}, ${instance}`)
    assert(timeStr.length === TIME_LEN, `Too far away: ${seconds}`)
    // console.log('time', timeStr, timeStr.length, TIME_LEN)
    if (scope) {
      // if we have scope use it for sharding and use time for sorting inside shard
      return scopeIdStr + segmentStr + timeStr + metaStr
      // console.log('parseScope', parseScope(scopeId), timeStr, metaStr)
    } else {
      return segmentStr + metaStr + timeStr
    }
  }
}

function generator ({
    epoch = DEFAULT_EPOCH,
    instance = 0,
    instanceLen = MIN_INSTANCE_LEN
    } = {}) {
  if (typeof epoch !== 'number' ||
      epoch < 0 || epoch > Date.now()) {
    throw new Error('Invalid epoch ' + epoch)
  }
  assert(instanceLen >= MIN_INSTANCE_LEN && instanceLen <= MAX_INSTANCE_LEN,
    `Invalid instance length: ${instanceLen}`)
  let maxInstance = maxNum(instanceLen)
  assert(instance >= 0 && instance <= maxInstance, `Invalid instance: ${instance}`)
  let counterLen = META_LEN - instanceLen
  if (counterLen < MIN_COUNTER_LEN) {
    throw new Error(`Invalid counter length: ${counterLen}`)
  }
  return _createGenerator(epoch, instance, instanceLen, counterLen)
}

module.exports = generator
