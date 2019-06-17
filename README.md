# PanoControls

three.js `panorama / fov` controls as a typescript compatible npm module. [live demo](https://xiaomingtang.github.io/pano-controls/examples/)

# Installation

```
npm i -S panoControls
```

# Usage

```javascript
import * as THREE from "three"
import PanoControls from "pano-controls"

let container // = ...

// PerspectiveCamera is supported only
const camera = new THREE.PerspectiveCamera(/* ... */)

const panoControl = new PanoControls(camera, container)

panoControl.h   = whatEverYouWant
panoControl.v   = whatEverYouWant
panoControl.fov = whatEverYouWant
// updateCamera after set h / v / fov
panoControl.updateCamera()

function animate() {
  renderer.render(scene, camera)
  panoControl.update()
}

animate()
```

### default values

``` javascript
panoControl.minH   = -180
panoControl.maxH   = 180
panoControl.minV   = EPS // EPS = 0.000001, as bugs occur while v === 0 or 180
panoControl.maxV   = 180 - EPS
panoControl.minFov = 40
panoControl.maxFov = 140

panoControl.enabled = true
panoControl.enableScale  = true
panoControl.enableRotate = true
panoControl.enableScaleDamping  = true
panoControl.enableRotateDamping = true

panoControl.scaleSpeed  = -100
panoControl.rotateSpeed = 120
panoControl.scaleSmoothFactor  = 0.9  // 0 - 1
panoControl.rotateSmoothFactor = 0.9  // 0 - 1
```

### Events

`change`: while `h`/`v`/`fov` is changed    

`rotate`: while `h`/`v` is changed    

`scale`: while `fov` is changed    

`interact`: while `h`/`v`/`fov` is changed caused by user action    

# License

```
MIT
```
