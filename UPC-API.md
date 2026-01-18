# 🧠 Kitchen Queue — FatSecret + Barcode Spider Proxy API

**Environment:** DigitalOcean (Ubuntu 24.04 LTS)\*\*  
**Location:** `~/fatsecret-proxy`  
**Port:** `8080`  
**File:** `proxy.js`

---

## ⚙️ Overview

This service acts as Kitchen Queue’s **custom backend API** for UPC food lookups.  
It combines **FatSecret** (nutrition + food data) and **Barcode Spider** (product + brand info) into a single response.

All sensitive credentials are stored securely in the `.env` file on the droplet and **never exposed to the client app**.

---

## 🧩 How It Works

### 1. Token Management

- The proxy first checks for an existing FatSecret access token in memory.
- If no token exists or it’s expired, a new one is requested using the OAuth endpoint:
  ```
  POST https://oauth.fatsecret.com/connect/token
  ```
- Tokens are cached for ~24 hours (based on FatSecret’s `expires_in` value).
- Barcode Spider uses a static API key stored in `.env`.

---

**Query Parameters**

| Key   | Required | Description                                   |
| ----- | -------- | --------------------------------------------- |
| `upc` | ✅       | The UPC code to look up (e.g. `027000378311`) |

---

### 3. Process Flow

1. ✅ **Token Check** – Verify cached FatSecret token or request a new one.
2. 🔍 **FatSecret Step 1** – Convert UPC → `food_id`
   ```
   https://platform.fatsecret.com/rest/food/barcode/find-by-id/v1
   ```
3. 🍽 **FatSecret Step 2** – Use `food_id` → get full food object
   ```
   https://platform.fatsecret.com/rest/food/v4
   ```
4. 🕷 **Barcode Spider Lookup** – Only called if FatSecret succeeds
   ```
   https://api.barcodespider.com/v1/lookup
   ```
5. 📦 **Response Merge** – Returns a combined JSON payload:
   ```json
   {
     "fatsecret": { ... },
     "barcodeSpider": { ... }
   }
   ```

---

## ❌ Error Handling

The proxy uses a **numeric `errorCode` system** (no messages).  
These codes are designed for the Kitchen Queue saga/reducer to interpret and map to UI messages later.

| Error Code | Meaning                              | HTTP Status | Notes                               |
| ---------- | ------------------------------------ | ----------- | ----------------------------------- |
| **5400**   | Missing or invalid UPC parameter     | 400         | User didn’t pass `upc`              |
| **5401**   | No valid `food_id` found for barcode | 404         | FatSecret returned `"food_id": "0"` |
| **5501**   | FatSecret step 1 network/API error   | 502         | Failed during UPC → ID request      |
| **5502**   | FatSecret step 2 network/API error   | 502         | Failed during food details request  |
| **5001**   | Token request failed                 | 500         | OAuth token endpoint issue          |
| **5500**   | Unknown internal error               | 500         | Generic catch-all                   |
| **5900**   | System-level network error           | 500         | Node/Fetch error (rare)             |

---

## 🧾 Tech Stack

| Component                | Purpose                               |
| ------------------------ | ------------------------------------- |
| **Node.js 18.19.1**      | Runtime environment                   |
| **Express.js**           | Lightweight API routing               |
| **node-fetch**           | HTTP requests                         |
| **dotenv**               | Secure environment variables          |
| **DigitalOcean Droplet** | Hosted environment (Ubuntu 24.04 LTS) |

---

## 🚀 Deployment Notes

**Run in background**

```bash
nohup node proxy.js > proxy.log 2>&1 &
```

**Stop process**

```bash
pkill node
```

---

## 🔒 Security

- All API credentials (FatSecret + Barcode Spider) are stored in `.env` on the droplet.
- Never expose these in client code or version control.
- FatSecret’s IP whitelist should include only your droplet’s public IP.
- The API is private and not intended for external/public access.

---

## 🏁 Summary

This proxy:

- Authenticates with FatSecret (24 h cached token).
- Optionally enriches results with Barcode Spider data.
- Returns a unified JSON object to the Kitchen Queue app.
- Uses numeric error codes for predictable reducer handling.
