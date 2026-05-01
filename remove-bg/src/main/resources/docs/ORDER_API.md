# Order API – Tài liệu Postman

**Base URL**: `http://localhost:8080`  
**Prefix**: `/api/orders`

API thanh toán và xác nhận đơn hàng qua Stripe.

---

## 1. Tạo đơn hàng

Tạo phiên thanh toán Stripe cho gói credits.

- **Method**: POST
- **URL**: `http://localhost:8080/api/orders`
- **Authorization**: Bearer Token (JWT từ Clerk)
- **Headers**:
  - `Content-Type: application/x-www-form-urlencoded`
  - `Authorization: Bearer {jwt_token_from_clerk}`
- **Body** (x-www-form-urlencoded):

| Key    | Type   | Value                     |
|-------|--------|---------------------------|
| planId | String | `basic`, `pro`, hoặc `enterprise` |
| clerkId | String | ID user từ Clerk            |

- **Response**:
  - 201 CREATED (thành công):

```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_abc123",
    "url": "https://checkout.stripe.com/c/pay/cs_test_abc123"
  },
  "statusCode": 201
}
```

  - 400 BAD_REQUEST (thiếu planId):

```json
{
  "success": false,
  "data": "Plan ID không hợp lệ",
  "statusCode": 400
}
```

  - 401 UNAUTHORIZED (chưa đăng nhập):

```json
{
  "success": false,
  "data": "Chưa đăng nhập",
  "statusCode": 401
}
```

---

## 2. Xác nhận thanh toán

Xác nhận payment qua Stripe session sau khi user thanh toán thành công.

- **Method**: POST
- **URL**: `http://localhost:8080/api/orders/verify`
- **Authorization**: Bearer Token (JWT từ Clerk)
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {jwt_token_from_clerk}`
- **Body** (raw JSON):

```json
{
  "sessionId": "cs_test_abc123"
}
```

- **Response**:
  - 200 OK (thành công):

```json
{
  "success": true,
  "data": {
    "success": true,
    "plan": "basic",
    "creditsAdded": 10
  },
  "statusCode": 200
}
```

  - 400 BAD_REQUEST (sessionId rỗng hoặc thanh toán thất bại):

```json
{
  "success": false,
  "data": {
    "success": false,
    "error": "Payment failed or expired"
  },
  "statusCode": 400
}
```

  - 401 UNAUTHORIZED (chưa đăng nhập):

```json
{
  "success": false,
  "data": "Chưa đăng nhập",
  "statusCode": 401
}
```

---

## Ghi chú

- **Authentication**: API yêu cầu xác thực qua JWT token từ Clerk
- **Flow thanh toán**:
  1. Client gọi `POST /api/orders` với planId để tạo Stripe Checkout session
  2. Server trả về URL checkout, redirect user sang Stripe
  3. Sau khi thanh toán, Stripe redirect về frontend
  4. Frontend gọi `POST /api/orders/verify` với sessionId để xác nhận và cộng credits
- **Plans**:
  - `basic`: 10 credits
  - `pro`: 50 credits
  - `enterprise`: 200 credits
- **Stripe**: Sử dụng Stripe Checkout Sessions để xử lý thanh toán an toàn

---

## Ví dụ Postman

### Tạo đơn hàng

```
POST http://localhost:8080/api/orders
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/x-www-form-urlencoded

planId=basic&clerkId=user_abc123
```

### Xác nhận thanh toán

```
POST http://localhost:8080/api/orders/verify
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json

{
  "sessionId": "cs_test_abc123"
}
```