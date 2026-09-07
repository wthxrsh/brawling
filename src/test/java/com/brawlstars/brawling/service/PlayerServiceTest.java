package com.brawlstars.brawling.service;

import com.brawlstars.brawling.client.BrawlStarsClient;
import com.brawlstars.brawling.dto.BrawlStarsPlayerResponse;
import com.brawlstars.brawling.dto.PlayerStatsResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PlayerServiceTest {

    @Mock
    private BrawlStarsClient brawlStarsClient;

    @Mock
    private StatsService statsService;

    @InjectMocks
    private PlayerService playerService;

    @Test
    void delegatesToClientThenStatsService() {
        BrawlStarsPlayerResponse apiPlayer = new BrawlStarsPlayerResponse(
                "#TAG", "Player", null, null, 100, 200,
                null, null, null, null, null, null,
                10, 5, 5, null, null, null,
                null, null, null, null, null, null,
                null, null, null, null, List.of()
        );

        PlayerStatsResponse expected = new PlayerStatsResponse(
                "#TAG", "Player", 100, 200, 20, 10, 5, 5,
                1, "Shelly", 1, 1200, 1000, 35, 11,
                3, "Diamond", "Squad"
        );

        given(brawlStarsClient.getPlayer("#TAG")).willReturn(apiPlayer);
        given(statsService.calculateStats(apiPlayer)).willReturn(expected);

        PlayerStatsResponse result = playerService.getPlayer("#TAG");

        assertThat(result).isSameAs(expected);
        verify(brawlStarsClient).getPlayer("#TAG");
        verify(statsService).calculateStats(apiPlayer);
    }
}