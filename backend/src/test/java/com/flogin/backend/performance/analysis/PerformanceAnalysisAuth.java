package com.flogin.backend.performance.analysis;

import com.flogin.backend.performance.auth.AuthPerformanceBaseTest;
import org.junit.jupiter.api.Test;
import us.abstracta.jmeter.javadsl.core.TestPlanStats;

import java.util.HashMap;
import java.util.Map;

public class PerformanceAnalysisAuth extends AuthPerformanceBaseTest {
    
    @Test
    public void generate_analysis_report_auth() throws Exception {
        System.out.println("=== STARTING AUTH PERFORMANCE ANALYSIS ===");

        Map<String, TestPlanStats> authRes = runAllAuthLoadTests();
        
        AuthStressResult stressResult = runAuthStressTest();
        
        String authAnalysis = buildAuthAnalysisReport(authRes, stressResult);

        writeReport("AUTH_PERFORMANCE_ANALYSIS", authAnalysis);
        System.out.println("=== AUTH ANALYSIS COMPLETED ===");
    }

    private String buildAuthAnalysisReport(Map<String, TestPlanStats> authRes, AuthStressResult stressResult) {
        StringBuilder report = new StringBuilder();
        report.append("=== AUTH PERFORMANCE ANALYSIS REPORT ===\n\n");

        report.append("LOAD TEST RESULTS:\n");
        for(Map.Entry<String,TestPlanStats> entry : authRes.entrySet()) {
            TestPlanStats stats = entry.getValue();
            var sample = stats.overall().sampleTime();
            double errorRate = (double) stats.overall().errorsCount() / stats.overall().samplesCount() * 100;

            report.append("• ").append(entry.getKey()).append(":\n");
            report.append("  - Avg Response: ").append(sample.mean().toMillis()).append(" ms\n");
            report.append("  - Error Rate: ").append(String.format("%.2f", errorRate)).append("%\n\n");
        }

        report.append("STRESS TEST RESULT:\n");
        if (stressResult.hasBreakingPoint()) {
            report.append("Breaking Point: ").append(stressResult.getBreakingPoint()).append(" users\n");
            report.append("Error Rate: ").append(String.format("%.2f", stressResult.getErrorRate() * 100)).append("%\n");
        } else {
            report.append("No breaking point found (tested up to 2000 users)\n");
        }

        // 3. Recommendations
        report.append("RECOMMENDATIONS:\n");
        report.append("• Optimize database connection pool\n");
        report.append("• Add caching layer for user authentication\n");
        report.append("• Reduce BCrypt rounds if needed\n");

        return report.toString();
    }

    private AuthStressResult runAuthStressTest() throws Exception {
        System.out.println("Running Auth Stress Test to find breaking point...");

        int users = 50;

        while(users <= 2000) {
            TestPlanStats stats = runLoadTest(users, "auth-stress-" + users);
            double errorRate = (double) stats.overall().errorsCount() / stats.overall().samplesCount();

            if(errorRate > 0.05) {
                return new AuthStressResult(users,stats,errorRate);
            }
            users *=2;
        }
        return new AuthStressResult(-1,null,0); // no breaking point
    }


    private Map<String, TestPlanStats> runAllAuthLoadTests() throws Exception {
        Map<String, TestPlanStats> results = new HashMap<>();

        System.out.println("Running Auth Load Tests 100 users...");
        results.put("100-users", runLoadTest(100, "auth-load-100"));
        Thread.sleep(1000);

        System.out.println("Running Auth Load Tests 500 users...");
        results.put("500-users", runLoadTest(500, "auth-load-500"));
        Thread.sleep(1000);


        System.out.println("Running Auth Load Tests 1000 users...");
        results.put("1000-users", runLoadTest(1000, "auth-load-1000"));
        Thread.sleep(1000);

        return results;

    }
}
