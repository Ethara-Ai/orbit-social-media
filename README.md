# 🌐 Orbit - Social Media Dashboard

A modern, feature-rich social media dashboard built with React 19, featuring a beautiful UI with smooth animations, modular architecture, and a fully interactive experience.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.24.3-FF0055?style=flat-square&logo=framer)

## 📖 Overview

Orbit is a fully functional social media dashboard prototype that simulates a real social networking experience. It features a clean, modern design with smooth animations, responsive layouts, and intelligent interactions — all built with a highly cohesive and loosely coupled architecture.

## ✨ Features

### 🏠 Home Feed
- Create and share posts with text and images
- Like, comment, and interact with posts
- Real-time post updates
- Expandable comments section

### 🔍 Discover (Explore)
- Browse posts by categories
- Featured and trending posts
- Theater mode for immersive post viewing
- Slide-in comments panel

### 💬 Messages
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

### 🔔 Notifications
- Real-time notification simulation (auto-generates every 60 seconds)
- Multiple notification types (likes, comments, follows, mentions, friend requests)
- Mark as read functionality
- Notification badges with live counts

### 👥 Active Now
- See online friends
- Quick-start conversations
- Welcome message for new chats

### 👤 User Profile
- Profile modal with user details
- Connection requests
- Suggested users

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite 7** | Build Tool & Dev Server |
| **Tailwind CSS 3** | Utility-first Styling |
| **Framer Motion** | Animations & Transitions |
| **ESLint** | Code Linting |

## 🏗️ Architecture

### Design Principles

This project follows **high cohesion** and **low coupling** principles:

- **Domain-Specific Contexts** - State is organized by feature domain, not by component
- **Service Layer** - Business logic is extracted into reusable service functions
- **Thin Orchestrators** - Layout components delegate to child components via hooks
- **No Prop Drilling** - Tab components access their data directly via context hooks

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

## 📁 Project Structure

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Avatar.jsx
│   │   ├── Badge.jsx
│   │   ├── ActionButton.jsx
│   │   └── EmptyState.jsx
│   ├── layout/              # Layout components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MainContent.jsx      # Thin orchestrator
│   │   ├── RightSidebar.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── MobileNavOverlay.jsx
│   │   ├── RightSidebar/        # Right sidebar subcomponents
│   │   └── popups/              # Popup components
│   ├── feed/                # Feed tab components
│   │   ├── FeedTab.jsx          # Uses useFeed() hook directly
│   │   ├── PostCard.jsx
│   │   ├── CreatePost.jsx
│   │   └── post/                # Post subcomponents
│   ├── messages/            # Messages tab components
│   │   ├── MessagesTab.jsx      # Uses useMessages() hook directly
│   │   └── chat/                # Chat subcomponents
│   ├── notifications/       # Notifications tab components
│   │   └── NotificationsTab.jsx # Uses useNotifications() hook directly
│   ├── explore/             # Explore tab components
│   │   ├── ExploreTab.jsx       # Uses useExplore() hook directly
│   │   └── modal/               # Theater modal components
│   ├── sidebar/             # Sidebar subcomponents
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
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   ├── useMediaQuery.js
│   ├── useScrollToBottom.js
│   └── index.js
│
├── utils/                   # Utilities and constants
│   ├── constants.js
│   ├── helpers.js
│   └── index.js
│
├── data/
│   └── mockData.js          # Mock data generators
│
├── App.jsx                  # App entry with AppProvider
├── SocialMediaDashboard.jsx # Main dashboard component
├── main.jsx                 # Application entry point
└── index.css                # Global styles
```

## 🚀 Getting Started

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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎨 Design Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** - Powered by Framer Motion for fluid transitions
- **Modern UI** - Clean, minimalist design with orange/amber color scheme
- **Custom Scrollbars** - Styled scrollbars with orange gradient thumb
- **Loading States** - Elegant loading screen with pulsing logo animation
- **Dark Overlays** - Theater mode for immersive content viewing

## 🧠 Smart Features

### Intelligent Chat Responses
The messaging system includes a smart response generator that analyzes your messages and provides contextual replies:

### Automatic Cleanup
- Empty conversations are automatically removed when navigating away from Messages tab
- Maintains a clean chat list without cluttering with unused chats

### Real-Time Notifications
- Auto-generates random notifications every 60 seconds
- Simulates likes, comments, follows, and friend requests
- Toast popups appear for new notifications


<div align="center">
l̥  <p><strong>Connect • Discover • Thrive</strong></p>
</div>
