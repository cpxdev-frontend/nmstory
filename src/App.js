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

import moment from "moment";

const drawerWidth = 290;
const navItemsA = ["/", "/nmplay", "/events"];
const navItems = ["Biography", "Nammonn Play", "All Events"];

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const his = useHistory();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    Aos.init({ duration: 900 });
  }, []);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }} data-aos="fade-in">
      <Box
        sx={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          padding: 1,
        }}
      >
        <Avatar src={process.env.REACT_APP_ICON} />{" "}
        <Typography className="d-flex align-items-center">
          &nbsp;&nbsp;Nammonn BNK48 TH FC
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item, i) => (
          <ListItem
            key={item}
            disablePadding
            className={location.pathname == navItemsA[i] ? "Menuactive" : ""}
          >
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => his.push(navItemsA[i])}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box className="bg-theme">
      {" "}
      <AppBar
        data-aos="fade-down"
        data-aos-delay={location.pathname === "/" ? "1500" : "200"}
        className="newnav"
        sx={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
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
            <Avatar src={process.env.REACT_APP_ICON} />{" "}
            <Typography className="d-flex align-items-center">
              &nbsp;&nbsp;Nammonn BNK48 TH FC
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item, i) => (
              <Button
                key={item}
                sx={{
                  color: location.pathname === navItemsA[i] ? "#fff" : "#000",
                }}
                onClick={() => his.push(navItemsA[i])}
              >
                {item}
              </Button>
            ))}
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
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
