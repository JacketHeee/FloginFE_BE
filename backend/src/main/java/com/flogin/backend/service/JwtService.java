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

        public String generateToken(String email) {
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + expirationMinutes * 60 * 1000);
            return Jwts.builder().setSubject(email).setIssuedAt(now).setExpiration(expiryDate).signWith(getSignInKey(), SignatureAlgorithm.HS256).compact();
        }

        //kiem tra token hop le
        public boolean isValidToken(String token, String email) {
            final String extractedEmail = getExtractedEmail(token);
            return (extractedEmail.equals(email)) && !isTokenExpired(token);
        }

        //lay email tu token
        public String getExtractedEmail(String token) {
            return getExtractedClaim(token, Claims::getSubject);
        }
        //kiem tra token het han
        public boolean isTokenExpired(String token) {
            return getExtractExpiration(token).before(new Date());
        }

        //get time het han cua token
        private Date getExtractExpiration(String token) {
            return getExtractedClaim(token,Claims::getExpiration);
        }

        public <T> T getExtractedClaim(String token, Function<Claims, T> claimsTFunction) {
            final Claims claims = getExtractAllClaims(token);
            return claimsTFunction.apply(claims);
        }

        private Claims getExtractAllClaims(String token) {
            return Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token).getBody();
        }

        private Key getSignInKey() {
            return Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
        }


    }
