# Use a imagem oficial do Node.js
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o código fonte
COPY . .

# Build da aplicação Next.js
RUN npm run build

# Expor a porta 3000
EXPOSE 3000

# Definir variável de ambiente para produção
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["npm", "start"]