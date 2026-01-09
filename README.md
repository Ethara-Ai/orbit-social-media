# Orbit - Social Media Dashboard

A modern, feature-rich social media dashboard built with React 19, featuring a beautiful UI with smooth animations, modular architecture, and a fully interactive experience.

![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.24.8-FF0055?style=flat-square&logo=framer)
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
- Browse posts by categories with pill-style filters
- Featured and trending posts sections
- Regular posts grid layout
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

### Connections
- View and manage connections
- Connection requests
- User profile browsing

### Profile
- User profile view
- Profile analytics
- Activity overview

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
| **React 19.2.3** | UI Framework |
| **Vite 7.3.1** | Build Tool & Dev Server |
| **Tailwind CSS 4.1.18** | Utility-first Styling |
| **Framer Motion 12.25.0** | Animations & Transitions |
| **Vitest 4.0.16** | Unit Testing Framework |
| **Testing Library** | Component Testing |
| **ESLint 9** | Code Linting |
| **Prettier 3.7.4** | Code Formatting |
| **GitHub Actions** | CI/CD Pipeline |
| **SSH Deployment** | Production Server |

## Architecture

> **For comprehensive architecture documentation, see [ARCHITECTURE.md](docs/ARCHITECTURE.md)**

**Architectural Overview:** This codebase achieves **high cohesion** and **low coupling** through strict separation of concerns. Contexts manage only state and expose setters. Business logic lives in action hooks that consume contexts and provide methods to components. Services contain pure functions with zero React dependencies. This architecture ensures components are decoupled from implementation details, business logic is testable in isolation, and state management is predictable.

### Design Principles

This project follows **high cohesion** and **low coupling** principles with strict separation of concerns:

#### State Management (Contexts)
- **Pure State Providers** - Contexts manage ONLY state, no business logic
- **Domain-Specific Separation** - State is organized by feature domain (User, Feed, Messages, etc.)
- **Exposed Setters** - State setters are exposed for maximum flexibility
- **No Action Methods** - Business logic is NOT included in context providers

#### Business Logic (Hooks & Services)
- **Action Hooks** - Business logic consumes context state/setters and provides methods to components
- **Service Layer** - Pure functions for complex operations (posts, conversations, notifications)
- **Repository Pattern** - Data initialization separated from state management
- **Facade Hooks** - Simplified interfaces for components with multiple dependencies

#### Component Architecture
- **Thin Orchestrators** - Layout components delegate to child components
- **No Prop Drilling** - Components access data via context hooks and actions via action hooks
- **Domain-Specific Utils** - Utility functions organized by purpose (time, array, file, string, DOM, etc.)
- **Colocated Tests** - Test files live alongside the components they test
- **Error Boundaries** - Isolate failures within individual features

### Context Architecture

**Pure State Management** - Contexts provide state and setters ONLY, no business logic.

The application state is split into 6 domain-specific contexts:

| Context | State Responsibility | Exposed Setters |
|---------|---------------------|-----------------|
| `UserContext` | User profile, friends, connections, suggested users | All state setters for user-related operations |
| `FeedContext` | Posts, comments, form state (newPostContent, selectedImage, etc.) | All state setters for feed-related operations |
| `MessagesContext` | Conversations, active conversation, message text/attachments | All state setters for messaging operations |
| `NotificationsContext` | Notifications, read state, badges | State setters for notification management |
| `ExploreContext` | Explore posts, categories, filters, theater modal | State setters for explore operations |
| `UIContext` | Active tab, modals, loading states, mobile navigation | State setters for UI state changes |

**Design Principle:** Components consume contexts for state access, then use **action hooks** (which also consume contexts) to perform business logic operations.

### Data Layer

#### Repositories

Data initialization and access are separated from state management:

| Repository | Purpose |
|-----------|---------|
| `PostRepository` | Initialize and access posts and comments data |
| `ConversationRepository` | Initialize and access conversation data |
| `ExploreRepository` | Initialize and access explore posts and categories |

#### Service Layer

Business logic is extracted into dedicated, pure service functions:

| Service | Purpose |
|---------|---------|
| `postService.js` | Post CRUD, likes, comments, sharing (pure functions) |
| `messageService.js` | Message creation, smart response generation |
| `conversationService.js` | Conversation management, search, cleanup |
| `notificationService.js` | Notification generation, read state management |

### Hook Architecture

#### Action Hooks

**Business Logic Layer** - Action hooks consume contexts to access state/setters, then provide business logic methods to components.

| Hook | Consumes | Provides |
|------|----------|----------|
| `useFeedActions` | `FeedContext`, `UIContext` | Feed operations (like, comment, share, create post, image upload) |
| `useMessagesActions` | `MessagesContext` | Messaging operations (send, clear, attachments, start conversation, cleanup) |

**Architecture Pattern:**
```
Component → Action Hook → Context (State + Setters) + Services (Pure Functions)
```

This ensures:
- ✅ **Decoupled** - Business logic is separate from state management
- ✅ **Testable** - Action hooks can be tested independently
- ✅ **Reusable** - Multiple components can use the same action hooks
- ✅ **Maintainable** - Changes to business logic don't affect state structure

#### Facade Hooks

**Simplified Interfaces** - Facade hooks consolidate multiple dependencies into a single interface.

| Hook | Consolidates | Purpose |
|------|--------------|---------|
| `usePostCard` | `FeedContext` + `useFeedActions` + `UserContext` | Provides all data and actions needed by PostCard component |

**Benefits:**
- Reduces import statements in components
- Provides a stable interface even if underlying dependencies change
- Simplifies component testing by reducing mock setup

#### Utility Hooks

Reusable stateful logic:

| Hook | Purpose |
|------|---------|
| `useDebounce` | Debounce values with configurable delay |
| `useLocalStorage` | Persist state to localStorage |
| `useMediaQuery` | Responsive media query matching |
| `useClickOutside` | Detect clicks outside an element |
| `useScrollToBottom` | Auto-scroll to bottom of container |
| `useScrollPosition` | Track scroll position |

### Utility Organization

Utilities are organized by domain for high cohesion:

| Module | Purpose |
|--------|---------|
| `timeUtils.js` | Time and date formatting |
| `arrayUtils.js` | Array manipulation and transformation |
| `fileUtils.js` | File processing and validation |
| `stringUtils.js` | String manipulation |
| `domUtils.js` | DOM manipulation and browser interactions |
| `numberUtils.js` | Number formatting and generation |
| `objectUtils.js` | Object manipulation and function utilities |
| `helpers.js` | Backward compatibility layer (re-exports from domain-specific modules) |

## Project Structure

```
src/
├── components/
│   ├── common/                  # Reusable UI components
│   │   ├── ActionButton.jsx
│   │   ├── ActionButton.test.jsx
│   │   ├── Avatar.jsx
│   │   ├── Avatar.test.jsx
│   │   ├── Badge.jsx
│   │   ├── Badge.test.jsx
│   │   ├── EmptyState.jsx
│   │   ├── EmptyState.test.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── index.js
│   ├── layout/                  # Layout components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MobileSidebar.jsx
│   │   ├── MainContent.jsx
│   │   ├── RightSidebar.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── LoadingScreen.test.jsx
│   │   ├── MobileNavOverlay.jsx
│   │   ├── RightSidebar/
│   │   │   ├── ActiveNowSection.jsx
│   │   │   ├── SuggestedUsersSection.jsx
│   │   │   └── index.js
│   │   ├── popups/
│   │   │   ├── CopyNotificationPopup.jsx
│   │   │   ├── NotificationPopup.jsx
│   │   │   └── index.js
│   │   └── index.js
│   ├── feed/                    # Feed tab components
│   │   ├── FeedTab.jsx
│   │   ├── PostCard.jsx
│   │   ├── CreatePost.jsx
│   │   └── post/
│   │       ├── PostActions.jsx
│   │       ├── PostActions.test.jsx
│   │       ├── PostComments.jsx
│   │       ├── PostContent.jsx
│   │       ├── PostContent.test.jsx
│   │       ├── PostHeader.jsx
│   │       ├── PostHeader.test.jsx
│   │       └── index.js
│   ├── messages/                # Messages tab components
│   │   ├── MessagesTab.jsx
│   │   └── chat/
│   │       ├── ActiveChat.jsx
│   │       ├── ChatHeader.jsx
│   │       ├── ConversationsList.jsx
│   │       ├── EmptyChatState.jsx
│   │       ├── MessageBubble.jsx
│   │       ├── MessageBubble.test.jsx
│   │       ├── MessageInput.jsx
│   │       ├── MessagesList.jsx
│   │       └── index.js
│   ├── notifications/           # Notifications tab components
│   │   ├── NotificationsTab.jsx
│   │   ├── NotificationItem.jsx
│   │   ├── NotificationItem.test.jsx
│   │   └── index.js
│   ├── explore/                 # Explore tab components
│   │   ├── ExploreTab.jsx
│   │   ├── ExploreHeader.jsx
│   │   ├── ExploreHeader.test.jsx
│   │   ├── CategoryPills.jsx
│   │   ├── CategoryPills.test.jsx
│   │   ├── ExplorePostCard.jsx
│   │   ├── ExplorePostCard.test.jsx
│   │   ├── FeaturedPostCard.jsx
│   │   ├── FeaturedSection.jsx
│   │   ├── RegularPostsGrid.jsx
│   │   ├── modal/
│   │   │   ├── CommentsPanel.jsx
│   │   │   ├── TheaterModal.jsx
│   │   │   └── index.js
│   │   └── index.js
│   ├── connections/             # Connections tab components
│   │   └── ConnectionsTab.jsx
│   ├── profile/                 # Profile components
│   │   └── ProfileTab.jsx
│   ├── sidebar/                 # Sidebar subcomponents
│   │   ├── ConnectionsList.jsx
│   │   ├── ConnectionsList.test.jsx
│   │   ├── FriendItem.jsx
│   │   ├── FriendItem.test.jsx
│   │   ├── NavigationItems.jsx
│   │   ├── NavigationItems.test.jsx
│   │   ├── ProfileAnalytics.jsx
│   │   ├── UserProfileCard.jsx
│   │   └── index.js
│   ├── icons.jsx                # SVG icon components
│   └── index.js
│
├── context/
│   ├── AppContext.jsx           # Thin composer - composes all providers
│   └── providers/               # Domain-specific context providers
│       ├── UserContext.jsx
│       ├── FeedContext.jsx
│       ├── MessagesContext.jsx
│       ├── NotificationsContext.jsx
│       ├── ExploreContext.jsx
│       ├── UIContext.jsx
│       └── index.js
│
├── services/                    # Business logic layer (pure functions)
│   ├── postService.js
│   ├── messageService.js
│   ├── conversationService.js
│   ├── notificationService.js
│   └── index.js
│
├── hooks/                       # Custom React hooks
│   ├── useClickOutside.js       # Utility hook
│   ├── useClickOutside.test.js
│   ├── useDebounce.js           # Utility hook
│   ├── useDebounce.test.js
│   ├── useLocalStorage.js       # Utility hook
│   ├── useLocalStorage.test.js
│   ├── useMediaQuery.js         # Utility hook
│   ├── useMediaQuery.test.js
│   ├── useScrollPosition.js     # Utility hook
│   ├── useScrollPosition.test.js
│   ├── useScrollToBottom.js     # Utility hook
│   ├── useScrollToBottom.test.js
│   ├── useFeedActions.js        # Action hook - Feed business logic
│   ├── useMessagesActions.js    # Action hook - Messages business logic
│   ├── usePostCard.js           # Facade hook - PostCard interface
│   └── index.js
│
├── utils/                       # Domain-organized utilities
│   ├── constants.js             # Application constants
│   ├── timeUtils.js             # Time and date utilities
│   ├── arrayUtils.js            # Array manipulation utilities
│   ├── fileUtils.js             # File processing utilities
│   ├── stringUtils.js           # String manipulation utilities
│   ├── domUtils.js              # DOM manipulation utilities
│   ├── numberUtils.js           # Number formatting utilities
│   ├── objectUtils.js           # Object and function utilities
│   ├── helpers.js               # Backward compatibility layer
│   ├── helpers.test.js
│   └── index.js
│
├── test/                        # Test configuration
│   └── setup.js                 # Vitest setup file
│
├── data/
│   ├── mockData.js              # Mock data generators
│   └── repositories/            # Data access layer
│       ├── PostRepository.js    # Posts and comments data
│       ├── ConversationRepository.js  # Conversations data
│       ├── ExploreRepository.js # Explore posts and categories data
│       └── index.js
│
├── App.jsx                      # App entry with AppProvider
├── App.css                      # App-specific styles
├── SocialMediaDashboard.jsx     # Main dashboard component
├── main.jsx                     # Application entry point
└── index.css                    # Global styles

.github/
└── workflows/
    ├── deploy.yml               # CI/CD pipeline for AWS S3
    └── pr-check.yml             # PR validation workflow
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ethara-AI/orbit-social-media.git
   cd orbit-social-media
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
| `npm run lint:fix` | Run ESLint with auto-fix |
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
VITE_APP_NAME=Orbit               # Application name
VITE_APP_VERSION=0.0.1            # Application version

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

This project uses **GitHub Actions** for continuous integration and SSH-based deployment to production.

### Workflows

#### 1. CI/CD Pipeline (`deploy.yml`)

Triggered on push to `main` branch:

```
Lint -> Test -> Build -> Deploy via SSH
```

- Runs ESLint
- Runs all unit tests
- Builds production bundle
- Deploys to production server via SSH

#### 2. PR Checks (`pr-check.yml`)

Triggered on pull requests:

- Linting validation
- Unit tests with coverage
- Build verification

### Required GitHub Secrets

Configure these secrets in your repository settings:

| Secret | Description |
|--------|-------------|
| `SSH_HOST` | Server IP address or hostname |
| `SSH_USER` | SSH username (e.g., `ubuntu`) |
| `SSH_PRIVATE_KEY` | SSH private key for authentication |

### Server Setup

1. **Set up a Linux server** with SSH access
2. **Install Node.js 20+** on the server
3. **Create a deployment script** on the server
4. **Add SSH secrets** to GitHub repository settings

For detailed setup instructions, see [Deployment Setup Guide](docs/DEPLOYMENT.MD).

## Design Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Mobile Navigation** - Dedicated mobile sidebar and navigation overlay
- **Smooth Animations** - Powered by Framer Motion for fluid transitions
- **Modern UI** - Clean, minimalist design with orange/amber color scheme
- **Custom Scrollbars** - Styled scrollbars with orange gradient thumb
- **Loading States** - Elegant loading screen with pulsing logo animation
- **Dark Overlays** - Theater mode for immersive content viewing
- **Copy Notifications** - Toast feedback for clipboard actions

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

## Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - Comprehensive architecture documentation
- [Deployment Guide](docs/DEPLOYMENT.MD) - Production deployment setup

## Project Stats

| Metric | Value |
|--------|-------|
| Test Files | 34 |
| Total Tests | 1,561 |
| Components | 50+ |
| Utility Hooks | 6 |
| Action Hooks | 2 |
| Facade Hooks | 1 |
| Context Providers | 6 |
| Services | 4 |
| Repositories | 3 |
| Utility Modules | 7 |

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
  <p>
    <a href="https://github.com/Ethara-AI/orbit-social-media">GitHub</a> •
    <a href="https://components.ethara.ai/orbit-social-media">Live Demo</a>
  </p>
</div>