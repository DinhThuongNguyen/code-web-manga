FROM node:16-alpine
RUN npm install -g yarn
RUN yarn global add prisma

# Create app directory
RUN mkdir /nextjs
WORKDIR /nextjs

COPY . /nextjs
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json /nextjs

RUN yarn install

RUN yarn build

# FROM node:14

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD [ "yarn", "dev" ]