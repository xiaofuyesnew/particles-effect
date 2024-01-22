import * as THREE from 'three'
import g from '@/assets/images/gradient.png'

const loader = new THREE.TextureLoader()
loader.crossOrigin = ''

const n = new THREE.PointsMaterial({
  size: 7,
  map: loader.load(g),
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true,
})

function getRangeRandom(e, t) {
  return Math.random() * (t - e) + e
}

export class AtmosphereParticle {
  constructor(options) {
    const { longestDistance, particleSum, renderUpdate, onChangeModel = Point => Point } = options
    this.longestDistance = longestDistance
    this.particleSum = particleSum
    this.renderUpdate = renderUpdate
    this.onChangeModel = onChangeModel

    const vertices = []
    for (let i = 0; i < this.particleSum; i++) {
      const x = getRangeRandom(-1 * longestDistance, longestDistance)
      const y = getRangeRandom(-1 * longestDistance, longestDistance)
      const z = getRangeRandom(-1 * longestDistance, longestDistance)
      vertices.push(x, y, z)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    this.Geometry = new THREE.Points(geometry, n)
    options.callback?.call(this, this.Geometry)
  }

  update = () => {
    this.renderUpdate(this.Geometry)
  }

  ChangeModel = () => {
    this.onChangeModel(this.Geometry)
  }
}
