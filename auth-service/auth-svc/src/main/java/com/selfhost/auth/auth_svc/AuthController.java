package com.selfhost.auth.auth_svc;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthenticationService authenticationService;
    private final UserRegistrationService userRegistrationService;
    private final UserRegistrationMapper userRegistrationMapper;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDto> authenticate(
            @RequestBody final AuthenticationRequestDto authenticationRequestDto) {
        
        return ResponseEntity.ok(
                authenticationService.authenticate(authenticationRequestDto));
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponseDto> register(
            @RequestBody final RegistrationRequestDto registrationRequestDto) {
        
        final var user = userRegistrationMapper.toEntity(registrationRequestDto);
        final var savedUser = userRegistrationService.registerUser(user);
        
        return ResponseEntity.ok(
            userRegistrationMapper.toRegistrationResponseDto(savedUser)
        );
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
