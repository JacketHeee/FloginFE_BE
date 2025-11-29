package com.flogin.backend.performance.auth;

import org.junit.jupiter.api.Test;

import us.abstracta.jmeter.javadsl.core.TestPlanStats;

public class AuthLoginLoadTest extends AuthPerformanceBaseTest {
   
        private void RunTestAndReport(int users, String testName) throws Exception{

        TestPlanStats stats = runLoadTest(users, testName);
            
        String report = buildReport(testName, stats);

        System.out.println(report);           // in ra terminal
        writeReport(testName, report);        // ghi ra file

    }

    @Test
    void loadTestLogin10() throws Exception {
        RunTestAndReport(10, "load-10");
    }
        
    @Test
    void loadTestLogin100() throws Exception {
        RunTestAndReport(100, "load-100");
    }

    @Test
    void loadTestLogin500() throws Exception {
        RunTestAndReport(500, "load-500");
    }

    @Test
    void loadTestLogin1000() throws Exception {
        RunTestAndReport(1000, "load-1000");
    }


}
