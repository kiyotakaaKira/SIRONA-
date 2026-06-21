"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Canvas3DBoundary } from "./Canvas3DBoundary";

function Core({ emergency }: { emergency?: boolean }) {
  const shellRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (shellRef.current) {
      shellRef.current.rotation.y = t * 0.15;
      shellRef.current.rotation.x = t * 0.08;
    }
    if (innerRef.current) {
      innerRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.02);
    }
  });

  return (
    <group>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[2.6, 2]} />
        <meshBasicMaterial
          color={emergency ? "#FF4D6D" : "#29F0E0"}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh ref={innerRef}>
        <sphereGeometry args={[1.75, 64, 64]} />
        <MeshDistortMaterial
          color={emergency ? "#FF4D6D" : "#29F0E0"}
          clearcoat={1}
          clearcoatRoughness={0.05}
          metalness={0.95}
          roughness={0.05}
          distort={0.35}
          speed={1.8}
          emissive={emergency ? "#FF4D6D" : "#29F0E0"}
          emissiveIntensity={0.65}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#2E6FFF" transparent opacity={0.35} />
      </mesh>

      <Stars radius={5} depth={12} count={400} factor={3} saturation={0} fade speed={0.8} />
    </group>
  );
}

export default function VaultCore3D({ emergency = false }: { emergency?: boolean }) {
  return (
    <div className="w-full h-full min-h-[420px]">
      <Canvas3DBoundary>
        <Canvas camera={{ position: [0, 0, 7.5], fov: 42 }} dpr={[1, 2]}>
          <ambientLight intensity={0.15} />
          <directionalLight position={[8, 10, 6]} intensity={2} color="#29F0E0" />
          <pointLight position={[-6, -4, -3]} intensity={1.2} color="#2E6FFF" />
          <pointLight position={[0, 0, 4]} intensity={0.5} color="#8B5CF6" />
          <Float speed={1.5} rotationIntensity={0.35} floatIntensity={1.2}>
            <Core emergency={emergency} />
          </Float>
        </Canvas>
      </Canvas3DBoundary>
    </div>
  );
}
