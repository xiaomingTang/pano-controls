(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("THREE"));
	else if(typeof define === 'function' && define.amd)
		define(["THREE"], factory);
	else if(typeof exports === 'object')
		exports["PanoControls"] = factory(require("THREE"));
	else
		root["PanoControls"] = factory(root["THREE"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_three__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/pano-controls.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/pano-controls.ts":
/*!******************************!*\
  !*** ./src/pano-controls.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var three_1 = __webpack_require__(/*! three */ "three");
var THREE = { EventDispatcher: three_1.EventDispatcher, Vector3: three_1.Vector3, Spherical: three_1.Spherical, Vector2: three_1.Vector2, PerspectiveCamera: three_1.PerspectiveCamera };
var EPS = 0.000001;
var PI = Math.PI;
var clamp = function (val, min, max) { return val < min ? min : val > max ? max : val; };
var loopedNumber = function (val, min, max) { return val < min ? val + max - min : val > max ? val + min - max : val; };
var PanoControls = (function (_super) {
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
        _this.ROTATE_EVENT = {
            type: "rotate"
        };
        _this.SCALE_EVENT = {
            type: "scale"
        };
        _this.CHANGE_EVENT = {
            type: "change"
        };
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
        _this.onResize = function () {
            var angle = (screen.msOrientation || screen.mozOrientation || (screen.orientation || { angle: 0 })).angle;
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
            deltaY *= 40;
        }
        this.state |= this.STATES.SCALE;
        this.touchScaleStart = 0;
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
            val = clamp(val, this.minFov, this.maxFov);
            this.camera.fov = val;
            this.dispatchEvent(this.SCALE_EVENT);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanoControls.prototype, "minFov", {
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
    Object.defineProperty(PanoControls.prototype, "maxFov", {
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


/***/ }),

/***/ "three":
/*!************************!*\
  !*** external "THREE" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_three__;

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QYW5vQ29udHJvbHMvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1Bhbm9Db250cm9scy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9QYW5vQ29udHJvbHMvLi9zcmMvcGFuby1jb250cm9scy50cyIsIndlYnBhY2s6Ly9QYW5vQ29udHJvbHMvZXh0ZXJuYWwgXCJUSFJFRVwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsY0FBYyxnQkFBZ0Isc0NBQXNDLGlCQUFpQixFQUFFO0FBQ3ZGLDZCQUE2Qix1REFBdUQ7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsOENBQThDLGNBQWM7QUFDNUQsY0FBYyxtQkFBTyxDQUFDLG9CQUFPO0FBQzdCLGFBQWE7QUFDYjtBQUNBO0FBQ0Esc0NBQXNDLGdEQUFnRDtBQUN0Riw2Q0FBNkMsd0VBQXdFO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0dBQWtHLFdBQVc7QUFDN0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxpQkFBaUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxpQkFBaUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLENBQUM7QUFDRDs7Ozs7Ozs7Ozs7O0FDeFlBLG1EIiwiZmlsZSI6InBhbm8tY29udHJvbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJUSFJFRVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJUSFJFRVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJQYW5vQ29udHJvbHNcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJUSFJFRVwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiUGFub0NvbnRyb2xzXCJdID0gZmFjdG9yeShyb290W1wiVEhSRUVcIl0pO1xufSkod2luZG93LCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wYW5vLWNvbnRyb2xzLnRzXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0aHJlZV8xID0gcmVxdWlyZShcInRocmVlXCIpO1xyXG52YXIgVEhSRUUgPSB7IEV2ZW50RGlzcGF0Y2hlcjogdGhyZWVfMS5FdmVudERpc3BhdGNoZXIsIFZlY3RvcjM6IHRocmVlXzEuVmVjdG9yMywgU3BoZXJpY2FsOiB0aHJlZV8xLlNwaGVyaWNhbCwgVmVjdG9yMjogdGhyZWVfMS5WZWN0b3IyLCBQZXJzcGVjdGl2ZUNhbWVyYTogdGhyZWVfMS5QZXJzcGVjdGl2ZUNhbWVyYSB9O1xyXG52YXIgRVBTID0gMC4wMDAwMDE7XHJcbnZhciBQSSA9IE1hdGguUEk7XHJcbnZhciBjbGFtcCA9IGZ1bmN0aW9uICh2YWwsIG1pbiwgbWF4KSB7IHJldHVybiB2YWwgPCBtaW4gPyBtaW4gOiB2YWwgPiBtYXggPyBtYXggOiB2YWw7IH07XHJcbnZhciBsb29wZWROdW1iZXIgPSBmdW5jdGlvbiAodmFsLCBtaW4sIG1heCkgeyByZXR1cm4gdmFsIDwgbWluID8gdmFsICsgbWF4IC0gbWluIDogdmFsID4gbWF4ID8gdmFsICsgbWluIC0gbWF4IDogdmFsOyB9O1xyXG52YXIgUGFub0NvbnRyb2xzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhQYW5vQ29udHJvbHMsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBQYW5vQ29udHJvbHMoY2FtZXJhLCBkb21FbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBfdGhpcy5lbmFibGVSb3RhdGUgPSB0cnVlO1xyXG4gICAgICAgIF90aGlzLmVuYWJsZVJvdGF0ZURhbXBpbmcgPSB0cnVlO1xyXG4gICAgICAgIF90aGlzLmVuYWJsZVNjYWxlID0gdHJ1ZTtcclxuICAgICAgICBfdGhpcy5lbmFibGVTY2FsZURhbXBpbmcgPSB0cnVlO1xyXG4gICAgICAgIF90aGlzLnJvdGF0ZVNwZWVkID0gMTIwO1xyXG4gICAgICAgIF90aGlzLnNjYWxlU3BlZWQgPSAtMTAwO1xyXG4gICAgICAgIF90aGlzLnJvdGF0ZVNtb290aEZhY3RvciA9IDAuOTtcclxuICAgICAgICBfdGhpcy5zY2FsZVNtb290aEZhY3RvciA9IDAuOTtcclxuICAgICAgICBfdGhpcy5TVEFURVMgPSB7XHJcbiAgICAgICAgICAgIE5PTkU6IDAsXHJcbiAgICAgICAgICAgIFJPVEFURTogMSxcclxuICAgICAgICAgICAgU0NBTEU6IDEgPDwgMSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLnN0YXRlID0gX3RoaXMuU1RBVEVTLk5PTkU7XHJcbiAgICAgICAgX3RoaXMuUk9UQVRFX0VWRU5UID0ge1xyXG4gICAgICAgICAgICB0eXBlOiBcInJvdGF0ZVwiXHJcbiAgICAgICAgfTtcclxuICAgICAgICBfdGhpcy5TQ0FMRV9FVkVOVCA9IHtcclxuICAgICAgICAgICAgdHlwZTogXCJzY2FsZVwiXHJcbiAgICAgICAgfTtcclxuICAgICAgICBfdGhpcy5DSEFOR0VfRVZFTlQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiY2hhbmdlXCJcclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLklOVEVSQUNUX0VWRU5UID0ge1xyXG4gICAgICAgICAgICB0eXBlOiBcImludGVyYWN0XCJcclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLl9taW5Gb3YgPSA0MDtcclxuICAgICAgICBfdGhpcy5fbWF4Rm92ID0gMTQwO1xyXG4gICAgICAgIF90aGlzLl9taW5WID0gRVBTO1xyXG4gICAgICAgIF90aGlzLl9tYXhWID0gMTgwIC0gRVBTO1xyXG4gICAgICAgIF90aGlzLl9taW5IID0gLTE4MDtcclxuICAgICAgICBfdGhpcy5fbWF4SCA9IDE4MDtcclxuICAgICAgICBfdGhpcy50YXJnZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gICAgICAgIF90aGlzLnNwaGVyaWNhbCA9IG5ldyBUSFJFRS5TcGhlcmljYWwoKTtcclxuICAgICAgICBfdGhpcy50b3VjaFNjYWxlU3RhcnQgPSAwO1xyXG4gICAgICAgIF90aGlzLnNjYWxlRGVsdGEgPSAwO1xyXG4gICAgICAgIF90aGlzLnRvdWNoU2NhbGVFbmQgPSAwO1xyXG4gICAgICAgIF90aGlzLnJvdGF0ZVN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgICAgICBfdGhpcy5yb3RhdGVEZWx0YSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcbiAgICAgICAgX3RoaXMucm90YXRlRW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuICAgICAgICBfdGhpcy5zZXRDdXJzb3IgPSBmdW5jdGlvbiAoY3Vyc29yU3RyKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmRvbUVsZW1lbnQuc3R5bGUuY3Vyc29yID0gY3Vyc29yU3RyO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgX3RoaXMub25SZXNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhbmdsZSA9IChzY3JlZW4ubXNPcmllbnRhdGlvbiB8fCBzY3JlZW4ubW96T3JpZW50YXRpb24gfHwgKHNjcmVlbi5vcmllbnRhdGlvbiB8fCB7IGFuZ2xlOiAwIH0pKS5hbmdsZTtcclxuICAgICAgICAgICAgdmFyIGlzSG9yaXpvblNjcmVlbiA9IChhbmdsZSA+IDQ1ICYmIGFuZ2xlIDwgMTM1KSB8fCAoYW5nbGUgPiAyMjUgJiYgYW5nbGUgPCAzMTUpO1xyXG4gICAgICAgICAgICB2YXIgX2EgPSB3aW5kb3cuc2NyZWVuLCB3aWR0aCA9IF9hLndpZHRoLCBoZWlnaHQgPSBfYS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmIChpc0hvcml6b25TY3JlZW4pIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmRvbVNpemVWZWN0b3JzLnNldCh3aWR0aCwgd2lkdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZG9tU2l6ZVZlY3RvcnMuc2V0KGhlaWdodCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgX3RoaXMub25Ub3VjaFN0YXJ0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgdG91Y2hlcyA9IGUudG91Y2hlcztcclxuICAgICAgICAgICAgc3dpdGNoICh0b3VjaGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm9uUm90YXRlU3RhcnQodG91Y2hlc1swXSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMub25Ub3VjaFNjYWxlU3RhcnQodG91Y2hlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLm9uVG91Y2hNb3ZlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgdG91Y2hlcyA9IGUudG91Y2hlcztcclxuICAgICAgICAgICAgc3dpdGNoICh0b3VjaGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm9uUm90YXRlKHRvdWNoZXNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm9uVG91Y2hTY2FsZSh0b3VjaGVzKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgX3RoaXMub25Ub3VjaEVuZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIHRvdGFsVG91Y2hlc0xlbmd0aCA9IGUudG91Y2hlcy5sZW5ndGggKyBlLmNoYW5nZWRUb3VjaGVzLmxlbmd0aDtcclxuICAgICAgICAgICAgc3dpdGNoICh0b3RhbFRvdWNoZXNMZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5vblJvdGF0ZUVuZChlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5vblRvdWNoU2NhbGVFbmQoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLm9uTW91c2VEb3duID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgX3RoaXMuc2V0Q3Vyc29yKFwiZ3JhYmJpbmdcIik7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgX3RoaXMub25Sb3RhdGVTdGFydChlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLm9uTW91c2VNb3ZlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5vblJvdGF0ZShlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLm9uTW91c2VVcCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnNldEN1cnNvcihcImdyYWJcIik7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgX3RoaXMub25Sb3RhdGVFbmQoZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBfdGhpcy5vbldoZWVsID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5vbk1vdXNlU2NhbGUoZS5kZWx0YVkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgX3RoaXMuY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgICAgIF90aGlzLmRvbUVsZW1lbnQgPSBkb21FbGVtZW50O1xyXG4gICAgICAgIF90aGlzLnNldEN1cnNvcihcImdyYWJcIik7XHJcbiAgICAgICAgdmFyIHYgPSBjYW1lcmEuZ2V0V29ybGREaXJlY3Rpb24obmV3IFRIUkVFLlZlY3RvcjMoKSk7XHJcbiAgICAgICAgX3RoaXMuc3BoZXJpY2FsLnNldEZyb21WZWN0b3IzKHYpO1xyXG4gICAgICAgIF90aGlzLnRhcmdldC5jb3B5KGNhbWVyYS5wb3NpdGlvbikuYWRkKHYpO1xyXG4gICAgICAgIHZhciBjbGllbnRXaWR0aCA9IGRvbUVsZW1lbnQuY2xpZW50V2lkdGgsIGNsaWVudEhlaWdodCA9IGRvbUVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIF90aGlzLmRvbVNpemVWZWN0b3JzID0gbmV3IFRIUkVFLlZlY3RvcjIoY2xpZW50SGVpZ2h0LCBjbGllbnRIZWlnaHQpO1xyXG4gICAgICAgIF90aGlzLm9uUmVzaXplKCk7XHJcbiAgICAgICAgX3RoaXMuYWRkRXZlbnRzKCk7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgUGFub0NvbnRyb2xzLnByb3RvdHlwZS5vblJvdGF0ZVN0YXJ0ID0gZnVuY3Rpb24gKF9hLCBpc1RvdWNoKSB7XHJcbiAgICAgICAgdmFyIGNsaWVudFggPSBfYS5jbGllbnRYLCBjbGllbnRZID0gX2EuY2xpZW50WTtcclxuICAgICAgICBpZiAoaXNUb3VjaCA9PT0gdm9pZCAwKSB7IGlzVG91Y2ggPSBmYWxzZTsgfVxyXG4gICAgICAgIHRoaXMuc3RhdGUgfD0gdGhpcy5TVEFURVMuUk9UQVRFO1xyXG4gICAgICAgIHRoaXMucm90YXRlU3RhcnQuc2V0KGNsaWVudFgsIGNsaWVudFkpO1xyXG4gICAgICAgIHRoaXMucm90YXRlRW5kLnNldChjbGllbnRYLCBjbGllbnRZKTtcclxuICAgICAgICBpZiAoaXNUb3VjaCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMub25Ub3VjaE1vdmUpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy5vblRvdWNoRW5kKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdXNlTW92ZSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25Nb3VzZVVwKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGFub0NvbnRyb2xzLnByb3RvdHlwZS5vblJvdGF0ZSA9IGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgIHZhciBjbGllbnRYID0gX2EuY2xpZW50WCwgY2xpZW50WSA9IF9hLmNsaWVudFk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVFbmQuc2V0KGNsaWVudFgsIGNsaWVudFkpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVTdGFydC5zZXQoY2xpZW50WCwgY2xpZW50WSk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuSU5URVJBQ1RfRVZFTlQpO1xyXG4gICAgfTtcclxuICAgIFBhbm9Db250cm9scy5wcm90b3R5cGUub25Sb3RhdGVFbmQgPSBmdW5jdGlvbiAoZSwgaXNUb3VjaCkge1xyXG4gICAgICAgIGlmIChpc1RvdWNoID09PSB2b2lkIDApIHsgaXNUb3VjaCA9IGZhbHNlOyB9XHJcbiAgICAgICAgdGhpcy5zdGF0ZSAmPSB+dGhpcy5TVEFURVMuUk9UQVRFO1xyXG4gICAgICAgIGlmIChpc1RvdWNoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5vblRvdWNoTW92ZSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLm9uVG91Y2hFbmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm9uTW91c2VNb3ZlKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5vbk1vdXNlVXApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQYW5vQ29udHJvbHMucHJvdG90eXBlLm9uVG91Y2hTY2FsZVN0YXJ0ID0gZnVuY3Rpb24gKHRvdWNoZXMpIHtcclxuICAgICAgICB0aGlzLnN0YXRlIHw9IHRoaXMuU1RBVEVTLlNDQUxFO1xyXG4gICAgICAgIHZhciBfYSA9IHRvdWNoZXNbMF0sIHgxID0gX2EuY2xpZW50WCwgeTEgPSBfYS5jbGllbnRZO1xyXG4gICAgICAgIHZhciBfYiA9IHRvdWNoZXNbMV0sIHgyID0gX2IuY2xpZW50WCwgeTIgPSBfYi5jbGllbnRZO1xyXG4gICAgICAgIHRoaXMudG91Y2hTY2FsZVN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjIoeDEsIHkxKS5kaXN0YW5jZVRvKG5ldyBUSFJFRS5WZWN0b3IyKHgyLCB5MikpIC8gdGhpcy5kb21TaXplVmVjdG9ycy54O1xyXG4gICAgICAgIHRoaXMudG91Y2hTY2FsZUVuZCA9IHRoaXMudG91Y2hTY2FsZVN0YXJ0O1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5vblRvdWNoTW92ZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMub25Ub3VjaEVuZCk7XHJcbiAgICB9O1xyXG4gICAgUGFub0NvbnRyb2xzLnByb3RvdHlwZS5vblRvdWNoU2NhbGUgPSBmdW5jdGlvbiAodG91Y2hlcykge1xyXG4gICAgICAgIHZhciBfYSA9IHRvdWNoZXNbMF0sIHgxID0gX2EuY2xpZW50WCwgeTEgPSBfYS5jbGllbnRZO1xyXG4gICAgICAgIHZhciBfYiA9IHRvdWNoZXNbMV0sIHgyID0gX2IuY2xpZW50WCwgeTIgPSBfYi5jbGllbnRZO1xyXG4gICAgICAgIHRoaXMudG91Y2hTY2FsZUVuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKHgxLCB5MSkuZGlzdGFuY2VUbyhuZXcgVEhSRUUuVmVjdG9yMih4MiwgeTIpKSAvIHRoaXMuZG9tU2l6ZVZlY3RvcnMueDtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMudG91Y2hTY2FsZVN0YXJ0ID0gdGhpcy50b3VjaFNjYWxlRW5kO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLklOVEVSQUNUX0VWRU5UKTtcclxuICAgIH07XHJcbiAgICBQYW5vQ29udHJvbHMucHJvdG90eXBlLm9uVG91Y2hTY2FsZUVuZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSAmPSB+dGhpcy5TVEFURVMuU0NBTEU7XHJcbiAgICAgICAgdGhpcy50b3VjaFNjYWxlU3RhcnQgPSAwO1xyXG4gICAgICAgIHRoaXMudG91Y2hTY2FsZUVuZCA9IDA7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLm9uVG91Y2hNb3ZlKTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy5vblRvdWNoRW5kKTtcclxuICAgIH07XHJcbiAgICBQYW5vQ29udHJvbHMucHJvdG90eXBlLm9uTW91c2VTY2FsZSA9IGZ1bmN0aW9uIChkZWx0YVkpIHtcclxuICAgICAgICBpZiAoTWF0aC5hYnMoZGVsdGFZKSA8IDEwKSB7XHJcbiAgICAgICAgICAgIGRlbHRhWSAqPSA0MDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGF0ZSB8PSB0aGlzLlNUQVRFUy5TQ0FMRTtcclxuICAgICAgICB0aGlzLnRvdWNoU2NhbGVTdGFydCA9IDA7XHJcbiAgICAgICAgdGhpcy50b3VjaFNjYWxlRW5kID0gLWRlbHRhWSAvIDcwMDA7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLnN0YXRlICY9IH50aGlzLlNUQVRFUy5TQ0FMRTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5JTlRFUkFDVF9FVkVOVCk7XHJcbiAgICB9O1xyXG4gICAgUGFub0NvbnRyb2xzLnByb3RvdHlwZS5hZGRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbk1vdXNlRG93bik7XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMub25Ub3VjaFN0YXJ0KTtcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIndoZWVsXCIsIHRoaXMub25XaGVlbCk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5vblJlc2l6ZSk7XHJcbiAgICB9O1xyXG4gICAgUGFub0NvbnRyb2xzLnByb3RvdHlwZS5yZW1vdmVFdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbk1vdXNlRG93bik7XHJcbiAgICAgICAgdGhpcy5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMub25Ub3VjaFN0YXJ0KTtcclxuICAgICAgICB0aGlzLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIndoZWVsXCIsIHRoaXMub25XaGVlbCk7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5vblJlc2l6ZSk7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLm9uVG91Y2hNb3ZlKTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy5vblRvdWNoRW5kKTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMub25Nb3VzZU1vdmUpO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25Nb3VzZVVwKTtcclxuICAgIH07XHJcbiAgICBQYW5vQ29udHJvbHMucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByb3RhdGVOZWVkVXBkYXRlID0gdGhpcy5lbmFibGVSb3RhdGUgJiYgdGhpcy51cGRhdGVSb3RhdGVEZWx0YSgpO1xyXG4gICAgICAgIHZhciBzY2FsZU5lZWRVcGRhdGUgPSB0aGlzLmVuYWJsZVNjYWxlICYmIHRoaXMudXBkYXRlU2NhbGVEZWx0YSgpO1xyXG4gICAgICAgIGlmIChyb3RhdGVOZWVkVXBkYXRlIHx8IHNjYWxlTmVlZFVwZGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbWVyYSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQYW5vQ29udHJvbHMucHJvdG90eXBlLnVwZGF0ZUNhbWVyYSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLCB0YXJnZXQgPSBfYS50YXJnZXQsIHNwaGVyaWNhbCA9IF9hLnNwaGVyaWNhbCwgY2FtZXJhID0gX2EuY2FtZXJhO1xyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLkNIQU5HRV9FVkVOVCk7XHJcbiAgICAgICAgdGFyZ2V0LnNldEZyb21TcGhlcmljYWwoc3BoZXJpY2FsKS5hZGQoY2FtZXJhLnBvc2l0aW9uKTtcclxuICAgICAgICBjYW1lcmEubG9va0F0KHRhcmdldCk7XHJcbiAgICAgICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuICAgIH07XHJcbiAgICBQYW5vQ29udHJvbHMucHJvdG90eXBlLnVwZGF0ZVJvdGF0ZURlbHRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBuZWVkc1VwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlICYgdGhpcy5TVEFURVMuUk9UQVRFKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlRGVsdGEuc3ViVmVjdG9ycyh0aGlzLnJvdGF0ZUVuZCwgdGhpcy5yb3RhdGVTdGFydCkuZGl2aWRlKHRoaXMuZG9tU2l6ZVZlY3RvcnMpLm11bHRpcGx5U2NhbGFyKHRoaXMucm90YXRlU3BlZWQpO1xyXG4gICAgICAgICAgICB0aGlzLmggKz0gdGhpcy5yb3RhdGVEZWx0YS54O1xyXG4gICAgICAgICAgICB0aGlzLnYgLT0gdGhpcy5yb3RhdGVEZWx0YS55O1xyXG4gICAgICAgICAgICBuZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbmFibGVSb3RhdGVEYW1waW5nICYmIHRoaXMucm90YXRlRGVsdGEubGVuZ3RoU3EoKSA+IEVQUykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3RhdGVEZWx0YS5tdWx0aXBseVNjYWxhcih0aGlzLnJvdGF0ZVNtb290aEZhY3Rvcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmggKz0gdGhpcy5yb3RhdGVEZWx0YS54O1xyXG4gICAgICAgICAgICAgICAgdGhpcy52IC09IHRoaXMucm90YXRlRGVsdGEueTtcclxuICAgICAgICAgICAgICAgIG5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm90YXRlRGVsdGEuc2V0KDAsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZWVkc1VwZGF0ZTtcclxuICAgIH07XHJcbiAgICBQYW5vQ29udHJvbHMucHJvdG90eXBlLnVwZGF0ZVNjYWxlRGVsdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG5lZWRzVXBkYXRlID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgJiB0aGlzLlNUQVRFUy5TQ0FMRSkge1xyXG4gICAgICAgICAgICB0aGlzLnNjYWxlRGVsdGEgPSAodGhpcy50b3VjaFNjYWxlRW5kIC0gdGhpcy50b3VjaFNjYWxlU3RhcnQpICogdGhpcy5zY2FsZVNwZWVkO1xyXG4gICAgICAgICAgICB0aGlzLmZvdiArPSB0aGlzLnNjYWxlRGVsdGE7XHJcbiAgICAgICAgICAgIG5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZVNjYWxlRGFtcGluZyAmJiBNYXRoLmFicyh0aGlzLnNjYWxlRGVsdGEpID4gRVBTKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjYWxlRGVsdGEgKj0gdGhpcy5zY2FsZVNtb290aEZhY3RvcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm92ICs9IHRoaXMuc2NhbGVEZWx0YTtcclxuICAgICAgICAgICAgICAgIG5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGVEZWx0YSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5lZWRzVXBkYXRlO1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQYW5vQ29udHJvbHMucHJvdG90eXBlLCBcImhcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zcGhlcmljYWwudGhldGEgKiAxODAgLyBQSTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICB2YWwgPSBsb29wZWROdW1iZXIodmFsLCB0aGlzLm1pbkgsIHRoaXMubWF4SCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3BoZXJpY2FsLnRoZXRhID0gdmFsIC8gMTgwICogUEk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLlJPVEFURV9FVkVOVCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUGFub0NvbnRyb2xzLnByb3RvdHlwZSwgXCJ2XCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3BoZXJpY2FsLnBoaSAqIDE4MCAvIFBJO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgIHZhbCA9IGNsYW1wKHZhbCwgdGhpcy5taW5WLCB0aGlzLm1heFYpO1xyXG4gICAgICAgICAgICB0aGlzLnNwaGVyaWNhbC5waGkgPSB2YWwgLyAxODAgKiBQSTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuUk9UQVRFX0VWRU5UKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQYW5vQ29udHJvbHMucHJvdG90eXBlLCBcImZvdlwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbWVyYS5mb3Y7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgdmFsID0gY2xhbXAodmFsLCB0aGlzLm1pbkZvdiwgdGhpcy5tYXhGb3YpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbWVyYS5mb3YgPSB2YWw7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLlNDQUxFX0VWRU5UKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQYW5vQ29udHJvbHMucHJvdG90eXBlLCBcIm1pbkZvdlwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9taW5Gb3Y7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgdmFsID0gY2xhbXAodmFsLCBFUFMsIDE4MCAtIEVQUyk7XHJcbiAgICAgICAgICAgIHRoaXMuX21pbkZvdiA9IHZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQYW5vQ29udHJvbHMucHJvdG90eXBlLCBcIm1heEZvdlwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXhGb3Y7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgdmFsID0gY2xhbXAodmFsLCBFUFMsIDE4MCAtIEVQUyk7XHJcbiAgICAgICAgICAgIHRoaXMuX21heEZvdiA9IHZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQYW5vQ29udHJvbHMucHJvdG90eXBlLCBcIm1pblZcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWluVjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICB2YWwgPSBjbGFtcCh2YWwsIEVQUywgMTgwIC0gRVBTKTtcclxuICAgICAgICAgICAgdGhpcy5fbWluViA9IHZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQYW5vQ29udHJvbHMucHJvdG90eXBlLCBcIm1heFZcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4VjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICB2YWwgPSBjbGFtcCh2YWwsIEVQUywgMTgwIC0gRVBTKTtcclxuICAgICAgICAgICAgdGhpcy5fbWF4ViA9IHZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQYW5vQ29udHJvbHMucHJvdG90eXBlLCBcIm1pbkhcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWluSDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICB2YWwgPSBjbGFtcCh2YWwsIC0xODAsIDE4MCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21pbkggPSB2YWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUGFub0NvbnRyb2xzLnByb3RvdHlwZSwgXCJtYXhIXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21heEg7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgdmFsID0gY2xhbXAodmFsLCAtMTgwLCAxODApO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXhIID0gdmFsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIFBhbm9Db250cm9scztcclxufShUSFJFRS5FdmVudERpc3BhdGNoZXIpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUGFub0NvbnRyb2xzO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXzsiXSwic291cmNlUm9vdCI6IiJ9