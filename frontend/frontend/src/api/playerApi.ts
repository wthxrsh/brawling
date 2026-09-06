import type { PlayerStats } from "../types/player";

const API_BASE_URL = "http://localhost:8080/api/v1";

export async function getPlayer(playerTag: string): Promise<PlayerStats> {
    const response = await fetch(
        `${API_BASE_URL}/players/${encodeURIComponent(playerTag)}`
    );

    if (!response.ok) {
        throw new Error("Player not found");
    }

    return response.json();
}