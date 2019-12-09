/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import * as THREE from "three"

console.log(`PanoControls ${process.env.DEFINED_VERSION}`)

const EPS = 0.000001

const { PI } = Math

/**
 * 可对小数进行“取模”的方法
 * @returns 返回(a / b)的余数
 */
const decableMod = (a: number, b: number): number => {
  const n = Math.floor(a / b)
  return a - (n * b)
}

const clamp = (val: number, min: number, max: number): number => {
  if (val < min) {
    return min
  }
  if (val > max) {
    return max
  }
  return val
}

const loopedNumber = (val: number, min: number, max: number): number => {
  if (val < min) {
    // return val + max - min
    // max - (min - val) % (max - min)
    return max - decableMod(min - val, max - min)
  }
  if (val > max) {
    // return val + min - max
    // min + (val - max) % (max - min)
    return min + decableMod(val - max, max - min)
  }
  return val
}

class PanoControls extends THREE.EventDispatcher {
    public enabled = true

    public enableLooped = true

    public enableRotate = true

    public enableRotateDamping = true

    public enableScale = true

    public enableScaleDamping = true

    /**
     * 手指滑过一个[this.domSizeVectors.x]时，h(或v)的变化量
     */
    public rotateSpeed = 120

    /**
     * 手指扩张一个[this.domSizeVectors.x]时，fov的变化量
     */
    public scaleSpeed = -100

    /**
     * 每个代码执行周期内 自动旋转的角度
     * 该值乘以fps(一般为60)即为每秒旋转的角度
     */
    public autoRotateSpeed = -0.05

    /**
     * 启动自动旋转的时间间隔
     */
    public autoRotateInterval = 15000

    /**
     * h/v发生设置行为(不论是否变动)时触发
     */
    public readonly ROTATE_EVENT = {
      type: "rotate",
    }

    /**
     * fov发生设置行为(不论是否变动)时触发
     */
    public readonly SCALE_EVENT = {
      type: "scale",
    }

    /**
     * updateCamera时触发
     */
    public readonly CHANGE_EVENT = {
      type: "change",
    }

    /**
     * 用户交互时触发
     */
    public readonly INTERACT_EVENT = {
      type: "interact",
    }

    public camera: THREE.PerspectiveCamera;

    public domElement: HTMLElement;

    /**
     * 一个尺寸的量，触摸旋转时以此为基准
     * 该值越大，则旋转同样角度，手指需要滑动的距离越大
     */
    public domSizeVectors = new THREE.Vector2()

    private _STATES = {
      NONE: 0,
      ROTATE: 1,
      SCALE: 1 << 1,
    }

    private _state = this._STATES.NONE

    private _minFov = 40

    private _maxFov = 140

    private _minV = EPS

    private _maxV = 180 - EPS

    private _minH = -180

    private _maxH = 180

    private _rotateSmoothFactor = 0.9

    private _scaleSmoothFactor = 0.9

    private _enableAutoRotate = false

    private _autoRotateStart = new Date().getTime()

    private target = new THREE.Vector3()

    private spherical = new THREE.Spherical()

    private touchScaleStart = 0

    private scaleDelta = 0

    private touchScaleEnd = 0

    private rotateStart = new THREE.Vector2()

    private rotateDelta = new THREE.Vector2()

    private rotateEnd = new THREE.Vector2()

    private setCursor = (cursorStr: string) => {
      this.domElement.style.cursor = cursorStr
    }

    /**
     * resize的时候重置domSizeVectors
     */
    onResize: () => void = () => {
      const { clientWidth, clientHeight } = this.domElement

      const greatVal = clientWidth > clientHeight
        ? clientWidth
        : clientHeight

      this.domSizeVectors.set(greatVal, greatVal)
    }

    onTouchStart: (e: TouchEvent) => void = (e) => {
      // touchstart可以阻止浏览器默认右滑行为
      e.preventDefault()
      const { touches } = e
      switch (touches.length) {
      case 1:
        this.onRotateStart(touches[0], true)
        break
      case 2:
        this.onTouchScaleStart(touches)
        break
      default:
        break
      }
    }

    onTouchMove: (e: TouchEvent) => void = (e) => {
      e.preventDefault()
      const { touches } = e
      switch (touches.length) {
      case 1:
        this.onRotate(touches[0])
        break
      case 2:
        this.onTouchScale(touches)
        break
      default:
        break
      }
    }

    onTouchEnd: (e: TouchEvent) => void = (e) => {
      e.preventDefault()
      const totalTouchesLength = e.touches.length + e.changedTouches.length
      switch (totalTouchesLength) {
      case 1:
        this.onRotateEnd(e, true)
        break
      case 2:
        this.onTouchScaleEnd()
        break
      default:
        break
      }
    }

    onMouseDown: (e: MouseEvent) => void = (e) => {
      this.setCursor("grabbing")
      e.preventDefault()
      this.onRotateStart(e)
    }

    onMouseMove: (e: MouseEvent) => void = (e) => {
      e.preventDefault()
      this.onRotate(e)
    }

    onMouseUp: (e: MouseEvent) => void = (e) => {
      this.setCursor("grab")
      e.preventDefault()
      this.onRotateEnd(e)
    }

    onWheel: (e: WheelEvent) => void = (e) => {
      e.preventDefault()
      this.onMouseScale(e.deltaY)
    }

    constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
      super()
      this.camera = camera
      this.domElement = domElement

      this.setCursor("grab")

      const v = camera.getWorldDirection(new THREE.Vector3())
      this.spherical.setFromVector3(v)
      this.target.copy(camera.position).add(v)

      this.onResize()

      this.addEvents()
    }

    resetAutoRotateTimer() {
      this._autoRotateStart = new Date().getTime()
    }

    onRotateStart({ clientX, clientY }: MouseEvent | Touch, isTouch = false) {
      this._state |= this._STATES.ROTATE
      this.rotateStart.set(clientX, clientY)
      this.rotateEnd.set(clientX, clientY)
      if (isTouch) {
        document.addEventListener("touchmove", this.onTouchMove)
        document.addEventListener("touchend", this.onTouchEnd)
      } else {
        document.addEventListener("mousemove", this.onMouseMove)
        document.addEventListener("mouseup", this.onMouseUp)
      }
    }

    onRotate({ clientX, clientY }: MouseEvent | Touch) {
      this.rotateEnd.set(clientX, clientY)
      this.update()
      this.rotateStart.set(clientX, clientY)
      this.dispatchEvent(this.INTERACT_EVENT)
      if (this.enableAutoRotate) {
        this.resetAutoRotateTimer()
      }
    }

    onRotateEnd(e: MouseEvent | TouchEvent, isTouch = false) {
      this._state &= ~this._STATES.ROTATE
      if (isTouch) {
        document.removeEventListener("touchmove", this.onTouchMove)
        document.removeEventListener("touchend", this.onTouchEnd)
      } else {
        document.removeEventListener("mousemove", this.onMouseMove)
        document.removeEventListener("mouseup", this.onMouseUp)
      }
    }

    onTouchScaleStart(touches: TouchList) {
      this._state |= this._STATES.SCALE
      const { clientX: x1, clientY: y1 } = touches[0]
      const { clientX: x2, clientY: y2 } = touches[1]
      this.touchScaleStart = new THREE.Vector2(x1, y1).distanceTo(new THREE.Vector2(x2, y2)) / this.domSizeVectors.x
      this.touchScaleEnd = this.touchScaleStart
      document.addEventListener("touchmove", this.onTouchMove)
      document.addEventListener("touchend", this.onTouchEnd)
    }

    onTouchScale(touches: TouchList) {
      const { clientX: x1, clientY: y1 } = touches[0]
      const { clientX: x2, clientY: y2 } = touches[1]
      this.touchScaleEnd = new THREE.Vector2(x1, y1).distanceTo(new THREE.Vector2(x2, y2)) / this.domSizeVectors.x
      this.update()
      this.touchScaleStart = this.touchScaleEnd
      this.dispatchEvent(this.INTERACT_EVENT)
      if (this.enableAutoRotate) {
        this.resetAutoRotateTimer()
      }
    }

    onTouchScaleEnd() {
      this._state &= ~this._STATES.SCALE
      this.touchScaleStart = 0
      this.touchScaleEnd = 0
      document.removeEventListener("touchmove", this.onTouchMove)
      document.removeEventListener("touchend", this.onTouchEnd)
    }

    onMouseScale(deltaY: number) {
      if (Math.abs(deltaY) < 10) {
        /**
         * 懒得写各种兼容了，发现浏览器实现得千奇百怪，往后滚动滚轮一格，deltaY值有以下实现：
         * 以下浏览器均为win10下的64位浏览器：
         * chrome 72.0.3626.121: 100
         * Firefox Quantum 66.0.2: 3
         * ie 11.503.17763.0 最令人发指，会随着页面高度动态改变，从50变到200+...
         */
        // eslint-disable-next-line no-param-reassign
        deltaY *= 40
      }
      this._state |= this._STATES.SCALE
      this.touchScaleStart = 0
      /**
       * WARNING!!!
       * 这里除以7000，是经验值，表示鼠标滚轮和触摸屏之间的协调参数
       */
      this.touchScaleEnd = -deltaY / 7000
      this.update()
      this._state &= ~this._STATES.SCALE
      this.dispatchEvent(this.INTERACT_EVENT)
      if (this.enableAutoRotate) {
        this.resetAutoRotateTimer()
      }
    }

    addEvents() {
      this.domElement.addEventListener("mousedown", this.onMouseDown)
      this.domElement.addEventListener("touchstart", this.onTouchStart)
      this.domElement.addEventListener("wheel", this.onWheel)
      window.addEventListener("resize", this.onResize)
    }

    removeEvents() {
      this.domElement.removeEventListener("mousedown", this.onMouseDown)
      this.domElement.removeEventListener("touchstart", this.onTouchStart)
      this.domElement.removeEventListener("wheel", this.onWheel)
      window.removeEventListener("resize", this.onResize)

      document.removeEventListener("touchmove", this.onTouchMove)
      document.removeEventListener("touchend", this.onTouchEnd)
      document.removeEventListener("mousemove", this.onMouseMove)
      document.removeEventListener("mouseup", this.onMouseUp)
    }

    update() {
      if (!this.enabled) {
        return
      }
      const rotateNeedUpdate = this.enableRotate && this.updateRotateDelta()
      const scaleNeedUpdate = this.enableScale && this.updateScaleDelta()

      if (rotateNeedUpdate || scaleNeedUpdate) {
        this.updateCamera()
      }
    }

    updateCamera() {
      const { target, spherical, camera } = this

      this.dispatchEvent(this.CHANGE_EVENT)
      target.setFromSpherical(spherical).add(camera.position)
      camera.lookAt(target)
      camera.updateProjectionMatrix()
    }

    updateRotateDelta() {
      let needsUpdate = false

      if (this._state & this._STATES.ROTATE) {
        this.rotateDelta
          .subVectors(this.rotateEnd, this.rotateStart)
          .divide(this.domSizeVectors)
          .multiplyScalar(this.rotateSpeed)
        needsUpdate = true
      } else if (this.enableRotateDamping && this.rotateDelta.lengthSq() > EPS) {
        this.rotateDelta.multiplyScalar(this.rotateSmoothFactor)
        needsUpdate = true
      } else {
        this.rotateDelta.set(0, 0)
      }

      const delta = new Date().getTime() - this._autoRotateStart
      if (this.enableAutoRotate && (delta > this.autoRotateInterval)) {
        this._state |= this._STATES.ROTATE
        this.rotateDelta.x += this.autoRotateSpeed
        needsUpdate = true
      }

      if (needsUpdate) {
        this.h += this.rotateDelta.x
        this.v -= this.rotateDelta.y
      }

      return needsUpdate
    }

    updateScaleDelta() {
      let needsUpdate = false
      if (this._state & this._STATES.SCALE) {
        this.scaleDelta = (this.touchScaleEnd - this.touchScaleStart) * this.scaleSpeed
        this.fov += this.scaleDelta
        needsUpdate = true
      } else if (this.enableScaleDamping && Math.abs(this.scaleDelta) > EPS) {
        this.scaleDelta *= this.scaleSmoothFactor
        this.fov += this.scaleDelta
        needsUpdate = true
      } else {
        this.scaleDelta = 0
      }
      return needsUpdate
    }

    get enableAutoRotate() {
      return this._enableAutoRotate
    }

    set enableAutoRotate(val: boolean) {
      this._enableAutoRotate = val
      if (val) {
        this.resetAutoRotateTimer()
      }
    }

    /**
     * 旋转衰减因子，between 0 and 1
     */
    get rotateSmoothFactor() {
      return this._rotateSmoothFactor
    }

    set rotateSmoothFactor(val: number) {
      if (val <= 0 || val >= 1) {
        console.error("PanoControls.rotateSmoothFactor must be a value between 0 and 1.")
      }
      this._rotateSmoothFactor = clamp(val, EPS, 1 - EPS)
    }

    /**
     * 缩放衰减因子，between 0 and 1
     */
    set scaleSmoothFactor(val: number) {
      if (val <= 0 || val >= 1) {
        console.error("PanoControls.scaleSmoothFactor must be a value between 0 and 1.")
      }
      this._scaleSmoothFactor = clamp(val, EPS, 1 - EPS)
    }

    get scaleSmoothFactor() {
      return this._scaleSmoothFactor
    }

    get h() {
      return (this.spherical.theta * 180) / PI
    }

    set h(val: number) {
      const realVal = this.enableLooped
        ? loopedNumber(val, this.minH, this.maxH)
        : clamp(val, this.minH, this.maxH)
      this.spherical.theta = (realVal / 180) * PI
      this.dispatchEvent(this.ROTATE_EVENT)
    }

    get v() {
      return (this.spherical.phi * 180) / PI
    }

    set v(val: number) {
      const realVal = clamp(val, this.minV, this.maxV)
      this.spherical.phi = (realVal / 180) * PI
      this.dispatchEvent(this.ROTATE_EVENT)
    }

    get fov() {
      return this.camera.fov
    }

    set fov(val: number) {
      this.camera.fov = clamp(val, this.minFov, this.maxFov)
      this.dispatchEvent(this.SCALE_EVENT)
    }

    get minFov() {
      return this._minFov
    }

    set minFov(val: number) {
      this._minFov = clamp(val, EPS, this.maxFov)
    }

    get maxFov() {
      return this._maxFov
    }

    set maxFov(val: number) {
      this._maxFov = clamp(val, this.minFov, 180 - EPS)
    }

    get minV() {
      return this._minV
    }

    set minV(val: number) {
      this._minV = clamp(val, EPS, this.maxV)
    }

    get maxV() {
      return this._maxV
    }

    set maxV(val: number) {
      this._maxV = clamp(val, this.minV, 180 - EPS)
    }

    get minH() {
      return this._minH
    }

    set minH(val: number) {
      this._minH = clamp(val, -180, this.maxH)
    }

    get maxH() {
      return this._maxH
    }

    set maxH(val: number) {
      this._maxH = clamp(val, this.minH, 180)
    }
}

export default PanoControls
