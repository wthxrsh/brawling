import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom/vitest";

import PlayerDashboard from "./PlayerDashboard";
import { samplePlayer } from "../test/fixtures";

vi.mock("html-to-image", () => ({
    toPng: vi.fn().mockResolvedValue("data:image/png;base64,fake"),
}));

import { toPng } from "html-to-image";

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

describe("PlayerDashboard", () => {

    it("renders the player flex card", () => {
        render(
            <PlayerDashboard
                player={samplePlayer}
                onBack={vi.fn()}
            />
        );

        expect(
            screen.getByText("BrawlQueen")
        ).toBeInTheDocument();
        expect(
            screen.getByText("EXPORT PNG")
        ).toBeInTheDocument();
    });

    it("calls onBack when BACK is clicked", async () => {
        const user = userEvent.setup();
        const onBack = vi.fn();

        render(
            <PlayerDashboard
                player={samplePlayer}
                onBack={onBack}
            />
        );

        await user.click(
            screen.getByRole("button", {
                name: /back/i,
            })
        );

        expect(onBack).toHaveBeenCalledTimes(1);
    });

    it("exports the card as a PNG and resets the toolbar", async () => {
        const user = userEvent.setup();

        render(
            <PlayerDashboard
                player={samplePlayer}
                onBack={vi.fn()}
            />
        );

        await user.click(
            screen.getByRole("button", {
                name: /export png/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByRole("button", {
                    name: /exporting/i,
                })
            ).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(toPng).toHaveBeenCalledOnce();
        });

        await waitFor(() => {
            expect(
                screen.getByRole("button", {
                    name: /export png/i,
                })
            ).toBeInTheDocument();
        });
    });
});