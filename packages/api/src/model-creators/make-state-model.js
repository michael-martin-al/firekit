/**
 * Given an array of strings, return an immutable proxy object
 *
 * @param {Array} states
 *
 * @returns {Object}
 */
export function makeStateModel(states) {
  if (!Array.isArray(states))
    throw new Error('States parameter must be an array.')

  const proxyTarget = {}

  states.forEach((state) => {
    proxyTarget[state] = null
  })

  return new Proxy(proxyTarget, {
    get: function get(target, property) {
      if (property === '$array') return states
      if (!(property in target)) throw new Error(`Invalid state ${property}`)
      return property
    },

    set: function set() {
      throw new Error(`States are read-only.`)
    },

    delete: function deleteProperty() {
      throw new Error(`States are read-only.`)
    },
  })
}
