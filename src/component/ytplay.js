import React from "react";
import {
  Box,
  Grid2 as Grid,
  CardHeader,
  Tabs,
  Tab
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import NmPlay from "../modules/nmplay";
import NmSound from "../modules/nmsound";

const YTPlay = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {}, []);

  return (
    <Box sx={{ marginTop: 10 }} data-aos="fade-in">
      <CardHeader
        title={<h3>Nammonn Space</h3>}
        subheader="รวมทุกคอนเทนต์และผลงานเพลงของน้องน้ำมนต์และบนสื่อสตรีมมิ่ง"
      />
      <Box className="container mb-5">
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Nammonn Play" />
          <Tab label="Nammonn Sound" />
        </Tabs>
        {value == 1 ? <NmSound /> : <NmPlay />}
      </Box>
    </Box>
  );
};

export default YTPlay;
