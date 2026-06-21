"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Canvas3DBoundary } from "./Canvas3DBoundary";

export interface NetworkNode {
  id: string;
  position: [number, number, number];
  color: string;
  status: "active" | "pending" | "idle";
}

interface NetworkGlobe3DProps {
  nodes?: NetworkNode[];
  connections?: { from: string; to: string; status: "active" | "pending" | "revoked" }[];
}

const DEFAULT_NODES: NetworkNode[] = [
  { id: "patient", position: [0, 0, 0], color: "#29F0E0", status: "active" },
  { id: "hospital", position: [2.2, 0.8, 0.5], color: "#2E6FFF", status: "active" },
  { id: "pharmacy", position: [-1.8, -0.6, 1.2], color: "#F59E0B", status: "pending" },
  { id: "insurance", position: [0.5, -1.5, -0.8], color: "#2ED9A3", status: "idle" },
];

function ConnectionArc({
  start,
  end,
  color,
  dashed,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  dashed?: boolean;
}) {
  const mid = useMemo(() => {
    const m = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    m.y += 0.8;
    return m;
  }, [start, end]);

  const curve = useMemo(
    () => new THREE.QuadraticBezierCurve3(start, mid, end),
    [start, end, mid]
  );

  const points = useMemo(() => curve.getPoints(32), [curve]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={dashed ? 1 : 2}
      transparent
      opacity={dashed ? 0.5 : 0.85}
      dashed={dashed}
      dashSize={0.15}
      gapSize={0.1}
    />
  );
}

function NetworkScene({
  nodes,
  connections,
}: {
  nodes: NetworkNode[];
  connections: NetworkGlobe3DProps["connections"];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {(connections ?? []).map((conn, i) => {
        const from = nodeMap[conn.from];
        const to = nodeMap[conn.to];
        if (!from || !to) return null;
        const color =
          conn.status === "active"
            ? "#29F0E0"
            : conn.status === "pending"
              ? "#F59E0B"
              : "#FF4D6D";
        return (
          <ConnectionArc
            key={i}
            start={new THREE.Vector3(...from.position)}
            end={new THREE.Vector3(...to.position)}
            color={color}
            dashed={conn.status === "pending"}
          />
        );
      })}

      {nodes.map((node) => (
        <group key={node.id} position={node.position}>
          <Sphere args={[node.id === "patient" ? 0.22 : 0.12, 16, 16]}>
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={node.status === "idle" ? 0.2 : 0.7}
              transparent
              opacity={node.status === "idle" ? 0.5 : 1}
            />
          </Sphere>
          {node.id === "patient" && (
            <mesh>
              <ringGeometry args={[0.32, 0.38, 32]} />
              <meshBasicMaterial color="#29F0E0" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

export default function NetworkGlobe3D({
  nodes = DEFAULT_NODES,
  connections = [
    { from: "patient", to: "hospital", status: "active" },
    { from: "patient", to: "pharmacy", status: "pending" },
  ],
}: NetworkGlobe3DProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas3DBoundary>
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1.5} color="#2E6FFF" />
          <NetworkScene nodes={nodes} connections={connections} />
        </Canvas>
      </Canvas3DBoundary>
    </div>
  );
}
