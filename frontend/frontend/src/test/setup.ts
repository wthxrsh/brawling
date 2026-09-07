/**
 * jsdom does not implement matchMedia / ResizeObserver, which
 * framer-motion probes on mount. Provide minimal no-op stubs.
 */
if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
    } as unknown as typeof ResizeObserver;
}

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (cb: FrameRequestCallback) =>
        window.setTimeout(() => cb(Date.now()), 16) as unknown as number;
}