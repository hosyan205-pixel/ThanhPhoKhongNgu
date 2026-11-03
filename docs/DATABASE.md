# Thành Phố Không Ngủ — Database

Trạng thái: mô hình khái niệm Phase 0. Không có database, SQL, migration hoặc tài khoản dịch vụ được tạo.

## 1. Định hướng lưu trữ

PostgreSQL/Supabase lưu dữ liệu bền vững tối thiểu khi có nhu cầu sản phẩm đã được duyệt. Việc chọn Supabase chưa đồng nghĩa dùng Supabase Auth, Storage hoặc Realtime.

Đề xuất mặc định không lưu lịch sử vị trí, lịch sử mood hoặc quan hệ giữa người gửi/nhận tương tác. Không tạo bảng chỉ để dự phòng cho tính năng ngoài MVP.

## 2. Phân loại dữ liệu

| Dữ liệu | Nguồn chân lý | Vòng đời đề xuất |
| --- | --- | --- |
| Vị trí, tư thế, ghế, thành viên phòng | Durable Object phòng | Trong phiên/phòng; phục hồi theo thiết kế Phase 2 |
| Hiệu ứng tương tác | Durable Object phòng | Ngắn hạn, tự hết hạn |
| Presence lease | Realtime/backend | Hết hạn theo timeout; không phải lịch sử online |
| City Pulse | Tổng hợp từ phòng | Cache có TTL, có thể tái tạo |
| Danh mục avatar/mood/địa điểm | Cấu hình có phiên bản | Có thể nằm cùng mã nguồn; chưa cần bảng DB |
| Danh tính và lựa chọn cần ghi nhớ | PostgreSQL nếu được duyệt | Theo chính sách danh tính/lưu giữ sẽ chốt |
| Analytics | Pipeline/kho sẽ chốt | Hạn lưu giữ riêng; không ghi mỗi frame |
| Share Card | Đề xuất tạo phía client | Không mặc định upload hoặc lưu bản sao server |

Durable Object có thể cần storage phục vụ phục hồi hoặc điều phối; quyết định này không biến PostgreSQL thành kho ghi realtime.

## 3. Thực thể bền vững đề xuất

Các thực thể dưới đây là ứng viên, không phải yêu cầu tạo toàn bộ bảng.

| Thực thể | Trường logic tối thiểu | Điều kiện sử dụng |
| --- | --- | --- |
| `player_identity` | ID nội bộ opaque, loại danh tính, tham chiếu auth nếu có, thời điểm tạo | Sau khi chốt khách/đăng nhập và nhu cầu lưu bền vững |
| `player_preferences` | Player ID, avatar ID, thời điểm cập nhật | Chỉ khi duyệt ghi nhớ lựa chọn qua phiên |

Mood hiện tại thuộc trạng thái phòng; không tự lưu vào preferences. Nếu MVP chỉ dùng phiên tạm và không có dữ liệu cần lưu bền vững, không bắt buộc tạo hai thực thể trên chỉ để sử dụng stack.

Không có bảng chat, inventory, giao dịch, guild, pet, housing, NFT hoặc marketplace.

## 4. Ràng buộc cần có khi triển khai

- ID không tuần tự lộ ra ngoài; ID hiện diện công khai khác ID danh tính nội bộ và có vòng đời ngắn.
- Tham chiếu preference phải có chủ sở hữu hợp lệ, tối đa một bản ghi hiện tại cho mỗi người chơi nếu dùng mô hình này.
- Avatar/mood/địa điểm phải được backend kiểm tra với danh mục phiên bản hợp lệ; không nhận tùy ý từ client.
- Thời gian do server xác lập và lưu nhất quán theo UTC; giao diện có thể định dạng theo múi giờ người dùng.
- Ràng buộc unique, khóa ngoại và index chỉ chốt sau khi có truy vấn thực tế; tránh index/JSON tùy ý để đón tính năng tương lai.

## 5. Ranh giới truy cập

Backend là đường truy cập dữ liệu bền vững; không đưa thông tin kết nối PostgreSQL hoặc khóa đặc quyền cho client. Dùng truy vấn tham số hóa và quyền DB tối thiểu.

Nếu có API bảng Supabase được expose, phải kiểm tra RLS/quyền hoặc vô hiệu hóa đường truy cập không dùng. Không coi khóa công khai hay RLS chưa kiểm chứng là ranh giới bảo vệ đủ.

Chọn cách kết nối Worker → PostgreSQL, quản lý pool/giới hạn kết nối và migration ở Phase 1; xác minh tích hợp trước khi tạo schema được duyệt ở Phase 2.

## 6. Lưu giữ, xóa và phục hồi

- Thời hạn giữ phiên, danh tính, analytics, log và bản sao lưu chưa chốt; cần bảng retention cụ thể trước thu thập dữ liệu thật.
- Quy trình xóa phải bao phủ bản ghi liên quan, cache và thời hạn tồn tại trong backup; không hứa xóa tức thời khỏi mọi backup.
- Phiên khách vẫn cần cơ chế xác minh quyền xóa nếu có dữ liệu bền vững; không tự nhận là vô danh hoàn toàn khi còn định danh kỹ thuật.
- Cần chốt backup, thử phục hồi, RPO/RTO và quyền vận hành trước beta nếu có dữ liệu bền vững.
- Migration phải có phiên bản, được rà soát và có kế hoạch phục hồi phù hợp. Không chỉnh schema production thủ công ngoài quy trình đã duyệt.

## 7. Chưa quyết định

Mô hình danh tính; có lưu preferences không; lựa chọn Supabase và dịch vụ đi kèm; schema vật lý; driver/kết nối; hệ thống migration; nơi lưu analytics; retention; backup và yêu cầu lưu trú dữ liệu.
