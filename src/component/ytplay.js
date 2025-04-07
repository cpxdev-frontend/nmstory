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
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

const YTPlay = () => {
  const [data, setData] = React.useState(null);
  const [clip, setClip] = React.useState(null);
  React.useEffect(() => {
    fetch("https://cpxdevweb.azurewebsites.net/api/nm/ytplay", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => {
        setData(result.items);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Box sx={{ marginTop: 10 }} data-aos="fade-in">
      <CardHeader
        title={<h3>Nammonn Play</h3>}
        subheader="รวมทุกคอนเทนต์และผลงานเพลงของน้องน้ำมนต์บนยูทูป"
      />
      <Box className="container mb-5">
        {data != null ? (
          <Grid container spacing={2}>
            {data.map(
              (item, i) =>
                item.snippet.title !== "Deleted video" &&
                item.snippet.description !== "This video is unavailable." && (
                  <Card
                    data-aos="fade-right"
                    component={Grid}
                    className="mb-3 ml-3 ml-lg-0"
                    container
                    key={item.snippet.resourceId.videoId}
                  >
                    <Grid xs={12}>
                      <CardMedia
                        sx={{ width: "100%" }}
                        component="img"
                        image={item.snippet.thumbnails.maxres.url}
                        alt={item.snippet.title}
                      />
                    </Grid>
                    <Grid
                      item
                      md
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography
                          component="div"
                          variant="h5"
                          sx={{ fontSize: 22 }}
                        >
                          <b>{item.snippet.title}</b>
                        </Typography>
                        <small className="text-muted">
                          อัปโหลดโดย {item.snippet.videoOwnerChannelTitle}
                        </small>
                        <hr />
                        <CardActionArea className="mt-5">
                          <Button
                            variant="outlined"
                            className="text-success border-success m-1"
                            onClick={() => setClip(item)}
                          >
                            View Content
                          </Button>
                          <Button
                            variant="outlined"
                            className="text-primary border-primary m-1"
                            onClick={() =>
                              window.open(
                                "https://youtube.com/channel/" +
                                  item.snippet.videoOwnerChannelId,
                                "_blank"
                              )
                            }
                          >
                            View other contents in Channel
                          </Button>
                        </CardActionArea>
                      </CardContent>
                    </Grid>
                  </Card>
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

      <Dialog
        fullScreen
        open={clip != null}
        PaperProps={{
          sx: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, backgroundColor: "#adc8f7" },
        }}
        TransitionComponent={Transition}
      >
        {clip != null && (
          <>
            <AppBar sx={{ position: "relative" }}>
              <Toolbar>
                <CardHeader
                  sx={{ flex: 1, paddingTop: 2 }}
                  title={<h5 className="text-break">{clip.snippet.title}</h5>}
                  subheader={
                    <small>
                      อัปโหลดโดย {clip.snippet.videoOwnerChannelTitle}
                    </small>
                  }
                />
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={() => setClip(null)}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <DialogContent>
              <CardMedia
                data-aos="zoom-in-down"
                sx={{
                  width: "100%",
                  height: { md: "70vh", xs: "50vh" },
                  position: "initial",
                  left: 0,
                }}
                component="iframe"
                src={
                  "https://youtube.com/embed/" + clip.snippet.resourceId.videoId
                }
                alt={"clip-" + clip.snippet.title}
              />
              <Divider />
              <Card component={CardContent} className="mt-3">
                <br />
                <Typography
                  data-aos="fade-in"
                  variant="p"
                  color="text.primary"
                  className="mt-2 text-break"
                  dangerouslySetInnerHTML={{
                    __html:
                      "Description: " +
                      convertUrlsAndHashtagsToLinks(
                        clip.snippet.description.replace(/\n/g, "<br />")
                      ),
                  }}
                ></Typography>
              </Card>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default YTPlay;
