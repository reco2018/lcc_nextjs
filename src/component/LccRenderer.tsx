import { useEffect, useRef } from 'react';
import * as THREE  from 'three';
import { Object3D } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { LCCRender } from "@/lib/lcc-0.4.1.js";

type lccProps = {
    dataPath: string;
    gpuAcceleration?: boolean;
}

// LCCデータのロードコンポーネント
export const LccRenderer = (props: lccProps) => {
    const { dataPath, gpuAcceleration } = props;
    const { scene, gl, camera, } = useThree();
    const lccObjectRef = useRef<unknown>(null);
    
    useEffect(() => {
        lccObjectRef.current = LCCRender.load({
            camera: camera, // ここで useThree のカメラを使用
            scene: scene,
            dataPath: dataPath, // Lcc data path',
            useEnv: false,
            renderLib: THREE,
            canvas: gl.domElement,
            renderer: gl,
            gpuAcceleration: gpuAcceleration,
        },
            (mesh: Object3D) => {
                console.log('Model loaded', mesh);
                mesh.rotation.x = Math.PI / -2; // XZY → XYZ補正
                mesh.rotation.z = Math.PI / 12; // 壁面とXZ軸の平行出し補正
                mesh.position.x = 2.95; // ゼロ座標補正
                mesh.position.z = 0.55; // ゼロ座標補正
        },
            (percent: number) => {
                console.log('Model loaded: ' + percent * 100 + '%'); // ファイルのロード進捗
            }
        );
    }, [scene, gl, camera, dataPath, gpuAcceleration]);
    
    useFrame(() => {
        if (LCCRender.update) {
            LCCRender.update();
        }
    });
    return null;
};