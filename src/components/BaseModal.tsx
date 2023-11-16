import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';

const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0 0.3rem 2em;
  z-index: 100;
  background-color: #fff;
  border-bottom: 2px solid #000;
  @media (prefers-color-scheme: dark) {
    background-color: #121212;
  }
`;

const StyledBox = styled(Box)`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  max-width: 450px;
  max-height: 70vh;
  background-color: #fff;
  border: 2px solid #000;
  box-shadow: 24rem;
  width: 90%;
  outline-style: none;
  @media (prefers-color-scheme: dark) {
    background-color: #121212;
    color: white;
  }
`;

const StyledModal = styled(Modal)`
  @media (prefers-color-scheme: dark) {
    color: #000;
  }
`;

const InnerContainer = styled.div`
  padding: 2em;
  justify-content: flex-start;
  overflow: auto;
`;

export const BaseModal = ({
  children,
  open,
  onClose,
  title,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title?: string;
}) => {
  return (
    <StyledModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ zIndex: 10000 }}
    >
      <StyledBox>
        <Header>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            {title}
          </Typography>
          <Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Header>
        <InnerContainer>{children}</InnerContainer>
      </StyledBox>
    </StyledModal>
  );
};

export default BaseModal;
