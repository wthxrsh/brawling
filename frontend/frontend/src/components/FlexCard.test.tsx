import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { createRef } from "react";

import "@testing-library/jest-dom/vitest";

import FlexCard from "./FlexCard";
import { samplePlayer } from "../test/fixtures";

afterEach(() => {
    cleanup();
});

describe("FlexCard", () => {
    it("renders player identity and headline stats", () => {
        render(
            <FlexCard
                player={samplePlayer}
                exportMode
            />
        );

        expect(
            screen.getAllByText("BRAWLING").length
        ).toBeGreaterThan(0);
        expect(
            screen.getByText("BrawlQueen")
        ).toBeInTheDocument();
        expect(
            screen.getByText("#2VQJPYJE2")
        ).toBeInTheDocument();
        expect(
            screen.getByText("45,000")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Shelly")
        ).toBeInTheDocument();
    });

    it("wires the capture ref and export mode flag for PNG capture", () => {
        const captureRef =
            createRef<HTMLDivElement>();

        const { container } = render(
            <FlexCard
                player={samplePlayer}
                captureRef={captureRef}
                exportMode
            />
        );

        expect(captureRef.current).not.toBeNull();
        expect(
            captureRef.current?.getAttribute(
                "data-export-mode"
            )
        ).toBe("true");
        expect(
            container.children.length
        ).toBeGreaterThan(0);
    });

    it("caps trophy progress at 100%", () => {
        const { container } = render(
            <FlexCard
                player={{
                    ...samplePlayer,
                    trophies: 99000,
                    highestTrophies: 60000,
                }}
                exportMode
            />
        );

        const bars = container.querySelectorAll(
            "[style*='width:']"
        );
        expect(bars.length).toBeGreaterThan(0);
        bars.forEach((bar) => {
            const width = Number(
                bar
                    .getAttribute("style")
                    ?.match(/width:\s*([\d.]+)%/)?.[1]
            );
            expect(width).toBeLessThanOrEqual(100);
        });
    });
});