var gui = new dat.GUI()

var canvas = document.querySelector("#canvas")

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

var textureLoader = new THREE.TextureLoader()
var renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas })
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 2000)
renderer.setPixelRatio(window.devicePixelRatio)

window.addEventListener("resize", function(e) {
  camera.aspect = canvas.clientWidth / canvas.clientHeight
  camera.updateProjectionMatrix()
})

var geo = new THREE.CubeGeometry(1000, 1000, 1000)

var geneMat = function geneMat(url) {
  return new THREE.MeshBasicMaterial({
    map: textureLoader.load(url),
    side: THREE.DoubleSide
  })
}

var panoBox = new THREE.Mesh(geo, [
  geneMat("./images/pano_r.jpg"),
  geneMat("./images/pano_l.jpg"),
  geneMat("./images/pano_u.jpg"),
  geneMat("./images/pano_d.jpg"),
  geneMat("./images/pano_f.jpg"),
  geneMat("./images/pano_b.jpg"),
])

scene.add(panoBox)

var panoControl = new PanoControls(camera, canvas)
panoControl.h = -1
panoControl.v = 113
panoControl.fov = 96
// default fovMin = 40
// default fovMax = 140
panoControl.updateCamera()

Object.defineProperty(panoControl, "rotateSpeed", {
  get: function() {
    return this.fov * 2
  }
})

var panoControlOnChange = function panoControlOnChange() {
  panoControl.updateCamera()
}

gui.add(panoControl, "h").listen().onChange(panoControlOnChange)
gui.add(panoControl, "v").listen().onChange(panoControlOnChange)
gui.add(panoControl, "fov").listen().onChange(panoControlOnChange)
gui.add(panoControl, "minH").listen().onChange(panoControlOnChange)
gui.add(panoControl, "maxH").listen().onChange(panoControlOnChange)
gui.add(panoControl, "minV").listen().onChange(panoControlOnChange)
gui.add(panoControl, "maxV").listen().onChange(panoControlOnChange)
gui.add(panoControl, "fovMin").listen().onChange(panoControlOnChange)
gui.add(panoControl, "fovMax").listen().onChange(panoControlOnChange)

var animate = function animate() {
  renderer.render(scene, camera)
  panoControl.update()
  window.requestAnimationFrame(animate)
}

animate()
