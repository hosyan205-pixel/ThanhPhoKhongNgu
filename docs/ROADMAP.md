# Thành Phố Không Ngủ — Roadmap

Trạng thái hiện tại: **chỉ thực hiện Phase 0**. Các Phase sau là kế hoạch, chưa được cho phép triển khai. Không có lịch hoặc ngân sách cam kết khi chưa chốt nguồn lực.

## Nguyên tắc qua Phase

Mỗi Phase cần đủ đầu ra, bằng chứng kiểm tra phù hợp và chấp thuận tiếp tục từ chủ dự án. Gate chưa đạt thì ghi rõ vấn đề và dừng phần phụ thuộc. Không thêm tính năng ngoài `PRODUCT.md` để lấp chỗ trống thiết kế.

Các ngưỡng hiệu năng/tải chưa có số ở Phase 0. Phải điền số và ma trận thiết bị trong Phase 1, rồi kiểm tra ở Phase 2/5; thiếu ngưỡng không được coi là đã đạt nghiệm thu.

## Phase 0 — Tài liệu nền tảng (hiện tại)

**Phạm vi:** tạo tám tài liệu thống nhất về sản phẩm, gameplay, kiến trúc, giao thức, dữ liệu, an toàn, đo lường và lộ trình.

**Đầu ra:** `PRODUCT.md`, `GAME_DESIGN.md`, `ARCHITECTURE.md`, `PROTOCOL.md`, `DATABASE.md`, `SECURITY.md`, `ANALYTICS.md`, `ROADMAP.md` trong `docs/`.

**Điều kiện nghiệm thu:**

- Có đủ tám file, đọc được bằng UTF-8 và không mâu thuẫn về stack/phạm vi.
- Ghi rõ core fantasy, nhóm tuổi, nền tảng, tính năng MVP và toàn bộ danh sách ngoài MVP.
- Phân định server authority, trạng thái tạm thời/bền vững, không chat và không economy.
- Phân biệt định hướng đã cho với đề xuất và quyết định còn mở.
- Mỗi Phase sau có đầu ra và điều kiện nghiệm thu.
- Không viết code game, không cài package, không tạo database hoặc hạ tầng; không bắt đầu Phase 1.

Tạo xong tài liệu là hoàn thành đầu ra kỹ thuật Phase 0; quyết định sản phẩm còn mở không được ngầm coi là đã duyệt.

## Phase 1 — Chốt quyết định và nền kỹ thuật

**Chỉ bắt đầu khi được yêu cầu riêng.**

**Phạm vi dự kiến:** chốt các quyết định chặn triển khai, cấu trúc dự án, môi trường dev/test, cách build và kiểm tra. Khởi tạo stack chỉ sau khi Phase được cho phép; chưa xây trọn gameplay.

**Đầu ra:** ghi nhận quyết định, cấu trúc ứng dụng tối thiểu, quy trình build/typecheck/test và ma trận nghiệm thu.

**Điều kiện nghiệm thu:**

- Chốt danh tính khách/đăng nhập, chính sách nhiều tab, vòng đời phiên và dữ liệu nào cần lưu bền vững.
- Chốt browser/thiết bị mục tiêu, điều khiển desktop/mobile, danh sách địa điểm MVP, avatar/mood và quyền hiển thị mood.
- Chốt hosting frontend, môi trường Worker/DO, cách kết nối PostgreSQL và migration nếu cần; chứng minh tính khả thi tích hợp mà chưa tự tạo dữ liệu ngoài phạm vi đã duyệt.
- Chốt tải đồng thời mục tiêu, sức chứa mỗi phòng, ngân sách, mục tiêu join latency/cập nhật/reconnect và điều kiện mạng thử nghiệm bằng số.
- Chốt protocol đủ cho lát cắt Phase 2: endpoint, auth, schema, tick, timeout, giới hạn payload, backpressure và recovery.
- Build/typecheck cùng kiểm tra nền chạy được; không có secret trong frontend hoặc repo.

## Phase 2 — Lát cắt multiplayer và vòng đời phòng

**Phạm vi dự kiến:** một không gian thử từ danh sách MVP, join, render avatar, di chuyển và nhìn thấy người thật. Không sản xuất thêm địa điểm/tính năng ngoài MVP.

**Đầu ra:** đường chạy browser → Worker → Durable Object, snapshot/update, reconnect; schema/migration tối thiểu chỉ khi mô hình dữ liệu đã được duyệt và thực sự cần.

**Điều kiện nghiệm thu:**

- Hai browser/client độc lập cùng phòng nhìn thấy nhau và di chuyển nhất quán; client khác phòng không nhận trạng thái đó.
- Server từ chối giả mạo danh tính, vị trí bất hợp lệ và quyền phòng không hợp lệ.
- Join/leave, timeout, reconnect, nhiều tab và chuyển phòng theo chính sách đã chốt không nhân đôi hiện diện hoặc để ghost quá timeout.
- Kiểm chứng restart/vòng đời Durable Object, resync, message trùng/cũ, payload lỗi và client chậm.
- Đạt mục tiêu hiệu năng đã chốt cho lát cắt; có bằng chứng kiểm tra logic, nhiều client và tích hợp thực tế.
- Nếu có DB: quyền truy cập, migration và dữ liệu lưu đúng mô hình được duyệt; không ghi mỗi frame.

## Phase 3 — Hoàn thiện vòng lặp xã hội MVP

**Phạm vi dự kiến:** chọn avatar/mood, năm tương tác, ngồi, City Pulse và quy tắc trải nghiệm liên quan.

**Đầu ra:** core loop đầy đủ trong lát cắt, hợp đồng Pulse và giao diện trạng thái lỗi.

**Điều kiện nghiệm thu:**

- Chốt đích/phạm vi/cooldown/thời lượng cho từng tương tác và quy tắc ghế/ngồi/đứng.
- `wave`, `heart`, `coffee`, `flower`, `sit` đồng bộ đúng giữa các client; action bị từ chối không phát hiệu ứng thành công.
- Mood chọn từ danh mục, tổng hợp đúng và tuân thủ quyền hiển thị đã duyệt.
- Pulse thống nhất phạm vi, online lease, dedup, nhóm mood nhỏ, stale/TTL và độ trễ bằng số; đối chiếu đúng khi reconnect/chuyển phòng/restart.
- Desktop và cảm ứng hoàn thành core loop; có trạng thái phòng trống/đầy, lỗi và bị rate limit.
- Không xuất hiện chat tự do, inventory, kinh tế hoặc tính năng ngoài MVP.

## Phase 4 — Nội dung MVP và Share Card

**Phạm vi dự kiến:** hoàn thiện các địa điểm đã xác nhận trong danh sách Cafe 24h, Rooftop, Beach; Share Card và trải nghiệm responsive.

**Đầu ra:** nội dung/avatar/UI đã duyệt, chuyển địa điểm, card có preview và xuất/chia sẻ phù hợp trình duyệt.

**Điều kiện nghiệm thu:**

- Mọi địa điểm đã chốt có bản đồ, vùng di chuyển, điểm xuất hiện và quy tắc ghế đúng; chuyển địa điểm không rò trạng thái hoặc nhân đôi presence.
- Core loop hoàn thành trên ma trận desktop/mobile đã chốt; tài nguyên và vùng chạm đáp ứng mục tiêu đã duyệt.
- Card thể hiện đúng nội dung được phép, không lộ dữ liệu người khác, ID nội bộ hoặc token.
- Tạo/lưu/chia sẻ card được kiểm tra trên trình duyệt mục tiêu, bao gồm fallback khi không hỗ trợ chia sẻ trực tiếp.
- Tài nguyên có nguồn/quyền sử dụng; không thêm cơ chế nội dung ngoài phạm vi MVP.

## Phase 5 — Kiểm chứng MVP và beta giới hạn

**Phạm vi dự kiến:** kiểm thử end-to-end, tải, an toàn, riêng tư, analytics tối thiểu đã duyệt và vận hành cho nhóm thử nghiệm giới hạn.

**Đầu ra:** báo cáo nghiệm thu, lỗi/rủi ro tồn đọng, kế hoạch beta và runbook vận hành.

**Điều kiện nghiệm thu:**

- Vitest/Playwright và kiểm chứng tích hợp bao phủ các gate trước; không còn lỗi nghiêm trọng chặn core loop hoặc làm lộ dữ liệu.
- Đạt tải đồng thời, latency, reconnect và ngân sách đã chốt trên điều kiện đo được ghi lại.
- Kiểm tra auth/Origin, rate limit, replay, giới hạn tài nguyên, leak secret và cách ly phòng đạt yêu cầu.
- Chốt tuổi, an toàn tương tác, xử lý vi phạm/sự cố và đầu mối vận hành; thay đổi phạm vi nếu có phải được duyệt riêng.
- Duyệt retention, thông báo dữ liệu, consent khi cần và quy trình xóa trước thu thập thật; backup/restore được kiểm tra nếu có dữ liệu bền vững.
- Analytics có schema được duyệt, chống trùng, tách test/production và định nghĩa metric đúng; không suy diễn thao tác share thành bài đăng thành công.
- Chủ dự án phê duyệt nhóm thử, giới hạn tải, tiêu chí dừng beta và kế hoạch rollback trước mở beta.

## Phase 6 — Quyết định phát hành MVP

**Phạm vi dự kiến:** đánh giá beta, sửa lỗi trong phạm vi đã duyệt và quyết định phát hành. Không mặc định thêm tính năng hậu MVP.

**Đầu ra:** báo cáo beta, phiên bản ứng viên phát hành, hướng dẫn vận hành và quyết định go/no-go.

**Điều kiện nghiệm thu:**

- Kết quả beta được đối chiếu với tiêu chí sản phẩm, hiệu năng và an toàn đã chốt; giới hạn còn lại được công bố.
- Lỗi chặn phát hành đã được xử lý và kiểm tra lại phù hợp.
- Runbook, giám sát, xử lý sự cố, rollback, ngân sách và trách nhiệm vận hành có chủ sở hữu.
- Chủ dự án cho phép phát hành cụ thể; chưa có chấp thuận thì không tự deploy/public launch.

## Sổ quyết định còn mở

| Quyết định | Hạn chốt | Tài liệu cần cập nhật |
| --- | --- | --- |
| Danh tính, nhiều tab, dữ liệu ghi nhớ | Phase 1 | Architecture, Protocol, Database, Security |
| Thiết bị/browser, điều khiển, mục tiêu tải và ngân sách | Phase 1 | Product, Game Design, Architecture |
| Địa điểm chính thức, danh mục avatar/mood, hiển thị mood | Phase 1 | Product, Game Design, Protocol |
| Hosting, DB integration, migration, phiên bản công nghệ | Phase 1 | Architecture, Database |
| Auth transport, schema, tick/timeout, recovery, chuyển phòng | Trước triển khai phần liên quan ở Phase 2 | Protocol, Architecture, Security |
| Đích/cooldown của tương tác, quy tắc ngồi | Trước triển khai ở Phase 3 | Game Design, Protocol |
| Phạm vi Pulse, online/dedup, TTL và ngưỡng riêng tư | Trước triển khai ở Phase 3 | Game Design, Architecture, Protocol, Analytics |
| Template và cơ chế xuất Share Card | Trước triển khai ở Phase 4 | Game Design, Architecture, Security |
| Analytics vendor/schema cuối, consent, retention, xóa, backup | Trước thu thập thật/Phase 5 | Analytics, Database, Security |
| Tuổi, xử lý lạm dụng, vận hành và khu vực phát hành | Trước beta/Phase 5 | Product, Security |

Chủ dự án chốt quyết định sản phẩm và phạm vi; người phụ trách kỹ thuật đưa bằng chứng và đề xuất. Chưa chỉ định cá nhân hoặc mặc định phê duyệt bất kỳ lựa chọn còn mở nào.
