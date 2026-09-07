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
    private final String token;

    public BrawlStarsClient(
            RestClient.Builder builder,
            @Value("${brawlstars.api.base-url}") String baseUrl,
            @Value("${brawlstars.api.token:}") String token) {

        this.token = token;

        this.restClient = builder
                .baseUrl(baseUrl)
                .defaultHeader(
                        HttpHeaders.ACCEPT,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();
    }

    public BrawlStarsPlayerResponse getPlayer(String playerTag) {

        if (token.isBlank()) {
            throw new IllegalStateException(
                    "BRAWLSTARS_API_TOKEN is not configured"
            );
        }

        return restClient.get()
                .uri("/v1/players/{playerTag}", playerTag)
                .headers(headers -> headers.setBearerAuth(token))
                .retrieve()
                .body(BrawlStarsPlayerResponse.class);
    }
}