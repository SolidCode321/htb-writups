---
title: "📄 HTB: Tactics — Writeup"
date: "2024-03-01"
---

# 📄 HTB: Tactics — Writeup

---

## 🧠 Overview

- **Machine Name:** Tactics  
- **Difficulty:** Easy 🟢  
- **Platform:** Hack The Box  
- **Category:** Active Directory / Windows  

### 🔑 Key Skills Learned

- SMB enumeration without credentials  
- Null session abuse  
- Default credentials usage  
- Basic Windows privilege access  

---

## 🧭 Enumeration

### 🔎 Nmap Scan

```bash
nmap -sC -sV -Pn <target-ip>
```

### 📌 Key Findings

- SMB service exposed on **port 445** 📡  
- Host appears to be part of a **WORKGROUP / domain-like setup**  
- No obvious web services 🌐❌  

---

## 📂 SMB Enumeration

### 🔐 Attempt Null Session

```bash
smbclient -L //<target-ip> -N
```

👉 `-N` = no password (null session)

### ✅ Result

- Share listing available **without authentication**  
- Indicates **misconfigured SMB** ⚠️  

### 📁 Typical Shares

- `ADMIN$`  
- `C$`  
- `IPC$`  

---

## 🚪 Accessing Shares

```bash
smbclient //<target-ip>/C$ -N
```

- If access is denied → proceed to credential-based access  

---

## 🔑 Default Credentials Attack

### 🧪 Attempt Login

```bash
smbclient //<target-ip>/C$ -U Administrator
```

### 🔍 Try Passwords

- *(blank)*  
- `Administrator`  

---

## 💥 Working Credentials

- **Username:** Administrator  
- **Password:** *(blank)*  

---

## 🖥️ Gaining Access

```bash
smbclient //<target-ip>/C$ -U Administrator%
```

---

## 📁 Navigation

```bash
ls
cd Users
cd Administrator
cd Desktop
ls
```

---

## 🏁 Capture the Flag

```bash
get flag.txt
```

---

## 🔓 Root Cause Analysis

- Administrator account has **no password**  
- SMB allows authentication with **blank credentials**  

---

## ⚠️ Impact

- Full system compromise  
- Administrative privileges  
- Potential lateral movement  

---

## 🛡️ Mitigation

- Enforce strong passwords  
- Disable null sessions  
- Restrict SMB access  
- Use LAPS or credential rotation  

---

## 💡 Key Takeaways

- Test null sessions (`-N`)  
- Try default and empty credentials  
- SMB misconfigs are common  

---

## ⚡ Summary

A misconfigured Administrator account with a blank password leads to full compromise via SMB.
