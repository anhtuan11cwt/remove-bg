# RemoveBG AI - Công Cụ Xóa Nền Ảnh Bằng AI

Dự án full-stack xóa nền ảnh tự động bằng AI với backend Spring Boot và frontend React, tích hợp thanh toán Stripe và xác thực người dùng qua Clerk.

## Kiến Trúc Dự Án

```
remove-bg/
├── client/                     # Frontend React (Vite)
└── remove-bg/                  # Backend Spring Boot
```

## Tính Năng Chính

- **Xóa nền ảnh tự động** - Tải ảnh lên và AI tự động xóa nền trong vài giây
- **Tích hợp Clipdrop API** - Sử dụng AI mạnh mẽ để xóa nền chính xác
- **Quản lý tín dụng** - Người dùng được cấp tín dụng miễn phí ban đầu, mua thêm khi cần
- **Thanh toán tích hợp** - Tích hợp Stripe Checkout để mua tín dụng
- **Xác thực người dùng** - Clerk cung cấp đăng nhập/đăng ký an toàn
- **Đồng bộ dữ liệu** - Webhook đồng bộ người dùng từ Clerk về database
- **Bảo mật JWT** - Xác thực requests với JWT từ Clerk

## Công Nghệ Sử Dụng

### Frontend (client)

- **Framework**: React 19.x + Vite 8.x
- **Styling**: Tailwind CSS 4.x
- **Routing**: React Router DOM 7.x
- **Authentication**: Clerk (@clerk/clerk-react)
- **HTTP Client**: Axios 1.x
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Payment**: @stripe/react-stripe-js, @stripe/stripe-js

### Backend (remove-bg)

- **Framework**: Spring Boot 3.5.x
- **Language**: Java 25
- **Build Tool**: Maven
- **Database**: MySQL 8.x
- **Security**: Spring Security + JWT (jjwt 0.12.x)
- **Image API**: Clipdrop API
- **Payment**: Stripe (stripe-java 24.x)
- **HTTP Client**: OpenFeign (Spring Cloud)
- **Dependencies**:
  - Spring Data JPA
  - Spring Validation
  - Spring Web
  - Lombok
  - Spring DevTools

## Cài Đặt Và Chạy Dự Án

### Điều Kiện Tiên Quyết

- Java 25+
- Node.js 18+
- Maven 3.x
- MySQL 8.0+ (đang chạy trên localhost:3306)
- Tài khoản Clerk (clerk.com)
- Tài khoản Clipdrop (clipdrop.co)
- Tài khoản Stripe (stripe.com)

### 1. Cấu Hình Backend

```bash
cd remove-bg
```

Tạo database:

```sql
CREATE DATABASE remove_bg_db;
```

Cấu hình `src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/remove_bg_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# JPA
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Clerk Authentication
clerk.issuer=https://abcde.clerk.accounts.dev
clerk.jwks.url=https://abcde.clerk.accounts.dev/.well-known/jwks.json
clerk.webhook.secret=whsec_...

# Clipdrop API
clipdrop.api.key=your_clipdrop_api_key

# Stripe Payment
stripe.key.id=sk_test_...
stripe.key.secret=sk_test_...

# Disable default security
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration
```

Chạy backend:

```bash
./mvnw spring-boot:run
```

Backend chạy tại: `http://localhost:8080`

### 2. Cấu Hình Frontend

```bash
cd client
npm install
```

Tạo file `.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BACKEND_URL=http://localhost:8080/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Chạy frontend:

```bash
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

## Cấu Trúc Backend

```
src/main/java/com/example/remove_bg/
├── RemoveBgApplication.java              # Main application
├── client/
│   └── ClipdropClient.java               # Feign client cho Clipdrop API
├── config/
│   └── SecurityConfig.java               # Security configuration
├── controller/
│   ├── ClerkWebhookController.java       # Webhook handlers
│   ├── ImageController.java             # Image processing endpoints
│   ├── OrderController.java            # Payment endpoints
│   └── UserController.java             # User endpoints
├── dto/
│   ├── CheckoutSessionDTO.java          # Stripe checkout DTO
│   ├── StripeOrderDTO.java             # Stripe order DTO
│   └── UserDTO.java                   # User DTO
├── entity/
│   ├── OrderEntity.java                # Order entity
│   └── UserEntity.java                # User entity
├── repository/
│   ├── OrderRepository.java             # Order JPA repository
│   └── UserRepository.java            # User JPA repository
├── response/
│   └── RemoveBgResponse.java          # API response wrapper
├── security/
│   ├── ClerkJwksProvider.java        # JWKS provider
│   └── ClerkJwtAuthFilter.java        # JWT authentication filter
├── service/
│   ├── RemoveBackgroundService.java   # Image processing interface
│   ├── StripeService.java             # Stripe payment interface
│   ├── UserService.java              # User service interface
│   └── impl/
│       ├── RemoveBackgroundServiceImpl.java  # Clipdrop implementation
│       ├── UserServiceImpl.java       # User implementation
│       ├── StripeServiceImpl.java     # Stripe implementation
│       └── OrderServiceImpl.java    # Order implementation
```

## Cấu Trúc Frontend

```
src/
├── assets/
│   └── assets.js                     # Image assets & constants
├── components/
│   ├── BgRemovalSteps.jsx          # Steps展示组件
│   ├── BgSlider.jsx                 # Image comparison slider
│   ├── Footer.jsx                   # Footer component
│   ├── Header.jsx                   # Hero section
│   ├── MenuBar.jsx                  # Navigation bar
│   ├── Pricing.jsx                  # Pricing plans
│   ├── Testimonials.jsx             # Testimonials
│   ├── TryNow.jsx                  # Upload section
│   └── UserSyncHandler.jsx           # User sync component
├── context/
│   └── AppContext.jsx                # Global state management
├── pages/
│   ├── BuyCredits.jsx               # Purchase credits page
│   ├── Home.jsx                    # Landing page
│   ├── PaymentSuccess.jsx          # Payment success page
│   └── Result.jsx                  # Result display page
├── service/
│   └── orderService.js             # Order payment service
├── App.jsx                         # Main app component
└── main.jsx                        # Entry point
```

## API Endpoints

### Users API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users` | Tạo hoặc cập nhật user |
| `GET` | `/api/users/credits` | Lấy số tín dụng của user |

### Images API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/images/remove-background` | Xóa nền ảnh (multipart/form-data) |

### Orders API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders?planId=` | Tạo Stripe checkout session |
| `POST` | `/api/orders/verify` | Xác minh thanh toán |

### Webhooks API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/webhooks/clerk` | Xử lý webhook từ Clerk |

## Bảo Mật

### Luồng Xác Thực JWT

1. User đăng nhập qua Clerk
2. Clerk cấp JWT token
3. Frontend lưu token và gửi trong header `Authorization: Bearer {token}`
4. Backend `ClerkJwtAuthFilter` xác thực token:
   - Lấy JWT từ header
   - Decode header để lấy `kid` (key ID)
   - Fetch public key từ Clerk JWKS
   - Verify chữ ký JWT
   - Lấy `sub` (clerkId) từ claims
   - Set vào SecurityContext

### JWT Configuration

- **Algorithm**: RS256
- **Issuer**: Clerk Frontend API URL
- **Validation**: Clock skew 60 giây
- **Cache**: JWKS cache 1 giờ

### CORS Configuration

```java
allowedOrigins: ["http://localhost:5173"]
allowedMethods: [GET, POST, PUT, DELETE, PATCH, OPTIONS]
allowedHeaders: [Authorization, Content-Type]
allowCredentials: true
```

### Public Endpoints

- `/api/webhooks/clerk` - Clerk webhook handler
- `/api/orders/verify` - Payment verification

## Database

### Bảng `users`

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT | Primary key (auto-increment) |
| `clerk_id` | VARCHAR(255) | Unique Clerk ID |
| `email` | VARCHAR(255) | Unique email |
| `first_name` | VARCHAR(255) | First name |
| `last_name` | VARCHAR(255) | Last name |
| `credits` | INTEGER | Số tín dụng |
| `photo_url` | VARCHAR(500) | Profile photo URL |

### Bảng `orders`

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT | Primary key (auto-increment) |
| `order_id` | VARCHAR(255) | Unique Stripe order ID |
| `clerk_id` | VARCHAR(255) | Clerk ID |
| `plan` | VARCHAR(255) | Tên gói |
| `amount` | INTEGER | Số tiền (VND) |
| `credits` | INTEGER | Số tín dụng mua |
| `payment` | BOOLEAN | Trạng thái thanh toán |
| `created_at` | DATETIME | Thời gian tạo |

## Các Gói Tín Dụng

| Tên Gói | Giá (VNĐ) | Tín Dụng |
|---------|-----------|----------|
| Cơ Bản | 149.000đ | 100 |
| Nâng Cao | 269.000đ | 250 |
| Cao Cấp | 449.000đ | 1000 |

## Thanh Toán Stripe

Dự án sử dụng Stripe Checkout với quy trình:

1. User chọn gói tín dụng
2. Frontend gọi `/api/orders?planId=` để tạo checkout session
3. Backend tạo Stripe Checkout Session và trả về URL
4. Frontend redirect đến Stripe Checkout
5. User thanh toán (thẻ, UPI, v.v.)
6. Stripe redirect về `/payment-success`
7. Frontend gọi `/api/orders/verify` để xác minh
8. Backend kiểm tra và cập nhật credits

## Tích Hợp Clipdrop API

1. Frontend gửi ảnh qua `FormData` đến `/api/images/remove-background`
2. Backend nhận file và gọi Clipdrop API qua Feign Client
3. Clipdrop API trả về ảnh đã xóa nền
4. Backend encode BASE64 và trả về cho frontend
5. Frontend hiển thị ảnh kết quả

## Clerk Webhook

Xử lý các sự kiện:

- `user.created` - Tạo user mới trong database
- `user.updated` - Cập nhật thông tin user
- `user.deleted` - Xóa user khỏi database

## UI/UX

- Responsive design với Tailwind CSS
- Font: Outfit (Google Fonts)
- Loading spinner khi xử lý ảnh
- Toast notifications cho feedback
- Image comparison slider
- Smooth transitions

## Build Production

### Backend

```bash
cd remove-bg
./mvnw clean package
java -jar target/remove-bg-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd client
npm run build
npm run preview
```

## Environment Variables

### Backend (.env / application.properties)

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/remove_bg_db
spring.datasource.username=root
spring.datasource.password=your_password

# Clerk
clerk.issuer=https://abcde.clerk.accounts.dev
clerk.jwks.url=https://abcde.clerk.accounts.dev/.well-known/jwks.json
clerk.webhook.secret=whsec_...

# Clipdrop
clipdrop.api.key=your_clipdrop_api_key

# Stripe
stripe.key.id=sk_test_...
stripe.key.secret=sk_test_...
```

### Frontend (.env)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BACKEND_URL=http://localhost:8080/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Testing

### Test Case 1: Xóa nền ảnh

1. Đăng ký/đăng nhập qua Clerk
2. Tải ảnh lên (Drag & drop hoặc click)
3. Chờ xử lý (loading spinner)
4. Xem ảnh kết quả
5. Tải ảnh về máy

### Test Case 2: Mua tín dụng

1. Đăng nhập
2. Click "Mua tín dụng"
3. Chọn gói
4. Thanh toán qua Stripe
5. Xác nhận tín dụng tăng

### Test Case 3: Webhook đồng bộ

1. Cập nhật profile trên Clerk
2. Kiểm tra database cập nhật
3. Xóa tài khoản Clerk
4. Kiểm tra record bị xóa khỏi database

## License

Dự án này được tạo ra cho mục đích học tập và portfolio.

## Tài Liệu Tham Khảo

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [React Documentation](https://react.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Clipdrop API](https://clipdrop.co/apis)
- [Tailwind CSS](https://tailwindcss.com/docs)