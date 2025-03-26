import React from "react";
import { Box, Avatar } from "@mui/material";

const Home = () => {
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
      .then((data) => {});
  }, []);

  return (
    <Box>
      <div class="cover">
        <div class="profile-pic col-3">
          <Avatar
            src="https://d3hhrps04devi8.cloudfront.net/bnk48profile/nammonn.jpg"
            className="w-75 w-md-100 h-100"
          />
        </div>
      </div>

      <div class="container row profile-info">
        <div className="col-4"></div>
        <div className="col">
          <h1>ชื่อผู้ใช้</h1>
          <p>เมืองไทย</p>
        </div>
      </div>

      <div class="content">
        <h2>Posts</h2>
        <p>นี่คือโพสต์ตัวอย่าง...</p>
      </div>

      <div class="overlay"></div>
      <section className="profile-info">
        <div className="container">
          <div className="row">
            <div
              className="col-md-5 col-12 d-flex justify-content-center"
              data-aos="zoom-in"></div>
            <div className="col-md col-12"></div>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default Home;
