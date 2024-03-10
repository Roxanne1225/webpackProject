import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const windowSizes = { width: window.innerWidth, height: window.innerHeight };

const setUpSphere = () => {
  const geometry = new THREE.SphereGeometry(3, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: "#00ff83",
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

const setUpCamera = () => {
  const aspectRatio = windowSizes.width / windowSizes.height;
  const camera = new THREE.PerspectiveCamera(45, aspectRatio);
  camera.position.z = 10;
  return camera;
};

const Ball: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa); // Light grey background

    // Sphere
    const sphereMesh = setUpSphere();
    scene.add(sphereMesh);

    // Camera
    const camera = setUpCamera();
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(windowSizes.width, windowSizes.height);

    // Light
    const pointLight = new THREE.PointLight(0xffffff, 100, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    // Orbit controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableZoom = false;
    controls.autoRotate = true;
    // Handle window resize
    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(width, height);
      renderer.render(scene, camera);
    };

    // Add window resize listener
    window.addEventListener("resize", onWindowResize);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    renderer.render(scene, camera);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  return <canvas ref={canvasRef}>the ball</canvas>;
};

export default Ball;
