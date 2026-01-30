package com.selfhost.auth.auth_svc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
public class ServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserRegistrationService userRegistrationService;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Test
    void testRegisterUser() {
        // Arrange
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@test.com");
        user.setPassword("password");

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        User registeredUser = userRegistrationService.registerUser(user);

        // Assert
        assertEquals("encodedPassword", registeredUser.getPassword());
        verify(userRepository).save(user);
    }

    @Test
    void testAuthenticate() {
        // Arrange
        AuthenticationRequestDto request = new AuthenticationRequestDto("testuser", "password");
        when(jwtService.generateToken("testuser")).thenReturn("mock-token");

        // Act
        AuthenticationResponseDto response = authenticationService.authenticate(request);

        // Assert
        assertNotNull(response);
        assertEquals("mock-token", response.token());
        verify(authenticationManager).authenticate(any());
    }
}
