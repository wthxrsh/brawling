package com.brawlstars.brawling.exception;

public record ApiError(
        String timestamp,
        int status,
        String error,
        String message,
        String path
) {

    public static ApiError of(
            int status,
            String error,
            String message,
            String path
    ) {
        return new ApiError(
                java.time.Instant.now().toString(),
                status,
                error,
                message,
                path
        );
    }
}