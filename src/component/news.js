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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Divider,
  DialogActions,
  CardActions,
  CardMedia,
} from "@mui/material";
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

const Event = ({}) => {
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

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };

    setOpen(notiCheck());
    setInterval(() => {
      setOpen(notiCheck());
    }, 1000);
    fetch("https://cpxdevweb.azurewebsites.net/api/nm/listevent", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setGetData(undefined);
        const sortedInput1 = result
          .filter((x) => x.timerange[1] > 0)
          .sort((a, b) => a.timerange[0] - b.timerange[0]);
        const sortedInput2 = result
          .filter((x) => x.timerange[1] == 0)
          .sort((a, b) => b.timerange[0] - a.timerange[0]);
        const newresult = [];
        sortedInput1.forEach((item) => newresult.push(item));
        sortedInput2.forEach((item) => newresult.push(item));
        setData(newresult);
      })
      .catch((error) => console.log("error", error));

    if (moment().unix() > 1754758800) {
      setNewsLayout(true);
    }
    fetch("https://cpxdevweb.azurewebsites.net/api/nm/getcurrenttime", {
      method: "post",
    })
      .then((response) => response.text())
      .then((data) => {
        if (parseInt(data) > 1754758800) {
          setNewsLayout(true);
        }
      });
  }, []);

  return (
    <Box sx={{ marginTop: 10 }} data-aos="fade-in">
      <Box sx={{ marginBottom: 15 }}>
        <CardHeader
          title={<h3>Incoming Events of Nammonn</h3>}
          subheader="เช็คกิจกรรมน้องน้ำมนต์ได้ทุกที่ ทุกเวลา"
          action={
            OneSignal.Notifications.isPushSupported() && (
              <IconButton
                aria-label="enablenoti"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="เปิดการแจ้งเตือนเพื่อไม่พลาดทุกข่าวสารกิจกรรมของน้องน้ำมนต์"
              >
                {open ? (
                  <NotificationsActive color="primary" fontSize="large" />
                ) : (
                  <CircleNotifications fontSize="large" />
                )}
              </IconButton>
            )
          }
        />
        {OneSignal.Notifications.isPushSupported() && !open ? (
          <Card className="container mb-5 shake">
            <CardContent>
              <CardHeader
                title="เว็บไซต์นี้รองรับการรับการแจ้งเตือนข่าวสารผ่านระบบ Web Push Notification"
                subheader={
                  <p>
                    เพื่อให้คุณไม่พลาดทุกกิจกรรมของน้องน้ำมนต์ หรือ Nammonn
                    BNK48
                    คุณสามารถแตะที่ปุ่มลอยมุมขวาล่างเพื่อเปิดการแจ้งเตือนได้
                    (สำหรับผู้ใช้งาน iOS หรือ iPad OS
                    อาจจะไม่เห็นปุ่มลอยดังกล่าวนี้หากเปิดบนเบราว์เซอร์โดยตรง)
                    กรุณา
                    <a
                      href="https://cpxstatusservice.azurewebsites.net/home/notifymanual?lang=th"
                      target="_blank"
                    >
                      คลิกที่นี่
                    </a>
                    เพื่อดูวิธีเปิดใช้งาน
                  </p>
                }
              />
            </CardContent>
          </Card>
        ) : OneSignal.Notifications.isPushSupported() == false ? (
          <Card className="container mb-5 shake">
            <CardContent>
              <CardHeader
                title="เว็บไซต์นี้อาจไม่รองรับการรับการแจ้งเตือนข่าวสารผ่านระบบ Web Push Notification ผ่านเว็บบราวเซอร์นี้ หรือคุณกำลังเข้าใช้งานผ่าน Safari โดยตรง (สำหรับผู้ใช้งาน iOS และ iPad OS)"
                subheader={
                  <p>
                    เพื่อให้คุณไม่พลาดทุกกิจกรรมของน้องน้ำมนต์ หรือ Nammonn
                    BNK48 สำหรับผู้ใช้งาน iOS หรือ iPad OS
                    อาจจะไม่เห็นปุ่มลอยดังกล่าวนี้หากเปิดบนเบราว์เซอร์โดยตรง
                    กรุณา
                    <a
                      href="https://cpxstatusservice.azurewebsites.net/home/notifymanual?lang=th"
                      target="_blank"
                    >
                      คลิกที่นี่
                    </a>
                    เพื่อดูวิธีเปิดใช้งาน
                  </p>
                }
              />
            </CardContent>
          </Card>
        ) : null}

        <Box sx={{ display: { xs: "none", md: "initial" } }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="กิจกรรมที่กำลังจะเกิดขึ้น" {...a11yProps(0)} />
            <Tab label="ประกาศสำคัญ" {...a11yProps(1)} />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            <Grid
              container
              spacing={3}
              className="d-flex justify-content-center"
            >
              {data != null &&
                data
                  .filter((x) => x.timerange[1] > 0)
                  .map(
                    (item, i) =>
                      i == 0 && (
                        <div className="container" key={item.newsId}>
                          <Card className="mb-3" data-aos="zoom-in-right">
                            <CardContent
                              sx={{
                                opacity:
                                  item.timerange[1] > 0 &&
                                  launch >= item.timerange[1]
                                    ? 0.4
                                    : 1,
                              }}
                            >
                              <CardHeader
                                className="pl-0 pb-0"
                                title={
                                  <h4>{item.title.replaceAll('\\"', '"')}</h4>
                                }
                                subheader={
                                  <Chip
                                    label={
                                      "Event status: " + checkeventstatus(item)
                                    }
                                    color="primary"
                                    variant="outlined"
                                  />
                                }
                                action={
                                  item.timerange[0] > 0 &&
                                  item.timerange[1] > 0 &&
                                  unix >= item.timerange[0] - 432000 &&
                                  unix < item.timerange[0] && (
                                    <Chip
                                      className="p-1"
                                      sx={{
                                        display: { xs: "none", lg: "initial" },
                                      }}
                                      label={
                                        "Event start in " +
                                        compareTimestamps(
                                          unix,
                                          item.timerange[0]
                                        ).days +
                                        " day(s) " +
                                        compareTimestamps(
                                          unix,
                                          item.timerange[0]
                                        ).hours +
                                        " hr(s) " +
                                        compareTimestamps(
                                          unix,
                                          item.timerange[0]
                                        ).minutes +
                                        " minute(s)"
                                      }
                                      color="primary"
                                    />
                                  )
                                }
                              />
                              {item.timerange[0] > 0 &&
                                item.timerange[1] > 0 &&
                                unix >= item.timerange[0] - 432000 &&
                                unix < item.timerange[0] && (
                                  <Chip
                                    sx={{
                                      display: {
                                        xs: "inline-block",
                                        lg: "none",
                                      },
                                      marginTop: 1,
                                      padding: 0,
                                      paddingTop: ".4rem",
                                      marginLeft: 2,
                                    }}
                                    label={
                                      "Event start in " +
                                      compareTimestamps(unix, item.timerange[0])
                                        .days +
                                      " day(s) " +
                                      compareTimestamps(unix, item.timerange[0])
                                        .hours +
                                      " hr(s) " +
                                      compareTimestamps(unix, item.timerange[0])
                                        .minutes +
                                      " minute(s)"
                                    }
                                    color="primary"
                                  />
                                )}
                              <hr />
                              <Grid container spacing={2}>
                                <Grid item size={{ md: 5, xs: 12 }}>
                                  <Avatar
                                    src={item.src}
                                    variant="rounded"
                                    sx={{
                                      width: { lg: "400px", xs: "100%" },
                                      height: "100%",
                                    }}
                                  />
                                </Grid>
                                <Grid item size={{ md: 7, xs: 12 }}>
                                  <h6 className="text-muted">
                                    {"Event Type"}: {checkeventtype(item)}
                                  </h6>

                                  {item.timerange[0] > 0 &&
                                  item.timerange[1] > 0 &&
                                  moment
                                    .unix(item.timerange[0])
                                    .local()
                                    .format("MMMM DD, YYYY") ===
                                    moment
                                      .unix(item.timerange[1])
                                      .local()
                                      .format("MMMM DD, YYYY") ? (
                                    <p>
                                      {"Event duration"}:{" "}
                                      {moment
                                        .unix(item.timerange[0])
                                        .local()
                                        .format("MMMM DD, YYYY HH:mm")}
                                      &nbsp;to&nbsp;
                                      {moment
                                        .unix(item.timerange[1])
                                        .local()
                                        .format("HH:mm")}
                                    </p>
                                  ) : item.timerange[0] > 0 &&
                                    item.timerange[1] > 0 &&
                                    moment
                                      .unix(item.timerange[0])
                                      .local()
                                      .format("MMMM DD, YYYY") !==
                                      moment
                                        .unix(item.timerange[1])
                                        .local()
                                        .format("MMMM DD, YYYY") ? (
                                    <p>
                                      {"Event duration"}:{" "}
                                      {moment
                                        .unix(item.timerange[0])
                                        .local()
                                        .format("MMMM DD, YYYY HH:mm")}
                                      {" to "}
                                      {moment
                                        .unix(item.timerange[1])
                                        .local()
                                        .format("MMMM DD, YYYY HH:mm")}
                                    </p>
                                  ) : (
                                    <p>
                                      {"Event start on "}{" "}
                                      {moment
                                        .unix(item.timerange[0])
                                        .local()
                                        .format("MMMM DD, YYYY")}
                                    </p>
                                  )}
                                  <p className="mt-4">
                                    {"Description"}:{" "}
                                    {item.desc2.replaceAll('\\"', '"')}
                                  </p>
                                  <br />
                                  {!(
                                    item.locate == null && item.place == ""
                                  ) && (
                                    <Button
                                      onClick={() => getMap(item)}
                                      disabled={
                                        item.timerange[1] > 0 &&
                                        launch >= item.timerange[1]
                                      }
                                      variant="outlined"
                                      className="mt-3 mr-1"
                                    >
                                      {"Event location"}
                                    </Button>
                                  )}
                                  {item.link != "" && (
                                    <Button
                                      variant="outlined"
                                      disabled={
                                        item.timerange[1] > 0 &&
                                        launch >= item.timerange[1]
                                      }
                                      onClick={() =>
                                        window.open(
                                          item.link.includes("http")
                                            ? item.link
                                            : "https://cp-bnk48.pages.dev/" +
                                                item.link,
                                          "_blank"
                                        )
                                      }
                                      className="mt-3"
                                    >
                                      {"More Description"}
                                    </Button>
                                  )}
                                  {item.timerange[1] > 0 &&
                                    launch >= item.timerange[1] && (
                                      <p className="mt-3 text-info">
                                        <b>
                                          {
                                            "This event will be remove from list in midnight of tomorrow. (Based on Asia/Bangkok timezone)"
                                          }
                                        </b>
                                      </p>
                                    )}
                                </Grid>
                              </Grid>
                            </CardContent>
                            {!(
                              checktime(item).prepare == 0 &&
                              checktime(item).launch == 0
                            ) &&
                              item.timerange[1] > 0 &&
                              unix <= item.timerange[1] && (
                                <LinearProgress
                                  sx={{
                                    width: "100%",
                                    height: window.innerHeight * 0.02,
                                  }}
                                  variant="buffer"
                                  value={checktime(item).launch}
                                  valueBuffer={checktime(item).prepare}
                                />
                              )}
                          </Card>
                        </div>
                      )
                  )}
              {data != null &&
                data
                  .filter((x) => x.timerange[1] > 0)
                  .map(
                    (item, i) =>
                      i > 0 && (
                        <Grid
                          size={{ xs: 6, lg: 4 }}
                          data-aos="zoom-in"
                          key={item.newsId}
                        >
                          <Card sx={{ backgroundColor: "#7ab4fa" }}>
                            <CardHeader
                              sx={{ marginTop: -1, marginBottom: -3 }}
                              className="text-center"
                              subheader={
                                <div>
                                  Event Schedule
                                  {item.timerange[0] > 0 &&
                                  item.timerange[1] > 0 &&
                                  moment
                                    .unix(item.timerange[0])
                                    .local()
                                    .format("MMMM DD, YYYY") ===
                                    moment
                                      .unix(item.timerange[1])
                                      .local()
                                      .format("MMMM DD, YYYY") ? (
                                    <p>
                                      <b>
                                        {moment
                                          .unix(item.timerange[0])
                                          .local()
                                          .format("MMMM DD, YYYY HH:mm")}
                                      </b>
                                      &nbsp;to&nbsp;
                                      <b>
                                        {moment
                                          .unix(item.timerange[1])
                                          .local()
                                          .format("HH:mm")}
                                      </b>
                                    </p>
                                  ) : item.timerange[0] > 0 &&
                                    item.timerange[1] > 0 &&
                                    moment
                                      .unix(item.timerange[0])
                                      .local()
                                      .format("MMMM DD, YYYY") !==
                                      moment
                                        .unix(item.timerange[1])
                                        .local()
                                        .format("MMMM DD, YYYY") ? (
                                    <p>
                                      <b>
                                        {moment
                                          .unix(item.timerange[0])
                                          .local()
                                          .format("MMMM DD, YYYY HH:mm")}
                                      </b>
                                      {" to "}
                                      <b>
                                        {moment
                                          .unix(item.timerange[1])
                                          .local()
                                          .format("MMMM DD, YYYY HH:mm")}
                                      </b>
                                    </p>
                                  ) : (
                                    <p>
                                      {moment
                                        .unix(item.timerange[0])
                                        .local()
                                        .format("MMMM DD, YYYY")}
                                    </p>
                                  )}
                                </div>
                              }
                            />
                            <Card>
                              <Avatar
                                src={item.src}
                                variant="rounded"
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                              {!(
                                checktime(item).prepare == 0 &&
                                checktime(item).launch == 0
                              ) &&
                                item.timerange[1] > 0 &&
                                unix <= item.timerange[1] && (
                                  <LinearProgress
                                    sx={{
                                      width: "100%",
                                      height: 9,
                                    }}
                                    variant="buffer"
                                    value={checktime(item).launch}
                                    valueBuffer={checktime(item).prepare}
                                  />
                                )}
                              <CardContent>
                                <CardHeader
                                  title={<h5>{item.title}</h5>}
                                  subheader={checkeventtype(item)}
                                />
                                <Divider />
                                <p className="text-secondary mt-2">
                                  &nbsp;&nbsp;{item.desc2}
                                </p>
                              </CardContent>
                              <CardActions>
                                {!(item.locate == null && item.place == "") && (
                                  <Button
                                    onClick={() => getMap(item)}
                                    disabled={
                                      item.timerange[1] > 0 &&
                                      launch >= item.timerange[1]
                                    }
                                    variant="outlined"
                                    className="mt-3 mr-1"
                                  >
                                    {"Event location"}
                                  </Button>
                                )}
                                {item.link != "" && (
                                  <Button
                                    variant="outlined"
                                    disabled={
                                      item.timerange[1] > 0 &&
                                      launch >= item.timerange[1]
                                    }
                                    onClick={() =>
                                      window.open(
                                        item.link.includes("http")
                                          ? item.link
                                          : "https://cp-bnk48.pages.dev/" +
                                              item.link,
                                        "_blank"
                                      )
                                    }
                                    className="mt-3"
                                  >
                                    {"More Description"}
                                  </Button>
                                )}
                              </CardActions>
                            </Card>
                          </Card>
                        </Grid>
                      )
                  )}
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {" "}
            <Grid
              container
              spacing={3}
              className="d-flex justify-content-center"
            >
              {data != null &&
                data
                  .filter((x) => x.timerange[1] == 0)
                  .map((item, i) => (
                    <Grid
                      size={{ xs: 6, lg: 4 }}
                      data-aos="zoom-in"
                      key={item.newsId}
                    >
                      <Card sx={{ backgroundColor: "#7ab4fa" }}>
                        <CardHeader
                          sx={{ marginTop: -1, marginBottom: -3 }}
                          className="text-center"
                          subheader={
                            <div>
                              <p>
                                Launch Date:&nbsp;
                                {moment
                                  .unix(item.timerange[0])
                                  .local()
                                  .format("MMMM DD, YYYY")}
                              </p>
                            </div>
                          }
                        />
                        <Card>
                          <Avatar
                            src={item.src}
                            variant="rounded"
                            sx={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                          {!(
                            checktime(item).prepare == 0 &&
                            checktime(item).launch == 0
                          ) &&
                            item.timerange[1] > 0 &&
                            unix <= item.timerange[1] && (
                              <LinearProgress
                                sx={{
                                  width: "100%",
                                  height: 9,
                                }}
                                variant="buffer"
                                value={checktime(item).launch}
                                valueBuffer={checktime(item).prepare}
                              />
                            )}
                          <CardContent>
                            <CardHeader title={<h5>{item.title}</h5>} />
                            <Divider />
                            <p className="text-secondary mt-2">
                              &nbsp;&nbsp;{item.desc2}
                            </p>
                          </CardContent>
                          <CardActions>
                            {!(item.locate == null && item.place == "") && (
                              <Button
                                onClick={() => getMap(item)}
                                disabled={
                                  item.timerange[1] > 0 &&
                                  launch >= item.timerange[1]
                                }
                                variant="outlined"
                                className="mt-3 mr-1"
                              >
                                {"Event location"}
                              </Button>
                            )}
                            {item.link != "" && (
                              <Button
                                variant="outlined"
                                disabled={
                                  item.timerange[1] > 0 &&
                                  launch >= item.timerange[1]
                                }
                                onClick={() =>
                                  window.open(
                                    item.link.includes("http")
                                      ? item.link
                                      : "https://cp-bnk48.pages.dev/" +
                                          item.link,
                                    "_blank"
                                  )
                                }
                                className="mt-3"
                              >
                                {"More Description"}
                              </Button>
                            )}
                          </CardActions>
                        </Card>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
          </CustomTabPanel>
          {data == null && (
            <Card className="container">
              <CardContent>
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "2rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
              </CardContent>
            </Card>
          )}{" "}
          <div className="container mt-5">
            <hr />
            <p>
              * Hybrid Event
              เป็นกิจกรรมที่เปิดให้เข้าร่วมทั้งแบบในงานและแบบออนไลน์
            </p>
            <p>
              **
              วันและเวลาที่ปรากฎจะอ้างอิงตามไทม์โซนของอุปกรณ์ที่คุณกำลังใช้งาน
              เพื่อให้ความเข้าใจง่ายและสามารถติดตามกิจกรรมของน้องน้ำมนต์ได้ทัดเทียมกันจากทั่วโลก
            </p>
            <p>
              *** บางกิจกรรมอาจมีการเปลี่ยนแปลงวันและเวลาตามความเหมาะสม
              คุณยังสามารถติดตามการอัปเดตข่าวสารของน้ำมนต์ได้ที่ BNK48 Official
              ทุกช่องทาง
            </p>
          </div>
        </Box>

        <Box sx={{ display: { xs: "initial", md: "none" } }}>
          <Divider />
          <CardHeader title={<h4>กิจกรรมที่กำลังจะเกิดขึ้น</h4>} />
          <div className="container mt-3">
            {data != null ? (
              <>
                {data
                  .filter((x) => x.timerange[1] > 0)
                  .map((item, i) => (
                    <Card
                      key={item.newsId}
                      data-tour="event"
                      className="mb-3"
                      data-aos="zoom-in-right"
                    >
                      <CardContent
                        sx={{
                          opacity:
                            item.timerange[1] > 0 && launch >= item.timerange[1]
                              ? 0.4
                              : 1,
                        }}
                      >
                        <CardHeader
                          className="pl-0 pb-0"
                          title={<h4>{item.title.replaceAll('\\"', '"')}</h4>}
                          subheader={
                            <Chip
                              label={"Event status: " + checkeventstatus(item)}
                              color="primary"
                              variant="outlined"
                            />
                          }
                          action={
                            item.timerange[0] > 0 &&
                            item.timerange[1] > 0 &&
                            unix >= item.timerange[0] - 432000 &&
                            unix < item.timerange[0] && (
                              <Chip
                                className="p-1"
                                sx={{ display: { xs: "none", lg: "initial" } }}
                                label={
                                  "Event start in " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .days +
                                  " day(s) " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .hours +
                                  " hr(s) " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .minutes +
                                  " minute(s)"
                                }
                                color="primary"
                              />
                            )
                          }
                        />
                        {item.timerange[0] > 0 &&
                          item.timerange[1] > 0 &&
                          unix >= item.timerange[0] - 432000 &&
                          unix < item.timerange[0] && (
                            <Chip
                              sx={{
                                display: { xs: "inline-block", lg: "none" },
                                marginTop: 1,
                                padding: 0,
                                paddingTop: ".4rem",
                                marginLeft: 2,
                              }}
                              label={
                                "Event start in " +
                                compareTimestamps(unix, item.timerange[0])
                                  .days +
                                " day(s) " +
                                compareTimestamps(unix, item.timerange[0])
                                  .hours +
                                " hr(s) " +
                                compareTimestamps(unix, item.timerange[0])
                                  .minutes +
                                " minute(s)"
                              }
                              color="primary"
                            />
                          )}
                        <hr />
                        <Grid container spacing={2}>
                          <Grid item size={{ md: 5, xs: 12 }}>
                            <Avatar
                              src={item.src}
                              variant="rounded"
                              sx={{
                                width: { lg: "400px", xs: "100%" },
                                height: "100%",
                              }}
                            />
                          </Grid>
                          <Grid item size={{ md: 7, xs: 12 }}>
                            <h6 className="text-muted">
                              {"Event Type"}: {checkeventtype(item)}
                            </h6>

                            {item.timerange[0] > 0 &&
                            item.timerange[1] > 0 &&
                            moment
                              .unix(item.timerange[0])
                              .local()
                              .format("MMMM DD, YYYY") ===
                              moment
                                .unix(item.timerange[1])
                                .local()
                                .format("MMMM DD, YYYY") ? (
                              <p>
                                {"Event duration"}:{" "}
                                {moment
                                  .unix(item.timerange[0])
                                  .local()
                                  .format("MMMM DD, YYYY HH:mm")}
                                &nbsp;to&nbsp;
                                {moment
                                  .unix(item.timerange[1])
                                  .local()
                                  .format("HH:mm")}
                              </p>
                            ) : item.timerange[0] > 0 &&
                              item.timerange[1] > 0 &&
                              moment
                                .unix(item.timerange[0])
                                .local()
                                .format("MMMM DD, YYYY") !==
                                moment
                                  .unix(item.timerange[1])
                                  .local()
                                  .format("MMMM DD, YYYY") ? (
                              <p>
                                {"Event duration"}:{" "}
                                {moment
                                  .unix(item.timerange[0])
                                  .local()
                                  .format("MMMM DD, YYYY HH:mm")}
                                {" to "}
                                {moment
                                  .unix(item.timerange[1])
                                  .local()
                                  .format("MMMM DD, YYYY HH:mm")}
                              </p>
                            ) : (
                              <p>
                                {"Event start on "}{" "}
                                {moment
                                  .unix(item.timerange[0])
                                  .local()
                                  .format("MMMM DD, YYYY")}
                              </p>
                            )}
                            <p className="mt-4">
                              {"Description"}:{" "}
                              {item.desc2.replaceAll('\\"', '"')}
                            </p>
                            <br />
                            {!(item.locate == null && item.place == "") && (
                              <Button
                                onClick={() => getMap(item)}
                                disabled={
                                  item.timerange[1] > 0 &&
                                  launch >= item.timerange[1]
                                }
                                variant="outlined"
                                className="mt-3 mr-1"
                              >
                                {"Event location"}
                              </Button>
                            )}
                            {item.link != "" && (
                              <Button
                                variant="outlined"
                                disabled={
                                  item.timerange[1] > 0 &&
                                  launch >= item.timerange[1]
                                }
                                onClick={() =>
                                  window.open(
                                    item.link.includes("http")
                                      ? item.link
                                      : "https://cp-bnk48.pages.dev/" +
                                          item.link,
                                    "_blank"
                                  )
                                }
                                className="mt-3"
                              >
                                {"More Description"}
                              </Button>
                            )}
                            {item.timerange[1] > 0 &&
                              launch >= item.timerange[1] && (
                                <p className="mt-3 text-info">
                                  <b>
                                    {
                                      "This event will be remove from list in midnight of tomorrow. (Based on Asia/Bangkok timezone)"
                                    }
                                  </b>
                                </p>
                              )}
                          </Grid>
                        </Grid>
                      </CardContent>
                      {!(
                        checktime(item).prepare == 0 &&
                        checktime(item).launch == 0
                      ) &&
                        item.timerange[1] > 0 &&
                        unix <= item.timerange[1] && (
                          <LinearProgress
                            sx={{
                              width: "100%",
                              height: window.innerHeight * 0.02,
                            }}
                            variant="buffer"
                            value={checktime(item).launch}
                            valueBuffer={checktime(item).prepare}
                          />
                        )}
                    </Card>
                  ))}
              </>
            ) : (
              <Card>
                <CardContent>
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "2rem" }}
                  />
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "1rem" }}
                  />
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "1rem" }}
                  />
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "1rem" }}
                  />
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "1rem" }}
                  />
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "1rem" }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
          <Divider className="mt-4" />
          <CardHeader title={<h4>ประกาศสำคัญ</h4>} />
          <div className="container mt-3">
            {data != null ? (
              <>
                {data
                  .filter((x) => x.timerange[1] == 0)
                  .map((item, i) => (
                    <Card
                      key={item.newsId}
                      data-tour="event"
                      className="mb-3"
                      data-aos="zoom-in-right"
                    >
                      <CardContent
                        sx={{
                          opacity:
                            item.timerange[1] > 0 && launch >= item.timerange[1]
                              ? 0.4
                              : 1,
                        }}
                      >
                        <CardHeader
                          className="pl-0 pb-0"
                          title={<h4>{item.title.replaceAll('\\"', '"')}</h4>}
                          subheader={
                            <Chip
                              label={"Event status: " + checkeventstatus(item)}
                              color="primary"
                              variant="outlined"
                            />
                          }
                          action={
                            item.timerange[0] > 0 &&
                            item.timerange[1] > 0 &&
                            unix >= item.timerange[0] - 432000 &&
                            unix < item.timerange[0] && (
                              <Chip
                                className="p-1"
                                sx={{ display: { xs: "none", lg: "initial" } }}
                                label={
                                  "Event start in " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .days +
                                  " day(s) " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .hours +
                                  " hr(s) " +
                                  compareTimestamps(unix, item.timerange[0])
                                    .minutes +
                                  " minute(s)"
                                }
                                color="primary"
                              />
                            )
                          }
                        />
                        {item.timerange[0] > 0 &&
                          item.timerange[1] > 0 &&
                          unix >= item.timerange[0] - 432000 &&
                          unix < item.timerange[0] && (
                            <Chip
                              sx={{
                                display: { xs: "inline-block", lg: "none" },
                                marginTop: 1,
                                padding: 0,
                                paddingTop: ".4rem",
                                marginLeft: 2,
                              }}
                              label={
                                "Event start in " +
                                compareTimestamps(unix, item.timerange[0])
                                  .days +
                                " day(s) " +
                                compareTimestamps(unix, item.timerange[0])
                                  .hours +
                                " hr(s) " +
                                compareTimestamps(unix, item.timerange[0])
                                  .minutes +
                                " minute(s)"
                              }
                              color="primary"
                            />
                          )}
                        <hr />
                        <Grid container spacing={2}>
                          <Grid item size={{ md: 5, xs: 12 }}>
                            <Avatar
                              src={item.src}
                              variant="rounded"
                              sx={{
                                width: { lg: "400px", xs: "100%" },
                                height: "100%",
                              }}
                            />
                          </Grid>
                          <Grid item size={{ md: 7, xs: 12 }}>
                            <h6 className="text-muted">
                              {"Event Type"}: {checkeventtype(item)}
                            </h6>

                            {item.timerange[0] > 0 &&
                            item.timerange[1] > 0 &&
                            moment
                              .unix(item.timerange[0])
                              .local()
                              .format("MMMM DD, YYYY") ===
                              moment
                                .unix(item.timerange[1])
                                .local()
                                .format("MMMM DD, YYYY") ? (
                              <p>
                                {"Event duration"}:{" "}
                                {moment
                                  .unix(item.timerange[0])
                                  .local()
                                  .format("MMMM DD, YYYY HH:mm")}
                                &nbsp;to&nbsp;
                                {moment
                                  .unix(item.timerange[1])
                                  .local()
                                  .format("HH:mm")}
                              </p>
                            ) : item.timerange[0] > 0 &&
                              item.timerange[1] > 0 &&
                              moment
                                .unix(item.timerange[0])
                                .local()
                                .format("MMMM DD, YYYY") !==
                                moment
                                  .unix(item.timerange[1])
                                  .local()
                                  .format("MMMM DD, YYYY") ? (
                              <p>
                                {"Event duration"}:{" "}
                                {moment
                                  .unix(item.timerange[0])
                                  .local()
                                  .format("MMMM DD, YYYY HH:mm")}
                                {" to "}
                                {moment
                                  .unix(item.timerange[1])
                                  .local()
                                  .format("MMMM DD, YYYY HH:mm")}
                              </p>
                            ) : (
                              <p>
                                {"Event start on "}{" "}
                                {moment
                                  .unix(item.timerange[0])
                                  .local()
                                  .format("MMMM DD, YYYY")}
                              </p>
                            )}
                            <p className="mt-4">
                              {"Description"}:{" "}
                              {item.desc2.replaceAll('\\"', '"')}
                            </p>
                            <br />
                            {!(item.locate == null && item.place == "") && (
                              <Button
                                onClick={() => getMap(item)}
                                disabled={
                                  item.timerange[1] > 0 &&
                                  launch >= item.timerange[1]
                                }
                                variant="outlined"
                                className="mt-3 mr-1"
                              >
                                {"Event location"}
                              </Button>
                            )}
                            {item.link != "" && (
                              <Button
                                variant="outlined"
                                disabled={
                                  item.timerange[1] > 0 &&
                                  launch >= item.timerange[1]
                                }
                                onClick={() =>
                                  window.open(
                                    item.link.includes("http")
                                      ? item.link
                                      : "https://cp-bnk48.pages.dev/" +
                                          item.link,
                                    "_blank"
                                  )
                                }
                                className="mt-3"
                              >
                                {"More Description"}
                              </Button>
                            )}
                            {item.timerange[1] > 0 &&
                              launch >= item.timerange[1] && (
                                <p className="mt-3 text-info">
                                  <b>
                                    {
                                      "This event will be remove from list in midnight of tomorrow. (Based on Asia/Bangkok timezone)"
                                    }
                                  </b>
                                </p>
                              )}
                          </Grid>
                        </Grid>
                      </CardContent>
                      {!(
                        checktime(item).prepare == 0 &&
                        checktime(item).launch == 0
                      ) &&
                        item.timerange[1] > 0 &&
                        unix <= item.timerange[1] && (
                          <LinearProgress
                            sx={{
                              width: "100%",
                              height: window.innerHeight * 0.02,
                            }}
                            variant="buffer"
                            value={checktime(item).launch}
                            valueBuffer={checktime(item).prepare}
                          />
                        )}
                    </Card>
                  ))}
              </>
            ) : (
              <Card>
                <CardContent>
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "2rem" }}
                  />
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "1rem" }}
                  />
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "1rem" }}
                  />
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "1rem" }}
                  />
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "1rem" }}
                  />
                  <Skeleton
                    variant="text"
                    className="bg-m"
                    sx={{ fontSize: "1rem" }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
          <div className="container mt-5">
            <hr />
            <p>
              * Hybrid Event
              เป็นกิจกรรมที่เปิดให้เข้าร่วมทั้งแบบในงานและแบบออนไลน์
            </p>
            <p>
              **
              วันและเวลาที่ปรากฎจะอ้างอิงตามไทม์โซนของอุปกรณ์ที่คุณกำลังใช้งาน
              เพื่อให้ความเข้าใจง่ายและสามารถติดตามกิจกรรมของน้องน้ำมนต์ได้ทัดเทียมกันจากทั่วโลก
            </p>
            <p>
              *** บางกิจกรรมอาจมีการเปลี่ยนแปลงวันและเวลาตามความเหมาะสม
              คุณยังสามารถติดตามการอัปเดตข่าวสารของน้ำมนต์ได้ที่ BNK48 Official
              ทุกช่องทาง
            </p>
             <p>
              **** เนื่องด้วยการสวรรคตของสมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ พระบรมราชชนนีพันปีหลวง บางกิจกรรมอาจมีการปรับเปลี่ยนแนวทางให้ลดความรื่นเริงลง เพื่อเป็นการไว้อาลัย กรุณาติดตามรายละเอียดเพิ่มเติมได้ที่ทุกช่องทางของ BNK48 Official
            </p>
          </div>
        </Box>

        <Dialog open={getData != undefined} maxWidth="xl">
          <DialogTitle id="alert-dialog-title">{"Event Location"}</DialogTitle>
          <DialogContent>
            {getData != undefined && getData != null ? (
              <>
                <iframe
                  width="100%"
                  height="450"
                  style={{ border: "none" }}
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  src={
                    "https://www.google.com/maps/embed/v1/place?key=AIzaSyAL0rpaALNBZalhJuywgqWl4sgFDvXVSz4&q=" +
                    getData.locate[0] +
                    "," +
                    getData.locate[1]
                  }
                ></iframe>
              </>
            ) : (
              <>
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ height: 400 }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setGetData(null);
              }}
            >
              {"Close"}
            </Button>
            <Button
              onClick={() =>
                getData != null && getData != undefined
                  ? window.open(getData.place, "_blank")
                  : null
              }
            >
              {"View on Google Maps"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Event;
