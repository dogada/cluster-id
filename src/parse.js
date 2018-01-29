const {SEGMENT_LEN, META_LEN, TIME_LEN} = require('./config')
// len of segment in symbols (scope or child)
const HALF_LEN = SEGMENT_LEN + META_LEN + TIME_LEN
const FULL_LEN = 2 * HALF_LEN

/**
 * Return scope id for give id. For root ids scope is id itself.
 * @param {string} idStr a scopeid instance
 */
function parseScope (idStr) {
  if (idStr.length === HALF_LEN) {
    // root id
    return idStr
  } else if (idStr.length === FULL_LEN) {
    // scoped id, convert it to normal form and return
    let scopedStr = idStr.slice(HALF_LEN)
    let segmentStr = scopedStr.slice(0, SEGMENT_LEN)
    let timeStr = scopedStr.slice(SEGMENT_LEN, SEGMENT_LEN + TIME_LEN)
    let metaStr = scopedStr.slice(-META_LEN)
    return segmentStr + metaStr + timeStr
  } else {
    throw new Error(`Invalid id length: ${idStr}`)
  }
}

module.exports = {
  parseScope
}
