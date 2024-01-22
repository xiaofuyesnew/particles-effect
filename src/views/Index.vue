<script setup>
import { ref, watchEffect } from 'vue'
import Tween from '@tweenjs/tween.js'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { AtmosphereParticle, ParticleSystem } from '@/THREE'
import { GetFlatGeometry, VerticesDuplicateRemove } from '@/utils'

import ball from '@/THREE/models/ball.obj?url'
import cone from '@/THREE/models/cone.obj?url'
import cube from '@/THREE/models/cube.fbx?url'

const wrapper = ref(null)
let MainParticle = null

const TurnBasicNum = { firefly: 0.002 }
const al = 1500

const tween2 = new Tween.Tween(TurnBasicNum).easing(Tween.Easing.Exponential.In)
const tween1 = new Tween.Tween(TurnBasicNum).easing(Tween.Easing.Exponential.In)

const Atomsphere1 = new AtmosphereParticle({
  longestDistance: al,
  particleSum: 500,
  renderUpdate: (Point) => {
    Point.rotation.x -= TurnBasicNum.firefly
  },
  callback: (Point) => {
    Point.position.z = -1 * al
  },
  onChangeModel: () => {
    tween2.stop()
    tween1.stop().to({ firefly: 0.04 }, 1500).chain(tween2)
    tween2.to({ firefly: 0.002 }, 1500)
    tween1.start()
  },
})

const Atomsphere2 = new AtmosphereParticle({
  longestDistance: al,
  particleSum: 500,
  renderUpdate: (Point) => {
    Point.rotation.y += TurnBasicNum.firefly
  },
  callback: (Point) => {
    Point.position.y = -0.2 * al
    Point.position.z = -1 * al
  },
})

const Atomsphere3 = new AtmosphereParticle({
  longestDistance: al,
  particleSum: 500,
  renderUpdate: (Point) => {
    Point.rotation.z += TurnBasicNum.firefly / 2
  },
  callback: (Point) => {
    Point.position.z = -1.2 * al
  },
})

const scaleNum = 600
let Q = 0
const Models = [
  {
    name: 'cube',
    path: cube,
    onLoadComplete(Geometry) {
      const s = 400
      Geometry.scale(s, s, s)
    },
    loader: {
      loaderInstance: new FBXLoader(),
      load(group) {
        const g = new BufferGeometry()
        console.log(group)
        let arr = new Float32Array([])
        for (const i of group.children)
          arr = new Float32Array([...arr, ...i.geometry.attributes.position.array])

        g.setAttribute('position', new Float32BufferAttribute(VerticesDuplicateRemove(arr), 3))
        return g
      },
    },
  },
  {
    name: 'ball',
    path: ball,
    onLoadComplete(Geometry) {
      Geometry.scale(scaleNum, scaleNum, scaleNum)
      Geometry.translate(-600, 0, -100)
    },
    onEnterStart() {
      console.log('ball enter start')
    },
    onEnterEnd() {
      console.log('ball enter end')
    },
  },
  {
    name: 'wave',
    geometry: GetFlatGeometry(),
    onAnimationFrameUpdate(PerfromPoint, TweenList) {
      const p = PerfromPoint.geometry.getAttribute('position')
      TweenList.forEach((val, i) => {
        if (val.isPlaying === false)
          p.setY(i, Math.sin((i + 1 + Q) * 0.3) * 50 + Math.sin((i + Q) * 0.5) * 50 - 500)
      })
      Q += 0.08
      return true
    },
  },
  {
    name: 'cone',
    path: cone,
    onLoadComplete(Geometry) {
      Geometry.scale(scaleNum, scaleNum, scaleNum)
      Geometry.translate(600, 100, -100)
    },
  },
]

window.changeModel = (name) => {
  if (MainParticle != null)
    MainParticle.ChangeModel(name)
}

// onMounted(() => {
//   if (MainParticle === null) {
//     MainParticle = new ParticleSystem({
//       CanvasWrapper: wrapper.value,
//       Models,
//       addons: [Atomsphere1, Atomsphere2, Atomsphere3],
//       onModelsFinishedLoad: () => {
//         MainParticle?.ListenMouseMove()
//       },
//     })
//     console.log(MainParticle)
//   }
// })

watchEffect(() => {
  if (MainParticle === null && wrapper.value !== null) {
    MainParticle = new ParticleSystem({
      CanvasWrapper: wrapper.value,
      Models,
      addons: [Atomsphere1, Atomsphere2, Atomsphere3],
      onModelsFinishedLoad: () => {
        MainParticle?.ListenMouseMove()
      },
    })
  }
})
</script>

<template>
  <div class="h-full w-full">
    <div ref="wrapper" class="fixed bottom-0 left-0 right-0 top-0" />
    <ul class="fixed bottom-0 right-2 top-0 my-auto flex flex-col justify-center text-white">
      <li v-for="val in Models" :key="val.name" @click="() => MainParticle?.ChangeModel(val.name)">
        {{ val.name }}
      </li>
    </ul>
    <ul class="">
      <li @click="() => MainParticle?.ListenMouseMove()">
        ListenMouseMove
      </li>
      <li @click="() => MainParticle?.StopListenMouseMove()">
        StopListenMouseMove
      </li>
      <li @click="() => MainParticle?.AlignCameraCenter()">
        AlignCameraCenter
      </li>
      <li @click="() => MainParticle?.AlignCameraCenter(true)">
        AlignCameraCenter(immediately)
      </li>
    </ul>
  </div>
</template>
