<!-- ====================== PREMIUM BANNER ====================== -->

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,100:2c5364&height=230&section=header&text=GuptKey&fontSize=55&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Zero-Knowledge%20Password%20Manager&descAlignY=60&descAlign=50" />
</p>

<p align="center">
  <b>🔐 Zero-Knowledge • Client-Side Encryption • Security-First Architecture</b>
</p>

---

<!-- ====================== BADGES ====================== -->

<p align="center">

<img src="https://img.shields.io/badge/Architecture-Zero--Knowledge-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Encryption-AES--256--GCM-success?style=for-the-badge" />
<img src="https://img.shields.io/badge/KDF-Argon2id-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/Auth-JWT%20Rotation-critical?style=for-the-badge" />
<img src="https://img.shields.io/badge/Security-First%20Design-red?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge" />

</p>

---

<!-- ====================== TECH LOGOS ====================== -->

## 🛠 Built With

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,ts,nodejs,express,mongodb,redux" />
</p>

---

# 🔐 GuptKey

Zero-Knowledge, Client-Side Encrypted Password Manager built with a Security-First (Zero-Order) Architecture.

GuptKey guarantees that the server never has access to user secrets — not even in plaintext.

---

# 🏗 Zero-Knowledge Architecture

### Zero-Knowledge Flow
User Master Password
↓
Argon2id Key Derivation (Client)
↓
AES-256-GCM Encryption
↓
Ciphertext Sent to Backend
↓
Database Stores Encrypted Blob Only

Server cannot decrypt vault data — by design.

---

# 🏗 Architecture: Zero-Order Security Model

GuptKey follows a **Zero-Order Architecture**:

> Security primitives are defined before product features.

Traditional approach:  
Feature → Add security → Patch vulnerabilities  

GuptKey approach:  
Security → Define cryptographic boundaries → Build API → Add UI  

No feature can bypass the encryption layer.

---

# 🔐 Cryptographic Model

## 🔑 Key Derivation (Client-Side)

- Algorithm: **Argon2id**
- Unique cryptographic salt per user
- Key derived entirely on the client
- 256-bit output key

### Recommended Parameters

- Memory Cost: 64MB – 128MB
- Time Cost: ≥ 3 iterations
- Parallelism: 1–4
- Output Length: 256 bits

The derived key:
- Is never transmitted
- Is never logged
- Is never stored server-side

---

## 🔒 Vault Encryption

- Algorithm: **AES-256-GCM**
- 96-bit cryptographically secure random IV
- IV generated using `crypto.getRandomValues()`
- Authentication tag validated on decryption
- Each vault entry encrypted independently

### Encrypted Vault Structure

```json
{
  "encryptedData": "base64",
  "iv": "base64",
  "salt": "base64"
}
```
Backend stores only encrypted payload.
---
## Authentication System
### Access Token
- JWT (short-lived)
- Stored in HTTP-only cookies
- SameSite strict
- Not accessible to JavaScript

### Refresh Token
- Rotated on every use
- Stored securely server-side
- Invalidated on logout
- Device-aware session tracking supported

## Session Protection
- Token expiration enforcement
- Replay mitigation via rotation
- No localStorage token storage
- CSRF resistant via SameSite + cookie policy

---

#  Core Features

## User Authentication
- User registration
- Email verification (via Resend)
- Secure login
- Forgot password (OTP-based)
- Change password (OTP verification required)
- Logout with refresh token invalidation

## Vault Management
All vault data is encrypted before transmission.

Supported operations:
- Create vault item
- Update vault item
- Delete vault item
- Retrieve encrypted vault
- Client-side decrypt & render

Vault fields encrypted:
- Site name
- Username/Email
- Password
- Notes
- isFavorite

Backend never sees plaintext.

## 📧 Email System

Provider: Resend

Used for:
- Email verification
- OTP delivery
- Password reset confirmation

Security controls:
- OTP expiration
- OTP attempt limitation
- OTP rate limiting
- OTP hashed in database (never stored plaintext)

## 🛡 Security Controls

- Rate limiting on authentication endpoints
- Brute-force protection
- Input validation & sanitization
- MongoDB injection prevention
- Secure CORS configuration
- Environment variable isolation
- No sensitive logs
- Strict HTTP security headers

---

## 🧠 Threat Model

| Threat               | Mitigation                         |
|----------------------|------------------------------------|
| Database breach      | Client-side AES-256-GCM encryption |
| Rainbow table attack | Argon2id + unique salt             |
| Token theft          | HTTP-only cookies                  |
| Replay attack        | Refresh token rotation             |
| OTP brute force      | Expiry + rate limiting             |
| XSS token theft      | No localStorage tokens             |
| CSRF                 | SameSite strict policy             |

---

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
