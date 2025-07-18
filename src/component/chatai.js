import React from "react";
import { useHistory } from "react-router-dom";
import { Skeleton, CardHeader, Box } from "@mui/material";
var refresh;
const ChatAI = () => {
  const his = useHistory();
  const [ready, setReady] = React.useState(false);

  const checkpoint = () => {
    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => {
        if (data.country === "TH") {
          setReady(true);
        } else {
          clearInterval(refresh);
          setReady(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  React.useEffect(() => {
    checkpoint();
    refresh = setInterval(() => checkpoint(), 10000);
  }, []);

  if (ready == false) {
    return (
      <div
        style={{ paddingTop: 100, height: "70vh", overflow: "hidden" }}
        className="container"
      >
        <Skeleton variant="rounded" width="100%" height="70%" />
      </div>
    );
  }

  if (ready == null) {
    return (
      <div
        style={{ paddingTop: 100, height: "70vh", overflow: "hidden" }}
        className="container d-flex justify-content-center align-items-center"
      >
        <h3>ขออภัยค่ะ NM Story AI ยังไม่พร้อมให้บริการในขณะนี้</h3>
      </div>
    );
  }

  return (
    <Box
      sx={{
        paddingTop: 10,
        paddingBottom: 20,
        height: { xs: "70vh", md: "85vh" },
        overflow: "hidden",
      }}
      className="container"
    >
      <CardHeader
        title="NM Story AI (Beta)"
        subheader={
          <small>
            คุณสามารถทำความรู้จักน้ำมนต์ได้มากขึ้น ผ่านระบบ Generative AI
          </small>
        }
      />
      <iframe
        src="https://app.thinkstack.ai/bot/index.html?chatbot_id=68726fe3d55e4dcc0f89ce0a&type=inline"
        frameborder="0"
        width="100%"
        height="100%"
      ></iframe>
    </Box>
  );
};
export default ChatAI;
