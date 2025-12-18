package com.flogin.backend.performance.analysis;

import lombok.Data;
import us.abstracta.jmeter.javadsl.core.TestPlanStats;

@Data
public class AuthStressResult {
    private final int breakingPoint;
    private final TestPlanStats starts;
    private final double errorRate;

    public AuthStressResult(int breakingPoint, TestPlanStats starts, double errorRate) {
        this.breakingPoint = breakingPoint;
        this.starts = starts;
        this.errorRate = errorRate;
    }

    public boolean hasBreakingPoint() {
        return breakingPoint > 0;
    }

    @Override
    public String toString() {
        return String.format("AuthStressResult{breakingPoint=%d, errorRate=%.2f%%}",
                breakingPoint, errorRate * 100);
    }
}
