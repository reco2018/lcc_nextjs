"use client";
import { useState, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

type SpriteButtonProps = {
    position?: [number, number, number];
    onClick?: () => void;
    imagePath: string;
    hoverImagePath: string; // ホバー時の画像
};

const SpriteButton: React.FC<SpriteButtonProps> = ( props: SpriteButtonProps ) => {
    const { position = [0, 0, 0], onClick, imagePath, hoverImagePath } = props;
    const texture = useLoader(THREE.TextureLoader, imagePath);
    const texture_fcs = useLoader(THREE.TextureLoader, hoverImagePath);
    const spriteRef = useRef<THREE.Sprite>(null);
    const [hovered, setHovered] = useState(false);
    
    const handlePointerOver = () => {
        setHovered(true);
        document.body.style.cursor = "pointer"; // カーソルをポインターに変更
    };
    const handlePointerOut = () => {
        setHovered(false);
        document.body.style.cursor = "default"; // カーソルを元に戻す
    };
    
    return (
    <sprite
      ref={spriteRef}
      position={position}
      scale={[0.5, 0.5, 0.5]}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <spriteMaterial
        attach="material"
        map={hovered ? texture_fcs : texture}
      />
    </sprite>
  );
};

export default SpriteButton;
