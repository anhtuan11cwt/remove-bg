# Clerk Webhook API – Tài liệu Postman

**Base URL**: `http://localhost:8080`  
**Prefix**: `/api/webhooks/clerk`

Webhook endpoint nhận sự kiện từ Clerk (authentication provider) để đồng bộ user vào hệ thống.

---

## 1. Webhook – User Created

Xử lý sự kiện user mới được tạo trên Clerk.

- **Method**: POST
- **URL**: `http://localhost:8080/api/webhooks/clerk`
- **Headers**:
  - `Content-Type: application/json`
  - `Svix-Id: msg_1234567890`
  - `Svix-Timestamp: 1704067200`
  - `Svix-Signature: v1,abcdefghijklmnopqrstuvwxyz1234567890`
- **Body** (raw JSON):

```json
{
  "type": "user.created",
  "data": {
    "id": "user_abc123xyz",
    "email_addresses": [
      {
        "email_address": "newuser@example.com"
      }
    ],
    "first_name": "Nguyen",
    "last_name": "Van A",
    "image_url": "https://example.com/avatar.jpg"
  }
}
```

- **Response**:
  - 200 OK (thành công): Không có body
  - 401 UNAUTHORIZED (chữ ký không hợp lệ)
  - 500 INTERNAL_SERVER_ERROR (lỗi xử lý)

---

## 2. Webhook – User Updated

Xử lý sự kiện user được cập nhật trên Clerk.

- **Method**: POST
- **URL**: `http://localhost:8080/api/webhooks/clerk`
- **Headers**:
  - `Content-Type: application/json`
  - `Svix-Id: msg_0987654321`
  - `Svix-Timestamp: 1704153600`
  - `Svix-Signature: v1,zxcvbnmasdfghjklqwertyuiop123456`
- **Body** (raw JSON):

```json
{
  "type": "user.updated",
  "data": {
    "id": "user_abc123xyz",
    "email_addresses": [
      {
        "email_address": "updated@example.com"
      }
    ],
    "first_name": "Tran",
    "last_name": "Van B",
    "image_url": "https://example.com/new-avatar.jpg"
  }
}
```

- **Response**:
  - 200 OK (thành công): Không có body
  - 401 UNAUTHORIZED (chữ ký không hợp lệ)
  - 500 INTERNAL_SERVER_ERROR (lỗi xử lý)

---

## 3. Webhook – User Deleted

Xử lý sự kiện user bị xóa trên Clerk.

- **Method**: POST
- **URL**: `http://localhost:8080/api/webhooks/clerk`
- **Headers**:
  - `Content-Type: application/json`
  - `Svix-Id: msg_1122334455`
  - `Svix-Timestamp: 1704240000`
  - `Svix-Signature: v1,qwertyuiopasdfghjklzxcvbnm1234567890`
- **Body** (raw JSON):

```json
{
  "type": "user.deleted",
  "data": {
    "id": "user_abc123xyz"
  }
}
```

- **Response**:
  - 200 OK (thành công): Không có body
  - 401 UNAUTHORIZED (chữ ký không hợp lệ)
  - 500 INTERNAL_SERVER_ERROR (lỗi xử lý)

---

## Ghi chú

- **Headers bắt buộc**: `Svix-Id`, `Svix-Timestamp`, `Svix-Signature` – dùng để verify webhook từ Clerk (thư viện Svix)
- **Signature verification**: Trong môi trường development, signature luôn được bypass (`return true`). Production cần verify bằng thư viện Svix và `clerk.webhook.secret`
- **Idempotency**: `user.created` kiểm tra user đã tồn tại trước khi tạo mới
- **Event types hỗ trợ**:
  - `user.created`: Tạo user mới
  - `user.updated`: Cập nhật thông tin user
  - `user.deleted`: Xóa user
- **Payload fields**:
  - `type`: Loại sự kiện (bắt buộc)
  - `data.id`: Clerk user ID (bắt buộc)
  - `data.email_addresses[0].email_address`: Email chính
  - `data.first_name`: Tên (optional)
  - `data.last_name`: Họ (optional)
  - `data.image_url`: URL avatar (optional)

---

## 4. REST API – Create or Update User

Tạo hoặc cập nhật thông tin user từ frontend (được gọi sau khi đăng nhập bằng Clerk).

- **Method**: POST
- **URL**: `http://localhost:8080/api/users`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {jwt_token_from_clerk}`
- **Body** (raw JSON):

```json
{
  "clerkId": "user_3D4a6O7SZPH0MH3cLxJ2sMybvSW",
  "email": "user@example.com",
  "firstName": "Tran",
  "lastName": "Van A",
  "photoUrl": "https://example.com/avatar.jpg",
  "credits": 5
}
```

- **Response**:
  - 200 OK (thành công):
    ```json
    {
      "success": true,
      "data": {
        "clerkId": "user_3D4a6O7SZPH0MH3cLxJ2sMybvSW",
        "email": "user@example.com",
        "firstName": "Tran",
        "lastName": "Van A",
        "photoUrl": "https://example.com/avatar.jpg",
        "credits": 5
      },
      "statusCode": "OK"
    }
    ```
  - 401 UNAUTHORIZED (thiếu JWT token)
  - 403 FORBIDDEN (clerkId trong JWT không khớp với body)

---

## 5. REST API – Get User Credits

Lấy số credits hiện tại của user đã đăng nhập.

- **Method**: GET
- **URL**: `http://localhost:8080/api/users/credits`
- **Headers**:
  - `Authorization: Bearer {jwt_token_from_clerk}`
- **Body**: Không có

- **Response**:
  - 200 OK (thành công):
    ```json
    {
      "success": true,
      "data": {
        "credits": 5
      },
      "statusCode": "OK"
    }
    ```
  - 401 UNAUTHORIZED (thiếu JWT token hoặc token không hợp lệ)

---

## Configuration

```yaml
# application.yml
clerk:
  issuer: https://your-clerk-domain.clerk.accounts.dev
  webhook:
    secret: whsec_your_webhook_secret_here
```
