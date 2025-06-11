package com.social_network.social_network.util;


import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.social_network.social_network.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    @Value("${jwt.signerKey}")
    private String signerKey;

    @Value("${jwt.valid-duration}")
    private int validDuration;

    @Value("${jwt.refreshable-duration}")
    private int refreshDuration;

    public String generateToken(User user ) throws JOSEException {
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .claim("email", user.getEmail())
                .claim("username", user.getUsername())
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(Duration.ofDays(validDuration * 3000))))
                .jwtID(UUID.randomUUID().toString())
                .build();

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        SignedJWT signedJWT = new SignedJWT(header, claimsSet);
        signedJWT.sign(new MACSigner(signerKey.getBytes()));

        return signedJWT.serialize();
    }

    public boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(signerKey.getBytes());

            return signedJWT.verify(verifier)
                    && new Date().before(signedJWT.getJWTClaimsSet().getExpirationTime());

        } catch (Exception e) {
            return false;
        }
    }

    public JWTClaimsSet getClaims(String token) throws ParseException {
        return SignedJWT.parse(token).getJWTClaimsSet();
    }

    public String getUserIdFromToken(String token) throws ParseException {
        return getClaims(token).getSubject();
    }
}