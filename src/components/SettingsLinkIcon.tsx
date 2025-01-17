import SettingsIcon from '@mui/icons-material/Settings';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledSettingsIcon = styled(SettingsIcon)`
  color: black;
  margin: 3px;
  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

export const SettingsLinkIcon: React.FC = () => {
  return (
    <Link to="/settings">
      <StyledSettingsIcon />
    </Link>
  );
};
