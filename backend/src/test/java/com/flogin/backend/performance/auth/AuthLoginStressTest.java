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
        
        int breakingPoint = -1;
        
        for (int users : usersArray) {
            System.out.println("\n>>> Testing with " + users + " concurrent users...");
            
            TestPlanStats stats = runLoadTest(users, testName);
            
            // Tính toán các metrics
            long errorCount = stats.overall().errorsCount();
            long totalRequests = stats.overall().samplesCount();
            double errorRate = (errorCount * 100.0) / totalRequests;
            long responseTime99th = stats.overall().sampleTimePercentile99().toMillis();
            
            // Build report
            String report = buildReportBreakPoint(users, testName, stats);
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
                
                System.out.println("!".repeat(80));
                System.out.println("Stopping further stress tests.\n");
                break;
            }
            
            System.out.println("✅ System stable at " + users + " users");
            System.out.println("   - Error Rate: " + String.format("%.2f%%", errorRate));
            System.out.println("   - 99th Percentile Response Time: " + responseTime99th + "ms");
        }
        
        // Summary
        System.out.println("\n" + "=".repeat(80));
        System.out.println("STRESS TEST SUMMARY");
        System.out.println("=".repeat(80));
        if (breakingPoint > 0) {
            System.out.println("🔴 Breaking Point: " + breakingPoint + " concurrent users");
            System.out.println("📊 System can handle up to " + (breakingPoint - 1) + " users safely");
        } else {
            System.out.println("✅ System passed all stress levels!");
            System.out.println("📊 Maximum tested: " + usersArray[usersArray.length - 1] + " users");
        }
        System.out.println("=".repeat(80) + "\n");
    }

    @Test
    void stressTestLogin() throws Exception {
        // Tăng dần từ 100 đến 2000 users
        int[] usersArray = {100, 150, 200, 500, 1000, 2000};
        runTestAndReport(usersArray, "stress-test-login");
    }
    
    @Test
    void stressTestLoginProgressive() throws Exception {
        // Stress test tăng dần từ nhỏ
        int[] usersArray = {50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000};
        runTestAndReport(usersArray, "stress-test-login-progressive");
    }
}
