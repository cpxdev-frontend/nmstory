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
} from "@mui/material";
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

let timerInterval;
let gamein = false;
let lobbysession;
let changeques;
let lobbyexit,
  skip = false;

function secondsToMinSec(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
}

const GameApp = ({ game, setInGame }) => {
  const [gamemeet, setGame] = React.useState(0);
  const [quesList, setQuesList] = React.useState([]);
  const [correct, setCorrect] = React.useState(0);
  const [selected, setSelected] = React.useState(0);
  const [stat, setStatperques] = React.useState(0);
  const [ques, setQues] = React.useState(0);
  const [checked, setCheck] = React.useState(false);
  const [startLoad, setLoad] = React.useState(false);
  const [airLoad, setLoadAir] = React.useState(false);
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
      }),
    };
    setExitReady(true);
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
                StartGame();
              }, 8000);
            }
            return;
          }
          clearInterval(lobbysession);
          lobbysession = undefined;
          if (!isIOS()) {
            navigator.vibrate([
              100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 800,
            ]);
          }
          ReactGA.event({
            category: "User",
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
                    category: "User",
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
                  category: "User",
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
            }
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
        category: "User",
        action: "Game Over",
      });
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
          if (result.status == false) {
            setGame(0)
            setStatperques(0);
            setQuesList([]);
            setCheck(false);
            setSelected(0);
            setInGame(false);
            Swal.fire({
              title: "Session is expired",
              text: "เซสชั่นหมดอายุแล้ว คุณไม่ได้คะแนนในเกมนี้นะครับ",
              icon: 'error',
            })
          } else {
            ReactGA.event({
              category: "User",
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
            }, 7500);
          }
        })
        .catch((error) => console.log("error", error));
    } else {
      ReactGA.event({
        category: "User",
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
      }, 8000);
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
                title="Quiz Game"
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
                      "4. สำหรับผู้ใช้งาน Android ทางผู้พัฒนาได้พัฒนาระบบคำสั่งสั่นที่ตัวอุปกรณ์เพื่อเพิ่มอรรถรสในการเล่น"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      "5. หลังเกมจบ คุณสามารถเข้ามาเล่นซ้ำได้ แต่คำถามจะถูกเปลี่ยนสลับกันไปโดยไม่ซ้ำลำดับกัน"
                    }
                  />
                </ListItem>
              </List>
              <Typography className="mt-3 text-danger">
                Note: This game is currently undergoing system testing. Some
                features may not function correctly. We apologize for any
                inconvenience.
              </Typography>

              <Button
                className="mt-3"
                variant="contained"
                disabled={startLoad}
                onClick={() => StartGame()}
              >
                {"Play!"}
              </Button>
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
                title="This game is preparing to adjust for best experience"
                subheader={
                  "ขออภัยครับ ตอนนี้เกมอยู่ระหว่างการจัดเตรียมระบบ ไม่ต้องห่วงนะ กรุณาเปิดหน้าจอนี้ไว้เพื่อรอการอัพเดท หากระบบพร้อมแล้ว ระบบจะเข้าสู่เกมให้คุณอัตโนมัติ"
                }
              />
              <List>
                <ListItem>
                  <ListItemText primary={"กติกาการเล่น"} />
                </ListItem>
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
                      "4. สำหรับผู้ใช้งาน Android ทางผู้พัฒนาได้พัฒนาระบบคำสั่งสั่นที่ตัวอุปกรณ์เพื่อเพิ่มอรรถรสในการเล่น"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      "5. หลังเกมจบ คุณสามารถเข้ามาเล่นซ้ำได้ แต่คำถามจะถูกเปลี่ยนสลับกันไปโดยไม่ซ้ำลำดับกัน"
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
                <Typography className="ml-3" data-aos="fade-in">
                  {"เวลาที่ใช้ไปโดยเฉลี่ยทั่วโลก " +
                    (secondsToMinSec(aver.time).minutes > 0
                      ? secondsToMinSec(aver.time).minutes +
                        " นาที " +
                        secondsToMinSec(aver.time).seconds +
                        " วินาที"
                      : secondsToMinSec(aver.time).seconds + " วินาที")}
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
            <Button
              className="mt-1"
              variant="contained"
              disabled={startLoad}
              onClick={() => setGame(0)}
            >
              {"Play again"}
            </Button>
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
                    {item.correctMessage.th.replace(/\\/g, "")}
                  </Typography>
                )}
                {stat === 2 && (
                  <Typography
                    className="text-danger mt-3"
                    data-aos="zoom-in-right"
                  >
                    <CancelIcon className="mr-2" />
                    &nbsp;
                    {item.wrongMessage.th.replace(/\\/g, "")}
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
            </Card>
          )
      )}
    </div>
  );
};

export default GameApp;
