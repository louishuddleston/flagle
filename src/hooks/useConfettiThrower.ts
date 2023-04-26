import confetti from 'canvas-confetti';
import { useCallback } from 'react';

export const useConfettiThrower = () => {
  return useCallback(() => {
    const myCanvas = document.createElement('canvas');

    myCanvas.style.pointerEvents = 'none';
    myCanvas.style.position = 'fixed';
    myCanvas.style.left = '0';
    myCanvas.style.top = '0';
    myCanvas.style.right = '0';
    myCanvas.style.bottom = '0';
    myCanvas.style.width = '100%';
    myCanvas.style.height = '100%';
    myCanvas.style.zIndex = '1000';
    document.body.appendChild(myCanvas);
    const mc = confetti.create(myCanvas, {
      resize: true,
      useWorker: true,
    });
    setTimeout(() => {
      mc({
        particleCount: 20,
        spread: 60,
      });
    }, 16);
    setTimeout(() => document.body.removeChild(myCanvas), 3000);
  }, []);
};
