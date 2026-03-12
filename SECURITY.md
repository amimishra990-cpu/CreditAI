# CreditAI Security Architecture

## Overview

CreditAI implements enterprise-grade security measures suitable for financial applications handling sensitive credit appraisal data.

## Security Features

### 1. Authentication & Authorization

#### JWT-Based Authentication
- Secure token-based authentication using JSON Web Tokens
- Tokens expire after 8 hours (configurable)
- Tokens include user ID, email, role, and organization

#### Role-Based Access Control (RBAC)
- **Admin**: Full system access, can view all workspaces
- **Analyst**: Can create and manage workspaces within their organization
- **Viewer**: Read-only access to workspaces in their organization

#### Account Security
- Passwords hashed using bcrypt with 12 salt rounds
- Minimum password requirements: 8 characters, uppercase, lowercase, number, special character
- Account lockout after 5 failed login attempts (2-hour lockout)
- Failed login attempt tracking

### 2. Data Protection

#### Encryption
- Passwords encrypted at rest using bcrypt
- JWT tokens signed with secret key
- HTTPS recommended for production (TLS/SSL)

#### Data Isolation
- Multi-tenant architecture with organization-level isolation
- Users can only access workspaces within their organization
- Workspace ownership tracking

#### Sensitive Data Handling
- PII (Personally Identifiable Information) sanitized in logs
- Passwords, tokens, API keys redacted from audit logs
- File uploads validated and size-limited

### 3. API Security

#### Rate Limiting
- General API: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 attempts per 15 minutes per IP
- File uploads: 50 uploads per hour per IP

#### Input Validation & Sanitization
- All inputs sanitized to prevent XSS attacks
- SQL/NoSQL injection prevention
- Content-type validation
- File type and size validation

#### Security Headers (Helmet.js)
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

#### CORS Configuration
- Restricted to specific frontend origin
- Credentials support enabled
- Limited HTTP methods

### 4. Audit Logging

#### Comprehensive Audit Trail
- All API requests logged with:
  - User ID and email
  - Action performed
  - Resource accessed
  - IP address and user agent
  - Timestamp
  - Success/failure status
  - Request metadata (sanitized)

#### Audit Log Use Cases
- Security incident investigation
- Compliance reporting
- User activity monitoring
- Anomaly detection

### 5. File Upload Security

#### Upload Restrictions
- Allowed file types: PDF, PNG, JPG, JPEG, XLSX, XLS, CSV, DOC, DOCX
- Maximum file size: 50MB
- Files stored with unique names
- Upload rate limiting

#### File Storage
- Files stored outside web root
- Unique filename generation
- Path traversal prevention

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - User registration (rate-limited)
- `POST /api/auth/login` - User login (rate-limited)

### Protected Endpoints (Require Authentication)
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout (audit only)
- `POST /api/onboard` - Create workspace
- `GET /api/workspaces` - List workspaces (filtered by organization)
- `GET /api/workspace/:id` - Get workspace (access control)
- `DELETE /api/workspace/:id` - Delete workspace (owner/admin only)
- `POST /api/upload` - Upload documents
- `POST /api/classify` - Classify documents
- `POST /api/analyze` - Run analysis
- `POST /api/orchestrate` - Generate decision
- `POST /api/report` - Generate report
- `POST /api/early-warning` - Get risk alerts

## Environment Variables

### Required
```env
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
MONGO_URI=mongodb://localhost:27017/creditai
```

### Optional
```env
PORT=5001
JWT_EXPIRES_IN=8h
FRONTEND_URL=http://localhost:3000
```

## Security Best Practices

### For Production Deployment

1. **Environment Variables**
   - Use strong, random JWT_SECRET (min 32 characters)
   - Never commit .env files to version control
   - Use environment-specific configurations

2. **HTTPS/TLS**
   - Always use HTTPS in production
   - Obtain valid SSL certificates
   - Enable HSTS headers

3. **Database Security**
   - Use MongoDB authentication
   - Enable MongoDB encryption at rest
   - Regular database backups
   - Network isolation for database

4. **API Keys**
   - Rotate Groq API keys regularly
   - Monitor API usage
   - Set up usage alerts

5. **Monitoring & Logging**
   - Monitor audit logs for suspicious activity
   - Set up alerts for failed login attempts
   - Regular security audits
   - Log retention policy

6. **Access Control**
   - Principle of least privilege
   - Regular access reviews
   - Disable inactive accounts
   - Strong password policy enforcement

7. **Network Security**
   - Use firewall rules
   - Restrict database access
   - VPN for administrative access
   - DDoS protection

8. **Application Security**
   - Keep dependencies updated
   - Regular security patches
   - Vulnerability scanning
   - Penetration testing

## Compliance Considerations

### Data Privacy
- GDPR compliance for EU users
- Data retention policies
- Right to deletion
- Data export capabilities

### Financial Regulations
- SOC 2 compliance considerations
- PCI DSS if handling payment data
- Industry-specific regulations (banking, finance)

### Audit Requirements
- Comprehensive audit trails
- Tamper-proof logging
- Log retention (typically 7 years for financial data)
- Regular compliance audits

## Incident Response

### Security Incident Procedure
1. Detect and identify the incident
2. Contain the threat
3. Investigate using audit logs
4. Remediate vulnerabilities
5. Document and report
6. Review and improve

### Common Incidents
- Unauthorized access attempts
- Data breaches
- API abuse
- Account compromise

## Security Checklist

### Before Going Live
- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure production CORS settings
- [ ] Set up monitoring and alerting
- [ ] Enable database authentication
- [ ] Review and test backup procedures
- [ ] Conduct security audit
- [ ] Set up log aggregation
- [ ] Configure rate limiting appropriately
- [ ] Test disaster recovery procedures
- [ ] Document security procedures
- [ ] Train team on security practices

### Regular Maintenance
- [ ] Review audit logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate API keys quarterly
- [ ] Security audit annually
- [ ] Review access permissions quarterly
- [ ] Test backups monthly
- [ ] Update security documentation

## Contact

For security concerns or to report vulnerabilities, please contact your security team immediately.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [PCI DSS](https://www.pcisecuritystandards.org/)
- [GDPR](https://gdpr.eu/)
