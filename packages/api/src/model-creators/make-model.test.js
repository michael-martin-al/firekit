import { makeModel } from './make-model'

const modelData = {
  name: 'Michael',
  age: 99,
}

describe('Testing model', () => {
  const person = makeModel({ name: 'Person', data: modelData })

  it('properties can be read', () => {
    expect(person.name.$value).toBe('Michael')
    expect(person.name.$valid).toBe(true)
    expect(person.name.$error).toBe(undefined)
  })

  it('properties values cannot be changed', () => {
    expect(() => {
      person.name = 'Mike'
    }).toThrow()
  })

  it('undefined properties should throw an error', () => {
    expect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const nope = person.phone
    }).toThrow()
  })

  it('modelData cannot be a string', () => {
    expect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const nope = makeModel({ name: 'Person', data: 'modelData' })
    }).toThrow()
  })

  it('modelData cannot be a number', () => {
    expect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const nope = makeModel('Person', 1)
    }).toThrow()
  })

  it('modelData cannot be a boolean', () => {
    expect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const nope = makeModel('Person', true)
    }).toThrow()
  })

  it('modelData cannot be an array', () => {
    expect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const nope = makeModel({ name: 'Person', data: [] })
    }).toThrow()
  })

  it('modelData cannot be an empty object', () => {
    expect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const nope = makeModel({ name: 'Person', data: {} })
    }).toThrow()
  })

  it('modelName cannot be a number', () => {
    expect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const nope = makeModel({ name: 1, data: modelData })
    }).toThrow()
  })

  it('modelName cannot be an object', () => {
    expect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const nope = makeModel({ name: {}, data: modelData })
    }).toThrow()
  })

  it('modelName cannot be an array', () => {
    expect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const nope = makeModel({ name: [], data: modelData })
    }).toThrow()
  })

  it('modelName cannot be an empty string', () => {
    expect(() => {
      /* eslint-disable-next-line no-unused-vars */
      const nope = makeModel({ name: '', data: modelData })
    }).toThrow()
  })

  it('cannot delete model properties', () => {
    expect(() => {
      delete person.name
    }).toThrow()
  })

  it('cannot define new properties', () => {
    expect(() => {
      Object.defineProperty(person, 'phone', {})
    }).toThrow()
  })
})
