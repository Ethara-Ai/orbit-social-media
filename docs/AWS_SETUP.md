# Production Deployment Setup Guide

This guide explains how to set up SSH-based deployment for your React application and configure GitHub Actions for automated deployments.

## Prerequisites

- Linux server (Ubuntu recommended) with SSH access
- Node.js 20+ installed on the server
- GitHub repository with admin access
- Domain name (optional)

---

## Deployment Architecture

```
GitHub (push to main) → GitHub Actions → SSH → Remote Server → Deploy Script
```

The deployment workflow:
1. Code is pushed to the `main` branch
2. GitHub Actions triggers the deployment workflow
3. Connects to the production server via SSH
4. Executes the deployment script on the server

---

## Step 1: Server Setup

### 1.1 Create Deployment Directory

```bash
# SSH into your server
ssh ubuntu@your-server-ip

# Create project directory
sudo mkdir -p /home/ubuntu/ethara-ai-prod/orbit-social-media
sudo chown -R ubuntu:ubuntu /home/ubuntu/ethara-ai-prod
```

### 1.2 Install Dependencies

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 for process management (optional)
sudo npm install -g pm2
```

### 1.3 Clone the Repository

```bash
cd /home/ubuntu/ethara-ai-prod
git clone https://github.com/Ethara-AI/orbit-social-media.git
cd orbit-social-media
npm install
npm run build
```

### 1.4 Create Deployment Script

Create the deployment script at `/home/ubuntu/ethara-ai-prod/orbit-social-media/deploy.sh`:

```bash
#!/bin/bash

# Exit on error
set -e

# Navigate to project directory
cd /home/ubuntu/ethara-ai-prod/orbit-social-media

# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Run tests (optional)
# npm run test:run

# Build the application
npm run build

# Restart the server (if using a Node.js server)
# pm2 restart orbit-social-media

echo "Deployment completed successfully!"
```

Make the script executable:

```bash
sudo chmod +x /home/ubuntu/ethara-ai-prod/orbit-social-media/deploy.sh
```

### 1.5 Configure Sudoers (for passwordless sudo)

The deployment script runs with `sudo`, so configure passwordless execution:

```bash
sudo visudo
```

Add this line at the end:

```
ubuntu ALL=(ALL) NOPASSWD: /home/ubuntu/ethara-ai-prod/orbit-social-media/deploy.sh
```

---

## Step 2: Set Up SSH Keys

### 2.1 Generate SSH Key Pair (on your local machine)

```bash
# Generate a new SSH key pair for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# This creates:
# - ~/.ssh/github_actions_deploy (private key)
# - ~/.ssh/github_actions_deploy.pub (public key)
```

### 2.2 Add Public Key to Server

```bash
# Copy the public key to your server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub ubuntu@your-server-ip

# Or manually add to ~/.ssh/authorized_keys on the server
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
```

### 2.3 Test SSH Connection

```bash
ssh -i ~/.ssh/github_actions_deploy ubuntu@your-server-ip
```

---

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `SSH_HOST` | Your server IP address or hostname |
| `SSH_USER` | SSH username (e.g., `ubuntu`) |
| `SSH_PRIVATE_KEY` | Contents of the private key file |

### Getting the Private Key

```bash
# Display the private key content
cat ~/.ssh/github_actions_deploy

# Copy the entire output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... key content ...
# -----END OPENSSH PRIVATE KEY-----
```

---

## Step 4: GitHub Actions Workflow

The deployment workflow is located at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:  # Manual trigger button

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: sudo /home/ubuntu/ethara-ai-prod/orbit-social-media/deploy.sh
```

---

## Step 5: Test the Pipeline

1. Push a commit to the `main` branch
2. Go to **Actions** tab in GitHub
3. Watch the workflow run
4. Check your server for the deployed changes

### Manual Trigger

You can also trigger the deployment manually:
1. Go to **Actions** tab
2. Select **Deploy to Production** workflow
3. Click **Run workflow**

---

## Step 6: Web Server Configuration (Nginx)

### 6.1 Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 6.2 Configure Nginx for SPA

Create `/etc/nginx/sites-available/orbit-social-media`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /home/ubuntu/ethara-ai-prod/orbit-social-media/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/orbit-social-media /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6.3 SSL with Let's Encrypt (Optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Troubleshooting

### Common Issues

**1. SSH Connection Failed**
- Verify SSH_HOST is correct (IP or hostname)
- Check SSH_USER matches the server user
- Ensure the private key is complete (including headers)
- Verify the public key is in `~/.ssh/authorized_keys` on the server

**2. Permission Denied on Deploy Script**
- Ensure the script is executable: `chmod +x deploy.sh`
- Check sudoers configuration for passwordless sudo
- Verify the path in the workflow matches the script location

**3. Git Pull Fails**
- Ensure the repository is cloned with HTTPS or deploy key
- Check if there are uncommitted changes on the server

**4. Build Fails on Server**
- Verify Node.js version matches local development
- Check if all dependencies are installed
- Review disk space availability

**5. 404 Errors on Routes**
- Ensure Nginx is configured with `try_files` for SPA routing
- Verify the `dist` folder path is correct

### Useful Commands

```bash
# Check deployment script manually
sudo /home/ubuntu/ethara-ai-prod/orbit-social-media/deploy.sh

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t
```

---

## Security Best Practices

1. **Use dedicated deploy keys** - Don't reuse personal SSH keys
2. **Restrict SSH key permissions** - Only allow specific commands if possible
3. **Keep server updated** - Regular security patches
4. **Use HTTPS** - Set up SSL certificates
5. **Firewall configuration** - Only open necessary ports (22, 80, 443)
6. **Rotate keys periodically** - Update SSH keys regularly

---

## PR Checks Workflow

The PR validation workflow (`.github/workflows/pr-check.yml`) runs on pull requests:

- **Lint**: ESLint code quality checks
- **Test**: Unit tests with coverage report
- **Build**: Verify the application builds successfully

This ensures code quality before merging to main.

---

## File Structure

```
.github/
└── workflows/
    ├── deploy.yml      # Production deployment via SSH
    └── pr-check.yml    # PR validation checks
docs/
└── AWS_SETUP.md        # This file (deployment guide)
```

---

## Support

For issues with:
- **Server Setup**: Check your hosting provider's documentation
- **GitHub Actions**: [GitHub Actions Docs](https://docs.github.com/en/actions)
- **Nginx**: [Nginx Documentation](https://nginx.org/en/docs/)
- **This Project**: Open an issue in the repository