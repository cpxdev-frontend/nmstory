import React from "react";
import {
  Card,
  CardContent,
  Fade,
  CardHeader,
  Button,
  Grid,
  CardActions,
  Box,
  Backdrop,
  Tab,
  Typography,
  ListItemButton,
  List,
  ListItem,
  CircularProgress,
  Skeleton,
  Fab,
  LinearProgress,
  TextField,
  MenuItem,
  DialogContent,
  Dialog,
  DialogActions,
  Grow,
  DialogTitle,
  ListItemText,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Divider,
} from "@mui/material";
import { QRCode } from "react-qrcode-logo";
import HistoryIcon from "@mui/icons-material/History";
import Swal from "sweetalert2";
import { InfoOutlined } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CancelIcon from "@mui/icons-material/Cancel";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga4";
import moment from "moment";

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

const Level = [
  {
    value: 30,
    label: "Free Style",
  },
  {
    value: 15,
    label: "The Greeting",
  },
  {
    value: 8,
    label: "Oshi Warrior",
  },
  {
    value: 4,
    label: "Kami-Oshi Master",
  },
];

let timerInterval;
let gamein = false;
let lobbysession;
let gameInterval;
let onTimeGameMax = 0;
let changeques;
let lobbyexit,
  skip = false;

function secondsToMinSec(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return { minutes, seconds };
}

function compareTimestamps(timestamp1) {
  // Get the difference in milliseconds
  const difference = 1746420600 * 1000 - timestamp1 * 1000;

  // Calculate days
  const days =
    difference / (1000 * 60 * 60 * 24) >
    Math.floor(difference / (1000 * 60 * 60 * 24))
      ? Math.floor(difference / (1000 * 60 * 60 * 24))
      : Math.floor(difference / (1000 * 60 * 60 * 24)) - 1;

  // Get remaining milliseconds after removing days
  const remainingMilliseconds = difference % (1000 * 60 * 60 * 24);

  // Calculate hours
  const hours =
    remainingMilliseconds / (1000 * 60 * 60) >
    Math.floor(remainingMilliseconds / (1000 * 60 * 60))
      ? Math.floor(remainingMilliseconds / (1000 * 60 * 60))
      : Math.floor(remainingMilliseconds / (1000 * 60 * 60)) - 1;

  // Get remaining milliseconds after removing hours
  const remainingMinutes = remainingMilliseconds % (1000 * 60 * 60);

  // Calculate minutes
  const minutes =
    remainingMinutes / (1000 * 60) > Math.round(remainingMinutes / (1000 * 60))
      ? Math.round(remainingMinutes / (1000 * 60)) + 1
      : Math.round(remainingMinutes / (1000 * 60));

  return {
    days,
    hours,
    minutes,
  };
}

const GameApp = ({ game, setInGame, demo }) => {
  const [gamemeet, setGame] = React.useState(0);
  const [quesList, setQuesList] = React.useState([]);
  const [onTimeGame, setonTimeGame] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [selected, setSelected] = React.useState(0);
  const [stat, setStatperques] = React.useState(0);
  const [ques, setQues] = React.useState(0);
  const [checked, setCheck] = React.useState(false);
  const [startLoad, setLoad] = React.useState(false);
  const [airLoad, setLoadAir] = React.useState(false);
  const [warningGame, setGameWarning] = React.useState(false);
  const [pressure, setP] = React.useState(30);
  const [notreadyyet, setNotReadyYet] = React.useState(true);
  const [notreadyyett, setNotReadyYett] = React.useState(
    "Please wait for the game to be Generally Available. The game will be started soon."
  );
  const [ip, setIP] = React.useState("");
  const [currentCountry, setCountry] = React.useState("");
  const [session, setSession] = React.useState("");
  const his = useHistory();

  const [time, setTime] = React.useState(0);

  // state to check stopwatch running or not
  const [exitnotok, setExitReady] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const [gamehis, setGameHistory] = React.useState(false);
  const [hisgame, setHis] = React.useState(null);

  async function gameremainFunction() {
    if (onTimeGame == parseInt(onTimeGameMax / 2)) {
      timepopupapi();
    } else if (onTimeGameMax - onTimeGame == 60) {
      timepopupapi(true);
    }
    if (onTimeGameMax - onTimeGame <= 0) {
      clearInterval(gameInterval);
      setGame(0);
      setStatperques(0);
      setQuesList([]);
      setCheck(false);
      setSelected(0);
      setInGame(false);
      Swal.fire({
        title: "Session is expired",
        text: "เซสชั่นหมดอายุแล้ว คุณไม่ได้คะแนนในเกมนี้นะครับ",
        icon: "error",
      });
    } else if (onTimeGameMax - onTimeGame <= 10) {
      if (!isIOS()) {
        navigator.vibrate([
          100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 100, 900,
          100, 900, 100, 900, 100, 900, 800,
        ]);
      }
    } else {
      setonTimeGame((x) => (x += 1));
    }
  }

  React.useEffect(() => {
    let intervalId;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 9);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const [readyans, setAns] = React.useState(false);

  const [aver, setAver] = React.useState(null);

  React.useEffect(() => {
    console.log("Game mode: ", demo);
    const handleBeforeUnload = (event) => {
      if (gamein == false) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  React.useEffect(() => {
    gamein = game;
  }, [game]);

  React.useEffect(() => {
    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => {
        setIP(data.clientIp);
        setCountry(data.country);
      });
    var url = new URL(window.location.href);
    var c = url.searchParams.get("testbyadmin");
    if (moment().unix() <= 1746420600) {
      // if (c !== null) {
      //   setNotReadyYet(false);
      //   return;
      // }
      setNotReadyYet(false);
      setInterval(() => {
        if (
          compareTimestamps(Date.now() / 1000).days <= 0 &&
          compareTimestamps(Date.now() / 1000).hours <= 0 &&
          compareTimestamps(Date.now() / 1000).minutes <= 0
        ) {
          setNotReadyYet(false);
        }
        setNotReadyYett(
          "Please wait for the game to be Generally Available. The game will be launched in " +
            compareTimestamps(Date.now() / 1000).days +
            " days " +
            compareTimestamps(Date.now() / 1000).hours +
            " hours " +
            (compareTimestamps(Date.now() / 1000).minutes == 60
              ? 0
              : compareTimestamps(Date.now() / 1000).minutes) +
            " minutes."
        );
      }, 1);
    } else {
      setNotReadyYet(false);
    }
  }, []);

  React.useEffect(() => {
    if (gamehis == true && login) {
      var requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: login._tokenResponse.email,
          token: login._tokenResponse.idToken,
        }),
      };

      fetch(
        process.env.REACT_APP_APIE + "/kfsite/kfgameHistory",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setHis(result.resp);
          }
        })
        .catch((error) => console.log("error", error));
    } else {
      setTimeout(() => {
        setHis(null);
      }, 1000);
    }
  }, [gamehis]);

  const StartGame = () => {
    if (ip == "") {
      return;
    }
    skip = false;
    setAver(null);
    setQues(0);
    setCorrect(0);
    setTime(0);
    setInGame(true);
    setLoad(true);
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizIP: ip,
        quizCountry: currentCountry,
        pressureLevel: pressure,
      }),
    };
    setExitReady(true);
    var url = new URL(window.location.href);
    var c = url.searchParams.get("testbyadmin");
    fetch(
      "https://cpxdevweb.azurewebsites.net/api/nm/fetchquiz",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setExitReady(false);
        if (result.status) {
          if (lobbyexit == true && lobbysession != undefined) {
            lobbyexit = false;
            return;
          }
          if (result.ready == false) {
            setGame(-1);
            if (lobbysession == undefined) {
              lobbysession = setInterval(() => {
                ReactGA.event({
                  category: "Game",
                  action: "Waiting Room Session",
                });
                StartGame();
              }, 8000);
            }
            return;
          }
          clearInterval(lobbysession);
          setonTimeGame(0);
          onTimeGameMax = result.timeout;
          lobbysession = undefined;
          gameInterval = undefined;
          if (!isIOS()) {
            navigator.vibrate([
              100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 800,
            ]);
          }
          ReactGA.event({
            category: "Game",
            action: "Game Ready",
          });
          Swal.fire({
            title: "Game will be started",
            html: "Game will be start in in <b></b> seconds.",
            timer: 6000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timer.textContent = `5`;
              timerInterval = setInterval(() => {
                timer.textContent = `${Math.floor(Swal.getTimerLeft() / 1000)}`;
              }, 1000);
            },
            allowOutsideClick: () => !Swal.isLoading(),
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((r) => {
            /* Read more about handling dismissals below */
            if (r.dismiss === Swal.DismissReason.timer) {
              setSession(result.sessionId);
              timepopupapi();
              if (JSON.parse(result.data)[0].img != undefined) {
                if (!isIOS()) {
                  navigator.vibrate([100, 200, 100]);
                }
                Swal.fire({
                  footer: "คำแนะนำ: คำถามข้อแรก เกี่ยวข้องกับภาพนี้",
                  imageUrl: JSON.parse(result.data)[0].img,
                  timerProgressBar: true,
                  didOpen: () => {
                    Swal.showLoading();
                    timerInterval = setTimeout(() => {
                      Swal.hideLoading();
                    }, 3000);
                  },
                  allowOutsideClick: () => false,
                }).then((r) => {
                  ReactGA.event({
                    category: "Game",
                    action: "Game Start",
                  });
                  clearInterval(timerInterval);
                  setQuesList(JSON.parse(result.data));
                  console.log(JSON.parse(result.data));
                  setGame(1);
                  setLoad(false);
                  setAns(false);
                  setIsRunning(false);
                  setTimeout(
                    () => {
                      setAns(true);
                      setIsRunning(true);
                    },
                    window.innerHeight >
                      (JSON.parse(result.data)[0].img ? 700 : 500)
                      ? 3800
                      : 1000
                  );
                });
              } else {
                ReactGA.event({
                  category: "Game",
                  action: "Game Start",
                });
                setQuesList(JSON.parse(result.data));
                console.log(JSON.parse(result.data));
                setGame(1);
                setLoad(false);
                setAns(false);
                setIsRunning(false);
                setTimeout(
                  () => {
                    setAns(true);
                    setIsRunning(true);
                  },
                  window.innerHeight >
                    (JSON.parse(result.data)[0].img ? 700 : 500)
                    ? 3800
                    : 1000
                );
              }

              gameInterval = setInterval(gameremainFunction, 1000);
            }
          });
        } else {
          setGame(0);
          setStatperques(0);
          setQuesList([]);
          setCheck(false);
          setSelected(0);
          setInGame(false);
          Swal.fire({
            title: "Session is expired",
            text: "เซสชั่นหมดอายุแล้ว คุณไม่ได้คะแนนในเกมนี้นะครับ",
            icon: "error",
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const gotonext = () => {
    clearTimeout(changeques);
    if (ques == quesList.length - 1) {
      return;
    } else {
      skip = true;
      if (quesList[ques + 1].img != undefined) {
        if (!isIOS()) {
          navigator.vibrate([100, 200, 100]);
        }
        Swal.fire({
          footer: "คำแนะนำ: คำถามต่อไป เกี่ยวข้องกับภาพนี้",
          imageUrl: quesList[ques + 1].img,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            timerInterval = setTimeout(() => {
              Swal.hideLoading();
            }, 3000);
          },
          allowOutsideClick: () => false,
        }).then((r) => {
          clearInterval(timerInterval);
          setStatperques(0);
          setCheck(false);
          setQues((x) => (x = x + 1));
          setSelected(0);
          setAns(false);
          setTimeout(
            () => {
              setAns(true);
              setIsRunning(true);
            },
            window.innerHeight > (quesList[ques + 1].img ? 700 : 500)
              ? 3800
              : 1000
          );
        });
      } else {
        if (!isIOS()) {
          navigator.vibrate(100);
        }
        setStatperques(0);
        setCheck(false);
        setQues((x) => (x = x + 1));
        setSelected(0);
        setAns(false);
        setTimeout(
          () => {
            setAns(true);
            setIsRunning(true);
          },
          window.innerHeight > (quesList[ques + 1].img ? 700 : 500)
            ? 3800
            : 1000
        );
      }
    }
  };

  const timepopupapi = (strict = false) => {
    setGameWarning(true);
    if (strict) {
      return;
    }
    setTimeout(() => {
      setGameWarning(false);
    }, 8000);
  };

  const SelectGame = (key, select) => {
    if (checked || readyans == false) {
      return;
    }
    setSelected(select);
    setCheck(true);
    setIsRunning(false);
    if (key === select) {
      setStatperques(1);
      setCorrect((x) => (x = x + 1));
    } else {
      if (!isIOS()) {
        navigator.vibrate(600);
      }
      setStatperques(2);
    }
    if (ques == quesList.length - 1) {
      if (!isIOS()) {
        navigator.vibrate([600, 100, 600, 100, 600]);
      }
      ReactGA.event({
        category: "Game",
        action: "Game Over",
      });
      clearInterval(gameInterval);
      timepopupapi(true);
      fetch("https://cpxdevweb.koyeb.app/api/nm/quizprocess", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quesText: JSON.stringify(quesList),
          quizScore: correct + (key === select ? 1 : 0),
          quizFrom: quesList.length,
          quizDuration: Math.floor((time % 6000) / 100),
          sessionId: session,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          setGameWarning(false);
          if (result.status == false) {
            setGame(0);
            setStatperques(0);
            setQuesList([]);
            setCheck(false);
            setSelected(0);
            setInGame(false);
            Swal.fire({
              title: "Session is expired",
              text: "เซสชั่นหมดอายุแล้ว คุณไม่ได้คะแนนในเกมนี้นะครับ",
              icon: "error",
            });
          } else {
            ReactGA.event({
              category: "Game",
              action: "Result Ready",
            });
            setAver(result);
            changeques = setTimeout(() => {
              setStatperques(0);
              setQuesList([]);
              setCheck(false);
              setGame(2);
              setSelected(0);
              setInGame(false);
            }, 9500);
          }
        })
        .catch((error) => console.log("error", error));
    } else {
      ReactGA.event({
        category: "Game",
        action: "Next Question",
      });
      changeques = setTimeout(() => {
        if (quesList[ques + 1].img != undefined) {
          if (!isIOS()) {
            navigator.vibrate([100, 200, 100]);
          }
          Swal.fire({
            footer: "คำแนะนำ: คำถามต่อไป เกี่ยวข้องกับภาพนี้",
            imageUrl: quesList[ques + 1].img,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              timerInterval = setTimeout(() => {
                Swal.hideLoading();
              }, 3000);
            },
            allowOutsideClick: () => false,
          }).then((r) => {
            clearInterval(timerInterval);
            setStatperques(0);
            setCheck(false);
            setQues((x) => (x = x + 1));
            setSelected(0);
            setAns(false);
            setTimeout(
              () => {
                setAns(true);
                setIsRunning(true);
              },
              window.innerHeight > (quesList[ques + 1].img ? 700 : 500)
                ? 3800
                : 1000
            );
          });
        } else {
          if (!isIOS()) {
            navigator.vibrate(100);
          }
          setStatperques(0);
          setCheck(false);
          setQues((x) => (x = x + 1));
          setSelected(0);
          setAns(false);
          setTimeout(
            () => {
              setAns(true);
              setIsRunning(true);
            },
            window.innerHeight > (quesList[ques + 1].img ? 700 : 500)
              ? 3800
              : 1000
          );
        }
      }, 10000);
    }
  };

  if (gamemeet == 0) {
    return (
      <Fade in={open} timeout={300}>
        <div
          data-aos="fade-in"
          className="d-flex justify-content-center"
          style={{ marginBottom: 100, marginTop: !game ? 50 : 0 }}
        >
          <Card
            data-tour="quiz"
            sx={{
              marginTop: { xs: 3, md: "15vh" },
              width: { xs: "90%", md: "70%" },
            }}
          >
            <CardContent>
              <CardHeader
                title="Classic Quiz Game"
                subheader={"คำถามพิชิตสุดยอดแฟนพันธุ์แท้น้องน้ำมนต์"}
              />
              <List>
                <ListItem>
                  <ListItemText primary={"1. เลือกคำถามที่ถูกต้องที่สุด"} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"2. หากเลือกแล้วจะไม่สามารถเปลี่ยนตัวเลือกได้"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary={"3. หากตอบคำถามถูกจะได้ 1 คะแนน"} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      "4. ในการเข้าเล่นเกมแต่ละรอบจะมีเวลา " +
                      pressure +
                      " นาทีในการตอบคำถามให้แล้วเสร็จครบทุกข้อ หากคุณตอบคำถามไม่ครบภายในระยะเวลาที่กำหนด เกมจะจบลงทันทีและคะแนนจะไม่ถูกบันทึกในระบบในรอบนั้น"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      "5. คุณสามารถปรับโหมด Pressure เพื่อเพิ่มหรือลดระยะเวลาในการเล่นเกมเพื่อเพิ่มความท้าทายของเกมได้"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      "6. สำหรับผู้ใช้งาน Android ทางผู้พัฒนาได้พัฒนาระบบคำสั่งสั่นที่ตัวอุปกรณ์เพื่อเพิ่มอรรถรสในการเล่น"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      "7. หลังเกมจบ คุณสามารถเข้ามาเล่นซ้ำได้ แต่คำถามจะถูกเปลี่ยนสลับกันไปโดยไม่ซ้ำลำดับกัน"
                    }
                  />
                </ListItem>
              </List>
              <TextField
                select
                label="Pressure Level"
                defaultValue={pressure}
                onChange={(e) => setP(e.target.value)}
                sx={{ width: { xs: "100%", md: "60%" } }}
                helperText="Pressure Level จะมีผลกับระยะเวลาในการเล่นเกมในรอบที่จะเล่น ซึ่งถ้าหากเวลาน้อย ความกดดันยิ่งมากขึ้น"
              >
                {Level.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label} ({option.value} นาที)
                  </MenuItem>
                ))}
              </TextField>
              <br />

              {!notreadyyet ? (
                <Button
                  className="mt-3"
                  variant="contained"
                  disabled={startLoad}
                  onClick={() => StartGame()}
                >
                  {"Play!"}
                </Button>
              ) : (
                <>
                  <Typography className="mt-3 text-info">
                    {notreadyyett}
                  </Typography>
                  <Typography className="mt-1">
                    Please join Nammonn's Phenomenon Quiz Game (Reserved Waiting
                    Room) since&nbsp;
                    {moment.unix(1746420600).format("MMMM DD, YYYY,") +
                      " at " +
                      moment.unix(1746420600).format("H:mm A")}{" "}
                    (Based on your timezone)
                  </Typography>
                </>
              )}
              <br />
              {/* <Button
                className="mt-2"
                variant="outlined"
                disabled={startLoad}
                onClick={() => his.push("/quizgameresult/all")}>
                {lang == "th" ? "ดูคะแนนเฉลี่ย" : "View average score"}
              </Button> */}
            </CardContent>
          </Card>
        </div>
      </Fade>
    );
  }
  if (gamemeet == -1) {
    return (
      <Fade in={open} timeout={300}>
        <div
          data-aos="fade-in"
          className="d-flex justify-content-center"
          style={{ marginBottom: 200 }}
        >
          <Card
            data-tour="quiz"
            sx={{
              marginTop: { xs: 3, md: "15vh" },
              width: { xs: "90%", md: "70%" },
            }}
          >
            <CardContent>
              <CardHeader
                title="[Waiting Room] The game system is being optimized to ensure the best experience."
                subheader={
                  "ขณะนี้มีผู้ให้ความสนใจเป็นจำนวนมาก กรุณาเปิดหน้าจอนี้ไว้เพื่อรอการอัพเดท หากระบบพร้อมแล้ว ระบบจะเข้าสู่เกมให้คุณอัตโนมัติ"
                }
              />
              <List>
                <ListItem>
                  <ListItemText primary={"1. เลือกคำถามที่ถูกต้องที่สุด"} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={"2. หากเลือกแล้วจะไม่สามารถเปลี่ยนตัวเลือกได้"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary={"3. หากตอบคำถามถูกจะได้ 1 คะแนน"} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      "4. ในการเข้าเล่นเกมแต่ละรอบจะมีเวลา " +
                      pressure +
                      " นาทีในการตอบคำถามให้แล้วเสร็จครบทุกข้อ หากคุณตอบคำถามไม่ครบภายในระยะเวลาที่กำหนด เกมจะจบลงทันทีและคะแนนจะไม่ถูกบันทึกในระบบในรอบนั้น"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      "5. สำหรับผู้ใช้งาน Android ทางผู้พัฒนาได้พัฒนาระบบคำสั่งสั่นที่ตัวอุปกรณ์เพื่อเพิ่มอรรถรสในการเล่น"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      "6. หลังเกมจบ คุณสามารถเข้ามาเล่นซ้ำได้ แต่คำถามจะถูกเปลี่ยนสลับกันไปโดยไม่ซ้ำลำดับกัน"
                    }
                  />
                </ListItem>
              </List>
              <Button
                className="mt-3"
                variant="contained"
                disabled={exitnotok}
                onClick={() => {
                  clearInterval(lobbysession);
                  lobbysession = undefined;
                  setGame(0);
                  setInGame(false);
                  lobbyexit = true;
                  setLoad(false);
                }}
              >
                {"Exit"}
              </Button>
              {/* <Button
                className="mt-2"
                variant="outlined"
                disabled={startLoad}
                onClick={() => his.push("/quizgameresult/all")}>
                {lang == "th" ? "ดูคะแนนเฉลี่ย" : "View average score"}
              </Button> */}
            </CardContent>
          </Card>
        </div>
      </Fade>
    );
  }
  if (gamemeet == 2) {
    return (
      <div
        className="d-flex justify-content-center"
        style={{ marginBottom: 100, marginTop: !game ? 50 : 0 }}
      >
        <Card
          sx={{
            marginTop: { xs: 3, md: "15vh" },
            width: { xs: "90%", md: "70%" },
          }}
        >
          <CardContent>
            <CardHeader
              title="Result"
              data-aos="fade-right"
              subheader={"You are correct " + correct + " answers (points)"}
              action={
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <QRCode
                    value={aver != null ? aver.gameverification : "0"}
                    logoWidth={20}
                    logoHeight={20}
                    size={500}
                    style={{ width: 130, height: 130 }}
                    qrStyle="dots"
                    crossorigin="anonymous"
                  />
                </Box>
              }
            />
            {aver != null ? (
              <>
                {/* <LinearProgress
                  sx={{
                    width: "100%",
                    height: 5,
                  }}
                  variant="buffer"
                  value={(correct / 10) * 100}
                  valueBuffer={(aver.average / 10) * 100}
                /> */}
                <Typography className="ml-3 mt-3" data-aos="fade-in">
                  {"คะแนนเฉลี่ยจากผู้เล่นทั่วโลก " +
                    aver.average +
                    " คะแนนจากทั้งหมด " +
                    aver.fromAll +
                    " คะแนน"}
                </Typography>
                {/* <Button
                  className="mt-4"
                  variant="outlined"
                  onClick={() => his.push("/quizgameresult/all")}>
                  {lang == "th" ? "ดูคะแนนเฉลี่ย" : "View average score"}
                </Button> */}
                <br />
              </>
            ) : (
              <Skeleton height={500} />
            )}
            {/* <QRCode
              value={qrCode}
              logoImage="https://d3hhrps04devi8.cloudfront.net/kf/thqr.webp"
              logoWidth={100}
              logoHeight={100}
              size={300}
              style={{ width: 250, height: 250 }}
              qrStyle="dots"
              crossorigin="anonymous"
            /> */}
            <div className="mt-1 row">
              <div className="col-6 d-flex align-items-center">
                <Button
                  variant="contained"
                  disabled={startLoad}
                  onClick={() => setGame(0)}
                >
                  {"Play again"}
                </Button>
              </div>
              <Box
                className="col-6 text-end"
                sx={{ display: { xs: "block", md: "none" } }}
              >
                <QRCode
                  value={aver != null ? aver.gameverification : "0"}
                  logoWidth={20}
                  logoHeight={20}
                  size={500}
                  style={{ width: 140, height: 140 }}
                  qrStyle="dots"
                  crossorigin="anonymous"
                />
                <br />
                <small>QR Code นี้มีอายุ 1 ปี นับตั้งแต่วันที่ปรากฎ</small>
              </Box>
            </div>
            <p className="mt-5 text-primary text-center">
              สำหรับการเข้าร่วมกิจกรรมใดๆที่จำเป็นต้องอ้างอิงผลคะแนนการเล่นเกมนี้
              สามารถยื่นหรือบันทึกหน้าจอ QR Code
              ที่ปรากฎให้บ้านสแกนเพื่อยืนยันความถูกต้องและป้องกันการทุจริต
            </p>
          </CardContent>
        </Card>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={airLoad}
        >
          <CircularProgress />
        </Backdrop>
      </div>
    );
  }
  return (
    <div
      className="d-flex justify-content-center"
      style={{ marginBottom: 130 }}
    >
      {quesList.map(
        (item, i) =>
          i === ques && (
            <Card
              data-aos="fade-in"
              key={item.quizId}
              sx={{ marginTop: "5vh", width: { xs: "90%", md: "70%" } }}
            >
              <CardContent>
                <CardHeader
                  title={item.question.th}
                  subheader={"Question " + (ques + 1) + "/" + quesList.length}
                />
                {item.img != undefined && checked == false && (
                  <p
                    className="mt-2 text-primary ml-3"
                    onClick={() => {
                      Swal.fire({
                        imageUrl: item.img,
                      });
                    }}
                  >
                    <b>{"Guide: Click or tap here to view full-size image"}</b>
                  </p>
                )}

                <List>
                  {item.choices.map((choice, ix) => (
                    <ListItemButton
                      sx={{
                        borderRadius: "10px",
                      }}
                      data-aos="fade-right"
                      data-aos-delay={
                        window.innerHeight > (item.img != undefined ? 700 : 500)
                          ? ix == 0
                            ? 500
                            : (500 * (ix + ix)).toString()
                          : 0
                      }
                      onClick={() => SelectGame(item.key, choice.choiceId)}
                      key={item.quizId + choice.choiceId}
                      className={
                        checked && item.key === choice.choiceId
                          ? "text-success" +
                            (choice.choiceId == selected
                              ? " bgSelectedquiz"
                              : " shake")
                          : checked && item.key !== choice.choiceId
                          ? "text-danger" +
                            (choice.choiceId == selected
                              ? " bgSelectedquiz"
                              : "")
                          : ""
                      }
                    >
                      <ListItemText
                        primary={ix + 1 + ". " + choice.choiceName.th}
                      />
                    </ListItemButton>
                  ))}
                </List>
                {stat === 1 && (
                  <Typography
                    className="text-info mt-3"
                    data-aos="zoom-in-right"
                  >
                    <CheckCircleIcon className="mr-2" />
                    &nbsp;
                    {item.correctMessage.th != ""
                      ? item.correctMessage.th.replace(/\\/g, "")
                      : "ยินดีด้วย! คุณตอบคำถามถูกต้อง"}
                  </Typography>
                )}
                {stat === 2 && (
                  <Typography
                    className="text-danger mt-3"
                    data-aos="zoom-in-right"
                  >
                    <CancelIcon className="mr-2" />
                    &nbsp;
                    {item.wrongMessage.th != ""
                      ? item.wrongMessage.th.replace(/\\/g, "")
                      : "เสียใจด้วยนะ คุณตอบคำถามไม่ถูกต้อง"}
                  </Typography>
                )}
                <br />
                {stat > 0 && ques < quesList.length - 1 && (
                  <Typography className="mt-2 nextText">
                    <InfoOutlined className="mr-2" />
                    &nbsp;
                    {"Next question will be started soon"}
                  </Typography>
                )}
                {stat > 0 && ques == quesList.length - 1 && (
                  <Typography className="mt-2 nextText">
                    <InfoOutlined className="mr-2" />
                    &nbsp;
                    {"Game is done. Please wait for processing scores."}
                  </Typography>
                )}
                {stat > 0 && ques < quesList.length - 1 && (
                  <Button
                    onClick={() => gotonext()}
                    className="mt-3"
                    variant="outlined"
                  >
                    ไปยังคำถามถัดไป
                  </Button>
                )}
              </CardContent>
              <Divider />
              <div
                className={
                  "text-center text-primary fade" +
                  (warningGame ? " is-shown " : "")
                }
                style={{ color: onTimeGameMax - onTimeGame <= 60 ? "red" : "" }}
              >
                <small>
                  ระยะเวลาคงเหลือ:{" "}
                  {secondsToMinSec(onTimeGameMax - onTimeGame).minutes} นาที{" "}
                  {secondsToMinSec(onTimeGameMax - onTimeGame).seconds} วินาที
                </small>
              </div>
              <LinearProgress
                sx={{
                  width: "100%",
                  height: window.innerHeight * 0.02,
                  "& .MuiLinearProgress-barColorPrimary": {
                    backgroundColor:
                      onTimeGameMax - onTimeGame <= 60
                        ? "red !important"
                        : onTimeGameMax - onTimeGame <=
                          parseInt(onTimeGameMax / 2)
                        ? "#c45302"
                        : "",
                  },
                }}
                variant="determinate"
                value={((onTimeGameMax - onTimeGame) / onTimeGameMax) * 100}
              />
            </Card>
          )
      )}
    </div>
  );
};

export default GameApp;
