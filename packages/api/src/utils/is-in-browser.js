export function isInBrowser() {
  try {
    return (Boolean(window) === true && typeof window !== 'undefined')
  } catch (e) {
    return false
  }
}
