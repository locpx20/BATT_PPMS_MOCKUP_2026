# Bản đồ màn hình

Các màn hình dưới đây dùng chung một ứng dụng SPA. Điều hướng được ghi vào URL để trình duyệt hỗ trợ Back/Forward. Menu, bản ghi và nút thao tác được lọc theo vai trò hiện tại.

## Màn hình dùng chung

- Đăng nhập bằng tên đăng nhập hoặc số điện thoại.
- Khôi phục mật khẩu theo thứ tự: định danh tài khoản → OTP 6 số → mật khẩu mới.
- Hồ sơ cá nhân, cập nhật hồ sơ, đổi mật khẩu và đăng xuất.

## Điều hướng theo vai trò

| Vai trò | Màn hình |
|---|---|
| Owner | Tổng quan; Thu mua NVL thô; Kế hoạch sản xuất; QC; Sự cố & bảo trì; Đề xuất xuất hàng; Kho nguyên vật liệu thô; Kho viên nén thành phẩm; Nhà cung cấp; Khách hàng; Tài chính; Báo cáo |
| Manager | Các màn hình nghiệp vụ của Owner với quyền Manager; xem Nhà cung cấp/Khách hàng; không duyệt các bước bắt buộc Owner và không quyết định giá bán |
| Production Staff | Công việc/ca được giao; báo cáo cuối ca; báo sự cố máy đã vận hành |
| Purchasing Staff | Phiếu thu mua tổng được giao; phiếu mua hàng con; danh sách Nhà cung cấp |
| Warehouse Staff | Kho nguyên vật liệu thô; Kho viên nén thành phẩm; phiếu nhập chờ xác nhận; đề xuất xuất hàng và giao nhận được giao |
| QC Staff | Đợt QC được giao; danh sách bao; biểu mẫu kiểm tra từng bao; báo cáo QC |
| Maintenance Staff | Sự cố được phân công; yêu cầu vật tư; báo cáo sửa chữa |
| Admin | Tài khoản; tạo/chỉnh sửa tài khoản; khóa/mở tài khoản; gán vai trò |

## Chi tiết và biểu mẫu

Danh sách mở trang chi tiết của đúng bản ghi, có mã, trạng thái, dữ liệu, lịch sử thao tác và tệp đính kèm. Biểu mẫu chỉnh sửa điền sẵn dữ liệu hiện có và lưu trên bản ghi cũ. Hành động phê duyệt, cập nhật và xác nhận được hiển thị riêng theo quyền.

**Cần xác nhận:** các bộ lọc theo ngày có cần quy tắc khoảng thời gian thống nhất hay không; phạm vi phân quyền theo cơ sở/nhà máy; quyền chi tiết Admin có thể gán ngoài vai trò.
