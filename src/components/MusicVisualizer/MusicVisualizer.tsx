import { useEffect, useRef, useState } from "react";
import AudioUpload from "./AudioUpload";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import styles from "./visualizerStyles.css";

interface VisualizationProps {
  musicDataArray: Uint8Array | null;
}
const VisualizationComponent: React.FC<VisualizationProps> = ({
  musicDataArray,
}) => {
  const [color, setColor] = useState(new THREE.Color("rgb(161, 160, 159)"));
  const [radius, setRadius] = useState(15);
  useFrame(() => {
    if (musicDataArray) {
      const average =
        musicDataArray?.reduce((acc, val) => acc + val, 0) /
        musicDataArray?.length;

      // const colorIntensity = Math.min(average / 145, 1);
      const colorIntensity = Math.min(average / 145, 1);
      const saturation = Math.min(100 * (average / 255), 100); // Example for saturation change
      setColor(
        new THREE.Color(`hsl(${colorIntensity * 360}, ${saturation}%, 50%)`)
      );
      setRadius(colorIntensity * 20 + 1);
    }
  });
  return (
    <>
      <mesh>
        <sphereGeometry args={[radius, 32, 16]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </>
  );
};

const MusicVisualizer: React.FC = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>();
  const [audioContextError, setAudioContextError] = useState<Boolean>(false);
  const fileReader = new FileReader();
  const [musicDataArray, setMusicDataArray] = useState<Uint8Array | null>(null);
  const [musicSource, setMusicSource] = useState<AudioBufferSourceNode | null>(
    null
  );
  const [musicFileUploaded, setMusicFileUploaded] = useState<File | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    if (window.AudioContext) {
      const audContext = new AudioContext();
      setAudioContext(audContext);
    } else {
      setAudioContextError(true);
    }
  }, []);

  const onMusicUpload = (file: File) => {
    if (!audioContext || isPlayingRef.current) return;
    isPlayingRef.current = true;
    fileReader.readAsArrayBuffer(file);
    fileReader.onloadend = async () => {
      const audioBuffer = await audioContext.decodeAudioData(
        fileReader.result as ArrayBuffer
      );
      //Creates an AnalyserNode from the AudioContext. An AnalyserNode is used for real-time frequency and time-domain analysis of the audio.
      const analyserNode = audioContext.createAnalyser();
      //   This affects the detail level of the analysis. A larger FFT size gives more precise data but can be computationally more expensive.
      analyserNode.fftSize = 1024;

      //Creates an AudioBufferSourceNode, which is used to play back the AudioBuffer.
      const source = audioContext.createBufferSource();
      setMusicSource(source);

      source.buffer = audioBuffer;
      source.connect(analyserNode);
      //Connects the AnalyserNode to the AudioContext's destination (usually the speakers), allowing the audio to be heard.
      analyserNode.connect(audioContext.destination);

      source.start(0);

      //This value is half of the fftSize.
      const bufferLength = analyserNode.frequencyBinCount;
      const newMusicDataArray = new Uint8Array(bufferLength);
      setMusicDataArray(newMusicDataArray);

      const animate = () => {
        if (!analyserNode || !isPlayingRef.current) return;
        requestAnimationFrame(animate);

        analyserNode.getByteFrequencyData(newMusicDataArray);
        setMusicDataArray(new Uint8Array(newMusicDataArray));
      };
      animate();
    };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="container">
        <h1>Roxanne's Music Visualizer</h1>
        <h2>音乐可视化工具</h2>
        <div className="functionContainer">
          {musicFileUploaded && (
            <button
              className={styles.button}
              onClick={() => {
                onMusicUpload(musicFileUploaded);
              }}
            >
              PLAY
            </button>
          )}

          <AudioUpload
            onFileSelect={onMusicUpload}
            onStopPlaying={() => {
              isPlayingRef.current = false;
              musicSource?.stop();
            }}
          />

          <Canvas
            camera={{ position: [0, 0, 30], fov: 100 }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "lightblue",
            }}
          >
            <VisualizationComponent musicDataArray={musicDataArray} />
            {<ambientLight intensity={musicDataArray ? 1.5 : 1} />}
            <pointLight position={[0, 10, 30]} intensity={800} color="white" />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={true}
              autoRotate={true}
              autoRotateSpeed={20}
            />
          </Canvas>
        </div>
      </div>
      <div className="copyRight">
        <div>
          Music track: Falling for You by Markvard Source:
          https://freetouse.com/music Free No Copyright Music Download Music
        </div>
        <div>
          track: That's Life by Johny Grimes Source: https://freetouse.com/music
          Vlog Music for Videos (Free Download)
        </div>
        <div>
          Happy Strumming by Sound Essential Creative Commons Attribution 4.0
          License Music promoted by CopyrightFree.org
        </div>
      </div>
    </div>
  );
};

export default MusicVisualizer;
