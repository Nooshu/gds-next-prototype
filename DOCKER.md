# Docker Deployment Guide

This repository includes Docker configuration for easy deployment to platforms like Render.com, Railway, or any Docker-compatible hosting service.

## Files Added

- `Dockerfile` - Multi-stage Docker build optimized for production
- `.dockerignore` - Excludes unnecessary files from Docker build context
- `docker-compose.yml` - For local Docker development
- `render.yaml` - Render.com deployment configuration

## Local Docker Development

### Build and run with Docker Compose:
```bash
docker-compose up --build
```

### Or build and run manually:
```bash
# Build the image
docker build -t hmcts-prototype .

# Run the container
docker run -p 3000:3000 hmcts-prototype
```

The application will be available at http://localhost:3000

## Deployment to Render.com

### Option 1: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Render.com
3. Render will automatically detect the `render.yaml` file and configure the service

### Option 2: Manual Setup
1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Set the following configuration:
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Port**: 3000
   - **Health Check Path**: `/`

### Environment Variables
The following environment variables are automatically set:
- `NODE_ENV=production`
- `PORT=3000`

## Deployment to Other Platforms

### Railway
1. Connect your GitHub repository to Railway
2. Railway will auto-detect the Dockerfile and deploy

### Heroku (with Container Registry)
```bash
# Login to Heroku Container Registry
heroku container:login

# Build and push
heroku container:push web -a your-app-name
heroku container:release web -a your-app-name
```

### DigitalOcean App Platform
1. Create a new app from your GitHub repository
2. DigitalOcean will detect the Dockerfile automatically
3. Set the HTTP port to 3000

## Docker Image Details

- **Base Image**: Node.js 18 Alpine (lightweight)
- **Multi-stage Build**: Optimized for production
- **Security**: Runs as non-root user
- **Size**: Optimized with standalone Next.js output
- **Health Check**: Built-in health monitoring

## Troubleshooting

### Build Issues
If you encounter build issues, try:
```bash
# Clean build without cache
docker build --no-cache -t hmcts-prototype .
```

### Port Issues
Make sure port 3000 is available or change the port mapping:
```bash
docker run -p 8080:3000 hmcts-prototype
```

### Memory Issues
If running on limited memory, you may need to increase Docker's memory allocation or use a platform with more RAM.

