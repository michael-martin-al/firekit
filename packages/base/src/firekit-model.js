/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import firebase from 'firebase/app'
import 'firebase/firestore'

class FirekitModel {
  static async load(docPath, watchFunction = null) {
    try {
      const doc = await firebase.app().firestore().doc(docPath).get()

      if (typeof watchFunction === 'function') {
        return firebase.app().firestore().doc(docPath).onSnapshot((docSnapshot) => {
          watchFunction(docSnapshot.data() || {})
        })
      }

      if (doc.exists) {
        return doc.data()
      }

      console.error('Could not locate doc:', docPath)
    } catch (error) {
      console.error('Unable to load:', docPath, error)
    }
    return null
  }

  static async loadCollection(collectionPath, wheres = [], orderBy = null, limit = null, watchFunction = null) {
    try {
      let collectionQuery = firebase.app().firestore().collection(collectionPath)

      if (Array.isArray(wheres)) {
        wheres.forEach(([fieldPath, opStr, value]) => {
          collectionQuery = collectionQuery.where(fieldPath, opStr, value)
        })
      }

      if (orderBy !== null && typeof orderBy === 'object' && 'fieldPath' in orderBy) {
        const { fieldPath, directionStr = 'asc' } = orderBy
        collectionQuery = collectionQuery.orderBy(fieldPath, directionStr)
      }

      if (typeof limit === 'number') {
        collectionQuery = collectionQuery.limit(limit)
      }

      if (typeof watchFunction === 'function') {
        return collectionQuery.onSnapshot((collectionSnapshot) => {
          watchFunction(collectionSnapshot.docChanges())
        })
      }

      const collectionSnapshot = await collectionQuery.get()
      return collectionSnapshot.docs
    } catch (error) {
      console.error('Unable to load collection:', collectionPath, error)
    }
    return null
  }

  static saveBatch(items, isAsync = true) {
    const batchLimit = 500
    const promises = []
    const batches = [ firebase.app().firestore().batch() ]
    let batchIndex = 0
    let batchCount = 0

    const currentBatch = () => { return batches[batchIndex] }

    const closeBatch = (isFinal = false) => {
      if (batchCount > 0) {
        if (isAsync) {
          promises.push(currentBatch().commit())
        }

        if (!isFinal) {
          batchCount = 0
          batches.push(firebase.app().firestore().batch())
          batchIndex += 1
        }
      }
    }

    items.forEach((item) => {
      if ('save' in item && typeof item.save === 'function') {
        batchCount += 1
        item.save(currentBatch())
      }

      if (batchCount >= batchLimit) {
        closeBatch()
      }
    })

    closeBatch(true)

    if (isAsync) {
      return Promise.all(promises)
    } else {
      return new Promise((resolve, reject) => {
        async function processBatches() {
          /* eslint-disable no-await-in-loop */
          while (batches.length > 0) {
            const batch = batches.pop()
            console.log(`firestore: Processing batch. ${batches.length} remaining.`)
            try {
              await batch.commit()
            } catch (e) {
              reject(e)
            }
          }
          console.log('firestore: All batches complete.')
          resolve()
        }
        console.log(`firestore: Processing ${batches.length} total batches...`)
        processBatches()
      })
    }
  }

  collectionPath() {
    throw new Error('Method collectionPath() required for FirekitModel')
  }

  toObject() {
    throw new Error('Method toObject() required for FirekitModel')
  }

  firestoreRef() {
    return firebase.app().firestore().doc(`${this.collectionPath()}/${this.id}`)
  }

  save(batch = null) {
    try {
      if (this.id) {
        if (batch) {
          return batch.set(this.firestoreRef(), this.toObject())
        }
        return this.firestoreRef().set(this.toObject())
      }
      return firebase.app().firestore().collection(this.collectionPath()).add(this.toObject())
    } catch (e) {
      console.error(e)
      return e
    }
  }

  delete() {
    try {
      return this.firestoreRef().delete()
    } catch (e) {
      console.error(`Error deleting document: ${e.toString()}`)
    }
  }
}

export default FirekitModel
