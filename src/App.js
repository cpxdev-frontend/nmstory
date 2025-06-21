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
  Snackbar,
  Alert,
  CardHeader,
  Backdrop,
} from "@mui/material";
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

import Home from "./component/home";
import NMPlay from "./component/ytplay";
import Events from "./component/news";
import Game from "./component/game";
import P404Page from "./component/p404";

import moment, { lang } from "moment";
import BirthdayCampaigns from "./modules/birthdayCampaigns";

const drawerWidth = 290;
const navItemsA = ["/", "/nmplay", "/events", "/game"];
const navItems = ["Biography", "Nammonn Play", "All Events", "Quiz Game"];

const iconLink = "https://d3hhrps04devi8.cloudfront.net/nmstory/icon.png";

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

  const [overture, setOverTure] = React.useState(false);

  const [langcross, setLangCross] = React.useState(
    localStorage.getItem("langconvert") !== null
  );

  const location = useLocation();
  const his = useHistory();

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

  React.useEffect(() => {
    Aos.init({ duration: 900, once: true });

    setTimeout(() => {
      setOverTure(true);
    }, 4800);
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
                  sx={{ textAlign: "center" }}
                  onClick={() => his.push(navItemsA[i])}
                >
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
    <Box className="bg-theme">
      <Backdrop
        slots={{ transition: Slide }}
        open={!overture}
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

      {overture && (
        <>
          <Confetti
            numberOfPieces={fire ? 400 : 0}
            initialVelocityY={200}
            style={{ position: "fixed" }}
          />

          <Slide in={overture && !game} timeout={600}>
            <AppBar
              className="newnav"
              sx={{
                background: splash ? "transparent !important" : "",
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
                      color: splash ? "#fff" : "#000",
                      textShadow: splash
                        ? "0px 0px 40px 70px rgb(0, 0, 0) !important;"
                        : "",
                    }}
                    className="d-flex align-items-center link iconweb"
                    translate="no"
                    onClick={() => his.push("/")}
                  >
                    &nbsp;&nbsp;Nammonn BNK48 TH FC
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
                                : "#ededed"
                              : location.pathname === navItemsA[i]
                              ? "#fff"
                              : "#000",
                            boxShadow: splash
                              ? "0px 0px 40px 20px rgba(0, 0, 0, 0.13);"
                              : "",
                            backgroundColor: splash
                              ? "rgba(0, 0, 0, 0.18)"
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
                      color: splash ? "#93e1f5" : "#010e80",
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
                    <SettingsIcon />
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
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  backgroundColor: "#ade9f7",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
          </nav>
          <BirthdayCampaigns />
          <BasicSwitch data-aos="fade-in">
            <Route exact path="/" render={() => <Home />} />
            <Route path="/events" render={() => <Events />} />
            <Route
              path="/game"
              render={() => (
                <Game game={game} setInGame={(v) => setInGame(v)} />
              )}
            />
            <Route path="/nmplay" render={() => <NMPlay />} />
            <Route path="*" render={() => <P404Page />} />
          </BasicSwitch>
          <footer className="card text-center" translate="no">
            <div className="card-body">
              <p className="card-title">
                &copy; Copyright {moment().format("YYYY")} <b>CPXDev</b>, design
                and maintain for <b>Nammonn BNK48 Thailand Fanclub</b>
              </p>
              <small className="card-text">
                All BNK48 contents are licensed by Independent Artist Management
                (iAM). These member images and all events poster is objective
                for Nammonn BNK48 and other BNK48 members supporting only.
              </small>
            </div>
          </footer>
        </>
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
    </Box>
  );
}

export default App;
