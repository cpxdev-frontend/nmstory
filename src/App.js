import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  Avatar,
  Slide,
  Switch,
  FormControlLabel,
  MenuItem,
  Alert,
  CardHeader,
  Backdrop,
  TextField,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  ListItemIcon,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Confetti from "react-confetti";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  useLocation,
  Switch as BasicSwitch,
  Route,
  useHistory,
} from "react-router-dom";
import Aos from "aos";
import "./App.css";
import Swal from "sweetalert2";

import Home from "./component/home";
import NMPlay from "./component/ytplay";
import Events from "./component/news";
import Trend from "./component/trend";
import Gift from "./component/gift";
import Game from "./component/game";
import ClassicQuiz from "./component/classicquiz";
import P404Page from "./component/p404";

import HomeIcon from "@mui/icons-material/Home";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import EventIcon from "@mui/icons-material/Event";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import RedeemIcon from "@mui/icons-material/Redeem";

import moment, { lang } from "moment";

const drawerWidth = 290;
const navItemsA = ["/", "/nmspace", "/events", "/sendgifts", "/game"];
const navItems = [
  "Biography",
  "Nammonn Space",
  "All Events",
  "Send Gifts",
  "Quiz Game",
];
const navItemsIcon = [
  <HomeIcon />,
  <PlayCircleIcon />,
  <EventIcon />,
  <RedeemIcon />,
  <SportsEsportsIcon />,
];

const iconLink = "https://d3hhrps04devi8.cloudfront.net/nmstory/icon.png";

const activitypath = "moonlight2025";
const eventurl = "https://emmafans.vercel.app/moonlight";

const currentYear = new Date();
const years = Array.from(
  { length: currentYear.getFullYear() - 2023 + 1 },
  (_, i) => currentYear.getFullYear() - i // ไล่จากปีล่าสุดลงไป
);
const monthNames = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

// สร้าง list เดือนจากปัจจุบัน → ม.ค.
const months = Array.from(
  { length: currentYear.getMonth() + 1 },
  (_, i) => currentYear.getMonth() - i
);
const allmonths = Array.from({ length: 12 }, (_, i) => 11 - i);

function isElementVisible(el) {
  if (!el) return false; // no element
  const style = getComputedStyle(el);

  // hidden by CSS?
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0"
  ) {
    return false;
  }
  // hidden by zero size?
  return el.offsetWidth > 0 || el.offsetHeight > 0;
}

/* ---------- locate the translate bar ---------- */
function findTranslateBar() {
  let bar = document.querySelector("iframe.goog-te-banner-frame");
  if (bar) return bar;

  bar = document.querySelector(".skiptranslate, .goog-te-banner");
  if (bar) return bar;

  const regex =
    /\b(แปลเป็นภาษา|Translate\s+(?:this\s+)?page|Translate\s+to)\b/i;
  bar = Array.from(document.body.getElementsByTagName("*")).find((el) =>
    regex.test(el.textContent)
  );
  return bar || null;
}

/* ---------- public test ---------- */
function isTranslateBarVisible() {
  const bar = findTranslateBar();
  return isElementVisible(bar);
}

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [game, setInGame] = React.useState(false);
  const [splash, setSplash] = React.useState(true);
  const [fire, setFire] = React.useState(false);
  const [followtime, setfollowtime] = React.useState(false);
  const [followValue, setFollowValue] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [offline, setOffline] = React.useState(null);
  const [words, setWord] = React.useState(["Nammonn BNK48 TH FC"]);

  const [chat, setChat] = React.useState(false);

  const handleToggle = () => setChat((prev) => !prev);

  const [overture, setOverTure] = React.useState(false);

  const [langcross, setLangCross] = React.useState(
    localStorage.getItem("langconvert") !== null
  );
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState(words[0]);
  const [animating, setAnimating] = React.useState(false);

  const location = useLocation();
  const his = useHistory();

  const changeText = () => {
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % words.length);
      setText(words[(index + 1) % words.length]);
      setAnimating(false);
    }, 400);
  };
  React.useEffect(() => {
    const timer = setInterval(changeText, index == 0 ? 30000 : 6000);
    return () => clearInterval(timer);
  }, [index, overture]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  function onScroll() {
    const section = document.getElementById("home");
    if (section === null) {
      return;
    }
    const rect = section.getBoundingClientRect();
    if (
      window.scrollY > rect.top &&
      window.scrollY <= document.body.scrollHeight
    ) {
      setSplash(false);
    } else {
      setSplash(true);
    }
  }

  async function fetchData() {
    const urls = [
      "https://cpxdevweb.azurewebsites.net",
      "https://cpxdevweb.koyeb.app",
    ];

    try {
      const results = await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url);
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          return true;
        })
      );

      // ถ้าทุก URL ผ่าน ให้ setOffline(false)
      setOffline(false);
    } catch (error) {
      // ถ้ามีอันใดอันหนึ่ง error ให้ถือว่า offline
      setOffline(true);
    }
  }

  React.useEffect(() => {
    Aos.init({ duration: 900, once: true });
    fetchData();
    setTimeout(() => {
      if (localStorage.getItem("followednm") === null) {
        setfollowtime(true);
      }
      setOverTure(true);
    }, 4800);

    fetch(
      "https://api.jsonsilo.com/public/e207bafd-092e-4432-8249-37835d3f1053"
    )
      .then((response) => response.json())
      .then((data) => {
        setWord(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  React.useEffect(() => {
    if (overture) {
      var addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
    }
  }, [overture]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (location.pathname === "/") {
      setSplash(true);
      window.addEventListener("scroll", onScroll);
    } else {
      setSplash(false);
      window.removeEventListener("scroll", onScroll);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (location.pathname === "/") {
      setSplash(true);
      window.addEventListener("scroll", onScroll);
    } else {
      setSplash(false);
      window.removeEventListener("scroll", onScroll);
    }
  }, [location.pathname]);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        includedLanguages: "en,ja,zh-CN",
        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };
  React.useEffect(() => {
    if (langcross) {
      localStorage.setItem("langconvert", "true");
    } else {
      if (isTranslateBarVisible()) {
        setLangCross(true);
        return;
      }
      localStorage.removeItem("langconvert");
      const currentLang = lang === "en" ? "/auto/en" : `/auto/${lang}`;
      document.cookie = `googtrans=${currentLang};path=/;domain=${window.location.hostname}`;
    }
  }, [langcross]);

  const drawer = (
    <Box sx={{ textAlign: "center" }} data-aos="fade-in">
      <Box
        sx={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          padding: 1,
        }}
      >
        <Avatar src={iconLink} />{" "}
        <Typography
          onClick={handleDrawerToggle}
          className="d-flex align-items-center iconwebnonsize"
          translate="no"
        >
          &nbsp;&nbsp;Nammonn BNK48 TH FC
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map(
          (item, i) =>
            i > 0 && (
              <ListItem
                onClick={handleDrawerToggle}
                key={item}
                disablePadding
                sx={{ display: { xs: "initial", md: "none" } }}
              >
                <ListItemButton
                  className={
                    location.pathname == navItemsA[i] ? "Menuactive" : ""
                  }
                  onClick={() => his.push(navItemsA[i])}
                  sx={{ paddingLeft: 5 }}
                >
                  <ListItemIcon>{navItemsIcon[i]}</ListItemIcon>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            )
        )}
        <Divider />
        <ListItem
          disablePadding
          sx={{ display: { xs: "initial", md: "none" } }}
        >
          <ListItemButton
            sx={{ textAlign: "center", color: "#010e80" }}
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSffz-2acAHOkZ3uBegcx0SHGYsowCNPFE94CWRvVcVD5F-FFA/viewform?usp=sharing",
                "_blank"
              )
            }
          >
            <ListItemText primary="Survey" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding className="justify-content-center">
          <FormControlLabel
            control={
              <Switch
                checked={langcross}
                onChange={() => {
                  setLangCross((state) => !state);
                }}
              />
            }
            label="Cross Translate"
          />
        </ListItem>
        <ListItem disablePadding className="justify-content-center">
          <div
            style={{ visibility: langcross ? "initial" : "hidden" }}
            id="google_translate_element"
          ></div>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box className="bg-theme" id="app">
      <Backdrop
        slots={{ transition: Slide }}
        open={offline}
        timeout={600}
        className="errorpage"
        sx={{
          zIndex: 30000,
          borderBottomLeftRadius: overture ? 20 : 0,
          borderBottomRightRadius: overture ? 20 : 0,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h1
                  className="colorpink"
                  data-aos="zoom-out"
                  data-aos-duration="12000"
                >
                  System is temporary offline
                </h1>
                <p
                  className="colorpink"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  ขณะนี้อยู่ระหว่างการปรับปรุงระบบให้ดีขึ้น อาจใช้เวลาประมาณ 1-2
                  ชั่วโมง ไว้ค่อยกลับมาใหม่นะ!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Backdrop>

      <Backdrop
        slots={{ transition: Slide }}
        open={
          window.location.pathname.includes(activitypath) ? true : !overture
        }
        timeout={overture ? 1200 : 0}
        className="preloadbg"
        sx={{
          display: { xs: "none", md: "flex" },
          zIndex: 30000,
          borderBottomLeftRadius: overture ? 20 : 0,
          borderBottomRightRadius: overture ? 20 : 0,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-3 justify-content-end" data-aos="zoom-in">
              <Avatar
                alt="pverlayshow"
                sx={{ width: "100%", height: "100%" }}
                src={iconLink}
              />
            </div>
            <div className="col d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h1
                  className="colorpink"
                  data-aos="zoom-out"
                  data-aos-duration="12000"
                >
                  Welcome to Nammonn BNK48 TH FC
                </h1>
                <p
                  className="colorpink"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  โลกของน้ำมนต์กำลังจะเริ่มขึ้นแล้ว...
                </p>
              </div>
            </div>
          </div>
        </div>
      </Backdrop>
      <Backdrop
        slots={{ transition: Slide }}
        open={!overture}
        timeout={overture ? 1200 : 0}
        className="preloadbg"
        sx={{
          display: { xs: "flex", md: "none" },
          zIndex: 3,
          borderBottomLeftRadius: overture ? 20 : 0,
          borderBottomRightRadius: overture ? 20 : 0,
        }}
      >
        <div className="container">
          <div className="row">
            <div
              className="col-12 d-flex justify-content-center"
              data-aos="zoom-in"
            >
              <Avatar
                alt="pverlayshow"
                sx={{
                  width: { xs: "50vw", md: "30vw" },
                  height: { xs: "50vw", md: "30vw" },
                }}
                src={iconLink}
              />
            </div>
            <div className="col mt-5 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h1
                  className="colorpink"
                  data-aos="zoom-out"
                  data-aos-duration="12000"
                >
                  Welcome to Nammonn BNK48 TH FC
                </h1>
                <p
                  className="colorpink"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  โลกของน้ำมนต์กำลังจะเริ่มขึ้นแล้ว...
                </p>
              </div>
            </div>
          </div>
        </div>
      </Backdrop>
      <div className="mainPage"></div>
      {overture && (
        <div>
          <Confetti
            numberOfPieces={fire ? 400 : 0}
            initialVelocityY={200}
            style={{ position: "fixed" }}
          />

          <Slide in={overture && !game} timeout={600}>
            <AppBar
              className={splash ? "navhd" : "newnav"}
              sx={{
                // background: splash ? "transparent !important" : "",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                boxShadow: splash ? "none !important" : "",
                position: "fixed",
              }}
            >
              <Toolbar>
                <Box
                  sx={{
                    display: "inline-flex",
                    whiteSpace: "nowrap",
                    flexGrow: 1,
                    padding: 1,
                  }}
                >
                  <Avatar onClick={() => his.push("/")} src={iconLink} />{" "}
                  <Typography
                    sx={{
                      fontSize: { xs: 18, sm: 23 },
                      display: splash
                        ? { xs: "none !important", md: "block !important" }
                        : "block",
                      color: splash ? "#0353a2ff" : "#000",
                      textShadow: splash
                        ? "0px 0px 40px 70px rgba(19, 19, 19, 1) !important;"
                        : "",
                    }}
                    className="text-box slide-up d-flex align-items-center link iconweb"
                    translate="no"
                    onClick={() => his.push("/")}
                  >
                    <span className={animating ? "exit" : "active"}>
                      &nbsp;&nbsp;{text}
                    </span>
                  </Typography>
                </Box>
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  {navItems.map(
                    (item, i) =>
                      i > 0 && (
                        <Button
                          key={item}
                          sx={{
                            color: splash
                              ? location.pathname === navItemsA[i]
                                ? "#000"
                                : "#04478aff"
                              : location.pathname === navItemsA[i]
                              ? "#fff"
                              : "#000",
                            textShadow: splash
                              ? "0px 0px 40px 20px rgba(255, 255, 255, 1);"
                              : "",
                            boxShadow: splash
                              ? "0px 0px 40px 20px rgba(0, 0, 0, 0.08);"
                              : "",
                            backgroundColor: splash
                              ? "rgba(0, 0, 0, 0.09)"
                              : "",
                          }}
                          onClick={() => his.push(navItemsA[i])}
                        >
                          {item}
                        </Button>
                      )
                  )}
                  <Button
                    sx={{
                      color: splash ? "#09b2ccff" : "#010e80",
                      boxShadow: splash
                        ? "0px 0px 40px 20px rgba(0, 0, 0, 0.13);"
                        : "",
                      backgroundColor: splash ? "rgba(0, 0, 0, 0.18)" : "",
                    }}
                    onClick={() =>
                      window.open(
                        "https://docs.google.com/forms/d/e/1FAIpQLSffz-2acAHOkZ3uBegcx0SHGYsowCNPFE94CWRvVcVD5F-FFA/viewform?usp=sharing",
                        "_blank"
                      )
                    }
                  >
                    Survey
                  </Button>
                  <Button
                    color="inherit"
                    onClick={handleDrawerToggle}
                    sx={{
                      mr: 1,
                      display: { xs: "none", md: "initial" },
                      boxShadow: splash
                        ? "0px 0px 40px 20px rgba(0, 0, 0, 0.13);"
                        : "",
                      backgroundColor: splash ? "rgba(0, 0, 0, 0.18)" : "",
                      color: splash ? "#fff !important" : "",
                    }}
                  >
                    More
                  </Button>
                </Box>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    mr: 1,
                    display: { md: "none" },
                    boxShadow: splash
                      ? "0px 0px 40px 20px rgba(0, 0, 0, 0.13);"
                      : "",
                    backgroundColor: splash ? "rgba(0, 0, 0, 0.18)" : "",
                    color: splash ? "#fff !important" : "",
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </Slide>
          <nav>
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  background:
                    "linear-gradient(110deg, rgb(179, 201, 239), #ffffff, rgb(253, 216, 247)) !important",
                  overflowX: "hidden",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
          </nav>
          {/* {offline == false && <BirthdayCampaigns />} */}
          <div id="main">
            {offline == false && (
              <BasicSwitch data-aos="fade-in">
                <Route exact path="/" render={() => <Home />} />
                <Route path="/events" render={() => <Events />} />
                <Route path="/sendgifts" render={() => <Gift />} />
                <Route
                  path="/game/classic"
                  render={() => (
                    <ClassicQuiz
                      game={game}
                      setInGame={(v) => setInGame(v)}
                      demo="Classic"
                    />
                  )}
                />
                <Route
                  path="/game/survival"
                  render={() => (
                    <ClassicQuiz
                      game={game}
                      setInGame={(v) => setInGame(v)}
                      demo="Survival"
                    />
                  )}
                />
                <Route
                  path="/game"
                  render={() => (
                    <Game game={game} setInGame={(v) => setInGame(v)} />
                  )}
                />
                <Route path="/trendboost/:id" render={() => <Trend />} />
                <Route path="/nmspace" render={() => <NMPlay />} />
                <Route
                  path={"/" + activitypath}
                  render={() => {
                    Swal.fire({
                      title: "You will be navigated to another website",
                      text: "คุณกำลังจะออกจากเว็บไซต์น้ำมนต์ไปยังเว็บไซต์อื่น โดยเว็บไซต์น้ำมนต์เป็นแค่เพียงสื่อกลางในการประชาสัมพันธ์เท่านั้น",
                      icon: "info",
                    }).then(() => {
                      window.location.href = eventurl;
                    });

                    return null;
                  }}
                />
                <Route path="*" render={() => <P404Page />} />
              </BasicSwitch>
            )}
          </div>

          <footer className="card text-center" translate="no">
            <div className="card-body">
              <p className="card-title">
                &copy; Copyright {moment().format("YYYY")} <b>CPXDev Studio</b>
              </p>
              <small className="card-text">
                All BNK48 contents are licensed by Independent Artist Management
                (iAM). These member images and all events poster is objective
                for Nammonn BNK48 and other BNK48 members supporting only.
              </small>
            </div>
          </footer>
        </div>
      )}
      <div
        id="blockwhenland"
        className="d-flex justify-content-center align-items-center text-center"
      >
        <h5>
          <img
            src="https://cdn-icons-png.flaticon.com/512/6737/6737502.png"
            width={150}
          />
          <br />
          {lang == "th"
            ? "เว็บไซต์ไม่รองรับขนาดหน้าจอนี้ กรุณาหมุนจอเป็นแนวตั้งหรือทางทิศที่เหมาะสม"
            : "This screen size is not support on this device. Please rotate your device screen."}
        </h5>
      </div>

      <Dialog open={followtime} maxWidth="md">
        <DialogTitle id="alert-dialog-title">
          Set your date started following Nammonn
        </DialogTitle>
        <DialogContent>
          <Box className="d-flex mt-3">
            <TextField
              select
              label="เลือกปี"
              defaultValue={followValue.year}
              onChange={(e) =>
                setFollowValue({ ...followValue, year: Number(e.target.value) })
              }
              slotProps={{
                select: {
                  native: true,
                },
              }}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </TextField>
            <TextField
              select
              label="เลือกเดือน"
              defaultValue={followValue.month}
              onChange={(e) =>
                setFollowValue({
                  ...followValue,
                  month: Number(e.target.value) + 1,
                })
              }
              sx={{ width: 200 }}
              slotProps={{
                select: {
                  native: true,
                },
              }}
            >
              {(followValue.year == currentYear.getFullYear()
                ? months
                : allmonths
              ).map((m) => (
                <option key={m} value={m + 1}>
                  {monthNames[m]}
                </option>
              ))}
            </TextField>
          </Box>
          <Typography className="mt-5">
            กรุณาเลือกเดือนและปีที่คุณเริ่มติดตามหรือโอชิน้ำมนต์
            โดยระบบจะแสดงระยะเวลาที่คุณติดตามน้ำมนต์บนหน้าหลัก ทั้งนี้
            ข้อมูลที่คุณเลือกจะถูกเก็บไว้ในเครื่องของคุณเท่านั้น
            หากคุณยืนยันการบันทึกไปแล้วจะไม่สามารถแก้ไขในภายหลังได้
            (ยกเว้นการรีเซ็ตการตั้งค่าบราวเซอร์ใหม่เท่านั้น)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setfollowtime(false);
            }}
          >
            ปิด
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem("followednm", "");
              setfollowtime(false);
            }}
          >
            ไม่แสดงหน้าต่างนี้อีก
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem(
                "followednm",
                btoa(
                  followValue.year +
                    "-" +
                    String(followValue.month).padStart(2, "0") +
                    "-01"
                )
              );
              setfollowtime(false);
            }}
          >
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
