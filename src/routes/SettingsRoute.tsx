import styled from 'styled-components';

import { BackButton } from '../components/BackButton';
import { useSettings } from '../hooks/useSettings';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 1000px;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 1rem;
  gap: 3.5rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
`;

const Select = styled.select`
  border-radius: 3px;
  border: 1px solid #dddddd;
  padding: 0.5rem;
  font-size: 1rem;
  background-color: #dddddd;
  color: #000;
  @media (prefers-color-scheme: dark) {
    background-color: #1f2023;
    color: #dadada;
  }
`;

const SettingLine = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export function SettingsRoute() {
  const [settings, changeSetting] = useSettings();

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeSetting('unit', e.target.value as 'km' | 'miles');
  };

  return (
    <Container>
      <Top>
        <BackButton />
        <Title>Settings</Title>
      </Top>
      <SettingLine>
        <Select id="unit" onChange={handleUnitChange} value={settings?.unit}>
          <option value="km">KM</option>
          <option value="miles">Miles</option>
        </Select>
        <label htmlFor="unit">Unit of distance</label>
      </SettingLine>
    </Container>
  );
}
