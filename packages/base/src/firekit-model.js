/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import firebase from 'firebase/app'
import 'firebase/firestore'

const firestoreSettings = {
  timestampsInSnapshots: true,
}
firebase.firestore().settings(firestoreSettings)

class FirekitModel {
  static async load(docPath) {
    try {
      const doc = await firebase.app().firestore().doc(docPath).get()
      if (doc.exists) {
        return doc.data()
      }
      console.error('Could not locate doc:', docPath)
    } catch (error) {
      console.error('Unable to load:', docPath, error)
    }
    return null
  }

  static async loadORCollection(collectionPath, wheres = [], orderBy = null, limit = null) {
    const whereLimit = Math.ceil(limit / wheres.length)

    const whereResults = await Promise.all(wheres.map(async (where) => {
      return FirekitModel.loadCollection(collectionPath, [ where ], orderBy, whereLimit)
    }))

    return [].concat(...whereResults)
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

  getDataObject() {
    throw new Error('Method geDataObject() required for FirekitModel')
  }

  getHash() {
    return ''
    // const data = this.getDataObject()
    // const values = Object.keys(data).map((prop) => {
    //   return data[prop]
    // })
    // values.sort()
    // return md5(values.join(''))
  }

  firestoreRef() {
    return firebase.app().firestore().doc(`${this.collectionPath()}/${this.id}`)
  }

  save(batch = null) {
    try {
      if (this.id) {
        if (batch) {
          return batch.set(this.firestoreRef(), this.getDataObject())
        }
        return this.firestoreRef().set(this.getDataObject())
      }
      return firebase.app().firestore().collection(this.collectionPath()).add(this.getDataObject())
    } catch (e) {
      console.error(e)
      return e
    }
  }
}

export default FirekitModel
