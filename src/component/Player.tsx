import React, { useContext, useEffect, useRef, RefObject } from "react";
import { MathUtils, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { CameraControls, useKeyboardControls } from '@react-three/drei';
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { UserContext } from '@/component/UserProvider';

type playerProps = {
    playerRigidBodyRef: RefObject<RapierRigidBody | null>;
    cameraControlRef: React.RefObject<CameraControls>;
    setPosition: (pos: [number, number]) => void; //座標情報
    setRotation: (rot: number) => void;
    initialPosition: [number, number, number]; //初期座標情報
    initialRotation: [number, number]; //初期角度情報(azimuthAngle, polarAngle)
}

const { DEG2RAD } = MathUtils;

const reflectVector = (total: Vector3, vacA: Vector3, vecB: Vector3, rigidBodyRef: RefObject<RapierRigidBody>) => {
    if (rigidBodyRef.current instanceof RapierRigidBody) {
        if (total instanceof Vector3 && vacA instanceof Vector3 && vecB instanceof Vector3) {
            total.addVectors(vacA, vecB);
            rigidBodyRef.current.setLinvel({
                x: total.x,
                y: total.y,
                z: total.z
            }, true);
        }
    }
}

export const Player = (props: playerProps) => {
    const { playerRigidBodyRef, cameraControlRef, setPosition, setRotation, initialPosition, initialRotation } = props;

    const MOVE_SPEED = 2;
    const { movValue, rotValue } = useContext(UserContext);
    const [, getKeys ] = useKeyboardControls();
    const isColliderLoadedRef = useRef(false);
    // playerRigidBodyRefのcurrentを追跡するためのuseRef
    const playerRigidBodyCurrent = useRef(playerRigidBodyRef.current);
    const initialRotationSet = useRef(false);  // 初期設定が行われたかを追跡

    useEffect(() => {
        if (cameraControlRef.current && !initialRotationSet.current) {
            const [azimuth, polar] = initialRotation;
    
            if ( cameraControlRef.current.azimuthAngle !== azimuth * Math.PI / 180 || cameraControlRef.current.polarAngle !== polar * Math.PI / 180 ) {
                cameraControlRef.current.azimuthAngle = azimuth * Math.PI / 180;
                cameraControlRef.current.polarAngle = polar * Math.PI / 180;
                // 初期化完了フラグを立てる
                initialRotationSet.current = true;
            }
        }
    }, [cameraControlRef, initialRotation]);

    useEffect(() => {
        if (playerRigidBodyRef.current) {
            playerRigidBodyRef.current.setLinearDamping(50); // 数値を上げると慣性が減る
        } else {
            playerRigidBodyCurrent.current = playerRigidBodyRef.current;
        }
    }, [playerRigidBodyRef]);
    
    // コライダがロードされてからプレイヤーを動かす処理
    useEffect(() => {
        if (isColliderLoadedRef.current && playerRigidBodyRef.current) {
            // コライダがロードされた後、プレイヤーが物理エンジンで動作するようにする
            playerRigidBodyRef.current.setEnabled(true);
            isColliderLoadedRef.current = true; // コライダのロード完了を記録
        }
    }, [playerRigidBodyRef]);

    useEffect(() => {
        if (playerRigidBodyRef.current) {
          // playerRigidBodyRefが変わった場合に呼ばれる処理
          console.log('RigidBodyRef updated');
        }
    }, [playerRigidBodyRef]); // 参照のcurrentを依存関係に追加
    
    useEffect(() => {
        if (playerRigidBodyRef.current) {
          // playerRigidBodyRefが変わるタイミングで発火する処理
          console.log('Player rigidbody initialized.');
        }
    }, [playerRigidBodyRef]); // 依存関係配列にplayerRigidBodyRefを追加

    useFrame(() => {
        const { forward, backward, left, right } = getKeys(); //キー操作を受け取ったら

        const velocity = new Vector3();
        const frontVector = new Vector3();
        const sideVector = new Vector3();
        
        // CameraControlsが管理しているカメラを取得する
        const currentCamera = cameraControlRef.current?.camera;
        
        if (playerRigidBodyRef.current) {
            const pos = playerRigidBodyRef.current.translation();
            const azimuthAngle = cameraControlRef.current?.azimuthAngle || 0;
            const mapBoxRotation = -(azimuthAngle + Math.PI);

            setPosition([pos.x, pos.z]);
            setRotation(mapBoxRotation);

            if (currentCamera) {
                currentCamera.position.set(pos.x, pos.y, pos.z);
                currentCamera.getWorldDirection(velocity);
            }
            const camDirection = velocity.setY(0).normalize();
            camDirection.applyAxisAngle(new Vector3(0, 1, 0), 0);
            velocity.y = 0;
            velocity.normalize();
        }

        if ( forward ) {
            frontVector.add(velocity.multiplyScalar(MOVE_SPEED));
        }
        if ( backward ) {
            frontVector.add(velocity.multiplyScalar(MOVE_SPEED * -1));
        }

        if ( rotValue ) {
            cameraControlRef.current?.rotate(rotValue * -0.01, 0, true);
        }

        if( left || right ){
            if ( left ) {
                cameraControlRef.current?.rotate(DEG2RAD, 0, true);
            } else {
                cameraControlRef.current?.rotate(DEG2RAD * -1, 0, true);
            }
        }

        if (forward || backward || left || right || movValue) {
            const currentRigidBody = playerRigidBodyRef.current;
            // currentRigidBodyがnullでないことを確認
            if (currentRigidBody) {  
                reflectVector(velocity, frontVector, sideVector, playerRigidBodyRef as RefObject<RapierRigidBody>);
            }
        }
    });

    return (
        <RigidBody position={initialPosition} ref={playerRigidBodyRef} friction={0.3} mass={1} lockRotations colliders={false} enabledRotations={[false, false, false]}>
            <CameraControls ref={cameraControlRef} />
            {/* 物理コライダ */}
            <CapsuleCollider args={[0.5, 0.25]}  position={[0, -0.70, 0]}/>
        </RigidBody>
    );
}