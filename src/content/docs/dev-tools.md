# Developer Utilities (DevTools) 👨‍💻

Welcome to **DevTools**—a lightweight, blazing-fast suite of essential utilities built for developers, by developers. 

When working with APIs, debugging tokens, or formatting server responses, the last thing you want is to paste your company's sensitive production data into a random, ad-filled website that might be logging your keystrokes. SuperApp's DevTools execute **100% locally** in your browser. 

> **Privacy Guarantee:** Your JSON payloads, JWTs, and Regex strings never leave your device. Zero API calls are made to process your data.

## 🧭 Workspace Navigation

The DevTools workspace is designed with a professional split-pane layout to maximize efficiency:
* **Input (Left):** Paste your raw, unformatted, or encoded data here.
* **Result (Right):** View the processed output, complete with syntax highlighting and instant copy buttons.
* **Mobile Users:** Swipe horizontally across the top tabs to switch between different utilities seamlessly.

---

## 🛠️ The Utility Belt

### 1. JSON Formatter & Minifier
Stop struggling with unreadable, single-line API responses.
* **Prettify:** Instantly format raw JSON strings into clean, indented, and syntax-highlighted code. It also catches and highlights syntax errors (like missing quotes or trailing commas).
* **Minify:** Compress your JSON by stripping all whitespace and line breaks, making it ready for production payloads.

### 2. Text Manipulator
A Swiss Army knife for string operations.
* Convert text between cases (camelCase, snake_case, PascalCase, UPPERCASE, lowercase).
* Instantly calculate character counts, word counts, and byte sizes.
* URL Encode/Decode strings safely.

### 3. Base64 Encoder / Decoder
Safely convert data back and forth.
* Paste any plain text to generate its Base64 equivalent, or paste a Base64 string to decode it into readable text. 
* Works perfectly for debugging basic auth headers or encoded email payloads.

### 4. JWT (JSON Web Token) Decoder
Debug your authentication tokens securely.
* Paste a JWT to instantly decode its `Header` and `Payload` (Claims) into readable JSON.
* **Note:** This tool only decodes the Base64Url-encoded layers. It does not verify the cryptographic signature, keeping the entire process offline.

### 5. Regex Tester
Write and test Regular Expressions in real-time.
* Enter your Regex pattern and test it against a sample text. 
* Matches are highlighted live, making it incredibly easy to debug complex capture groups or lookaheads.

### 6. Password Generator
Generate cryptographically secure passwords directly on your client.
* Customize length and character sets (Uppercase, Lowercase, Numbers, Symbols).
* Includes a real-time strength estimator.

---

## 🔒 Under the Hood: Secure Parsing

Parsing external JSON can sometimes lead to security vulnerabilities or app crashes if not handled correctly. We wrap all our utility logic in strict `try-catch` blocks and sanitize the output to prevent XSS (Cross-Site Scripting).

**How we safely parse and format JSON (Internal Engine Snippet):**
```javascript
// Secure Local JSON Formatter
export function prettifyJSON(rawInput) {
    try {
        // 1. Parse the string to validate it
        const parsedData = JSON.parse(rawInput);
        
        // 2. Stringify with a 2-space indent for readability
        return JSON.stringify(parsedData, null, 2);
    } catch (error) {
        // Fallback to prevent app crashes on malformed data
        return `Syntax Error: ${error.message}`;
    }
}

```

> 🔗 **Open Source Trust:** Want to see exactly how these utilities are built?
> **[View the DevTools source code on our GitHub Repository ↗](https://github.com/SachinYedav/SuperApp/tree/main/src/features/text-tools)**

