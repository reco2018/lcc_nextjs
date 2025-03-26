import React, { useEffect, useRef, useState } from "react";
import { Mesh, Group, MeshBasicMaterial, MeshStandardMaterial, SRGBColorSpace, Texture } from 'three';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RigidBody } from "@react-three/rapier";
import { disposeLoaders, setGlbLoader, setOnLoaded } from "@/func/loaderSet"

type colliderDataProps = {
    onLoaded: (dataSize: number) => void; //glbのロード完了処理を親コンポーネントに送る
    glbRefFlg: boolean; //総データ量の取得フラグ
    colliderDataPath: string; //glbファイルのパス
    rotation?: [number, number, number]; // 向きの設定（オプション）
    position?: [number, number, number]; // 位置の設定（オプション）
}

const RETRY_LIMIT = 3; // リトライ回数
const RETRY_DELAY = 2000; // リトライ間隔（ミリ秒）

const loadModelWithRetry = async (path: string, retryCount: number = 0): Promise<GLTF> => {
    const loader = setGlbLoader();
    try {
        const gltf = await loader.loadAsync(path);
        disposeLoaders(loader); // 成功時にもリソースを解放
        return gltf;
    } catch (error) {
        disposeLoaders(loader); // 失敗時もローダー解放
        if (retryCount < RETRY_LIMIT) {
            console.warn(`${path} のロード失敗！${retryCount + 1}回目のリトライ (${RETRY_LIMIT} 回まで)`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY)); // リトライ間隔待機
            disposeLoaders(loader); // 既存のローダーを破棄してメモリを解放する
            return loadModelWithRetry(path, retryCount + 1); // 再帰的にリトライ
        } else {
            console.error(`${path} のロード失敗！${RETRY_LIMIT} 回リトライしたけどダメだったで！`);
            throw error; // リトライ回数を超えた場合はエラーを投げる
        }
    }
};

//コライダ用gltfのロード
export const Collider = (props: colliderDataProps) => {
    const { colliderDataPath, glbRefFlg, onLoaded, rotation, position } = props;
    const [ model, setModel ] = useState<GLTF['scene'] | null>(null);
    const [ key, setKey ] = useState(0); // 強制リレンダリング用キー
    const [ loading, setLoading ] = useState<boolean>(false); // ロード中かどうかを管理

    useEffect(() => {
        if (glbRefFlg && !loading) {
            //非同期で読込むため、async関数でloadModelのラップ定義。loadしたモデルに変更を加える場合はここに処理を追加
            const loadModel = async () => {
                try {
                    const gltf = await loadModelWithRetry(colliderDataPath);
                    gltf.scene.traverse(object => {
                        if (object instanceof Mesh) {
                            // lccの代わりにspriteや他のmeshとの見切れや隠れを表現するため、visibleではなくtransparentとopacityで透明にするgit
                            object.material = new MeshBasicMaterial({
                                color: 0xffffff,
                                opacity: 0,
                                transparent: true,  // 透明設定
                            });
                        }
                    });
                    setOnLoaded(gltf, setModel, onLoaded);
                } catch (error) {
                    console.error(`An error occurred while loading model ${colliderDataPath}: `, error);
                } finally {
                    setLoading(false); // ロード完了後にフラグを戻す
                }
            };
            loadModel(); //ラップしたasync関数の実行
        }
    }, [glbRefFlg, colliderDataPath, onLoaded, loading]);

    // モデルがロードされた後に位置と回転を更新
    useEffect(() => {
        if (model) {
            if (rotation) {
                model.rotation.set(rotation[0], rotation[1], rotation[2]); // rotationを設定
            }
            if (position) {
                model.position.set(position[0], position[1], position[2]); // positionを設定
            }
            setKey(prevKey => prevKey + 1); // GLTFがロードされた後にキーを変更して `RigidBody` を強制リレンダリング
        }
    }, [model, rotation, position]); // モデル、位置、回転が変わったら更新

    return model ? (
        <RigidBody key={key} type="fixed" colliders="trimesh">
            <primitive object={model} />
        </RigidBody>
    ) : null;
}

//3Dモデル設置用用prop
type modelDataProps = {
    onLoaded: (dataSize: number) => void; //glbのロード完了処理を親コンポーネントに送る
    changeFlg: boolean; //色替え対象か否かのフラグ
    Materials: MeshBasicMaterial[];
    glbRefFlg: boolean; //総データ量の取得フラグ
    modelDataPath: string; //glbファイルのパス
}

//3Dモデルの設置用
export const Model = (props: modelDataProps) => {
    const { modelDataPath, glbRefFlg, onLoaded } = props;
    const [model, setModel] = useState<GLTF['scene'] | null>(null);
    const meshRef = useRef<Group | null>(null);

    useEffect(() => {
        if (glbRefFlg) { //総データ量の所得フラグを満たしたら実行
            //非同期で読込むため、async関数でラップ定義
            const loadModel = async () => {
                try {
                    const gltf = await loadModelWithRetry(modelDataPath);
                    meshRef.current = gltf.scene;
                    gltf.scene.traverse(object => {
                        if ((object as Mesh).isMesh) {
                            if (Array.isArray((object as Mesh).material)) {
                                //3Dデータに多層仕様のメッシュ情報がある場合はこちらにも設定を追加
                            } else {
                                const oldMat = (object as Mesh).material as MeshStandardMaterial;
                                const newMat = new MeshBasicMaterial({
                                    name: (oldMat as MeshStandardMaterial).name,
                                    color: 0xFFFFFF
                                });
                                (object as Mesh).material = newMat;
                                if (((object as Mesh).material as MeshBasicMaterial).map as Texture) {
                                    (((object as Mesh).material as MeshBasicMaterial).map as Texture).colorSpace = SRGBColorSpace;
                                }
                                oldMat.map?.dispose();
                                oldMat.dispose();
                                newMat.map?.dispose();
                                newMat.dispose();
                            }
                        }
                    });
                    setOnLoaded(gltf, setModel, onLoaded);
                } catch (error) {
                    console.error(`An error occurred while loading model ${modelDataPath}: `, error);
                }
            };
            loadModel(); //ラップしたasync関数の実行
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [glbRefFlg]);
    return model ? <primitive object={model} /> : null;
};
