import { Backdrop, Box, Typography, Button } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";

const p404 = () => {
  const history = useHistory();
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={true}
      className="errorpage"
    >
      <Box className="text-center text-dark">
        <Typography variant="h4">This page is not found.</Typography>
        <p>
          หน้านี้คุณอาจจะไม่เจอน้องน้ำมนต์ก็ได้ แต่ไม่เป็นไร เราจะนำทางให้คุณเอง
        </p>
        <Button
          variant="contained"
          className="mt-3"
          onClick={() => history.push("/")}
        >
          Back to Homepage
        </Button>
      </Box>
    </Backdrop>
  );
};
export default p404;
