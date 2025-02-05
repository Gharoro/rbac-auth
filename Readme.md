# RBAC Authentication API

## Steps to Run the Application Locally

### 1. Clone the Repository

```sh
git clone <repository-url>
```

### 2. Navigate into the Project Directory

```sh
cd rbac-auth
```

### 3. Install Dependencies

```sh
npm install
```

### 4. Create a `.env` File

Create a `.env` file in the root directory and copy the variables from `.env.example`.

### 5. Set the Environment Variables

Replace the placeholder values with your actual configuration:

```env
MONGO_URI=<your-mongodb-url>
PORT=<your-preferred-port-e.g-5000>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=300 # 5 minutes (300 seconds) to test refresh and expiration of tokens
JWT_ENCRYPTION_KEY=<your-encryption-key>
JWT_REFRESH_SECRET=<your-refresh-secret>
JWT_REFRESH_EXPIRES_IN='7d' # 7 days
JWT_ENCRYPTION_TYPE='aes-256-ctr' # Encryption algorithm
JWT_ENCRYPTION_IV=<your-encryption-iv>
```

### 6. Run the Application

```sh
npm run dev
```

### 7. Test the API

Verify that the application is running correctly by calling the health endpoint:

```http
GET http://localhost:<your-port>/api/health
```

---

## Authentication Endpoints

1. **Register User** - `POST /api/auth/register`
2. **Login** - `POST /api/auth/login`
3. **Refresh Token** - `POST /api/auth/refresh-token`
4. **Logout** - `POST /api/auth/logout`

## Admin Only Endpoints

1. **Dashboard** - `GET /api/admin/dashboard`
2. **Users** - `GET /api/admin/users`

## Shipper Only Endpoint

1. **Dashboard** - `GET /api/shipper/dashboard`

## Carrier Only Endpoint

1. **Dashboard** - `GET /api/carrier/dashboard`

---

## Request Payloads

### 1. Register User

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "role": "UserRole"
}
```

#### User Roles

```ts
export enum UserRole {
  ADMIN = "Admin",
  SHIPPER = "Shipper",
  CARRIER = "Carrier",
}
```

### 2. Login

```json
{
  "email": "string",
  "password": "string"
}
```

### 3. Refresh Token & Logout

```json
{
  "refreshToken": "string"
}
```

> **Note:** All protected endpoints require an `Authorization` header with a `Bearer <access-token>`

---

## Additional Help: Generating Secure Environment Variables

### Generate a Secure JWT Secret

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate a Secure Encryption Key (32 bytes for AES-256)

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate a Secure Encryption IV (16 bytes for AES-256-CTR)

```sh
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Generate a Secure Refresh Token Secret

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use these generated values in your `.env` file. 🚀
