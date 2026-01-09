# Orbit Social Media

Orbit Social Media is a modern, responsive single-page social networking application built with React, Vite, and Tailwind CSS. It is designed to demonstrate advanced frontend architecture patterns, state management, and component reusability. It currently operates with mock data but is structured to easily integrate with a backend API.

## Project Architecture

The project adopts a layered, modular architecture that enforces separation of concerns. This ensures that UI components remain purely presentational, while state and business logic are managed in dedicated layers.

### 1. Technology Stack

*   **Core Framework**: React 19 (using Vite for rapid development and building)
*   **Styling**:
    *   **Tailwind CSS 4**: For utility-first, responsive styling.
    *   **Vanilla CSS**: Used sparingly for complex scrollbar customizations (`src/index.css`).
*   **Animation**:
    *   **Framer Motion**: Powering complex transitions, modal animations, and micro-interactions.
*   **Data Handling**:
    *   **Context API**: For global state management (User session, Feed status, Messages).
    *   **Repository Pattern**: For abstracting data fetching (simulates API calls).
*   **Quality Assurance**:
    *   **Vitest**: For unit and integration testing.
    *   **React Testing Library**: For testing components in a DOM-like environment.
    *   **ESLint & Prettier**: For code quality and consistent formatting.

### 2. Scalable Directory Structure

The codebase is organized by feature and function rather than just file type:

```
src/
├── components/          # Presentational UI Components
│   ├── common/          # Atomic components (Avatar, Button, Badge)
│   ├── explore/         # Explore grid & Theater Modal viewer
│   ├── feed/            # Main Feed: CreatePost, PostCard, FeedList
│   ├── layout/          # Layout wrappers: Sidebar, Header, MobileNav
│   ├── messages/        # Messaging: Chat windows, Conversation lists
│   ├── profile/         # User Profiles: Headers, Stats, Activity logs
│   └── ui/              # Generic UI molecules (Modals, Dropdowns)
├── context/             # State Management Layer
│   ├── AppContext.js    # Aggregator for all providers
│   └── providers/       # Individual domain providers (Feed, User, etc.)
├── data/                # Data Access Layer
│   ├── mockData/        # Static JSON/JS data for development
│   └── repositories/    # Classes mediating between components & data
├── hooks/               # Business Logic Layer (Custom Hooks)
│   ├── useFeedActions.js     # Post creation/interaction logic
│   ├── useMessagesActions.js # Chat & attachment logic
│   └── ...
├── services/            # Domain Logic (Pure Functions)
│   ├── postService.js        # Post transformation/filtering rules
│   ├── messageService.js     # Chat response algorithms
│   └── fileUtils.js          # File reading & validation helpers
└── main.jsx             # Application Entry Point
```

## Key Architectural Patterns

### A. Context-Driven State Management
Instead of a single global store (like Redux), the app uses distinct Contexts for different domains to specific minimize re-renders.

*   **`FeedContext`**: Manages the list of posts, comments, and the "Create Post" form state.
*   **`MessagesContext`**: Handles active conversation threads, unread counts, and message inputs.
*   **`UserContext`**: Stores the authenticated user's profile and settings.
*   **`PostsContext`**: act as a bridge ensuring that if a post is liked in the "Explore" view, it updates in the "Feed" view instantly.
*   **`MobileNavContext`**: Manages the complex state of mobile sidebars and body scroll locking.

### B. The Hook-Action Pattern
We separate **UI** from **Logic**. Components do not manipulate state directly; they call actions exposed by custom hooks.

*   **Example**: `useFeedActions()` exposes `handleCreatePost`.
    *   **Component**: Calls `handleCreatePost(content, images)`.
    *   **Hook**: Validates input, formats data, calls `postService`, and updates `FeedContext`.
    *   **Benefit**: The `CreatePost` component focuses solely on rendering the form.

### C. The Repository Pattern
To prepare for future backend integration, data fetching is abstracted.

*   **`PostRepository`**: Currently fetches from `mockData.js`. In the future, this class can be updated to fetch from a REST or GraphQL API without changing a single React component.

### D. Service Layer for Business Logic
Reusable logic is kept in pure functions within the `services/` directory, making unit testing trivial.

*   **`fileUtils.js`**: Handles reading files as Data URLs for image previews.
*   **`messageService.js`**: Contains algorithm for "Smart Responses" in the chat demo.

## Core Features & Capabilities

### 1. Interactive Feed
*   **Multi-Image Uploads**: Users can select and upload multiple images for a single post.
*   **Rich Interactions**: Like, comment, and share (copies link to clipboard) actions.
*   **Optimized Rendering**: Posts lists are virtualized or efficiently rendered to handle large datasets.

### 2. Advanced Messaging System
*   **Real-Time Simulation**: Messages appear instantly, with simulated "typing" and smart auto-replies.
*   **Media Sharing**: Support for sending multiple images within a chat bubble.
*   **Unread Management**: Real-time tracking of unread message counts.

### 3. Immersive Explore ("Theater Mode")
*   **Modal View**: Clicking a post in Explore opens a full-screen "Theater Mode".
*   **Deep Linking**: Posts in this mode support direct interaction (liking, commenting) that syncs back to the main feed.
*   **Responsive**: Fully adapted UI for mobile devices (hiding/showing side panels).

### 4. Application-Wide Polish
*   **Dark Mode**: Native, system-aware dark mode built with Tailwind.
*   **Responsive Design**: A mobile-first approach ensuring perfect layout from iPhone SE to 4K desktops.
*   **Scroll Locking**: Intelligent handling of body scroll when modals or mobile menus are open.

## Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Ethara-AI/orbit-social-media.git
    cd orbit-social-media
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Running Tests

*   **Unit Tests**:
    ```bash
    npm run test
    ```
*   **Test Coverage**:
    ```bash
    npm run test:coverage
    ```

## Contributing Guidelines

1.  **Code Style**: We use ESLint and Prettier.
    *   Run `npm run lint` to catch errors.
    *   Run `npm run format` to auto-fix styling.
2.  **Commit Messages**: Please use clear, descriptive commit messages.
3.  **Architecture**: When adding new features, try to stick to the Service/Hook/Component pattern.

## License

This project is licensed under the MIT License.
