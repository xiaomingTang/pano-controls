"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EPS = 0.000001;
var PI = Math.PI;
var clamp = function (val, min, max) { return val < min ? min : val > max ? max : val; };
var loopedNumber = function (val, min, max) { return val < min ? val + max - min : val > max ? val + min - max : val; };
var PanoControls = /** @class */ (function (_super) {
    __extends(PanoControls, _super);
    function PanoControls(camera, domElement) {
        var _this = _super.call(this) || this;
        _this.enabled = true;
        _this.enableRotate = true;
        _this.enableRotateDamping = true;
        _this.enableScale = true;
        _this.enableScaleDamping = true;
        _this.rotateSpeed = 120;
        _this.scaleSpeed = -100;
        _this.rotateSmoothFactor = 0.9;
        _this.scaleSmoothFactor = 0.9;
        _this.STATES = {
            NONE: 0,
            ROTATE: 1,
            SCALE: 1 << 1,
        };
        _this.state = _this.STATES.NONE;
        // h/v发生设置行为(不论是否变动)时触发
        _this.ROTATE_EVENT = {
            type: "rotate"
        };
        // fov发生设置行为(不论是否变动)时触发
        _this.SCALE_EVENT = {
            type: "scale"
        };
        // updateCamera时触发
        _this.CHANGE_EVENT = {
            type: "change"
        };
        // 用户交互时触发
        _this.INTERACT_EVENT = {
            type: "interact"
        };
        _this._minFov = 40;
        _this._maxFov = 140;
        _this._minV = EPS;
        _this._maxV = 180 - EPS;
        _this._minH = -180;
        _this._maxH = 180;
        _this.target = new THREE.Vector3();
        _this.spherical = new THREE.Spherical();
        _this.touchScaleStart = 0;
        _this.scaleDelta = 0;
        _this.touchScaleEnd = 0;
        _this.rotateStart = new THREE.Vector2();
        _this.rotateDelta = new THREE.Vector2();
        _this.rotateEnd = new THREE.Vector2();
        _this.setCursor = function (cursorStr) {
            _this.domElement.style.cursor = cursorStr;
        };
        // onResize: (e: Event) => void = () => {
        //     const { width, height } = window.screen
        //     this.domSizeVectors.set(height, height)
        // }
        // @todos: 需要处理 当ScreenOrientation接口返回错误时的处理。
        _this.onResize = function () {
            var angle = (screen.msOrientation || screen.mozOrientation || (screen.orientation || {})).angle;
            var isHorizonScreen = (angle > 45 && angle < 135) || (angle > 225 && angle < 315);
            var _a = window.screen, width = _a.width, height = _a.height;
            if (isHorizonScreen) {
                _this.domSizeVectors.set(width, width);
            }
            else {
                _this.domSizeVectors.set(height, height);
            }
        };
        _this.onTouchStart = function (e) {
            // touchstart可以阻止浏览器默认右滑行为
            e.preventDefault();
            var touches = e.touches;
            switch (touches.length) {
                case 1:
                    _this.onRotateStart(touches[0], true);
                    break;
                case 2:
                    _this.onTouchScaleStart(touches);
                    break;
            }
        };
        _this.onTouchMove = function (e) {
            e.preventDefault();
            var touches = e.touches;
            switch (touches.length) {
                case 1:
                    _this.onRotate(touches[0]);
                    break;
                case 2:
                    _this.onTouchScale(touches);
                    break;
            }
        };
        _this.onTouchEnd = function (e) {
            e.preventDefault();
            var totalTouchesLength = e.touches.length + e.changedTouches.length;
            switch (totalTouchesLength) {
                case 1:
                    _this.onRotateEnd(e, true);
                    break;
                case 2:
                    _this.onTouchScaleEnd(e);
                    break;
            }
        };
        _this.onMouseDown = function (e) {
            _this.setCursor("grabbing");
            e.preventDefault();
            _this.onRotateStart(e);
        };
        _this.onMouseMove = function (e) {
            e.preventDefault();
            _this.onRotate(e);
        };
        _this.onMouseUp = function (e) {
            _this.setCursor("grab");
            e.preventDefault();
            _this.onRotateEnd(e);
        };
        _this.onWheel = function (e) {
            e.preventDefault();
            _this.onMouseScale(e.deltaY);
        };
        _this.camera = camera;
        _this.domElement = domElement;
        _this.setCursor("grab");
        var v = camera.getWorldDirection(new THREE.Vector3());
        _this.spherical.setFromVector3(v);
        _this.target.copy(camera.position).add(v);
        var clientWidth = domElement.clientWidth, clientHeight = domElement.clientHeight;
        _this.domSizeVectors = new THREE.Vector2(clientHeight, clientHeight);
        _this.onResize();
        _this.addEvents();
        return _this;
    }
    PanoControls.prototype.onRotateStart = function (_a, isTouch) {
        var clientX = _a.clientX, clientY = _a.clientY;
        if (isTouch === void 0) { isTouch = false; }
        this.state |= this.STATES.ROTATE;
        this.rotateStart.set(clientX, clientY);
        this.rotateEnd.set(clientX, clientY);
        if (isTouch) {
            document.addEventListener("touchmove", this.onTouchMove);
            document.addEventListener("touchend", this.onTouchEnd);
        }
        else {
            document.addEventListener("mousemove", this.onMouseMove);
            document.addEventListener("mouseup", this.onMouseUp);
        }
    };
    PanoControls.prototype.onRotate = function (_a) {
        var clientX = _a.clientX, clientY = _a.clientY;
        this.rotateEnd.set(clientX, clientY);
        this.update();
        this.rotateStart.set(clientX, clientY);
        this.dispatchEvent(this.INTERACT_EVENT);
    };
    PanoControls.prototype.onRotateEnd = function (e, isTouch) {
        if (isTouch === void 0) { isTouch = false; }
        this.state &= ~this.STATES.ROTATE;
        if (isTouch) {
            document.removeEventListener("touchmove", this.onTouchMove);
            document.removeEventListener("touchend", this.onTouchEnd);
        }
        else {
            document.removeEventListener("mousemove", this.onMouseMove);
            document.removeEventListener("mouseup", this.onMouseUp);
        }
    };
    PanoControls.prototype.onTouchScaleStart = function (touches) {
        this.state |= this.STATES.SCALE;
        var _a = touches[0], x1 = _a.clientX, y1 = _a.clientY;
        var _b = touches[1], x2 = _b.clientX, y2 = _b.clientY;
        this.touchScaleStart = new THREE.Vector2(x1, y1).distanceTo(new THREE.Vector2(x2, y2)) / this.domSizeVectors.x;
        this.touchScaleEnd = this.touchScaleStart;
        document.addEventListener("touchmove", this.onTouchMove);
        document.addEventListener("touchend", this.onTouchEnd);
    };
    PanoControls.prototype.onTouchScale = function (touches) {
        var _a = touches[0], x1 = _a.clientX, y1 = _a.clientY;
        var _b = touches[1], x2 = _b.clientX, y2 = _b.clientY;
        this.touchScaleEnd = new THREE.Vector2(x1, y1).distanceTo(new THREE.Vector2(x2, y2)) / this.domSizeVectors.x;
        this.update();
        this.touchScaleStart = this.touchScaleEnd;
        this.dispatchEvent(this.INTERACT_EVENT);
    };
    PanoControls.prototype.onTouchScaleEnd = function (e) {
        this.state &= ~this.STATES.SCALE;
        this.touchScaleStart = 0;
        this.touchScaleEnd = 0;
        document.removeEventListener("touchmove", this.onTouchMove);
        document.removeEventListener("touchend", this.onTouchEnd);
    };
    PanoControls.prototype.onMouseScale = function (deltaY) {
        if (Math.abs(deltaY) < 10) {
            /**
             * 懒得写各种兼容了，发现浏览器实现得千奇百怪，往后滚动滚轮一格，deltaY值有以下实现：
             * 以下浏览器均为win10下的64位浏览器：
             * chrome 72.0.3626.121: 100
             * Firefox Quantum 66.0.2: 3
             * ie 11.503.17763.0 最令人发指，会随着页面高度动态改变，从50变到200+...
             */
            deltaY *= 40;
        }
        this.state |= this.STATES.SCALE;
        this.touchScaleStart = 0;
        // WARNING!!!
        // 这里除以7000，是经验值，表示鼠标滚轮和触摸屏之间的协调参数
        this.touchScaleEnd = -deltaY / 7000;
        this.update();
        this.state &= ~this.STATES.SCALE;
        this.dispatchEvent(this.INTERACT_EVENT);
    };
    PanoControls.prototype.addEvents = function () {
        this.domElement.addEventListener("mousedown", this.onMouseDown);
        this.domElement.addEventListener("touchstart", this.onTouchStart);
        this.domElement.addEventListener("wheel", this.onWheel);
        window.addEventListener("resize", this.onResize);
    };
    PanoControls.prototype.removeEvents = function () {
        this.domElement.removeEventListener("mousedown", this.onMouseDown);
        this.domElement.removeEventListener("touchstart", this.onTouchStart);
        this.domElement.removeEventListener("wheel", this.onWheel);
        window.removeEventListener("resize", this.onResize);
        document.removeEventListener("touchmove", this.onTouchMove);
        document.removeEventListener("touchend", this.onTouchEnd);
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("mouseup", this.onMouseUp);
    };
    PanoControls.prototype.update = function () {
        if (!this.enabled) {
            return;
        }
        var rotateNeedUpdate = this.enableRotate && this.updateRotateDelta();
        var scaleNeedUpdate = this.enableScale && this.updateScaleDelta();
        if (rotateNeedUpdate || scaleNeedUpdate) {
            this.updateCamera();
        }
    };
    PanoControls.prototype.updateCamera = function () {
        var _a = this, target = _a.target, spherical = _a.spherical, camera = _a.camera;
        this.dispatchEvent(this.CHANGE_EVENT);
        target.setFromSpherical(spherical).add(camera.position);
        camera.lookAt(target);
        camera.updateProjectionMatrix();
    };
    PanoControls.prototype.updateRotateDelta = function () {
        var needsUpdate = false;
        if (this.state & this.STATES.ROTATE) {
            this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).divide(this.domSizeVectors).multiplyScalar(this.rotateSpeed);
            this.h += this.rotateDelta.x;
            this.v -= this.rotateDelta.y;
            needsUpdate = true;
        }
        else {
            if (this.enableRotateDamping && this.rotateDelta.lengthSq() > EPS) {
                this.rotateDelta.multiplyScalar(this.rotateSmoothFactor);
                this.h += this.rotateDelta.x;
                this.v -= this.rotateDelta.y;
                needsUpdate = true;
            }
            else {
                this.rotateDelta.set(0, 0);
            }
        }
        return needsUpdate;
    };
    PanoControls.prototype.updateScaleDelta = function () {
        var needsUpdate = false;
        if (this.state & this.STATES.SCALE) {
            this.scaleDelta = (this.touchScaleEnd - this.touchScaleStart) * this.scaleSpeed;
            this.fov += this.scaleDelta;
            needsUpdate = true;
        }
        else {
            if (this.enableScaleDamping && Math.abs(this.scaleDelta) > EPS) {
                this.scaleDelta *= this.scaleSmoothFactor;
                this.fov += this.scaleDelta;
                needsUpdate = true;
            }
            else {
                this.scaleDelta = 0;
            }
        }
        return needsUpdate;
    };
    Object.defineProperty(PanoControls.prototype, "h", {
        get: function () {
            return this.spherical.theta * 180 / PI;
        },
        set: function (val) {
            val = loopedNumber(val, this.minH, this.maxH);
            this.spherical.theta = val / 180 * PI;
            this.dispatchEvent(this.ROTATE_EVENT);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanoControls.prototype, "v", {
        get: function () {
            return this.spherical.phi * 180 / PI;
        },
        set: function (val) {
            val = clamp(val, this.minV, this.maxV);
            this.spherical.phi = val / 180 * PI;
            this.dispatchEvent(this.ROTATE_EVENT);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanoControls.prototype, "fov", {
        get: function () {
            return this.camera.fov;
        },
        set: function (val) {
            val = clamp(val, this.fovMin, this.fovMax);
            this.camera.fov = val;
            this.dispatchEvent(this.SCALE_EVENT);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanoControls.prototype, "fovMin", {
        get: function () {
            return this._minFov;
        },
        set: function (val) {
            val = clamp(val, EPS, 180 - EPS);
            this._minFov = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanoControls.prototype, "fovMax", {
        get: function () {
            return this._maxFov;
        },
        set: function (val) {
            val = clamp(val, EPS, 180 - EPS);
            this._maxFov = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanoControls.prototype, "minV", {
        get: function () {
            return this._minV;
        },
        set: function (val) {
            val = clamp(val, EPS, 180 - EPS);
            this._minV = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanoControls.prototype, "maxV", {
        get: function () {
            return this._maxV;
        },
        set: function (val) {
            val = clamp(val, EPS, 180 - EPS);
            this._maxV = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanoControls.prototype, "minH", {
        get: function () {
            return this._minH;
        },
        set: function (val) {
            val = clamp(val, -180, 180);
            this._minH = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanoControls.prototype, "maxH", {
        get: function () {
            return this._maxH;
        },
        set: function (val) {
            val = clamp(val, -180, 180);
            this._maxH = val;
        },
        enumerable: true,
        configurable: true
    });
    return PanoControls;
}(THREE.EventDispatcher));
exports.default = PanoControls;
