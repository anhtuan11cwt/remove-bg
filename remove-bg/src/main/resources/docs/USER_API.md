# User API – Tài liệu Postman

**Base URL**: `http://localhost:8080`
**Prefix**: `/api/users`

---

## 1. Tạo hoặc cập nhật người dùng (Clerk)

- **Method**: POST
- **URL**: `http://localhost:8080/api/users`
- **Authorization**: Có (Basic Auth hoặc Bearer Token từ Spring Security)
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "clerkId": "user_abc123",
  "email": "user@example.com",
  "firstName": "Nguyen",
  "lastName": "Van A",
  "photoUrl": "https://example.com/avatar.jpg",
  "credits": 10
}
```

- **Response**:
  - 200 (thành công):

```json
{
  "success": true,
  "data": {
    "clerkId": "user_abc123",
    "email": "user@example.com",
    "firstName": "Nguyen",
    "lastName": "Van A",
    "photoUrl": "https://example.com/avatar.jpg",
    "credits": 10
  },
  "statusCode": 200
}
```

  - 403 (không có quyền truy cập):

```json
{
  "success": false,
  "data": "Không có quyền truy cập",
  "statusCode": 403
}
```

---

## Ghi chú

- **Authentication**: API yêu cầu xác thực qua Spring Security. Clerk ID trong request phải khớp với username trong token xác thực (`auth.getName()`).
- **Purpose**: Endpoint này dùng để đồng bộ user từ Clerk (external auth provider) vào hệ thống.
- **Fields**:
  - `clerkId`: ID user từ Clerk (bắt buộc)
  - `email`: Email (bắt buộc)
  - `firstName`: Tên
  - `lastName`: Họ
  - `photoUrl`: URL avatar
  - `credits`: Số credit (mặc định có thể là null)