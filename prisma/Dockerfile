FROM node:16-alpine
# RUN yarn global add prisma
ARG DATABASE_URL=postgresql://postgres:postgres@postgres/dbManga?connect_timeout=300
ENV DATABASE_URL $DATABASE_URL

# Set app directory
RUN mkdir /nextjs
WORKDIR /nextjs

# Copying source files
ADD ./ ./prisma/

# Running app
CMD ["prisma", "migrate", "dev", "--name", "one"]