# Dashboard System

Hệ thống dashboard đã được tạo với các trang riêng biệt cho Admin và User dựa trên role.

## Cấu trúc

### 1. Role-based Routing

- Sau khi đăng nhập thành công, hệ thống sẽ tự động điều hướng dựa trên role của user:
  - **Admin**: Điều hướng đến `/(tabs)/admin-dashboard`
  - **User**: Điều hướng đến `/(tabs)/user-dashboard`

### 2. Admin Dashboard (`/admin-dashboard`)

**Chức năng dành cho Admin:**

- Thống kê tổng quan hệ thống
- Quản lý người dùng
- Quản lý phòng ban
- Quản lý công ty
- Báo cáo thống kê
- Cài đặt hệ thống

**Thống kê hiển thị:**

- Tổng số người dùng
- Số phòng ban
- Số công ty
- Người dùng đang hoạt động

### 3. User Dashboard (`/user-dashboard`)

**Chức năng dành cho User:**

- Thống kê hoạt động cá nhân
- Tạo công việc mới
- Xem công việc của tôi
- Thành viên nhóm
- Lịch làm việc
- Báo cáo cá nhân
- Hoạt động gần đây

**Thống kê hiển thị:**

- Công việc đã hoàn thành
- Công việc đang thực hiện
- Số thành viên nhóm
- Thông báo mới

### 4. Routing Logic

#### Root Layout (`app/_layout.tsx`)

```typescript
if (isAuthenticated && user) {
  if (user.role === "admin") {
    router.replace("/(tabs)/admin-dashboard");
  } else {
    router.replace("/(tabs)/user-dashboard");
  }
}
```

#### Tab Layout (`app/(tabs)/_layout.tsx`)

Đã thêm 2 tab mới:

- `admin-dashboard`: Hiển thị cho admin
- `user-dashboard`: Hiển thị cho user

#### Index Page (`app/(tabs)/index.tsx`)

Hoạt động như một router trung gian, điều hướng dựa trên role và hiển thị loading spinner.

## Tính năng

### Bảo mật

- Mỗi dashboard kiểm tra role của user trước khi hiển thị
- Tự động điều hướng nếu user không có quyền truy cập
- Redirect về login nếu chưa đăng nhập

### UI/UX

- Giao diện hiện đại với Gluestack UI
- Icons phù hợp cho từng chức năng
- Layout responsive
- Loading states
- Thông báo xác nhận trước khi đăng xuất

### Mở rộng

- Dễ dàng thêm các chức năng mới
- API endpoints có thể được implement sau
- Thống kê có thể được tích hợp với backend
- Có thể thêm các role khác ngoài admin/user

## Cần thực hiện tiếp

1. **Backend Integration:**

   - Tạo API endpoints cho thống kê admin
   - Tạo API endpoints cho thống kê user
   - Tích hợp các chức năng quản lý

2. **Chức năng nâng cao:**

   - Push notifications
   - Real-time updates
   - Export báo cáo
   - Tìm kiếm và filter

3. **Testing:**
   - Unit tests cho components
   - Integration tests cho routing
   - E2E tests cho user flows
