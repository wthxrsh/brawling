package com.brawlstars.brawling.controller;

import com.brawlstars.brawling.dto.PlayerStatsResponse;
import com.brawlstars.brawling.service.PlayerService;
import jakarta.validation.constraints.Pattern;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/{playerTag}")
    public PlayerStatsResponse getPlayer(
            @PathVariable
            @Pattern(
                    regexp = "^#[A-Za-z0-9]{3,}$",
                    message = "Player tag must be in the form #XXXXXXXXX"
            )
            String playerTag
    ) {
        return playerService.getPlayer(playerTag);
    }
}