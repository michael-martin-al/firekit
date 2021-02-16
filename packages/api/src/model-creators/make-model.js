export function makeModel({ name, id, data, schema }) {
  if (Array.isArray(data))
    throw new Error(`${name} model data cannot be an array.`)
  if (typeof data !== 'object')
    throw new Error(`${name} model data must be an object.`)
  if (Object.keys(data).length === 0)
    throw new Error(`${name} model data cannot be an empty object`)
  if (typeof name !== 'string') throw new Error('Model name must be a string.')
  if (name === '') throw new Error('Model name cannot be an empty string.')

  const propNameBlacklist = [
    '$$typeof',
    Symbol.iterator,
    Symbol.toStringTag,
    'length',
    'then',
    '$id',
    'id',
    '$update',
    '$clone',
    '$valid',
    '$error',
    '$object',
    '$name',
  ]

  const invalidPropNames = Object.keys(data).filter((key) => {
    return propNameBlacklist.indexOf(key) > -1
  })

  if (invalidPropNames.length > 0) {
    throw new Error(
      `Invalid prop names in model data: ${invalidPropNames.join(', ')}`,
    )
  }

  let proxyTarget = { ...data }
  const touched = {}

  if (schema) {
    try {
      proxyTarget = schema.cast(proxyTarget)
    } catch (e) {
      // discard error
    }
  }

  function throwReadOnly(messsage = '') {
    throw new Error(`${name} properties are read-only. ${messsage}`)
  }

  function buildProxy(target) {
    const validationErrors = {}
    let modelIsValid = true
    let modelValidationError

    if (schema) {
      try {
        schema.validateSync(proxyTarget, { abortEarly: false })
      } catch (validationError) {
        modelIsValid = false
        modelValidationError = validationError.errors
        validationError.inner.forEach(({ path, message }) => {
          validationErrors[path] = message
        })
      }
    }

    return new Proxy(target, {
      /* eslint-disable object-shorthand */
      get: function get(getTarget, property) {
        // reserved property names
        if (property === '$$typeof') return name
        if (property === Symbol.iterator) return undefined
        if (property === Symbol.toStringTag) return undefined
        if (property === 'length') return undefined
        if (property === 'then') return undefined

        // speical $ methods for model api
        if (property === '$id') return id
        if (property === 'id') return id

        /* eslint-disable-next-line no-use-before-define */
        if (property === '$update') return update

        /* eslint-disable-next-line no-use-before-define */
        if (property === '$clone') return clone

        if (property === '$valid') return modelIsValid
        if (property === '$error') return modelValidationError
        if (property === '$object') return { ...proxyTarget }
        if (property === '$name') return name

        // Let some things pass through
        if (property === 'toJSON') return getTarget.toJSON
        if (property === 'valueOf') return getTarget.valueOf

        // invalid property access attempt
        if (!(property in target)) {
          if (typeof property === 'string') {
            throw new Error(
              `Property "${property}" does not exist for "${name}" model.`,
            )
          } else {
            // TODO: what do we do with Symbol properties?
            throw new Error(
              `Property [${typeof property}] does not exist for ${name} model.`,
            )
          }
        }

        // return property with special $ methods
        return {
          $value: target[property],
          $error: validationErrors[property],
          $valid: !validationErrors[property],
          $touched: touched[property],
        }
      },

      set: function set(setTarget, property) {
        throwReadOnly(`Cannot set "${property}" property.`)
      },

      deleteProperty: function deleteProperty(deleteTarget, property) {
        throwReadOnly(`Cannot delete "${property} property.`)
      },

      defineProperty: function defineProperty() {
        throwReadOnly()
      },

      isExtensible: function isExtensible() {
        return false
      },

      preventExtensions: function preventExtensions() {
        return true
      },
    })
  }

  function update(property, value) {
    if (!(property in proxyTarget))
      throw new Error(
        `Property "${property}" does not exist for "${name}" model.`,
      )
    proxyTarget = {
      ...proxyTarget,
      [property]: value,
    }

    if (schema) {
      try {
        proxyTarget = schema.cast(proxyTarget)
      } catch (e) {
        // discard error
      }
    }

    touched[property] = true

    return buildProxy(proxyTarget)
  }

  function clone() {
    return buildProxy(proxyTarget)
  }

  return buildProxy(proxyTarget)
}
