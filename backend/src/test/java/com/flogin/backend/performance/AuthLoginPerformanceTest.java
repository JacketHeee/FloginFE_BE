package com.flogin.backend.performance;

import org.apache.http.entity.ContentType;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import us.abstracta.jmeter.javadsl.core.TestPlanStats;
import us.abstracta.jmeter.javadsl.core.assertions.DslResponseAssertion;

import static us.abstracta.jmeter.javadsl.JmeterDsl.*;

public class AuthLoginPerformanceTest {

    private static final String BASE_URL =
            System.getProperty("perf.baseUrl", "http://localhost:8081");

    @Test
    void authLogin_load_test_100_users() throws Exception {
        TestPlanStats stats = testPlan(
                httpDefaults().url(BASE_URL),

                threadGroup()
                        .rampToAndHold(100, Duration.ofSeconds(30), Duration.ofSeconds(60))
                        .children(
                                httpSampler("/api/auth/login")
                                        .post(
                                                "{\"username\":\"testuser\",\"password\":\"password123\"}",
                                                ContentType.APPLICATION_JSON
                                        )
                                        .children(
                                                //Dùng responseAssertion để check status code
                                                responseAssertion()
                                                        .fieldToTest(DslResponseAssertion.TargetField.RESPONSE_CODE)
                                                        .equalsToStrings("200"),

                                                //Dùng containsSubstring thay vì substring
                                                responseAssertion()
                                                        .containsSubstrings("token")
                                        )
                        )
        ).run();

        double p99Millis = stats.overall().sampleTimePercentile99().toMillis();
        long totalRequests = stats.overall().samplesCount();
        double errorRate = (double) stats.overall().errorsCount() / stats.overall().samplesCount();

        System.out.println("=== LOAD TEST: 100 USERS ===");
        System.out.println("Total Requests: " + totalRequests);
        System.out.println("P99 Response Time: " + p99Millis + " ms");
        System.out.println("Error Rate: " + (errorRate * 100) + "%");

        if (p99Millis > 2000) {
            throw new AssertionError("FAIL: P99 exceeds 2000ms: " + p99Millis);
        }
        if (errorRate > 0.01) {
            throw new AssertionError("FAIL: Error rate > 1%: " + (errorRate * 100) + "%");
        }
    }
}
