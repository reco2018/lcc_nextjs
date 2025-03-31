import React, { useState } from 'react';
import { Group, Box, Image, ScrollArea, Text } from '@mantine/core';
import { useWindowAspectRatio } from "@/context/WindowSizeContext";
import { ExtendedThumbnailData } from "@/func/types";
import styles from "@/styles/ViewPanel.module.css"

export interface viewPanelRefType {
    viewOpen: () => void;
}

type viewPanelProps = {
    onClick: (data: ExtendedThumbnailData) => void;
    thumbnails: ExtendedThumbnailData[];
}

export const ViewPanel = (props: viewPanelProps) => {

    const { onClick, thumbnails } = props;

    const [ view /*, viewVisible */] = useState<boolean>(true);
    const [isTabClicked, setIsTabClicked] = useState<boolean>(false);  // クリック状態を管理するステート

    //ウィンドウの縦横比率を取得
    const windowAspectRatio = useWindowAspectRatio();
    // ブラウザ画面の縦横比が 1 未満なら「縦長」 → "height: 20vh"、それ以外なら「横長」 → "height: 30vh"
    const panelHeight = windowAspectRatio < 1 ? "9vh" : "11vh";
    const panelMoveHeight = windowAspectRatio < 1 ? "-9vh" : "-11vh";
    const panelTabHeight = windowAspectRatio < 1 ? "2.5vh" : "3vh";
    const panelTabWidth = windowAspectRatio < 1 ? "30vw" : "16vw";
    const panelTabTop = windowAspectRatio < 1 ? "-2.5vh" : "-3vh";
    const thumbHeight = windowAspectRatio < 1 ? "7vh" : "9vh";
    const tabText = windowAspectRatio < 1 ? "55%" : "100%";

    const onClickTab = () => {
        console.log("タブがクリックされたで！");
        setIsTabClicked((prev) => !prev);  // isTabClicked の状態をトグル
    };
    
    return (
        <>
            { view && (
                <Group className={ styles.viewPanel } style={{ height: panelHeight, bottom: isTabClicked ? panelMoveHeight : "0" }}>
                    <Box className={ styles.viewPanelTab } style={{ width: panelTabWidth, height: panelTabHeight, top: panelTabTop }} onClick={onClickTab}>
                        <Text className={ styles.viewPanelTabTitle } style={{ width: panelTabWidth, height: panelTabHeight, alignItems: "center",  fontSize: tabText }} ta="center" size="xl">ViewPoint</Text>
                    </Box>
                    <Box className={ styles.viewPanelBase } style={{ height: panelHeight }}>
                        <ScrollArea w="100%" type="never" scrollbarSize={0} scrollbars="x" offsetScrollbars>
                            <Box className={ styles.scrollArea } style={{ minWidth: "100%", cursor: "grab" }}>
                                {thumbnails.map((thumb, index) => (
                                    <Image key={thumb.id} src={thumb.src} className={ styles.viewThumb } style={{ height: thumbHeight }} radius="md" onClick={() => {
                                        onClick(thumb);  // ここで親コンポーネントの handleThumbnailClick を呼び出す
                                        console.log(`サムネイル ${thumb.id}（インデックス：${index}）がクリックされたで！`);
                                    }} alt="" />
                                ))}
                            </Box>
                        </ScrollArea>
                    </Box>
                </Group>
            )}
        </>
    );
};
ViewPanel.displayName = "ViewPanel"