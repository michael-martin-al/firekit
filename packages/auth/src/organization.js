import { FirekitModel, setters } from '@firekit/base'

class Organization extends FirekitModel {
  constructor(json, organizationId = null) {
    super()
    this.name = json.name
    this.organizationId = organizationId
  }

  static async load(organizationId) {
    if (!organizationId || organizationId === '') throw new Error('Argument `organizationId` is required for Organization')
    const data = await FirekitModel.load(`/organizations/${organizationId}`)
    if (data === null) return null
    return new Organization(data, organizationId)
  }

  getDataObject() {
    return {
      name: this.name,
    }
  }

  collectionPath() {
    if (this.organizationId === '') throw new Error('Property `organizationId` is required for Organization')
    return '/organizations'
  }

  get id() {
    return this.organizationId
  }

  get name() {
    return this._name
  }

  set name(name) {
    this._name = setters.setString(name, 'name')
  }

  get organizationId() {
    return this._organizationId
  }

  set organizationId(organizationId) {
    this._organizationId = setters.setString(organizationId, 'organizationId')
  }
}

export default Organization
