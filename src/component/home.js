import React from "react";
import {
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid2 as Grid,
  Skeleton,
  Card,
  CardContent,
  Chip,
  CardHeader,
  LinearProgress,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  ListItemButton,
} from "@mui/material";
import moment from "moment";
import getAge from "get-age";
import { useHistory } from "react-router-dom";

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

const Home = () => {
  const his = useHistory();
  const [data, setData] = React.useState(null);
  const [news, setNews] = React.useState(null);
  const [getData, setGetData] = React.useState(null);
  const [getnews, setNewsi] = React.useState(null);
  const [getnewsready, setReady] = React.useState(false);
  const [launch, setUnix] = React.useState(0);
  React.useEffect(() => {
    console.log(moment().unix());
    setUnix(moment().unix());
    fetch("https://cpxdevweb.runasp.net/api/nm/getmember", {
      method: "post",
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.response);
      });

    fetch("https://cpxdevweb.azurewebsites.net/api/nm/listevent", {
      method: "post",
    })
      .then((response) => response.json())
      .then((data) => {
        setNews(data);
        setNewsi(Math.floor(Math.random() * data.length));
        setTimeout(() => {
          setReady(true);
        }, 1000);
        setInterval(() => {
          setNewsi(Math.floor(Math.random() * data.length));
        }, 10000);
        console.log(data);
      });
  }, []);

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
      launch >= obj.timerange[0] - 432000 &&
      launch < obj.timerange[0]
    ) {
      const buffer =
        ((launch - (obj.timerange[0] - 432000)) /
          (obj.timerange[0] - (obj.timerange[0] - 432000))) *
        100;
      alert(1);
      return {
        prepare: buffer,
        launch: 0,
      };
    } else if (
      obj.timerange[0] > 0 &&
      obj.timerange[1] > 0 &&
      launch >= obj.timerange[0] &&
      launch <= obj.timerange[1]
    ) {
      const ready =
        ((launch - obj.timerange[0]) / (obj.timerange[1] - obj.timerange[0])) *
        100;
      alert(2);
      return {
        prepare: 100,
        launch: ready,
      };
    } else if (
      obj.timerange[0] > 0 &&
      obj.timerange[1] > 0 &&
      launch > obj.timerange[1]
    ) {
      alert(3);
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

  const HyLink = (link) => {
    window.open(link, "_blank");
  };

  return (
    <Box>
      <div className="cover" data-aos="fade-in">
        <div className="profile-pic col-md-4 justify-content-end">
          <Avatar
            src="https://d3hhrps04devi8.cloudfront.net/bnk48profile/nammonn.jpg"
            className="prof h-100"
          />
        </div>
      </div>

      <div className="container row profile-info">
        <div className="col-md-4"></div>
        <div className="col ml-md-5">
          <h1>
            {data != null ? (
              data.fullnameEn[0] +
              " " +
              data.fullnameEn[1] +
              " [" +
              data.name +
              "]"
            ) : (
              <Skeleton />
            )}
          </h1>
          <h5>
            {data != null ? (
              data.fullnameTh[0] + " " + data.fullnameTh[1]
            ) : (
              <Skeleton />
            )}
          </h5>
          <p>{data != null ? data.province + ", TH" : <Skeleton />}</p>
        </div>
      </div>

      <section id="home" className="content">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <div className="card ">
              <div className="card-body">
                <h5 className="card-title">About Nammonn</h5>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItem data-aos="fade-right">
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-clock"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="อายุ (ปี) | Age (years)"
                      secondary={
                        data != null ? getAge(data.birthday) : <Skeleton />
                      }
                    />
                  </ListItem>
                  <ListItem data-aos="fade-right">
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-calendar-event"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="วันเดือนปีเกิด | Birthday"
                      secondary={
                        data != null ? (
                          moment(data.birthday).format("DD MMMM YYYY")
                        ) : (
                          <Skeleton />
                        )
                      }
                    />
                  </ListItem>
                  <ListItem data-aos="fade-right">
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-person-fill"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="ทีมที่ขึ้นสเตจเธียเตอร์ | BNK48 Theater Stage Team"
                      secondary="Shinjitsu Wa Yume No Naka Ni... - ความจริงที่อยู่ในความฝัน (Trainee Stage)"
                    />
                  </ListItem>
                  <ListItem data-aos="fade-right">
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-rulers"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="ส่วนสูง (เซนติเมตร) | Height (CM.)"
                      secondary={168}
                    />
                  </ListItem>
                  <ListItem data-aos="fade-right">
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-chat-heart"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="สิ่งที่ชอบ | Favorite"
                      secondary="อนิเมะ (Anime), ไอดอลญี่ปุ่น (Japanese Idol)"
                    />
                  </ListItem>
                </List>
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">Follow Nammonn</h5>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItemButton
                    data-aos="fade-right"
                    className="link"
                    onClick={() => HyLink(data.follow[0])}
                  >
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-facebook"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Facebook"
                      secondary={data != null ? "Nammonn BNK48" : <Skeleton />}
                    />
                  </ListItemButton>
                  <ListItemButton
                    data-aos="fade-right"
                    className="link"
                    onClick={() => HyLink(data.follow[1])}
                  >
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-instagram"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Instagram"
                      secondary={
                        data != null ? "nammonn.bnk48official" : <Skeleton />
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    data-aos="fade-right"
                    className="link"
                    onClick={() =>
                      HyLink("https://www.tiktok.com/@nammonn.bnk48official")
                    }
                  >
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-tiktok"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="TikTok"
                      secondary={
                        data != null ? "@nammonn.bnk48official" : <Skeleton />
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    data-aos="fade-right"
                    className="link"
                    onClick={() =>
                      HyLink("https://app.bnk48.com/members/bnk48/nammonn")
                    }
                  >
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-phone"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="IAM48 Application"
                      secondary={data != null ? "Nammonn" : <Skeleton />}
                    />
                  </ListItemButton>
                  <ListItemButton
                    data-aos="fade-right"
                    className="link"
                    onClick={() => HyLink(data.ref)}
                  >
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-globe-asia-australia"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="BNK48 Official Website"
                      secondary={data != null ? "Nammonn BNK48" : <Skeleton />}
                    />
                  </ListItemButton>
                </List>
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">For Nammonn BNK48 Fanclub</h5>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItemButton
                    data-aos="fade-right"
                    className="link"
                    onClick={() =>
                      HyLink("https://cp-bnk48.pages.dev/member/nammonn")
                    }
                  >
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-globe-asia-australia"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="BNK48 Fan Space"
                      secondary={data != null ? "Nammonn" : <Skeleton />}
                    />
                  </ListItemButton>
                  <ListItemButton
                    data-aos="fade-right"
                    className="link"
                    onClick={() =>
                      HyLink(
                        "https://facebook.com/people/Nammonn-BNK48-Thailand-Fanclub/61562375447820                                    "
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-facebook"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Facebook Fanpage"
                      secondary={
                        data != null ? (
                          "Nammonn BNK48 Thailand Fanclub"
                        ) : (
                          <Skeleton />
                        )
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    data-aos="fade-right"
                    className="link"
                    onClick={() => HyLink("https://twitter.com/NammonnBNK48Fc")}
                  >
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-twitter-x"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="X (Twitter)"
                      secondary={
                        data != null ? "@NammonnBNK48FC" : <Skeleton />
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    data-aos="fade-right"
                    className="link"
                    onClick={() =>
                      HyLink(
                        "https://line.me/ti/g2/YXDDHDlDgbq7MxAN0yuDMNDQupyLuWMc6GvzQg"
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-line"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Line Open Chat (OPC)"
                      secondary={
                        data != null ? (
                          "Nammonn BNK48 Thailand Fanclub"
                        ) : (
                          <Skeleton />
                        )
                      }
                    />
                  </ListItemButton>
                </List>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <div
              className="card"
              style={{
                backgroundColor: "rgba(116, 222, 248, 0.31)",
                border: "none",
              }}
            >
              <div className="card-body">
                <h5 className="card-title">Nammonn Update</h5>
                <hr />
                <div className="row mt-3">
                  <div className="col-lg-6" data-aos="zoom-in">
                    <iframe
                      src="https://instagram.com/nammonn.bnk48official/embed"
                      height="400px"
                      width="100%"
                    />
                  </div>
                  <div className="col-lg-6" data-aos="zoom-in">
                    <blockquote
                      class="tiktok-embed"
                      cite="https://www.tiktok.com/@nammonn.bnk48official"
                      data-unique-id="nammonn.bnk48official"
                      data-embed-from="oembed"
                      data-embed-type="creator"
                      style={{ height: 400, marginTop: -2 }}
                    >
                      {" "}
                      <section> </section>{" "}
                    </blockquote>{" "}
                    <script
                      async
                      onerror="var a=document.createElement('script');a.src='https://iframely.net/files/tiktok-embed.js';document.body.appendChild(a);"
                      src="https://www.tiktok.com/embed.js"
                    ></script>
                  </div>
                  <div className="col-lg-6 text-center" data-aos="zoom-in">
                    <div className="col-12">
                      <iframe
                        width="100%"
                        height="360"
                        src="https://www.youtube.com/embed/?listType=playlist&list=PL6s4BOFw0ckBCZAjlzPq4zrklTeKJ1OVz"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                      ></iframe>
                    </div>
                    <br />
                    <Button
                      variant="outlined"
                      className="text-dark border-dark mb-3"
                      sx={{
                        marginTop: -3,
                      }}
                      onClick={() => his.push("/nmplay")}
                    >
                      View on Youtube playlist
                    </Button>
                  </div>
                  <div className="col-md-6" data-aos="zoom-in">
                    <iframe
                      src="https://open.spotify.com/embed/playlist/7MGjeDqqWAM7HjCWBtX6gm?utm_source=generator"
                      width="100%"
                      height="400"
                      frameBorder="0"
                      allowfullscreen=""
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
                <hr />
                <h3 className="card-title">Highlight Event</h3>

                {news != null && news.length > 0 ? (
                  news.map(
                    (item, i) =>
                      i == getnews && (
                        <Card
                          key={item.newsId}
                          className="mt-3"
                          data-aos={getnewsready ? "fade-in" : "zoom-in-right"}
                        >
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
                                <h5>{item.title.replaceAll('\\"', '"')}</h5>
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
                                launch >= item.timerange[0] - 432000 &&
                                launch < item.timerange[0] && (
                                  <Chip
                                    className="p-1"
                                    sx={{
                                      display: { xs: "none", lg: "initial" },
                                    }}
                                    label={
                                      "Event start in " +
                                      compareTimestamps(
                                        launch,
                                        item.timerange[0]
                                      ).days +
                                      " day(s) " +
                                      compareTimestamps(
                                        launch,
                                        item.timerange[0]
                                      ).hours +
                                      " hr(s) " +
                                      compareTimestamps(
                                        launch,
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
                              launch >= item.timerange[0] - 432000 &&
                              launch < item.timerange[0] && (
                                <Chip
                                  sx={{
                                    display: { xs: "inline-block", lg: "none" },
                                    marginTop: 1,
                                    padding: 0,
                                    paddingTop: ".4rem",
                                  }}
                                  label={
                                    "Event start in " +
                                    compareTimestamps(launch, item.timerange[0])
                                      .days +
                                    " day(s) " +
                                    compareTimestamps(launch, item.timerange[0])
                                      .hours +
                                    " hr(s) " +
                                    compareTimestamps(launch, item.timerange[0])
                                      .minutes +
                                    " minute(s)"
                                  }
                                  color="primary"
                                />
                              )}
                            <hr />
                            <Grid container spacing={1}>
                              <Grid item size={{ xs: 12, md: 6 }}>
                                <Avatar
                                  src={item.src}
                                  variant="rounded"
                                  sx={{
                                    width: "100%",
                                    height: { md: 300, xs: "100%" },
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                size={{ xs: 12, md: 6 }}
                                sx={{ paddingLeft: { md: 2, xs: 0 } }}
                              >
                                {/* {item.video != "" && (
                              <Chip
                                sx={{
                                  display: "inline-block",
                                  marginBottom: 3,
                                  padding: 0,
                                  paddingTop: ".4rem",
                                  cursor: "pointer",
                                }}
                                label={
                                  "Video attached avaliable. Click here to watching!"
                                }
                                onClick={() => {
                                  Swal.fire({
                                    title: "Event highlight video",
                                    html:
                                      '<iframe width="100%" height="300" src="' +
                                      item.video +
                                      '" frameborder="0"></iframe>',
                                  });
                                }}
                                color="primary"
                              />
                            )} */}
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
                                    {" to "}
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
                                    Event start on{" "}
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
                                {item.timerange[0] > 0 &&
                                  item.timerange[1] > 0 && (
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
                                          : "https://cp-bnk48.pages.dev/" +
                                              item.link,
                                        "_blank"
                                      )
                                    }
                                    className="ml-2 mt-3"
                                  >
                                    {"View more"}
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
                                <br />
                                <Button
                                  className="mt-2"
                                  variant="contained"
                                  onClick={() => his.push("/events")}
                                >
                                  View more upcoming event
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                          {(checktime(item).prepare > 0 ||
                            checktime(item).unix > 0) &&
                            item.timerange[1] > 0 &&
                            launch <= item.timerange[1] && (
                              <LinearProgress
                                sx={{
                                  width: "100%",
                                  height: {
                                    xs: window.innerHeight * 0.02,
                                    md: 20,
                                  },
                                }}
                                variant="buffer"
                                value={checktime(item).unix}
                                valueBuffer={checktime(item).prepare}
                              />
                            )}
                        </Card>
                      )
                  )
                ) : news != null && news.length == 0 ? (
                  <Card className="mt-3" data-aos="fade-right">
                    <CardContent className="text-center">
                      ช่วงนี้หนูยังว่างอยู่ จ้างได้นะคะ 😉
                      (น้องน้ำมนต์ไม่ได้กล่าว)
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="mt-3" data-aos="fade-right">
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
            </div>
          </Grid>
        </Grid>
      </section>

      <Dialog open={getData != undefined} maxWidth="xl">
        <DialogTitle id="alert-dialog-title">Event Location</DialogTitle>
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
              <Skeleton variant="text" className="bg-m" sx={{ height: 400 }} />
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
            Close
          </Button>
          <Button
            onClick={() =>
              getData != null && getData != undefined
                ? window.open(getData.place, "_blank")
                : null
            }
          >
            View on Google Maps
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
