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
} from "@mui/material";
import moment from "moment";
import getAge from "get-age";

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
  const [data, setData] = React.useState(null);
  const [news, setNews] = React.useState(null);
  const [getData, setGetData] = React.useState(null);
  const launch = moment().unix();

  React.useEffect(() => {
    fetch(
      "https://cpxdevweb.runasp.net/bnk48/getmember?name=nammonn" +
        "&tstamp=" +
        Math.floor(new Date().getTime() / 1000),
      {
        method: "post",
      }
    )
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
                  }}>
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
                <h5 className="card-title">For Nammonn BNK48 Fanclub</h5>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}>
                  <ListItem data-aos="fade-right">
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-globe-asia-australia"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="BNK48 Fan Space"
                      secondary={data != null ? "Nammonn" : <Skeleton />}
                    />
                  </ListItem>
                  <ListItem data-aos="fade-right">
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
                  </ListItem>
                  <ListItem data-aos="fade-right">
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
                  </ListItem>
                  <ListItem data-aos="fade-right">
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
                  }}>
                  <ListItem data-aos="fade-right">
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-facebook"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Facebook"
                      secondary={data != null ? "Nammonn BNK48" : <Skeleton />}
                    />
                  </ListItem>
                  <ListItem data-aos="fade-right">
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
                  </ListItem>
                  <ListItem data-aos="fade-right">
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
                  </ListItem>
                  <ListItem data-aos="fade-right">
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-phone"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="IAM48 Application"
                      secondary={data != null ? "Nammonn" : <Skeleton />}
                    />
                  </ListItem>
                  <ListItem data-aos="fade-right">
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-globe-asia-australia"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="BNK48 Official Website"
                      secondary={data != null ? "Nammonn BNK48" : <Skeleton />}
                    />
                  </ListItem>
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
              }}>
              <div className="card-body">
                <h5 className="card-title">Nammonn Update</h5>
                <hr />
                <div className="row mt-3">
                  <div className="col-lg-6" data-aos="zoom-out">
                    <iframe
                      src="https://instagram.com/nammonn.bnk48official/embed"
                      height="400px"
                      width="100%"
                    />
                  </div>
                  <div className="col-lg-6" data-aos="zoom-out">
                    <blockquote
                      className="tiktok-embed m-0"
                      cite="https://www.tiktok.com/@nammonn.bnk48official"
                      data-unique-id="nammonn.bnk48official"
                      data-embed-from="oembed"
                      style={{ height: 400 }}
                      data-embed-type="creator">
                      {" "}
                      <section></section>{" "}
                    </blockquote>{" "}
                    <script
                      async
                      onerror="var a=document.createElement('script');a.src='https://iframely.net/files/tiktok-embed.js';document.body.appendChild(a);"
                      src="https://www.tiktok.com/embed.js"></script>
                  </div>
                </div>

                {news != null && news.length > 0 ? (
                  news.map((item, i) => (
                    <Card
                      key={item.newsId}
                      className="mt-3"
                      data-aos="zoom-in-right">
                      <CardContent
                        sx={{
                          opacity:
                            item.timerange[1] > 0 && launch >= item.timerange[1]
                              ? 0.4
                              : 1,
                        }}>
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
                            launch >= item.timerange[0] - 432000 &&
                            launch < item.timerange[0] && (
                              <Chip
                                className="p-1"
                                sx={{ display: { xs: "none", lg: "initial" } }}
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
                          <Grid item size={{ xs: 12, md: 5 }}>
                            <Avatar
                              src={item.src}
                              variant="rounded"
                              sx={{
                                width: { lg: "400px", xs: "100%" },
                                height: "100%",
                              }}
                            />
                          </Grid>
                          <Grid item size={{ xs: 12, md: 7 }}>
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
                                className="mt-3 mr-1">
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
                                className="mt-3">
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
                          </Grid>
                        </Grid>
                      </CardContent>
                      {!(
                        checktime(item).prepare == 0 &&
                        checktime(item).unix == 0
                      ) &&
                        item.timerange[1] > 0 &&
                        launch <= item.timerange[1] && (
                          <LinearProgress
                            sx={{
                              width: "100%",
                              height: window.innerHeight * 0.02,
                            }}
                            variant="buffer"
                            value={checktime(item).unix}
                            valueBuffer={checktime(item).prepare}
                          />
                        )}
                    </Card>
                  ))
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
    </Box>
  );
};

export default Home;
