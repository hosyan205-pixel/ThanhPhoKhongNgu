# Thành Phố Không Ngủ

Social Ambient Multiplayer Web Game — “Đêm nay vẫn có người thức cùng bạn.”

Codebase hiện chỉ có **bootstrap Phase 1** theo yêu cầu hiện tại. Tám tài liệu trong
[`docs/`](docs/PRODUCT.md) là nguồn tham chiếu Phase 0 và được giữ nguyên.
Chưa có gameplay, authentication, payment, map, player movement, WebSocket gameplay
hoặc database thật. Chưa triển khai hay phát hành dịch vụ lên Cloudflare.

## Yêu cầu và khởi chạy

- Node.js **24.22.2 LTS**, npm **11.19.1**; xem `.nvmrc`, `.node-version` và `package.json`.
- Cài Node qua công cụ quản lý phiên bản bạn sử dụng, bảo đảm `node`/`npm` nằm trong PATH.
- Không cần Cloudflare login, PostgreSQL/Supabase hoặc secret để chạy bootstrap local.

```sh
npm install
npm run test:install
npm run dev
```

`test:install` tải Chromium cho Playwright; chỉ cần chạy khi chưa có đúng browser revision.
Sau khi có lockfile, môi trường CI dùng `npm ci` và `npm run test:install`.

Runtime Node portable dùng để kiểm chứng trên máy hiện tại nằm trong `.tools/`, bị Git bỏ qua.
Nếu chưa cài Node vào PATH trên máy Windows này, có thể dùng trong PowerShell hiện tại:

```powershell
$env:PATH = "$PWD\.tools\node-v24.22.2-win-x64;$env:PATH"
npm.cmd run dev
```

`.tools/` không được commit và không phải dependency của repository trên máy khác.
Trên PowerShell có execution policy hạn chế script, dùng `npm.cmd` thay cho `npm`.

## Cấu trúc và trách nhiệm

```text
apps/
  web/                  React + Vite; Phaser 3 đã cài, chưa tạo Game/Scene
  admin/                React + Vite; chỉ màn hình bootstrap
workers/
  gateway/              GET /health
  matchmaking/          Worker placeholder
  room/                 Worker + lớp Room extends DurableObject
  city-pulse/           Worker placeholder
  payment/              Worker placeholder, chưa có nghiệp vụ thanh toán
packages/
  protocol/             Type health HTTP; chưa có gameplay event
  shared/               Helper JSON dùng Fetch API chuẩn
  config/               Tên môi trường và kiểu binding cấu hình
  validation/           Zod schema cho môi trường và health contract
database/
  migrations/           Chỉ .gitkeep
  seed/                 Chỉ .gitkeep
  schema/               Chỉ .gitkeep
tests/
  integration/          Vitest HTTP contract + Playwright bootstrap smoke
  load/                 Ghi chú giữ chỗ; chưa có kịch bản tải
docs/                   Giữ nguyên tám tài liệu Phase 0
```

Mỗi app/worker/package là một npm workspace private. Các package nội bộ dùng
`@tpkn/*`, version `0.0.0` để npm liên kết workspace, không publish.
Chúng export TypeScript source, được Vite/Wrangler xử lý trực tiếp; chưa có bước
phát hành package hay bản sao `dist` của shared code. Root build typecheck toàn bộ
source và test trước khi bundle app/worker.

Shared package không phụ thuộc Node, React, Phaser hoặc Cloudflare runtime.
Frontend không import worker/backend; ESLint kiểm tra các ranh giới import cơ bản.
Worker dùng type môi trường riêng, không trộn DOM của browser vào tsconfig worker.

## Lệnh kiểm tra

| Lệnh                        | Mục đích                                                                     |
| --------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`               | Chạy hai Vite app và năm Worker local; dừng cả nhóm khi một tiến trình thoát |
| `npm run build`             | Strict typecheck + Vite production build + Wrangler production dry-run       |
| `npm run build:development` | Build với cấu hình development, Worker dry-run                               |
| `npm run build:staging`     | Build với cấu hình staging, Worker dry-run                                   |
| `npm run typecheck`         | Kiểm tra strict TypeScript cho tooling, test và mọi workspace                |
| `npm run lint`              | ESLint, không chấp nhận warning                                              |
| `npm run format:check`      | Kiểm tra Prettier; bỏ qua tài liệu Phase 0                                   |
| `npm run format`            | Format source/config/README; bỏ qua tài liệu Phase 0                         |
| `npm run test`              | Vitest rồi Playwright; tự bật/tắt web, admin và gateway local                |
| `npm run test:unit`         | Chỉ Vitest, không cần browser                                                |
| `npm run test:e2e`          | Chỉ Playwright, cần Chromium đã cài                                          |

Vite xuất `apps/*/dist/`; Wrangler xuất `workers/*/dist/` với `--dry-run`.
Build không gọi deploy thật, không cấp namespace hoặc áp dụng migration trên cloud.
Không có root script tự deploy, tạo database hay chạy migration.

Playwright dùng Chromium desktop và profile cảm ứng Pixel 7 để kiểm tra bootstrap.
Profile mobile chỉ giả lập viewport/input, chưa phải nghiệm thu thiết bị Android/iOS thật
hoặc Safari/WebKit. Vitest kiểm tra cả cấu hình lỗi và HTTP method không hợp lệ.
Test runtime kiểm tra gateway bằng Wrangler local; chưa kiểm chứng lifecycle hoặc recovery
của Durable Object vì Phase 1 chưa có luồng sử dụng object.

Playwright yêu cầu cổng test trống (`reuseExistingServer: false`); dừng `npm run dev`
trước khi chạy để tránh dùng nhầm server có cấu hình khác.

## Cổng local

| Thành phần  | Cổng HTTP | Cổng inspector Worker |
| ----------- | --------- | --------------------- |
| Web         | 5173      | —                     |
| Admin       | 5174      | —                     |
| Gateway     | 8787      | 9230                  |
| Room        | 8788      | 9231                  |
| Matchmaking | 8789      | 9232                  |
| City Pulse  | 8790      | 9233                  |
| Payment     | 8791      | 9234                  |

Các server bind `127.0.0.1`. Có thể chạy riêng, ví dụ `npm run dev -w @tpkn/gateway`.
Gateway trả JSON `{ "status": "ok", "service": "gateway", "environment": "development" }`
cho `GET /health`. Endpoint này chỉ xác nhận bootstrap/config hợp lệ, không kiểm tra DB
hoặc upstream chưa tồn tại. Path khác trả 404, method khác tại `/health` trả 405.
Các Worker placeholder đều trả 404, không có route nghiệp vụ.

## Chiến lược môi trường

| Môi trường  | Frontend                       | Worker                                        |
| ----------- | ------------------------------ | --------------------------------------------- |
| development | `vite --mode development`      | Wrangler `--local --env development`          |
| staging     | `vite build --mode staging`    | Wrangler `--env staging`, hiện chỉ dry-run    |
| production  | `vite build --mode production` | Wrangler `--env production`, hiện chỉ dry-run |

Vite dùng `MODE` làm tên môi trường mặc định. Có thể override biến public
`VITE_APP_ENV` từ file `.env.<mode>.local` trong từng app. `.env.example` chỉ chứa
tên biến với giá trị rỗng; không cần copy để chạy mặc định. Biến rỗng dùng lại `MODE`;
giá trị khác ba môi trường hợp lệ bị Zod từ chối. Vite mode và `NODE_ENV` là hai
khái niệm khác nhau; staging vẫn là bản bundle tối ưu cho production.

Mỗi `wrangler.jsonc` khai báo rõ ba named environment, tên Worker riêng và `APP_ENV`
tương ứng. Binding Durable Object `ROOMS` được lặp riêng trong từng environment
vì binding không kế thừa. Khai báo migration `v1` chỉ đăng ký lớp Room khi được deploy
ở tương lai; không có SQL hoặc thao tác storage trong source. Local bootstrap không
khởi tạo Room instance. Không có binding hoặc remote resource được chia sẻ giữa môi trường.

`workers_dev` và preview URL bị tắt. Route/domain, service binding giữa Worker,
hosting frontend, account và quy trình deploy vẫn chưa chốt; namespace DO sẽ chỉ được
cấp khi có triển khai được cho phép sau này. Chưa coi cấu hình hiện tại là production-ready.

## Secret và Git

- Không có secret hoặc khóa API trong source, ví dụ env hay Wrangler config.
- Chỉ biến public được phép mang tiền tố `VITE_`; mọi biến tiền tố này có thể xuất hiện trong bundle.
- Secret backend trong tương lai dùng secret store theo environment, không đặt trong
  `vars`, frontend hoặc shared package. Local có thể dùng `.dev.vars.<environment>`
  của Worker tương ứng; các file này được Git ignore.
- `.gitignore` bỏ qua `.env*`/`.dev.vars*` thực, log, key/certificate, build output,
  browser report, cache, trạng thái Wrangler và runtime local; giữ `.env.example`.
- Commit `package-lock.json` để tái lập dependency. Không cài global package hoặc
  đưa `.tools/`/`node_modules/` vào Git. Thay đổi hiện tại chưa được tự commit.

## Quyết định kỹ thuật Phase 1

1. npm workspaces + một lockfile, không thêm monorepo framework hoặc task cache.
2. Node 24 LTS và dependency trực tiếp khóa phiên bản. TypeScript 6.0.3 nằm trong
   dải hỗ trợ của typescript-eslint; không dùng TypeScript 7 khi parser chưa hỗ trợ.
3. React 19, Vite 8 cho hai frontend; Phaser giữ major 3 theo yêu cầu, mới chỉ cài dependency.
4. Worker thuần với Wrangler, lớp Durable Object dùng `cloudflare:workers`.
   Không có HTTP router/framework, orchestration hoặc WebSocket gameplay.
5. Zod kiểm tra cấu hình tại runtime; shared contract chỉ có health HTTP.
6. Strict TypeScript cùng `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
   và các kiểm tra unused/fallthrough. `skipLibCheck` chỉ bỏ kiểm tra nội bộ declaration
   của dependency, không bỏ kiểm tra source ứng dụng.
7. Vitest cho logic HTTP/schema; Playwright cho bootstrap browser và Worker local.
8. Schema/migration/seed chỉ giữ chỗ, không thêm driver hoặc ORM khi dữ liệu chưa chốt.

## Dependency trực tiếp

Dependency runtime: React, React DOM, Phaser (chỉ web) và Zod. Các mục còn lại là
dev dependency dùng chung tại root. Dependency nội bộ là bốn package private
`@tpkn/config`, `@tpkn/protocol`, `@tpkn/shared`, `@tpkn/validation`.

| Package                       | Phiên bản khóa |
| ----------------------------- | -------------- |
| `react`                       | 19.3.1         |
| `react-dom`                   | 19.3.1         |
| `phaser`                      | 3.90.0         |
| `zod`                         | 4.6.7          |
| `typescript`                  | 6.0.3          |
| `vite`                        | 8.3.5          |
| `@vitejs/plugin-react`        | 6.2.1          |
| `wrangler`                    | 4.156.2        |
| `@cloudflare/workers-types`   | 5.20261103.1   |
| `vitest`                      | 5.1.0          |
| `@playwright/test`            | 1.64.1         |
| `eslint`                      | 10.14.0        |
| `@eslint/js`                  | 10.0.1         |
| `typescript-eslint`           | 8.72.1         |
| `eslint-plugin-react-hooks`   | 7.1.1          |
| `eslint-plugin-react-refresh` | 0.5.7          |
| `eslint-config-prettier`      | 10.1.8         |
| `prettier`                    | 3.9.10         |
| `globals`                     | 17.14.0        |
| `concurrently`                | 10.0.6         |
| `@types/node`                 | 24.19.2        |
| `@types/react`                | 19.3.0         |
| `@types/react-dom`            | 19.3.0         |

npm 11.19 chặn install script chưa được duyệt. `allowScripts` trong root package
chỉ cho phép đúng phiên bản `esbuild@0.28.2` và `workerd@1.20261102.1` đã kiểm tra,
để chuẩn bị và xác minh binary native. Khi cập nhật các dependency này, cần rà soát
lại script và pin trước khi cài; không bật cho phép toàn bộ install script.

## Kết quả kiểm chứng bootstrap

Đã kiểm chứng trên Windows với Node 24.22.2 / npm 11.19.1:

- `npm install`: thành công, có lockfile.
- `npm run build`, `npm run typecheck`, `npm run lint`: pass.
- `npm run test`: pass 10 test Vitest và 6 test Playwright.
- `npm run format:check`: pass.
- `npm run build:development`, `npm run build:staging`: pass.
- `npm run dev`: hai app trả 200, gateway health trả 200, bốn Worker placeholder
  trả 404 đúng kỳ vọng; đã dừng server sau smoke-check.
- `git diff -- docs`: không có thay đổi.

Các lần chạy đầu bị sandbox chặn tải dependency hoặc ghi cache/log ngoài workspace;
đã chạy lại với quyền thích hợp và pass. Đây không phải deployment trên cloud.

`npm audit` hiện báo **13 moderate**, bắt nguồn từ dependency `minimatch` của
công cụ lint (advisory `GHSA-g3hv-75wg-m249`). Bản sửa do audit đề xuất cần thay đổi
ngoài dải dependency hiện tại; chưa ép override major hoặc dùng `audit fix --force`.
`npm audit --omit=dev` báo **0 vulnerabilities**. Cần theo dõi bản vá tương thích
của toolchain; bootstrap chưa được xem là đã nghiệm thu an toàn cho phát hành.

## Vấn đề còn mở và giới hạn nghiệm thu

ROADMAP Phase 0 dự kiến Phase 1 bao gồm chốt danh tính, thiết bị, tải và hợp đồng
gameplay. Yêu cầu hiện tại giới hạn Phase 1 ở **khởi tạo codebase**. Tài liệu Phase 0
không bị sửa; bootstrap này không có nghĩa các gate sản phẩm đó đã được đáp ứng.

Còn mở: danh tính/khách/nhiều tab; điều khiển và danh mục nội dung; browser/thiết bị
nghiệm thu thật; tải, capacity, latency và ngân sách; hosting/deploy; PostgreSQL driver
và migration; protocol gameplay, timeout/recovery; tổng hợp Pulse; analytics/retention;
chính sách tuổi và an toàn tương tác. Không chọn thay chủ dự án trong bootstrap này.

`apps/admin` và `workers/payment` được tạo theo yêu cầu cấu trúc Phase 1; không bổ sung
auth, giao diện quản trị, thanh toán, marketplace hoặc economy vào phạm vi MVP.

**Dừng ở Phase 1. Không tự chuyển sang Phase 2.**
