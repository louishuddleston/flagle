import { Twemoji } from '@teuteuf/react-emoji-render';
import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

export const NextRoundLink: React.FC<PropsWithChildren<{ to: string }>> = ({
  children,
  to,
}) => {
  return (
    <div className="animate-pop mb-3 mt-3">
      <div className="p-2 w-full flex flex-col justify-center items-center gap-2 rounded-sm animate-reveal">
        <div className="p-2 flex flex-col bg-slate-500 bg-opacity-10 dark:bg-white w-full text-black rounded-lg">
          <div className="w-full flex justify-center items-center mb-2 mt-1 font-bold gap-1">
            <Twemoji text="★" className="inline-block text-orange-700" />
            <div className="inline-flex flex-row gap-1 justify-center items-center">
              {children}
            </div>
            <Twemoji text="★" className="inline-block text-orange-700" />
          </div>
          <Link
            className="rounded-md bg-green-600 text-md text-white font-bold p-1 text-lg flex w-full gap-2 items-center justify-center uppercase my-0.5 translate"
            to={to}
          >
            <Twemoji
              text="🎁"
              className="inline-block"
              options={{ baseUrl: '//twemoji.maxcdn.com/' }}
            />
            PLAY BONUS ROUND
          </Link>
        </div>
      </div>
    </div>
  );
};
