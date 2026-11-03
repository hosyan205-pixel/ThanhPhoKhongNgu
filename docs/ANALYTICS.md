# Thành Phố Không Ngủ — Analytics

Trạng thái: kế hoạch đo lường Phase 0. Chưa cài SDK, tạo kho dữ liệu hoặc gửi sự kiện.

## 1. Câu hỏi cần trả lời

- Người chơi có vào được thành phố trên desktop và mobile không?
- Người chơi có thực sự ở cùng phòng với người khác không?
- Tương tác nhẹ nhàng có được sử dụng không?
- Kết nối có ổn định và City Pulse có phản ánh đúng định nghĩa đã chốt không?
- Người chơi có tạo Share Card thành công không?

Không xem thời gian chơi dài là bằng chứng duy nhất của trải nghiệm tốt. Không suy luận sự cô đơn hoặc tình trạng tâm lý từ mood/thời gian online.

## 2. Sự kiện đề xuất

| Sự kiện | Nguồn | Khi nào ghi |
| --- | --- | --- |
| `visit_started` | Client | Bắt đầu lượt truy cập, theo quy tắc session sẽ chốt |
| `join_attempted` | Client | Người chơi yêu cầu vào thành phố |
| `room_joined` | Server | Hiện diện đã được chấp nhận, ghi một lần cho mỗi lần vào phòng |
| `join_failed` | Backend/client theo loại lỗi | Yêu cầu vào thất bại, có mã nguyên nhân chuẩn |
| `co_presence_observed` | Server | Lần đầu có ít nhất một người khác cùng phòng trong lượt vào |
| `interaction_accepted` | Server | Tương tác hợp lệ; `sit` ghi khi thực sự chuyển sang ngồi |
| `connection_interrupted` | Client | Kết nối đang hoạt động bị gián đoạn |
| `connection_restored` | Client | Nhận snapshot mới sau gián đoạn |
| `room_visit_ended` | Server | Rời/chuyển phòng/hết lease, kèm lý do và thời lượng server |
| `share_card_created` | Client | Card được xuất thành công |
| `share_action_invoked` | Client | Người chơi gọi thao tác chia sẻ hoặc lưu card |

Không dùng cả client và server để đếm cùng một lần tương tác. Không ghi event di chuyển mỗi frame, heartbeat hay mỗi lần snapshot như sự kiện sản phẩm.

## 3. Schema tối thiểu và dữ liệu cấm

Trường đề xuất: tên sự kiện, phiên bản schema, event ID chống trùng, thời gian, nguồn, ID phân tích ngắn hạn khi cần, loại thiết bị thô, phiên bản ứng dụng, địa điểm và mã lỗi/action trong danh mục.

Không gửi token, session ID xác thực, IP thô, tọa độ chi tiết, đối tượng nhận tương tác, định danh tài khoản bền vững, nội dung card hoặc chuỗi nhập tự do. Không ghi mood cá nhân trong event mặc định. ID phân tích tách khỏi ID xác thực và phải có vòng đời được duyệt; đây vẫn có thể là dữ liệu có khả năng liên kết.

## 4. Định nghĩa chỉ số

| Chỉ số | Cách tính/phạm vi |
| --- | --- |
| Tỷ lệ vào thành công | Số join attempt có server chấp nhận / tổng attempt hợp lệ; liên kết bằng ID tương quan không dùng làm token |
| Thời gian vào phòng | Từ thao tác yêu cầu join tới snapshot đầu tiên được client áp dụng; báo phân vị và tách thiết bị |
| Tỷ lệ đồng hiện diện | Lượt vào phòng có `co_presence_observed` / lượt vào phòng thành công |
| Tỷ lệ sử dụng tương tác | Lượt vào phòng có ít nhất một tương tác được chấp nhận / lượt vào phòng thành công |
| Thời lượng ở phòng | Từ server join tới rời/hết lease; trường hợp mất kết nối có sai số do timeout cần ghi rõ |
| Gián đoạn và phục hồi | Số gián đoạn trên giờ kết nối; phân vị thời gian tới snapshot phục hồi |
| Tỷ lệ tạo card thành công | Lần tạo card thành công / lần yêu cầu tạo card; cần bộ đếm attempt cùng định nghĩa |
| Tỷ lệ gọi chia sẻ | Lượt truy cập gọi share/save / lượt truy cập đủ điều kiện; không diễn giải là số bài đăng mạng xã hội |

Khách truy cập, phiên truy cập, lần vào phòng và người dùng duy nhất là các khái niệm khác nhau. Định nghĩa session timeout phải chốt trước tính funnel. Không đo retention xuyên ngày nếu chưa duyệt định danh phù hợp.

## 5. City Pulse và quan sát kỹ thuật

City Pulse là tính năng vận hành dựa trên presence còn hiệu lực, không dùng số event analytics hoặc DAU để thay thế online. Cùng một danh tính không được cộng nhiều lần chỉ vì reconnect/nhiều tab; chính sách dedup cần thống nhất với thiết kế phiên.

Metric kỹ thuật gồm lỗi API/WebSocket, lỗi schema, rate limit, join latency, reconnect, phòng đang hoạt động, sức chứa, độ trễ tổng hợp Pulse và tài nguyên. Tách metric/log kỹ thuật khỏi phân tích hành vi, có retention và quyền truy cập riêng.

## 6. Chất lượng và quyền riêng tư

- Event có version, chống trùng và quy tắc xử lý event đến muộn.
- Kiểm tra đối chiếu server count với nhiều client, reconnect và nhiều tab; không chỉ kiểm tra event đã được gửi.
- Không trộn dữ liệu dev/test với dữ liệu người dùng thật; công bố sampling nếu có.
- Chặn hoặc loại traffic kiểm thử/nội bộ theo quy tắc được chốt.
- Trước thu thập thật: duyệt danh sách event/trường, retention, quyền truy cập, cơ chế đồng ý khi cần và yêu cầu xóa theo `SECURITY.md`.

## 7. Chưa quyết định

Nhà cung cấp/kho analytics; session timeout; cửa sổ báo cáo; event attempt cho thao tác tạo card; định danh ngắn hạn; sampling; consent; retention; mục tiêu định lượng và dashboard tối thiểu. Không tự thêm công cụ analytics vào stack ở Phase 0.
