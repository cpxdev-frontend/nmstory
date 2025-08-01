import React from "react";
import { useHistory } from "react-router-dom";
import {
  Skeleton,
  CardHeader,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
var refresh;
const eula = "eulav2";

const ChatAI = () => {
  const his = useHistory();
  const [ready, setReady] = React.useState(false);

  const [eulaAccept, setEula] = React.useState(false);
  const [ok, setAccept] = React.useState(true);

  const checkpoint = () => {
    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => {
        if (data.country === "TH") {
          if (localStorage.getItem(eula) != null) {
            setReady(true);
          } else {
            setEula(true);
          }
        } else {
          clearInterval(refresh);
          setReady(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  React.useEffect(() => {
    checkpoint();
    refresh = setInterval(() => checkpoint(), 10000);
  }, []);

  if (ready == false) {
    return (
      <>
        <div
          style={{ paddingTop: 100, height: "70vh", overflow: "hidden" }}
          className="container"
        >
          <Skeleton variant="rounded" width="100%" height="70%" />
        </div>

        <Dialog open={eulaAccept} maxWidth="lg" sx={{ zIndex: 3001 }}>
          <DialogTitle>
            เงื่อนไขและความยินยอมในการใช้งาน NM Story AI [อัปเดตเมื่อ 31 กรกฎาคม
            2568]
          </DialogTitle>
          <DialogContent>
            กรุณาอ่านเงื่อนไขและรายละเอียดต่อไปนี้อย่างละเอียดก่อนใช้งานระบบ
            <DialogContentText className="mb-3 mt-3">
              1. NM Story AI เป็นระบบแชทบอทที่ใช้เทคโนโลยีปัญญาประดิษฐ์แบบ
              Generative AI เพื่อให้ข้อมูล ตอบคำถามเบื้องต้นเกี่ยวกับน้ำมนต์
              ณัฐมนต์ สองทิศ หรือ น้ำมนต์ BNK48
              โดยอาจอ้างอิงข้อมูลจากชุดความรู้ที่ได้รับการฝึกฝนไว้ล่วงหน้า
              หรือจากแหล่งข้อมูลสาธารณะที่ทางผู้พัฒนาได้จัดเตรียมไว้
            </DialogContentText>
            <DialogContentText className="mb-3">
              2. การเก็บรวบรวมและใช้งานข้อมูล
              เพื่อพัฒนาระบบให้มีประสิทธิภาพมากยิ่งขึ้น
              ระบบอาจมีการบันทึกข้อมูลการใช้งาน ได้แก่ ข้อความที่คุณพิมพ์เข้ามา
              คำถามหรือหัวข้อที่คุณสนใจ ที่อยู่ไอพีและเวลาที่คุณใช้งาน
              โดยข้อมูลเหล่านี้จะถูกใช้งานในลักษณะที่ไม่ระบุตัวตน (anonymous)
              และจะไม่เผยแพร่สู่บุคคลภายนอก ยกเว้นในกรณีที่จำเป็นตามกฎหมาย
            </DialogContentText>
            <DialogContentText className="mb-3">
              3. ระบบไม่ได้การันตีความถูกต้องของข้อมูล
              กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนนำไปใช้งาน
            </DialogContentText>
            <DialogContentText className="mb-3">
              4. หลีกเลี่ยงการเปิดเผยข้อมูลส่วนบุคคล ข้อมูลสำคัญ
              หรือข้อมูลที่เป็นความลับ เช่น หมายเลขบัตรประชาชน รหัสผ่าน
              หรือข้อมูลบัญชีธนาคาร
              รวมทั้งข้อความที่มีเนื้อหาหยาบคายและล่อแหลมที่มีเจตนาทำให้น้ำมนต์
              ณัฐมนต์ สองทิศ หรือ น้ำมนต์ BNK48 หรือบุคคลอื่นๆ ในสมาชิกของวง
              BNK48 รวมทั้งผู้มีส่วนเกี่ยวข้องกับน้ำมนต์ได้รับความเสียหาย
              และห้ามใช้ระบบเพื่อกระทำการใดๆ ที่ผิดกฎหมาย ผิดจรรยาบรรณ
              หรือขัดต่อข้อกำหนดของแพลตฟอร์ม หากตรวจพบการกระทำดังกล่าว
              ทางผู้พัฒนาขอสงวนสิทธิ์ในการระงับการใช้งานโดยมิต้องแจ้งให้ทราบล่วงหน้า
            </DialogContentText>
            <DialogContentText className="mb-3">
              5. คุณสามารถส่งข้อความเพื่อสอบถามข้อมูลได้สูงสุด 5
              ข้อความต่อชั่วโมง ต่อ 1 อุปกรณ์ หลังจากนั้น
              ระบบจะบล็อคสิทธิ์การเข้าถึงชั่วคราวจนกว่าจะครบกำหนดเวลาที่ระบุ
            </DialogContentText>
            <DialogContentText className="mb-3">
              6. คุณสามารถเข้าใช้งานระบบได้เฉพาะในพื้นที่ประเทศไทยเท่านั้น
            </DialogContentText>
            <DialogContentText className="mb-3">
              7.
              เงื่อนไขและความยินยอมในการใช้งานดังกล่าวอาจมีการเปลี่ยนแปลงได้ในอนาคต
              ระบบจะมีการอัปเดตรายละเอียดเพิ่มเติมเพื่อแจ้งให้ผู้ใช้งานทราบในทุกๆ ครั้งที่มีการเปลี่ยนแปลง
            </DialogContentText>
            โดยการคลิก "ยอมรับ" ถือว่าคุณได้อ่าน ทำความเข้าใจ
            และตกลงยินยอมตามข้อกำหนดและเงื่อนไขที่ระบุไว้ข้างต้นทุกประการ
            หากคุณไม่ประสงค์ที่จะใช้งาน คุณสามารถคลิก "ปิด"
            เพื่อยกเลิกสิทธิ์การเข้าถึงได้
            <Box>
              <hr />
              <FormControlLabel
                onChange={() => setAccept(!ok)}
                control={<Switch />}
                label="คลิกที่นี่เพื่อยอมรับเงื่อนไขและความยินยอมในการใช้งาน"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={ok}
              onClick={() => {
                setEula(false);
                localStorage.setItem(eula, "true");
              }}
            >
              ยอมรับ
            </Button>
            <Button
              onClick={() => {
                setReady(null);
              }}
            >
              ปิด
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  if (ready == null) {
    return (
      <div
        style={{ paddingTop: 100, height: "70vh", overflow: "hidden" }}
        className="container d-flex justify-content-center align-items-center"
      >
        <h3>ขออภัยค่ะ NM Story AI ยังไม่พร้อมให้บริการในขณะนี้</h3>
      </div>
    );
  }

  return (
    <Box
      sx={{
        paddingTop: 10,
        paddingBottom: 20,
        height: { xs: "70vh", md: "85vh" },
        overflow: "hidden",
      }}
      className="container"
    >
      <CardHeader
        title="NM Story AI (Beta)"
        subheader={
          <small>
            คุณสามารถทำความรู้จักน้ำมนต์ได้มากขึ้น ผ่านระบบ Generative AI
          </small>
        }
      />
      <iframe
        src="https://app.fastbots.ai/embed/cmdsu9jch00fvp61mz4avdpuw"
        frameborder="0"
        width="100%"
        height="100%"
      ></iframe>
    </Box>
  );
};
export default ChatAI;
