'use strict'

const toCamel = require('./lib/object-to-camel')
const configure = require('./lib/configure')

module.exports = configure(api => {
  return async (options = {}) => {
    const res = await (await api.post('version', {
      timeout: options.timeout,
      signal: options.signal,
      searchParams: options.searchParams
    })).json()

    return toCamel(res)
  }
})
