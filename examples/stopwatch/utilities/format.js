function formatMinutes (minutes) {
  return `${minutes >= 10 ? minutes : (minutes < 10) ? '0' + minutes : '00'}`
}

function formatSeconds (seconds) {
  return `${seconds < 10 ? '0' + seconds : seconds}`
}

module.exports = function format (elapsed) {
  var minutes = formatMinutes(Math.floor((elapsed / 1000) / 60))
  var seconds = formatSeconds(Math.floor((elapsed / 1000) % 60))
  var ms = formatSeconds(Math.floor((elapsed % 1000) / 10))

  return `${minutes}:${seconds}.${ms}`
}
