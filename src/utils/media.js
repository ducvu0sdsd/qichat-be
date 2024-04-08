const fs = require('fs');
const path = require('path');

// Hàm để tạo tệp ảnh từ chuỗi base64
const saveBase64ImageToFile = (base64String, fileName) => {
    // Chuyển đổi chuỗi base64 thành dữ liệu nhị phân
    const base64Data = Buffer.from(base64String, 'base64');

    // Đường dẫn đến thư mục lưu trữ tệp ảnh
    const directory = './images';

    // Tạo thư mục nếu nó chưa tồn tại
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    // Đường dẫn đến tệp ảnh
    const filePath = path.join(directory, fileName);

    // Ghi dữ liệu nhị phân vào tệp ảnh
    fs.writeFileSync(filePath, base64Data);

    return filePath; // Trả về đường dẫn tệp đã lưu
};

module.exports = saveBase64ImageToFile