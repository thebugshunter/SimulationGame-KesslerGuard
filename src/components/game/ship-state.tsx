
'use client';
import { createContext, useContext, useRef, useState, useEffect, type ReactNode } from 'react';
import * as THREE from 'three';

export interface ShipState {
  orientation: THREE.Euler;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

interface ShipStateContextValue {
  shipState: ShipState;
  shipStateRef: React.MutableRefObject<ShipState>;
}

const ShipStateContext = createContext<ShipStateContextValue | null>(null);

export const useShipState = () => {
  const context = useContext(ShipStateContext);
  if (!context) {
    throw new Error('useShipState must be used within a ShipStateProvider');
  }
  return context;
};

export const ShipStateProvider = ({ children }: { children: ReactNode }) => {
  const shipStateRef = useRef<ShipState>({
    orientation: new THREE.Euler(),
    position: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
  });

  // This state is only used to trigger re-renders in consumers
  const [shipState, setShipState] = useState<ShipState>({
    orientation: new THREE.Euler(),
    position: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
  });

  useEffect(() => {
    const update = () => {
      setShipState({
        orientation: shipStateRef.current.orientation.clone(),
        position: shipStateRef.current.position.clone(),
        velocity: shipStateRef.current.velocity.clone(),
      });
      requestAnimationFrame(update);
    };
    const frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <ShipStateContext.Provider value={{ shipState, shipStateRef }}>
      {children}
    </ShipStateContext.Provider>
  );
};
