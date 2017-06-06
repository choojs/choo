class liveClock extends window.HTMLElement {
  createdCallback () {
    this.interval = setInterval(() => {
      this.innerHTML = this.getTime()
    }, 1000)
  }

  attributeChangedCallback (attr, previous, current) {
    if (attr === 'data-twelve') {
      this.twelve = JSON.parse(current)
      this.innerHTML = this.getTime()
    }
  }

  getTime () {
    const time = new Date()
    const hours = time.getHours()
    const isAM = this.twelve && hours < 13
    const isPM = this.twelve && hours > 12

    return `
      ${isPM ? hours - 12 : hours} :
      ${('0' + time.getMinutes()).slice(-2)} :
      ${('0' + time.getSeconds()).slice(-2)}
      ${isAM ? 'AM' : ''}
      ${isPM ? 'PM' : ''}
    `
  }
}

module.exports = liveClock
