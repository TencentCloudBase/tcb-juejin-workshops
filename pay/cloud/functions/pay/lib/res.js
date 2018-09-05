const Res = function ({ code = "SUCCESS", message = '', data = null }) {
    this.code = code
    this.message = message
    this.data = data
  }
  
  module.exports = Res
  