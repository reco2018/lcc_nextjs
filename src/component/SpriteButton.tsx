"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

type SpriteButtonProps = {
  position?: [number, number, number];
  scale?: [number, number, number]; // スケールを外部から設定可能に
  onClick?: () => void;
  imagePath: string;
  hoverImagePath: string;
};

const SpriteButton: React.FC<SpriteButtonProps> = (props) => {
  const { position = [0, 0, 0], scale = [0.5, 0.5, 0.5], onClick, imagePath, hoverImagePath } = props;
  
  // 画像テクスチャのロード
  const [texture, textureFcs] = useMemo(() => [
    useLoader(THREE.TextureLoader, imagePath),
    useLoader(THREE.TextureLoader, hoverImagePath)
  ], [imagePath, hoverImagePath]);

  const spriteRef = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
    return () => {
      document.body.style.cursor = "default"; // クリーンアップ
    };
  }, [hovered]);
    
    return (
    <sprite
        ref={spriteRef}
        position={position}
        scale={scale}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        renderOrder={1}
    >
      <spriteMaterial
        attach="material"
        map={hovered ? textureFcs : texture}
        depthTest={true} // 深度テストを有効にしてSpriteが隠れるようにする
        depthWrite={true} // 深度書き込みを有効にして他のオブジェクトが隠れるように
      />
    </sprite>
  );
};

export default SpriteButton;
