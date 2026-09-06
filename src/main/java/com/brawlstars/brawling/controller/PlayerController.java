package com.brawlstars.brawling.controller;

import com.brawlstars.brawling.dto.BrawlStarsPlayerResponse;
import com.brawlstars.brawling.dto.PlayerStatsResponse;
import com.brawlstars.brawling.service.PlayerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/{playerTag}")
    public PlayerStatsResponse getPlayer(
            @PathVariable String playerTag) {

        return playerService.getPlayer(playerTag);
    }
}