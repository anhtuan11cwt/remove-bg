# Image API – Tài liệu Postman

**Base URL**: `http://localhost:8080`  
**Prefix**: `/api/images`

---

## 1. Remove Background

Xóa background của ảnh và trả về ảnh đã xử lý dạng base64.

- **Method**: POST
- **URL**: `http://localhost:8080/api/images/remove-background`
- **Authorization**: Bearer Token (JWT từ Clerk)
- **Headers**:
  - `Authorization: Bearer {jwt_token_from_clerk}`
- **Body** (form-data):

| Key  | Type | Value |
|------|------|-------|
| file | File | [Chọn file ảnh: .jpg, .png, .jpeg] |

- **Response**:
  - 200 OK (thành công):

```json
{
  "success": true,
  "data": {
    "image": "/9j/4AAQSkZJRgABAQAAAQ...",
    "remainingCredits": 4
  },
  "statusCode": 200
}
```

  - 400 BAD_REQUEST (file rỗng):

```json
{
  "success": false,
  "data": "File rỗng",
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

  - 403 FORBIDDEN (không đủ tín dụng):

```json
{
  "success": false,
  "data": "Không đủ tín dụng. Vui lòng mua thêm tín dụng.",
  "statusCode": 403
}
```

  - 500 INTERNAL_SERVER_ERROR (lỗi xử lý ảnh):

```json
{
  "success": false,
  "data": "Lỗi xử lý ảnh: {error_message}",
  "statusCode": 500
}
```

---

## Ghi chú

- **Authentication**: API yêu cầu xác thực qua JWT token từ Clerk. Token cần được gửi trong header `Authorization: Bearer {token}`
- **Content-Type**: Khi gửi request với file, Postman sẽ tự động set `Content-Type: multipart/form-data` với boundary phù hợp
- **File format**: Chấp nhận các định dạng ảnh phổ biến (.jpg, .jpeg, .png)
- **Credits**: Mỗi lần xử lý ảnh thành công sẽ trừ 1 credit từ tài khoản user
- **Response image**: Ảnh trả về được encode dạng base64, có thể decode để hiển thị hoặc lưu file

---

## Ví dụ Postman

### Request

```
POST http://localhost:8080/api/images/remove-background
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="test-image.jpg"
Content-Type: image/jpeg

<binary data>
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

### Decode base64 image (JavaScript)

```javascript
const base64Image = response.data.image;
const byteCharacters = atob(base64Image);
const byteNumbers = new Array(byteCharacters.length);
for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
}
const byteArray = new Uint8Array(byteNumbers);
const blob = new Blob([byteArray], { type: 'image/png' });
const imageUrl = URL.createObjectURL(blob);
```
