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
    private static String BASE_URL = "http://localhost:8081/api/auth/login";

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
        double throughput = total / (duration.toMillis() / 1000.0);//số lượng request thành công trong 1 giây

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

    protected String buildReportBreakPoint(int users,String testName, TestPlanStats stats) {
        if (stats.overall().errorsCount() > 0) {
            return """
                    ==============================================
                    Performance Test: %s
                    ----------------------------------------------
                    Breaking point reached at: %d users!
                    Total Errors: %d
                    ==============================================
                    
                    """.formatted(testName, users, stats.overall().errorsCount());
        } else {
            return """
                    ==============================================
                    Performance Test: %s
                    ----------------------------------------------
                    Non Breaking point reached at: %d users
                    ==============================================
                    
                    """.formatted(testName, users);
        }
    }
}
