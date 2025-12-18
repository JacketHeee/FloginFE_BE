# Deployment Guide

## Environment Variables Configuration

### For Render.com Deployment

You need to configure the following environment variables in your Render.com dashboard:

1. **DATABASE_URL** (Required)
   - Format: `jdbc:postgresql://<hostname>:5432/<database_name>?sslmode=require`
   - Example: `jdbc:postgresql://dpg-d51joaggjchc73elqj20-a.oregon-postgres.render.com:5432/backend_db_01n2?sslmode=require`
   - Note: Render provides this in the database dashboard. Make sure to use the **External Connection URL** with JDBC format.

2. **SPRING_DATASOURCE_USERNAME** (Required)
   - Your PostgreSQL username
   - Get this from Render.com database dashboard

3. **SPRING_DATASOURCE_PASSWORD** (Required)
   - Your PostgreSQL password
   - Get this from Render.com database dashboard

4. **JWT_SECRET_KEY_BASE64** (Required)
   - Your JWT secret key
   - Example: `============NguyenHungManh-HoHoangLong-BuiNguyenTrongNghia-LuuPhungKhaiNguyen-NguyenHoangAnh============`

5. **JWT_EXPIRATION_MINUTES** (Optional, default: 60)
   - JWT token expiration time in minutes

6. **PORT** (Automatically set by Render to 10000)
   - Don't manually set this - Render sets it automatically

### Important Notes for Render.com

1. **Database Hostname**: The error you're seeing (`dpg-d49k9395pdvs73cvfn90-a`) suggests you're using an internal hostname. You need to use the **full external hostname** that includes the region and domain suffix.

   ✅ Correct: `dpg-d51joaggjchc73elqj20-a.oregon-postgres.render.com`
   ❌ Wrong: `dpg-d49k9395pdvs73cvfn90-a`

2. **Connection String Format**: Make sure your DATABASE_URL follows this format:
   ```
   jdbc:postgresql://<HOST>:<PORT>/<DATABASE>?sslmode=require
   ```

3. **Getting the correct values from Render**:
   - Go to your PostgreSQL database on Render.com dashboard
   - Look for "External Database URL" 
   - It will look like: `postgres://user:password@hostname:port/database`
   - Convert it to JDBC format: `jdbc:postgresql://hostname:port/database?sslmode=require`
   - Set username and password separately as SPRING_DATASOURCE_USERNAME and SPRING_DATASOURCE_PASSWORD

### How to Set Environment Variables on Render.com

1. Go to your service dashboard on Render.com
2. Click on "Environment" in the left sidebar
3. Add each environment variable with its value
4. Click "Save Changes"
5. Render will automatically redeploy your service

## Local Development

For local development, the `.env` file will be used. Make sure it contains all necessary variables.

## Docker Compose

To run locally with Docker Compose:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:8083`

## Troubleshooting

### Connection Issues
- Verify all environment variables are set correctly in Render.com
- Check that the database hostname is the full external URL
- Ensure `sslmode=require` is included in the DATABASE_URL
- Verify the database is in the same region or accessible from your web service

### Port Issues
- Render automatically sets PORT=10000
- Make sure your application listens on the PORT environment variable
- Don't hardcode port 8080 or 8081 in production

