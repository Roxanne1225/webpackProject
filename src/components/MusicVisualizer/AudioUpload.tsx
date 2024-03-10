import React, { useState } from "react";
import HappyStrumminSampleAudio from "../../../asset/HappyStrummin.mp3";
import ThatsLifeAudio from "../../../asset/ThatsLife.mp3";
import FallingForYouAudio from "../../../asset/FallingForYou.mp3";

interface AudioUploadProps {
  onFileSelect: (file: File) => void;
  onStopPlaying: () => void;
}

const AudioUpload: React.FC<AudioUploadProps> = ({
  onFileSelect,
  onStopPlaying,
}) => {
  const [isPlaying, setIsPlaying] = useState("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setIsPlaying("file");
      onFileSelect(files[0]);
    }
  };

  const handleButtonClick = async (musicName: string) => {
    if (isPlaying) {
      setIsPlaying("");
      onStopPlaying();
      if (isPlaying === musicName) {
        return;
      }
    }

    let response;
    switch (musicName) {
      case "HappyStrummin.mp3":
        response = await fetch(HappyStrumminSampleAudio);
        break;
      case "ThatsLife.mp3":
        response = await fetch(ThatsLifeAudio);
        break;
      case "FallingForYou.mp3":
        response = await fetch(FallingForYouAudio);
        break;
      default:
        break;
    }
    if (response) {
      const blob = await response.blob();
      const file = new File([blob], musicName, {
        type: "audio/mp3",
      });
      setIsPlaying(musicName);
      onFileSelect(file);
    }
  };

  return (
    <div className="uploadContainer">
      <label style={{ padding: 5 }}>
        Please select a music or upload one (请选择或上传音乐)
      </label>
      <div style={{ display: "flex", maxWidth: "100%" }}>
        <input
          style={{ fontSize: 20, padding: "2%" }}
          type="file"
          id="audioUpload"
          className="audioUploadInputHide"
          accept="audio/*"
          onChange={handleFileChange}
        />
        <button
          className="button"
          onClick={() => {
            handleButtonClick("HappyStrummin.mp3");
          }}
        >
          {isPlaying === "HappyStrummin.mp3" ? "\u25A0" : "\u25B6"}
          <br />
          <div>Happy Strummin</div>
        </button>
        <button
          className="button"
          onClick={() => {
            handleButtonClick("ThatsLife.mp3");
          }}
        >
          {isPlaying === "ThatsLife.mp3" ? "\u25A0" : "\u25B6"}
          <br />
          That's Life
        </button>
        <button
          className="button"
          onClick={() => {
            handleButtonClick("FallingForYou.mp3");
          }}
        >
          {isPlaying === "FallingForYou.mp3" ? "\u25A0" : "\u25B6"}
          <br />
          Falling for You
        </button>
      </div>
    </div>
  );
};

export default AudioUpload;
