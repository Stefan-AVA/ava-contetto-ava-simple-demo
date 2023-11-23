import { Modal, Stack, Typography } from "@mui/material"

import OrgInfo from "@/components/org/info"

interface IProps {
  open: boolean
  setOpenCreateOrgModal: Function
}

const CreateOrgModal = ({ open, setOpenCreateOrgModal }: IProps) => {
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpenCreateOrgModal(false)
      }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Stack
        sx={{
          p: 1,
          mx: "auto",
          maxWidth: "32rem",
          background: "white",
          borderRadius: 2,
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ color: "blue.800", fontWeight: 500, mt: 2 }}
          variant="h4"
          component="h1"
        >
          Organization Create
        </Typography>

        <OrgInfo isCreate setOpenCreateOrgModal={setOpenCreateOrgModal} />
      </Stack>
    </Modal>
  )
}

export default CreateOrgModal
