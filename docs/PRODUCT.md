# Thành Phố Không Ngủ — Product

Trạng thái: nền tảng Phase 0. Chỉ tài liệu, chưa triển khai sản phẩm.

## 1. Tầm nhìn

Social Ambient Multiplayer Web Game với core fantasy: **“Đêm nay vẫn có người thức cùng bạn.”**

Người chơi bước vào thành phố ban đêm, cảm nhận sự hiện diện của người thật và giao tiếp nhẹ nhàng qua những tương tác có sẵn. Sản phẩm ưu tiên cảm giác đồng hành, ít áp lực và dễ tham gia.

## 2. Đối tượng và nền tảng

- Gen Z, ưu tiên nhóm 18–29 tuổi.
- Web desktop và mobile browser.
- Danh sách trình duyệt, thiết bị và cấu hình tối thiểu cần chốt trước nghiệm thu kỹ thuật; xem `ROADMAP.md`.
- Nhóm tuổi ưu tiên không tự động đồng nghĩa với chính sách giới hạn tuổi; chính sách này chưa chốt.

## 3. Phạm vi MVP

- Vào thành phố ban đêm.
- Chọn avatar từ tập lựa chọn có sẵn và chọn mood.
- Di chuyển, gặp người chơi thật trong cùng không gian realtime.
- Tương tác bằng `wave`, `heart`, `coffee`, `flower`, `sit`.
- Các địa điểm MVP dự kiến: Cafe 24h, Rooftop, Beach. Đây là danh sách lập kế hoạch, cần xác nhận trước sản xuất nội dung.
- City Pulse: số người online và mood tổng hợp theo phạm vi, cách đếm được công bố rõ.
- Share Card để người chơi chủ động chia sẻ lên mạng xã hội.
- Không có text chat trong MVP.

## 4. Ngoài MVP

Voice chat, text chat tự do, PvP, combat, guild, trading, NFT/Web3, UGC map, marketplace người chơi, pet, housing phức tạp.

Tương tác `coffee` và `flower` là biểu đạt xã hội; không tạo vật phẩm sở hữu, giao dịch hay nền kinh tế. Share Card không kéo theo feed hoặc mạng xã hội nội bộ.

## 5. Hành trình chính

1. Người chơi mở web trên desktop hoặc mobile.
2. Chọn avatar và mood trong danh mục cho phép.
3. Vào địa điểm có chỗ trống, nhìn thấy người khác đang thực sự kết nối.
4. Di chuyển, ngồi và gửi hoặc nhận tương tác có sẵn.
5. Xem City Pulse, có thể tạo Share Card rồi rời đi.

Cách cấp danh tính, onboarding và quy tắc chọn địa điểm mặc định còn chờ quyết định. Không mặc định thêm hệ thống tài khoản, kết bạn, nhiệm vụ hoặc tiến trình.

## 6. Tiêu chí sản phẩm

- Người chơi hoàn thành hành trình chính bằng chuột/bàn phím và cảm ứng theo ma trận thiết bị đã chốt.
- Người chơi ở cùng phòng thấy nhau và nhận được tương tác hợp lệ.
- Mất kết nối không tạo người chơi ma tồn tại vô hạn; trạng thái kết nối được thể hiện rõ.
- Thành phố vắng không hiển thị bot hoặc số liệu giả như người thật.
- City Pulse có định nghĩa online, phạm vi đếm và thời điểm cập nhật rõ ràng.
- Share Card không lộ dữ liệu người chơi khác hoặc thông tin định danh nội bộ.
- Mục tiêu định lượng về hiệu năng, tải và tỷ lệ hoàn thành phải được chốt trước các gate tương ứng trong `ROADMAP.md`; chưa có cam kết số liệu ở Phase 0.

## 7. Kiểm soát phạm vi

Mọi thay đổi cần ghi: vấn đề cần giải quyết, thay đổi phạm vi, tác động tới kiến trúc/dữ liệu/an toàn và Phase thực hiện. Chỉ triển khai sau khi được chủ dự án chấp thuận và cập nhật các tài liệu liên quan.

Không coi các mục “chưa chốt” là tính năng đã được phê duyệt. Các Phase sau cần được yêu cầu riêng; hoàn tất Phase 0 không cho phép tự bắt đầu Phase 1.

## 8. Tham chiếu

Gameplay: `GAME_DESIGN.md`. Ranh giới hệ thống: `ARCHITECTURE.md`. Kế hoạch và gate: `ROADMAP.md`.
