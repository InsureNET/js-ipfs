'use strict'

const CID = require('cids')
const { DAGNode } = require('ipld-dag-pb')
const { Buffer } = require('buffer')
const toFormData = require('../lib/buffer-to-form-data')
const configure = require('../lib/configure')

module.exports = configure(api => {
  return async (obj, options = {}) => {
    let tmpObj = {
      Data: null,
      Links: []
    }

    if (Buffer.isBuffer(obj)) {
      if (!options.enc) {
        tmpObj = {
          Data: obj.toString(),
          Links: []
        }
      }
    } else if (DAGNode.isDAGNode(obj)) {
      tmpObj = {
        Data: obj.Data.toString(),
        Links: obj.Links.map(l => ({
          Name: l.Name,
          Hash: l.Hash.toString(),
          Size: l.Tsize
        }))
      }
    } else if (typeof obj === 'object') {
      tmpObj.Data = obj.Data.toString()
      tmpObj.Links = obj.Links
    } else {
      throw new Error('obj not recognized')
    }

    let buf
    if (Buffer.isBuffer(obj) && options.enc) {
      buf = obj
    } else {
      buf = Buffer.from(JSON.stringify(tmpObj))
    }

    const res = await api.post('object/put', {
      timeout: options.timeout,
      signal: options.signal,
      searchParams: options,
      body: toFormData(buf)
    })

    const { Hash } = await res.json()

    return new CID(Hash)
  }
})
