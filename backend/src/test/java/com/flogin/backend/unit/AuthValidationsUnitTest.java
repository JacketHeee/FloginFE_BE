package com.flogin.backend.unit;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
public class AuthValidationsUnitTest {
    //kiểm tra username hợp lệ
    private boolean isValidUsername(String username) {
        return username != null && username.matches("^[a-zA-Z0-9._-]{3,50}$");
    }

    //kiểm tra password hợp lệ
    boolean isValidPassword(String password) {
        return password != null && password.matches("^(?=.*[0-9])(?=.*[a-zA-Z]).{6,100}$");
    }



    @Test
    void testValidUsernames() {
        assertTrue(isValidUsername("user_123"));
        assertTrue(isValidUsername("john.doe"));
        assertFalse(isValidUsername("ab"));
        assertFalse(isValidUsername("user@name"));
        assertFalse(isValidUsername(null));
    }

    @Test
    void testValidPasswords() {
        assertTrue(isValidPassword("Pass123"));
        assertTrue(isValidPassword("abc123XYZ"));
        assertFalse(isValidPassword("abcdef"));
        assertFalse(isValidPassword("123456"));
        assertFalse(isValidPassword(null));
    }

}
