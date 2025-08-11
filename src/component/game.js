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
import Swal from "sweetalert2";
import { InfoOutlined } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga4";

const GameApp = () => {
  const his = useHistory();

  React.useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "/game",
      title: "Game mode selection",
    });
  }, []);

  return (
    <Fade in={true} timeout={300}>
      <div
        data-aos="fade-in"
        className="d-flex justify-content-center"
        style={{ marginBottom: 100, marginTop: 50 }}
      >
        <Card
          data-tour="quiz"
          sx={{
            marginTop: { xs: 3, md: "15vh" },
            width: { xs: "90%", md: "70%" },
          }}
        >
          <CardContent>
            <CardHeader title="Quiz Game Mode" subheader={"โหมดเกมทายคำถาม"} />
            <List>
              <ListItem>
                <ListItemText
                  primary={"1. Classic Mode"}
                  secondary="คำถาม 10 ข้อพร้อมเฉลยในทุกข้อหลังตอบ เล่นสนุกได้เพลิน"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={"2. Survival Mode"}
                  secondary="คำถามพิชิตความเป็นแฟนพันธุ์แท้น้ำมนต์ตัวยง กับระยะเวลาในการตอบคำถามในแต่ละข้อที่บีบคั้นทุกวินาที ตอบผิดหรือใช้เวลาเกินไปจะทำให้เกมจบลงทันที"
                />
              </ListItem>
            </List>
            <br />

            <Button
              className="mt-3"
              variant="contained"
              onClick={() => his.push("/game/classic")}
            >
              Classic Mode
            </Button>
            <Button
              className="mt-3"
              variant="contained"
              disabled={true}
              onClick={() => his.push("/game/survival")}
            >
              Survival Mode (Coming soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </Fade>
  );
};

export default GameApp;
