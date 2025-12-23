package com.selfhost.auth.auth_svc;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;
import lombok.Value;

@Configuration
@Setter
@Getter
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    private RSAPrivateKey privateKey;
    private RSAPublciKey publicKey;
    private Duration ttl;

    @Bean
    public JwtEncoder jwtEncoder(){
        final var jwk = new RSAKey.Builder(publicKey)
            .privateKey(privateKey).build();
        
        return new NimbusJwtEncoder(
            new ImmutableJWKSet<>(new JWKSet(jwk)));
    }

    @Bean
    public JwtDecoder jwtDecoder(){
        return NimbusJwtDecoder.withPublicKey(publicKey).build();
    }

    @Bean
    public JwtService jwtService(
        @Value("${spring.application.name}") final String appName,
        final JwtEncoder jwtEncoder) {

            return new JwtService(appName, ttl, jwtEncoder)
        }    
}