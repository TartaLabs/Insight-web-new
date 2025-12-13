import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// Strict Dark Mode Palette as requested
const EMOTIONS = [
  { name: 'NEUTRAL', hex: '#D1D1D1' },
  { name: 'HAPPY', hex: '#E6D48A' },
  { name: 'ANGER', hex: '#FF6666' },
  { name: 'SAD', hex: '#7373F7' },
  { name: 'FEAR', hex: '#7AC47A' },
  { name: 'DISGUST', hex: '#FF9CFF' },
  { name: 'SURPRISE', hex: '#7AB8FF' },
];

export const EmotionOrb: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use Refs for animation loop state to avoid React re-render lags
  const currentIndexRef = useRef(0);
  const nextIndexRef = useRef(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any previously mounted orb canvases (handles hot-reload / double-mount) without touching HUD overlays
    document.querySelectorAll('canvas.emotion-orb').forEach((canvas) => {
      canvas.remove();
    });

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    // Reduced fog slightly to ensure colors pop
    scene.fog = new THREE.FogExp2(0x050509, 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance" 
    });
    renderer.domElement.classList.add('emotion-orb');
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- Objects ---
    const headGroup = new THREE.Group();
    scene.add(headGroup);

    // 1. Particle Head
    const geometry = new THREE.SphereGeometry(4, 84, 64);
    geometry.scale(1, 1.3, 1.1); 
    
    const count = geometry.attributes.position.count;
    geometry.setAttribute('initialPosition', geometry.attributes.position.clone());
    
    const randoms = new Float32Array(count);
    for(let i=0; i<count; i++) randoms[i] = Math.random();
    geometry.setAttribute('random', new THREE.BufferAttribute(randoms, 1));

    // Material Setup
    // CRITICAL FIX: Use NormalBlending to prevent colors adding up to white
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(EMOTIONS[0].hex),
      size: 0.08, 
      transparent: true,
      opacity: 0.8,
      blending: THREE.NormalBlending, // Changed from Additive to Normal to keep true color
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    headGroup.add(particles);

    // 2. Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-1.2, 0.5, 3.5);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(1.2, 0.5, 3.5);

    // Lights
    const leftLight = new THREE.PointLight(new THREE.Color(EMOTIONS[0].hex), 2, 10);
    leftEye.add(leftLight);
    
    const rightLight = new THREE.PointLight(new THREE.Color(EMOTIONS[0].hex), 2, 10);
    rightEye.add(rightLight);

    const eyesGroup = new THREE.Group();
    eyesGroup.add(leftEye);
    eyesGroup.add(rightEye);
    headGroup.add(eyesGroup);

    // 3. Scan Effect (Ring)
    const scanGeometry = new THREE.RingGeometry(4.5, 4.6, 64);
    const scanMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(EMOTIONS[0].hex), 
        transparent: true, 
        opacity: 0.8, // Increased opacity
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending // Ring can stay additive for glow
    });
    const scanRing = new THREE.Mesh(scanGeometry, scanMaterial);
    scanRing.rotation.x = Math.PI / 2;
    scene.add(scanRing);

    // --- Interaction & Animation State ---
    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    
    // Convert strict hexes to THREE.Colors once
    const emotionColors = EMOTIONS.map(e => new THREE.Color(e.hex));
    
    let lerpAlpha = 1; // Start completed
    const currentColor = new THREE.Color(EMOTIONS[0].hex);

    // --- Event Listeners ---
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Cycle emotions interval
    const emotionInterval = setInterval(() => {
        // Update refs for the loop to pick up
        nextIndexRef.current = (currentIndexRef.current + 1) % EMOTIONS.length;
        lerpAlpha = 0; // Trigger transition in loop
        
        // Update Text Content directly
        if (textRef.current) {
             textRef.current.innerText = EMOTIONS[nextIndexRef.current].name;
        }
    }, 3000);

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // 1. Color Interpolation (Syncs 3D and UI)
      if (lerpAlpha < 1) {
          lerpAlpha += 0.02; // Transition speed
          const alpha = Math.min(lerpAlpha, 1);
          
          // Interpolate
          currentColor.copy(emotionColors[currentIndexRef.current]).lerp(emotionColors[nextIndexRef.current], alpha);
          
          // Apply to 3D Models
          // Use .set() to ensure value update
          material.color.set(currentColor); 
          leftLight.color.set(currentColor);
          rightLight.color.set(currentColor);
          scanMaterial.color.set(currentColor);

          // Update index when done
          if (alpha >= 1) {
              currentIndexRef.current = nextIndexRef.current;
          }
      }

      // 2. Apply Color to DOM (CSS Variables)
      // This ensures text, borders, and SVGs match the particles frame-by-frame
      if (containerRef.current) {
          const styleString = `rgb(${Math.round(currentColor.r * 255)}, ${Math.round(currentColor.g * 255)}, ${Math.round(currentColor.b * 255)})`;
          containerRef.current.style.setProperty('--active-color', styleString);
      }

      // 3. Mouse Look
      targetRotation.x = mouse.y * 0.5;
      targetRotation.y = mouse.x * 0.5;
      headGroup.rotation.x += (targetRotation.x - headGroup.rotation.x) * 0.05;
      headGroup.rotation.y += (targetRotation.y - headGroup.rotation.y) * 0.05;

      // 4. Scan Effect
      scanRing.position.y = Math.sin(time * 1.5) * 5.5;
      scanRing.scale.setScalar(1 + Math.sin(time * 1.5) * 0.1);

      // 5. Particle Pulse
      const positions = geometry.attributes.position;
      const initials = geometry.attributes.initialPosition;
      
      for (let i = 0; i < count; i++) {
        const ix = initials.getX(i);
        const iy = initials.getY(i);
        const iz = initials.getZ(i);

        const pulse = Math.sin(time * 2 + iy * 0.5) * 0.05;
        const distToScan = Math.abs(iy - scanRing.position.y);
        const scanHighlight = distToScan < 0.5 ? (1 - distToScan * 2) * 0.2 : 0;

        positions.setXYZ(
            i,
            ix + ix * (pulse + scanHighlight),
            iy + iy * (pulse + scanHighlight),
            iz + iz * (pulse + scanHighlight)
        );
      }
      positions.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Initial DOM Set
    if (containerRef.current) {
        containerRef.current.style.setProperty('--active-color', EMOTIONS[0].hex);
    }
    if (textRef.current) {
        textRef.current.innerText = EMOTIONS[0].name;
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(emotionInterval);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
        ref={containerRef} 
        className="relative w-full h-full min-h-[500px] flex items-center justify-center cursor-crosshair transition-colors"
        style={{ color: 'var(--active-color)' } as React.CSSProperties}
    >
       
       {/* Integrated Holographic HUD */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none">
          
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
             <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="var(--active-color)" strokeWidth="1" strokeDasharray="5,5" />
             <line x1="50%" y1="50%" x2="20%" y2="70%" stroke="var(--active-color)" strokeWidth="1" strokeDasharray="5,5" />
             <circle cx="50%" cy="50%" r="25%" stroke="var(--active-color)" strokeWidth="1" fill="none" opacity="0.2" />
          </svg>

          {/* Right Floating Data Panel */}
          <motion.div 
            className="absolute bottom-[20%] right-[5%] md:right-[15%] text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
             <div className="bg-black/60 backdrop-blur-md border-r-2 p-4 rounded-l-lg" style={{ borderColor: 'var(--active-color)' }}>
                <h4 className="text-[10px] font-mono tracking-widest text-gray-400 mb-1">REWARD PROTOCOL</h4>
                <div className="text-xs font-bold text-white mb-1">
                   BNB Chain <span style={{ color: 'var(--active-color)' }}>$bEMO</span>
                </div>
                <div className="text-xs font-bold text-white">
                  MANTLE <span style={{ color: 'var(--active-color)' }}>$mEMO</span>
                </div>
             </div>
          </motion.div>

          {/* Left Floating Data Panel */}
          <motion.div 
             className="absolute bottom-[20%] left-[5%] md:left-[15%]"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
          >
             <div className="bg-black/60 backdrop-blur-md border-l-2 p-4 rounded-r-lg" style={{ borderColor: 'var(--active-color)' }}>
                <h4 className="text-[10px] font-mono tracking-widest text-gray-400 mb-1">SYSTEM LATENCY</h4>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--active-color)' }}></div>
                   <span className="text-xl font-mono font-bold text-white">20<span className="text-xs text-gray-500">ms</span></span>
                </div>
             </div>
          </motion.div>

          {/* Bottom Center Emotion Label */}
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center w-full">
             <div
                 ref={textRef}
                 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter"
                 style={{ 
                   color: 'var(--active-color)',
                   textShadow: `0 0 20px var(--active-color)`
                 }}
             >
                 NEUTRAL
             </div>
             <div className="w-64 h-0.5 mt-2 bg-white/10 overflow-hidden relative mx-auto">
                <motion.div 
                   className="absolute inset-0"
                   style={{ backgroundColor: 'var(--active-color)' }}
                   initial={{ x: '-100%' }}
                   animate={{ x: '100%' }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
             </div>
          </div>
       </div>
    </div>
  );
};
