# AWS S3 Deployment Setup Guide

This guide explains how to set up AWS S3 for hosting your React application and configure GitHub Actions for automated deployments.

## Prerequisites

- AWS Account
- AWS CLI installed locally (optional, for testing)
- GitHub repository with admin access

---

## Step 1: Create an S3 Bucket

### 1.1 Create the Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click **Create bucket**
3. Configure:
   - **Bucket name**: `your-app-name` (must be globally unique)
   - **AWS Region**: Choose your preferred region (e.g., `us-east-1`)
   - **Object Ownership**: ACLs disabled (recommended)
   - **Block Public Access**: Uncheck "Block all public access" (for static hosting)
   - Acknowledge the warning about public access
4. Click **Create bucket**

### 1.2 Enable Static Website Hosting

1. Go to your bucket → **Properties** tab
2. Scroll to **Static website hosting**
3. Click **Edit**
4. Configure:
   - **Static website hosting**: Enable
   - **Hosting type**: Host a static website
   - **Index document**: `index.html`
   - **Error document**: `index.html` (for SPA routing)
5. Click **Save changes**
6. Note the **Bucket website endpoint** (e.g., `http://your-bucket.s3-website-us-east-1.amazonaws.com`)

### 1.3 Add Bucket Policy for Public Access

1. Go to your bucket → **Permissions** tab
2. Scroll to **Bucket policy** → Click **Edit**
3. Add this policy (replace `YOUR-BUCKET-NAME`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

4. Click **Save changes**

---

## Step 2: Create IAM User for GitHub Actions

### 2.1 Create IAM Policy

1. Go to [IAM Console](https://console.aws.amazon.com/iam/) → **Policies** → **Create policy**
2. Select **JSON** tab and paste:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3DeploymentAccess",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR-BUCKET-NAME",
                "arn:aws:s3:::YOUR-BUCKET-NAME/*"
            ]
        }
    ]
}
```

3. Click **Next**
4. Name: `S3-Deployment-Policy`
5. Click **Create policy**

### 2.2 Create IAM User

1. Go to **IAM Console** → **Users** → **Create user**
2. **User name**: `github-actions-deployer`
3. Click **Next**
4. **Permissions**:
   - Select **Attach policies directly**
   - Search and select `S3-Deployment-Policy`
5. Click **Next** → **Create user**

### 2.3 Create Access Keys

1. Click on the user `github-actions-deployer`
2. Go to **Security credentials** tab
3. Scroll to **Access keys** → **Create access key**
4. Select **Application running outside AWS**
5. Click **Next** → **Create access key**
6. **IMPORTANT**: Save the:
   - **Access key ID**
   - **Secret access key**
   
   ⚠️ You won't be able to see the secret key again!

---

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | Your IAM user Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | Your IAM user Secret Access Key |
| `AWS_S3_BUCKET` | Your S3 bucket name (e.g., `my-react-app`) |

### Optional Secrets (for CloudFront)

| Secret Name | Value |
|-------------|-------|
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | Your CloudFront distribution ID |

---

## Step 4: Update AWS Region (if needed)

If your S3 bucket is not in `us-east-1`, update the region in `.github/workflows/deploy.yml`:

```yaml
env:
  NODE_VERSION: '20'
  AWS_REGION: 'your-region'  # e.g., 'eu-west-1', 'ap-southeast-1'
```

---

## Step 5: Test the Pipeline

1. Push a commit to the `main` branch
2. Go to **Actions** tab in GitHub
3. Watch the workflow run
4. Once complete, visit your S3 website endpoint

---

## Optional: Set Up CloudFront CDN

For better performance and HTTPS support, set up CloudFront:

### 5.1 Create CloudFront Distribution

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click **Create distribution**
3. Configure:
   - **Origin domain**: Select your S3 bucket website endpoint
   - **Origin path**: Leave empty
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP methods**: GET, HEAD
   - **Cache policy**: CachingOptimized
   - **Default root object**: `index.html`
4. Click **Create distribution**

### 5.2 Configure Error Pages (for SPA)

1. Go to your distribution → **Error pages** tab
2. Click **Create custom error response**
3. Configure:
   - **HTTP error code**: 403
   - **Customize error response**: Yes
   - **Response page path**: `/index.html`
   - **HTTP Response code**: 200
4. Repeat for error code **404**

### 5.3 Update IAM Policy for CloudFront

Add CloudFront permissions to your IAM policy:

```json
{
    "Sid": "CloudFrontInvalidation",
    "Effect": "Allow",
    "Action": "cloudfront:CreateInvalidation",
    "Resource": "arn:aws:cloudfront::YOUR-ACCOUNT-ID:distribution/YOUR-DISTRIBUTION-ID"
}
```

### 5.4 Add CloudFront Secret

Add `AWS_CLOUDFRONT_DISTRIBUTION_ID` to your GitHub secrets.

---

## Optional: Custom Domain Setup

### Using Route 53

1. Register/transfer domain to Route 53
2. Create hosted zone
3. Create CloudFront distribution with custom domain
4. Request ACM certificate in `us-east-1`
5. Add CNAME or Alias record pointing to CloudFront

### Using External DNS

1. Create CloudFront distribution
2. Request ACM certificate
3. Add CNAME record with your DNS provider pointing to CloudFront domain

---

## Troubleshooting

### Common Issues

**1. Access Denied on S3**
- Check bucket policy allows public read
- Verify "Block Public Access" settings are disabled

**2. 403 Error on Website**
- Ensure static website hosting is enabled
- Check index document is set to `index.html`

**3. GitHub Actions Failing**
- Verify all secrets are correctly set
- Check IAM policy has correct bucket ARN
- Ensure AWS region matches bucket region

**4. SPA Routes Return 404**
- Set error document to `index.html`
- For CloudFront, configure custom error responses

### Useful AWS CLI Commands

```bash
# Test S3 access
aws s3 ls s3://your-bucket-name

# Manual deploy
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## Cost Estimation

For a small to medium traffic website:

| Service | Estimated Cost |
|---------|----------------|
| S3 Storage | ~$0.023/GB/month |
| S3 Requests | ~$0.0004/1000 GET requests |
| CloudFront | ~$0.085/GB (first 10TB) |
| Route 53 | ~$0.50/hosted zone/month |

**Free Tier** (12 months):
- S3: 5GB storage, 20,000 GET requests
- CloudFront: 1TB data transfer, 10M requests

---

## Security Best Practices

1. ✅ Use IAM user with minimal permissions
2. ✅ Never commit AWS credentials to code
3. ✅ Rotate access keys periodically
4. ✅ Enable CloudTrail for auditing
5. ✅ Use CloudFront for HTTPS
6. ✅ Consider using OIDC instead of access keys (advanced)

---

## File Structure

```
.github/
└── workflows/
    ├── deploy.yml      # Main CI/CD pipeline
    └── pr-check.yml    # PR validation checks
docs/
└── AWS_SETUP.md        # This file
```

---

## Support

For issues with:
- **AWS**: [AWS Documentation](https://docs.aws.amazon.com/)
- **GitHub Actions**: [GitHub Actions Docs](https://docs.github.com/en/actions)
- **This Project**: Open an issue in the repository