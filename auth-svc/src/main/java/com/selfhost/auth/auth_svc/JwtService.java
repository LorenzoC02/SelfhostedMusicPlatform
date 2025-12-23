package com.selfhost.auth.auth_svc;

import java.time.Duration;
import java.time.Instant;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtService {
    
    private final String issuer;
    private final Duration ttl;
    private final JwtEncoder jwtEncoder;

    public String generateToken(final String username) {
        final var claimsSet = JwtClaimsSet.builder()
                .subject(username)
                .issuer(issuer)
                .expiresAt(Instant.now().plus(ttl))
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claimsSet))
            .getTokenValue();
    }
}