# PanoControls

three.js `panorama / fov` controls as a typescript compatible npm module.

# 程序概览
Entrys:    
  - `development`: `src/example.ts`    
  - `production`: `src/index.ts`    

# 体验

``` cmd
git clone git@github.com:xiaomingTang/pano-controls.git
yarn
yarn start
```

# Installation

```
# cmd
yarn add pano-controls
# or
npm i pano-controls
```

# Usage

### js/ts

``` javascript
import * as THREE from "three"
import PanoControls from "pano-controls"

const container = document.querySelector("#container")

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
  // don't forget to run update()
  panoControl.update()
  window.requestAnimationFrame(animate)
}

animate()
```
### react

``` typescript
import * as React from "react"
import * as THREE from "three"
import PanoControls from "pano-controls"

const { useState, useRef, useEffect } = React

// ...

function WhatEverComponent() {
  const containerRef = useRef()
  
  // PerspectiveCamera is supported only
  const camera = new THREE.PerspectiveCamera(/* ... */)

  useEffect(() => {
    if(containerRef) {
      const control = new PanoControls(camera, containerRef.current)

      control.h   = whatEverYouWant
      control.v   = whatEverYouWant
      control.fov = whatEverYouWant
      // updateCamera after reset h / v / fov
      control.updateCamera()

      return () => {
        // important!
        control.removeEvents()
      }
    }
  }, [containerRef])

  return <div ref={containerRef} style={{
    width: "100%",
    height: "100%",
  }} />
}

// don't forget to run update()
```

### script

``` html
<canvas id="canvas" style="width: 100%; height: 100%;" />

<script src="path/to/three.min.js" />
<!-- 本包有一个依赖包, 名为 "tang-pano", 需要手动下载 -->
<script src="path/to/tang-pano/dist/index.min.js" />
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
panoControl.enableLooped = true
panoControl.enableScale  = true
panoControl.enableRotate = true
panoControl.enableScaleDamping  = true
panoControl.enableRotateDamping = true
panoControl.enableAutoRotate = false

panoControl.scaleSpeed  = -100
panoControl.rotateSpeed = 120
panoControl.scaleSmoothFactor  = 0.9  // 0 ~ 1
panoControl.rotateSmoothFactor = 0.9  // 0 ~ 1
panoControl.autoRotateSpeed = -0.05
panoControl.autoRotateInterval = 15000 // ms
```

### Events

`PanoControls` extends [https://github.com/Wolfy87/EventEmitter](https://github.com/Wolfy87/EventEmitter)

`change`: while `h / v / fov` has changed    

`rotate`: while `h / v` has changed    

`scale`: while `fov` has changed    

`interact`: while `h / v / fov` has changed caused by user action    

# License

```
MIT
```
