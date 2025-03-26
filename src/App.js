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
import { useLocation, Switch as BasicSwitch, Route } from "react-router-dom";
import Aos from "aos";

import Home from "./component/home";

const drawerWidth = 290;
const navItemsA = ["/"];
const navItems = ["Biography"];

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    Aos.init({ duration: 900 });
  }, []);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          padding: 1,
        }}>
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
            className={location.pathname == navItemsA[i] ? "Menuactive" : ""}>
            <ListItemButton sx={{ textAlign: "center" }}>
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
        className="newnav"
        sx={{
          borderRadius: 3,
          position: "fixed",
          top: 3,
        }}>
        <Toolbar>
          <Box
            sx={{
              display: "inline-flex",
              whiteSpace: "nowrap",
              flexGrow: 1,
              padding: 1,
            }}>
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
                }}>
                {item}
              </Button>
            ))}
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { sm: "none" } }}>
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
          }}>
          {drawer}
        </Drawer>
      </nav>
      <BasicSwitch>
        <Route path="/test" render={() => <Home />} />
        <Route exact render={() => <Home />} />
      </BasicSwitch>
    </Box>
  );
}

export default App;
