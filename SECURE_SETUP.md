# Secure Setup Guide for CreditAI

## Initial Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_from_console.groq.com

# Server Configuration
PORT=5001

# Database Configuration
MONGO_URI=mongodb://localhost:27017/creditai

# JWT Configuration (IMPORTANT: Change in production!)
JWT_SECRET=generate-a-strong-random-secret-min-32-characters-use-openssl-rand-base64-32
JWT_EXPIRES_IN=8h

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```bash
cd frontend
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

### 3. Generate Secure JWT Secret

```bash
# On macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and use it as your `JWT_SECRET` in `backend/.env`.

### 4. Start MongoDB

#### Option A: Local MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Or manually
mongod --dbpath /usr/local/var/mongodb
```

#### Option B: Docker
```bash
docker run -d \
  --name creditai-mongodb \
  -p 27017:27017 \
  -v creditai-data:/data/db \
  mongo:latest
```

#### Option C: MongoDB Atlas (Cloud)
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in `backend/.env`

### 5. Create First Admin User

```bash
cd backend
npm run create-admin
```

Follow the prompts:
- Email: admin@yourcompany.com
- Password: (min 8 chars, must include uppercase, lowercase, number, special character)
- Full Name: Admin User
- Organization: Your Company Name

Example strong password: `Admin@2024!Secure`

### 6. Start the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 CreditAI Backend running on http://localhost:5001
🔒 Security features enabled
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:3000

## First Login

1. Navigate to http://localhost:3000
2. Click "Login" or go to `/login`
3. Enter the admin credentials you created
4. You'll receive a JWT token valid for 8 hours

## Creating Additional Users

### Via API (Admin Only)

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "email": "analyst@company.com",
    "password": "Analyst@2024!",
    "name": "John Analyst",
    "organization": "Your Company Name",
    "role": "analyst"
  }'
```

### User Roles

- **admin**: Full access, can manage all workspaces
- **analyst**: Can create and manage workspaces in their organization
- **viewer**: Read-only access to workspaces in their organization

## Security Verification

### 1. Test Authentication

```bash
# Should fail without token
curl http://localhost:5001/api/workspaces

# Should succeed with token
curl http://localhost:5001/api/workspaces \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Test Rate Limiting

```bash
# Try logging in 6 times with wrong password
# Should get locked after 5 attempts
for i in {1..6}; do
  curl -X POST http://localhost:5001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo "\nAttempt $i"
done
```

### 3. Check Security Headers

```bash
curl -I http://localhost:5001/api/health
```

Should see headers like:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Strict-Transport-Security`

### 4. Verify Audit Logging

Check MongoDB for audit logs:
```bash
mongosh creditai
db.auditlogs.find().limit(5).pretty()
```

## Production Deployment Checklist

### Before Deploying

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Enable HTTPS/TLS
- [ ] Use production MongoDB with authentication
- [ ] Set up MongoDB backups
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Review and adjust rate limits
- [ ] Enable MongoDB encryption at rest
- [ ] Set up log aggregation
- [ ] Configure CDN for static assets
- [ ] Set up DDoS protection
- [ ] Review CORS settings
- [ ] Enable database connection pooling
- [ ] Set up health check monitoring
- [ ] Configure auto-scaling if needed

### Environment-Specific Settings

#### Development
```env
NODE_ENV=development
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

#### Production
```env
NODE_ENV=production
JWT_EXPIRES_IN=8h
FRONTEND_URL=https://your-domain.com
```

## Troubleshooting

### Cannot Create Admin User

**Error**: "Password does not meet requirements"
- Ensure password has: uppercase, lowercase, number, special character
- Minimum 8 characters

**Error**: "User already exists"
- Check MongoDB: `db.users.find({email: "admin@company.com"})`
- Delete if needed: `db.users.deleteOne({email: "admin@company.com"})`

### Authentication Fails

**Error**: "Invalid or expired token"
- Token may have expired (default 8 hours)
- Login again to get new token

**Error**: "Account locked"
- Wait 2 hours or reset in MongoDB:
```javascript
db.users.updateOne(
  {email: "user@company.com"},
  {$set: {failedLoginAttempts: 0}, $unset: {lockUntil: 1}}
)
```

### Rate Limiting Issues

**Error**: "Too many requests"
- Wait 15 minutes
- Or adjust limits in `backend/src/middleware/security.ts`

### CORS Errors

**Error**: "CORS policy blocked"
- Verify `FRONTEND_URL` in backend `.env`
- Check frontend is running on correct port
- Clear browser cache

## Monitoring

### Check Application Health

```bash
curl http://localhost:5001/api/health
```

### Monitor Audit Logs

```javascript
// Recent failed logins
db.auditlogs.find({
  action: "login",
  status: "failure"
}).sort({timestamp: -1}).limit(10)

// Recent workspace access
db.auditlogs.find({
  resource: "workspace"
}).sort({timestamp: -1}).limit(10)
```

### Check Active Users

```javascript
db.users.find({isActive: true}).count()
```

### Monitor Failed Login Attempts

```javascript
db.users.find({
  failedLoginAttempts: {$gt: 0}
})
```

## Backup & Recovery

### Backup MongoDB

```bash
# Create backup
mongodump --db creditai --out /path/to/backup

# Restore backup
mongorestore --db creditai /path/to/backup/creditai
```

### Automated Backups

Set up cron job:
```bash
# Daily backup at 2 AM
0 2 * * * mongodump --db creditai --out /backups/$(date +\%Y\%m\%d)
```

## Security Maintenance

### Weekly Tasks
- Review audit logs for suspicious activity
- Check for failed login attempts
- Monitor API usage patterns

### Monthly Tasks
- Update npm dependencies
- Review user access permissions
- Test backup restoration
- Check disk space and logs

### Quarterly Tasks
- Rotate API keys
- Review and update security policies
- Conduct security audit
- Update documentation

### Annual Tasks
- Comprehensive security audit
- Penetration testing
- Compliance review
- Disaster recovery drill

## Support

For security issues or questions:
1. Check SECURITY.md documentation
2. Review audit logs
3. Contact your security team
4. Never share credentials or tokens

## Additional Resources

- [SECURITY.md](./SECURITY.md) - Detailed security architecture
- [SETUP.md](./SETUP.md) - General setup guide
- [MIGRATION.md](./MIGRATION.md) - Groq migration guide
- [README.md](./README.md) - Project overview
