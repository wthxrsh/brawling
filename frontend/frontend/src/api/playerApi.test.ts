import { describe, it, expect, vi, beforeEach } from "vitest";

import { getPlayer } from "./playerApi";

describe("playerApi", () => {
    beforeEach(() => {
        vi.unstubAllGlobals();
    });

    it("requests the URL-encoded tag and returns the parsed player", async () => {
        const player = { tag: "#2VQJPYJE2", name: "BrawlQueen" };

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(player),
        });

        vi.stubGlobal("fetch", fetchMock);

        const result = await getPlayer("#2VQJPYJE2");

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url] = fetchMock.mock.calls[0] as [string];
        expect(url).toContain("/players/%232VQJPYJE2");
        expect(result).toEqual(player);
    });

    it("throws when the upstream request fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                status: 404,
            })
        );

        await expect(
            getPlayer("#NOPE")
        ).rejects.toThrow("Player not found");
    });
});