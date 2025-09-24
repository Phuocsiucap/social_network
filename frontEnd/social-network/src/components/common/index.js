export { default as ErrorBoundary } from './ErrorBoundary';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as EmptyState } from './EmptyState';
export { default as ErrorFallback } from './ErrorFallback';

{/* Ok 👌 để mình giải thích rõ từng component bạn vừa đưa, gồm: **EmptyState**, **ErrorBoundary**, **ErrorFallback**, và **LoadingSpinner**.

---

## 1. **EmptyState**

👉 **Chức năng**:

* Dùng để hiển thị **trạng thái rỗng** khi không có dữ liệu hoặc nội dung nào để hiển thị (ví dụ: danh sách bài viết, giỏ hàng, thông báo...).
* Có thể tùy chỉnh:

  * `title`: tiêu đề thông báo (mặc định: *"No data found"*)
  * `message`: mô tả ngắn (mặc định: *"There is no data to display at the moment."*)
  * `icon`: truyền một icon component để minh họa
  * `action`: có thể thêm một nút hành động (ví dụ: "Tạo mới", "Refresh")

👉 **UI hiển thị**:

* Trung tâm màn hình, bố cục dọc, icon lớn màu xám nhạt ở trên, tiêu đề + mô tả, và nút hành động (nếu có).
* Ví dụ: khi danh sách sản phẩm rỗng, hiện hình giỏ hàng trống + dòng chữ *“Không có sản phẩm nào”* + nút *“Mua ngay”*.

---

## 2. **ErrorBoundary**

👉 **Chức năng**:

* Là một **React Class Component đặc biệt** giúp **bắt lỗi runtime của React** ở trong cây component con.
* Nếu một component bên trong render bị lỗi, thay vì làm crash cả app, ErrorBoundary sẽ hiển thị giao diện fallback.
* Có nút *Try again* để reset trạng thái `hasError`.

👉 **UI hiển thị**:

* Một khung giữa màn hình, có dòng chữ đỏ *"Something went wrong"*, kèm nút *“Try again”*.
* Phù hợp khi muốn bảo vệ toàn bộ app hoặc một phần quan trọng (ví dụ: profile section, message list) khỏi crash.

---

## 3. **ErrorFallback**

👉 **Chức năng**:

* Cũng là UI fallback khi có lỗi, nhưng thường dùng kết hợp với thư viện như **`react-error-boundary`**.
* Nhận props `error` (thông tin lỗi) và `resetErrorBoundary` (hàm reset lỗi).
* Hiển thị chi tiết thông tin lỗi giúp developer dễ debug.

👉 **UI hiển thị**:

* Khung màu đỏ nhạt, có tiêu đề *"Something went wrong"*.
* Bên dưới hiển thị **chi tiết lỗi (`error.message`)**.
* Có nút *“Try again”* để reset.
* Phù hợp khi muốn cho user thấy rõ lỗi gì xảy ra (ví dụ: API failed, component crash) thay vì chỉ thông báo chung chung.

---

## 4. **LoadingSpinner**

👉 **Chức năng**:

* Hiển thị vòng tròn xoay loading khi đang **chờ dữ liệu** (API call, submit form, tải trang...).
* Có thể tùy chọn `size = sm | md | lg`.

👉 **UI hiển thị**:

* Một vòng tròn xoay liên tục (`animate-spin`), màu xanh dương.
* Size mặc định là `md (32px)`, nhưng có thể nhỏ hơn (`sm = 16px`) hoặc to hơn (`lg = 48px`).
* Dùng khi muốn báo hiệu app đang trong trạng thái *loading...*.

---

### 📌 Tóm lại:

* **EmptyState** → Hiển thị khi **không có dữ liệu**.
* **ErrorBoundary** → Bao bọc component để **bắt lỗi React** và hiển thị fallback UI.
* **ErrorFallback** → UI fallback chi tiết hơn, thường dùng với `react-error-boundary`.
* **LoadingSpinner** → Hiển thị trạng thái **đang tải dữ liệu**.

---

Bạn có muốn mình vẽ sơ đồ **luồng sử dụng thực tế** (ví dụ trong danh sách sản phẩm: loading → error → empty state → data) để dễ hình dung hơn không?
*/}