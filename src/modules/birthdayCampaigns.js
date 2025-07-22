import React from "react";
import {
  LinearProgress,
  Box,
  CardHeader,
  Card,
  Typography,
  Grow,
  CardContent,
  Button,
  CardActions,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Backdrop,
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Fab,
  Fade,
} from "@mui/material";
import { InfoOutlined, Celebration, PlayArrowSharp } from "@mui/icons-material";
import Confetti from "react-confetti";
import moment from "moment";

let loopdata = null;

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "90%", mr: 3 }}>
        <LinearProgress variant="buffer" {...props} />
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {`${props.value.toFixed(2)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

const BirthdayCampaigns = () => {
  const [campaigns, setCampaigns] = React.useState(null);
  const [update, setUpdate] = React.useState(null);
  const [cokkiecount, setCookie] = React.useState(0);
  const [close, setclose] = React.useState(false);
  const [tier, setTier] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [birthLaunch, setBirth] = React.useState(false);
  const [mute, setMute] = React.useState(true);

  const getLoadNum = (numx, max) => {
    let numcount = 0;
    let ok = false;
    loopdata = setInterval(
      () => {
        if (numcount >= numx) {
          clearInterval(loopdata);
          setCookie(() => numx);
          setTimeout(() => {
            setclose(true);
          }, 5000);
        } else {
          numcount = numcount + (numx - numcount >= 1000 ? 1000 : 1);
          if (numcount >= max && ok == false) {
            setSuccess(true);
            ok = true;
            if (!isIOS()) {
              navigator.vibrate([200]);
            }
            setTimeout(() => {
              setSuccess(false);
            }, 10000);
          }
          setCookie(() => numcount);
        }
      },
      numcount >= max - 100000 ? 800 : 1
    );
  };

  const tierState = (currentcount) => {
    if (currentcount >= campaigns?.targetCoinAmount) {
      return {
        status: "Mission Complete!",
        tier: 0,
      };
    } else if (currentcount >= 0 && currentcount < campaigns?.tierList[0]) {
      return {
        status:
          "วันเกิดปีนี้มีแค่ครั้งเดียว เรามาพยายามเพื่อน้องน้ำมนต์กันเถอะ!",
        tier: campaigns?.tierList[0],
      };
    } else if (
      currentcount >= campaigns?.tierList[0] &&
      currentcount < campaigns?.tierList[1]
    ) {
      return {
        status: "Tier แรกปลดล็อคแล้ว มาสู่ต่อไปกัน!",
        tier: campaigns?.tierList[1],
      };
    } else if (
      currentcount >= campaigns?.tierList[1] &&
      currentcount < campaigns?.tierList[2]
    ) {
      return {
        status: "Tier ที่สองปลดล็อคแล้ว เรามาไกลมากแล้วนะ Fighto!",
        tier: campaigns?.tierList[2],
      };
    } else if (
      currentcount >= campaigns?.tierList[2] &&
      currentcount < campaigns?.targetCoinAmount
    ) {
      return {
        status: "Tier ที่สามปลดล็อคแล้ว เรามาทำให้แคมเปญนี้สำเร็จไปด้วยกัน",
        tier: campaigns?.targetCoinAmount,
      };
    } else {
      return {
        status: "กำลังโหลดข้อมูล...",
        tier: campaigns?.tierList[0],
      };
    }
  };

  React.useEffect(() => {
    fetch("https://cpxdevweb.koyeb.app/api/nm/getcurrenttime", {
      method: "post",
    })
      .then((response) => response.text())
      .then((data) => {
        if (parseInt(data) >= 1754758800 && parseInt(data) < 1755363600) {
          setTimeout(() => {
            setBirth(true);
          }, 3000);
          setTimeout(() => {
            setMute(false);
          }, 6000);
        }
      });
    fetch("https://cpxdevweb.azurewebsites.net/api/nm/getBirthCampain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Birthday Campaigns:", data);
        if (data.status) {
          setCampaigns(data.data);
          setUpdate(data.latest);
          if (data.data != null) {
            getLoadNum(
              data.data.currentBackedCoinAmount,
              data.data.tierList[1]
            );
          }
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);
  return (
    <>
      <Confetti
        numberOfPieces={success ? 400 : 0}
        initialVelocityY={200}
        style={{
          position: "fixed",
          zIndex: 4000,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <Grow
        in={campaigns != null}
        timeout={600}
        sx={{
          position: "fixed",
          zIndex: 2000,
          bottom: 0,
          left: 0,
          width: "100%",
        }}
      >
        <Card
          className={cokkiecount >= campaigns?.targetCoinAmount ? "shake" : ""}
        >
          <CardContent>
            <CardHeader
              title="Nammonn BNK48's Birthday Campaigns"
              subheader={cokkiecount.toLocaleString("en-US") + " Cookies" + (cokkiecount < campaigns?.tierList[1] ? ' (' + (campaigns?.tierList[1] - cokkiecount).toLocaleString("en-US") + ' more Cookies remaining)' : '')}
              action={<Celebration />}
            />
            <p>
              อัปเดตล่าสุดเมื่อ:{" "}
              {moment(update)
                .local()
                .locale("th-TH")
                .format("DD MMMM YYYY HH:mm")}
            </p>
            <LinearProgressWithLabel
              valueBuffer={
                (tierState(cokkiecount).tier / campaigns?.targetCoinAmount) *
                100
              }
              value={
                cokkiecount >= campaigns?.targetCoinAmount
                  ? 100
                  : campaigns == null
                  ? 0
                  : (cokkiecount / campaigns?.targetCoinAmount) * 100
              }
            />
            <CardActionArea className="d-flex" onClick={() => setTier(true)}>
              <h6>
                สถานะปัจจุบัน: {tierState(cokkiecount).status}&nbsp;
                <InfoOutlined />
              </h6>
            </CardActionArea>
            <div className="text-end">
              {moment() <= moment(campaigns?.endAt) ? (
                <Typography className="text-muted">
                  โหวตได้จนถึง{" "}
                  {moment(campaigns?.endAt)
                    .local()
                    .locale("th-TH")
                    .format("DD MMMM YYYY HH:mm")}
                </Typography>
              ) : (
                <Typography className="text-muted">
                  แคมเปญนี้ได้สิ้นสุดลงแล้ว
                </Typography>
              )}
            </div>
          </CardContent>
          <CardActions sx={{ paddingBottom: 5 }}>
            <Button
              onClick={() =>
                window.open(
                  "https://app.bnk48.com/campaign/" + campaigns?.id,
                  "_blank"
                )
              }
            >
              เข้าร่วมแคมเปญนี้
            </Button>
            <Button onClick={() => setCampaigns(null)} disabled={!close}>
              ปิดหน้าจอนี้
            </Button>
          </CardActions>
        </Card>
      </Grow>

      <Dialog open={tier} maxWidth="lg" sx={{ zIndex: 3001 }}>
        <DialogTitle>
          มอบ Billboards เป็นของขวัญวันเกิดสุดพิเศษให้กับ Nammonn BNK48 บนแอป
          IAM48
        </DialogTitle>
        <DialogContent>
          <TableContainer
            component={Paper}
            className={
              cokkiecount >= campaigns?.targetCoinAmount ? "shake" : ""
            }
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <caption>
                *ป้าย Billboard ได้รับการสนับสนุนโดย <b>PlanB Media</b>
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell width={120} align="center">
                    Tier Level
                  </TableCell>
                  <TableCell align="center" width={300}>
                    Required Cookie amount
                  </TableCell>
                  <TableCell align="center">Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor:
                      cokkiecount >= campaigns?.tierList[0] ? "#b9f56c" : "",
                  }}
                >
                  <TableCell component="th" align="right" scope="row">
                    1
                  </TableCell>
                  <TableCell align="right">
                    {campaigns?.tierList[0].toLocaleString("en-US")}
                  </TableCell>
                  <TableCell align="left">
                    Splash Screen บน iAM48 Official Application
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor:
                      cokkiecount >= campaigns?.tierList[1] ? "#b9f56c" : "",
                  }}
                >
                  <TableCell component="th" align="right" scope="row">
                    2
                  </TableCell>
                  <TableCell align="right">
                    {campaigns?.tierList[1].toLocaleString("en-US")}
                  </TableCell>
                  <TableCell align="left">
                    Banner และ Balloon Message บน iAM48 Official Application
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor:
                      cokkiecount >= campaigns?.tierList[2] ? "#b9f56c" : "",
                  }}
                >
                  <TableCell component="th" align="right" scope="row">
                    3
                  </TableCell>
                  <TableCell align="right">
                    {campaigns?.tierList[2].toLocaleString("en-US")}
                  </TableCell>
                  <TableCell align="left">
                    Billboards [Bangkok Zone] ที่ Center point, Mega bangna
                    (Curve), Mega bangna (Cube) *
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor:
                      cokkiecount >= campaigns?.tierList[3] ? "#b9f56c" : "",
                  }}
                >
                  <TableCell component="th" align="right" scope="row">
                    4
                  </TableCell>
                  <TableCell align="right">
                    {campaigns?.tierList[3].toLocaleString("en-US")}
                  </TableCell>
                  <TableCell align="left">
                    Billboards [Chiang Mai Zone] ที่ One nimman และ Think Park *
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTier(false)}>เข้าใจแล้ว</Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        open={birthLaunch}
        timeout={600}
        className="preloadbg"
        sx={(theme) => ({ color: "#fff", zIndex: 3001 })}
      >
        {!mute && (
          <Fab
            sx={{
              position: "fixed",
              translate: "0% -50%",
              zIndex: 3002,
              opacity: 0.65,
            }}
            variant="contained"
            color="primary"
            onClick={() => {
              document.getElementById("stream")?.play();
              setMute(true);
            }}
          >
            <PlayArrowSharp />
          </Fab>
        )}
        {birthLaunch && (
          <video
            disablePictureInPicture
            controlsList="nodownload"
            id="stream"
            onLoad={() => setMute(false)}
            style={{ pointerEvents: "none" }}
            onEnded={() => {
              setTimeout(() => {
                setBirth(false);
              }, 1000);
            }}
            height="100%"
          >
            <source src="https://tinyurl.com/nm22birthday" type="video/mp4" />
            เบราว์เซอร์ของคุณไม่รองรับวิดีโอ
          </video>
        )}
        <Card
          component={Fade}
          in={!mute}
          sx={{
            position: "fixed",
            zIndex: 3010,
            bottom: 10,
          }}
        >
          <CardContent>
            <h6 className="text-primary text-center">
              คำอวยพรสุดพิเศษจาก Bamboo (อดีตสมาชิก BNK48 รุ่นที่สอง)
              ถึงน้องน้ำมนต์
            </h6>
          </CardContent>
        </Card>
      </Backdrop>
    </>
  );
};
export default BirthdayCampaigns;
