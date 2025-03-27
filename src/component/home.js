import React from "react";
import {
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid2 as Grid,
} from "@mui/material";
import moment from "moment";
import getAge from "get-age";

const Home = () => {
  const [data, setData] = React.useState(null);

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
  }, []);

  return (
    <Box>
      <div className="cover" data-aos="fade-in">
        <div className="profile-pic col-md-4 justify-content-end">
          <Avatar
            src="https://d3hhrps04devi8.cloudfront.net/bnk48profile/nammonn.jpg"
            className="w-md-50 w-75 h-100"
          />
        </div>
      </div>

      <div className="container row profile-info">
        <div className="col-md-4"></div>
        <div className="col ml-md-5">
          <h1>
            {data != null
              ? data.fullnameEn[0] +
                " " +
                data.fullnameEn[1] +
                " [" +
                data.name +
                "]"
              : "กำลังโหลด"}
          </h1>
          <h5>
            {data != null
              ? data.fullnameTh[0] + " " + data.fullnameTh[1]
              : "กำลังโหลด"}
          </h5>
          <p>{data != null ? data.province + ", TH" : "กำลังโหลด"}</p>
        </div>
      </div>

      <section id="home" className="content">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <div className="card ">
              <div className="card-body">
                <h5 className="card-title">About Nammonn</h5>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-clock"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="อายุ (ปี) | Age (years)"
                      secondary={data != null ? getAge(data.birthday) : 0}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-calendar-event"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="วันเดือนปีเกิด | Birthday"
                      secondary={
                        data != null
                          ? moment(data.birthday).format("DD MMMM YYYY")
                          : ""
                      }
                    />
                  </ListItem>
                  <ListItem>
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
                  <ListItem>
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
                  <ListItem>
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
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Follow Nammonn</h5>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-facebook"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Facebook"
                      secondary={data != null ? "Nammonn BNK48" : ""}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-instagram"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Instagram"
                      secondary={data != null ? "nammonn.bnk48official" : ""}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-tiktok"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="TikTok"
                      secondary={data != null ? "@nammonn.bnk48official" : ""}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-phone"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="IAM48 Application"
                      secondary={data != null ? "Nammonn" : ""}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-globe-asia-australia"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="BNK48 Official Website"
                      secondary={data != null ? "Nammonn BNK48" : ""}
                    />
                  </ListItem>
                </List>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">For Nammonn BNK48 Fanclub</h5>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-globe-asia-australia"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="BNK48 Fan Space"
                      secondary={data != null ? "Nammonn" : ""}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-facebook"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Facebook Fanpage"
                      secondary={
                        data != null ? "Nammonn BNK48 Thailand Fanclub" : ""
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-twitter-x"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="X (Twitter)"
                      secondary={data != null ? "@NammonnBNK48FC" : ""}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar className="icon-core">
                        <i class="bi bi-line"></i>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Line Open Chat (OPC)"
                      secondary={
                        data != null ? "Nammonn BNK48 Thailand Fanclub" : ""
                      }
                    />
                  </ListItem>
                </List>
              </div>
            </div>
          </Grid>
        </Grid>
      </section>
    </Box>
  );
};

export default Home;
