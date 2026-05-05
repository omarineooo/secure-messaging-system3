# Secure Messaging System - Submission

## Project Overview
This is a full-stack secure messaging web application built with **Next.js**. It implements high-security standards for user authentication and communication, fulfilling all requirements for the Security Two assignment.

## Features
- **Secure Registration**: Generates a unique 2048-bit RSA key pair for every new user.
- **Password Protection**: Uses **Bcrypt** (cost factor 10) to hash passwords before database storage.
- **End-to-End Encryption (E2EE)**: Messages are encrypted using the receiver's **RSA Public Key** and can only be decrypted by the receiver's **RSA Private Key**.
- **Futuristic UI**: Modern, glassmorphic design with real-time feedback and cyber-punk aesthetics.

## Technology Stack
- **Framework**: Next.js (App Router)
- **Language**: JavaScript
- **Database**: SQLite (via `better-sqlite3`)
- **Crypto Libraries**:
  - `bcrypt`: For password hashing and verification.
  - `node-forge`: For RSA key generation, encryption, and decryption.

## How to Run
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Cryptographic Implementation
- **Hashing**: `bcrypt.hash(password, 10)`
- **Encryption**: `RSA-OAEP` with `SHA-256` padding.
- **Keys**: 2048-bit keys generated during user registration and stored in the database (demonstration mode).

---
**Submitted by:** Omar
**Course:** Security Two
