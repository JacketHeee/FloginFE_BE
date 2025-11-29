package com.flogin.backend.performance.product;

import static us.abstracta.jmeter.javadsl.JmeterDsl.*;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.apache.http.entity.ContentType;
import org.junit.jupiter.api.Test;

import us.abstracta.jmeter.javadsl.core.TestPlanStats;

public class ProductCrudLoadTest {
        // Cấu hình chung
        private static final String BASE_URL = "https://floqin-backend.onrender.com";
        private static final String PRODUCTS_ENDPOINT = "/api/products";
        private static final String REPORT_FILE = "src/test/java/com/flogin/backend/performance/product/target/performance-report.txt";

        @Test
        public void testProductApiPerformance() throws IOException {
                // Lấy số lượng user từ biến hệ thống (mặc định là 10 nếu không truyền)
                int users = Integer.parseInt(System.getProperty("test.users", "10"));

                // Số lần lặp mỗi thread (mặc định 5 lần)
                int iterations = Integer.parseInt(System.getProperty("test.iterations", "5"));

                System.out.println("=== STARTING PERFORMANCE TEST ===");
                System.out.println("Target Users: " + users);
                System.out.println("Iterations per user: " + iterations);

                TestPlanStats stats = testPlan(
                                // THREAD GROUP: Kịch bản CRUD cho Product API
                                threadGroup(users, iterations,

                                                // 1. GET All Products - Lấy danh sách sản phẩm
                                                httpSampler(BASE_URL + PRODUCTS_ENDPOINT)
                                                                .children(
                                                                                responseAssertion()
                                                                                                .containsSubstrings(
                                                                                                                "\"data\"")),

                                                // 2. GET All Products với pagination
                                                httpSampler(BASE_URL + PRODUCTS_ENDPOINT + "?page=1&limit=10")
                                                                .children(
                                                                                responseAssertion()
                                                                                                .containsSubstrings(
                                                                                                                "\"page\"",
                                                                                                                "\"limit\"",
                                                                                                                "\"total\"")),

                                                // 3. GET All Products với search
                                                httpSampler(BASE_URL + PRODUCTS_ENDPOINT + "?search=laptop")
                                                                .children(
                                                                                responseAssertion()
                                                                                                .containsSubstrings(
                                                                                                                "\"data\"")),

                                                // 4. GET Product by ID (giả sử product ID 1 tồn tại)
                                                httpSampler(BASE_URL + PRODUCTS_ENDPOINT + "/1")
                                                                .children(
                                                                                responseAssertion()
                                                                                                .containsSubstrings(
                                                                                                                "\"id\"",
                                                                                                                "\"name\"",
                                                                                                                "\"price\"")),

                                                // 5. POST Create Product
                                                httpSampler(BASE_URL + PRODUCTS_ENDPOINT)
                                                                .post("{\n" +
                                                                                "  \"name\": \"Test Product ${__threadNum}\",\n"
                                                                                +
                                                                                "  \"price\": 99.99,\n" +
                                                                                "  \"quantity\": 10,\n" +
                                                                                "  \"description\": \"Performance test product\",\n"
                                                                                +
                                                                                "  \"categoryName\": \"Electronics\"\n"
                                                                                +
                                                                                "}", ContentType.APPLICATION_JSON)
                                                                .children(
                                                                                responseAssertion()
                                                                                                .containsSubstrings(
                                                                                                                "\"id\"",
                                                                                                                "\"name\""),
                                                                                // Extract product ID để dùng cho UPDATE
                                                                                // và DELETE
                                                                                regexExtractor("productId",
                                                                                                "\"id\":(\\d+)")
                                                                                                .defaultValue("1")),

                                                // 6. PUT Update Product (sử dụng productId vừa tạo)
                                                httpSampler(BASE_URL + PRODUCTS_ENDPOINT + "/${productId}")
                                                                .method("PUT")
                                                                .body("{\n" +
                                                                                "  \"name\": \"Updated Product ${__threadNum}\",\n"
                                                                                +
                                                                                "  \"price\": 149.99,\n" +
                                                                                "  \"quantity\": 20,\n" +
                                                                                "  \"description\": \"Updated performance test product\",\n"
                                                                                +
                                                                                "  \"categoryName\": \"Electronics\"\n"
                                                                                +
                                                                                "}")
                                                                .contentType(ContentType.APPLICATION_JSON)
                                                                .children(
                                                                                responseAssertion()
                                                                                                .containsSubstrings(
                                                                                                                "\"id\"",
                                                                                                                "\"name\"",
                                                                                                                "Updated")),

                                                // 7. DELETE Product
                                                httpSampler(BASE_URL + PRODUCTS_ENDPOINT + "/${productId}")
                                                                .method("DELETE")
                                                                .children(
                                                                                responseAssertion()
                                                                                                .containsSubstrings(
                                                                                                                "\"id\"")),

                                                // Thêm think time giữa các request (mô phỏng user thực tế)
                                                uniformRandomTimer(Duration.ofMillis(500), Duration.ofMillis(1500))))
                                .run();

                // In kết quả ra console và ghi vào file
                printAndSaveResults(stats, users, iterations);
        }

        /**
         * In kết quả ra console và lưu vào file .txt
         */
        private void printAndSaveResults(TestPlanStats stats, int users, int iterations) {
                StringBuilder report = new StringBuilder();
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

                // Tạo header của báo cáo
                report.append("================================================================================\n");
                report.append("           PRODUCT API PERFORMANCE TEST REPORT\n");
                report.append("================================================================================\n");
                report.append("Test Date: ").append(timestamp).append("\n");
                report.append("Base URL: ").append(BASE_URL).append("\n");
                report.append("Target Users: ").append(users).append("\n");
                report.append("Iterations per user: ").append(iterations).append("\n");
                report.append("Total Requests: ").append(users * iterations * 7)
                                .append(" (7 operations per iteration)\n");
                report.append("================================================================================\n\n");

                // Overall Statistics
                report.append("=== OVERALL TEST RESULTS ===\n");

                long totalSamples = stats.overall().samplesCount();
                long errorCount = stats.overall().errorsCount();
                long successCount = totalSamples - errorCount;
                double errorRate = totalSamples > 0 ? (errorCount * 100.0 / totalSamples) : 0.0;
                double successRate = 100.0 - errorRate;
                long durationMs = stats.duration().toMillis();
                double durationSec = durationMs / 1000.0;
                double throughput = durationSec > 0 ? (totalSamples / durationSec) : 0.0;

                report.append("Total Samples: ").append(totalSamples).append("\n");
                report.append("Success Count: ").append(successCount).append("\n");
                report.append("Error Count: ").append(errorCount).append("\n");
                report.append("Success Rate: ").append(String.format("%.2f", successRate)).append("%\n");
                report.append("Error Rate: ").append(String.format("%.2f", errorRate)).append("%\n\n");

                // Performance Metrics
                report.append("=== PERFORMANCE METRICS ===\n");
                report.append("Total Duration: ").append(durationMs).append(" ms (")
                                .append(String.format("%.2f", durationSec)).append(" seconds)\n");
                report.append("Throughput: ").append(String.format("%.2f", throughput))
                                .append(" requests/second\n");
                report.append("Average Time per Request: ")
                                .append(String.format("%.2f",
                                                totalSamples > 0 ? durationMs / (double) totalSamples : 0))
                                .append(" ms\n");
                report.append("Average Time per User: ")
                                .append(String.format("%.2f", users > 0 ? durationMs / (double) users : 0))
                                .append(" ms\n\n");

                // Detailed Statistics by Endpoint
                report.append("=== DETAILED STATS BY ENDPOINT ===\n");
                int count = 1;
                for (String label : stats.labels()) {
                        var labelStats = stats.byLabel(label);

                        long samples = labelStats.samplesCount();
                        long errors = labelStats.errorsCount();
                        long successes = samples - errors;
                        double labelErrorRate = samples > 0 ? (errors * 100.0 / samples) : 0.0;
                        double labelSuccessRate = 100.0 - labelErrorRate;

                        report.append("\n").append(count++).append(". ").append(label).append("\n");
                        report.append("   Total Samples: ").append(samples).append("\n");
                        report.append("   Successes: ").append(successes).append("\n");
                        report.append("   Errors: ").append(errors).append("\n");
                        report.append("   Success Rate: ").append(String.format("%.2f", labelSuccessRate))
                                        .append("%\n");
                        report.append("   Error Rate: ").append(String.format("%.2f", labelErrorRate)).append("%\n");
                }

                // Summary & Recommendations
                report.append("\n=== SUMMARY & RECOMMENDATIONS ===\n");
                if (errorRate == 0) {
                        report.append("✓ EXCELLENT: All requests successful (0% error rate)\n");
                } else if (errorRate < 1) {
                        report.append("✓ VERY GOOD: Error rate below 1% (").append(String.format("%.2f", errorRate))
                                        .append("%)\n");
                } else if (errorRate < 5) {
                        report.append("⚠ ACCEPTABLE: Error rate is ").append(String.format("%.2f", errorRate))
                                        .append("% (target: < 1%)\n");
                        report.append("  → Review failed requests and improve error handling\n");
                } else {
                        report.append("✗ NEEDS ATTENTION: High error rate at ").append(String.format("%.2f", errorRate))
                                        .append("%\n");
                        report.append("  → Check server logs, database connections, and API validations\n");
                        report.append("  → Verify test data (category exists, valid product IDs)\n");
                }

                if (throughput < 10) {
                        report.append("⚠ LOW THROUGHPUT: ").append(String.format("%.2f", throughput))
                                        .append(" req/s (consider optimization)\n");
                } else if (throughput < 50) {
                        report.append("✓ MODERATE THROUGHPUT: ").append(String.format("%.2f", throughput))
                                        .append(" req/s\n");
                } else {
                        report.append("✓ GOOD THROUGHPUT: ").append(String.format("%.2f", throughput))
                                        .append(" req/s\n");
                }

                String reportText = report.toString();

                // In ra console
                System.out.println("\n" + reportText);

                // Tạo thư mục nếu chưa tồn tại
                File reportFile = new File(REPORT_FILE);
                File parentDir = reportFile.getParentFile();
                if (parentDir != null && !parentDir.exists()) {
                        parentDir.mkdirs();
                        System.out.println("Created directory: " + parentDir.getAbsolutePath());
                }

                // Ghi vào file
                try (PrintWriter writer = new PrintWriter(new FileWriter(reportFile))) {
                        writer.println(reportText);
                        System.out.println("\n✓ Performance report successfully saved to: "
                                        + reportFile.getAbsolutePath());
                } catch (IOException e) {
                        System.err.println("✗ Error writing report to file: " + e.getMessage());
                        e.printStackTrace();
                }
        }
}
