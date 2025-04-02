import React, { useState, useEffect } from 'react';
import { Euler, Quaternion, Vector2 } from "three";
import { Group, Box, Image, Text } from '@mantine/core';
import { useWindowAspectRatio } from "@/context/WindowSizeContext";
import styles from "@/styles/MapPanel.module.css"

type mapPanelProps = {
    imagePath: string;
    mapArea: Vector2;
    playerPos: [number, number];
    playerRot: number;
}

export const MapPanel = (props: mapPanelProps) => {
    const { imagePath, mapArea, playerPos, playerRot } = props;
    const [ mapWidth, setMapWidth ] = useState<number>(0);
    const [ mapHeight, setMapHeight ] = useState<number>(0);
    const [isTabClicked, setIsTabClicked] = useState<boolean>(false);  // クリック状態を管理するステート

    // <Group>のサイズを取得してスケーリング
    useEffect(() => {
        const mapAreaElement = document.querySelector(`.${styles.mapArea}`);
        if (mapAreaElement) {
            setMapWidth(mapAreaElement.clientWidth);
            setMapHeight(mapAreaElement.clientHeight);
        }
    }, []);

    // mapAreaのサイズとGroupのサイズを基に換算値を生成
    const scaleX = mapWidth / mapArea.x;
    const scaleY = mapHeight / mapArea.y;
    // 実際のマップ座標をスケーリング
    const scaledX = (playerPos[0] - mapArea.x / 2) * scaleX;
    const scaledY = (playerPos[1] - mapArea.y / 2) * scaleY;
    
    // ゼロ座標が50%なのでその分補正
    const correctedX = ((scaledX / mapWidth) * -100);
    const correctedY = ((scaledY / mapHeight) * -100);

    //ウィンドウの縦横比率を取得
    const windowAspectRatio = useWindowAspectRatio();
    const quaternion = new Quaternion();
    quaternion.setFromEuler(new Euler(0, playerRot, 0)); // まずEulerからQuaternionに変換
    const euler = new Euler().setFromQuaternion(quaternion, "YXZ"); // "YXZ" 順でオイラー角を取得

    let angleY = euler.y * 180 / Math.PI;  // Y軸の角度を取得

    if (angleY < 0) {
        angleY += 360;  // 0～360 に補正
    }
    
    // ブラウザ画面の縦横比判定。 1未満なら「縦長」 → "width: 60vw"、それ以外なら「横長」 → "width: 30vw"
    const panelWidth = windowAspectRatio < 1 ? "60vw" : "30vw";
    const panelMoveWidth = windowAspectRatio < 1 ? "-60vw" : "-30vw";
    const panelTabWidth = windowAspectRatio < 1 ? "4vw" : "1.5vw";
    const panelTabLeft = windowAspectRatio < 1 ? "-4vw" : "-1.5vw";
    const tabText = windowAspectRatio < 1 ? "30%" : "100%";
    
    const onClickTab = () => {
        setIsTabClicked((prev) => !prev);  // isTabClicked の状態をトグル
    };

    return (
        <>
            <Group className={ styles.mapPanel } style={{ width: panelWidth, right: isTabClicked ? panelMoveWidth : "0" }}>
                <Box className={ styles.mapPanelTab } style={{ width: panelTabWidth, left: panelTabLeft }} onClick={onClickTab}>
                    <Text className={ styles.panelTabTitle } style={{ fontSize: tabText }}>Map</Text>
                </Box>
                <Box className={ styles.mapBase } style={{ width: panelWidth, right: isTabClicked ? panelMoveWidth : "0"}} />
                <Group className={styles.mapArea} style={{ width: "90%" }}>
                    <Image className={styles.mapImage} src={imagePath} alt="" style={{ width: "100%" }}  />
                    <Box className={styles.playerPoint} style={{
                        left: `${correctedX}%`, 
                        top: `${correctedY}%`,
                        transform: `rotate(${angleY}deg)`
                    }} />
                </Group>
            </Group>
        </>
    );
};
MapPanel.displayName = "MapPanel"