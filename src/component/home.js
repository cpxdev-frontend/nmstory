import React from "react";
import { Box, Avatar } from "@mui/material";

const Home = () => {
  return (
    <Box>
      <div className="container">
        <div className="row">
          <div className="col-md-5 col-12 d-flex justify-content-center" data-aos="zoom-in">
            <Avatar
              src="https://d3hhrps04devi8.cloudfront.net/bnk48profile/nammonn.jpg"
              className="w-75 w-md-100 h-100"
            />
          </div>
          <div className="col-md col-12"></div>
        </div>
      </div>
    </Box>
  );
};

export default Home;
