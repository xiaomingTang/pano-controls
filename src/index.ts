/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import {
  PerspectiveCamera, Vector3, Spherical,
} from "three"
import { InteractiveElement } from "tang-pano"

console.log(`PanoControls ${process.env.DEFINED_VERSION}`)

const { PI } = Math

class PanoControls extends InteractiveElement {
  public camera: PerspectiveCamera;

  private target = new Vector3()

  private spherical = new Spherical()

  constructor(camera: PerspectiveCamera, domElement: HTMLElement) {
    super(domElement)
    this.camera = camera
    const vec3 = camera.getWorldDirection(new Vector3())
    this.target.copy(camera.position).add(vec3)
    this.spherical.setFromVector3(vec3)
    this.h = (this.spherical.theta * 180) / PI
    this.v = (this.spherical.phi * 180) / PI
    this.fov = this.camera.fov
  }

  public update() {
    if (!this.enabled) {
      return
    }
    const rotateNeedUpdate = this.enableRotate && this.updateRotateDelta()
    const scaleNeedUpdate = this.enableScale && this.updateScaleDelta()

    if (rotateNeedUpdate || scaleNeedUpdate) {
      this.updateCamera()
    }
  }

  public updateCamera() {
    const {
      target, spherical, camera, h, v, fov,
    } = this

    spherical.theta = (h / 180) * PI
    spherical.phi = (v / 180) * PI
    camera.fov = fov

    target.setFromSpherical(spherical).add(camera.position)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }
}

export default PanoControls
