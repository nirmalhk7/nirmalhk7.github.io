export type RafThrottledCallback<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void;
};

export const createRafThrottled = <Args extends unknown[]>(
  callback: (...args: Args) => void
): RafThrottledCallback<Args> => {
  let frameId: number | null = null;
  let latestArgs: Args | null = null;

  const flush = () => {
    frameId = null;
    const args = latestArgs;
    latestArgs = null;

    if (args) callback(...args);
  };

  const throttled = ((...args: Args) => {
    latestArgs = args;

    if (frameId === null) {
      frameId = window.requestAnimationFrame(flush);
    }
  }) as RafThrottledCallback<Args>;

  throttled.cancel = () => {
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }
    latestArgs = null;
  };

  return throttled;
};
