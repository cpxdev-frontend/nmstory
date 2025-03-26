import React from "react";
import { Box, Avatar } from "@mui/material";

const Home = () => {
  return (
    <Box data-aos="fade-in">
      <div className="row">
        <div className="col-md-3 col-12 d-flex justify-content-center">
          <Avatar
            src="https://d3hhrps04devi8.cloudfront.net/bnk48profile/nammonn.jpg"
            className="w-75 h-100"
          />
        </div>
        <div className="col-md col-12"></div>
      </div>
    </Box>
  );
};

export default Home;
