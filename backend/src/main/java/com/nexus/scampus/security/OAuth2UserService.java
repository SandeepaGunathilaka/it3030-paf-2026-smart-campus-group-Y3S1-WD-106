package com.nexus.scampus.security;

import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.AccountStatus;
import com.nexus.scampus.model.enums.Role;
import com.nexus.scampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Value("${app.super-admin.email}")
    private String superAdminEmail;

    //extract details from google
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String googleId = (String) attributes.get("sub");
        String email    = (String) attributes.get("email");
        String name     = (String) attributes.get("name");
        String picture  = (String) attributes.get("picture");

        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> userRepository.findByEmail(email).orElse(null));

        if (user == null) {
            // Brand-new user — create with PENDING status
            boolean isSuperAdmin = email.equalsIgnoreCase(superAdminEmail);
            user = User.builder()
                    .googleId(googleId)
                    .email(email)
                    .name(name)
                    .pictureUrl(picture)
                    .role(isSuperAdmin ? Role.SUPER_ADMIN : Role.USER)
                    .status(isSuperAdmin ? AccountStatus.ACTIVE : AccountStatus.PENDING)
                    .build();
            user = userRepository.save(user);
        } else {
            // Existing user — link Google ID and refresh profile info
            boolean changed = false;
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                changed = true;
            }
            if (!name.equals(user.getName()))       { user.setName(name);         changed = true; }
            if (!picture.equals(user.getPictureUrl())) { user.setPictureUrl(picture); changed = true; }

            // Super admin: always ensure correct role + active status
            if (email.equalsIgnoreCase(superAdminEmail)) {
                if (user.getRole() != Role.SUPER_ADMIN)     { user.setRole(Role.SUPER_ADMIN);      changed = true; }
                if (user.getStatus() != AccountStatus.ACTIVE) { user.setStatus(AccountStatus.ACTIVE); changed = true; }
            }

            if (changed) user = userRepository.save(user);
        }

        return UserPrincipal.create(user, attributes);
    }
}
