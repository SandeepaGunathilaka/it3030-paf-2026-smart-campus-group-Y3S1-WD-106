package com.nexus.scampus.security;

import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.AccountStatus;
import com.nexus.scampus.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Value("${app.oauth2.authorized-redirect-uris}")
    private String redirectUri;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        //Get logged-in user                                    
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        //Load user from database
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalStateException("User not found after OAuth2 login"));

        String targetUrl;

        if (user.getStatus() == AccountStatus.PENDING) {
            // Send to pending page — no JWT issued
            targetUrl = frontendUrl + "/pending";
            log.info("OAuth2 login: {} is PENDING approval", user.getEmail());

        } else if (user.getStatus() == AccountStatus.REJECTED) {
            // Send to rejected page — no JWT issued
            targetUrl = frontendUrl + "/rejected";
            log.info("OAuth2 login: {} account is REJECTED", user.getEmail());

        } else {
            // ACTIVE user — generate JWT and redirect to dashboard
            String token = tokenProvider.generateToken(user.getId(), user.getEmail());
            targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("token", token)
                    .build().toUriString();
            log.debug("OAuth2 login success for user: {}", user.getEmail());
        }
        // Send user to frontend
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
