import React from "react";
import "./App.css";
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
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  useLocation,
  Switch as BasicSwitch,
  Route,
  useHistory,
} from "react-router-dom";
import Aos from "aos";

import Home from "./component/home";
import NMPlay from "./component/ytplay";
import Events from "./component/news";
import Game from "./component/game";

import moment from "moment";

const drawerWidth = 290;
const navItemsA = ["/", "/nmplay", "/events", "/game"];
const navItems = ["Biography", "Nammonn Play", "All Events", "Quiz Game"];

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [game, setInGame] = React.useState(false);
  const [splash, setSplash] = React.useState(true);
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
    Aos.init({ duration: 900 });
    if (location.pathname === "/") {
      window.addEventListener("scroll", onScroll);
    } else {
      window.removeEventListener("scroll", onScroll);
    }
  }, []);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (location.pathname === "/") {
      setSplash(true);
    } else {
      setSplash(false);
    }
  }, [location.pathname]);

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center" }}
      data-aos="fade-in"
    >
      <Box
        sx={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          padding: 1,
        }}
      >
        <Avatar src={process.env.REACT_APP_ICON} />{" "}
        <Typography className="d-flex align-items-center iconwebnonsize">
          &nbsp;&nbsp;Nammonn BNK48 TH FC
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map(
          (item, i) =>
            i > 0 && (
              <ListItem
                key={item}
                disablePadding
                className={
                  location.pathname == navItemsA[i] ? "Menuactive" : ""
                }
              >
                <ListItemButton
                  sx={{ textAlign: "center" }}
                  onClick={() => his.push(navItemsA[i])}
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            )
        )}
        <ListItem disablePadding>
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
      </List>
    </Box>
  );

  return (
    <Box className="bg-theme">
      {" "}
      <Slide in={!game} timeout={600}>
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
              <Avatar
                onClick={() => his.push("/")}
                src={process.env.REACT_APP_ICON}
              />{" "}
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
                            : "#cfd0d1"
                          : location.pathname === navItemsA[i]
                          ? "#fff"
                          : "#000",
                        boxShadow: splash
                          ? "0px 0px 40px 20px rgba(0, 0, 0, 0.13);"
                          : "",
                        backgroundColor: splash ? "rgba(0, 0, 0, 0.18)" : "",
                      }}
                      onClick={() => his.push(navItemsA[i])}
                    >
                      {item}
                    </Button>
                  )
              )}
              <Button
                sx={{
                  color: "#010e80",
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
            display: { xs: "block", md: "none" },
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
      <BasicSwitch>
        <Route path="/test" render={() => <Home />} />
        <Route path="/events" render={() => <Events />} />
        <Route
          path="/game"
          render={() => <Game game={game} setInGame={(v) => setInGame(v)} />}
        />
        <Route path="/nmplay" render={() => <NMPlay />} />
        <Route exact render={() => <Home />} />
      </BasicSwitch>
      <footer className="card text-center">
        <div className="card-body">
          <p className="card-title">
            &copy; Copyright {moment().format("YYYY")} <b>CPXDev</b>, design and
            maintain for <b>Nammonn BNK48 Thailand Fanclub</b>
          </p>
          <small className="card-text">
            All BNK48 contents are licensed by Independent Artist Management
            (iAM). These member images and all events poster is objective for
            Nammonn BNK48 and other BNK48 members supporting only.
          </small>
        </div>
      </footer>
    </Box>
  );
}

export default App;
