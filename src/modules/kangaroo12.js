import React, { useState } from "react";
import kangarooImg from "../kangaroo.svg";
import { Zoom, Backdrop, Fab } from "@mui/material";
import { Close } from "@mui/icons-material";

const KangarooEffect = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [showNewImage, setShowNewImage] = useState(false);
  const [ready, setReady] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleJump = () => {
    setIsJumping(true);
    setTimeout(() => {
      setIsJumping(false);
      setShowNewImage(true);
    }, 1500);
  };

  return (
    <Backdrop
      sx={(theme) => ({
        zIndex: theme.zIndex.drawer + 1,
      })}
      open={ready}
    >
      <div style={containerStyle}>
        {!showNewImage ? (
          <div
            data-aos-delay="900"
            className="text-center"
            data-aos="fade-right"
          >
            <img
              src={kangarooImg}
              alt="Kangaroo"
              height={300}
              style={kangarooStyle}
              className={isJumping ? "jump-away" : ""}
              onClick={handleJump}
            />
            {!isJumping && (
              <h5 className="text-light">Click or Tap on the kangaroo.</h5>
            )}
          </div>
        ) : (
          <Zoom in={showNewImage} timeout={800}>
            <img
              src="https://pbs.twimg.com/media/G623dUTbkAMba4D?format=jpg&name=large"
              alt="nm"
              style={newImageStyle}
            />
          </Zoom>
        )}
        {showNewImage && (
          <Fab
            onClick={() => setReady(false)}
            sx={window.innerWidth > 700 ? { position: "fixed", top:16, right: 16 } : { position: "fixed", bottom:60, right: 16 }}
          >
            <Close />
          </Fab>
        )}

        <style>{`
        .jump-away {
          animation: bounceAndAway 1.5s forwards;
        }

        @keyframes bounceAndAway {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          20% { transform: translateY(-150px) scale(1.1); opacity: 1; }
          40% { transform: translateY(0) scale(1); opacity: 1; }
          60% { transform: translateY(-150px) scale(1.05); opacity: 1; }
          80% { transform: translateY(0) scale(1); opacity: 1; }
          90% { transform: translateY(-150px) scale(1.02); opacity: 0.5; }
          100% { transform: translateY(-10px) scale(0); opacity: 0; }
        }
      `}</style>
      </div>
    </Backdrop>
  );
};

const containerStyle = {};

const kangarooStyle = {
  top: "0",
  left: "0",
  cursor: "pointer",
};

const newImageStyle = {
  width: window.innerWidth <= 800 ? "100%" : "auto",
  height: window.innerWidth > 800 ? "90vh" : "auto",
  transition: "opacity 2s ease-in !important;",
};

export default KangarooEffect;
