# Build Stage
FROM node:20.13.1-alpine as build

WORKDIR /service-api

# Copy package.json and package-lock.json to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma Client with the correct binary target for Linux
RUN npx prisma generate dev 

# Compile TypeScript files
RUN npm run build  

# Production Stage
FROM node:20.13.1-alpine as production

WORKDIR /app

# Copy only package.json and package-lock.json for production install
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy compiled files from build stage
COPY --from=build /service-api/dist ./dist

# Copy generated Prisma Client from the build stage
COPY --from=build /service-api/node_modules/.prisma ./node_modules/.prisma

# Expose the app port
EXPOSE 3010

# Start the app
CMD [ "node", "dist/index.js" ]  # Run the compiled JavaScript file
