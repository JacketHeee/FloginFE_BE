    package com.flogin.backend.service;


    import io.jsonwebtoken.Claims;
    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.SignatureAlgorithm;
    import io.jsonwebtoken.io.Decoders;
    import io.jsonwebtoken.security.Keys;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.stereotype.Service;

    import java.security.Key;
    import java.util.Base64;
    import java.util.Date;
    import java.util.function.Function;

    @Service
    public class JwtService {
        @Value("${jwt.secret-key}")
        private String jwtSecretKey;

        @Value("${jwt.expiration-minutes}")
        private long expirationMinutes;

        public String generateToken(String email,String role) {
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + expirationMinutes * 60 * 1000);
            return Jwts.builder().setSubject(email).claim("role", role).setIssuedAt(now).setExpiration(expiryDate).signWith(getSignInKey(), SignatureAlgorithm.HS256).compact();
        }

        public String getEmail(String token) {
            return getClaims(token).getSubject();
        }

        public String getRole(String token) {
            return getClaims(token).get("role", String.class);
        }

        public boolean isTokenValid(String token) {
            try {
                return !getClaims(token).getExpiration().before(new Date());
            } catch (Exception e) {
                return false;
            }
        }

        public Claims parseToken(String token) {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }

        private Claims getClaims(String token) {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }


        private Key getSignInKey() {
            return Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
        }
    }
