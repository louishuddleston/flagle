import CopyToClipboard from "react-copy-to-clipboard";
import React, { useMemo } from "react";
import { toast } from "react-toastify";
import Button from '@mui/material/Button';
import { DateTime } from "luxon";

const FIRST_DAY_OF_FLAGLE = DateTime.fromFormat('February 21 2022', 'LLLL dd yyyy');

const generateShareSquares = (score, guesses, attempts) => {
    if (score === "DNF") {
      return "🟥🟥🟥\n🟥🟥🟥\n"
    }
    let squares = Array(attempts).fill("🟩");
    for (let i = 0; i < guesses.length - 1; i++) {
        squares[guesses[i].tile] = "🟥";
    }

    for (let i = 0; i < attempts; i++) {
        if ((i+1) % 3 === 0) {
            squares[i] += "\n";
        }
    } 
    return squares.join("");
}

export function Share({ score, guesses, attempts, end, dayString}) {
  const shareText = useMemo(() => {
    const trueDayString = dayString.substr(0, dayString.length - 2);
    const currentDate = DateTime.fromFormat(trueDayString, "yyyy-MM-dd");
    const diffInDays = currentDate.diff(FIRST_DAY_OF_FLAGLE, 'days').toObject().days;
    const squareString = generateShareSquares(score, guesses, attempts);
    return `#Flagle #${diffInDays} ${score === "DNF" ? "X" : guesses.length}/${attempts}\n${squareString}https://www.flagle.io`
  }, [guesses, attempts, dayString, score]);

  return (
    <CopyToClipboard
      text={shareText}
      onCopy={() => toast("Copied Results to Clipboard", { autoClose: 2000 })}
      options={{ format: "text/plain" }}
    >
      <Button variant="contained" disabled={!end}><span>Share Score</span></Button>
    </CopyToClipboard>
  )
}