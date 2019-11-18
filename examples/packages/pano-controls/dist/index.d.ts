import * as THREE from "three";
declare class PanoControls extends THREE.EventDispatcher {
    enabled: boolean;
    enableRotate: boolean;
    enableRotateDamping: boolean;
    enableScale: boolean;
    enableScaleDamping: boolean;
    rotateSpeed: number;
    scaleSpeed: number;
    rotateSmoothFactor: number;
    scaleSmoothFactor: number;
    autoRotateSpeed: number;
    autoRotateInterval: number;
    STATES: {
        NONE: number;
        ROTATE: number;
        SCALE: number;
    };
    state: number;
    ROTATE_EVENT: {
        type: string;
    };
    SCALE_EVENT: {
        type: string;
    };
    CHANGE_EVENT: {
        type: string;
    };
    INTERACT_EVENT: {
        type: string;
    };
    camera: THREE.PerspectiveCamera;
    domElement: HTMLElement;
    domSizeVectors: THREE.Vector2;
    private _minFov;
    private _maxFov;
    private _minV;
    private _maxV;
    private _minH;
    private _maxH;
    private _enableAutoRotate;
    private _autoRotateStart;
    private target;
    private spherical;
    private touchScaleStart;
    private scaleDelta;
    private touchScaleEnd;
    private rotateStart;
    private rotateDelta;
    private rotateEnd;
    private setCursor;
    onResize: () => void;
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: (e: TouchEvent) => void;
    onMouseDown: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onWheel: (e: WheelEvent) => void;
    constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement);
    onRotateStart({ clientX, clientY }: MouseEvent | Touch, isTouch?: boolean): void;
    onRotate({ clientX, clientY }: MouseEvent | Touch): void;
    onRotateEnd(e: MouseEvent | TouchEvent, isTouch?: boolean): void;
    onTouchScaleStart(touches: TouchList): void;
    onTouchScale(touches: TouchList): void;
    onTouchScaleEnd(e: TouchEvent): void;
    onMouseScale(deltaY: number): void;
    addEvents(): void;
    removeEvents(): void;
    update(): void;
    updateCamera(): void;
    updateRotateDelta(): boolean;
    updateScaleDelta(): boolean;
    get enableAutoRotate(): boolean;
    set enableAutoRotate(val: boolean);
    get h(): number;
    set h(val: number);
    get v(): number;
    set v(val: number);
    get fov(): number;
    set fov(val: number);
    get minFov(): number;
    set minFov(val: number);
    get maxFov(): number;
    set maxFov(val: number);
    get minV(): number;
    set minV(val: number);
    get maxV(): number;
    set maxV(val: number);
    get minH(): number;
    set minH(val: number);
    get maxH(): number;
    set maxH(val: number);
}
export default PanoControls;
