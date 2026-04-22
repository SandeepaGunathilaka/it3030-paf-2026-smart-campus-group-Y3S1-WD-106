package com.nexus.scampus.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.SerializationUtils;

import java.util.Base64;
import java.util.Optional;

@Component
public class CookieOAuth2AuthorizationRequestRepository
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    //Handles storing and retrieving OAuth2 authorization requests in cookies during the login flow
    //tempoprary storage for the auth request between the initial login and the callback from google and it redirect to my app
    private static final String COOKIE_NAME = "oauth2_auth_request";
    private static final int COOKIE_EXPIRE_SECONDS = 180;

    //Load the authorization request from the cookie when the user is redirected back from the OAuth2 provider
    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return getCookie(request, COOKIE_NAME)
                .map(c -> (OAuth2AuthorizationRequest) deserialize(c.getValue()))
                .orElse(null);
    }

    //Save the authorization request in a cookie before redirecting to the OAuth2 provider
    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest,
                                         HttpServletRequest request,
                                         HttpServletResponse response) {
        if (authorizationRequest == null) {
            deleteCookie(request, response, COOKIE_NAME);
            return;
        }
        Cookie cookie = new Cookie(COOKIE_NAME, serialize(authorizationRequest));
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(COOKIE_EXPIRE_SECONDS);
        response.addCookie(cookie);
    }

    //Remove the authorization request from the cookie after it's used
    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request,
                                                                  HttpServletResponse response) {
        OAuth2AuthorizationRequest req = loadAuthorizationRequest(request);
        deleteCookie(request, response, COOKIE_NAME);
        return req;
    }

    //Helper methods for cookie handling and serialization
    private Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (name.equals(c.getName())) return Optional.of(c);
            }
        }
        return Optional.empty();
    }

    //Deletes a cookie by setting its value to empty and max age to 0
    private void deleteCookie(HttpServletRequest request, HttpServletResponse response, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (name.equals(c.getName())) {
                    c.setValue("");
                    c.setPath("/");
                    c.setMaxAge(0);
                    response.addCookie(c);
                }
            }
        }
    }
    //Serializes an object to a Base64 string for storing in a cookie
    private String serialize(Object object) {
        return Base64.getUrlEncoder().encodeToString(SerializationUtils.serialize(object));
    }

    //Deserializes a Base64 string from a cookie back into an object
    @SuppressWarnings("unchecked")
    private <T> T deserialize(String value) {
        return (T) SerializationUtils.deserialize(Base64.getUrlDecoder().decode(value));
    }
}