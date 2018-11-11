function isFlatMap(images) {
  return ('px_24x24' in images || 'px_512x512' in images)
}

function getHeightWidthKey(height, width) {
  return `px_${height}x${width}`
}

class ImageSet {
  constructor(images) {
    if (!images || typeof images !== 'object') {
      this.images = {}
    } else if (isFlatMap(images)) {
      this.images = images
    } else {
      this.images = {}
    }
  }

  get(height, width) {
    return this.images[getHeightWidthKey(height, width)] || ''
  }

  getSquare(size) {
    return this.images[getHeightWidthKey(size, size)] || ''
  }
}

export default function setterForImageSet(newValue) {
  return new ImageSet(newValue)
}
