# Product API Performance Tests - JMeter Java DSL

## Overview
This performance test suite uses **JMeter Java DSL** to test all CRUD operations of the Product API.

## Test Scenarios

The test covers 7 main scenarios:

1. **GET All Products** - Retrieve all products
2. **GET Products with Pagination** - Test pagination (page=1, limit=10)
3. **GET Products with Search** - Search products by keyword
4. **GET Product by ID** - Retrieve a single product
5. **POST Create Product** - Create a new product
6. **PUT Update Product** - Update an existing product
7. **DELETE Product** - Delete a product

## How to Run

### Basic Run (Default: 10 users, 5 iterations each)
```bash
cd backend
mvn clean test -Dtest=ProductCrudLoadTest
```

### Custom Configuration

#### Specify number of users
```bash
mvn clean test -Dtest=ProductCrudLoadTest -Dtest.users=50
```

#### Specify number of iterations per user
```bash
mvn clean test -Dtest=ProductCrudLoadTest -Dtest.iterations=10
```

#### Combined (50 users, 10 iterations each = 500 total requests)
```bash
mvn clean test -Dtest=ProductCrudLoadTest -Dtest.users=50 -Dtest.iterations=10
```

## Prerequisites

### 1. Start the Backend Server
Make sure your Spring Boot backend is running:
```bash
cd backend
mvn spring-boot:run
```

The API should be accessible at: `http://localhost:8080`

### 2. Database Setup
Ensure you have:
- Database running (PostgreSQL/MySQL)
- At least one category named "Electronics" in the database
- At least one product with ID=1 for GET by ID test

### Sample Data Setup (Optional)
```sql
-- Create Electronics category if not exists
INSERT INTO categories (name, description) 
VALUES ('Electronics', 'Electronic products')
ON CONFLICT DO NOTHING;

-- Create a sample product
INSERT INTO products (name, price, quantity, description, category_id)
VALUES ('Sample Laptop', 1500.00, 10, 'Test product', 
        (SELECT id FROM categories WHERE name = 'Electronics'));
```

## Test Reports

After running the test, reports will be generated in:

### 1. JTL Results (Raw Data)
```
backend/target/jmeter-results/product-crud-test.jtl
```

### 2. HTML Dashboard Report
```
backend/target/jmeter-report/product-crud/index.html
```

Open the HTML report in your browser to view:
- Response time graphs
- Throughput statistics
- Error rate
- Percentile graphs (50th, 90th, 95th, 99th)

### 3. Console Output
The test automatically prints summary statistics to console:
```
=== TEST RESULTS ===
Total Samples: 70
Error Count: 0
Error %: 0.00%
Mean Response Time: 45ms
Median Response Time: 38ms
90th Percentile: 89ms
95th Percentile: 102ms
99th Percentile: 145ms

=== DETAILED STATS BY ENDPOINT ===
GET All Products:
  Samples: 10
  Errors: 0
  Mean: 52ms
  Median: 48ms
...
```

## Performance Metrics

The test measures:
- **Response Time**: How long each request takes
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests
- **Percentiles**: 50th, 90th, 95th, 99th percentiles
- **Per-endpoint statistics**: Individual metrics for each API call

## Test Configuration

### Thread Configuration
- **Ramp-up**: Gradual (not immediate spike)
- **Think Time**: Random delay between 500ms - 1500ms (simulates real user behavior)
- **Assertions**: Each request validates response contains expected data

### HTTP Configuration
- **Base URL**: http://localhost:8080
- **Headers**: 
  - Content-Type: application/json
  - Accept: application/json
- **Encoding**: UTF-8

## Advanced Features

### Variable Extraction
The test extracts the product ID from CREATE response and uses it in UPDATE and DELETE:
```java
regexExtractor("productId", "\"id\":(\\d+)")
```

### Dynamic Data
Uses JMeter variables for unique test data:
```java
"name": "Test Product ${__threadNum}"  // Each thread gets unique product name
```

## Troubleshooting

### Error: Connection refused
- **Solution**: Make sure backend server is running on port 8080

### Error: Category not found
- **Solution**: Create "Electronics" category in database

### Error: Product ID not found
- **Solution**: Ensure at least one product exists with ID=1

### High error rate
- **Solution**: 
  - Reduce number of users or iterations
  - Check database connection pool size
  - Monitor server resources (CPU, memory)

## Best Practices

1. **Start small**: Begin with 5-10 users to establish baseline
2. **Incremental load**: Gradually increase users (10 → 25 → 50 → 100)
3. **Monitor resources**: Watch server CPU, memory, and database connections
4. **Clean data**: Delete test products after each run to avoid data pollution
5. **Consistent environment**: Run tests on same hardware/network for comparison

## Integration with CI/CD

### Maven Profile (Optional)
Add to `pom.xml`:
```xml
<profile>
    <id>performance</id>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <includes>
                        <include>**/*LoadTest.java</include>
                    </includes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</profile>
```

Then run:
```bash
mvn test -Pperformance
```

## Expected Results

### Good Performance
- Mean response time < 100ms
- 95th percentile < 200ms
- Error rate = 0%
- Throughput > 100 req/sec (for 10 concurrent users)

### Warning Signs
- Mean response time > 500ms
- Error rate > 1%
- Increasing response time with more users
- Memory leaks or connection pool exhaustion

## Next Steps

1. **Stress Testing**: Gradually increase users to find breaking point
2. **Soak Testing**: Run for extended period (30+ minutes) to detect memory leaks
3. **Spike Testing**: Sudden increase in load to test auto-scaling
4. **API Specific Tests**: Create separate tests for each endpoint with different scenarios
