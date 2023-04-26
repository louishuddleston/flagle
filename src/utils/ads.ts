type CommandArray = Array<(this: typeof globalThis) => void> | undefined;

declare global {
  interface Window {
    adngin?: {
      adnginLoaderReady?: boolean;
      cmd: {
        startAuction: (any: any) => void;
      };
      queue?: CommandArray;
    };
    destroyRefreshTopAd?: any;
  }
}

export function destroyTopAd(state: boolean) {
  if (typeof window.destroyRefreshTopAd === 'function') {
    try {
      window.destroyRefreshTopAd(state);
    } catch (e) {
      console.error(e);
    }
  }
}

export function refreshAd() {
  setTimeout(() => {
    if (
      window.adngin !== undefined &&
      window.adngin.cmd !== undefined &&
      typeof window.adngin.cmd.startAuction === 'function'
    ) {
      window.adngin.cmd.startAuction(['sidebar_right']);
    }
  }, 50);
}

export function refreshTopAd(state: boolean) {
  if (!state) return;
  if (
    window.adngin !== undefined &&
    window.adngin.cmd !== undefined &&
    window.adngin.adnginLoaderReady &&
    typeof window.adngin.cmd.startAuction === 'function'
  ) {
    window.adngin.cmd.startAuction(['top_banner']);
  }
}

export function refreshCompleteAd() {
  console.log('refresh 300x250 ad');
  if (
    window.adngin !== undefined &&
    window.adngin.cmd !== undefined &&
    typeof window.adngin.cmd.startAuction === 'function'
  ) {
    window.adngin.cmd.startAuction(['end_mobile']);
  }
}
