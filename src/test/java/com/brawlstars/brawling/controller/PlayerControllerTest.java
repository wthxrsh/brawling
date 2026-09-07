package com.brawlstars.brawling.controller;

import com.brawlstars.brawling.dto.PlayerStatsResponse;
import com.brawlstars.brawling.service.PlayerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.http.HttpStatus;

import com.brawlstars.brawling.exception.GlobalExceptionHandler;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PlayerController.class)
@Import(GlobalExceptionHandler.class)
class PlayerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PlayerService playerService;

    @Test
    void returnsPlayerStats() throws Exception {
        PlayerStatsResponse stats = new PlayerStatsResponse(
                "#TAG", "Player", 45000, 47000, 5000, 3000, 1200, 800,
                3, "Shelly", 1, 1200, 1000, 35, 11,
                3, "Diamond", "Squad"
        );

        given(playerService.getPlayer("#TAG")).willReturn(stats);

        mockMvc.perform(get("/api/v1/players/{tag}", "#TAG"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tag").value("#TAG"))
                .andExpect(jsonPath("$.name").value("Player"))
                .andExpect(jsonPath("$.trophies").value(45000))
                .andExpect(jsonPath("$.totalVictories").value(5000))
                .andExpect(jsonPath("$.highestTrophyBrawler").value("Shelly"))
                .andExpect(jsonPath("$.clubName").value("Squad"));
    }

    @Test
    void rejectsInvalidPlayerTag() throws Exception {
        mockMvc.perform(get("/api/v1/players/plain-tag"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void returnsNotFoundWhenPlayerMissing() throws Exception {
        given(playerService.getPlayer("#GHOST")).willThrow(
                new HttpClientErrorException(HttpStatus.NOT_FOUND)
        );

        mockMvc.perform(get("/api/v1/players/{tag}", "#GHOST"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    void mapsUpstreamServerFailureToBadGateway() throws Exception {
        given(playerService.getPlayer("#DOWN")).willThrow(
                new HttpServerErrorException(HttpStatus.BAD_GATEWAY)
        );

        mockMvc.perform(get("/api/v1/players/{tag}", "#DOWN"))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.status").value(502));
    }

    @Test
    void mapsUnexpectedErrorsToInternalServerError() throws Exception {
        given(playerService.getPlayer("#BROKEN")).willThrow(
                new IllegalStateException("boom")
        );

        mockMvc.perform(get("/api/v1/players/{tag}", "#BROKEN"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Internal Server Error"));
    }
}