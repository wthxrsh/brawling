package com.brawlstars.brawling.service;

import com.brawlstars.brawling.dto.BrawlStarsPlayerResponse;
import com.brawlstars.brawling.dto.PlayerStatsResponse;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    public PlayerStatsResponse calculateStats(
            BrawlStarsPlayerResponse player) {

        var brawlers = player.brawlers();

        BrawlStarsPlayerResponse.Brawler highestBrawler =
                brawlers.stream()
                        .max(
                                java.util.Comparator.comparing(
                                        b -> safe(b.highestTrophies())
                                )
                        )
                        .orElse(null);

        int brawlerCount = brawlers.size();

        int threeVsThreeVictories =
                safe(player.threeVsThreeVictories());

        int soloVictories =
                safe(player.soloVictories());

        int duoVictories =
                safe(player.duoVictories());

        int totalVictories =
                threeVsThreeVictories
                        + soloVictories
                        + duoVictories;

        return new PlayerStatsResponse(
                player.tag(),
                player.name(),
                safe(player.trophies()),
                safe(player.highestTrophies()),

                totalVictories,
                threeVsThreeVictories,
                soloVictories,
                duoVictories,

                brawlerCount,

                highestBrawler != null
                        ? highestBrawler.name()
                        : null,

                highestBrawler != null
                        ? safe(highestBrawler.id())
                        : 0,

                highestBrawler != null
                        ? safe(highestBrawler.highestTrophies())
                        : 0,

                highestBrawler != null
                        ? safe(highestBrawler.trophies())
                        : 0,

                highestBrawler != null
                        ? safe(highestBrawler.rank())
                        : 0,

                highestBrawler != null
                        ? safe(highestBrawler.power())
                        : 0,

                safe(player.rankedRank()),
                player.rankedRankName(),

                player.club() != null
                        ? player.club().name()
                        : null
        );
    }

    private int safe(Integer value) {
        return value != null ? value : 0;
    }
}