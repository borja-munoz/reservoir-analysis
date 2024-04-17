import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setModalMessage } from "../store/appSlice";

export type AppMessage = {
  type: 'success' | 'error';
  message: string;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const messageColors = {
  success: "#22AA22",
  error: "#AA2222",
};

export default function ModalMessage() {
  const dispatch = useDispatch();
  const appMessage: AppMessage = useSelector(
    (state: RootState) => state.app.modalMessage
  );

  return (
    <div>
      <Modal
        open={!!appMessage}
        onClose={() => dispatch(setModalMessage(null))}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Tennis Club
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, color: messageColors[appMessage?.type] ?? "#000000" }}
          >
            {appMessage?.message}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
