# Cập nhật BATT PPMS · 30.10.2026

Tài liệu này được tạo trong lượt sửa hiện tại. Không tìm thấy bản cập nhật cùng tên từ phiên trước; không coi đây là tài liệu cũ đã được phục hồi.

## Nguồn đã mở

- Toàn bộ yêu cầu người dùng và tệp `Pasted text.txt` đính kèm.
- `PRODUCT.md`, `README.md`.
- `docs/WORKFLOW_SPEC.md`, `docs/ROLE_PERMISSION_MATRIX.md`, `docs/SCREEN_MAP.md`.
- `docs/IMPECCABLE_AUDIT.md`, `docs/IMPECCABLE_POLISH.md`.
- Skill Impeccable, các hướng dẫn critique/polish/audit, craft floor; kết quả `impeccable context --target app.js`, surface brief và `.impeccable/config.local.json`.
- `index.html`, `app.js`, `styles.css`, `server.js`.

Không có `.git` ở thư mục dự án nên `git status` không thực hiện được. Bản gốc các file ứng dụng được giữ trong `backups/2026-10-30-before-fixes/`; giữ nguyên khóa dữ liệu `batt-ppms-prototype-v1` và dữ liệu hiện có.

Không tìm thấy `BATT_SOURCE_OF_TRUTH.md`, business stories/use cases độc lập, bản cập nhật implementation cũ hoặc ảnh lỗi do người dùng cung cấp trong hai workspace được cấp quyền. Không có công cụ đọc ChatGPT Library/tài khoản cũ. Ảnh trong `tests/artifacts/` được tạo từ ứng dụng trong lượt kiểm tra này.

## Thay đổi đã thực hiện

- Đăng nhập một form gọn, trường trống, dùng username/điện thoại, hiện/ẩn mật khẩu. Khôi phục mật khẩu ba bước, một modal duy nhất, lỗi OTP và gửi lại mã; mã kiểm tra không xuất hiện trong UI.
- Sửa các alias nút tạo tài khoản và báo sự cố; nút Supplier/Customer mở form và lưu hồ sơ thật. Mã hồ sơ khi sửa chỉ đọc, giữ nguyên giao dịch/lịch sử; không xóa cứng. Chặn tài khoản trùng username/điện thoại khi tạo hoặc sửa.
- Sửa quyền mở chi tiết phiếu nhập của Thủ kho và QC của Owner/Manager. Kho có danh sách phiếu chờ nhập và lịch sử nhập; cập nhật thực nhận rồi xác nhận đúng một lần. Lịch sử trình duyệt không phục hồi quyền sau đăng xuất.
- Purchasing chỉ nhận phiếu tổng sau duyệt giá trần; chỉ tạo phiếu con trong phiếu tổng đang thu mua được giao. Owner tạo phiếu chuyển thực hiện ngay. Phiếu con điền sẵn phiếu tổng đang mở.
- Bổ sung Điều chỉnh riêng cho phiếu cân, toàn bộ báo cáo QC, yêu cầu vật tư và báo cáo sửa chữa. Lưu điều chỉnh vẫn chờ duyệt. Kiểm tra quyền và trạng thái tại thao tác gửi/duyệt.
- Kế hoạch chọn máy hiện có, công nhân có thể được phân công nhiều người. Chặn máy đang dừng; công nhân báo sự cố máy được giao. Báo cáo ca trừ lượng NVL thực dùng một lần và tạo mã từng bao.
- QC không có ngưỡng hoặc kết quả đạt/không đạt. Hai ảnh mỗi lần kiểm tra và phân Kho A/B được giữ. Không tự giao đợt mới cho tài khoản QC đầu tiên: đợt chưa có người kiểm tra thuộc công việc của vai trò QC; đợt đã có phân công vẫn giữ giới hạn người được giao. Khi gửi QC ghi nhận người thực hiện.
- Tách tình trạng vận hành máy khỏi mức độ sự cố và trạng thái sửa chữa. Sửa bàn giao vật tư đã mua, giữ riêng yêu cầu và vật tư mua thực tế. Máy dừng chỉ trở lại hoạt động sau duyệt báo cáo sửa chữa.
- Owner kế thừa thao tác liên hệ/giao nhận của Manager. Sai người/xe phải ghi lý do trả lại; chỉ xuất sau đối chiếu khớp, ảnh bắt buộc. Đề xuất chưa trừ tồn; bao được chọn theo thứ tự sản xuất. Không áp dụng tự động quy tắc xuất một phần.
- Tồn thành phẩm theo mã bao/Kho A/B; dữ liệu cũ chỉ có khối lượng và không có nguồn mã bao vẫn được giữ và hiển thị riêng, không tự đổi kg thành bao.
- Thu/trả nhiều lần trên cùng giao dịch, giữ mã và lịch sử. Kiểm tra số thu/trả vượt khoản còn lại và đối tượng không phù hợp. Không có lợi nhuận hoặc công thức tài chính mới.
- Search, nhiều filter đồng thời, sort số/ngày đúng giá trị, phân trang và xóa điều kiện. Thu mua chỉ xem thông tin liên hệ Supplier, không xem cột công nợ.
- Số nhập có dấu chấm hàng nghìn và dấu phẩy thập phân; giữ dữ liệu số để tính toán. Xem trước ảnh ngay sau chọn, mở ảnh lớn trong dialog; ảnh thay thế vẫn xem được trong lịch sử. Không báo lưu thành công khi localStorage đầy; phục hồi dữ liệu trước thao tác lỗi.
- Form/input/nút nhất quán; checkbox 18px, cả hàng chọn được; vùng bấm chính 44px. Chữ dữ liệu 15px, responsive desktop/điện thoại, focus và lỗi có nhãn. Giữ bảng màu xanh hiện có, bỏ panel quảng bá và CSS trang trí cũ.

## Kiểm tra và giới hạn

- `node --check app.js`: đạt.
- `node tests/workflows.cjs`: 22/22 đạt; kiểm tra các luồng và quyền bằng VM với dữ liệu riêng, không đụng dữ liệu người dùng.
- `node tests/browser.cjs`: 12/12 đạt, không có lỗi JavaScript chưa xử lý; kiểm tra trong Chromium thật bằng profile kiểm tra riêng; desktop 1440×1000 và điện thoại 390×844. Bao gồm OTP, tạo/sửa hồ sơ, tạo tài khoản, checkbox, nhập kho, QC, ảnh, bộ lọc/sort/phân trang, thu/trả nhiều lần và lịch sử trình duyệt.
- Impeccable detector trên `app.js` và `styles.css`: không có finding tại thời điểm kiểm tra. Đã mở ảnh render desktop/điện thoại để rà soát bố cục. Hướng dẫn và kết quả chi tiết ở `tests/README.md`.
- Chưa kiểm tra screen reader hoặc thiết bị cảm ứng thật. Không có backend, API xác thực hoặc dịch vụ OTP thật; giữ stack prototype hiện có.
- Những tệp cũ chỉ lưu tên ảnh không chứa dữ liệu ảnh không thể được khôi phục thành ảnh thực. Tên tệp được giữ nguyên; ảnh tải mới có nội dung và lịch sử đầy đủ.

## Quy tắc cần bổ sung thông tin

- Quy đổi kg/bao cho dữ liệu cũ; cách xử lý chênh lệch số lượng hoặc giao một phần.
- Giữ trước bao khi có nhiều đề xuất xuất đồng thời, và xử lý khi bao đề xuất đã được phiếu khác xuất.
- Đơn vị/độ chính xác/ngưỡng QC ngoài lượng mẫu theo gram; không tự đặt tiêu chuẩn.
- Cách phân công QC cụ thể nếu cần giao độc quyền cho một người trước kiểm tra.
- Quyền chi tiết ngoài tám vai trò, chính sách mật khẩu và quy trình trả lại/từ chối chưa được mô tả.

Yêu cầu trong prompt ngày 30.10.2026 được ưu tiên khi khác với các ghi chú cũ, đặc biệt việc bỏ nhãn môi trường khỏi UI. Cấu hình Impeccable báo chưa có `buildPath` cho trang quảng bá/trình diễn; không sửa cấu hình này vì các màn hình vận hành hiện tại làm trực tiếp bằng code.
