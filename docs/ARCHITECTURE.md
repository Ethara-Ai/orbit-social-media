# Orbit Architecture Documentation

## Table of Contents

- [Overview](#overview)
- [Design Principles](#design-principles)
- [Architecture Layers](#architecture-layers)
- [Data Layer](#data-layer)
- [Service Layer](#service-layer)
- [State Management Layer](#state-management-layer)
- [Hook Architecture](#hook-architecture)
- [Utility Organization](#utility-organization)
- [Component Organization](#component-organization)
- [Data Flow](#data-flow)
- [Best Practices](#best-practices)
- [Examples](#examples)

---

## Overview

Orbit follows a **layered architecture** with clear separation of concerns, emphasizing **high cohesion** and **low coupling**. The architecture is designed to be:

- **Maintainable** - Easy to understand and modify
- **Testable** - Each layer can be tested in isolation
- **Scalable** - Can grow without becoming unwieldy
- **Predictable** - Clear data flow and state management

### Architectural Improvements (Current Implementation)

The codebase has been refactored to address coupling and cohesion issues:

1. **Repository Pattern** - Data initialization separated from state management
2. **Action Hooks** - Business logic extracted from context providers
3. **Facade Hooks** - Simplified interfaces for components with multiple dependencies
4. **Domain-Specific Utilities** - Utils organized by purpose for high cohesion
5. **Pure Service Functions** - No side effects, fully testable

---

## Design Principles

### 1. High Cohesion

**Definition**: Related functionality is grouped together in single modules.

**Implementation**:
- Domain-specific contexts (FeedContext, MessagesContext, etc.)
- Service functions grouped by feature (postService, messageService)
- Utilities organized by domain (timeUtils, arrayUtils, fileUtils)
- Components organized by feature (feed/, messages/, explore/)

### 2. Low Coupling

**Definition**: Modules are independent and have minimal dependencies on each other.

**Implementation**:
- Service layer has zero React dependencies (pure functions)
- Repositories separate data initialization from state management
- Action hooks isolate business logic from UI
- Facade hooks reduce component coupling to contexts

### 3. Single Responsibility Principle

Each module has one reason to change:
- **Repositories** - Data initialization and access
- **Services** - Business logic and transformations
- **Contexts** - State management only
- **Action Hooks** - Orchestrate state updates
- **Components** - Rendering and user interaction

### 4. Dependency Inversion

Higher-level modules don't depend on lower-level modules. Both depend on abstractions:

```
Components → Hooks → Context → Services → Data
   ↓          ↓        ↓         ↓         ↓
  UI     Orchestration State  Logic   Pure Data
```

---

## Architecture Layers

### Layer Diagram

```
┌─────────────────────────────────────────────────┐
│         Presentation Layer (Components)          │
│  - Rendering UI                                  │
│  - User interactions                             │
│  - Visual feedback                               │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│         Hook Layer (Business Logic)              │
│  - Action Hooks (business operations)            │
│  - Facade Hooks (simplified interfaces)          │
│  - Utility Hooks (reusable logic)                │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│      State Management Layer (Contexts)           │
│  - Domain-specific state                         │
│  - State updates                                 │
│  - React context providers                       │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│         Service Layer (Business Logic)           │
│  - Pure functions                                │
│  - No side effects                               │
│  - Fully testable                                │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│            Data Layer (Repositories)             │
│  - Data initialization                           │
│  - Data access methods                           │
│  - Mock data generation                          │
└─────────────────────────────────────────────────┘
```

---

## Data Layer

### Repository Pattern

**Purpose**: Separate data initialization and access from state management.

**Benefits**:
- Contexts don't need to know about data structure
- Data initialization is centralized and reusable
- Easy to swap mock data with API calls later
- Testable in isolation

### Repository Structure

```javascript
// src/data/repositories/PostRepository.js
class PostRepository {
  constructor() {
    this._posts = null;
    this._comments = null;
  }

  initializePosts() {
    if (!this._posts) {
      this._posts = createMockPosts(friends);
    }
    return this._posts;
  }

  getPosts() {
    return this.initializePosts();
  }

  getPostById(postId) {
    const posts = this.getPosts();
    return posts.find((post) => post.id === postId) || null;
  }
}

// Singleton instance
export default new PostRepository();
```

### Available Repositories

| Repository | File | Purpose |
|-----------|------|---------|
| `postRepository` | `PostRepository.js` | Posts and comments data |
| `conversationRepository` | `ConversationRepository.js` | Conversation data |
| `exploreRepository` | `ExploreRepository.js` | Explore posts and categories |

### Usage in Contexts

```javascript
// OLD WAY - Data initialization in context
const mockPosts = useMemo(() => createMockPosts(friends), []);

// NEW WAY - Data from repository
const initialPosts = useMemo(() => postRepository.getPosts(), []);
```

---

## Service Layer

### Pure Functions

All service functions are **pure** - they:
- Have no side effects
- Don't mutate input
- Return new objects/arrays
- Are fully testable
- Have zero React dependencies

### Service Structure

```javascript
// src/services/postService.js

/**
 * Toggle like status on a post
 * @param {Object} post - Post to toggle like on
 * @returns {Object} Updated post with toggled like status
 */
export const toggleLike = (post) => {
  return {
    ...post,
    isLiked: !post.isLiked,
    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
  };
};

/**
 * Toggle like on a post in a posts array
 * @param {Array} posts - Array of posts
 * @param {string} postId - ID of post to toggle like on
 * @returns {Array} Updated posts array
 */
export const toggleLikeById = (posts, postId) => {
  return posts.map((post) => 
    post.id === postId ? toggleLike(post) : post
  );
};
```

### Available Services

| Service | File | Exports |
|---------|------|---------|
| `postService` | `postService.js` | Post CRUD, likes, comments, sharing |
| `messageService` | `messageService.js` | Message creation, smart responses |
| `conversationService` | `conversationService.js` | Conversation management |
| `notificationService` | `notificationService.js` | Notification generation |

---

## State Management Layer

### Context Architecture

State is organized by **feature domain**, not by component:

```javascript
// src/context/AppContext.jsx
export function AppProvider({ children }) {
  return (
    <UIProvider>
      <NotificationsProvider>
        <MessagesProvider>
          <UserProvider>
            <FeedProvider>
              <ExploreProvider>
                {children}
              </ExploreProvider>
            </FeedProvider>
          </UserProvider>
        </MessagesProvider>
      </NotificationsProvider>
    </UIProvider>
  );
}
```

### Context Providers

| Context | File | Responsibility |
|---------|------|----------------|
| `UIContext` | `UIContext.jsx` | Global UI state (tabs, modals, loading) |
| `UserContext` | `UserContext.jsx` | User profile, friends, connections |
| `FeedContext` | `FeedContext.jsx` | Posts, comments, likes, shares |
| `MessagesContext` | `MessagesContext.jsx` | Conversations, messages, chat state |
| `NotificationsContext` | `NotificationsContext.jsx` | Notifications, badges, auto-generation |
| `ExploreContext` | `ExploreContext.jsx` | Explore posts, categories, theater modal |

### Context Structure (New Pattern)

```javascript
// src/context/providers/FeedContext.jsx
export function FeedProvider({ children }) {
  // ========================================
  // 1. Initialize Data from Repository
  // ========================================
  const initialPosts = useMemo(() => postRepository.getPosts(), []);
  const initialComments = useMemo(() => postRepository.getComments(), []);

  // ========================================
  // 2. State Management ONLY
  // ========================================
  const [posts, setPosts] = useState(initialPosts);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState({});
  
  // ========================================
  // 3. Business Logic via Action Hook
  // ========================================
  const {
    handleLike,
    handleComment,
    handleAddComment,
    handleShare,
  } = useFeedActions({
    currentUser,
    setPosts,
    setComments,
    setNewComment,
    newComment,
  });

  // ========================================
  // 4. Provide State and Actions
  // ========================================
  return (
    <FeedContext.Provider value={{
      posts,
      comments,
      handleLike,
      handleComment,
      // ...
    }}>
      {children}
    </FeedContext.Provider>
  );
}
```

---

## Hook Architecture

### 1. Action Hooks

**Purpose**: Extract complex business logic from contexts.

**Benefits**:
- Contexts focus on state management only
- Business logic is reusable
- Easier to test
- Clearer separation of concerns

**Structure**:

```javascript
// src/hooks/useFeedActions.js
export const useFeedActions = ({
  currentUser,
  setPosts,
  setComments,
  setNewComment,
  newComment,
}) => {
  const handleLike = useCallback((postId) => {
    setPosts((prev) => toggleLikeById(prev, postId));
  }, [setPosts]);

  const handleAddComment = useCallback((postId) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    const newCommentObj = createComment({
      user: currentUser,
      content: commentText,
      postId,
    });

    setComments((prev) => addComment(prev, newCommentObj));
    setPosts((prev) => incrementCommentsById(prev, postId));
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  }, [newComment, currentUser, setComments, setPosts, setNewComment]);

  return {
    handleLike,
    handleAddComment,
    // ...
  };
};
```

**Available Action Hooks**:

| Hook | File | Purpose |
|------|------|---------|
| `useFeedActions` | `useFeedActions.js` | Feed operations (like, comment, share, create) |
| `useMessagesActions` | `useMessagesActions.js` | Messaging operations (send, clear, attachments) |

### 2. Facade Hooks

**Purpose**: Simplify components with multiple context dependencies.

**Benefits**:
- Reduce component coupling to contexts
- Single interface for related data/actions
- Easier to refactor contexts without breaking components
- Better component readability

**Structure**:

```javascript
// src/hooks/usePostCard.js
export const usePostCard = () => {
  // Access multiple contexts
  const {
    comments,
    showComments,
    handleLike,
    handleComment,
  } = useFeed();

  const { currentUser, currentUserAvatar } = useUser();

  // Return consolidated interface
  return {
    // User data
    currentUser,
    currentUserAvatar,
    // Feed data
    comments,
    showComments,
    // Actions
    handleLike,
    handleComment,
  };
};
```

**Usage in Component**:

```javascript
// OLD WAY - Multiple context dependencies
const PostCard = ({ post }) => {
  const { comments, handleLike } = useFeed();
  const { currentUser } = useUser();
  // ...
};

// NEW WAY - Single facade hook
const PostCard = ({ post }) => {
  const { comments, handleLike, currentUser } = usePostCard();
  // ...
};
```

### 3. Utility Hooks

**Purpose**: Reusable stateful logic.

**Available Utility Hooks**:

| Hook | File | Purpose |
|------|------|---------|
| `useDebounce` | `useDebounce.js` | Debounce values with configurable delay |
| `useLocalStorage` | `useLocalStorage.js` | Persist state to localStorage |
| `useMediaQuery` | `useMediaQuery.js` | Responsive media query matching |
| `useClickOutside` | `useClickOutside.js` | Detect clicks outside an element |
| `useScrollToBottom` | `useScrollToBottom.js` | Auto-scroll to bottom of container |
| `useScrollPosition` | `useScrollPosition.js` | Track scroll position |

---

## Utility Organization

### Domain-Specific Modules

**Problem**: The old helpers.js file had 30+ unrelated functions (low cohesion).

**Solution**: Split utilities into domain-specific modules.

### Utility Modules

| Module | File | Purpose | Functions |
|--------|------|---------|-----------|
| **Time** | `timeUtils.js` | Time/date formatting | `formatRelativeTime`, `formatTime` |
| **Array** | `arrayUtils.js` | Array manipulation | `pickRandom`, `shuffleArray`, `getRandomItems`, `groupBy` |
| **File** | `fileUtils.js` | File processing | `readFileAsDataUrl`, `isValidImage`, `processImageFile` |
| **String** | `stringUtils.js` | String manipulation | `truncateText`, `capitalizeFirst`, `isEmpty` |
| **DOM** | `domUtils.js` | DOM manipulation | `copyToClipboard`, `scrollToTop`, `scrollIntoView`, `cn` |
| **Number** | `numberUtils.js` | Number formatting | `formatNumber`, `generateId` |
| **Object** | `objectUtils.js` | Object/function utils | `deepClone`, `debounce`, `throttle` |

### Migration Strategy

The `helpers.js` file now serves as a **backward compatibility layer**:

```javascript
// src/utils/helpers.js

// Re-export from domain-specific modules
export { formatRelativeTime, formatTime } from "./timeUtils";
export { pickRandom, shuffleArray } from "./arrayUtils";
export { processImageFile } from "./fileUtils";
// ...
```

**Recommendation**: New code should import directly from domain-specific modules:

```javascript
// OLD WAY
import { formatRelativeTime } from "../utils/helpers";

// NEW WAY
import { formatRelativeTime } from "../utils/timeUtils";
```

---

## Component Organization

### Component Structure

```
src/components/
├── common/              # Reusable UI components
├── layout/              # Layout components
├── feed/                # Feed feature
├── messages/            # Messages feature
├── notifications/       # Notifications feature
├── explore/             # Explore feature
├── connections/         # Connections feature
├── profile/             # Profile feature
├── sidebar/             # Sidebar subcomponents
├── icons.jsx            # SVG icons
└── index.js             # Barrel export
```

### Component Principles

1. **Colocate tests** with components
2. **Single responsibility** - one component, one purpose
3. **Composition over props drilling** - use context hooks
4. **Presentational components** - minimal logic, maximum rendering

---

## Data Flow

### Complete Data Flow Example: Liking a Post

```
┌─────────────────────────────────────────────────┐
│ 1. User clicks like button                      │
│    Component: PostActions.jsx                    │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ 2. Call handleLike(postId)                      │
│    Hook: usePostCard (facade)                    │
│    → Delegates to useFeed().handleLike           │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ 3. Execute business logic                       │
│    Hook: useFeedActions.handleLike               │
│    → Calls setPosts(prev => toggleLikeById(...)) │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ 4. Apply transformation                         │
│    Service: postService.toggleLikeById           │
│    → Pure function, returns new array            │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ 5. State update triggers re-render              │
│    Context: FeedContext                          │
│    → All consumers of posts receive update       │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ 6. Component re-renders with new data           │
│    Component: PostActions.jsx                    │
│    → Shows updated like count and state          │
└─────────────────────────────────────────────────┘
```

### Layer Interactions

```
Components
    ↕ (via hooks)
Facade Hooks ← simplify interface
    ↕ (access)
Context Providers
    ↕ (via action hooks)
Action Hooks ← orchestrate operations
    ↕ (call)
Service Functions ← business logic
    ↕ (use)
Repositories ← data access
```

---

## Best Practices

### 1. When to Create an Action Hook

Create an action hook when:
- Business logic is complex (multiple state updates)
- Logic uses multiple service functions
- Logic needs to be reusable
- Context provider is getting too large

### 2. When to Create a Facade Hook

Create a facade hook when:
- Component needs data from 2+ contexts
- Multiple components need the same context combination
- You want to reduce component coupling to contexts

### 3. When to Create a Repository

Create a repository when:
- Data initialization is complex
- Multiple contexts need the same data
- You want to prepare for API integration
- Data access patterns are becoming repetitive

### 4. When to Create a Service Function

Create a service function when:
- Logic is pure (no side effects)
- Logic is reusable across features
- Logic involves data transformation
- Logic can be tested in isolation

### 5. File Naming Conventions

```
Component:         PostCard.jsx
Component Test:    PostCard.test.jsx
Hook:              useFeedActions.js
Hook Test:         useFeedActions.test.js
Service:           postService.js
Service Test:      postService.test.js
Repository:        PostRepository.js
Utility:           timeUtils.js
Utility Test:      timeUtils.test.js
```

---

## Examples

### Example 1: Creating a New Feature

Let's add a "Bookmarks" feature:

```javascript
// 1. Create Repository
// src/data/repositories/BookmarkRepository.js
class BookmarkRepository {
  getBookmarks() {
    return [];
  }
}
export default new BookmarkRepository();

// 2. Create Service
// src/services/bookmarkService.js
export const addBookmark = (bookmarks, postId) => {
  return [...bookmarks, { postId, timestamp: Date.now() }];
};

export const removeBookmark = (bookmarks, postId) => {
  return bookmarks.filter(b => b.postId !== postId);
};

// 3. Create Context
// src/context/providers/BookmarkContext.jsx
export function BookmarkProvider({ children }) {
  const initialBookmarks = useMemo(() => 
    bookmarkRepository.getBookmarks(), []
  );
  
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  
  const { handleAdd, handleRemove } = useBookmarkActions({
    setBookmarks,
  });
  
  return (
    <BookmarkContext.Provider value={{ bookmarks, handleAdd, handleRemove }}>
      {children}
    </BookmarkContext.Provider>
  );
}

// 4. Create Action Hook
// src/hooks/useBookmarkActions.js
export const useBookmarkActions = ({ setBookmarks }) => {
  const handleAdd = useCallback((postId) => {
    setBookmarks(prev => addBookmark(prev, postId));
  }, [setBookmarks]);
  
  const handleRemove = useCallback((postId) => {
    setBookmarks(prev => removeBookmark(prev, postId));
  }, [setBookmarks]);
  
  return { handleAdd, handleRemove };
};

// 5. Create Component
// src/components/bookmarks/BookmarksTab.jsx
const BookmarksTab = () => {
  const { bookmarks, handleRemove } = useBookmark();
  // Render bookmarks...
};
```

### Example 2: Refactoring a Complex Component

**Before** (tightly coupled):

```javascript
const ComplexComponent = () => {
  const { posts, handleLike } = useFeed();
  const { currentUser } = useUser();
  const { notifications } = useNotifications();
  const { activeTab } = useUI();
  
  // Complex logic mixing concerns...
  const handleAction = () => {
    // Business logic here...
  };
  
  return <div>...</div>;
};
```

**After** (using facade hook):

```javascript
// Create facade hook
const useComplexComponent = () => {
  const { posts, handleLike } = useFeed();
  const { currentUser } = useUser();
  const { notifications } = useNotifications();
  const { activeTab } = useUI();
  
  return {
    posts,
    currentUser,
    notifications,
    activeTab,
    handleLike,
  };
};

// Simplified component
const ComplexComponent = () => {
  const { posts, currentUser, handleLike } = useComplexComponent();
  
  return <div>...</div>;
};
```

---

## Testing Strategy

### 1. Repository Tests

```javascript
// PostRepository.test.js
test('should initialize posts only once', () => {
  postRepository.reset();
  const posts1 = postRepository.getPosts();
  const posts2 = postRepository.getPosts();
  expect(posts1).toBe(posts2); // Same reference
});
```

### 2. Service Tests

```javascript
// postService.test.js
test('toggleLike should increment likes when not liked', () => {
  const post = { id: '1', isLiked: false, likes: 10 };
  const result = toggleLike(post);
  expect(result.likes).toBe(11);
  expect(result.isLiked).toBe(true);
});
```

### 3. Hook Tests

```javascript
// useFeedActions.test.js
test('handleLike should update posts', () => {
  const { result } = renderHook(() => useFeedActions({
    setPosts: mockSetPosts,
    // ...
  }));
  
  act(() => {
    result.current.handleLike('post-1');
  });
  
  expect(mockSetPosts).toHaveBeenCalled();
});
```

---

## Migration Guide

### Migrating Old Code to New Architecture

1. **Identify coupled code** - Look for contexts with complex logic
2. **Extract to repositories** - Move data initialization
3. **Create service functions** - Extract pure business logic
4. **Create action hooks** - Move complex handlers from contexts
5. **Create facade hooks** - Simplify component interfaces
6. **Update imports** - Use domain-specific utils
7. **Add tests** - Test each layer independently

---

## Future Improvements

Potential architectural enhancements:

1. **API Integration Layer** - Replace repositories with API clients
2. **State Persistence** - Add localStorage/IndexedDB layer
3. **Optimistic Updates** - Improve perceived performance
4. **Error Boundaries** - Better error isolation
5. **Performance Monitoring** - Track render performance
6. **Code Splitting** - Lazy load features
7. **Type Safety** - Add TypeScript or JSDoc

---

## Resources

- [React Context Best Practices](https://kentcdodds.com/blog/how-to-use-react-context-effectively)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

<div align="center">
  <p><strong>Built with care for maintainability, testability, and scalability</strong></p>
</div>