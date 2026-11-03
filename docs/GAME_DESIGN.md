# Thành Phố Không Ngủ — Game Design

Trạng thái: thiết kế nền tảng MVP; các quy tắc ghi “đề xuất” chưa phải quyết định sản phẩm cuối cùng.

## 1. Trụ cột trải nghiệm

- Đồng hành: sự hiện diện của người thật là trung tâm.
- Nhẹ nhàng: không cạnh tranh, chiến đấu hay áp lực thắng thua.
- Ít rào cản: phiên chơi ngắn vẫn có ý nghĩa.
- An toàn và riêng tư: biểu đạt bằng danh mục cố định, không nhập nội dung tự do.

## 2. Vòng lặp chính

Vào thành phố → chọn avatar/mood → đi lại → gặp người thật → tương tác → cảm nhận nhịp thành phố → ở lại, đổi địa điểm hoặc rời đi.

Không thêm điểm, tiền tệ, cấp độ, nhiệm vụ hoặc phần thưởng đăng nhập trong MVP.

## 3. Avatar và mood

- Avatar dùng danh mục có sẵn; chưa chốt số lượng và phong cách hình ảnh.
- Mood là lựa chọn chủ động của người chơi; chưa chốt danh sách hoặc số lượng.
- Không suy đoán mood từ hành vi hay suy diễn tình trạng sức khỏe tinh thần.
- Đề xuất chỉ biểu diễn mood hiện tại, không xây dựng lịch sử mood mặc định.
- Cần chốt việc mood có xuất hiện cạnh avatar hay chỉ dùng tổng hợp, và có cho phép không chia sẻ mood hay không.

## 4. Di chuyển và không gian

- Client gửi ý định di chuyển; server quyết định trạng thái vị trí hợp lệ.
- Bản đồ quy định vùng đi được, vật cản, điểm xuất hiện và vị trí ngồi.
- Điều khiển phải hỗ trợ desktop và cảm ứng; sơ đồ phím, chạm để đi hoặc joystick cần được thử và chốt.
- Một người chơi có một hiện diện đang hoạt động trong một phòng tại một thời điểm; chính sách nhiều tab cần chốt.
- Người chơi ở phòng khác không thấy hoặc tương tác trực tiếp với nhau dù cùng tên địa điểm.

## 5. Địa điểm dự kiến

| Địa điểm | Vai trò trải nghiệm | Cần chốt trước sản xuất |
| --- | --- | --- |
| Cafe 24h | Không gian gặp gỡ gần gũi, có chỗ ngồi | Bố cục, ghế, giới hạn phòng |
| Rooftop | Không gian thành phố về đêm | Bố cục, vùng đi lại, điểm xuất hiện |
| Beach | Không gian thư giãn bên biển | Bố cục, vùng đi lại, điểm xuất hiện |

Chưa mặc định thêm NPC, mini-game, nhạc có bản quyền hoặc cơ chế riêng cho từng địa điểm. Âm thanh, nếu được duyệt, phải có quyền sử dụng và cách tắt phù hợp với trình duyệt.

## 6. Tương tác MVP

| Tương tác | Ý nghĩa | Quy tắc nền tảng |
| --- | --- | --- |
| `wave` | Chào | Animation/tín hiệu có thời hạn |
| `heart` | Bày tỏ thiện cảm | Không tích lũy thành điểm hay vật phẩm |
| `coffee` | Gửi lời đồng hành | Không tạo inventory hoặc giao dịch |
| `flower` | Bày tỏ sự quan tâm | Không tạo inventory hoặc giao dịch |
| `sit` | Ngồi trong không gian | Là trạng thái tư thế, không chỉ hiệu ứng |

Đích của từng tương tác (bản thân, người khác hoặc môi trường), khoảng cách, cooldown, thời lượng và quy tắc hủy ngồi cần chốt trước Phase 3. Không bổ sung tương tác khác ngoài danh mục nếu chưa duyệt.

Server kiểm tra đích, phòng, khoảng cách và cooldown theo quy tắc đã chốt. Hành động bị từ chối có phản hồi rõ; không được phát cho người khác như đã thành công.

## 7. City Pulse

- Hiển thị số người online và phân bố mood tổng hợp.
- Đề xuất “online” là số hiện diện có lease còn hiệu lực, không phải số tài khoản từng truy cập hoặc tổng WebSocket thô.
- Cần chốt phạm vi toàn thành phố hay từng địa điểm; giao diện phải ghi đúng phạm vi.
- Cần chốt ngưỡng ẩn nhóm mood ít người, cách xử lý mood chưa chọn và mức trễ chấp nhận được.
- Khi dữ liệu chưa có hoặc quá hạn, hiển thị trạng thái chờ/cũ; không thay bằng số 0 giả hoặc số liệu mẫu.

## 8. Share Card

- Người chơi chủ động tạo, xem trước rồi dùng khả năng chia sẻ/lưu ảnh phù hợp trình duyệt.
- Đề xuất nội dung: tên game, hình ảnh địa điểm và mood của chính người tạo nếu họ chọn đưa vào.
- Không đưa avatar/định danh/mood của người khác, token, ID phiên hoặc dữ liệu nội bộ vào card.
- Bố cục, định dạng, kích thước, nội dung và cơ chế xuất ảnh chưa chốt.
- Xuất card không đồng nghĩa đã đăng lên mạng xã hội; không tự đăng thay người dùng.

## 9. Trạng thái lỗi và nghiệm thu

Thiết kế phải bao phủ: đang kết nối, mất kết nối, kết nối lại, phòng đầy, địa điểm trống, tương tác bị giới hạn, dữ liệu Pulse cũ và trình duyệt không hỗ trợ chia sẻ trực tiếp.

Các trạng thái này được kiểm tra trong gate gameplay và beta ở `ROADMAP.md`. Khả năng giảm chuyển động, độ rõ của mood và kích thước vùng chạm phải được xem xét khi chốt UI.
