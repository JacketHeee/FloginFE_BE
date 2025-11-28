src/test/java/com/flogin/backend/
├── performance/                    # 📊 PERFORMANCE TESTING (10 điểm)
│   ├── auth/
│   │   ├── AuthLoginLoadTest.java           # ✅ Load: 100,500,1000 users (3đ)
│   │   ├── AuthLoginStressTest.java         # ✅ Stress: Breaking point (1đ)
│   │   └── AuthPerformanceBaseTest.java     # Base class chung
│   ├── product/
│   │   ├── ProductCrudLoadTest.java         # ✅ Product API load test (3đ)
│   │   ├── ProductSearchPerformanceTest.java # Search performance
│   │   └── ProductConcurrencyTest.java      # Concurrent access
│   ├── reports/
│   │   └── PerformanceReportGenerator.java  # ✅ Phân tích kết quả (2đ)
│   └── utils/
│       └── PerformanceTestUtils.java        # ✅ Setup JMeter utilities (2đ)
│
├── security/                       # 🔒 SECURITY TESTING (10 điểm)
│   ├── vulnerabilities/            # ✅ Common vulnerabilities (5đ)
│   │   ├── SqlInjectionTest.java            # SQL injection attacks
│   │   ├── XssAttackTest.java               # XSS (Reflected + Stored)
│   │   ├── CsrfProtectionTest.java          # CSRF protection validation
│   │   └── AuthenticationBypassTest.java    # Auth bypass attempts
│   ├── validation/                 # ✅ Input validation (3đ)
│   │   ├── InputValidationTest.java         # Input validation testing
│   │   ├── DataSanitizationTest.java        # Data sanitization checks
│   │   └── MaliciousPayloadTest.java        # Various malicious inputs
│   ├── bestpractices/             # ✅ Security best practices (2đ)
│   │   ├── PasswordSecurityTest.java        # Password hashing validation
│   │   ├── HttpsEnforcementTest.java        # HTTPS enforcement
│   │   ├── CorsConfigurationTest.java       # CORS configuration
│   │   └── SecurityHeadersTest.java         # Security headers check
│   └── utils/
│       └── SecurityTestUtils.java           # Common security utilities
│
└── resources/
├── test-data/
│   ├── malicious-payloads.json          # Attack vectors
│   └── performance-users.json           # Test user data
└── application-test.yml                 # Test configuration


### 4. Commands đúng theo thứ tự:

```
# Bước 1: Khởi động app (Terminal 1)
mvn spring-boot:run

# Bước 2: Kiểm tra health (Terminal 2)  
curl http://localhost:8080/actuator/health

# Bước 3: Chạy performance test (Terminal 2)
mvn -Dtest="AuthLoginPerformanceTest" test

# Bước 4: Dừng app khi xong (Terminal 1)
Ctrl+C




# 🔥 CHẠY TESTS

# Performance Testing (7.1)
mvn -Dtest="com.flogin.backend.performance.**" test
mvn -Dtest="*LoadTest" test                    # Chỉ load tests
mvn -Dtest="*StressTest" test                  # Chỉ stress tests

# Security Testing (7.2)
mvn -Dtest="com.flogin.backend.security.**" test
mvn -Dtest="*InjectionTest" test               # SQL injection tests
mvn -Dtest="*XssTest" test                     # XSS tests
mvn -Dtest="*SecurityTest" test                # All security tests

# Custom configuration
mvn -Dtest="*PerformanceTest" -Dperf.baseUrl=http://localhost:8080 test
mvn -Dtest="*SecurityTest" -Dspring.profiles.active=test test

# 📈 REPORTS
mvn surefire-report:report                     # Generate HTML reports



