import * as THREE from "three";
declare class PanoControls extends THREE.EventDispatcher {
    enabled: boolean;
    enableLooped: boolean;
    enableRotate: boolean;
    enableRotateDamping: boolean;
    enableScale: boolean;
    enableScaleDamping: boolean;
    /**
     * 手指滑过一个[this.domSizeVectors.x]时，h(或v)的变化量
     */
    rotateSpeed: number;
    /**
     * 手指扩张一个[this.domSizeVectors.x]时，fov的变化量
     */
    scaleSpeed: number;
    /**
     * 每个代码执行周期内 自动旋转的角度
     * 该值乘以fps(一般为60)即为每秒旋转的角度
     */
    autoRotateSpeed: number;
    /**
     * 启动自动旋转的时间间隔
     */
    autoRotateInterval: number;
    /**
     * h/v发生设置行为(不论是否变动)时触发
     */
    readonly ROTATE_EVENT: {
        type: string;
    };
    /**
     * fov发生设置行为(不论是否变动)时触发
     */
    readonly SCALE_EVENT: {
        type: string;
    };
    /**
     * updateCamera时触发
     */
    readonly CHANGE_EVENT: {
        type: string;
    };
    /**
     * 用户交互时触发
     */
    readonly INTERACT_EVENT: {
        type: string;
    };
    camera: THREE.PerspectiveCamera;
    domElement: HTMLElement;
    /**
     * 一个尺寸的量，触摸旋转时以此为基准
     * 该值越大，则旋转同样角度，手指需要滑动的距离越大
     */
    domSizeVectors: THREE.Vector2;
    private _STATES;
    private _state;
    private _minFov;
    private _maxFov;
    private _minV;
    private _maxV;
    private _minH;
    private _maxH;
    private _rotateSmoothFactor;
    private _scaleSmoothFactor;
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
    /**
     * resize的时候重置domSizeVectors
     */
    onResize: () => void;
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: (e: TouchEvent) => void;
    onMouseDown: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onWheel: (e: WheelEvent) => void;
    constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement);
    resetAutoRotateTimer(): void;
    onRotateStart({ clientX, clientY }: MouseEvent | Touch, isTouch?: boolean): void;
    onRotate({ clientX, clientY }: MouseEvent | Touch): void;
    onRotateEnd(e: MouseEvent | TouchEvent, isTouch?: boolean): void;
    onTouchScaleStart(touches: TouchList): void;
    onTouchScale(touches: TouchList): void;
    onTouchScaleEnd(): void;
    onMouseScale(deltaY: number): void;
    addEvents(): void;
    removeEvents(): void;
    update(): void;
    updateCamera(): void;
    updateRotateDelta(): boolean;
    updateScaleDelta(): boolean;
    get enableAutoRotate(): boolean;
    set enableAutoRotate(val: boolean);
    /**
     * 旋转衰减因子，between 0 and 1
     */
    get rotateSmoothFactor(): number;
    set rotateSmoothFactor(val: number);
    /**
     * 缩放衰减因子，between 0 and 1
     */
    set scaleSmoothFactor(val: number);
    get scaleSmoothFactor(): number;
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
