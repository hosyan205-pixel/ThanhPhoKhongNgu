# Thành Phố Không Ngủ — Security

Trạng thái: yêu cầu và ranh giới an toàn Phase 0, chưa phải xác nhận hệ thống đã an toàn hoặc đáp ứng quy định cụ thể.

## 1. Tài sản và biên tin cậy

Bảo vệ phiên người chơi, quyền vào phòng, sự toàn vẹn trạng thái realtime, bí mật backend và dữ liệu tổng hợp. Trình duyệt và mọi payload từ client đều không đáng tin cậy.

Các biên cần kiểm tra: browser → Worker, Worker → Durable Object, backend → PostgreSQL và hệ thống → nơi thu analytics/log.

## 2. Nguy cơ và kiểm soát

| Nguy cơ | Kiểm soát nền tảng |
| --- | --- |
| Giả mạo người chơi hoặc phòng | Ràng buộc phiên với kết nối và quyền phòng; bỏ ID tự khai từ client |
| Teleport, tốc độ sai, chiếm ghế | Server kiểm tra di chuyển, vật cản và chuyển trạng thái nguyên tử |
| Spam tương tác, kết nối, resync | Rate limit theo phiên/kết nối và giới hạn tổng; IP chỉ là tín hiệu bổ sung |
| Replay, reconnect tạo hiệu ứng lặp | Request ID, dedup hữu hạn, quyền ngắn hạn và epoch |
| Payload lỗi hoặc tiêu tốn tài nguyên | Zod, allowlist, giới hạn byte/độ sâu/số lượng và hàng đợi |
| Truy cập dữ liệu người khác | Kiểm tra quyền ở backend, quyền DB tối thiểu và RLS khi áp dụng |
| Lộ bí mật qua bundle/log/card | Tách secret backend, redaction, kiểm tra artifact và template card |
| Suy ra mood của cá nhân từ Pulse | Ngưỡng tổng hợp, không công khai nhóm quá nhỏ hoặc lịch sử cá nhân |

Các ngưỡng cụ thể là gate trước thử nghiệm tương ứng, không để “sẽ bổ sung sau” khi phát hành.

## 3. Phiên và kết nối

- Chốt mô hình khách/đăng nhập trước triển khai danh tính; không tự thêm email, mật khẩu hoặc nhà cung cấp OAuth.
- Quyền kết nối phải có thời hạn, phạm vi phòng và cơ chế thu hồi/hết hạn.
- Kiểm tra allowlist Origin khi nâng cấp WebSocket. CORS không thay thế xác thực hoặc kiểm tra Origin của WebSocket.
- Nếu dùng cookie: đặt thuộc tính bảo vệ phù hợp và kiểm soát CSRF cho yêu cầu thay đổi trạng thái.
- Nếu dùng token: chốt cách lưu/truyền phù hợp trình duyệt; tránh URL/log và không lưu token dài hạn tùy tiện phía client.
- Chính sách nhiều tab, duplicate session, reconnect và chuyển phòng phải ngăn hiện diện trùng và lệnh từ kết nối cũ.

## 4. Quyền riêng tư

- Chỉ thu dữ liệu phục vụ tính năng/đo lường đã được xác nhận; không thu nội dung tự do.
- Không dùng mood như chẩn đoán, hồ sơ tâm lý hoặc tín hiệu quảng cáo cá nhân hóa.
- Không đưa session ID, token, vị trí chi tiết, IP thô hoặc định danh bền vững vào Share Card và analytics sản phẩm.
- Client chỉ nhận trạng thái cần thiết của người chơi cùng phòng; Pulse chỉ trả tổng hợp theo quy tắc đã chốt.
- Retention, thông báo dữ liệu, cơ chế đồng ý khi cần và cách yêu cầu xóa phải được chốt trước beta có người dùng thật. Yêu cầu pháp lý cụ thể cần đánh giá theo khu vực phát hành; chưa có kết luận pháp lý trong Phase 0.

## 5. An toàn tương tác

Không có chat không loại bỏ nguy cơ quấy rối: người chơi vẫn có thể spam, bám theo hoặc gửi tương tác lặp. Cooldown và giới hạn nhắm đích phải được thử trước beta.

Cần quyết định liệu bộ tương tác giới hạn và kiểm soát server đã đủ cho nhóm thử nghiệm, hay cần cơ chế mute/block/report. Các cơ chế này chưa nằm trong phạm vi được duyệt; nếu cần thì trình thay đổi scope và gate phát hành, không tự xây. Không phát hành rộng khi rủi ro nghiêm trọng còn chưa có biện pháp xử lý.

Chính sách tuổi, xử lý vi phạm, đầu mối tiếp nhận vấn đề và quyền truy cập vận hành chưa chốt.

## 6. Vận hành và kiểm tra

- Tách cấu hình dev/test/production; quản lý và xoay secret phía backend.
- Không log token, payload đầy đủ hoặc dữ liệu riêng tư; log lỗi bằng mã và định danh tương quan có hạn lưu giữ.
- Chốt giới hạn kết nối/phòng, backpressure, ngắt client chậm và ngân sách tài nguyên.
- Kiểm tra negative case: truy cập trái quyền, sai Origin, phiên hết hạn, ID giả, payload quá lớn, flooding, replay và rò dữ liệu giữa phòng.
- Trước beta: có quy trình thu hồi phiên, xử lý sự cố, hạn chế truy cập vận hành và khôi phục theo yêu cầu dữ liệu thực tế.

Định nghĩa metric và sự kiện thu thập nằm ở `ANALYTICS.md`; điều kiện nghiệm thu ở `ROADMAP.md`.
