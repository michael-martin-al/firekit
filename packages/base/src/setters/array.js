/* eslint-disable no-console */
export default function setterForArrays(newValue, name) {
  const isArray = Array.isArray(newValue)
  if (!isArray) {
    // console.warn(`Property ${name} should be an array.`)
  }
  return isArray ? newValue : []
}
