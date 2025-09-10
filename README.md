# FakeLocket - Mobile App với React Native & Node.js

Ứng dụng mobile được xây dựng với React Native (Expo), Node.js TypeScript backend và PostgreSQL database. Ứng dụng hỗ trợ hệ thống multi-tenant với authentication và quản lý team.

## 🏗️ Kiến trúc hệ thống

### Backend (Node.js + TypeScript)

- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT với bcrypt
- **Validation**: express-validator

### Frontend (React Native + Expo)

- **Framework**: Expo Router
- **UI Library**: Gluestack UI
- **State Management**: Zustand
- **API Client**: Axios với React Query
- **Styling**: NativeWind (Tailwind CSS)

### Database Schema

- **Users**: id, fullname, email, password, tenant_id, team_id, role, created_at
- **Tenants**: id, name, otp, created_at
- **Teams**: id, name, tenant_id, created_at

## 🚀 Cài đặt và chạy ứng dụng

### Yêu cầu hệ thống

- Node.js 18+
- PostgreSQL 12+
- Expo CLI
- React Native development environment

### 1. Setup Backend

```bash
# Vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp env.example .env

# Cấu hình database trong .env
DATABASE_URL=postgresql://username:password@localhost:5432/fakelocket
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

### 2. Setup Database

```bash
# Tạo database PostgreSQL
createdb fakelocket

# Chạy migrations để tạo tables (từ thư mục backend)
npm run migrate

# Hoặc chạy trực tiếp SQL
# psql -d fakelocket -f src/migrations/init.sql
```

### 3. Chạy Backend

```bash
# Development mode với nodemon (auto-reload)
npm run dev

# Production build
npm run build
npm start
```

Backend sẽ chạy tại: http://localhost:3000

### 4. Setup Frontend

```bash
# Vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Cập nhật API URL trong services/api.ts nếu cần
# Mặc định: http://localhost:3000/api
```

### 5. Chạy Frontend

```bash
# Chạy Expo development server
npm start

# Hoặc chạy trên platform cụ thể
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## 📱 Tính năng chính

### 🔐 Authentication

- **Đăng ký**: Hỗ trợ tạo tenant mới hoặc tham gia tenant có sẵn thông qua OTP
- **Đăng nhập**: Email/password với JWT token
- **Logout**: Xóa token và redirect về login

### 🏢 Multi-tenant System

- **Tenant**: Đại diện cho một công ty/tổ chức
- **Team**: Phòng ban trong công ty
- **OTP**: Mã xác thực để tham gia tenant

### 👥 User Management

- **Roles**: admin (người tạo tenant) và user
- **Profile**: Hiển thị thông tin cá nhân và công ty

## 🔄 Flow đăng ký

### Tạo tenant mới:

1. User nhập thông tin cá nhân
2. Chọn "Tôi muốn tạo công ty mới"
3. Nhập tên công ty và OTP mới
4. Hệ thống tạo tenant và team "General" mặc định
5. User trở thành admin của tenant

### Tham gia tenant có sẵn:

1. User nhập thông tin cá nhân
2. Nhập OTP của tenant
3. Xác thực OTP và chọn team
4. User trở thành member của team

## 🛠️ API Endpoints

### Authentication

- `POST /api/users/register` - Đăng ký user mới
- `POST /api/users/login` - Đăng nhập
- `GET /api/users` - Lấy danh sách users

### Tenants

- `POST /api/tenants/create` - Tạo tenant mới
- `POST /api/tenants/verify-otp` - Xác thực OTP tenant
- `GET /api/tenants` - Lấy danh sách tenants

### Teams

- `POST /api/teams/create` - Tạo team mới
- `GET /api/teams/tenant/:tenant_id` - Lấy teams theo tenant
- `GET /api/teams` - Lấy tất cả teams

### Health Check

- `GET /api/health` - Kiểm tra trạng thái server

## 🧪 Test Data

Database đã được seed với data mẫu:

**Tenants:**

- ABC Company (OTP: 123456)
- XYZ Corp (OTP: 654321)

**Teams:**

- Development, Marketing (thuộc ABC Company)
- Sales, Support (thuộc XYZ Corp)

## 🔧 Troubleshooting

### Backend Issues

- Kiểm tra PostgreSQL đã chạy và connection string đúng
- Đảm bảo đã chạy migrations
- Kiểm tra port 3000 không bị conflict

### Frontend Issues

- Đảm bảo backend đang chạy tại đúng URL
- Kiểm tra Metro bundler không bị cache (npx expo start -c)
- Đảm bảo device/simulator kết nối được với development server

### Database Issues

- Kiểm tra PostgreSQL service đang chạy
- Verify database credentials trong .env
- Kiểm tra firewall không block connection

## 📝 Notes

- App được thiết kế cho development, cần cấu hình thêm cho production
- JWT secret nên được generate random cho production
- Database connection nên sử dụng connection pooling cho production
- API URL trong frontend cần được cập nhật cho production deployment

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
