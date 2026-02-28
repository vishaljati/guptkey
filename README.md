# 🔐 GuptKey

Zero-Knowledge, Client-Side Encrypted Password Manager built with a Security-First (Zero-Order) Architecture.

GuptKey ensures that **the server never has access to user secrets — not even in plaintext.**

---

## 🚀 Vision

Most password managers encrypt data, but still retain architectural control over secrets.

GuptKey eliminates that trust requirement.

- Encryption happens **in the browser**
- Keys are derived **locally using Argon2id**
- The backend stores **ciphertext only**
- The server cannot decrypt vault data — by design

If the database is breached, attacker gets encrypted blobs — nothing usable.

---

# 🏗 Architecture: Zero-Order Model

GuptKey follows a **Zero-Order Architecture** approach:

> Security primitives are defined before features.

Traditional apps:  
Feature → Add security → Patch vulnerabilities  

GuptKey:  
Security → Define data model → Build API → Add UI  

No feature can bypass the encryption boundary.

---

# 🔐 Cryptographic Model

## Key Derivation

- Algorithm: **Argon2id**
- Unique salt per user
- Parameters configurable (memory, iterations, parallelism)
- Key derived entirely on client

Example parameter configuration:

- Memory Cost: 64MB – 128MB  
- Time Cost: ≥ 3 iterations  
- Parallelism: 1–4  
- Output Length: 256-bit key  

Derived key is never transmitted to backend.

---

## Vault Encryption

- Algorithm: **AES-256-GCM**
- 96-bit cryptographically secure random IV
- IV generated using `crypto.getRandomValues()`
- Authentication tag validated during decryption
- Each vault entry encrypted independently

Encrypted structure:

```json
{
  "encryptedData": "base64",
  "iv": "base64",
  "salt": "base64"
}
```
Backend stores only encrypted payload.

## Authentication System
### Access Token
-JWT (short-lived)
-Stored in HTTP-only cookies
-SameSite strict
-Not accessible to JavaScript

### Refresh Token
-Rotated on every use
-Stored securely server-side
-Invalidated on logout
-Device-aware session tracking supported

## Session Protection
-Token expiration enforcement
-Replay mitigation via rotation
-No localStorage token storage
-CSRF resistant via SameSite + cookie policy

##  Core Features

### User Authentication
-User registration
-Email verification (via Resend)
-Secure login
-Forgot password (OTP-based)
-Change password (OTP verification required)
-Logout with refresh token invalidation

### Vault Management
All vault data is encrypted before transmission.

Supported operations:
-Create vault item
-Update vault item
-Delete vault item
-Retrieve encrypted vault
-Client-side decrypt & render

Vault fields encrypted:
-Title
-Username/Email
-Password
-Notes
-isFavorite

Backend never sees plaintext.

### 📧 Email System

Provider: Resend

Used for:
-Email verification
-OTP delivery
-Password reset confirmation

Security controls:
-OTP expiration
-OTP attempt limitation
-OTP rate limiting
-OTP hashed in database (never stored plaintext)

### 🛡 Security Controls

-Rate limiting on authentication endpoints
-Brute-force protection
-Input validation & sanitization
-MongoDB injection prevention
-Secure CORS configuration
-Environment variable isolation
-No sensitive logs
-Strict HTTP security headers

### 🧠 Threat Model

| Threat               | Mitigation                         |
|----------------------|------------------------------------|
| Database breach      | Client-side AES-256-GCM encryption |
| Rainbow table attack | Argon2id + unique salt             |
| Token theft          | HTTP-only cookies                  |
| Replay attack        | Refresh token rotation             |
| OTP brute force      | Expiry + rate limiting             |
| XSS token theft      | No localStorage tokens             |
| CSRF                 | SameSite strict policy             |

## 📂 Project Structure
frontend/src/
├── config/
├── crypto/
├── components/
├── features/
├── store/
├── hooks/
├── lib/
├── pages/
├── service/
├── types/
├── utils/
├── App.tsx
└── main.tsx

backend/src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── db/
├── utils/
├── types/
├── app.ts
└── index.ts

# 🛠 Tech Stack

## Frontend

- React + TypeScript
- Redux Toolkit
- Web Crypto API
- Argon2 (WASM implementation)

## Backend

- Node.js
- Express
- MongoDB
- JWT Authentication
- Resend (Email service)

## Deployment

- Frontend: Vercel
- Backend: Render
- Environment-based config isolation

---

# 🔁 Password Change Flow

When master password changes:

1. User verifies identity via OTP
2. Client derives new key via Argon2id
3. Vault decrypted locally
4. Vault re-encrypted with new key
5. Updated ciphertext sent to backend

Backend never participates in decryption.

---

# 🧪 Future Roadmap

- WebAuthn / Passkey support
- Hardware security key integration
- Vault sharing via key wrapping
- Audit log system
- Security whitepaper
- Third-party security audit
- SOC2 compliance preparation

---

# ⚠️ Disclaimer

GuptKey is a security-focused system.  
A professional third-party security audit is required before production-scale deployment.

---

# 📈 Engineering Value

GuptKey demonstrates:

- Client-side cryptography implementation
- Argon2id key derivation tuning
- Zero-knowledge data architecture
- Token rotation mechanisms
- Threat modeling
- Defensive backend engineering
- Secure SaaS system design

This is not a CRUD application.

---

# 🔎 Zero-Knowledge Guarantee

The backend does **NOT** have access to:

- Master passwords
- Derived encryption keys
- Decrypted vault data

All sensitive cryptographic operations occur on the client.

Database compromise ≠ vault compromise.

---

# 🧨 Security Philosophy

Security is not added.  
Security defines the system.

# 📜 License
[MIT](https://choosealicense.com/licenses/mit/)
