FROM node:14-alpine

# Встановлюємо робочу директорію в контейнері
WORKDIR /usr/src/app

#  Копіюємо package.json та package-lock.json
COPY package*.json ./

#  Встановлюємо залежності
RUN npm install --production

# Копіюємо всі файли p проекту
COPY . .


EXPOSE 5500

# Команда для запуску сервера
CMD ["node", "server.js"]