
export type SpaceObjectType = 'Debris' | 'Satellite' | 'Asteroid' | 'Comet';

export interface SpaceObject {
  id: string;
  name: string;
  type: SpaceObjectType;
  size: number; // radius
  position: [number, number, number];
  velocity: [number, number, number];
  status: 'Working' | 'Defunct' | 'Natural';
  mass: number;
}

const objectTypes: SpaceObjectType[] = ['Debris', 'Satellite', 'Asteroid', 'Comet'];
const statuses = ['Working', 'Defunct'];

export const spaceObjects: SpaceObject[] = Array.from({ length: 300 }, (_, i) => {
  const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
  // Concentrate objects in Low Earth Orbit (LEO)
  const distance = 35 + Math.random() * 50; 
  const angle = Math.random() * Math.PI * 2;
  // Keep them relatively close to the equatorial plane
  const height = (Math.random() - 0.5) * 20;
  
  let status: 'Working' | 'Defunct' | 'Natural';
  if (type === 'Satellite') {
    status = statuses[Math.floor(Math.random() * statuses.length)];
  } else {
    status = 'Natural';
  }

  return {
    id: `obj-${i}`,
    name: `${type}-${String(i).padStart(3, '0')}`,
    type: type,
    size: type === 'Satellite' ? 1.5 + Math.random() * 2 : 0.2 + Math.random() * 1.5,
    position: [
      distance * Math.cos(angle),
      height,
      distance * Math.sin(angle),
    ],
    velocity: [
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
    ],
    status: status,
    mass: Math.random() * 1000 + 10,
  };
});
