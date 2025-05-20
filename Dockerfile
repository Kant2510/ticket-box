# Sử dụng Node.js LTS
FROM node:18

# Tạo thư mục app
WORKDIR /usr/src/app

# Copy package.json và cài đặt dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ project vào container
COPY . .

# Expose cổng ứng dụng (nếu app chạy cổng khác 3000 thì sửa lại)
EXPOSE 3000

# Command khởi chạy server (tùy theo bạn dùng nodemon hay node)
CMD ["npm", "run", "start"]
