package com.example.remove_bg.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URI;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class ClerkJwksProvider {

    @Value("${clerk.jwks.url}")
    private String jwksUrl;

    private final Map<String, PublicKey> keyCache = new HashMap<>();
    private long lastFetchTime = 0;

    private static final long TTL = 3600000; // 1 hour

    public PublicKey getPublicKey(String keyId) {
        if (System.currentTimeMillis() - lastFetchTime > TTL || !keyCache.containsKey(keyId)) {
            refreshKeys();
        }
        return keyCache.get(keyId);
    }

    private void refreshKeys() {
        try {
            URI uri = URI.create(jwksUrl);
            HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(conn.getInputStream());

            keyCache.clear();

            if (jsonNode.has("keys")) {
                for (JsonNode key : jsonNode.get("keys")) {
                    String kid = key.get("kid").asText();
                    String kty = key.get("kty").asText();
                    String alg = key.get("alg").asText();

                    if ("RSA".equals(kty) && "RS256".equals(alg)) {
                        String n = key.get("n").asText();
                        String e = key.get("e").asText();

                        PublicKey publicKey = createPublicKey(n, e);
                        keyCache.put(kid, publicKey);
                    }
                }
            }

            lastFetchTime = System.currentTimeMillis();

        } catch (IOException e) {
            throw new RuntimeException("Không thể lấy JWKS từ Clerk", e);
        } catch (Exception e) {
            throw new RuntimeException("Không thể phân tích các khóa JWKS", e);
        }
    }

    private PublicKey createPublicKey(String modulus, String exponent) throws Exception {
        byte[] decodedN = Base64.getUrlDecoder().decode(modulus);
        byte[] decodedE = Base64.getUrlDecoder().decode(exponent);

        BigInteger n = new BigInteger(1, decodedN);
        BigInteger e = new BigInteger(1, decodedE);

        RSAPublicKeySpec spec = new RSAPublicKeySpec(n, e);
        KeyFactory factory = KeyFactory.getInstance("RSA");

        return factory.generatePublic(spec);
    }
}
