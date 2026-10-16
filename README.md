# Đam Mê Bóng Đá

Web game quản lý đội bóng: mỗi tình huống hiện tối đa 4 cầu thủ, kết quả tính từ 19 chỉ số, có Kế hoạch huấn luyện, Kích thích, Cải tiến, Lên sao và kỹ năng mở khóa theo sao. Dữ liệu lưu trên Firebase Firestore (mỗi người chơi đăng nhập ẩn danh, có dữ liệu riêng).

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Trang game |
| `css/style.css` | Giao diện |
| `js/game.js` | Toàn bộ logic: chỉ số, tình huống, hoạt ảnh, quản lý cầu thủ, Firebase |
| `js/sprites.js` | Toạ độ từng khung hình trong atlas |
| `js/firebase-config.js` | **Dán cấu hình Firebase của bạn vào đây** |
| `assets/atlas_std.png`, `assets/atlas_gk.png` | Sprite cầu thủ và thủ môn (áo xanh, game tự đổi màu theo đội) |
| `firebase.json`, `.firebaserc`, `firestore.rules` | Cấu hình Firebase Hosting + Firestore |
| `tools/mo-phong-can-bang.js` | Chạy thử hàng nghìn trận để kiểm tra cân bằng |
| `tools/build_atlas.py` | Gộp khung hình PNG thành atlas khi thêm sprite mới |

## Chạy thử trên máy

Game cần chạy qua một web server (mở thẳng file `index.html` thì trình duyệt chặn việc đổi màu áo đội).

```bash
cd dam-me-bong-da
python3 -m http.server 8000
# mở http://localhost:8000
```

Chưa điền `js/firebase-config.js` thì game vẫn chạy, dữ liệu lưu trong trình duyệt.

## Đưa lên Firebase

1. Vào https://console.firebase.google.com → **Add project**.
2. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable.**
3. **Build → Firestore Database → Create database** (chọn vùng, ví dụ `asia-southeast1`).
4. **Project settings → Your apps → Web (</>)** → đăng ký app → chép đối tượng `firebaseConfig` vào `js/firebase-config.js`.
5. Sửa `.firebaserc`: thay `ten-project-firebase-cua-ban` bằng Project ID của bạn.
6. Cài công cụ và deploy:

```bash
npm install -g firebase-tools
firebase login
firebase deploy        # đưa lên Hosting và áp dụng firestore.rules
```

Sau khi deploy, Firebase in ra địa chỉ dạng `https://<project-id>.web.app`.

Dữ liệu được lưu ở `users/{uid}` (đội, câu lạc bộ) và `users/{uid}/matches` (lịch sử trận). Game tự lưu sau mỗi trận; nút **Lưu đội + kết quả** / **Tải đội** để lưu, tải thủ công.

> `apiKey` trong cấu hình web của Firebase không phải mật khẩu, để công khai trên GitHub là bình thường. Dữ liệu được bảo vệ bằng `firestore.rules`: mỗi người chỉ đọc/ghi được dữ liệu của chính mình.

## Đưa lên GitHub

```bash
cd dam-me-bong-da
git init
git add .
git commit -m "Đam Mê Bóng Đá: bản đầu tiên"
git branch -M main
git remote add origin https://github.com/<tên-bạn>/dam-me-bong-da.git
git push -u origin main
```

(Tạo repository trống trên GitHub trước, không chọn thêm README.)

## Chỉnh cân bằng

Các tham số nằm ở đầu phần công thức trong `js/game.js`:

| Tham số | Ý nghĩa | Giá trị |
|---|---|---|
| `GK_F` | Hệ số thủ môn, nhỏ hơn thì nhiều bàn hơn | 0.65 |
| `DUEL_G` | Độ dốc đối đầu, nhỏ hơn thì trận đấu bất ngờ hơn | 17 |
| `MOR_E` | Tinh thần đầu trận nhạy với chênh lệch Công/Thủ | 0.3 |
| `POS_E` | Lợi thế giành quyền tấn công | 0.5 |
| `STAR_GAIN` | Mỗi cấp sao cộng bao nhiêu % tiềm năng | 0.012 |

Sau khi sửa, chạy lại mô phỏng để kiểm tra:

```bash
node tools/mo-phong-can-bang.js 0.65 800 17 0.3 0.5
```

## Lưu ý

- Mọi tính toán trận đấu đang chạy trên trình duyệt, nên người chơi có thể sửa dữ liệu của chính mình. Khi làm chế độ đấu xếp hạng giữa người chơi, nên chuyển phần tính trận và các thao tác tốn tiền (Kích, Cải tiến, Lên sao) sang Cloud Functions.
- Sprite nhân vật là của bạn cung cấp; tên cầu thủ thật (Ronaldo…) nên cân nhắc về bản quyền hình ảnh trước khi phát hành công khai.
