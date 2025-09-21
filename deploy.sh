#!/bin/bash

# Afya Quest Deployment Script
# Deploys frontend to GitHub Pages and provides backend deployment instructions

echo "🚀 Afya Quest Deployment Assistant"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📝 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "afya-quest-frontend" ] || [ ! -d "afya-quest-backend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_step "Checking prerequisites..."

# Check if gh-pages is installed
cd afya-quest-frontend
if ! npm ls gh-pages &> /dev/null; then
    print_warning "Installing gh-pages..."
    npm install --save-dev gh-pages
fi

# Check if git remote exists
if ! git remote get-url origin &> /dev/null; then
    print_error "No git remote 'origin' found. Please set up your GitHub repository first."
    echo "Run: git remote add origin https://github.com/yourusername/hackriceproject.git"
    exit 1
fi

print_success "Prerequisites checked"

# Build and deploy frontend
print_step "Building and deploying frontend to GitHub Pages..."

# Set production environment variables
export REACT_APP_ENV=production
export REACT_APP_API_URL=${REACT_APP_API_URL:-"https://your-api.railway.app/api"}
export REACT_APP_TUNNEL_MANAGER_URL=${REACT_APP_TUNNEL_MANAGER_URL:-"https://tunnel-manager.railway.app"}

# Build the app
npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Deploy to GitHub Pages
npm run deploy

if [ $? -eq 0 ]; then
    print_success "Frontend deployed to GitHub Pages!"
    echo "📍 Your app will be available at: https://$(git config user.name).github.io/hackriceproject"
else
    print_error "GitHub Pages deployment failed"
    exit 1
fi

cd ..

# Backend deployment instructions
print_step "Backend Deployment Instructions:"
echo ""
echo "Your backend needs to be deployed to a cloud service. Here are your options:"
echo ""
echo "🔹 Option 1: Railway (Recommended)"
echo "   1. Sign up at https://railway.app"
echo "   2. Install Railway CLI: npm install -g @railway/cli"
echo "   3. Login: railway login"
echo "   4. Deploy: cd afya-quest-backend && railway init && railway deploy"
echo ""
echo "🔹 Option 2: Render"
echo "   1. Sign up at https://render.com"
echo "   2. Connect your GitHub repository"
echo "   3. Create a new Web Service"
echo "   4. Set root directory to 'afya-quest-backend'"
echo "   5. Set build command to 'npm install'"
echo "   6. Set start command to 'npm start'"
echo ""
echo "🔹 Option 3: Heroku"
echo "   1. Install Heroku CLI"
echo "   2. heroku create your-app-name"
echo "   3. git subtree push --prefix afya-quest-backend heroku main"
echo ""

print_step "Database Setup (MongoDB Atlas):"
echo ""
echo "1. Sign up at https://cloud.mongodb.com"
echo "2. Create a free cluster"
echo "3. Get your connection string"
echo "4. Set MONGODB_URI environment variable in your hosting service"
echo ""

print_step "Environment Variables for Backend:"
echo ""
echo "Set these in your hosting service:"
echo "NODE_ENV=production"
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/afyaquest"
echo "JWT_SECRET=your-super-secure-jwt-secret-here"
echo "CLOUDINARY_CLOUD_NAME=your-cloudinary-name"
echo "CLOUDINARY_API_KEY=your-cloudinary-key"
echo "CLOUDINARY_API_SECRET=your-cloudinary-secret"
echo "GEMINI_API_KEY=your-google-gemini-api-key"
echo ""

print_step "Mobile App Build:"
echo ""
echo "To build the mobile APK:"
echo "1. cd afya-quest-frontend"
echo "2. npm run build:mobile"
echo "3. npx cap build android"
echo "4. APK will be in: android/app/build/outputs/apk/debug/"
echo ""

print_success "Deployment guide complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy your backend using one of the options above"
echo "2. Update REACT_APP_API_URL with your backend URL"
echo "3. Redeploy frontend: npm run deploy"
echo "4. Test everything works"
echo "5. Build mobile APK for distribution"
echo ""
echo "🎉 Your app will be live at: https://$(git config user.name).github.io/hackriceproject"
