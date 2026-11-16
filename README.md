# 💕 Our Story

Trang web kỷ niệm cho hai người: đếm ngày yêu nhau, dòng thời gian, thư viện ảnh,
thư tình, tim bay và nhạc nền. Chạy hoàn toàn trên trình duyệt, đưa lên GitHub Pages là xong.

## 1. Sửa nội dung (chỉ cần file `config.js`)
- Tên hai bạn, **ngày bắt đầu yêu**, dòng chữ nhỏ
- Các cột mốc (ngày, tiêu đề, nội dung, ảnh)
- Thư viện ảnh, các "điều mình thương", nội dung thư tình

## 2. Thêm ảnh
1. Tạo thư mục `images/` trong repo.
2. Bỏ ảnh vào (vd `1.jpg`, `2.jpg`...). Nên thu nhỏ ảnh dưới ~500 KB cho trang tải nhanh.
3. Ghi đúng tên ảnh trong `config.js` (mục `milestones` và `gallery`).

Ảnh nào chưa có thì trang hiện ô giữ chỗ, không bị lỗi.

## 3. Thêm nhạc (tuỳ chọn)
Bỏ file `music.mp3` cạnh `index.html`, rồi trong `config.js` ghi `music: "music.mp3"`.
Nút 🎵 góc phải dưới sẽ hiện ra để bật/tắt (trình duyệt không cho tự phát nhạc).

## 4. Đưa lên GitHub Pages
1. Tạo repo mới (vd `love`) trên GitHub và upload các file: `index.html`, `style.css`, `script.js`, `config.js`, thư mục `images/` (và `music.mp3` nếu có).
2. Vào **Settings → Pages**.
3. **Source: Deploy from a branch**, branch `main`, thư mục `/(root)` → **Save**.
4. Sau 1–2 phút, mở: `https://<ten-github>.github.io/love/`

> Mẹo: nếu muốn riêng tư, bạn có thể đặt tên repo khó đoán và chỉ gửi link cho người ấy.
> Trang trên GitHub Pages mặc định là công khai với ai có link.
