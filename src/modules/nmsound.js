import React from "react";
import {
  Box,
  Grid2 as Grid,
  CardHeader,
  CardContent,
  Card,
  Skeleton,
  Typography,
  CardMedia,
  CardActionArea,
  Button,
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  CardActions,
  DialogActions,
  Divider,
} from "@mui/material";
import moment from "moment";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function convertUrlsAndHashtagsToLinks(text) {
  // Regular expressions to match URLs and hashtags
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;
  const hashtagRegex = /#([A-Zกa-z\u0E00-\u0E7F\w0-9_]+)/g;

  // Replace URLs with clickable links
  text = text.replace(urlRegex, function (match) {
    return (
      '<a class="App-link" href="' +
      match +
      '" target="_blank">' +
      match +
      "</a>"
    );
  });

  // Replace hashtags with clickable links
  text = text.replace(hashtagRegex, function (match, hashtag) {
    return (
      '<a class="App-link" href="https://x.com/hashtag/' +
      hashtag +
      '?src=hashtag_click&f=live" target="_blank">' +
      match +
      "</a>"
    );
  });

  return text;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NMSound = () => {
  const [data, setData] = React.useState(null);
  const [tag, setTag] = React.useState(0);
  const [d, setDirect] = React.useState("r");
  const [highlight, setHigh] = React.useState(true);
  React.useEffect(() => {
    fetch("https://cpxdevweb.koyeb.app/api/nm/nmsound", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 200) {
          setData(result.res.tracks.items);
          setTimeout(() => {
            if (highlight) {
              setHigh(false);
            }
          }, 5000);
        }
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Box sx={{ marginTop: 3 }} data-aos="fade-down">
      <Typography variant="body2" gutterBottom className="text-center">
        ผลงานเพลงของน้ำมนต์บนสตรีมมิ่งแพลตฟอร์ม ให้บริการโดย Spotify
      </Typography>
      <Box
        className="mt-3 mb-3"
        sx={{ display: { xs: "none", md: "initial" } }}
      >
        {data != null ? (
          <Grid
            className="d-flex justify-content-center mt-3"
            container
            spacing={1}
          >
            {data.map((item, i) => (
              <Grid
                key={item.track.id}
                size={{ lg: 3, xs: 6 }}
                data-aos="fade-right"
                data-aos-delay={i * 200}
              >
                <Card>
                  <CardContent className="text-center">
                    <Typography className="mb-3" variant="subtitle">
                      Released since{" "}
                      {moment(item.track.album.release_date)
                        .lang("th")
                        .format("MMMM DD, YYYY")}
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="img"
                    image={item.track.album.images[0].url}
                    alt={item.track.name}
                  />
                  <CardContent className="text-center">
                    <CardHeader
                      title={
                        <h6 style={{ fontSize: 18 }}>{item.track.name}</h6>
                      }
                      subheader={<span>{item.track.artists[0].name}</span>}
                    />
                  </CardContent>
                  <CardActions className="justify-content-center mb-3">
                    <Button
                      variant="outlined"
                      href={item.track.external_urls.spotify}
                      target="_blank"
                    >
                      ทดลองฟัง
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card className="mt-4">
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
      </Box>
      <Box
        className="mt-3 mb-3"
        sx={{ display: { xs: "initial", md: "none" } }}
      >
        {data != null ? (
          <Grid
            className="d-flex justify-content-center mt-3"
            container
            spacing={1}
          >
            {data.map(
              (item, i) =>
                i == tag && (
                  <Grid
                    key={item.track.id}
                    size={12}
                    data-aos={d == "r" ? "fade-left" : "fade-right"}
                  >
                    <div
                      style={{
                        borderRadius: 20,
                        position: "absolute",
                        left: 0,
                        height: "100%",
                        cursor: "pointer",
                        backgroundColor: highlight
                          ? "#00000025"
                          : "transparent",
                      }}
                      className="d-flex align-items-center"
                      onClick={() => {
                        setDirect("l");
                        setHigh(true);
                        setTimeout(() => {
                          setHigh(false);
                        }, 5000);
                        setTag(tag == 0 ? data.length - 1 : tag - 1);
                      }}
                    >
                      <KeyboardArrowLeftIcon sx={{ color: "#fff" }} />
                    </div>
                    <div
                      style={{
                        borderRadius: 20,
                        position: "absolute",
                        right: 0,
                        height: "100%",
                        cursor: "pointer",
                        backgroundColor: highlight
                          ? "#00000025"
                          : "transparent",
                      }}
                      className="d-flex align-items-center"
                      onClick={() => {
                        setDirect("r");
                        setHigh(true);
                        setTimeout(() => {
                          setHigh(false);
                        }, 5000);
                        setTag(tag == data.length - 1 ? 0 : tag + 1);
                      }}
                    >
                      <KeyboardArrowRightIcon sx={{ color: "#fff" }} />
                    </div>
                    <Card>
                      <CardContent className="text-center">
                        <Typography className="mb-3" variant="subtitle">
                          Released since{" "}
                          {moment(item.track.album.release_date)
                            .lang("th")
                            .format("MMMM DD, YYYY")}
                        </Typography>
                      </CardContent>
                      <CardMedia
                        component="img"
                        image={item.track.album.images[0].url}
                        alt={item.track.name}
                      />
                      <CardContent className="text-center">
                        <CardHeader
                          title={
                            <h6 style={{ fontSize: 18 }}>{item.track.name}</h6>
                          }
                          subheader={<span>{item.track.artists[0].name}</span>}
                        />
                      </CardContent>
                      <CardActions className="justify-content-center mb-3">
                        <Button
                          variant="outlined"
                          href={item.track.external_urls.spotify}
                          target="_blank"
                        >
                          ทดลองฟัง
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )
            )}
          </Grid>
        ) : (
          <Card className="mt-4">
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
      </Box>
    </Box>
  );
};

export default NMSound;
