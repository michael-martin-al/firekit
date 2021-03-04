/**
 * Firestore Client
 * Communicate with a Firestore backend. Send and receive data as Models.
 */

import firebase from 'firebase/app'
import 'firebase/firestore'

/**
 *
 * @param {*} param0
 * @param {Function} param0.Model
 * @param {String} param0.docPath
 */
export function load({ Model, docPath } = {}) {
  async function loader() {
    const doc = await firebase.app().firestore().doc(docPath).get()
    if (doc.exists) {
      return Model({
        id: doc.id,
        data: doc.data(),
      })
    }
    return null
  }
  loader.key = [docPath]
  return loader
}

/**
 * Load a collection of Firestore document and
 * return them as an array of Model objects
 *
 * @param {Object} config
 * @param {Function} config.Model
 * @param {String} config.collectionPath
 * @param {Array} config.where
 * @param {Object} config.order
 * @param {String} config.order.field
 * @param {String} config.order.direction
 * @param {Number} config.limit
 *
 * @returns {Array[Model]}
 */
export function loadCollection({
  Model,
  collectionPath,
  where = [],
  order = [],
  limit = 0,
} = {}) {
  async function loader() {
    const docs = []
    let query = firebase.app().firestore().collection(collectionPath)

    if (Array.isArray(where)) {
      where.forEach(({ field, operator, value }) => {
        /* eslint-disable no-console */
        if (typeof value === 'undefined') {
          console.debug(
            `Called 'where' without a value. FIELD: ${field} COLLECTION PATH: ${collectionPath} OPERATOR: ${operator}`,
          )
        } else if (typeof operator === 'undefined') {
          console.debug(
            `Called 'where' without an operator. FIELD: ${field} COLLECTION PATH: ${collectionPath} VALUE: ${value}`,
          )
        } else if (typeof field === 'undefined') {
          console.debug(
            `Called 'where' without a field. COLLECTION PATH: ${collectionPath} VALUE: ${value} OPERATOR: ${operator}`,
          )
        } else {
          query = query.where(field, operator, value)
        }
      })
    }

    if (Array.isArray(order)) {
      order.forEach(({ field, direction = 'asc' }) => {
        if (field) {
          query = query.orderBy(field, direction)
        }
      })
    }

    if (order !== null && typeof order === 'object' && 'field' in order) {
      const { field, direction = 'asc' } = order
      query = query.orderBy(field, direction)
    }

    if (typeof limit === 'number' && limit > 0) {
      query = query.limit(limit)
    }

    const collection = await query.get()

    collection.forEach((doc) => {
      try {
        const model = Model({
          id: doc.id,
          data: doc.data(),
        })
        docs.push(model)
      } catch (e) {
        throw new Error(
          `Couldn't create a model using the Firestore document at: ${collectionPath}/${doc.id}.`,
        )
      }
    })

    return docs
  }
  loader.key = [collectionPath, where, order, limit]
  return loader
}

/**
 * Create a new Firestore document using
 * data from the Model instance
 *
 * @param {String} collectionPath
 * @param {Model} model
 *
 * @returns {Promise}
 */
export async function create({ collectionPath, model }) {
  if (!model.$valid)
    throw new Error(`${model.$name} not valid. ${model.$error}`)
  return firebase
    .app()
    .firestore()
    .collection(collectionPath)
    .add(model.$object)
}

/**
 * Update an existing Firestore document using
 * data from the Model instance
 *
 * @param {String} docPath
 * @param {Model} model
 *
 * @returns {Promise}
 */
export async function update({ docPath, model }) {
  if (!model.$valid)
    throw new Error(`${model.$name} not valid. ${model.$error}`)
  return firebase.app().firestore().doc(docPath).update(model.$object)
}

/**
 * Delete an existing Firestore document
 * at the specified path
 *
 * @param {String} docPath
 */
export async function del({ docPath }) {
  return firebase.app().firestore().doc(docPath).delete()
}
