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
  DialogActions,
} from "@mui/material";
import moment from "moment";
import Swal from "sweetalert2";
import { RefreshRounded, CircleNotifications } from "@mui/icons-material";
import OneSignal from "react-onesignal";

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

const launch = moment().unix();

const Event = ({ }) => {
  const [data, setData] = React.useState(null);
  const [getData, setGetData] = React.useState(null);
  const [unix, setUnix] = React.useState(launch);

  const event = React.useRef(null);
  const [open, setOpen] = React.useState(false);

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

    fetch("https://cpxdevweb.koyeb.app/api/nm/listevent", requestOptions)
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
  }, []);

  const pushMessageEnable = () => {
    Swal.fire({
      title: "ยืนยันการเปิดใช้งาน",
      text: 'การเปิดการแจ้งเตือนจะทำให้คุณไม่พลาดทุกกิจกรรมของน้องน้ำมนต์',
      footer: 'คุณสามารถยกเลิกการแจ้งเตือนได้จากบราวเซอร์ที่คุณใช้งานอยู่',
      showCancelButton: true,
      confirmButtonText: "เปิดใช้งาน",
      cancelButtonText: `ยกเลิก`
    }).then((result) => {
      if (result.isConfirmed) {
        OneSignal.isPushNotificationsEnabled().then((enabled) => {
          if (!enabled) {
            OneSignal.showSlidedownPrompt({ force: true });
          }
        });
      }
    });
  }

  return (
    <Box sx={{ marginTop: 10 }} data-aos="fade-in">
      <Box sx={{ marginBottom: 15 }}>
        <CardHeader
          title={<h3>Incoming Events of Nammonn</h3>}
          subheader="เช็คกิจกรรมน้องน้ำมนต์ได้ทุกที่ ทุกเวลา"
          action={<IconButton onClick={() => pushMessageEnable()} aria-label="enablenoti" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="เปิดการแจ้งเตือนเพื่อไม่พลาดทุกข่าวสารกิจกรรมของน้องน้ำมนต์">
            <CircleNotifications color="primary" fontSize="large" />
          </IconButton>}
        />
        <div className="container mt-3">
          {data != null ? (
            <>
              {data.map((item, i) => (
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
                              compareTimestamps(unix, item.timerange[0]).days +
                              " day(s) " +
                              compareTimestamps(unix, item.timerange[0]).hours +
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
                            compareTimestamps(unix, item.timerange[0]).days +
                            " day(s) " +
                            compareTimestamps(unix, item.timerange[0]).hours +
                            " hr(s) " +
                            compareTimestamps(unix, item.timerange[0]).minutes +
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
                          {"Description"}: {item.desc2.replaceAll('\\"', '"')}
                        </p>
                        {item.timerange[0] > 0 && item.timerange[1] > 0 && (
                          <small>
                            <i>
                              {"Notes"}:{" "}
                              {
                                "Event time duration are based on device timezone."
                              }
                            </i>
                          </small>
                        )}
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
                                  : "https://cp-bnk48.pages.dev/" + item.link,
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
                    checktime(item).prepare == 0 && checktime(item).launch == 0
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
