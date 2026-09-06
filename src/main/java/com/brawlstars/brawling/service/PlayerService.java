package com.brawlstars.brawling.service;

import com.brawlstars.brawling.client.BrawlStarsClient;
import com.brawlstars.brawling.dto.PlayerStatsResponse;
import org.springframework.stereotype.Service;

@Service
public class PlayerService {

    private final BrawlStarsClient brawlStarsClient;
    private final StatsService statsService;

    public PlayerService(
            BrawlStarsClient brawlStarsClient,
            StatsService statsService) {

        this.brawlStarsClient = brawlStarsClient;
        this.statsService = statsService;
    }

    public PlayerStatsResponse getPlayer(String playerTag) {

        var player = brawlStarsClient.getPlayer(playerTag);

        return statsService.calculateStats(player);
    }
}