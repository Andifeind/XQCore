XQCore = require './xqcore-core'
Logger = require './xqcore-logger'

log = null

HTMLElements =
  RootElement: require './elements/root.js'
  InputElement: require './elements/input.js'

class View
  constructor: (tag) ->
    log = new Logger tag + 'View'

module.exports = View
