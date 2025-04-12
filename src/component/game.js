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

function secondsToMinSec(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
}

const GameApp = ({
  currentPage,
  lang,
  launch,
  currentCountry,
  setPage,
  setInGame,
  login,
  guide,
  game,
}) => {
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
  const [session, setSession] = React.useState("");
  const his = useHistory();

  const [time, setTime] = React.useState(0);

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [gamehis, setGameHistory] = React.useState(false);
  const [hisgame, setHis] = React.useState(null);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

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
    setPage(lang == "th" ? "มินิเกมส์" : "Quiz Game");
    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => setIP(data.clientIp));
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
    setAver(null);
    setQues(0);
    setGame(0);
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

    fetch(process.env.REACT_APP_APIE_2 + "/kfsite/kffetchquiz", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
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
            html:
              lang == "th"
                ? "เกมส์กำลังจะเริ่มในอีก <b></b> วินาที"
                : "Please wait in <b></b> seconds.",
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
                  footer:
                    lang == "th"
                      ? "คำเตือน: คำถามข้อแรก เกี่ยวข้องกับภาพนี้"
                      : "Warning: The first question concerns this image.",
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

  const getAirdrop = () => {
    setLoadAir(true);
    var requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: login._tokenResponse.email,
        token: login._tokenResponse.idToken,
        notiId: localStorage.getItem("osigIdPush")
          ? atob(localStorage.getItem("osigIdPush"))
          : null,
      }),
    };

    fetch(
      process.env.REACT_APP_APIE + "/kfsite/receiveairdropfromgame",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLoadAir(false);
        if (result.status) {
          if (result.timeused > 0) {
            Swal.fire({
              title:
                lang == "th"
                  ? "คุณได้รับ " + result.earned + " KorKao Points"
                  : "You are earned " + result.earned + " KorKao Points",
              icon: "success",
              footer:
                lang == "th"
                  ? "คุณยังเหลือสิทธิ์การรับ AirDrop อีก " +
                    result.timeused +
                    " ครั้ง"
                  : "You still have " +
                    result.timeused +
                    " AirDrop claims left.",
            });
          } else {
            Swal.fire({
              title:
                lang == "th"
                  ? "คุณได้รับ " + result.earned + " KorKao Points"
                  : "You are earned " + result.earned + " KorKao Points",
              icon: "success",
              footer:
                lang == "th"
                  ? "คุณรับ AirDrop ครบจำนวนครั้งที่กำหนดแล้ว คุณสามารถกลับมาเล่นและรับ AirDrop ใหม่อีกครั้งตั้งแต่วันที่ " +
                    moment
                      .unix(launch + 43205)
                      .lang(lang)
                      .format("DD MMMM YYYY เวลา HH:mm") +
                    " เป็นต้นไป"
                  : "You have reached the maximum number of AirDrop claims. You can come back to play and receive AirDrop again starting from " +
                    moment
                      .unix(launch + 43205)
                      .lang(lang)
                      .format("MMMM DD, YYYY at HH:mm") +
                    " onward.",
            });
          }
        } else {
          Swal.fire({
            title: "Something went wrong",
            text: result.message,
            icon: "error",
          });
        }
      })
      .catch((error) => console.log("error", error));
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
      fetch(process.env.REACT_APP_APIE + "/kfsite/kfkeep", {
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
          token:
            login !== null && login !== false
              ? login._tokenResponse.idToken
              : null,
          userId:
            login !== null && login !== false
              ? login._tokenResponse.email
              : null,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          ReactGA.event({
            category: "User",
            action: "Result Ready",
          });
          setAver(result);
          setTimeout(() => {
            setStatperques(0);
            setQuesList([]);
            setCheck(false);
            setGame(2);
            setSelected(0);
            setInGame(false);
            if (result.isAirdrop) {
              Swal.fire({
                title: "You are WIN!",
                allowOutsideClick: false,
                footer:
                  lang == "th"
                    ? "เนื่องจากคุณตอบคำถามได้มากกว่าผู้เล่นโดยเฉลี่ยทั่วโลก คุณจึงได้สิทธิ์การลุ้น AirDrop จากเรา (สูงสุด 3 ครั้งต่อ 12 ชั่วโมง นับจากวันและเวลาที่เล่นล่าสุด)"
                    : "Because you have answered more questions than the average global player, you have earned the right to participate in our AirDrop. (Up to 3 times per 12 hours, starting from your last gameplay.)",
                customClass: {
                  container: "airdropcontain",
                },
                confirmButtonText:
                  lang == "th" ? "เปิดกล่องเลย!" : "Open AirDrop Box!",
                html: '<div style="height: 100px;" class="mt-3 shake"><i class="fa-solid fa-gift fa-4x"></i></div>',
              }).then((r) => {
                if (r.isConfirmed) {
                  getAirdrop();
                }
              });
            }
          }, 4000);
        })
        .catch((error) => console.log("error", error));
    } else {
      ReactGA.event({
        category: "User",
        action: "Next Question",
      });
      setTimeout(() => {
        if (quesList[ques + 1].img != undefined) {
          if (!isIOS()) {
            navigator.vibrate([100, 200, 100]);
          }
          Swal.fire({
            footer:
              lang == "th"
                ? "คำเตือน: คำถามต่อไป เกี่ยวข้องกับภาพนี้"
                : "Warning: The next question concerns this image.",
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
      }, 6000);
    }
  };

  if (gamemeet == 0) {
    return (
      <Fade in={open} timeout={300}>
        <div
          data-aos="fade-in"
          className="d-flex justify-content-center"
          style={{ marginBottom: 200 }}>
          <Card
            data-tour="quiz"
            sx={{
              marginTop: { xs: 3, md: "15vh" },
              width: { xs: "90%", md: "70%" },
            }}>
            <CardContent>
              <CardHeader
                title="Quiz Game"
                subheader={
                  lang == "th"
                    ? "คำถามพิชิตสุดยอดกอข้าวของข้าวฟ่าง"
                    : "KorKao Fandom Quiz"
                }
              />
              <List>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "1. เลือกคำถามที่ถูกต้องที่สุด"
                        : "1. Please choose correct answer as you can."
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "2. หากเลือกแล้วจะไม่สามารถเปลี่ยนตัวเลือกได้"
                        : "2. You cannot change answer after selected."
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "3. หากตอบคำถามถูกจะได้ 1 คะแนน"
                        : "3. You will earn 1 point when answer correct."
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "4. สำหรับผู้ใช้งาน Android ทางผู้พัฒนาได้พัฒนาระบบคำสั่งสั่นที่ตัวอุปกรณ์เพื่อเพิ่มอรรถรสในการเล่น"
                        : "4. We use vibration on your device for Android device to increase the enjoyment of playing the game."
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "5. หลังเกมจบ คุณสามารถเข้ามาเล่นซ้ำได้ แต่คำถามจะถูกเปลี่ยนสลับกันไปโดยไม่ซ้ำลำดับกัน"
                        : "5. After the game ends, you can come and play again. But the questions will be rotated in no repeating order."
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "6. สำหรับสมาชิก KorKao ID นอกจากสามารถดูสถิติการเล่นย้อนหลังได้ (สูงสุด 1 ปี) แล้ว หากคะแนนของคุณสามารถทำได้มากกว่าหรือเท่ากับคะแนนเฉลี่ยของผู้เล่นทั่วโลก คุณจะได้รับกล่องสุ่ม KorKao Points (ได้สูงสุด 5 ครั้งต่อ 12 ชั่วโมง)"
                        : "6. Exclusive for KorKao ID users, You can view game histories up to 1 year past. And get Special KorKao Points AirDrop when your score can be greater than or equal to the average score of world record players (Up to 5 times per 12 hours)."
                    }
                  />
                </ListItem>
              </List>
              <Button
                className="mt-3"
                variant="contained"
                disabled={startLoad}
                onClick={() => StartGame()}>
                {lang == "th" ? "เริ่มเกมส์" : "Play!"}
              </Button>
              <br />
              <Button
                className="mt-2"
                variant="outlined"
                disabled={startLoad}
                onClick={() => his.push("/quizgameresult/all")}>
                {lang == "th" ? "ดูคะแนนเฉลี่ย" : "View average score"}
              </Button>
              <br />
              {login && (
                <Button
                  className="mt-2"
                  variant="outlined"
                  disabled={startLoad}
                  onClick={() => setGameHistory(true)}>
                  {lang == "th" ? "ดูคะแนนย้อนหลัง" : "View previous Play"}
                </Button>
              )}
            </CardContent>
          </Card>
          {open && (
            <Joyride
              steps={lang == "th" ? stepTh : stepEn}
              continuous
              run={guide}
              styles={{
                options: {
                  arrowColor: "#fb61ee",
                  backgroundColor: "#f1cef2",
                  primaryColor: "#f526fc",
                  textColor: "#000",
                },
              }}
            />
          )}
          <Dialog
            open={gamehis}
            TransitionComponent={Transition}
            transitionDuration={400}
            onClose={() => {}}
            maxWidth="md">
            {hisgame != null ? (
              <>
                <DialogTitle>
                  {lang == "th" ? "ประวัติการเล่น" : "Quiz Game History"}
                </DialogTitle>
                <TableContainer component={Paper} className="mb-5">
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          {lang == "th"
                            ? "วันเวลาที่เล่น"
                            : "Quiz Play Timestamp"}
                        </TableCell>
                        <TableCell align="right">
                          {lang == "th" ? "สถานที่เข้าถึง" : "Access Country"}
                        </TableCell>
                        <TableCell align="right">
                          {lang == "th" ? "คะแนนที่ได้" : "Scores"}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {hisgame.map((item) => (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}>
                          <TableCell component="th" scope="row">
                            {moment(item.created)
                              .lang(lang)
                              .local()
                              .format("DD MMMM YYYY HH:mm")}
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            {item.country}
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            {item.score}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <TableContainer component={Paper} className="mb-5">
                <Table sx={{ minWidth: 650 }}>
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}>
                      <TableCell colSpan={3}>
                        <Skeleton
                          variant="rounded"
                          className="bg-m mt-3 mb-3"
                          sx={{ height: 80 }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <DialogActions>
              <Button
                disabled={hisgame == null}
                onClick={() => setGameHistory(false)}>
                {lang == "th" ? "ปิด" : "Close"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Fade>
    );
  }
  if (gamemeet == 2) {
    return (
      <div
        className="d-flex justify-content-center"
        style={{ marginBottom: 100 }}>
        <Card
          sx={{
            marginTop: { xs: 3, md: "15vh" },
            width: { xs: "90%", md: "70%" },
          }}>
          <CardContent>
            <CardHeader
              title="Result"
              data-aos="fade-right"
              subheader={
                lang == "th"
                  ? "คุณตอบคำถามถูกไป " + correct + " ข้อ (คะแนน)"
                  : "You are correct " + correct + " answers (points)"
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
                  {lang == "th"
                    ? "คะแนนเฉลี่ยจากผู้เล่นทั่วโลก " +
                      aver.average +
                      " คะแนนจากทั้งหมด " +
                      aver.fromAll +
                      " คะแนน"
                    : "Average scores from worldwide are " +
                      aver.average +
                      " points from all " +
                      aver.fromAll +
                      " points."}
                </Typography>
                <Typography className="ml-3" data-aos="fade-in">
                  {lang == "th"
                    ? "เวลาที่ใช้ไปโดยเฉลี่ยทั่วโลก " +
                      (secondsToMinSec(aver.time).minutes > 0
                        ? secondsToMinSec(aver.time).minutes +
                          " นาที " +
                          secondsToMinSec(aver.time).seconds +
                          " วินาที"
                        : secondsToMinSec(aver.time).seconds + " วินาที")
                    : "Worldwide average time duration " +
                      (secondsToMinSec(aver.time).minutes > 0
                        ? secondsToMinSec(aver.time).minutes +
                          " minutes " +
                          secondsToMinSec(aver.time).seconds +
                          " seconds"
                        : secondsToMinSec(aver.time).seconds + " seconds")}
                </Typography>
                <Button
                  className="mt-4"
                  variant="outlined"
                  onClick={() => his.push("/quizgameresult/all")}>
                  {lang == "th" ? "ดูคะแนนเฉลี่ย" : "View average score"}
                </Button>
                <br />
              </>
            ) : (
              <Skeleton height={500} />
            )}
            <Button
              className="mt-1"
              variant="contained"
              disabled={startLoad}
              onClick={() => setGame(0)}>
              {lang == "th" ? "เล่นอีกครั้ง" : "Play again"}
            </Button>
          </CardContent>
        </Card>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={airLoad}>
          <CircularProgress />
        </Backdrop>
      </div>
    );
  }
  return (
    <div
      className="d-flex justify-content-center"
      style={{ marginBottom: 130 }}>
      {quesList.map(
        (item, i) =>
          i === ques && (
            <Card
              data-aos="fade-in"
              key={item.quizId}
              sx={{ marginTop: "5vh", width: { xs: "90%", md: "70%" } }}>
              <CardContent>
                <CardHeader
                  title={item.question[lang]}
                  subheader={
                    (lang == "th" ? "คำถามที่ " : "Question ") +
                    (ques + 1) +
                    "/" +
                    quesList.length
                  }
                />
                {item.img != undefined && checked == false && (
                  <p
                    className="mt-2 text-primary ml-3"
                    onClick={() => {
                      Swal.fire({
                        imageUrl: item.img,
                      });
                    }}>
                    <b>
                      {lang == "th"
                        ? "คำแนะนำ: คลิกหรือแตะที่นี่เพื่อดูรูปเต็ม"
                        : "Guide: Click or tap here to view full-size image"}
                    </b>
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
                      }>
                      <ListItemText
                        primary={ix + 1 + ". " + choice.choiceName[lang]}
                      />
                    </ListItemButton>
                  ))}
                </List>
                {stat === 1 && (
                  <Typography
                    className="text-info mt-3"
                    data-aos="zoom-in-right">
                    <CheckCircleIcon className="mr-2" />
                    {item.correctMessage[lang].replace(/\\/g, "")}
                  </Typography>
                )}
                {stat === 2 && (
                  <Typography
                    className="text-danger mt-3"
                    data-aos="zoom-in-right">
                    <CancelIcon className="mr-2" />
                    {item.wrongMessage[lang].replace(/\\/g, "")}
                  </Typography>
                )}
                <br />
                {stat > 0 && ques < quesList.length - 1 && (
                  <Typography className="mt-2 nextText">
                    <InfoOutlined className="mr-2" />
                    {lang == "th"
                      ? "คำถามต่อไปกำลังจะเริ่มในอีกไม่ช้า"
                      : "Next question will be started soon"}
                  </Typography>
                )}
                {stat > 0 && ques == quesList.length - 1 && (
                  <Typography className="mt-2 nextText">
                    <InfoOutlined className="mr-2" />
                    {lang == "th"
                      ? "คุณตอบคำถามครบทุกข้อแล้ว กรุณารอสักครู่"
                      : "Game is done. Please wait for processing scores."}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  currentPage: state.currentPage,
  game: state.game,
  guide: state.guide,
  login: state.login,
  currentCountry: state.currentCountry,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
  setInGame: (val) => dispatch(setInGame(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(GameApp);
