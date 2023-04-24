import { HowToModal } from '../components/HowToModal';
import { Title, TitleBar, TitleBarDiv } from '../components/Title';
import { NextRoundLink } from '../components/NextRoundLink';
import {
  ChoiceStatus,
  useStandardBonusRound,
} from '../hooks/useStandardBonusRound';
import { useDailySeed } from '../hooks/useDailySeed';
import countryData from '../data/countries';

const MAX_ATTEMPTS = 3;
const CHOICES_COUNT = 8;

export function SecondBonusRoundRoute() {
  const roundSeed = useDailySeed('second-bonus-round');
  const { dailyChoicesOrder, dailyChoices, onSelectCountry, isRoundComplete } =
    useStandardBonusRound({
      roundSeed,
      choicesCount: CHOICES_COUNT,
      maxAttempts: MAX_ATTEMPTS,
    });

  return (
    <>
      <TitleBar>
        <TitleBarDiv justify="flex-end">
          <HowToModal />
        </TitleBarDiv>
        <Title>
          FLAG<span>LE</span>
        </Title>
      </TitleBar>

      <p>
        <b>Pick the flag of a neighbouring country</b>
      </p>

      <div className="flex gap-2 mt-3">
        {dailyChoicesOrder.map((countryName, index) => (
          <CountryFlag
            key={countryName}
            countryName={countryName}
            countryCode={countryData[countryName].code}
            index={index + 1}
            choiceStatus={dailyChoices[countryName]}
            disabled={
              isRoundComplete || dailyChoices[countryName] !== undefined
            }
            onSelect={onSelectCountry}
          />
        ))}
      </div>

      {isRoundComplete && (
        <NextRoundLink to="/bonus-round/2">
          Bonus Round - 2/3 - Pick this country's shape
        </NextRoundLink>
      )}
    </>
  );
}

const CountryFlag = ({
  countryName,
  countryCode = '',
  index = 0,
  onSelect,
  disabled = false,
  choiceStatus,
}) => {
  return (
    <button
      key={countryName}
      data-country-name={countryName}
      onClick={onSelect}
      disabled={disabled}
      style={{
        border: '2px solid #DDD',
        borderColor:
          choiceStatus === ChoiceStatus.CORRECT
            ? 'green'
            : choiceStatus === ChoiceStatus.INCORRECT
            ? 'red'
            : '',
      }}
      className="rounded-md p-2 relative"
    >
      <div
        className="font-bold absolute"
        style={{ top: '4px', left: '8px', color: '#fff' }}
      >
        {index}.
      </div>
      <div className="font-bold absolute" style={{ top: '3px', left: '7px' }}>
        {index}.
      </div>
      <img
        src={`https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`}
        width="70"
        height="70"
        alt=""
      />
    </button>
  );
};
