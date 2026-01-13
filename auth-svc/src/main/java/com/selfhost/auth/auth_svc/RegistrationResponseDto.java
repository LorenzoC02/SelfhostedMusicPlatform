package com.selfhost.auth.auth_svc;

public record RegistrationResponseDto(
    String username,
    String email
) { }
