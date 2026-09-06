package com.brawlstars.brawling.client;

import com.brawlstars.brawling.dto.BrawlStarsPlayerResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class BrawlStarsClient {

    private final RestClient restClient;

    public BrawlStarsClient(
            @Value("${brawlstars.api.base-url}") String baseUrl,
            @Value("${brawlstars.api.token}") String token) {

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + token
                )
                .defaultHeader(
                        HttpHeaders.ACCEPT,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }

    public BrawlStarsPlayerResponse getPlayer(String playerTag) {

        return restClient.get()
                .uri("/v1/players/{playerTag}", playerTag)
                .retrieve()
                .body(BrawlStarsPlayerResponse.class);
    }
}