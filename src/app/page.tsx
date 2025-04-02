"use client";
import React, { Suspense, useCallback, useRef, useState, useEffect } from "react";
import { PerspectiveCamera, Vector2 } from 'three';
import { Canvas } from '@react-three/fiber';
import { CameraControls, KeyboardControls, } from '@react-three/drei';
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { LccRenderer } from '@/component/LccRenderer';
import { Collider } from "@/component/modelDataLoader";
import { Player } from '@/component/Player';
import { MapPanel } from "@/component/MapPanel";
import { ViewPanel } from "@/component/ViewPanel";
import SpriteButton from "@/component/SpriteButton";
import ImageWall from "@/component/ImageWall";
import { handleThumbnailClick } from '@/func/viewControl';
import { ExtendedThumbnailData } from "@/func/types";
import styles from '@/styles/page.module.css';

//ViewPanelのサムネイル画像パスと遷移先座標及び角度
const thumbnails: ExtendedThumbnailData[] = [
    {
        src: "/images/thumb/thumb_01.png",
        id: 1,
        position: [0, 1.25, 0], //
        rotation: [225, 90],
    },
    {
        src: "/images/thumb/thumb_02.png",
        id: 2,
        position: [4, 1.25, 6],
        rotation: [45, 90]
    },
    {
        src: "/images/thumb/thumb_03.png",
        id: 3,
        position: [-4.75, 1.25, 4.5],
        rotation: [270, 90]
    },
    {
        src: "/images/thumb/thumb_04.png",
        id: 4,
        position: [1.65, 1.22, -5.5],
        rotation: [180, 90]
    },
    {
        src: "/images/thumb/thumb_05.png",
        id: 5,
        position: [5, 1.25, 0],
        rotation: [155, 90]
    },
];

export default function Home() {

    const [loading, setLoading] = useState(true); // ローダーの表示/非表示判定用useState
    const [fadeOut, setFadeOut] = useState(true); // ローダーのフェードアウト判定用useState
    const [colliderLoaded, setColliderLoaded] = useState(false); // Colliderコンポーネントのロード完了判定用useState
    const [lccLoaded, setLccLoaded] = useState(false); //LccRendererコンポーネントのロード完了判定用useState

    const playerRigidBodyRef = useRef<RapierRigidBody | null>(null); // 重力制御用
    const cameraControlRef = useRef<CameraControls>(null!); // PlayerのCamera参照
    const cameraRef = useRef<PerspectiveCamera | null>(null);

    const [playerPosition, setPlayerPosition] = useState<[number, number]>([0, 0]); // Playerの座標取得用
    const [playerRotation, setPlayerRotation] = useState<number>(0); // Playerの座標取得用

    //SpriteButtonの座標配列
    const buttonPositions: [number, number, number][] = [
        [1.6, 1, -6.2]
    ];

    useEffect(() => {
        if (colliderLoaded && lccLoaded) {
            setFadeOut(false);
            setTimeout(() => {
                // 0.3秒後にdivを非表示にする
                setLoading(false);
            }, 500); // 0.5秒後に非表示に
        }
    }, [colliderLoaded, lccLoaded]);

    //Colliderコンポーネントのロード完了判定
    const handleColliderLoad = useCallback(() => {
        console.log("Collider load Complete.");
        setColliderLoaded(true);
        if (playerRigidBodyRef.current) {
            // RigidBodyを有効化する
            playerRigidBodyRef.current.setEnabled(true);
            // あるいは、kinematicにすることもできる
            // playerRigidBodyRef.current.setKinematic(false);
        }
    }, []);

    //LccRendererコンポーネントのロード完了判定
    const handleLccLoad = useCallback(() => {
        console.log("LccRenderer load Complete.");
        setLccLoaded(true);
    }, []);

    useEffect(() => {
        if (cameraRef.current && cameraControlRef.current) {
            cameraControlRef.current.camera = cameraRef.current;
        }
    }, []);  // カメラ参照が変わらない限り一度だけ実行

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
            {loading && (
                <div className={styles.loaderOverlay} style={fadeOut ? { opacity: 1 } : { opacity: 0 }}>Loading...</div>
            )}
            <Canvas style={{ width: '100%', height: '100%' }}>
                <Physics gravity={[0, -1.5, 0]} colliders={false} /*debug*/>
                    <Suspense fallback={<></>}>
                        {/* Colliderの読み込み完了時にhandleColliderLoadを呼ぶ */}
                        <Collider colliderDataPath={"https://biz.active-d.net/next_test/data/gltf/2024_11_29_125713.gltf"} onLoaded={handleColliderLoad} rotation={[0, Math.PI / 12, 0]} position={[2.95, 0, 0.54]} glbRefFlg={true} />
                        <KeyboardControls map={[
                            { name: "forward", keys: ["KeyW", "ArrowUp"] },
                            { name: "backward", keys: ["KeyS", "ArrowDown"] },
                            { name: "left", keys: ["KeyA", "ArrowLeft"] },
                            { name: "right", keys: ["KeyD", "ArrowRight"] },
                        ]}
                        >
                            <Player playerRigidBodyRef={playerRigidBodyRef} cameraControlRef={cameraControlRef} initialPosition={[0, 1.25, 0]} initialRotation={[-135, 90]} setPosition={setPlayerPosition} setRotation={setPlayerRotation} />
                        </KeyboardControls>
                        <ImageWall position={[5.65, 1.47, 2.85]} texturePath="/images/other/longpano_a.png" linkPath="https://active-rt.com/works/%e3%83%aa%e3%82%a2%e3%83%ab%e3%82%bf%e3%82%a4%e3%83%a0%e3%82%a6%e3%82%a9%e3%83%bc%e3%82%af%e3%82%b9%e3%83%ab%e3%83%bc%e3%82%b3%e3%83%b3%e3%83%86%e3%83%b3%e3%83%84/" />
                        <ImageWall position={[2.2, 1.47, 6.54]} rotation={[0, Math.PI / -2, 0]} texturePath="/images/other/longpano_b.png" linkPath="https://active-rt.com/works/%e4%bc%9a%e5%93%a1%e5%88%b6%e3%83%90%e3%83%bc%e3%83%81%e3%83%a3%e3%83%ab%e5%b1%95%e7%a4%ba%e4%bc%9a%e3%83%95%e3%82%a9%e3%83%bc%e3%83%a0/" />
                        {buttonPositions.map((pos, index) => (
                            <SpriteButton key={index} position={pos} imagePath="/images/spot/link.png" hoverImagePath="/images/spot/link_fcs.png" onClick={() => alert(`ボタン ${index + 1} 押した！`)} />
                        ))}
                        {/* LccRendererの読み込み完了時にhandleLccLoadを呼ぶ */}
                        <LccRenderer dataPath="https://biz.active-d.net/next_test/data/2024-11-29-125713/meta.lcc" gpuAcceleration={true} onLoaded={handleLccLoad} />
                    </Suspense>
                </Physics>

            </Canvas>
            <MapPanel imagePath={"/images/map/map_shinsaibashi_2f.png"} mapArea={new Vector2(11.4, 13)} playerPos={[parseFloat(playerPosition[0].toFixed(4)), parseFloat(playerPosition[1].toFixed(4))]} playerRot={parseFloat(playerRotation.toFixed(4))} />
            <ViewPanel onClick={(data) => handleThumbnailClick(data, cameraControlRef, playerRigidBodyRef)} thumbnails={thumbnails} />
        </div>
    );
}