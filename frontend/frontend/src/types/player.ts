export interface PlayerStats {
    tag: string;
    name: string;

    trophies: number;
    highestTrophies: number;

    totalVictories: number;
    threeVsThreeVictories: number;
    soloVictories: number;
    duoVictories: number;

    brawlerCount: number;

    highestTrophyBrawler: string;
    highestTrophyBrawlerId: number;
    highestBrawlerTrophies: number;
    highestBrawlerCurrentTrophies: number;

    highestBrawlerRank: number;
    highestBrawlerPower: number;

    rankedRank: number;
    rankedRankName: string;

    clubName: string;
}