package com.brawlstars.brawling.dto;

import java.util.List;

public record BrawlStarsPlayerResponse(
        String tag,
        String name,
        String nameColor,
        Icon icon,
        Integer trophies,
        Integer highestTrophies,
        Integer totalPrestigeLevel,
        Integer fame,
        String fameTierName,
        Integer expLevel,
        Integer expPoints,
        Boolean isQualifiedFromChampionshipChallenge,
        Integer threeVsThreeVictories,
        Integer soloVictories,
        Integer duoVictories,
        Integer bestRoboRumbleTime,
        Integer bestTimeAsBigBrawler,
        Integer rankedSeasonId,
        Integer rankedRank,
        String rankedRankName,
        Integer rankedElo,
        Integer highestSeasonRankedRank,
        String highestSeasonRankedRankName,
        Integer highestSeasonRankedElo,
        Integer highestAllTimeRankedRank,
        String highestAllTimeRankedRankName,
        Integer highestAllTimeRankedElo,
        Club club,
        List<Brawler> brawlers
) {

    public record Icon(
            Integer id
    ) {}

    public record Club(
            String tag,
            String name
    ) {}

    public record Brawler(
            Integer id,
            String name,
            Integer power,
            Integer rank,
            Integer trophies,
            Integer highestTrophies,
            Integer prestigeLevel,
            Integer currentWinStreak,
            Integer maxWinStreak
    ) {}
}