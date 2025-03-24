import { useState, useEffect } from 'react';
import { Texture } from 'three';
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";


export const setGlbLoader = () => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./path/draco_decoder/");
    loader.setDRACOLoader(dracoLoader);
    return loader;
}

// GLTFLoaderとDRACOLoaderの解放
export const disposeLoaders = (loader: GLTFLoader | null) => {
    if (loader) {
        if (loader instanceof GLTFLoader && loader.dracoLoader) {
            loader.dracoLoader.dispose();
        }
    }
}

export const setOnLoaded = (
    gltf: GLTF,
    setModel: (gltf: GLTF['scene'] | null) => void,
    onLoaded: (dataSize: number) => void
) => {
    setModel(gltf.scene);
    onLoaded(getObjectSize(gltf.parser.json));
}

export const getObjectSize = (obj: object): number => {
    const jsonString = JSON.stringify(obj);
    const bufferSize = new TextEncoder().encode(jsonString).length;
    return bufferSize;
};

export const useLoadedGlbModel = (
    allDataSizeFlg: boolean,
    setRigStatus: (value: React.SetStateAction<boolean>) => void,
    executeChildProp: (flg: boolean) => void,
    compLoading: (value: React.SetStateAction<boolean>) => void,
    setLoadingValue: (value: React.SetStateAction<number>) => void,
    modelDataList: number[],  // modelDataListRef を modelDataList に変更
    totalDataSize: number     // totalDataSize を MutableRefObject から単なる数値に変更
) => {
    const [loadedDataSize, setLoadedDataSize] = useState<number>(0);
    const [loadedModelCount, setLoadedModelCount] = useState<number>(0);

    useEffect(() => {
        const loadedGlb = setInterval(() => {
            if (allDataSizeFlg) {
                setLoadedDataSize((prev) => prev + modelDataList[loadedModelCount]);
                setLoadedModelCount((prev) => prev + 1);

                if (loadedDataSize === totalDataSize) {
                    setRigStatus(true); // コントローラーのコリジョン有効化
                    executeChildProp(true); // ローダー画面非表示処理
                    compLoading(true); // ロード完了処理
                    clearInterval(loadedGlb);
                }
            }

            setLoadingValue(Math.round((loadedDataSize / totalDataSize) * 100));
        }, 1000);

        return () => clearInterval(loadedGlb);  // クリーンアップ
    }, [allDataSizeFlg, loadedDataSize, loadedModelCount, totalDataSize, setRigStatus, executeChildProp, compLoading, modelDataList, setLoadingValue]);
};

export const clearTextures = (textures: Texture[], setTextures: React.Dispatch<React.SetStateAction<Texture[]>>) => {
    textures.forEach(texture => {
        if (texture.dispose) {
            texture.dispose();
        }
    });
    textures.length = 0;
    setTextures([]);
};