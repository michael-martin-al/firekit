import React from 'react'
import { makeModel as baseMakeModel } from '@firekit/api'
import { firestoreClient as firestore } from '@firekit/api'
import { useModel as baseUseModel, useModelCollection as baseUseModelCollection } from '@firekit/api'

export function makeClientModel({
  name,
  schema,
  collectionPath
}) {
  const docPath = (id) => `${collectionPath}/${id}`

  function makeModel({ id, data }) {
    return baseMakeModel({
      name,
      id,
      data,
      schema
    })
  }

  function loadModel(id) {
    return firestore.load({
      Model: makeModel,
      docPath: docPath(id)
    })
  }

  function loadCollection() {
    return firestore.loadCollection({
      Model: makeModel,
      collectionPath
    })
  }

  async function createModel(model) {
    return firestore.create({
      collectionPath,
      model
    })
  }

  async function saveModel(model) {
    return firestore.update({
      docPath: docPath(model.$id),
      model
    })
  }

  async function deleteModel(model) {
    return firestore.del({
      docPath: docPath(model.$id)
    })
  }

  function useModel(id, queryConfig = {}) {
    return baseUseModel({
      loadModel: React.useCallback(id ? loadModel(id) : null, [id]),
      updateModel: (model, property, value) => {
        return model.$update(property, value)
      },
      deleteModel,
      saveModel,
      queryConfig
    })
  }

  useModel.states = baseUseModel.states
  const collectionLoader = loadCollection()
  function useModelCollection(queryConfig = {}) {
    return baseUseModelCollection({
      loadCollection: collectionLoader,
      collectionKey: collectionLoader.key,
      queryConfig
    })
  }

  return {
    makeModel,
    loadModel,
    loadCollection,
    createModel,
    updateModel: saveModel,
    deleteModel,
    useModel,
    useModelCollection
  }
}