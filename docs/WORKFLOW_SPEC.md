# Đặc tả luồng nghiệp vụ

Chỉ các bước, trạng thái và quyền được yêu cầu mới được mô hình hóa. Chỉnh sửa phiếu chờ duyệt không tự duyệt; nút **Điều chỉnh** và **Duyệt** tách biệt. Không xóa lịch sử, mã phiếu hay tệp đính kèm khi sửa.

## 1. Thu mua Nguyên vật liệu thô

1. Owner/Manager tạo phiếu tổng gồm khối lượng cần mua, giá trần và một hoặc nhiều Purchasing Staff được giao. Không có trường tên/loại nguyên liệu.
2. Owner tạo: phiếu chuyển thẳng sang **Đang thu mua**. Manager tạo: phiếu ở **Chờ Owner duyệt giá trần**. Owner có thể điều chỉnh, lưu riêng; phiếu vẫn chờ đến khi Owner bấm duyệt. Manager không thể thay Owner duyệt.
3. Chỉ Purchasing Staff được giao trong phiếu tổng đã được phép thực hiện mới tạo phiếu mua con. Mỗi phiếu con ghi Supplier hiện có, khối lượng cân tại xưởng, giá mua thực tế, ảnh xe cân (bắt buộc) và hóa đơn (nếu có). Có thể có nhiều phiếu con/lần mua; khối lượng cân cộng dồn vào phiếu tổng.
4. Sau khi gửi, phiếu cân ở **Chờ duyệt cân**. Owner hoặc Manager duyệt một lần; tiếp theo là **Chờ kho xác nhận nhập**.
5. Warehouse Staff cập nhật khối lượng thực nhận ngay trên phiếu con rồi xác nhận nhập. Tồn Nguyên vật liệu thô tăng theo khối lượng thực nhận; trạng thái phiếu thành **Đã nhập kho**.

Không có trường/trạng thái thanh toán trong phiếu mua. Thu/chi và công nợ nằm ở Tài chính.

## 2. Kế hoạch sản xuất và QC

1. Owner/Manager lập kế hoạch với ngày, ca, máy, mục tiêu và một hoặc nhiều công nhân. Không chọn nguyên liệu trong kế hoạch.
2. Production Staff được giao gửi báo cáo cuối ca gồm Nguyên vật liệu thô đã dùng, Viên nén thành phẩm, số bao/mã bao tự tạo theo lô và ảnh bắt buộc. Báo cáo chuyển **Chờ QC**.
3. QC Staff ghi từng bao: độ tro, độ tạp chất, lượng mẫu theo gram, ảnh lượng mẫu, ảnh sau kiểm tra và vị trí Kho A/Kho B. Không có kết quả đạt/không đạt/kiểm tra lại hoặc làm lại.
4. QC gửi báo cáo sang **Chờ duyệt**. Owner/Manager duyệt riêng, trạng thái sang **Chờ kho xác nhận nhập**.
5. Warehouse Staff xác nhận danh sách bao đã phân loại. Bao được ghi vào Kho A/Kho B và thành **Đã nhập kho**.

## 3. Sự cố và bảo trì máy

1. Công nhân vận hành báo máy, chọn một mức **Nhẹ/Trung bình/Nặng/Khẩn cấp**, mô tả và ảnh bắt buộc. Nhẹ/Trung bình cho phép tiếp tục dùng; Nặng/Khẩn cấp dừng máy.
2. Owner/Manager tiếp nhận và phân công Maintenance Staff. Bảo trì có thể bắt đầu nếu đủ vật tư.
3. Nếu thiếu vật tư, Maintenance Staff gửi yêu cầu tên vật tư và số lượng (**Chờ duyệt**). Owner/Manager duyệt riêng. Sau khi mua, chính Owner/Manager ghi mặt hàng và giá mua; chi phí được tạo ở Tài chính. Maintenance Staff xác nhận đã nhận vật tư.
4. Bảo trì gửi báo cáo tình trạng máy sau sửa, vật tư đã dùng và ảnh bắt buộc. Máy dừng ở **Chờ duyệt sau sửa chữa**.
5. Owner/Manager duyệt báo cáo. Máy có mức Nặng/Khẩn cấp chỉ trở lại **Đang hoạt động** sau khi duyệt. Mức độ sự cố và tình trạng máy là hai dữ liệu riêng.

## 4. Đề xuất xuất hàng và giao nhận

1. Warehouse Staff chọn Kho A hoặc Kho B, số bao và gửi đề xuất. Hệ thống hiển thị các mã bao sẵn có và các bao sẽ lấy theo thứ tự nhập; tồn chỉ giảm khi xác nhận xuất thực tế.
2. Owner chọn Customer và giá dự kiến. Manager có thể đề xuất Customer nhưng không nhập giá. Owner duyệt Customer và giá riêng; tiếp đó Manager liên hệ khách ngoài hệ thống.
3. Nếu khách không mua, Manager báo Owner để đổi Customer hoặc duyệt lại đề xuất Customer mới. Nếu khách đồng ý, Manager ghi người nhận và biển số dự kiến.
4. Warehouse Staff đối chiếu người/xe. Khớp thì được xác nhận xuất; không khớp thì dừng và trả Manager cập nhật.
5. Warehouse Staff xác nhận số lượng đã xuất và ảnh minh chứng bắt buộc; tồn giảm sau xác nhận.

**Cần xác nhận:** quy tắc đổi từ kg thành số bao; việc giữ trước bao giữa lúc duyệt đề xuất và lúc xuất; xử lý giao một phần/sai lệch số lượng; trường thông tin tài chính chi tiết ngoài các lần thu/chi và trạng thái Đã thu/Chưa thu, Đã trả/Chưa trả; ngưỡng/đơn vị chuẩn cho thông số QC; trạng thái cuối sau yêu cầu vật tư/sửa chữa đối với mức Nhẹ/Trung bình; cách xử lý trả lại/từ chối ở các bước chưa định nghĩa. UI không tự thêm ngưỡng, công thức hoặc trạng thái để thay thế các điểm này.
