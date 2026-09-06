package com.brawlstars.brawling.dto;

public record PlayerStatsResponse(
        String tag,
        String name,
        int trophies,
        int highestTrophies,

        int totalVictories,
        int threeVsThreeVictories,
        int soloVictories,
        int duoVictories,

        int brawlerCount,
        String highestTrophyBrawler,
        int highestTrophyBrawlerId,
        int highestBrawlerTrophies,

        int highestBrawlerCurrentTrophies,

        int highestBrawlerRank,
        int highestBrawlerPower,

        int rankedRank,
        String rankedRankName,

        String clubName
) {
}