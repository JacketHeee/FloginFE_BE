package com.flogin.backend.performance.auth;

import org.junit.jupiter.api.Test;
import us.abstracta.jmeter.javadsl.core.TestPlanStats;

public class AuthLoginStressTest extends AuthPerformanceBaseTest {
    
    // Ngưỡng response time cho phép (ms)
    private static final long RESPONSE_TIME_THRESHOLD_MS = 5000;
    
    // Ngưỡng error rate cho phép (%)
    private static final double ERROR_RATE_THRESHOLD = 5.0;
    
    /**
     * Chạy stress test và ghi báo cáo
     * @param usersArray Mảng số lượng users tăng dần
     * @param testName Tên test
     * @throws Exception
     */
    private void runTestAndReport(int[] usersArray, String testName) throws Exception {
        System.out.println("=".repeat(80));
        System.out.println("Starting Stress Test: " + testName);
        System.out.println("=".repeat(80));
        System.out.println("Test Configuration:");
        System.out.println("  - Response Time Threshold (P99): " + RESPONSE_TIME_THRESHOLD_MS + " ms");
        System.out.println("  - Error Rate Threshold: " + ERROR_RATE_THRESHOLD + "%");
        System.out.println("=".repeat(80));
        
        int breakingPoint = -1;
        int lastStableLevel = -1;
        double lastStableErrorRate = 0;
        long lastStableResponseTime = 0;
        
        for (int users : usersArray) {
            System.out.println("\n>>> Testing with " + users + " concurrent users...");
            
            TestPlanStats stats = runLoadTest(users, testName);
            
            // Tính toán các metrics
            long errorCount = stats.overall().errorsCount();
            long totalRequests = stats.overall().samplesCount();
            double errorRate = (errorCount * 100.0) / totalRequests;
            long responseTime99th = stats.overall().sampleTimePercentile99().toMillis();
            
            // Build report with last stable level info
            String report = buildReportBreakPoint(users, testName, stats, 
                                                 lastStableLevel, lastStableErrorRate, lastStableResponseTime);
            System.out.println(report);
            writeReport(testName + "-users" + users, report);
            
            // Kiểm tra breaking point
            boolean hasErrors = errorCount > 0;
            boolean highErrorRate = errorRate > ERROR_RATE_THRESHOLD;
            boolean slowResponse = responseTime99th > RESPONSE_TIME_THRESHOLD_MS;
            
            if (hasErrors || highErrorRate || slowResponse) {
                breakingPoint = users;
                
                System.out.println("\n" + "!".repeat(80));
                System.out.println("⚠️  BREAKING POINT DETECTED at " + users + " users!");
                System.out.println("!".repeat(80));
                
                if (hasErrors) {
                    System.out.println("❌ Errors detected: " + errorCount + " (" + 
                                     String.format("%.2f%%", errorRate) + ")");
                }
                if (highErrorRate) {
                    System.out.println("❌ Error rate exceeded threshold: " + 
                                     String.format("%.2f%%", errorRate) + " > " + 
                                     ERROR_RATE_THRESHOLD + "%");
                }
                if (slowResponse) {
                    System.out.println("❌ Response time exceeded threshold: " + 
                                     responseTime99th + "ms > " + 
                                     RESPONSE_TIME_THRESHOLD_MS + "ms");
                }
                
                // Hiển thị so sánh với mức stable trước đó
                if (lastStableLevel > 0) {
                    System.out.println("\n📊 COMPARISON WITH LAST STABLE LEVEL:");
                    System.out.println("   Last Stable Level: " + lastStableLevel + " users");
                    System.out.println("   Breaking Point: " + users + " users");
                    System.out.println("   Difference: " + (users - lastStableLevel) + " users");
                    System.out.println("\n   Last Stable Error Rate: " + String.format("%.2f%%", lastStableErrorRate));
                    System.out.println("   Current Error Rate: " + String.format("%.2f%%", errorRate));
                    System.out.println("   Increase: " + String.format("%.2f%%", (errorRate - lastStableErrorRate)));
                    System.out.println("\n   Last Stable Response Time (P99): " + lastStableResponseTime + "ms");
                    System.out.println("   Current Response Time (P99): " + responseTime99th + "ms");
                    System.out.println("   Increase: " + (responseTime99th - lastStableResponseTime) + "ms");
                }
                
                System.out.println("!".repeat(80) + "\n");
                break;
            } else {
                // Cập nhật last stable level
                lastStableLevel = users;
                lastStableErrorRate = errorRate;
                lastStableResponseTime = responseTime99th;
                
                System.out.println("✅ System stable at " + users + " users");
                System.out.println("   - Error Rate: " + String.format("%.2f%%", errorRate) + 
                                 " (Threshold: " + ERROR_RATE_THRESHOLD + "%)");
                System.out.println("   - 99th Percentile Response Time: " + responseTime99th + "ms" +
                                 " (Threshold: " + RESPONSE_TIME_THRESHOLD_MS + "ms)");
            }
        }
        
        // Summary
        System.out.println("\n" + "=".repeat(80));
        System.out.println("STRESS TEST SUMMARY");
        System.out.println("=".repeat(80));
        System.out.println("Test Thresholds:");
        System.out.println("  - Response Time Threshold (P99): " + RESPONSE_TIME_THRESHOLD_MS + " ms");
        System.out.println("  - Error Rate Threshold: " + ERROR_RATE_THRESHOLD + "%");
        System.out.println();
        
        if (breakingPoint > 0) {
            System.out.println("🔴 Breaking Point Detected: " + breakingPoint + " concurrent users");
            if (lastStableLevel > 0) {
                System.out.println("✅ Last Stable Level: " + lastStableLevel + " concurrent users");
                System.out.println("📊 Degradation: System degraded after adding " + 
                                 (breakingPoint - lastStableLevel) + " more users");
                System.out.println();
                System.out.println("Performance at Last Stable Level (" + lastStableLevel + " users):");
                System.out.println("  - Error Rate: " + String.format("%.2f%%", lastStableErrorRate));
                System.out.println("  - Response Time (P99): " + lastStableResponseTime + "ms");
            } else {
                System.out.println("⚠️  System failed at the first test level");
            }
            System.out.println();
            System.out.println("Recommendation: System can safely handle up to " + 
                             (lastStableLevel > 0 ? lastStableLevel : "< " + usersArray[0]) + " concurrent users");
        } else {
            System.out.println("✅ System passed all stress levels!");
            System.out.println("📊 Maximum tested: " + usersArray[usersArray.length - 1] + " users");
            System.out.println();
            System.out.println("Final Performance Metrics:");
            System.out.println("  - Error Rate: " + String.format("%.2f%%", lastStableErrorRate));
            System.out.println("  - Response Time (P99): " + lastStableResponseTime + "ms");
            System.out.println();
            System.out.println("Recommendation: System can handle more than " + 
                             usersArray[usersArray.length - 1] + " concurrent users");
        }
        System.out.println("=".repeat(80) + "\n");
    }

    @Test
    void stressTestLogin() throws Exception {
        // Tăng dần từ 50 đến 2000 users
        int[] usersArray = {50, 100, 150, 200, 500, 1000, 2000};
        runTestAndReport(usersArray, "stress-test-login");
    }
    
    @Test
    void stressTestLoginProgressive() throws Exception {
        // Stress test tăng dần từ nhỏ
        int[] usersArray = {50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000};
        runTestAndReport(usersArray, "stress-test-login-progressive");
    }
}
