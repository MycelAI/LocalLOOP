# Security Policy

## 🔐 Reporting Security Vulnerabilities

The LOOP team takes security seriously. We appreciate your efforts to responsibly disclose your findings.

LOOP is an early-stage (low TRL) protocol with a lab demo only; there are no public pilots or deployments. This policy covers the LOOP specification, schemas, JSON-LD contexts and `openapi.json`, as well as the localLOOP lab services at `https://loop.urbnia.com` and `https://loop.urbnia.com/api/`.

### Where to Report

**DO NOT** create public GitHub issues for security vulnerabilities.

Please report security vulnerabilities by emailing:
- **dev@mycel-ai.de** (GitHub: @alpha912)

### What to Include

Your report should include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Resolution Target**: 30-90 days depending on severity

These targets come from a single maintainer and are best effort. We follow coordinated disclosure: please give us a reasonable chance to fix an issue before publishing details, and we will agree on a disclosure date with you.

### Supported Versions

Only the latest protocol release (0.6.0) and the lab services at `https://loop.urbnia.com` receive security fixes. The archived `github.com/local-loop-io/*` repositories are read-only and do not receive fixes; if an issue there also affects the current protocol, report it as described above.

## 🛡️ Security Considerations

The requirements below describe the target security posture for LOOP node operators. They are not a statement that the lab reference backend meets all of them; its implementation status is tracked in `apps/backend/docs/SPEC-COMPLIANCE.md` in the localLOOP repository.

### Node Security

#### Transport Layer
- ✅ **REQUIRED**: TLS 1.3 or higher for all connections
- ✅ **REQUIRED**: Valid SSL certificates (no self-signed in production)
- ✅ **REQUIRED**: Perfect Forward Secrecy
- ✅ **REQUIRED**: HSTS headers with minimum 1-year duration

#### Authentication & Authorization
- ✅ **REQUIRED**: OAuth 2.0 / OpenID Connect for user authentication
- ✅ **REQUIRED**: Mutual TLS or signed requests for node-to-node
- ✅ **REQUIRED**: API tokens must expire (max 24 hours)
- ✅ **REQUIRED**: Rate limiting on all endpoints

#### Data Protection
- ✅ **REQUIRED**: No personal data in MaterialDNA
- ✅ **REQUIRED**: Encrypt sensitive data at rest
- ✅ **REQUIRED**: Audit logs must be immutable
- ✅ **REQUIRED**: GDPR compliance for EU nodes

### Cryptographic Requirements

#### Signing
- **Algorithm**: Ed25519 (required)
- **Key Size**: 256 bits
- **Libraries**: Use well-tested implementations only

#### Hashing
- **Password Hashing**: Argon2id (recommended) or bcrypt
- **Data Integrity**: SHA-256 minimum
- **Merkle Trees**: For audit trails

#### Random Number Generation
- **REQUIRED**: Cryptographically secure RNG only
- **Sources**: `/dev/urandom` or equivalent
- **Testing**: Diehard tests for custom implementations

### API Security

#### Input Validation
```javascript
// Example validation middleware
const validateMaterialDNA = (req, res, next) => {
  const pattern = /^[A-Z]{2}-[A-Z]{3}-\d{4}-[A-Z]+-[A-Z0-9]{6,}$/;
  if (!pattern.test(req.body.id)) {
    return res.status(400).json({error: 'Invalid MaterialDNA format'});
  }
  next();
};
```

#### Output Encoding
- JSON responses only
- Proper Content-Type headers
- No sensitive data in error messages

#### CORS Policy
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  maxAge: 86400
};
```

### Database Security

#### Access Control
- Principle of least privilege
- Separate read/write accounts
- Network isolation

#### Backup & Recovery
- Encrypted backups
- Regular restore testing
- Geographically distributed copies

### Monitoring & Incident Response

#### Logging Requirements
- Failed authentication attempts
- Rate limit violations
- Invalid MaterialDNA registrations
- Cross-node settlement failures

#### Alerting Triggers
- Multiple failed auth attempts
- Unusual traffic patterns
- Certificate expiry warnings
- System resource exhaustion

## 🚨 Known Security Issues

### Protocol 0.6.x
| Issue | Severity | Status | Mitigation |
|-------|----------|---------|------------|
| None recorded | - | - | - |

## 🔍 Security Audit History

| Date | Version | Auditor | Report |
|------|---------|---------|---------|
| None yet | - | - | No third-party security audit has been performed; see the threat model in `docs/compliance/threat-model.md` |

## 📋 Security Checklist for Node Operators

### Pre-Deployment
- [ ] TLS certificates configured
- [ ] Firewall rules reviewed
- [ ] Authentication system tested
- [ ] Rate limiting enabled
- [ ] Monitoring configured
- [ ] Backup system verified
- [ ] Incident response plan documented

### Operational
- [ ] Security updates applied monthly
- [ ] Certificates renewed before expiry
- [ ] Logs reviewed weekly
- [ ] Access lists updated quarterly
- [ ] Security training completed annually

## 🏆 Security Acknowledgments

We thank the following security researchers for responsibly disclosing vulnerabilities:

- None recorded yet. With your permission, we will credit you here and in the release notes.

## 📚 Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Controls](https://www.cisecurity.org/controls/)

### Tools
- **Static Analysis**: ESLint with security plugins
- **Dependency Scanning**: npm audit, Snyk
- **Dynamic Testing**: OWASP ZAP
- **TLS Testing**: SSL Labs

### Training
- Node operator security guide: `docs/security-guide.md`
- Developer security practices: `docs/secure-coding.md`
- Incident response playbook: `docs/incident-response.md`

## 📞 Contact

- **Security Issues**: dev@mycel-ai.de
- **General Support**: dev@mycel-ai.de

---

*Last Updated: 2026-10-14*  
*Next Review: 2027-04-14*

<!-- agent-cycle-039: security doc anchor -->
