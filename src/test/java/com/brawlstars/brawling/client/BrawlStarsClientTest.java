package com.brawlstars.brawling.client;

import com.brawlstars.brawling.dto.BrawlStarsPlayerResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestToUriTemplate;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class BrawlStarsClientTest {

    private static final String BASE_URL = "https://api.brawlstars.com";
    private static final String PLAYER_TAG = "#2VQJPYJE2";

    @Test
    void sendsBearerTokenAndDeserializesPlayer() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        BrawlStarsClient client = new BrawlStarsClient(builder, BASE_URL, "secret-token");

        server.expect(requestToUriTemplate(BASE_URL + "/v1/players/{playerTag}", PLAYER_TAG))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("Authorization", "Bearer secret-token"))
                .andRespond(withSuccess(playerJson(), MediaType.APPLICATION_JSON));

        BrawlStarsPlayerResponse player = client.getPlayer(PLAYER_TAG);

        server.verify();
        assertThat(player.tag()).isEqualTo(PLAYER_TAG);
        assertThat(player.name()).isEqualTo("BrawlQueen");
        assertThat(player.trophies()).isEqualTo(43000);
        assertThat(player.brawlers()).hasSize(1);
    }

    @Test
    void throwsIllegalStateWhenTokenMissing() {
        RestClient.Builder builder = RestClient.builder();
        BrawlStarsClient client = new BrawlStarsClient(builder, BASE_URL, " ");

        assertThatThrownBy(() -> client.getPlayer(PLAYER_TAG))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("BRAWLSTARS_API_TOKEN");
    }

    @Test
    void propagatesUpstreamNotFoundAsHttpStatusException() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        BrawlStarsClient client = new BrawlStarsClient(builder, BASE_URL, "token");

        server.expect(requestToUriTemplate(BASE_URL + "/v1/players/{playerTag}", PLAYER_TAG))
                .andRespond(withStatus(HttpStatus.NOT_FOUND));

        assertThatThrownBy(() -> client.getPlayer(PLAYER_TAG))
                .isInstanceOf(HttpStatusCodeException.class)
                .extracting(ex -> ((HttpStatusCodeException) ex).getStatusCode())
                .isEqualTo(HttpStatusCode.valueOf(404));

        server.verify();
    }

    private String playerJson() {
        return """
                {
                  "tag": "#2VQJPYJE2",
                  "name": "BrawlQueen",
                  "trophies": 43000,
                  "highestTrophies": 46000,
                  "threeVsThreeVictories": 2500,
                  "soloVictories": 900,
                  "duoVictories": 700,
                  "rankedRank": 2,
                  "rankedRankName": "Mythic",
                  "club": { "tag": "#C", "name": "Squad" },
                  "brawlers": [
                    {
                      "id": 16000006,
                      "name": "Shelly",
                      "power": 11,
                      "rank": 35,
                      "trophies": 1000,
                      "highestTrophies": 1200
                    }
                  ]
                }
                """;
    }
}