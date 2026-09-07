import type { PlayerStats } from "../types/player";

/*
 * In development the Vite dev server proxies /api to the
 * Spring Boot backend (see vite.config.ts). In production the
 * API is expected to be served from the same origin, or a
 * fully-qualified base URL can be provided via VITE_API_BASE_URL.
 */
const API_BASE_URL: string =
    import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export async function getPlayer(
    playerTag: string
): Promise<PlayerStats> {
    const response = await fetch(
        `${API_BASE_URL}/players/${encodeURIComponent(playerTag)}`
    );

    if (!response.ok) {
        throw new Error("Player not found");
    }

    return response.json();
}