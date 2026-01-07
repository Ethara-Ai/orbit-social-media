# Orbit - Social Media Dashboard

A modern, feature-rich social media dashboard built with React 19, featuring a beautiful UI with smooth animations, modular architecture, and a fully interactive experience.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.24.3-FF0055?style=flat-square&logo=framer)
![Vitest](https://img.shields.io/badge/Vitest-4.0.16-6E9F18?style=flat-square&logo=vitest)

## Overview

Orbit is a fully functional social media dashboard prototype that simulates a real social networking experience. It features a clean, modern design with smooth animations, responsive layouts, and intelligent interactions — all built with a highly cohesive and loosely coupled architecture.

## Features

### Home Feed
- Create and share posts with text and images
- Like, comment, and interact with posts
- Real-time post updates
- Expandable comments section

### Discover (Explore)
- Browse posts by categories
- Featured and trending posts
- Theater mode for immersive post viewing
- Slide-in comments panel

### Messages
- Real-time chat interface
- **Smart reply system** - Contextual responses based on message content:
  - Greetings receive varied greeting responses
  - Questions get thoughtful replies
  - Image attachments receive appropriate reactions
  - Emotional messages get supportive responses
- Image attachment support
- Conversation search
- Unread message indicators
- Empty chat cleanup on navigation

### Notifications
- Real-time notification simulation (auto-generates every 60 seconds)
- Multiple notification types (likes, comments, follows, mentions, friend requests)
- Mark as read functionality
- Notification badges with live counts

### Active Now
- See online friends
- Quick-start conversations
- Welcome message for new chats

### User Profile
- Profile modal with user details
- Connection requests
- Suggested users

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite 7** | Build Tool & Dev Server |
| **Tailwind CSS 3** | Utility-first Styling |
| **Framer Motion** | Animations & Transitions |
| **Vitest** | Unit Testing Framework |
| **Testing Library** | Component Testing |
| **ESLint** | Code Linting |
| **GitHub Actions** | CI/CD Pipeline |
| **AWS S3** | Static Hosting |

## Architecture

### Design Principles

This project follows **high cohesion** and **low coupling** principles:

- **Domain-Specific Contexts** - State is organized by feature domain, not by component
- **Service Layer** - Business logic is extracted into reusable service functions
- **Thin Orchestrators** - Layout components delegate to child components via hooks
- **No Prop Drilling** - Tab components access their data directly via context hooks
- **Colocated Tests** - Test files live alongside the components they test

### Context Architecture

The application state is split into 6 domain-specific contexts:

| Context | Responsibility |
|---------|----------------|
| `UserContext` | User profile, friends, connections, suggested users |
| `FeedContext` | Posts, comments, likes, shares, post creation |
| `MessagesContext` | Conversations, chat state, message sending |
| `NotificationsContext` | Notifications, badges, auto-generation |
| `ExploreContext` | Explore posts, categories, theater modal |
| `UIContext` | Tabs, modals, loading states, mobile navigation |

### Service Layer

Business logic is extracted into dedicated services:

| Service | Purpose |
|---------|---------|
| `postService.js` | Post CRUD, likes, comments, sharing |
| `messageService.js` | Message creation, smart response generation |
| `conversationService.js` | Conversation management, search, cleanup |
| `notificationService.js` | Notification generation, read state management |

## Project Structure

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Avatar.jsx
│   │   ├── Avatar.test.jsx      # Colocated test
│   │   ├── Badge.jsx
│   │   ├── Badge.test.jsx
│   │   ├── ActionButton.jsx
│   │   ├── ActionButton.test.jsx
│   │   ├── EmptyState.jsx
│   │   └── EmptyState.test.jsx
│   ├── layout/              # Layout components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MainContent.jsx
│   │   ├── RightSidebar.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── LoadingScreen.test.jsx
│   │   ├── MobileNavOverlay.jsx
│   │   ├── RightSidebar/
│   │   └── popups/
│   ├── feed/                # Feed tab components
│   │   ├── FeedTab.jsx
│   │   ├── PostCard.jsx
│   │   ├── CreatePost.jsx
│   │   └── post/
│   ├── messages/            # Messages tab components
│   │   ├── MessagesTab.jsx
│   │   └── chat/
│   ├── notifications/       # Notifications tab components
│   │   └── NotificationsTab.jsx
│   ├── explore/             # Explore tab components
│   │   ├── ExploreTab.jsx
│   │   ├── ExploreHeader.jsx
│   │   ├── ExploreHeader.test.jsx
│   │   └── modal/
│   ├── sidebar/             # Sidebar subcomponents
│   │   ├── FriendItem.jsx
│   │   ├── FriendItem.test.jsx
│   │   ├── UserProfileCard.jsx
│   │   └── UserProfileCard.test.jsx
│   ├── profile/             # Profile components
│   └── icons/               # SVG icon components
│
├── context/
│   ├── AppContext.jsx       # Thin composer - composes all providers
│   └── providers/           # Domain-specific context providers
│       ├── UserContext.jsx
│       ├── FeedContext.jsx
│       ├── MessagesContext.jsx
│       ├── NotificationsContext.jsx
│       ├── ExploreContext.jsx
│       ├── UIContext.jsx
│       └── index.js
│
├── services/                # Business logic layer
│   ├── postService.js
│   ├── messageService.js
│   ├── conversationService.js
│   ├── notificationService.js
│   └── index.js
│
├── hooks/                   # Custom React hooks
│   ├── useClickOutside.js
│   ├── useClickOutside.test.js  # Colocated test
│   ├── useDebounce.js
│   ├── useDebounce.test.js
│   ├── useLocalStorage.js
│   ├── useLocalStorage.test.js
│   ├── useMediaQuery.js
│   ├── useScrollToBottom.js
│   └── index.js
│
├── utils/                   # Utilities and constants
│   ├── constants.js
│   ├── helpers.js
│   ├── helpers.test.js          # Colocated test
│   └── index.js
│
├── test/                    # Test configuration
│   └── setup.js             # Vitest setup file
│
├── data/
│   └── mockData.js          # Mock data generators
│
├── App.jsx                  # App entry with AppProvider
├── SocialMediaDashboard.jsx # Main dashboard component
├── main.jsx                 # Application entry point
└── index.css                # Global styles

.github/
└── workflows/
    ├── deploy.yml           # CI/CD pipeline for AWS S3
    └── pr-check.yml         # PR validation workflow
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd socialtubb-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:watch` | Run tests in watch mode |

## Testing

This project uses **Vitest** with **React Testing Library** for unit and component testing.

### Test Structure

Tests are **colocated** with the files they test for better maintainability:

```
src/components/common/
├── Avatar.jsx
├── Avatar.test.jsx      # Test file next to component
├── Badge.jsx
└── Badge.test.jsx
```

### Running Tests

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

Coverage reports are generated in the `coverage/` directory and uploaded as artifacts in CI.

## Environment Variables

### Configuration Files

| File | Purpose |
|------|---------|
| `.env.example` | Template with all available variables |
| `.env` | Local development configuration (git-ignored) |

### Available Variables

```bash
# Application Settings
VITE_APP_ENV=development          # development | staging | production
VITE_APP_NAME=SocialTubb          # Application name
VITE_APP_VERSION=0.0.0            # Application version

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# AWS Configuration (for deployment scripts - not exposed to browser)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
AWS_CLOUDFRONT_DISTRIBUTION_ID=your_cloudfront_distribution_id

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=

# Feature Flags
VITE_DEBUG_MODE=false
VITE_MAINTENANCE_MODE=false
```

> **Note:** Variables prefixed with `VITE_` are exposed to the browser. Non-prefixed variables are only available during build time.

## CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and deployment to **AWS S3**.

### Workflows

#### 1. CI/CD Pipeline (`deploy.yml`)

Triggered on push to `main`/`master` branches:

```
Test -> Build -> Deploy to S3
```

- Runs ESLint
- Runs all unit tests
- Generates coverage reports
- Builds production bundle
- Deploys to AWS S3
- Invalidates CloudFront cache (optional)

#### 2. PR Checks (`pr-check.yml`)

Triggered on pull requests:

- Linting validation
- Unit tests with coverage
- Build verification

### Required GitHub Secrets

Configure these secrets in your repository settings:

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |
| `AWS_S3_BUCKET` | S3 bucket name |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID (optional) |

### AWS Setup

1. **Create an S3 bucket** with static website hosting enabled
2. **Configure bucket policy** for public read access
3. **Create an IAM user** with S3 and CloudFront permissions
4. **Add secrets** to GitHub repository settings

## Design Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** - Powered by Framer Motion for fluid transitions
- **Modern UI** - Clean, minimalist design with orange/amber color scheme
- **Custom Scrollbars** - Styled scrollbars with orange gradient thumb
- **Loading States** - Elegant loading screen with pulsing logo animation
- **Dark Overlays** - Theater mode for immersive content viewing

## Smart Features

### Intelligent Chat Responses
The messaging system includes a smart response generator that analyzes your messages and provides contextual replies.

### Automatic Cleanup
- Empty conversations are automatically removed when navigating away from Messages tab
- Maintains a clean chat list without cluttering with unused chats

### Real-Time Notifications
- Auto-generates random notifications every 60 seconds
- Simulates likes, comments, follows, and friend requests
- Toast popups appear for new notifications

## Project Stats

| Metric | Value |
|--------|-------|
| Test Files | 12 |
| Test Cases | 483 |
| Components | 40+ |
| Custom Hooks | 6 |
| Context Providers | 6 |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### PR Requirements

- All tests must pass
- No ESLint errors
- Build must succeed
- Add tests for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p><strong>Connect - Discover - Thrive</strong></p>
</div>