import * as dat from "dat.gui"
import * as THREE from "three"

import PanoControls from "./index"

const gui = new dat.GUI()

const canvas = document.querySelector("#canvas") as HTMLCanvasElement

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

const textureLoader = new THREE.TextureLoader()
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 2000)
renderer.setPixelRatio(window.devicePixelRatio)

window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight
  camera.updateProjectionMatrix()
})

const colors = [
  "#7fc4d8",
  "#8997dd",
  "#0f4170",
  "#93b8d8",
  "#6681f9",
  "#a49fe0",
]

const geo = new THREE.BoxGeometry(1000, 1000, 1000)

const geneMat = function geneMat(url: string, n: number) {
  const mat = new THREE.MeshBasicMaterial({
    color: colors[n],
    side: THREE.DoubleSide,
  })

  textureLoader.load(url, (texture) => {
    mat.map = texture
    mat.color = new THREE.Color()
    mat.needsUpdate = true
  })

  return mat
}

const panoBox = new THREE.Mesh(geo, [
  geneMat("./static/images/pano_r.jpg", 0),
  geneMat("./static/images/pano_l.jpg", 1),
  geneMat("./static/images/pano_u.jpg", 2),
  geneMat("./static/images/pano_d.jpg", 3),
  geneMat("./static/images/pano_f.jpg", 4),
  geneMat("./static/images/pano_b.jpg", 5),
])

scene.add(panoBox)

const panoControl = new PanoControls(camera, canvas)
panoControl.enableAutoRotate = true
panoControl.autoRotateInterval = 3000
panoControl.h = 1.5
panoControl.v = 118
panoControl.fov = 80
panoControl.updateCamera()

Object.defineProperty(panoControl, "rotateSpeed", {
  get() {
    // 不同的 fov 给出不同的旋转速度, 用户体验更好
    return this.fov * 2
  },
})

const panoControlOnChange = function panoControlOnChange() {
  panoControl.updateCamera()
}

gui.add(panoControl, "enabled").listen().onChange(panoControlOnChange)
gui.add(panoControl, "enableRotate").listen().onChange(panoControlOnChange)
gui.add(panoControl, "enableScale").listen().onChange(panoControlOnChange)
gui.add(panoControl, "enableScaleDamping").listen().onChange(panoControlOnChange)
gui.add(panoControl, "enableRotateDamping").listen().onChange(panoControlOnChange)
gui.add(panoControl, "enableAutoRotate").listen().onChange(panoControlOnChange)

gui.add(panoControl, "enableLooped").listen().onChange(panoControlOnChange)
gui.add(panoControl, "horizonReversed").listen().onChange(panoControlOnChange)

gui.add(panoControl, "h").listen().onChange(panoControlOnChange)
gui.add(panoControl, "v").listen().onChange(panoControlOnChange)
gui.add(panoControl, "fov").listen().onChange(panoControlOnChange)
gui.add(panoControl, "minH").listen().onChange(panoControlOnChange)
gui.add(panoControl, "maxH").listen().onChange(panoControlOnChange)
gui.add(panoControl, "minV").onChange(panoControlOnChange)
gui.add(panoControl, "maxV").listen().onChange(panoControlOnChange)
gui.add(panoControl, "minFov").listen().onChange(panoControlOnChange)
gui.add(panoControl, "maxFov").listen().onChange(panoControlOnChange)
gui.add(panoControl, "autoRotateSpeed").listen().onChange(panoControlOnChange)

const animate = function animate() {
  renderer.render(scene, camera)
  panoControl.update()
  window.requestAnimationFrame(animate)
}

animate()
