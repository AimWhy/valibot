import type { Language } from './types';

// prettier-ignore
const language: Language = {
  code:               'vi',
  schema:             (issue) => `Loại không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
  specific: {
    base64:           (issue) => `Base64 không hợp lệ: Nhận được ${issue.received}`,
    bic:              (issue) => `BIC không hợp lệ: Nhận được ${issue.received}`,
    bytes:            (issue) => `Bytes không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    check:            (issue) => `Đầu vào không hợp lệ: Nhận ${issue.received}`,
    checkAsync:       (issue) => `Đầu vào không hợp lệ: Nhận ${issue.received}`,
    checkItems:       (issue) => `Mục không hợp lệ: Nhận được ${issue.received}`,
    checkItemsAsync:  (issue) => `Mục không hợp lệ: Nhận được ${issue.received}`,
    creditCard:       (issue) => `Thẻ tín dụng không hợp lệ: Nhận được ${issue.received}`,
    cuid2:            (issue) => `Cuid2 không hợp lệ: Nhận được ${issue.received}`,
    decimal:          (issue) => `Số thập phân không hợp lệ: Nhận được ${issue.received}`,
    digits:           (issue) => `Các chữ số không hợp lệ: Nhận được ${issue.received}`,
    email:            (issue) => `Email không hợp lệ: Nhận được ${issue.received}`,
    emoji:            (issue) => `Emoji không hợp lệ: Nhận được ${issue.received}`,
    empty:            (issue) => `Độ dài không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    endsWith:         (issue) => `Các ký tự thúc không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    everyItem:        (issue) => `Mục không hợp lệ: Nhận được ${issue.received}`,
    excludes:         (issue) => `Nội dung không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    finite:           (issue) => `Số không hợp lệ: Nhận được ${issue.received}`,
    graphemes:        (issue) => `Các chữ cái không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    hash:             (issue) => `Mã hash không hợp lệ: Nhận được ${issue.received}`,
    hexColor:         (issue) => `Mã màu hex không hợp lệ: Nhận được ${issue.received}`,
    hexadecimal:      (issue) => `Số thập lục phân không hợp lệ: Nhận được ${issue.received}`,
    imei:             (issue) => `IMEI không hợp lệ: Nhận được ${issue.received}`,
    includes:         (issue) => `Nội dung không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    integer:          (issue) => `Số nguyên không hợp lệ: Nhận được ${issue.received}`,
    ip:               (issue) => `IP không hợp lệ: Nhận được ${issue.received}`,
    ipv4:             (issue) => `IPv4 không hợp lệ: Nhận được ${issue.received}`,
    ipv6:             (issue) => `IPv6 không hợp lệ: Nhận được ${issue.received}`,
    isoDate:          (issue) => `Ngày không hợp lệ: Nhận được ${issue.received}`,
    isoDateTime:      (issue) => `Ngày giờ không hợp lệ: Nhận được ${issue.received}`,
    isoTime:          (issue) => `Giờ không hợp lệ: Nhận được ${issue.received}`,
    isoTimeSecond:    (issue) => `Giây không hợp lệ: Nhận được ${issue.received}`,
    isoTimestamp:     (issue) => `Dấu thời gian không hợp lệ: Nhận được ${issue.received}`,
    isoWeek:          (issue) => `Tuần không hợp lệ: Nhận được ${issue.received}`,
    length:           (issue) => `Độ dài không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    mac:              (issue) => `MAC không hợp lệ: Nhận được ${issue.received}`,
    mac48:            (issue) => `MAC 48-bit không hợp lệ: Nhận được ${issue.received}`,
    mac64:            (issue) => `MAC 64-bit không hợp lệ: Nhận được ${issue.received}`,
    maxBytes:         (issue) => `Bytes không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    maxGraphemes:     (issue) => `Đơn vị không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    maxLength:        (issue) => `Độ dài không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    maxSize:          (issue) => `Kích cỡ không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    maxValue:         (issue) => `Giá trị không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    maxWords:         (issue) => `Từ không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    mimeType:         (issue) => `Loại MIME không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    minBytes:         (issue) => `Bytes không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    minGraphemes:     (issue) => `Các chữ cái không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    minLength:        (issue) => `Độ dài không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    minSize:          (issue) => `Kích cỡ không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    minValue:         (issue) => `Giá trị không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    minWords:         (issue) => `Từ không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    multipleOf:       (issue) => `Lựa chọn không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    nanoid:           (issue) => `Nano ID không hợp lệ: Nhận được ${issue.received}`,
    nonEmpty:         (issue) => `Độ dài không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    notBytes:         (issue) => `Bytes không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    notGraphemes:     (issue) => `Các chữ cái không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    notLength:        (issue) => `Độ dài không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    notSize:          (issue) => `Kích cỡ không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    notValue:         (issue) => `Giá trị không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    notWords:         (issue) => `Từ không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    octal:            (issue) => `Hệ bát phân không hợp lệ: Nhận được ${issue.received}`,
    partialCheck:     (issue) => `Đầu vào không hợp lệ: Nhận được ${issue.received}`,
    regex:            (issue) => `Định dạng không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    safeInteger:      (issue) => `Số nguyên an toàn không hợp lệ: Nhận được ${issue.received}`,
    size:             (issue) => `Kích cỡ không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    someItem:         (issue) => `Mục không hợp lệ: Nhận được ${issue.received}`,
    startsWith:       (issue) => `Các ký tự bắt đầu không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    ulid:             (issue) => `ULID không hợp lệ: Nhận được ${issue.received}`,
    url:              (issue) => `URL không hợp lệ: Nhận được ${issue.received}`,
    uuid:             (issue) => `UUID không hợp lệ: Nhận được ${issue.received}`,
    value:            (issue) => `Giá trị không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
    words:            (issue) => `Từ không hợp lệ: Mong muốn ${issue.expected} nhưng nhận được ${issue.received}`,
  },
};

export default language;
