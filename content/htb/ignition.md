---
title: "🔥 Hack The Box — Ignition Writeup"
date: "2024-03-01"
---

# 🔥 Hack The Box — Ignition Writeup

## 📌 Machine Information
- **Name:** Ignition  
- **Difficulty:** Easy  
- **OS:** Linux  
- **Category:** Web / Default Credentials  

---

## 📖 Overview

Ignition is an easy machine focused on identifying a **Magento-based web application** and exploiting **default admin credentials** to gain access.

### Attack Path:
1. Web enumeration  
2. Identify Magento CMS  
3. Locate admin panel  
4. Use default credentials  
5. Retrieve flag  

---

## 🔍 Reconnaissance

### 🔹 Nmap Scan

```bash
nmap -p- -T4 -v <TARGET_IP>
```

Followed by:

```bash
nmap -sC -sV -p <OPEN_PORTS> <TARGET_IP>
```

### 🧾 Key Findings
- **Port 80 → HTTP**
- Web server hosting Magento site  

---

## 🌐 Web Enumeration

Visit:

```
http://<TARGET_IP>
```

### 🔎 Observations
- E-commerce website  
- Footer reveals **Magento CMS**  
- No obvious vulnerabilities on frontend  

---

## 🔍 Directory Bruteforcing

Use gobuster to find hidden paths:

```bash
gobuster dir -u http://<TARGET_IP> -w /usr/share/wordlists/dirb/common.txt
```

### 📁 Important Discovery
```
/admin
```

---

## 🔐 Admin Panel Access

Navigate to:

```
http://<TARGET_IP>/admin
```

### 🔹 Default Credentials Attempt

Magento often uses weak/default credentials.

```
admin : admin123
```

### ✅ Successful Login
- Access to Magento admin dashboard obtained  

---

## 🚩 Flag Retrieval

Once logged in:

- Navigate through dashboard  
- Locate flag in admin panel or configuration sections  

---

## 🧩 Key Takeaways

### 🔑 Default Credentials
- Magento frequently deployed with weak credentials  
- Always test common username/password combinations  

### 🔑 Hidden Admin Panels
- Admin endpoints often not linked publicly  
- Directory brute-forcing is essential  

### 🔑 Web App Exposure
- CMS identification helps narrow attack strategy  

---

## 🛡️ Mitigation Strategies

- Change default credentials immediately  
- Restrict access to admin panel (IP allowlist)  
- Enable MFA for admin users  
- Regularly update CMS and plugins  

---

## 🛠️ Tools Used

- `nmap`  
- `gobuster`  
- Browser  

---

## 🧠 Final Thoughts

Ignition highlights a very common real-world issue:

> Default credentials + exposed admin panel = full compromise

### Key Lessons:
- Always enumerate hidden paths  
- Default creds are still widely used  
- CMS fingerprinting is powerful  

---
# Ignition

**Date:** March 17, 2026\
**Status:** Completed\
**Category:** Web

---

## Reconnaissance

Start with a full port scan to identify open services.

```bash
nmap -p- -T4 <ip>
```

Then enumerate detected services and versions.

```bash
nmap -sC -sV <ip>
```

### Result

```
80/tcp open  http
```

Only HTTP is exposed, indicating the attack surface is the web application.

---

## Web Enumeration

Open the target IP in the browser.

The website is running **Magento**, an e-commerce platform.

Common Magento admin paths:

```
/admin
/backend
/admin_login
/index.php/admin
```

Testing these paths reveals the **admin login panel**:

```
http://<ip>/admin
```

---

## Login Portal

The page loads a **Magento Admin Login**.

Common default usernames:

```
admin
administrator
root
```

Using `admin` as the username works.

---

## Credential Guessing

Since there is no rate limiting, try common passwords.

Examples:

```
admin:admin
admin:password
admin:admin123
admin:qwerty123
```

Valid credentials discovered:

```
Username: admin
Password: qwerty123
```

---

## Admin Access

Login to the Magento dashboard.

This grants administrative control over the website.

Explore the admin interface to locate sensitive information.

---

## Flag

The flag is available within the admin panel.

Retrieve the flag:

```
xxxxxxxxxxxxxxxx
```

---

## Summary

1. Scan the target with `nmap`
2. Discover HTTP service
3. Identify Magento web application
4. Locate `/admin` login panel
5. Guess weak credentials
6. Login as administrator
7. Retrieve the flag

---

## Key Takeaways

- Exposed admin panels significantly increase risk.
- Weak credentials are a common attack vector.
- Admin portals should be protected with:
  - strong passwords
  - multi-factor authentication
  - IP restrictions
