import React from "react";
import {
  Card,
  CardContent,
  LinearProgress,
  CardHeader,
  Button,
  Grid2 as Grid,
  Avatar,
  Box,
  Tabs,
  Tab,
  Fade,
  Typography,
  Pagination,
  IconButton,
  Chip,
  Skeleton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  DialogActions,
  CardActions,
  CardMedia,
} from "@mui/material";
import { CopyAll } from "@mui/icons-material";
import moment from "moment";
import Swal from "sweetalert2";
import { NotificationsActive, CircleNotifications } from "@mui/icons-material";
import OneSignal from "react-onesignal";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function compareTimestamps(timestamp1, timestamp2) {
  // Get the difference in milliseconds
  const difference = timestamp2 * 1000 - timestamp1 * 1000;

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

const notiCheck = () => {
  try {
    return (
      OneSignal.Notifications.permission &&
      OneSignal.User.PushSubscription.optedIn
    );
  } catch {
    return false;
  }
};

const launch = moment().unix();

const Gift = ({}) => {
  const [data, setData] = React.useState(null);
  const [getData, setGetData] = React.useState(null);
  const [unix, setUnix] = React.useState(launch);

  const event = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [newsLayout, setNewsLayout] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getMap = (item) => {
    if (item.place.includes("IAMP")) {
      setGetData({
        locate: item.placeobj.placeCoodinate,
        place: item.placeobj.ref,
      });
    } else {
      setGetData({
        place: item.place,
        locate: item.locate,
      });
    }
  };

  const checkeventtype = (obj) => {
    if (obj.locate == null && obj.place == "") {
      return "Online event";
    } else {
      if (obj.link != "") {
        return "Hybrid event";
      } else {
        return "Offline event";
      }
    }
  };

  const checkeventstatus = (obj) => {
    if (obj.timerange[0] > 0 && obj.timerange[1] == 0) {
      if (launch >= obj.timerange[0]) {
        return "Ready";
      } else {
        return "Preparing";
      }
    } else {
      if (launch >= obj.timerange[0] && launch <= obj.timerange[1]) {
        return "Event is started";
      } else if (launch > obj.timerange[1]) {
        return "Event done";
      } else if (
        launch >= obj.timerange[0] - 432000 &&
        launch < obj.timerange[0]
      ) {
        const d = compareTimestamps(launch, obj.timerange[0]);
        return "Incoming event";
      } else {
        return "Coming soon";
      }
    }
  };
  const checktime = (obj) => {
    if (
      obj.timerange[0] > 0 &&
      obj.timerange[1] > 0 &&
      unix >= obj.timerange[0] - 432000 &&
      unix < obj.timerange[0]
    ) {
      const buffer =
        ((unix - (obj.timerange[0] - 432000)) /
          (obj.timerange[0] - (obj.timerange[0] - 432000))) *
        100;
      return {
        prepare: buffer,
        launch: 0,
      };
    } else if (
      obj.timerange[0] > 0 &&
      obj.timerange[1] > 0 &&
      unix >= obj.timerange[0] &&
      unix <= obj.timerange[1]
    ) {
      const ready =
        ((unix - obj.timerange[0]) / (obj.timerange[1] - obj.timerange[0])) *
        100;
      return {
        prepare: 100,
        launch: ready,
      };
    } else if (
      obj.timerange[0] > 0 &&
      obj.timerange[1] > 0 &&
      unix > obj.timerange[1]
    ) {
      return {
        prepare: 100,
        launch: 100,
      };
    }
    return {
      prepare: 0,
      launch: 0,
    };
  };

  React.useEffect(() => {}, []);

  return (
    <Box sx={{ marginTop: 10 }} data-aos="fade-in">
      <Box sx={{ marginBottom: 15 }}>
        <CardHeader
          title={<h3>How to send Gifts or Letters to Nammonn</h3>}
          subheader="ในการส่งของขวัญหรือจดหมายถึงน้ำมนต์ มีรายละเอียดเงื่อนไขในการส่งดังนี้"
        />

        <Box className="container">
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="ที่อยู่สำหรับแฟนคลับในไทย" {...a11yProps(0)} />
            <Tab label="Address for International Fans" {...a11yProps(1)} />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            <Box className="container">
              <CardHeader
                title={<h4>ชื่อผู้รับ</h4>}
                subheader={<p translate="no">น้ำมนต์ BNK48</p>}
                action={
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText("น้ำมนต์ BNK48");
                      alert("คัดลอกชื่อผู้รับเรียบร้อย");
                    }}
                  >
                    <CopyAll />
                  </IconButton>
                }
              />
              <CardHeader
                title={<h4>ที่อยู่</h4>}
                subheader={
                  <p translate="no">
                    บริษัท อินดิเพนเด้นท์ อาร์ทิสท์ เมเนจเม้นท์ จำกัด
                    (สำนักงานใหญ่) เลขที่ 3 ซอยพระรามเก้า 34 แขวงหัวหมาก
                    เขตบางกะปิ กรุงเทพมหานคร 10240
                  </p>
                }
                action={
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "บริษัท อินดิเพนเด้นท์ อาร์ทิสท์ เมเนจเม้นท์ จำกัด (สำนักงานใหญ่) เลขที่ 3 ซอยพระรามเก้า 34 แขวงหัวหมาก เขตบางกะปิ กรุงเทพมหานคร 10240"
                      );
                      alert("คัดลอกที่อยู่ผู้รับเรียบร้อย");
                    }}
                  >
                    <CopyAll />
                  </IconButton>
                }
              />
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Box className="container">
              <CardHeader
                title={<h4>Receive Name</h4>}
                subheader={<p translate="no">Nammonn BNK48</p>}
                action={
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText("Nammonn BNK48");
                      alert("Receive Name has been copied");
                    }}
                  >
                    <CopyAll />
                  </IconButton>
                }
              />
              <CardHeader
                title={<h4>Address</h4>}
                subheader={
                  <p translate="no">
                    Independent Artist management Co., Ltd. (HQ) 3, Soi Rama IX
                    34, Huamark, Bangkapi Bangkok 10240 THAILAND
                  </p>
                }
                action={
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "Independent Artist management Co., Ltd. (HQ) 3, Soi Rama Nine 34, Huamark, Bangkapi Bangkok 10240 THAILAND"
                      );
                      alert("Receive Address has been copied");
                    }}
                  >
                    <CopyAll />
                  </IconButton>
                }
              />
              <Typography variant="body2" color="text.secondary">
                *Please note: Due to customs regulations, we kindly recommend
                that only letters addressed to her be sent from abroad.
              </Typography>
            </Box>
          </CustomTabPanel>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <caption>
                หมายเหตุ:
                ของขวัญหรือจดหมายทุกชนิดจะมีการแกะซองหรือกล่องเพื่อคัดกรองโดยทีมงานก่อนส่งมอบให้น้ำมนต์และเมมเบอร์คนอื่นๆทุกชิ้น
                หากพบว่าจดหมายหรือของขวัญชิ้นใดไม่เป็นไปตามข้อกำหนด
                บริษัทอาจขอสงวนสิทธิ์ในการปฏิเสธการส่งมอบให้น้ำมนต์โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell align="center" variant="h3" width="50%">
                    <h5>Do ✅</h5>
                  </TableCell>
                  <TableCell align="center">
                    <h5>Don't ❌</h5>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className="bg-success">
                    จดหมายที่แสดงถึงการสนับสนุนที่ดีหรือทัศนคติเชิงบวกต่อน้ำมนต์
                  </TableCell>
                  <TableCell className="bg-danger">
                    ระบุข้อความหรืออ้างอิงด้วยสิ่งต่างๆในจดหมายหรือของขวัญที่เจาะจงถึงตัวคุณ
                    อาทิ การระบุชื่อคุณ แนบรูปถ่ายคุณไปพร้อมกับจดหมายหรือของขวัญ
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="bg-success">
                    ของขวัญสินค้าใหม่และยังไม่มีร่องรอยการใช้งาน
                    ที่มีมูลค่าไม่เกิน 3000 บาท และไม่ขัดต่อกฎระเบียบของบริษัท
                  </TableCell>
                  <TableCell className="bg-danger">
                    ส่งของขวัญเป็นของกินทุกชนิด, เงินสด บัตรกำนัล เช็คเงินสด
                    คูปองส่วนลด สิ่งของอันตรายและของผิดกฎหมาย
                    และวัตถุไวไฟทุกชนิด เครื่องใช้ไฟฟ้าและแบตเตอรี่
                    ต้นไม้หรือดอกไม้ทุกชนิด
                    เครื่องสำอางค์และอุปกรณ์เสริมความงามทุกชนิด
                    ชุดเครื่องแต่งกายที่ล่อแหลมทุกชนิด
                    แผ่นซีดีและดีวีดีที่จัดทำด้วยตนเองทุกกรณี
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="bg-success">
                    หากมีการส่งมากกว่า 1 เมมเบอร์ให้แยกกล่อง/ซอง
                    และระบุที่อยู่พร้อมชื่อเมมที่จะส่งให้ถูกต้องเพื่อความสะดวกในการคัดแยก
                  </TableCell>
                  <TableCell className="bg-danger">
                    ส่งจดหมายหรือของขวัญรวมไว้ในซอง/กล่องเดียวและจ่าหน้าถึงเมมเบอร์มากกว่าหนึ่งคน
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="bg-success">
                    ของขวัญต้องไม่ใหญ่หรือมีน้ำหนักเกินไป
                    (ความยาวหรือความสูงไม่เกิน 120 ซม. หรือน้ำหนักน้อยกว่า 5
                    กิโลกรัม)
                  </TableCell>
                  <TableCell className="bg-danger">
                    ส่งของขวัญจ่าหน้าโดยมีการระบุเก็บเงินปลายทาง (COD)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Gift;
