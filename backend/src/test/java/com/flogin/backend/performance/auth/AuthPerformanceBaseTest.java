package com.flogin.backend.performance.auth;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.apache.http.entity.ContentType;

import static us.abstracta.jmeter.javadsl.JmeterDsl.httpSampler;
import static us.abstracta.jmeter.javadsl.JmeterDsl.testPlan;
import static us.abstracta.jmeter.javadsl.JmeterDsl.threadGroup;
import us.abstracta.jmeter.javadsl.core.TestPlanStats;

public class AuthPerformanceBaseTest {
     //URL của API mà bạn muốn test  
    private static String BASE_URL = "https://floqin-backend.onrender.com/api/auth/login";

    //nội dung JSON sẽ gửi trong POST request
    private static final String LOGIN_PAYLOAD = """
            {
              "username": "jackethee",
              "password": "admin123"
            }
            """;

     //users: số lượng user ảo (thread) sẽ đồng thời gửi request đến server
    //testname: tên test dùng để in log, ví dụ "load-100"
    protected TestPlanStats runLoadTest(int users, String testname) throws Exception{
       return testPlan(
            //thời gian để tất cả user khởi động.vd: trong N s, các user sẽ bắt đầu dần dần.
            threadGroup(users, 3, httpSampler(BASE_URL) 
            .post(LOGIN_PAYLOAD, ContentType.APPLICATION_JSON)
    )).run();//chạy trả về TestPlanStats stats, chứa tất cả thống kê của test (số request, lỗi, thời gian, ...)
    }

    protected void writeReport(String testName, String content) throws Exception {
        // Lấy thời gian hiện tại
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
        String timestamp = now.format(formatter);

        Path path = Path.of("src/test/java/com/flogin/backend/performance/auth/reports/" 
                        + timestamp + " " + testName + ".txt");
        Files.createDirectories(path.getParent());     // tạo thư mục nếu chưa có
        Files.writeString(path, content);              // ghi kết quả
    }

    protected String buildReport(String testName, TestPlanStats stats) {

        long total = stats.overall().samplesCount(); // tổng số request gửi đi
        long errors = stats.overall().errorsCount();// tổng số request lỗi

        Duration duration = Duration.between(stats.overall().firstTime(), stats.overall().endTime());//tính tổng thời gian chạy test
        double throughput = (total - errors) / (duration.toMillis() / 1000.0);//số lượng request thành công trong 1 giây

        var sample = stats.overall().sampleTime();  //trả về thống kê thời gian xử lý

        // min rq nhanh nhat, max rq cham nhat, avg trung binh xu ly rq , p99 so rq duoi tgian
        long min = sample.min().toMillis();  
        long max = sample.max().toMillis(); 
        long p99 = sample.perc99().toMillis();
        double avg = sample.mean().toMillis();

        return """
==============================================
Performance Test: %s
----------------------------------------------
Total Samples : %d
Errors        : %d
Test Duration : %d ms
Throughput    : %.2f req/s

Min Response  : %d ms
Max Response  : %d ms
Avg Response  : %.2f ms
P99 Response  : %d ms
==============================================

                """.formatted(
                testName, total, errors, duration.toMillis(),
                throughput, min, max, avg, p99
        );
    }

    protected String buildReportBreakPoint(int users, String testName, TestPlanStats stats, 
                                          int lastStableUsers, double lastStableErrorRate, long lastStableP99) {
        long total = stats.overall().samplesCount();
        long errors = stats.overall().errorsCount();
        double errorRate = (errors * 100.0) / total;
        
        Duration duration = Duration.between(stats.overall().firstTime(), stats.overall().endTime());
        double throughput = (total - errors) / (duration.toMillis() / 1000.0);
        
        var sample = stats.overall().sampleTime();
        long min = sample.min().toMillis();
        long max = sample.max().toMillis();
        long p90 = sample.perc90().toMillis();
        long p95 = sample.perc95().toMillis();
        long p99 = sample.perc99().toMillis();
        double avg = sample.mean().toMillis();
        
        StringBuilder report = new StringBuilder();
        report.append("=".repeat(80)).append("\n");
        report.append(String.format("%-30s: %s\n", "Performance Test", testName));
        report.append("-".repeat(80)).append("\n");
        
        // Test Configuration
        report.append(String.format("%-30s: %d users\n", "Concurrent Users", users));
        report.append(String.format("%-30s: %d iterations per user\n", "Iterations", 3));
        report.append(String.format("%-30s: %s\n", "Target URL", BASE_URL));
        report.append("\n");
        
        // Test Thresholds
        report.append("TEST THRESHOLDS\n");
        report.append("-".repeat(80)).append("\n");
        report.append(String.format("%-30s: 5000 ms\n", "Response Time Threshold (P99)"));
        report.append(String.format("%-30s: 5.0%%\n", "Error Rate Threshold"));
        report.append("\n");
        
        // Overall Statistics
        report.append("OVERALL STATISTICS\n");
        report.append("-".repeat(80)).append("\n");
        report.append(String.format("%-30s: %d\n", "Total Requests", total));
        report.append(String.format("%-30s: %d (%.2f%%)\n", "Total Errors", errors, errorRate));
        report.append(String.format("%-30s: %d (%.2f%%)\n", "Successful Requests", (total - errors), (100 - errorRate)));
        report.append(String.format("%-30s: %d ms (%.2f seconds)\n", "Test Duration", duration.toMillis(), duration.toMillis() / 1000.0));
        report.append(String.format("%-30s: %.2f requests/second\n", "Throughput", throughput));
        report.append("\n");
        
        // Response Time Statistics
        report.append("RESPONSE TIME STATISTICS\n");
        report.append("-".repeat(80)).append("\n");
        report.append(String.format("%-30s: %d ms\n", "Minimum Response Time", min));
        report.append(String.format("%-30s: %.2f ms\n", "Average Response Time", avg));
        report.append(String.format("%-30s: %d ms\n", "90th Percentile", p90));
        report.append(String.format("%-30s: %d ms\n", "95th Percentile", p95));
        report.append(String.format("%-30s: %d ms\n", "99th Percentile", p99));
        report.append(String.format("%-30s: %d ms\n", "Maximum Response Time", max));
        report.append("\n");
        
        // Breaking Point Analysis
        report.append("BREAKING POINT ANALYSIS\n");
        report.append("-".repeat(80)).append("\n");
        
        if (errors > 0) {
            report.append(String.format("⚠️  STATUS: BREAKING POINT DETECTED\n"));
            report.append(String.format("    Breaking Point At: %d concurrent users\n", users));
            report.append(String.format("    Error Rate: %.2f%% (%d/%d requests failed)\n", errorRate, errors, total));
            
            if (errorRate >= 50) {
                report.append("    Severity: CRITICAL - System is severely unstable\n");
            } else if (errorRate >= 10) {
                report.append("    Severity: HIGH - System is experiencing significant issues\n");
            } else if (errorRate >= 5) {
                report.append("    Severity: MODERATE - System is starting to degrade\n");
            } else {
                report.append("    Severity: LOW - Minor degradation detected\n");
            }
            
            // Comparison with Last Stable Level
            if (lastStableUsers > 0) {
                report.append("\n");
                report.append("COMPARISON WITH LAST STABLE LEVEL\n");
                report.append("-".repeat(80)).append("\n");
                report.append(String.format("%-30s: %d users\n", "Last Stable Level", lastStableUsers));
                report.append(String.format("%-30s: %d users\n", "Breaking Point", users));
                report.append(String.format("%-30s: %d users\n", "Difference", (users - lastStableUsers)));
                report.append("\n");
                report.append(String.format("%-30s: %.2f%% → %.2f%% (+%.2f%%)\n", 
                    "Error Rate Change", lastStableErrorRate, errorRate, (errorRate - lastStableErrorRate)));
                report.append(String.format("%-30s: %d ms → %d ms (+%d ms)\n", 
                    "P99 Response Time Change", lastStableP99, p99, (p99 - lastStableP99)));
            }
        } else {
            report.append(String.format("✅ STATUS: SYSTEM STABLE\n"));
            report.append(String.format("    Test Level: %d concurrent users\n", users));
            report.append(String.format("    Error Rate: 0.00%% (No errors detected)\n"));
            report.append(String.format("    System Performance: Acceptable\n"));
        }
        
        // Performance Indicators
        report.append("\n");
        report.append("PERFORMANCE INDICATORS\n");
        report.append("-".repeat(80)).append("\n");
        
        // Response Time Assessment
        if (p99 < 1000) {
            report.append(String.format("%-30s: ✅ EXCELLENT (< 1s)\n", "Response Time (P99)"));
        } else if (p99 < 3000) {
            report.append(String.format("%-30s: ✓  GOOD (1-3s)\n", "Response Time (P99)"));
        } else if (p99 < 5000) {
            report.append(String.format("%-30s: ⚠️  ACCEPTABLE (3-5s)\n", "Response Time (P99)"));
        } else {
            report.append(String.format("%-30s: ❌ POOR (> 5s)\n", "Response Time (P99)"));
        }
        
        // Throughput Assessment
        if (throughput > 100) {
            report.append(String.format("%-30s: ✅ EXCELLENT (> 100 req/s)\n", "Throughput"));
        } else if (throughput > 50) {
            report.append(String.format("%-30s: ✓  GOOD (50-100 req/s)\n", "Throughput"));
        } else if (throughput > 10) {
            report.append(String.format("%-30s: ⚠️  ACCEPTABLE (10-50 req/s)\n", "Throughput"));
        } else {
            report.append(String.format("%-30s: ❌ POOR (< 10 req/s)\n", "Throughput"));
        }
        
        // Error Rate Assessment
        if (errorRate == 0) {
            report.append(String.format("%-30s: ✅ EXCELLENT (0%%)\n", "Error Rate"));
        } else if (errorRate < 1) {
            report.append(String.format("%-30s: ✓  GOOD (< 1%%)\n", "Error Rate"));
        } else if (errorRate < 5) {
            report.append(String.format("%-30s: ⚠️  ACCEPTABLE (1-5%%)\n", "Error Rate"));
        } else {
            report.append(String.format("%-30s: ❌ POOR (> 5%%)\n", "Error Rate"));
        }

        // Performance Indicators
        report.append("\n");
        report.append("RECOMMENDATIONS\n");
        report.append("-".repeat(80)).append("\n");

        if (errorRate >= 5 || p99 > 5000) {
            report.append("• Optimize database connection pool.\n");
            report.append("• Add caching layer for user authentication.\n");
            report.append("• Reduce BCrypt rounds if needed.\n");
        } else {
            report.append("• System is performing well under current load.\n");
            report.append("• Continue monitoring performance metrics regularly.\n");
        }
        
        report.append("=".repeat(80)).append("\n");
        report.append(String.format("Generated at: %s\n", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))));
        report.append("=".repeat(80)).append("\n");
        
        return report.toString();
    }
}
