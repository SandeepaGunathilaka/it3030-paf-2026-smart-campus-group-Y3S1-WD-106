package com.nexus.scampus.security;

import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.Role;
import com.nexus.scampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String googleId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");

        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> userRepository.findByEmail(email)
                        .map(existingUser -> {
                            existingUser.setGoogleId(googleId);   //link Google ID to existing user
                            existingUser.setPictureUrl(picture);
                            existingUser.setName(name);
                            return userRepository.save(existingUser);
                        })
                        .orElseGet(() -> userRepository.save(
                                User.builder()
                                        .googleId(googleId) //get from gooogle
                                        .email(email)         //from google 'for admn and tech from db''
                                        .name(name)         //from google 'for admn and tech from db'
                                        .pictureUrl(picture)    //from google
                                        .role(Role.USER)        //from db. default USER role
                                        .build()
                        ))
                );

        return UserPrincipal.create(user, attributes);
    }
}
