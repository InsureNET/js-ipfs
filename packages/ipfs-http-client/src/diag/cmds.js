'use strict'
const configure = require('../lib/configure')

module.exports = configure(api => {
  return async (options = {}) => {
    const res = await api.post('diag/cmds', {
      timeout: options.timeout,
      signal: options.signal,
      searchParams: options
    })

    return res.json()
  }
})
