# PanoControls

three.js `panorama / fov` controls as a typescript compatible npm module. [demo](https://xiaomingtang.github.io/pano-controls/examples/)

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

// default values:
panoControl.minH   = -180
panoControl.maxH   = 180
panoControl.minV   = EPS // EPS = 0.000001, as bugs occur while v === 0 or 180
panoControl.maxV   = 180 - EPS
panoControl.minFov = 40
panoControl.maxFov = 140

function animate() {
  renderer.render(scene, camera)
  panoControl.update()
}

animate()

```

# License
MIT
