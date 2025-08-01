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
  Typography,
  DialogContent,
  ListItemButton,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import moment from "moment";
import getAge from "get-age";
import { useHistory } from "react-router-dom";
import {
  XEmbed,
  InstagramEmbed,
  FacebookEmbed,
} from "react-social-media-embed";

ChartJS.register(ArcElement, Tooltip, Legend);

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
      {value === index && <Box className="m-0 px-0 p-0 pt-3 pb-3">{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Home = () => {
  const his = useHistory();
  const [data, setData] = React.useState(null);
  const [news, setNews] = React.useState(null);
  const [update, setUpdate] = React.useState(null);
  const [getData, setGetData] = React.useState(null);
  const [getnews, setNewsi] = React.useState(null);
  const [getupdate, setUpdatei] = React.useState(null);
  const [getnewsready, setReady] = React.useState(false);
  const [launch, setUnix] = React.useState(0);

  const [nicknameslide, setNickname] = React.useState(0);
  const [value, setValue] = React.useState(0);

  const [newHome, setNewHome] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const ramdomnewswithoutdup = (d, session) => {
    let indices = [];
    let pointer = 0;
    let lastD = 0;

    if (d !== lastD) {
      lastD = d;

      indices = Array.from({ length: d }, (_, i) => i);

      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      pointer = 0;
    }

    if (pointer >= indices.length) {
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      pointer = 0;
    }

    const randomIndex = indices[pointer];
    pointer++;

    if (session === 1) {
      setNewsi(randomIndex);
    } else if (session === 2) {
      setUpdatei(randomIndex);
    }
  };

  React.useEffect(() => {
    setUnix(moment().unix());
    fetch("https://cpxdevweb.koyeb.app/api/nm/getmember", {
      method: "post",
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.response);
        setInterval(() => {
          setNickname((prevNick) => (prevNick === 2 ? 0 : prevNick + 1));
        }, 10000);
      });

    if (moment().unix() >= 1754006400) {
      setNewHome(true);
    }

    fetch("https://cpxdevweb.azurewebsites.net/api/nm/listevent", {
      method: "post",
    })
      .then((response) => response.json())
      .then((data) => {
        setNews(data);
        setNewsi(0);
        setTimeout(() => {
          setReady(true);
        }, 1000);
      });
    fetch("https://cpxdevweb.koyeb.app/api/nm/nmupdateFloat", {
      method: "post",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          setUpdatei(0);
          setUpdate(data.response);
          setInterval(() => {
            if (value == 0) {
              ramdomnewswithoutdup(data.response.length, 2);
            }
          }, 30000);
        }
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
      return {
        prepare: 100,
        launch: ready,
      };
    } else if (
      obj.timerange[0] > 0 &&
      obj.timerange[1] > 0 &&
      launch > obj.timerange[1]
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

  const HyLink = (link) => {
    window.open(link, "_blank");
  };

  if (newHome == false) {
    return (
      <Box>
        <div className="cover" data-aos="fade-in">
          <div className="profile-pic col-md-4 justify-content-end">
            <Avatar
              src={
                "https://d3hhrps04devi8.cloudfront.net/bnk48profile/nammonn.jpg"
              }
              className="prof h-100"
            />
          </div>
        </div>

        <div className="container row profile-info" translate="no">
          <div className="col-md-4"></div>
          <div className="col-md w-100 ml-md-5">
            {nicknameslide == 2 ? (
              <h1 style={{ fontSize: 26 }}>
                <b>{data != null ? "ナムモン" : <Skeleton />}</b>
              </h1>
            ) : nicknameslide == 1 ? (
              <h1 style={{ fontSize: 27 }}>
                <b>{data != null ? "น้ำมนต์" : <Skeleton />}</b>
              </h1>
            ) : (
              <h1 style={{ fontSize: 26 }}>
                <b>{data != null ? data.name.toUpperCase() : <Skeleton />}</b>
              </h1>
            )}
            <hr />
            {nicknameslide == 2 ? (
              <h3 style={{ fontSize: 19 }}>
                {data != null ? (
                  <div>ナットタモン&nbsp;&nbsp;ソンティット</div>
                ) : (
                  <Skeleton />
                )}
              </h3>
            ) : nicknameslide == 1 ? (
              <h3 style={{ fontSize: 19 }}>
                {data != null ? (
                  data.fullnameTh[0] + " " + data.fullnameTh[1]
                ) : (
                  <Skeleton />
                )}
              </h3>
            ) : (
              <h3 style={{ fontSize: 19 }}>
                {data != null ? (
                  data.fullnameEn[0] + " " + data.fullnameEn[1]
                ) : (
                  <Skeleton />
                )}
              </h3>
            )}
            {nicknameslide == 2 ? (
              <p>{data != null ? "バンコク, タイ" : <Skeleton />}</p>
            ) : nicknameslide == 1 ? (
              <p>{data != null ? "กรุงเทพ, ประเทศไทย" : <Skeleton />}</p>
            ) : (
              <p>{data != null ? data.province + ", TH" : <Skeleton />}</p>
            )}
            {nicknameslide == 2 ? (
              <i>
                {data != null ? '"オタクがアイドルやっています"' : <Skeleton />}
              </i>
            ) : nicknameslide == 1 ? (
              <i>{data != null ? '"โอตะคุที่กำลังเป็นไอดอล"' : <Skeleton />}</i>
            ) : (
              <i>{data != null ? '"The otaku-turned-idol"' : <Skeleton />}</i>
            )}
          </div>
        </div>

        <section id="home" className="content">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <div className="card ">
                <div className="card-body">
                  <h3 className="card-title">About Nammonn</h3>
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
                        primary="อายุ (ปี) | Age (years) | 年齢 (歳）"
                        secondary={
                          data != null ? (
                            getAge(
                              moment(data.birthday, "YYYY-M-DD").format(
                                "YYYY-MM-DD"
                              )
                            )
                          ) : (
                            <Skeleton />
                          )
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
                        primary="วันเดือนปีเกิด | Birthday | 誕生日"
                        secondary={
                          data != null ? (
                            moment(data.birthday, "YYYY-M-DD").format(
                              "DD MMMM YYYY"
                            )
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
                        primary="ทีมที่ขึ้นสเตจเธียเตอร์ | BNK48 Theater Stage Team | BNK48劇場公演"
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
                        primary="ส่วนสูง (เซนติเมตร) | Height (CM.) | 身長 (cm)"
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
                        primary="สิ่งที่ชอบ | Favorite | 好きなもの"
                        secondary="อนิเมะ (Anime), ไอดอลญี่ปุ่น (Japanese Idol)"
                      />
                    </ListItem>
                  </List>
                </div>
              </div>
              <div className="card mt-3">
                <div className="card-body">
                  <h3 className="card-title">Follow Nammonn</h3>
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
                        secondary={
                          data != null ? "Nammonn BNK48" : <Skeleton />
                        }
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
                        secondary={
                          data != null ? "Nammonn BNK48" : <Skeleton />
                        }
                      />
                    </ListItemButton>
                  </List>
                </div>
              </div>
              <div className="card mt-3">
                <div className="card-body">
                  <h3 className="card-title">For Nammonn BNK48 Fanclub</h3>
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
                      onClick={() =>
                        HyLink("https://twitter.com/NammonnBNK48Fc")
                      }
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
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <div
                className="card"
                style={{
                  backgroundColor: "rgba(116, 222, 248, 0.31)",
                  border: "none",
                }}
              >
                <div className="card-body">
                  <h3 className="card-title">Nammonn Update</h3>
                  <hr />
                  <div className="row mt-3">
                    <h4 className="card-title">
                      <i>Incoming Event</i>
                    </h4>
                    {news != null && news.length > 0 ? (
                      news.map(
                        (item, i) =>
                          i == getnews && (
                            <Card
                              key={item.newsId}
                              className="mt-3 pl-0 newssam"
                              data-aos={
                                getnewsready ? "fade-in" : "zoom-in-right"
                              }
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
                                        "Event status: " +
                                        checkeventstatus(item)
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
                                          display: {
                                            xs: "none",
                                            lg: "initial",
                                          },
                                        }}
                                        label={
                                          compareTimestamps(
                                            launch,
                                            item.timerange[0]
                                          ).days > 0
                                            ? "About " +
                                              compareTimestamps(
                                                launch,
                                                item.timerange[0]
                                              ).days +
                                              " day(s) and " +
                                              compareTimestamps(
                                                launch,
                                                item.timerange[0]
                                              ).hours +
                                              " hr(s) "
                                            : "In " +
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
                                        display: {
                                          xs: "inline-block",
                                          lg: "none",
                                        },
                                        marginTop: 1,
                                        padding: 0,
                                        marginLeft: 2,
                                        paddingTop: ".4rem",
                                      }}
                                      label={
                                        compareTimestamps(
                                          launch,
                                          item.timerange[0]
                                        ).days > 0
                                          ? "About " +
                                            compareTimestamps(
                                              launch,
                                              item.timerange[0]
                                            ).days +
                                            " day(s) and " +
                                            compareTimestamps(
                                              launch,
                                              item.timerange[0]
                                            ).hours +
                                            " hr(s) "
                                          : "In " +
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
                                        className="ml-2 mt-3"
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
                                    <br />
                                    <Button
                                      className="mt-2"
                                      variant="contained"
                                      onClick={() => his.push("/events")}
                                    >
                                      View other events
                                    </Button>
                                  </Grid>
                                </Grid>
                              </CardContent>
                              {!(
                                checktime(item).prepare == 0 &&
                                checktime(item).launch == 0
                              ) &&
                                item.timerange[1] > 0 &&
                                launch <= item.timerange[1] && (
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
                    <hr className="mt-3" />
                    <div className="col-lg-4 col-md-6" data-aos="zoom-in-right">
                      <iframe
                        src="https://www.facebook.com/plugins/page.php?href=https://facebook.com/nammonn.bnk48official&tabs=timeline&&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                        height="400px"
                        width="100%"
                      />
                    </div>
                    <div className="col-lg-4 col-md-6" data-aos="zoom-in-up">
                      <iframe
                        src="https://instagram.com/nammonn.bnk48official/embed"
                        height="400px"
                        width="100%"
                      />
                    </div>
                    <div className="col-lg-4 col-md-12" data-aos="zoom-in">
                      <iframe
                        src="https://www.tiktok.com/embed/@nammonn.bnk48official"
                        height="400px"
                        width="100%"
                        style={{ marginTop: -2 }}
                      />
                    </div>

                    {update != null ? (
                      <>
                        <div
                          className="col-lg-6 col-sm-12 mb-3"
                          data-aos="zoom-in"
                        >
                          {update.map(
                            (item, i) =>
                              i === getupdate && (
                                <>
                                  <XEmbed
                                    url={
                                      "https://twitter.com/NammonnBNK48FC/status/" +
                                      item.id_str
                                    }
                                    className="tweetx"
                                    style={{ height: 350 }}
                                  />
                                </>
                              )
                          )}
                          <Typography className="mt-1 text-center">
                            หมายเหตุ: ทวิตจะสุ่มแสดงผลเทรนทุกๆ 30 วินาที
                            กรณีหากเป็นคลิปวีดีโอ
                            แนะนำให้แตะที่โพสต์ทวิตเพื่อรับชมวีดีโอแบบเต็ม
                          </Typography>
                        </div>
                        <div className="col-md-6" data-aos="zoom-in">
                          <iframe
                            src="https://open.spotify.com/embed/playlist/0G9srwf10s3QC0lObFXhQe?utm_source=generator"
                            width="100%"
                            height="400"
                            className="spot"
                            frameBorder="0"
                            allowfullscreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                          ></iframe>
                        </div>
                        <div className="col-12 text-center" data-aos="zoom-in">
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
                            View on Nammonn Play
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="col-lg-6 col-sm-12 text-center"
                          data-aos="zoom-in"
                        >
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
                            View on Nammonn Play
                          </Button>
                        </div>
                        <div className="col-md-6" data-aos="zoom-in">
                          <iframe
                            src="https://open.spotify.com/embed/playlist/0G9srwf10s3QC0lObFXhQe?utm_source=generator"
                            width="100%"
                            height="400"
                            className="spot"
                            frameBorder="0"
                            allowfullscreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                          ></iframe>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>

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
        </section>
      </Box>
    );
  }

  return (
    <Box>
      <div className="cover" data-aos="fade-in">
        <div className="profile-pic col-md-4 justify-content-end">
          <Avatar
            src={
              "https://d3hhrps04devi8.cloudfront.net/bnk48profile/nammonn.jpg"
            }
            className="prof h-100"
          />
        </div>
      </div>

      <div className="container row profile-info" translate="no">
        <div className="col-md-4"></div>
        <div className="col-md w-100 ml-md-5">
          {nicknameslide == 2 ? (
            <h1 style={{ fontSize: 26 }}>
              <b>{data != null ? "ナムモン" : <Skeleton />}</b>
            </h1>
          ) : nicknameslide == 1 ? (
            <h1 style={{ fontSize: 27 }}>
              <b>{data != null ? "น้ำมนต์" : <Skeleton />}</b>
            </h1>
          ) : (
            <h1 style={{ fontSize: 26 }}>
              <b>{data != null ? data.name.toUpperCase() : <Skeleton />}</b>
            </h1>
          )}
          <hr />
          {nicknameslide == 2 ? (
            <h3 style={{ fontSize: 19 }}>
              {data != null ? (
                <div>ナットタモン&nbsp;&nbsp;ソンティット</div>
              ) : (
                <Skeleton />
              )}
            </h3>
          ) : nicknameslide == 1 ? (
            <h3 style={{ fontSize: 19 }}>
              {data != null ? (
                data.fullnameTh[0] + " " + data.fullnameTh[1]
              ) : (
                <Skeleton />
              )}
            </h3>
          ) : (
            <h3 style={{ fontSize: 19 }}>
              {data != null ? (
                data.fullnameEn[0] + " " + data.fullnameEn[1]
              ) : (
                <Skeleton />
              )}
            </h3>
          )}
          {nicknameslide == 2 ? (
            <p>{data != null ? "バンコク, タイ" : <Skeleton />}</p>
          ) : nicknameslide == 1 ? (
            <p>{data != null ? "กรุงเทพ, ประเทศไทย" : <Skeleton />}</p>
          ) : (
            <p>{data != null ? data.province + ", TH" : <Skeleton />}</p>
          )}
          {nicknameslide == 2 ? (
            <i>
              {data != null ? '"オタクがアイドルやっています"' : <Skeleton />}
            </i>
          ) : nicknameslide == 1 ? (
            <i>{data != null ? '"โอตะคุที่กำลังเป็นไอดอล"' : <Skeleton />}</i>
          ) : (
            <i>{data != null ? '"The otaku-turned-idol"' : <Skeleton />}</i>
          )}
        </div>
      </div>

      <section id="home" className="content">
        <Grid container className="d-flex justify-content-center" spacing={2}>
          <Grid size={{ xs: 12, md: 10 }}>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">About Nammonn</h3>
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
                      primary="อายุ (ปี) | Age (years) | 年齢 (歳）"
                      secondary={
                        data != null ? (
                          getAge(
                            moment(data.birthday, "YYYY-M-DD").format(
                              "YYYY-MM-DD"
                            )
                          )
                        ) : (
                          <Skeleton />
                        )
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
                      primary="วันเดือนปีเกิด | Birthday | 誕生日"
                      secondary={
                        data != null ? (
                          moment(data.birthday, "YYYY-M-DD").format(
                            "DD MMMM YYYY"
                          )
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
                      primary="ทีมที่ขึ้นสเตจเธียเตอร์ | BNK48 Theater Stage Team | BNK48劇場公演"
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
                      primary="ส่วนสูง (เซนติเมตร) | Height (CM.) | 身長 (cm)"
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
                      primary="สิ่งที่ชอบ | Favorite | 好きなもの"
                      secondary="อนิเมะ (Anime), ไอดอลญี่ปุ่น (Japanese Idol)"
                    />
                  </ListItem>
                </List>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="card mt-3">
              <div className="card-body">
                <h3 className="card-title">Follow Nammonn</h3>
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
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <div className="card mt-3">
              <div className="card-body">
                <h3 className="card-title">For Nammonn BNK48 Fanclub</h3>
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
          <Grid size={{ xs: 12, md: 9 }}>
            <div
              className="card"
              style={{
                backgroundColor: "rgba(116, 222, 248, 0.31)",
                border: "none",
              }}
            >
              <div className="card-body">
                <h3 className="card-title">Nammonn Update</h3>
                <hr />
                <div className="row mt-3">
                  <h4 className="card-title">
                    <i>Incoming Event</i>
                  </h4>
                  {news != null && news.length > 0 ? (
                    news.map(
                      (item, i) =>
                        i == getnews && (
                          <Card
                            key={item.newsId}
                            className="mt-3 pl-0 newssam"
                            data-aos={
                              getnewsready ? "fade-in" : "zoom-in-right"
                            }
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
                                        compareTimestamps(
                                          launch,
                                          item.timerange[0]
                                        ).days > 0
                                          ? "About " +
                                            compareTimestamps(
                                              launch,
                                              item.timerange[0]
                                            ).days +
                                            " day(s) and " +
                                            compareTimestamps(
                                              launch,
                                              item.timerange[0]
                                            ).hours +
                                            " hr(s) "
                                          : "In " +
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
                                      display: {
                                        xs: "inline-block",
                                        lg: "none",
                                      },
                                      marginTop: 1,
                                      padding: 0,
                                      marginLeft: 2,
                                      paddingTop: ".4rem",
                                    }}
                                    label={
                                      compareTimestamps(
                                        launch,
                                        item.timerange[0]
                                      ).days > 0
                                        ? "About " +
                                          compareTimestamps(
                                            launch,
                                            item.timerange[0]
                                          ).days +
                                          " day(s) and " +
                                          compareTimestamps(
                                            launch,
                                            item.timerange[0]
                                          ).hours +
                                          " hr(s) "
                                        : "In " +
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
                                      className="ml-2 mt-3"
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
                                  <br />
                                  <Button
                                    className="mt-2"
                                    variant="contained"
                                    onClick={() => his.push("/events")}
                                  >
                                    View other events
                                  </Button>
                                </Grid>
                              </Grid>
                            </CardContent>
                            {!(
                              checktime(item).prepare == 0 &&
                              checktime(item).launch == 0
                            ) &&
                              item.timerange[1] > 0 &&
                              launch <= item.timerange[1] && (
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
                  <hr className="mt-3" />
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      sx={{ display: { xs: "none", lg: "block" } }}
                      value={value}
                      onChange={handleChange}
                      centered
                    >
                      <Tab label="X Trend Update" {...a11yProps(0)} />
                      <Tab label="Instagram Update" {...a11yProps(1)} />
                      <Tab label="Tiktok Update" {...a11yProps(2)} />
                      <Tab
                        label="Nammonn Sound (Spotify Playlist)"
                        {...a11yProps(3)}
                      />
                    </Tabs>
                    <Tabs
                      sx={{ display: { xs: "flex", lg: "none" } }}
                      value={value}
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons
                      allowScrollButtonsMobile
                    >
                      <Tab label="X Trend Update" {...a11yProps(0)} />
                      <Tab label="Instagram Update" {...a11yProps(1)} />
                      <Tab label="Tiktok Update" {...a11yProps(2)} />
                      <Tab
                        label="Nammonn Sound (Spotify Playlist)"
                        {...a11yProps(3)}
                      />
                    </Tabs>
                  </Box>
                  <div className="justify-content-center">
                    <CustomTabPanel value={value} index={0} className="p-0 m-0 px-0">
                      {update != null ? (
                        <div className="container" data-aos="fade-in">
                          {update.map(
                            (item, i) =>
                              i === getupdate && (
                                <div className="row g-0 p-0 px-0 m-0" key={item.id_str}>
                                  <div className="col-md-7 col-12">
                                    <XEmbed
                                      url={
                                        "https://twitter.com/NammonnBNK48FC/status/" +
                                        item.id_str
                                      }
                                      className="tweetx"
                                      style={{ height: 400, width: "100%" }}
                                    />
                                  </div>
                                  <div className="col-md-5 col-12 mt-3 mt-md-0">
                                    <Typography
                                      className="text-muted"
                                      variant="h6"
                                    >
                                      Social Statistics
                                    </Typography>
                                    <Divider />
                                    <div style={{ width: "90%" }}>
                                      <Doughnut
                                        data={{
                                          labels: ["Likes", "Retweets"],
                                          datasets: [
                                            {
                                              label: "Records",
                                              data:
                                                item.retweeted ||
                                                item.text.includes("RT ")
                                                  ? [
                                                      item.retweeted_status
                                                        .favorite_count +
                                                        item.favorite_count,
                                                      item.retweeted_status
                                                        .retweet_count +
                                                        item.retweet_count,
                                                    ]
                                                  : [
                                                      item.favorite_count,
                                                      item.retweet_count,
                                                    ],
                                              backgroundColor: [
                                                "rgb(81, 148, 241)",
                                                "rgb(255, 176, 250)",
                                              ],
                                              borderWidth: 1,
                                            },
                                          ],
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )
                          )}
                          <Typography className="mt-1 text-center">
                            หมายเหตุ: ทวิตจะสุ่มแสดงผลเทรนทุกๆ 30 วินาที
                            กรณีหากเป็นคลิปวีดีโอ
                            แนะนำให้แตะที่โพสต์ทวิตเพื่อรับชมวีดีโอแบบเต็ม
                          </Typography>
                        </div>
                      ) : (
                        <>
                          <div
                            className="col-12 text-center"
                            data-aos="fade-in"
                          >
                            <div className="col-12">
                              <Skeleton
                                variant="rounded"
                                sx={{ height: 400, width: "100%" }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1} className="p-0 m-0 px-0">
                      <div className="container" data-aos="fade-in">
                        <InstagramEmbed
                          url="https://instagram.com/nammonn.bnk48official"
                          height="400px"
                          width="100%"
                        />
                      </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2} className="p-0 m-0 px-0">
                      <div className="container" data-aos="fade-in">
                        <iframe
                          src="https://www.tiktok.com/embed/@nammonn.bnk48official"
                          height="400px"
                          width="100%"
                          style={{ marginTop: -2 }}
                        />
                      </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3} className="p-0 m-0 px-0">
                      <div className="container" data-aos="fade-in">
                        <iframe
                          src="https://open.spotify.com/embed/playlist/0G9srwf10s3QC0lObFXhQe?utm_source=generator"
                          width="100%"
                          height="400"
                          className="spot"
                          frameBorder="0"
                          allowfullscreen=""
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                        ></iframe>
                      </div>
                    </CustomTabPanel>
                  </div>

                  <div className="col-12 text-center" data-aos="zoom-in">
                    <div className="col-12">
                      <iframe
                        width="100%"
                        height="400"
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
                      View on Nammonn Play
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>

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
      </section>
    </Box>
  );
};

export default Home;
