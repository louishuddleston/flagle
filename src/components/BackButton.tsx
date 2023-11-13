import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const Button = styled.button`
  color: #1a76d2;
`;

export const BackButton = () => {
  const history = useHistory();
  return <Button onClick={history.goBack}>← Back</Button>;
};
