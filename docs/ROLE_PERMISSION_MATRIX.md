# Ma trận vai trò và quyền

Ký hiệu: **Có** = được phép; **Theo phân công** = chỉ hồ sơ/công việc được giao hoặc cần cho thao tác; **Không** = không có quyền theo yêu cầu. Owner kế thừa các quyền nghiệp vụ của Manager. Admin chỉ có quyền quản trị tài khoản, không có quyền nghiệp vụ mặc định.

| Tác vụ | Owner | Manager | Công nhân | Thu mua | Thủ kho | QC | Bảo trì | Admin |
|---|---|---|---|---|---|---|---|---|
| Xem tổng quan/báo cáo nghiệp vụ | Có | Có | Không | Không | Không | Không | Không | Không |
| Tạo phiếu thu mua tổng | Có | Có | Không | Không | Không | Không | Không | Không |
| Điều chỉnh/duyệt giá trần do Manager tạo | Có | Không | Không | Không | Không | Không | Không | Không |
| Tạo phiếu mua con | Không | Không | Không | Theo phân công | Không | Không | Không | Không |
| Duyệt phiếu cân | Có | Có | Không | Không | Không | Không | Không | Không |
| Cập nhật/xác nhận nhận NVL thô | Không | Không | Không | Không | Có | Không | Không | Không |
| Xem Kho nguyên vật liệu thô/Kho viên nén thành phẩm | Có | Có | Không | Không | Có | Không | Không | Không |
| Tạo kế hoạch/phân công ca | Có | Có | Không | Không | Không | Không | Không | Không |
| Gửi báo cáo cuối ca/báo sự cố | Không | Không | Theo phân công/vận hành | Không | Không | Không | Không | Không |
| Kiểm tra bao/gửi QC | Không | Không | Không | Không | Không | Theo phân công | Không | Không |
| Duyệt QC | Có | Có | Không | Không | Không | Không | Không | Không |
| Xác nhận nhập thành phẩm | Không | Không | Không | Không | Có | Không | Không | Không |
| Tiếp nhận sự cố/phân công bảo trì | Có | Có | Không | Không | Không | Không | Không | Không |
| Yêu cầu vật tư / gửi báo cáo sửa chữa | Không | Không | Không | Không | Không | Không | Theo phân công | Không |
| Duyệt yêu cầu vật tư/báo cáo sửa chữa | Có | Có | Không | Không | Không | Không | Không | Không |
| Lập đề xuất xuất hàng | Không | Không | Không | Không | Có | Không | Không | Không |
| Chọn/duyệt Customer và giá bán | Có | Không | Không | Không | Không | Không | Không | Không |
| Đề xuất Customer, liên hệ ngoài hệ thống, ghi người/xe | Có | Có | Không | Không | Không | Không | Không | Không |
| Đối chiếu người/xe, xác nhận xuất thực tế | Không | Không | Không | Không | Có | Không | Không | Không |
| Xem Supplier | Có | Có | Không | Có | Không | Không | Không | Không |
| Tạo/xem/sửa/đổi trạng thái Supplier | Có | Không | Không | Không | Không | Không | Không | Không |
| Xem Customer | Có | Có | Không | Không | Theo phiếu được giao | Không | Không | Không |
| Tạo/xem/sửa/đổi trạng thái Customer | Có | Không | Không | Không | Không | Không | Không | Không |
| Xem/ghi tài chính, công nợ và chi phí | Có | Có | Không | Không | Không | Không | Không | Không |
| Tạo/xem/sửa/khóa tài khoản và gán vai trò | Không | Không | Không | Không | Không | Không | Không | Có |

Hồ sơ Supplier/Customer không xóa cứng; Owner chuyển trạng thái **Đang hợp tác/Ngừng hợp tác**. Hồ sơ ngừng hợp tác vẫn được giữ để truy xuất giao dịch và công nợ. Purchasing Staff chỉ xem Supplier; nhân viên khác không có danh sách Customer. Admin không xem dữ liệu vận hành nếu không được cấp quyền cụ thể.

**Cần xác nhận:** tùy chọn quyền chi tiết Admin có thể cấp; phạm vi dữ liệu theo nhà máy; điều kiện chính xác để xác định hồ sơ Supplier/Customer không còn giao dịch xử lý trước khi chuyển sang Ngừng hợp tác; chính sách mật khẩu khởi tạo và đổi mật khẩu. Prototype chỉ cho Owner ngừng hợp tác khi không còn phiếu thu/chi chưa tất toán, công nợ mở hoặc phiếu thu mua/xuất hàng đang xử lý; không xóa hồ sơ.
