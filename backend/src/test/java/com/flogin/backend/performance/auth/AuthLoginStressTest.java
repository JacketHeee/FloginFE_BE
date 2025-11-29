package com.flogin.backend.performance.auth;

import org.junit.jupiter.api.Test;

import us.abstracta.jmeter.javadsl.core.TestPlanStats;

public class AuthLoginStressTest extends AuthPerformanceBaseTest{
    
    private void RunTestAndReport(int[] usersArray, String testName) throws Exception{

       for (int users : usersArray) {
                TestPlanStats stats = runLoadTest(users, testName);

                String report = buildReportBreakPoint(users, testName, stats);

                System.out.println(report);           // in ra terminal
                writeReport(testName + "-users" + users, report);

                 if (stats.overall().errorsCount() > 0) {
                    System.out.println("Breaking point reached at " + users + " users. Stopping further tests.");
                    break;
        }
        
       }
    }

    @Test
    void stressTestLogin() throws Exception {
        int[] usersArray = {100, 200, 500, 1000, 2000};
        RunTestAndReport(usersArray, "stress-test-login");
    }


}
