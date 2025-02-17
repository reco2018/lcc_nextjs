'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { LCCRender } from '@/lib/lcc-0.4.1.js';

function SceneContent() {
  
  const { scene, camera, gl } = useThree();
  const lccObjectRef = useRef<any>(null);

  useEffect(() => {
    lccObjectRef.current = LCCRender.load(
      {
        camera: camera,
        scene: scene,
        //dataPath: 'http://localhost:3000/data/2024-11-29-130450_lcc/meta.lcc', // Lcc data path',
        dataPath: 'https://biz.active-d.net/lcc_data/office_03/meta.lcc',
        useEnv: false,
        renderLib: THREE,
        canvas: gl.domElement,
        renderer: gl,
        gpuAcceleration: true,
      },
      (mesh: THREE.Object3D) => {
        console.log('Model loaded', mesh);
        mesh.rotation.x = Math.PI / -2;
        mesh.position.x = -7;
        mesh.position.z = 3;
        mesh.position.y = -1;
      },
      (percent: number) => {
        console.log('Model loaded: ' + percent * 100 + '%');
      }
    );
  }, [scene, camera, gl]);

  useFrame(() => {
    if (LCCRender.update) LCCRender.update();
  });
  
  return null;
  
}

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      <Canvas camera={{ fov: 45, position: [0, 0, 0.5] }} style={{ width: '100%', height: '100%' }}>
        <SceneContent />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
