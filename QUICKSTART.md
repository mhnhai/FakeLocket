# 🚀 Quick Start Guide - FakeLocket

## Chạy ứng dụng trong 5 phút!

### Bước 1: Cài đặt Backend (2 phút)

```bash
# Clone hoặc vào thư mục backend
cd backend

# Cài đặt packages
npm install

# Tạo file environment
cp env.example .env

# Chỉnh sửa .env với thông tin database của bạn
# DATABASE_URL=postgresql://your_username:your_password@localhost:5432/fakelocket
```

### Bước 2: Setup Database (1 phút)

```bash
# Tạo database (thay đổi username nếu cần)
createdb fakelocket

# Chạy migrations
npm run migrate
```

### Bước 3: Chạy Backend (30 giây)

```bash
# Chạy server development
npm run dev

# ✅ Server sẽ chạy tại http://localhost:3000
```

### Bước 4: Cài đặt Frontend (1 phút)

```bash
# Mở terminal mới, vào thư mục frontend
cd frontend

# Cài đặt packages
npm install

# Nếu gặp lỗi dependency, thử clean và cài lại:
# npm run clean
# npm install
```

### Bước 5: Chạy Frontend (30 giây)

```bash
# Chạy Expo
npm start

# Chọn platform:
# - Nhấn 'a' cho Android
# - Nhấn 'i' cho iOS
# - Nhấn 'w' cho Web
```

## 🎉 Test thử ngay!

### Tạo tài khoản mới (với tenant mới):

1. Mở app và chọn "Đăng ký ngay"
2. Nhập thông tin cá nhân
3. ✅ Check "Tôi muốn tạo công ty mới"
4. Nhập tên công ty: "My Company"
5. Nhập OTP: "999888" (bất kỳ)
6. Đăng ký → Trở thành Admin!

### Hoặc tham gia tenant có sẵn:

1. Đăng ký với thông tin cá nhân
2. ❌ Không check "Tạo công ty mới"
3. Nhập OTP: "123456" (ABC Company)
4. Chọn phòng ban: "Development" hoặc "Marketing"
5. Đăng ký → Trở thành User!

## 🔧 Troubleshooting

**Backend không chạy?**

- Kiểm tra PostgreSQL đã start: `brew services start postgresql` (Mac) hoặc `sudo systemctl start postgresql` (Linux)
- Kiểm tra port 3000 có bị dùng: `lsof -i :3000`

**Frontend không connect được?**

- Đảm bảo backend đang chạy tại localhost:3000
- Kiểm tra file `frontend/services/api.ts` có đúng URL không

**Frontend npm install lỗi?**

- Chạy `npm run clean` để xóa cache
- Chạy lại `npm install`
- Hoặc xóa thủ công: `rm -rf node_modules package-lock.json && npm install`

**Metro bundler lỗi?**

- Chạy `npx expo start --clear` để clear cache
- Hoặc `rm -rf .expo` và chạy lại `npm start`

**Database lỗi?**

- Kiểm tra connection string trong .env
- Đảm bảo database "fakelocket" đã được tạo
- Chạy lại: `npm run migrate`

## 📱 Demo Flow

1. **Đăng ký** → Tạo company mới hoặc join company có sẵn
2. **Đăng nhập** → Vào app với email/password
3. **Xem profile** → Thông tin user, company, team
4. **Đăng xuất** → Về màn hình login

---

**🎯 Mục tiêu:** Trong 5 phút bạn sẽ có một app mobile hoàn chỉnh với authentication, multi-tenant, và team management!

**💡 Tips:** Sử dụng OTP "123456" hoặc "654321" để test với data có sẵn, hoặc tạo OTP mới để test flow tạo tenant.
