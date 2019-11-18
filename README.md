# PanoControls

three.js `panorama / fov` controls as a typescript compatible npm module. [live demo](https://xiaomingtang.github.io/pano-controls/examples/)

# Installation

```
# cmd
yarn add pano-controls
# or
npm i pano-controls
```

# Usage

### in js/ts

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
// updateCamera after reset h / v / fov
panoControl.updateCamera()

function animate() {
  renderer.render(scene, camera)
  panoControl.update()
}

animate()
```
### in react

``` typescript
import * as React from "react"
import * as THREE from "three"
import PanoControls from "pano-controls"

const { useState, useRef, useEffect } = React

// ...

function WhatEverComponent() {
  const containerRef = useRef()
  const [panoControl, setPanoControl] = useState()
  
  // PerspectiveCamera is supported only
  const camera = new THREE.PerspectiveCamera(/* ... */)

  useEffect(() => {
    if(containerRef) {
      const pC = new PanoControls(camera, containerRef.current)

      pC.h   = whatEverYouWant
      pC.v   = whatEverYouWant
      pC.fov = whatEverYouWant
      // updateCamera after reset h / v / fov
      pC.updateCamera()

      setPanoControl(pC)

      return () => {
        pC.removeEvents()
      }
    }
  }, [containerRef])

  return <div ref={containerRef} style={{
    width: "100%",
    height: "100%",
  }} />
}

// ...
```

### in script

``` html
<canvas id="canvas" style="width: 100%; height: 100%;" />

<script src="path/to/three.min.js" />
<script src="path/to/pano-controls/dist/index.min.js" />

<script>
  // ...
  
  var PanoControls = window.PanoControls

  // same as js/ts
  var panoControl = new PanoControls(camera, container)
</script>
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
panoControl.enableAutoRotate = false

panoControl.scaleSpeed  = -100
panoControl.rotateSpeed = 120
panoControl.scaleSmoothFactor  = 0.9  // 0 - 1
panoControl.rotateSmoothFactor = 0.9  // 0 - 1
panoControl.autoRotateSpeed = -0.05
panoControl.autoRotateInterval = 15000 // ms
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
