import { createRafThrottled } from "@/util/rafThrottle";

describe("createRafThrottled", () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;

  afterEach(() => {
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it("runs once per frame with the latest event arguments", () => {
    let frameCallback: FrameRequestCallback | undefined;
    window.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      frameCallback = callback;
      return 7;
    });
    window.cancelAnimationFrame = jest.fn();
    const callback = jest.fn();
    const throttled = createRafThrottled(callback);

    throttled("first");
    throttled("latest");

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(callback).not.toHaveBeenCalled();

    frameCallback?.(16);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("latest");
  });

  it("cancels a queued callback during cleanup", () => {
    window.requestAnimationFrame = jest.fn(() => 11);
    window.cancelAnimationFrame = jest.fn();
    const throttled = createRafThrottled(jest.fn());

    throttled();
    throttled.cancel();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(11);
  });
});
