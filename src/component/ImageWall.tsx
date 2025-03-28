import React, { useState, useEffect } from "react";
import { Texture, TextureLoader } from "three";

type MeshWithTextureProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  texturePath: string;
  linkPath: string;
};

// 静止画看板の設置コンポーネント
const ImageWall: React.FC<MeshWithTextureProps> = ({ position, rotation = [0, 0, 0], texturePath, linkPath }) => {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(texturePath, (loadedTexture) => {
      setTexture(loadedTexture);
    });

    return () => {
      setTexture(null);
    };
  }, [texturePath]);

  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={() => {
        window.open(linkPath, "_blank");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "auto";
      }}
    >
      <boxGeometry args={[0.025, 1.35, 7.3]} />
      <meshBasicMaterial attach="material-0" color="gray" />
      {texture && <meshBasicMaterial attach="material-1" map={texture} />}
      <meshBasicMaterial attach="material-2" color="gray" />
      <meshBasicMaterial attach="material-3" color="gray" />
      <meshBasicMaterial attach="material-4" color="gray" />
      <meshBasicMaterial attach="material-5" color="gray" />
    </mesh>
  );
};
export default ImageWall;