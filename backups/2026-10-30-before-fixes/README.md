# BATT PPMS

Prototype frontend cho vận hành nhà máy viên nén. Đăng nhập, phân quyền, OTP và lưu dữ liệu được mô phỏng trong trình duyệt bằng `localStorage`.

## Chạy local

Yêu cầu Node.js 18 trở lên. Tại thư mục dự án, chạy:

```powershell
node server.js
```

Mở `http://127.0.0.1:8765`. Đây là máy chủ tĩnh để phục vụ HTML/CSS/JavaScript, không có API hoặc cơ sở dữ liệu.

Để bắt đầu lại dữ liệu mẫu, xóa dữ liệu trang web trong `localStorage` với khóa `batt-ppms-prototype-v1`.

## Tài khoản xem vai trò

Mật khẩu ban đầu cho cả tám tài khoản: `batt123`.

| Vai trò | Tên đăng nhập |
|---|---|
| Owner | `owner` |
| Manager | `manager` |
| Công nhân sản xuất | `production` |
| Nhân viên thu mua | `purchasing` |
| Thủ kho | `warehouse` |
| Nhân viên QC | `qc` |
| Nhân viên bảo trì | `maintenance` |
| Admin | `admin` |

Mật khẩu khởi tạo của các tài khoản được liệt kê là `batt123`. Đây là dữ liệu xem thử, không dùng cho tài khoản thật. Khi Admin tạo tài khoản mới, Admin nhập mật khẩu khởi tạo. Quy tắc độ dài/độ phức tạp mật khẩu cần được xác nhận. OTP khôi phục dùng mã cố định của prototype, không hiển thị trên giao diện và không gửi SMS/Zalo. Tài khoản do Admin tạo; không có đăng ký công khai.

## Đặc tả

- [Bản đồ màn hình](docs/SCREEN_MAP.md)
- [Ma trận quyền](docs/ROLE_PERMISSION_MATRIX.md)
- [Đặc tả luồng](docs/WORKFLOW_SPEC.md)
- [PRODUCT.md](PRODUCT.md)

Các mục chưa được quy định được đánh dấu **Cần xác nhận** trong đặc tả luồng và ma trận quyền.
