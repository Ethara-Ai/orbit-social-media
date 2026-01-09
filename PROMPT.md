Build a social networking dashboard named Orbit using React 19, Vite, Tailwind CSS 4, and Framer Motion. Structure the codebase with a layered architecture emphasizing high cohesion and low coupling.

Organize state through six domain-specific React Context providers (User, Feed, Messages, Notifications, Explore, UI), each focusing on state management only. Extract complex business logic into action hooks (useFeedActions, useMessagesActions) that orchestrate operations. Use facade hooks (usePostCard) to simplify components with multiple context dependencies.

Implement a repository pattern for data initialization (PostRepository, ConversationRepository, ExploreRepository) to decouple data access from state management. Extract pure business logic into a service layer (postService, messageService, conversationService, notificationService) with zero React dependencies. Organize utilities into domain-specific modules (timeUtils, arrayUtils, fileUtils, stringUtils, domUtils, numberUtils, objectUtils) for high cohesion.

Create reusable hooks for click-outside detection, debouncing, localStorage persistence, media queries, and scroll handling. Use ErrorBoundary components to isolate failures. Colocate tests with components using Vitest and React Testing Library.

Design the interface with: a collapsible left sidebar showing user profile, navigation, analytics, and friends list; a main content area with six tab views (Home feed, Discover/Explore, Messages, Notifications, Connections, Profile); and a right sidebar displaying online contacts and suggested users. The Home feed supports post creation with likes, comments, and shares. Discover includes category filtering, featured posts, and a theater mode for immersive viewing. Messages features smart contextual auto-responses, typing indicators, and image attachments. Notifications auto-generates alerts every 60 seconds simulating social interactions.

Style with an orange/amber color scheme, card-based layouts, Framer Motion animations, custom scrollbars, and responsive design for desktop, tablet, and mobile. Configure GitHub Actions for CI/CD deployment via SSH.

Seed with mock data through repositories including user profiles, friends with availability states, posts with comments, chat conversations, notifications, and suggested users so the app feels complete on first load.