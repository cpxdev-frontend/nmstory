import React from "react";
import { Box, Avatar } from "@mui/material";

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
      <div class="cover" data-aos="fade-in">
        <div class="profile-pic col-md-4 justify-content-end">
          <Avatar
            src="https://d3hhrps04devi8.cloudfront.net/bnk48profile/nammonn.jpg"
            className="w-md-25 w-75 h-100"
          />
        </div>
      </div>

      <div class="container row profile-info">
        <div className="col-md-5 col-sm-4"></div>
        <div className="col">
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
          <p>{data != null ? data.province : "กำลังโหลด"}</p>
        </div>
      </div>

      <div class="content">
        <h2>Content</h2>
        <p>Layout Draft</p>
      </div>
    </Box>
  );
};

export default Home;
