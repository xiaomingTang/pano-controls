import * as THREE from "three";
import { InteractiveElement } from "tang-pano";
declare class PanoControls extends InteractiveElement {
    camera: THREE.PerspectiveCamera;
    private target;
    private spherical;
    constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement);
    update(): void;
    updateCamera(): void;
}
export default PanoControls;
