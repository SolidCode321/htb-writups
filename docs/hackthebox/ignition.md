# Ignition

Date: <date>
Status: Completed

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
