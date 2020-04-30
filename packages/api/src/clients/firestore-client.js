/**
 * Firestore Client
 * Communicate with a Firestore backend. Send and receive data as Models.
 */

import firebase from 'firebase/app'
import 'firebase/firestore'

/**
 * Initialize Firebase
 * A wrapper for `firebase.initializeApp`
 * 
 * @param {Object} config 
 */
export function init(config) {
  return firebase.initializeApp(firebaseConfig)
}

/**
 * 
 * @param {*} param0 
 * @param {Function} param0.Model
 * @param {String} param0.docPath
 */
export function load({ Model, docPath }) {
  async function load() {
    const doc = await firebase.app().firestore().doc(docPath).get()
    if (doc.exists) {
      return Model({
        id: doc.id,
        data: doc.data(),
      })
    } else {
      return null
    }
  }
  load.key = [docPath]
  return load
}

/**
 * Load a collection of Firestore document and
 * return them as an array of Model objects
 * 
 * @param {Function} Model 
 * @param {String} collectionPath 
 * 
 * @returns {Array[Model]}
 */
export function loadCollection({ Model, collectionPath }) {
  async function loadCollection() {
    let docs = []
    let collection

    try {
      collection = await firebase.app().firestore().collection(collectionPath).get()
    } catch (e) {
      throw new Error(`Failed to load collection from Firestore at ${collectionPath}`)
    }

    collection.forEach((doc) => {
      try {
        const model = Model({
          id: doc.id,
          data: doc.data(),
        })
        docs.push(model)
      } catch (e) {
        throw new Error(`Couldn't create a model using the Firestore document at: ${collectionPath}/${doc.id}.`)
      }
    })

    return docs
  }
  loadCollection.key = [collectionPath]
  return loadCollection
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
  if (!model.$valid) throw new Error(`${model.$name} not valid. ${model.$error}`)
  return firebase.app().firestore().collection(collectionPath).add(model.$object)
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
  if (!model.$valid) throw new Error(`${model.$name} not valid. ${model.$error}`)
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