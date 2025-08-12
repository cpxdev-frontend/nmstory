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
import { useParams, useHistory } from "react-router-dom";

const Trend = () => {
  const { id } = useParams();
  const his = useHistory();
  const [data, setData] = React.useState(null);
  const [linkfech, setLink] = React.useState("");

  const fetchData = () => {
    setData(null);
    var requestOptions = {
      method: "POST",
    };

    let num = Math.floor(Math.random() * 100) + 1;
    const url =
      num % 2 === 0
        ? "https://cpxdevweb.azurewebsites.net"
        : "https://cpxdevweb.koyeb.app";

    fetch(url + "/api/nm/trend?trendid=" + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          setData(result.response);
          setLink(result.trendstart ? result.url : "");
        } else {
          his.push("/404");
        }
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    console.log("trendid", id);
    fetchData();
  }, []);

  return (
    <Box sx={{ marginTop: 10 }} data-aos="fade-in">
      <Box sx={{ marginBottom: 15 }}>
        <Box>
          <Grid
            container
            spacing={3}
            className="container d-flex justify-content-center"
          >
            {data != null && (
              <Grid data-aos="zoom-in">
                <Card sx={{ backgroundColor: "#7ab4fa" }}>
                  <CardHeader
                    sx={{ marginTop: -1, marginBottom: -3 }}
                    className="text-center"
                    subheader={
                      <div>
                        <p>
                          Start Trend:&nbsp;
                          {moment
                            .unix(data.start)
                            .local()
                            .format("MMMM DD, YYYY HH:mm")}
                        </p>
                      </div>
                    }
                  />
                  <Card>
                    <Avatar
                      src={data.img}
                      variant="rounded"
                      sx={{
                        width: "100%",
                        height: { xs: "40vh", md: "60vh" },
                      }}
                    />
                    <CardContent>
                      <CardHeader title={<h5>{data.title}</h5>} />
                      <Divider />
                      <p className="text-secondary mt-2">
                        &nbsp;&nbsp;{data.desc}
                      </p>
                    </CardContent>
                    <CardActions className="justify-content-end">
                      {linkfech != "" ? (
                        <Button
                          variant="contained"
                          onClick={() => window.open(linkfech)}
                        >
                          Start Trend Now!
                        </Button>
                      ) : (
                        <Button onClick={() => fetchData()}>Refresh</Button>
                      )}
                    </CardActions>
                  </Card>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
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
            * คุณสามารถกด Refresh
            เพื่ออัปเดตสถานะของเทรนให้เป็นปัจจุบันได้ตลอดเวลา
            กรณีที่ยังไม่ถึงเวลาเริ่มเทรนแฮชแท็ก และเลือก "Start Trend Now!"
            เพื่อเริ่มเทรนได้ทันที
          </p>
          <p>
            ** วันและเวลาที่ปรากฎจะอ้างอิงตามไทม์โซนของอุปกรณ์ที่คุณกำลังใช้งาน
            เพื่อให้ความเข้าใจง่ายและสามารถติดตามกิจกรรมของน้องน้ำมนต์ได้ทัดเทียมกันจากทั่วโลก
          </p>
          <p>
            *** บางกิจกรรมเทรนอาจมีการเปลี่ยนแปลงวันและเวลาตามความเหมาะสม
            คุณยังสามารถติดตามการอัปเดตกิจกรรมดันเทรนของน้ำมนต์ได้ที่ Nammonn
            BNK48 Thailand Fanclub
          </p>
        </div>
      </Box>
    </Box>
  );
};
export default Trend;
