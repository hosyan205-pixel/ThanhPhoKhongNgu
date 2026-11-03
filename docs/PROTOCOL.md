# Thành Phố Không Ngủ — Protocol

Trạng thái: hợp đồng logic đề xuất v0 cho MVP. Tên message và trường dưới đây phục vụ rà soát; chưa có endpoint, schema Zod hoặc server được triển khai.

## 1. Nguyên tắc

- HTTP dùng cho khởi tạo phiên, cấp quyền vào phòng và lấy cấu hình/danh mục cần thiết.
- WebSocket dùng cho presence, di chuyển, mood và tương tác trong phòng.
- Chỉ backend xác định người gửi và phòng từ phiên/kết nối đã xác thực.
- Mỗi loại message có schema riêng, giới hạn kích thước và danh mục trường cho phép; từ chối trường lạ và giá trị ngoài miền.
- Không có message text chat, upload nội dung hoặc gửi lệnh tùy ý.

## 2. Khởi tạo và kết nối

1. Client lấy danh mục avatar, mood, địa điểm và phiên bản cấu hình.
2. Backend thiết lập/kiểm tra phiên theo cơ chế danh tính sẽ chốt.
3. Client yêu cầu vào địa điểm; backend chọn phòng và cấp quyền ngắn hạn ràng buộc phiên/phòng.
4. Worker kiểm tra quyền và Origin trước khi nâng cấp WebSocket tới Durable Object.
5. Server gửi `room.snapshot`; client chỉ áp dụng cập nhật thuộc epoch đó sau snapshot.

URL, HTTP method, mã HTTP, cơ chế truyền quyền WebSocket và TTL chưa chốt. Không đưa token dài hạn vào URL hoặc log. Lựa chọn phải hỗ trợ giới hạn của WebSocket trên trình duyệt.

## 3. Envelope đề xuất

| Trường | Áp dụng | Ý nghĩa |
| --- | --- | --- |
| `v` | Hai chiều | Phiên bản giao thức; đề xuất bắt đầu từ 1 khi triển khai |
| `type` | Hai chiều | Loại message trong allowlist |
| `requestId` | Lệnh client/phản hồi | Tương quan và chống xử lý lặp trong cửa sổ hữu hạn |
| `payload` | Hai chiều | Nội dung theo schema của `type` |
| `roomEpoch` | Sự kiện phòng | Thế hệ trạng thái; đổi khi phòng được tái tạo/reset |
| `seq` | Sự kiện phòng | Thứ tự tăng trong một epoch, do server cấp |
| `serverTime` | Server | Thời điểm tham chiếu; không dùng clock client để cấp quyền |

Client không được đặt `seq`, `serverTime` hoặc tự nhận `playerId` của người khác. Các message không thuộc luồng phòng, như lỗi trước join hoặc heartbeat, không cần sequence của phòng.

## 4. Client → server

| Loại | Payload logic | Kiểm tra bắt buộc |
| --- | --- | --- |
| `player.move` | Intent di chuyển, input sequence | Số hữu hạn, biên/vật cản, tốc độ, nhịp gửi, trạng thái ngồi |
| `player.mood.set` | `moodId` | Danh mục hợp lệ và rate limit |
| `player.interact` | `action`, đích nếu action yêu cầu | Allowlist, cùng phòng, khoảng cách, cooldown, đích còn tồn tại |
| `player.sit.set` | Ngồi/đứng, `seatId` khi cần | Ghế/vị trí hợp lệ, tranh chấp chỗ, chuyển trạng thái |
| `session.heartbeat` | Mã tương quan nếu cần | Phiên còn hiệu lực và giới hạn tần suất |
| `room.resync` | Epoch/sequence client đang có | Quyền trong phòng, giới hạn tần suất |

`player.interact` chỉ chứa `wave`, `heart`, `coffee`, `flower`. `sit` thuộc danh mục gameplay nhưng dùng lệnh trạng thái riêng để đồng bộ tư thế và ghế. Không tồn tại hai đường cập nhật tư thế.

Dạng intent di chuyển (vector hướng hay điểm đích), quy tắc ghế và tương tác có đích phải chốt trước tạo schema. Chọn/đổi avatar trong phiên chưa được mặc định là tính năng; lựa chọn ban đầu đi qua luồng join.

## 5. Server → client

| Loại | Nội dung |
| --- | --- |
| `room.snapshot` | Room ID, địa điểm, epoch, sequence mốc, self ID và danh sách trạng thái người chơi hiện tại |
| `player.joined` / `player.left` | Hiện diện vào/rời phòng |
| `player.updated` | Vị trí, mood, tư thế được server chấp nhận; input sequence đã xử lý nếu cần hòa giải |
| `interaction.played` | Action hợp lệ, người gửi/đích, thời hạn hiệu ứng |
| `command.result` | Request ID, chấp nhận/từ chối và mã lỗi; không thay cho cập nhật trạng thái |
| `session.heartbeat.ack` | Phản hồi heartbeat |
| `session.expired` | Phiên/quyền đã hết hiệu lực, client phải dừng gửi lệnh |

City Pulse là hợp đồng riêng `city.pulse`: scope, số online, mood aggregate đã áp dụng quy tắc riêng tư, thời điểm tổng hợp và dấu hiệu stale. Kênh HTTP polling hay realtime chưa chốt; không gắn vào sequence của một phòng.

## 6. Thứ tự, lặp và reconnect

- WebSocket giữ thứ tự trên một kết nối; giao thức không hứa giao hàng đúng một lần qua reconnect.
- Trong một epoch, bỏ qua cập nhật cũ/trùng; nếu phát hiện khoảng trống sequence thì yêu cầu resync.
- `seq` phải được định nghĩa theo luồng mà mọi client trong phòng nhận được; phản hồi riêng không làm hổng sequence broadcast. Nếu lọc theo người nhận sau này phải sửa hợp đồng.
- Snapshot thay trạng thái cục bộ tại sequence mốc; chỉ áp dụng cập nhật mới hơn. Không trộn hai epoch.
- Lệnh có `requestId` lặp được trả cùng kết quả trong cửa sổ dedup đã chốt; không phát tương tác lần hai.
- Sau reconnect nhận snapshot mới; không tự gửi lại tương tác xã hội hoặc intent cũ. Tắt hiệu ứng tạm đã hết hạn.
- Heartbeat, lease, backoff có jitter, cửa sổ dedup, hàng đợi và ngưỡng ngắt client chậm cần giá trị cụ thể ở Phase 2.

## 7. Lỗi và giới hạn

Mã lỗi logic đề xuất: `INVALID_MESSAGE`, `UNSUPPORTED_VERSION`, `UNAUTHORIZED`, `SESSION_EXPIRED`, `ROOM_FULL`, `INVALID_TARGET`, `OUT_OF_RANGE`, `COOLDOWN`, `RATE_LIMITED`, `RESYNC_REQUIRED`, `INTERNAL_ERROR`.

Không trả stack trace, token hoặc cấu trúc hạ tầng nội bộ. Payload quá lớn, sai schema lặp lại hoặc flooding có thể bị đóng kết nối theo chính sách đã chốt. Client phải xử lý message version không hỗ trợ bằng hướng dẫn tải lại, không tiếp tục áp dụng dữ liệu không hiểu.

## 8. Gate hợp đồng

Trước nghiệm thu Phase 2: chốt endpoint, phiên bản, đơn vị tọa độ, kiểu ID, giới hạn số/kích thước, tick rate, timeout, mã đóng socket và chiến lược phục hồi; kiểm tra join, disconnect, restart, lệnh trùng, payload lỗi và client chậm. Hợp đồng được cập nhật trước thay đổi không tương thích.
