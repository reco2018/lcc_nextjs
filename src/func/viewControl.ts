import { CameraControls } from "@react-three/drei";
import { RapierRigidBody } from "@react-three/rapier";
import { ThumbnailData } from "@/func/types";

export const handleThumbnailClick = ( data: ThumbnailData, cameraControlRef: React.RefObject<CameraControls>, playerRigidBodyRef: React.RefObject<RapierRigidBody | null>) => {
    if (cameraControlRef.current && playerRigidBodyRef.current) {
        const azimuth = data.rotation[0] * Math.PI / 180;
        const polar = Math.max(0.01, Math.min(Math.PI - 0.01, data.rotation[1] * Math.PI / 180));
        cameraControlRef.current.rotateTo(azimuth, polar, false);
        playerRigidBodyRef.current.setTranslation({ x: data.position[0], y: data.position[1], z: data.position[2] }, true);
        console.log("視点切り替え成功じゃ！", data.position, data.rotation);
    } else {
        console.log("fuga");
    }
}