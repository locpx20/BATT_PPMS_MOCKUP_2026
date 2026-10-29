# Kiểm tra BATT PPMS

Chạy các kiểm tra nghiệp vụ bằng Node.js, không cần cài thư viện:

```powershell
node tests/workflows.cjs
```

`workflows.cjs` chạy bản sao mã nguồn trong bộ nhớ với dữ liệu riêng; không đọc hoặc thay đổi dữ liệu trình duyệt. Bộ kiểm tra gồm 22 tình huống quyền, thu mua, sản xuất, QC, bảo trì, xuất kho, hồ sơ đối tác, khôi phục mật khẩu, các lần thu/trả và hoàn tác khi bộ nhớ đầy.

`browser.cjs` kiểm tra 12 tình huống trên Chromium thật qua CDP. Trước khi chạy, khởi động `node server.js` trên cổng 8765 và một Chrome headless có **profile riêng dành cho kiểm tra**, bật `--remote-debugging-port=9226`. Script tạo tab kiểm tra và làm mới dữ liệu localStorage của BATT PPMS trong profile đó.

```powershell
node tests/browser.cjs
```

Ảnh kiểm tra được lưu ở `tests/artifacts/`, gồm kích thước desktop 1440 × 1000 và điện thoại 390 × 844. Script đóng kết nối kiểm tra khi xong và giữ trình duyệt chạy để xem tiếp; thêm `--close-browser` để đóng trình duyệt kiểm tra. Bộ kiểm tra không thay thế đánh giá screen reader hoặc thao tác trên thiết bị cảm ứng thật.
