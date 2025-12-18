
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import { type SpaceObject, spaceObjects, type SpaceObjectType } from '@/lib/space-objects';
import type { useGameControls } from '@/hooks/use-game-controls';
import type { CollisionWarning } from '@/components/ui/collision-avoidance-system';


interface SceneProps {
  setSelectedObject: (object: SpaceObject | null) => void;
  controls: ReturnType<typeof useGameControls>;
  setScanResults: (results: SpaceObject[]) => void;
  updateProximityVolume: (distance: number | null) => void;
  selectedObjectId: string | null;
  filters: Record<SpaceObjectType, boolean>;
  setCollisionWarning: (warning: CollisionWarning | null) => void;
}

function createSatellite(): THREE.Group {
    const satellite = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1.5),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 })
    );
    satellite.add(body);

    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x003366, metalness: 0.9, roughness: 0.1, side: THREE.DoubleSide });
    const panelGeometry = new THREE.BoxGeometry(2, 0.1, 1);

    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.set(-1.5, 0, 0);
    satellite.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.set(1.5, 0, 0);
    satellite.add(rightPanel);

    const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xdddddd })
    );
    antenna.position.set(0, 0, -1);
    antenna.rotation.x = Math.PI / 2;
    satellite.add(antenna);
    
    satellite.scale.set(0.5, 0.5, 0.5);
    return satellite;
}

function createDebris(): THREE.Mesh {
    const geometry = new THREE.DodecahedronGeometry(Math.random() * 0.5 + 0.1, 0);
    const material = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color().setHSL(Math.random(), 0.1, 0.5), 
        roughness: 0.8,
        metalness: 0.2
    });
    const debris = new THREE.Mesh(geometry, material);
    debris.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    return debris;
}

function createAsteroid(): THREE.Mesh {
    const geometry = new THREE.IcosahedronGeometry(Math.random() * 1 + 0.5, 0);
    const positionAttribute = geometry.getAttribute('position');
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);
        const vec = new THREE.Vector3(x, y, z);
        vec.normalize().multiplyScalar(1 + (Math.random() - 0.5) * 0.4);
        positionAttribute.setXYZ(i, vec.x, vec.y, vec.z);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.9,
        metalness: 0.1,
    });
    const asteroid = new THREE.Mesh(geometry, material);
    return asteroid;
}

export function Scene({ setSelectedObject, controls, setScanResults, updateProximityVolume, selectedObjectId, filters, setCollisionWarning }: SceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const linearVelocity = useRef(new THREE.Vector3());
  const selectionIndicatorRef = useRef<THREE.Group | null>(null);
  const objectMeshesRef = useRef<THREE.Object3D[]>([]);
  const burnerEffectRef = useRef<THREE.Mesh | null>(null);


  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // Scene
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 5000);
    camera.position.set(0, 20, 80);
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 5.0);
    sunLight.position.set(200, 50, 100);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Sun & Corona
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0.png');
    const textureFlare3 = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare3.png');

    const lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, sunLight.color ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
    sunLight.add( lensflare );

    // Sun Corona Effect
    const coronaUniforms = {
        'c': { value: 0.6 },
        'p': { value: 4.0 },
        glowColor: { value: new THREE.Color(0xffa500) },
        time: { value: 0.0 }
    };
    const coronaGeometry = new THREE.SphereGeometry(21.5, 64, 64);
    const coronaMaterial = new THREE.ShaderMaterial({
        uniforms: coronaUniforms,
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                vViewPosition = -mvPosition.xyz;
                vNormal = normalize( normalMatrix * normal );
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float c;
            uniform float p;
            uniform vec3 glowColor;
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            
            // 2D simplex noise function
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
              const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
              const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
              vec3 i  = floor(v + dot(v, C.yyy) );
              vec3 x0 =   v - i + dot(i, C.xxx) ;
              vec3 g = step(x0.yzx, x0.xyz);
              vec3 l = 1.0 - g;
              vec3 i1 = min( g.xyz, l.zxy );
              vec3 i2 = max( g.xyz, l.zxy );
              vec3 x1 = x0 - i1 + C.xxx;
              vec3 x2 = x0 - i2 + C.yyy;
              vec3 x3 = x0 - D.yyy;
              i = mod289(i);
              vec4 p = permute( permute( permute(
                         i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                       + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                       + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
              float n_ = 0.142857142857;
              vec3  ns = n_ * D.wyz - D.xzx;
              vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
              vec4 x_ = floor(j * ns.z);
              vec4 y_ = floor(j - 7.0 * x_);
              vec4 x = x_ *ns.x + ns.yyyy;
              vec4 y = y_ *ns.x + ns.yyyy;
              vec4 h = 1.0 - abs(x) - abs(y);
              vec4 b0 = vec4( x.xy, y.xy );
              vec4 b1 = vec4( x.zw, y.zw );
              vec4 s0 = floor(b0)*2.0 + 1.0;
              vec4 s1 = floor(b1)*2.0 + 1.0;
              vec4 sh = -step(h, vec4(0.0));
              vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
              vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
              vec3 p0 = vec3(a0.xy,h.x);
              vec3 p1 = vec3(a0.zw,h.y);
              vec3 p2 = vec3(a1.xy,h.z);
              vec3 p3 = vec3(a1.zw,h.w);
              vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
              p0 *= norm.x;
              p1 *= norm.y;
              p2 *= norm.z;
              p3 *= norm.w;
              vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
              m = m * m;
              return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vec3 viewDirection = normalize(vViewPosition);
                float intensity = pow(c - dot(vNormal, viewDirection), p);
                float noise = 1.0 + snoise(vNormal * 4.0 + time * 0.5) * 0.1;
                gl_FragColor = vec4(glowColor * noise, 1.0) * intensity;
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    const sunCorona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sunCorona.position.copy(sunLight.position);
    scene.add(sunCorona);
    
    // Earth
    const earthGeometry = new THREE.SphereGeometry(30, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
        color: 0x4682B4,
        roughness: 0.8,
        metalness: 0.1,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, 0);
    scene.add(earth);

    // Earth Atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(30.5, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            'c': { value: 0.5 },
            'p': { value: 4.0 },
            glowColor: { value: new THREE.Color(0x87ceeb) },
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                vViewPosition = -mvPosition.xyz;
                vNormal = normalize( normalMatrix * normal );
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float c;
            uniform float p;
            uniform vec3 glowColor;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
                vec3 viewDirection = normalize(vViewPosition);
                float intensity = pow( c - dot( vNormal, viewDirection ), p );
                gl_FragColor = vec4( glowColor, 1.0 ) * intensity;
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.position.copy(earth.position);
    scene.add(atmosphere);

    // Moon
    const moonOrbit = new THREE.Group();
    scene.add(moonOrbit);
    const moonGeometry = new THREE.SphereGeometry(8, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.9,
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(150, 0, 0);
    moonOrbit.add(moon);
    moonOrbit.position.copy(earth.position);

    // Mars
    const marsOrbit = new THREE.Group();
    scene.add(marsOrbit);
    const marsGeometry = new THREE.SphereGeometry(16, 64, 64);
    const marsMaterial = new THREE.MeshStandardMaterial({
        color: 0xE57373, // Reddish color for Mars
        roughness: 0.9,
    });
    const mars = new THREE.Mesh(marsGeometry, marsMaterial);
    mars.position.set(400, 0, 0);
    marsOrbit.add(mars);
    marsOrbit.position.copy(earth.position);
    
    // Jupiter
    const jupiterOrbit = new THREE.Group();
    scene.add(jupiterOrbit);
    const jupiterGeometry = new THREE.SphereGeometry(50, 64, 64);
    const jupiterMaterial = new THREE.MeshStandardMaterial({
      color: 0xD2B48C,
      roughness: 0.7,
    });
    const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
    jupiter.position.set(800, 0, 0);
    jupiterOrbit.add(jupiter);
    
    // Jupiter's Rings
    const ringGeometry = new THREE.RingGeometry(60, 80, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x9A7B4F,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI * 0.4;
    jupiter.add(ring);


    // Starfield
    const starVertices = [];
    const starColors = [];
    const starSizes = [];
    const starColor = new THREE.Color();
    for (let i = 0; i < 15000; i++) {
        const x = THREE.MathUtils.randFloatSpread(3000);
        const y = THREE.MathUtils.randFloatSpread(3000);
        const z = THREE.MathUtils.randFloatSpread(3000);
        starVertices.push(x, y, z);
        starColor.setHSL(Math.random() * 0.1 + 0.9, 0.1, Math.random() * 0.4 + 0.2); // Fainter, bluer stars
        starColors.push(starColor.r, starColor.g, starColor.b);
        starSizes.push(Math.random() * 1.5 + 0.5);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
    const starMaterial = new THREE.PointsMaterial({ 
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
     });
    starMaterial.onBeforeCompile = shader => {
        shader.vertexShader = `
          attribute float size;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `;
        shader.fragmentShader = `
          varying vec3 vColor;
          void main() {
            if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
            gl_FragColor = vec4(vColor, 1.0);
          }
        `;
    };
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Space Objects
    objectMeshesRef.current = [];
    spaceObjects.forEach(obj => {
      let object3d: THREE.Object3D;
      switch(obj.type) {
        case 'Satellite':
          object3d = createSatellite();
          break;
        case 'Asteroid':
          object3d = createAsteroid();
          break;
        case 'Comet':
          object3d = createAsteroid(); // Using asteroid for comets for now
          break;
        default:
          object3d = createDebris();
      }
      
      const orbit = new THREE.Group();
      orbit.add(object3d);
      object3d.position.fromArray(obj.position);
      
      orbit.userData.rotationSpeed = (Math.random() - 0.5) * 0.1;
      
      scene.add(orbit);
      object3d.userData = obj;
      objectMeshesRef.current.push(object3d);
    });

    // Selection Indicator
    const indicator = new THREE.Group();
    const ringGeometryIndicator = new THREE.TorusGeometry(1, 0.05, 16, 100);
    const ringMaterialIndicator = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const indicatorRing = new THREE.Mesh(ringGeometryIndicator, ringMaterialIndicator);
    indicator.add(indicatorRing);
    indicator.visible = false;
    scene.add(indicator);
    selectionIndicatorRef.current = indicator;

    // Plasma Burner Effect Placeholder
    const burnerGeo = new THREE.ConeGeometry(0.5, 10, 8);
    burnerGeo.translate(0, -5, 0); // Position the cone's base at the origin
    const burnerMat = new THREE.MeshBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const burnerEffect = new THREE.Mesh(burnerGeo, burnerMat);
    burnerEffect.visible = false;
    burnerEffectRef.current = burnerEffect;
    camera.add(burnerEffect); // Attach to camera


    // Raycasting for object selection
    const raycaster = new THREE.Raycaster();
    const clickMouse = new THREE.Vector2();


    // Animation Loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const { moveState, lookState, toolState } = controls.getState();
      
      // Update Sun Corona
      coronaUniforms.time.value += delta;
      
      // Update object visibility based on filters
      objectMeshesRef.current.forEach(mesh => {
        const objType = (mesh.userData as SpaceObject).type;
        mesh.visible = filters[objType];
      });

      // --- Physics Update ---
      const rotationSpeed = 1.0;
      const mouseLookSpeed = 0.5;

      // 1. Rotational update (unified logic)
      const angularVelocity = new THREE.Vector3();
      // Apply mouse and joystick look
      angularVelocity.y -= (lookState.joystick.x * rotationSpeed + lookState.dx * mouseLookSpeed) * delta;
      angularVelocity.x -= (lookState.joystick.y * rotationSpeed + lookState.dy * mouseLookSpeed) * delta;
      
      const rollSpeed = 2.0;
      if (moveState.rollLeft) angularVelocity.z += rollSpeed * delta;
      if (moveState.rollRight) angularVelocity.z -= rollSpeed * delta;
      
      const quaternionDelta = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(angularVelocity.x, angularVelocity.y, angularVelocity.z, 'YXZ')
      );
      camera.quaternion.premultiply(quaternionDelta);

      // Reset mouse delta after applying it
      controls.resetMouseDelta();
      
      // 2. Translational Force (Thrust)
      const thrust = 60.0;
      const moveVector = new THREE.Vector3();
      
      // Joystick has priority for movement
      const joystickMove = new THREE.Vector3(moveState.joystick.x, 0, -moveState.joystick.y);
      if (joystickMove.lengthSq() > 0) {
        moveVector.copy(joystickMove);
      } else {
        if (moveState.forward) moveVector.z -= 1;
        if (moveState.backward) moveVector.z += 1;
        if (moveState.left) moveVector.x -= 1;
        if (moveState.right) moveVector.x += 1;
      }
      
      if (moveState.up) moveVector.y += 1;
      if (moveState.down) moveVector.y -= 1;
      
      moveVector.normalize().multiplyScalar(thrust * delta);
      moveVector.applyQuaternion(camera.quaternion);
      linearVelocity.current.add(moveVector);
      
      // 3. Apply Damping (Simulated friction/stabilizers)
      const linearDamping = 0.95;
      linearVelocity.current.multiplyScalar(linearDamping);

      // 4. Update Position from physics
      camera.position.add(linearVelocity.current.clone().multiplyScalar(delta));


      if ((window as any)._clickRequest) {
          (window as any)._clickRequest = false;
          
          const { lastClick } = controls.getState();
          const rect = renderer.domElement.getBoundingClientRect();
          clickMouse.x = ((lastClick.x - rect.left) / rect.width) * 2 - 1;
          clickMouse.y = -((lastClick.y - rect.top) / rect.height) * 2 + 1;
          
          raycaster.setFromCamera(clickMouse, camera);
          const intersects = raycaster.intersectObjects(objectMeshesRef.current.filter(m => m.visible), true);
          
          if (intersects.length > 0) {
              let selected = intersects[0].object;
              while (selected.parent && !selected.userData.id) {
                  selected = selected.parent;
              }
              setSelectedObject(selected.userData as SpaceObject);
          } else {
              setSelectedObject(null);
          }
      }

       // Update selection indicator
      if (selectedObjectId && selectionIndicatorRef.current) {
        const selectedMesh = objectMeshesRef.current.find(m => m.userData.id === selectedObjectId);
        if (selectedMesh && selectedMesh.visible) {
            selectionIndicatorRef.current.visible = true;
            const targetPosition = new THREE.Vector3();
            selectedMesh.getWorldPosition(targetPosition);
            selectionIndicatorRef.current.position.copy(targetPosition);
            
            const objSize = (selectedMesh.userData as SpaceObject).size || 1;
            const scale = objSize * 1.5;
            selectionIndicatorRef.current.scale.set(scale, scale, scale);
            selectionIndicatorRef.current.quaternion.copy(camera.quaternion);
        } else {
            selectionIndicatorRef.current.visible = false;
        }
      } else if (selectionIndicatorRef.current) {
          selectionIndicatorRef.current.visible = false;
      }


      if (toolState.scanRequested) {
        const scanRaycaster = new THREE.Raycaster();
        scanRaycaster.setFromCamera({ x: 0, y: 0 }, camera); // Center of the screen
        scanRaycaster.far = 500; // Scan range
        const intersects = scanRaycaster.intersectObjects(objectMeshesRef.current.filter(m => m.visible), true);
        const results = intersects.map(intersect => {
          let obj = intersect.object;
          while(obj.parent && !obj.userData.id) {
            obj = obj.parent;
          }
          return obj.userData as SpaceObject;
        }).filter((value, index, self) => self.findIndex(s => s.id === value.id) === index); // Unique results

        setScanResults(results);
        controls.resetScanRequest();
      }

      // Tool effects
      if(burnerEffectRef.current) {
        burnerEffectRef.current.visible = toolState.burnerActive;
        if(toolState.burnerActive) {
            // Animate effect
            const time = clock.getElapsedTime();
            burnerEffectRef.current.scale.set(1 + Math.sin(time * 50) * 0.1, 1, 1 + Math.sin(time * 50) * 0.1);
        }
      }
      
      // Proximity & Collision Check
      let closestDistance = null;
      let collisionThreat: SpaceObject | null = null;
      let closestThreatDistance = Infinity;

      for (const mesh of objectMeshesRef.current) {
          if (!mesh.visible) continue;
          
          const worldPosition = new THREE.Vector3();
          mesh.getWorldPosition(worldPosition);
          const distance = camera.position.distanceTo(worldPosition);
          const objData = mesh.userData as SpaceObject;

          // Sound proximity
          if (objData.mass > 500) { 
              if (closestDistance === null || distance < closestDistance) {
                  closestDistance = distance;
              }
          }
          
          // Collision check logic
          const relativeVelocity = new THREE.Vector3().subVectors(
            new THREE.Vector3(...objData.velocity), 
            linearVelocity.current
          );
          const relativePosition = new THREE.Vector3().subVectors(worldPosition, camera.position);
          
          const timeToClosestApproach = -relativePosition.dot(relativeVelocity) / relativeVelocity.lengthSq();

          if (timeToClosestApproach > 0 && timeToClosestApproach < 5) { // Predict 5 seconds into the future
              const futurePlayerPos = camera.position.clone().add(linearVelocity.current.clone().multiplyScalar(timeToClosestApproach));
              const futureObjPos = worldPosition.clone().add(new THREE.Vector3(...objData.velocity).multiplyScalar(timeToClosestApproach));
              const closestApproachDist = futurePlayerPos.distanceTo(futureObjPos);
              
              if (closestApproachDist < (objData.size + 2) && distance < closestThreatDistance) {
                  collisionThreat = objData;
                  closestThreatDistance = distance;
              }
          }
      }
      updateProximityVolume(closestDistance);

      if (collisionThreat) {
        const threatPos = new THREE.Vector3().fromArray(collisionThreat.position);
        const threatScreenPos = threatPos.clone().project(camera);
        
        // Calculate escape vector (away from threat)
        const escapeVector = new THREE.Vector3().subVectors(camera.position, threatPos).normalize();
        const escapeTarget = camera.position.clone().add(escapeVector.multiplyScalar(50)); // Project 50 units away
        const escapeScreenPos = escapeTarget.clone().project(camera);

        const urgency = 1 - (closestThreatDistance / 30); // Urgency increases as threat gets closer

        setCollisionWarning({
            threatScreenX: threatScreenPos.x,
            threatScreenY: threatScreenPos.y,
            escapeScreenX: escapeScreenPos.x,
            escapeScreenY: escapeScreenPos.y,
            urgency: Math.max(0, Math.min(1, urgency)),
        });
      } else {
        setCollisionWarning(null);
      }


      objectMeshesRef.current.forEach((mesh) => {
        const orbit = mesh.parent as THREE.Group;
        orbit.rotation.y += orbit.userData.rotationSpeed * delta;
        mesh.rotation.x += delta * 0.1;
        mesh.rotation.y += delta * 0.1;
      });
      
      earth.rotation.y += delta * 0.02;
      atmosphere.rotation.y += delta * 0.022;
      moonOrbit.rotation.y += delta * 0.01;
      moon.rotation.y += delta * 0.05;
      marsOrbit.rotation.y += delta * 0.005;
      mars.rotation.y += delta * 0.04;
      jupiterOrbit.rotation.y += delta * 0.002;
      jupiter.rotation.y += delta * 0.03;
      
      stars.rotation.y += delta * 0.002;

      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(currentMount);


    return () => {
      resizeObserver.disconnect();
      if (currentMount && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
      objectMeshesRef.current = [];
    };
  }, [setSelectedObject, controls, setScanResults, updateProximityVolume, selectedObjectId, filters, setCollisionWarning]);

  return <div ref={mountRef} className="h-full w-full" />;
}
