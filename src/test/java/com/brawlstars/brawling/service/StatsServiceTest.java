package com.brawlstars.brawling.service;

import com.brawlstars.brawling.dto.BrawlStarsPlayerResponse;
import com.brawlstars.brawling.dto.PlayerStatsResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class StatsServiceTest {

    private final StatsService statsService = new StatsService();

    @Test
    void computesAllStatsFromPlayerData() {
        BrawlStarsPlayerResponse player = player(
                45000,
                47000,
                3000,
                1200,
                800,
                new BrawlStarsPlayerResponse.Club("#CLUB", "Squad"),
                List.of(brawler(1, "Shelly", 11, 35, 1000, 1200))
        );

        PlayerStatsResponse result = statsService.calculateStats(player);

        assertThat(result.tag()).isEqualTo("#TAG");
        assertThat(result.name()).isEqualTo("Player");
        assertThat(result.trophies()).isEqualTo(45000);
        assertThat(result.highestTrophies()).isEqualTo(47000);
        assertThat(result.totalVictories()).isEqualTo(3000 + 1200 + 800);
        assertThat(result.threeVsThreeVictories()).isEqualTo(3000);
        assertThat(result.soloVictories()).isEqualTo(1200);
        assertThat(result.duoVictories()).isEqualTo(800);
        assertThat(result.brawlerCount()).isEqualTo(1);
        assertThat(result.highestTrophyBrawler()).isEqualTo("Shelly");
        assertThat(result.highestTrophyBrawlerId()).isEqualTo(1);
        assertThat(result.highestBrawlerTrophies()).isEqualTo(1200);
        assertThat(result.highestBrawlerCurrentTrophies()).isEqualTo(1000);
        assertThat(result.highestBrawlerRank()).isEqualTo(35);
        assertThat(result.highestBrawlerPower()).isEqualTo(11);
        assertThat(result.rankedRankName()).isEqualTo("Diamond");
        assertThat(result.clubName()).isEqualTo("Squad");
    }

    @Test
    void selectsBrawlerWithHighestTrophies() {
        BrawlStarsPlayerResponse player = player(
                1,
                null,
                null,
                null,
                null,
                null,
                List.of(
                        brawler(1, "Colt", 9, 25, 600, 700),
                        brawler(2, "Mortis", 11, 30, 650, 950),
                        brawler(3, "Spike", 7, 20, 700, 800)
                )
        );

        PlayerStatsResponse result = statsService.calculateStats(player);

        assertThat(result.highestTrophyBrawler()).isEqualTo("Mortis");
        assertThat(result.highestTrophyBrawlerId()).isEqualTo(2);
        assertThat(result.highestBrawlerTrophies()).isEqualTo(950);
        assertThat(result.highestBrawlerPower()).isEqualTo(11);
        assertThat(result.brawlerCount()).isEqualTo(3);
    }

    @Test
    void defaultsNullVictoriesAndCountsToZero() {
        BrawlStarsPlayerResponse player = player(
                null,
                null,
                null,
                null,
                null,
                null,
                List.of(brawler(1, "Shelly", null, null, null, null))
        );

        PlayerStatsResponse result = statsService.calculateStats(player);

        assertThat(result.trophies()).isZero();
        assertThat(result.highestTrophies()).isZero();
        assertThat(result.totalVictories()).isZero();
        assertThat(result.threeVsThreeVictories()).isZero();
        assertThat(result.soloVictories()).isZero();
        assertThat(result.duoVictories()).isZero();
        assertThat(result.highestBrawlerTrophies()).isZero();
        assertThat(result.highestBrawlerCurrentTrophies()).isZero();
        assertThat(result.highestBrawlerRank()).isZero();
        assertThat(result.highestBrawlerPower()).isZero();
    }

    @Test
    void handlesEmptyBrawlerList() {
        BrawlStarsPlayerResponse player = player(
                1000,
                null,
                10,
                5,
                5,
                new BrawlStarsPlayerResponse.Club("#C", "Team"),
                List.of()
        );

        PlayerStatsResponse result = statsService.calculateStats(player);

        assertThat(result.brawlerCount()).isZero();
        assertThat(result.highestTrophyBrawler()).isNull();
        assertThat(result.highestTrophyBrawlerId()).isZero();
        assertThat(result.highestBrawlerTrophies()).isZero();
    }

    @Test
    void exposesRankedInfoWhenPresent() {
        BrawlStarsPlayerResponse player = player(1, null, null, null, null, null, List.of());

        PlayerStatsResponse result = statsService.calculateStats(player);

        assertThat(result.rankedRank()).isEqualTo(3);
        assertThat(result.rankedRankName()).isEqualTo("Diamond");
        assertThat(result.clubName()).isNull();
    }

    @Test
    void winsComputedFromAllModes() {
        BrawlStarsPlayerResponse player = player(
                1, null,
                100, 40, 60,
                null,
                List.of()
        );

        PlayerStatsResponse result = statsService.calculateStats(player);

        assertThat(result.totalVictories()).isEqualTo(200);
        assertThat(result.threeVsThreeVictories()).isEqualTo(100);
        assertThat(result.soloVictories()).isEqualTo(40);
        assertThat(result.duoVictories()).isEqualTo(60);
    }

    private BrawlStarsPlayerResponse player(
            Integer trophies,
            Integer highestTrophies,
            Integer threeVsThreeVictories,
            Integer soloVictories,
            Integer duoVictories,
            BrawlStarsPlayerResponse.Club club,
            List<BrawlStarsPlayerResponse.Brawler> brawlers
    ) {
        return new BrawlStarsPlayerResponse(
                "#TAG",
                "Player",
                null,
                null,
                trophies,
                highestTrophies,
                null,
                null,
                null,
                null,
                null,
                null,
                threeVsThreeVictories,
                soloVictories,
                duoVictories,
                null,
                null,
                null,
                3,
                "Diamond",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                club,
                brawlers
        );
    }

    private BrawlStarsPlayerResponse.Brawler brawler(
            Integer id,
            String name,
            Integer power,
            Integer rank,
            Integer trophies,
            Integer highestTrophies
    ) {
        return new BrawlStarsPlayerResponse.Brawler(
                id, name, power, rank, trophies, highestTrophies,
                null, null, null
        );
    }
}