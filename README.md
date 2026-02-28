# BEGENONE Monolith (Legacy Architecture)

## 1. System Overview

BEGENONE is a video-sharing social media platform. This repository contains the monolithic backend implementation that served as the platform's initial production system. The application provides video upload and playback, channel management, user authentication, subscription-based access control, content engagement (likes, dislikes, comments), text-based content publishing ("Wires"), search, and payment processing.

### Functional Scope

The monolith handles the complete server-side lifecycle of the platform:

- User registration, email verification, and session management
- Channel creation, customization, and subscription mechanics
- Video upload to cloud storage, metadata persistence, and retrieval
- Comment threading and engagement tracking
- Subscription tier management with payment integration
- Server-side rendered views for the client interface
- Fuzzy search across video content
- Text-based content publishing (Wires)

### System Boundary

This repository covers the backend API layer, server-side rendering layer, and static asset serving. It does not include a standalone frontend application; the client interface is rendered server-side using Pug templates with client-side JavaScript for interactivity. Media storage is delegated to AWS S3, and the database is hosted externally on MongoDB Atlas. Payment processing is handled via Stripe's hosted checkout flow.

### What This Repository Does Not Cover

- Mobile client applications
- Content delivery network configuration (CloudFront is referenced but configured externally)
- Database administration or migration tooling
- Monitoring, alerting, or observability infrastructure
- Automated testing (no test suite is present)

---

## 2. Architectural Context and Rationale

### Why a Monolith

The monolithic architecture was selected as the appropriate starting point for an early-stage product with a small development team. At the time of initial development, the following constraints informed the decision:

- **Team size**: A single developer. Microservices introduce operational overhead in deployment orchestration, inter-service communication, and distributed debugging that is disproportionate for a solo contributor.
- **Domain uncertainty**: The product's feature boundaries were not yet well-defined. Features such as Stories, Products, Reviews, and Sponsors were prototyped and later abandoned (their models and routes remain in the codebase in a commented-out state). A monolith allows rapid prototyping without the cost of provisioning and wiring new services.
- **Deployment simplicity**: A single deployable artifact reduces the infrastructure surface area. One Docker image, one process, one deployment pipeline.
- **Shared data access**: All domain entities (Users, Videos, Channels, Comments, Subscriptions) are tightly interrelated. In a monolith, these relationships are resolved through in-process Mongoose population rather than cross-service API calls, avoiding network latency and distributed consistency concerns.

### Accepted Trade-offs

- **Vertical scaling only**: The single-process model limits horizontal scaling. Under load, the entire application must be replicated rather than scaling individual bottlenecks (e.g., video upload processing independently of comment retrieval).
- **Deployment coupling**: Any change to any feature requires redeploying the entire application. A modification to the comment system carries the same deployment risk as a change to the payment integration.
- **Fault isolation**: A failure in one subsystem (e.g., an unhandled exception in the S3 upload path) can terminate the entire process, affecting all users and all features.
- **Technology homogeneity**: All components must operate within the same runtime and framework constraints. There is no option to use a different language or runtime for computationally distinct tasks (e.g., video transcoding).

These trade-offs were acceptable given the development stage. The monolith served its purpose as a vehicle for validating product assumptions and establishing the core domain model.

---

## 3. Technology Stack and Justification

### Runtime Environment

| Component | Technology | Version | Role |
|-----------|-----------|---------|------|
| Runtime | Node.js | 20.x (Docker image: `node:20-alpine`) | Server-side JavaScript execution |
| Package Manager | npm | (bundled with Node.js) | Dependency management |

Node.js was selected for its non-blocking I/O model, which suits the I/O-bound nature of the application (database queries, S3 uploads, HTTP request handling). The single-language stack (JavaScript on both server and client) reduced context-switching overhead for a solo developer.

### Framework

| Component | Technology | Version | Role |
|-----------|-----------|---------|------|
| Web Framework | Express.js | 4.18.x | HTTP routing, middleware pipeline, request/response handling |
| Template Engine | Pug | 3.0.x | Server-side HTML rendering |

Express was chosen for its minimal abstraction over Node.js HTTP primitives, large middleware ecosystem, and low learning curve. Pug provides server-side rendering without requiring a separate frontend build system for the initial implementation.

### Database Layer

| Component | Technology | Version | Role |
|-----------|-----------|---------|------|
| Database | MongoDB Atlas | (hosted) | Document persistence |
| ODM | Mongoose | 5.13.x | Schema definition, validation, query building, population |

MongoDB's document model aligns with the hierarchical nature of the domain (a Channel contains Videos, each Video contains Comments). Mongoose provides schema enforcement on an otherwise schemaless database, adding validation, type coercion, and middleware hooks at the application layer.

### Media Storage

| Component | Technology | Role |
|-----------|-----------|------|
| Object Storage | AWS S3 | Video, thumbnail, and image persistence |
| SDK | @aws-sdk/client-s3 (v3), @aws-sdk/s3-request-presigner | Programmatic S3 interaction |
| CDN | AWS CloudFront | Content delivery (configured externally, referenced via `CLOUDFRONT_DOMAIN`) |
| Upload Middleware | Multer | Multipart form data parsing with in-memory buffering |

Videos and images are uploaded through the Express server, buffered in memory via Multer, and then streamed to S3. Presigned URLs are generated for client-side retrieval, enabling direct S3 access without proxying through the application server.

### Authentication and Security

| Component | Technology | Role |
|-----------|-----------|------|
| Token Generation | jsonwebtoken (9.0.x) | JWT creation and verification |
| Password Hashing | bcryptjs (2.4.x) | Password storage with adaptive cost factor |
| Input Sanitization | express-mongo-sanitize | NoSQL injection prevention |
| XSS Protection | xss-clean | Cross-site scripting mitigation |
| Security Headers | Helmet (7.1.x) | HTTP security header management |
| CORS | cors (2.8.x) | Cross-origin request handling |

### Payment Processing

| Component | Technology | Role |
|-----------|-----------|------|
| Payment Gateway | Stripe (17.4.x) | Subscription checkout and webhook handling |

Stripe Checkout Sessions handle the payment flow. Webhook events (`checkout.session.completed`, `customer.subscription.updated`) drive subscription lifecycle state changes.

### Search

| Component | Technology | Role |
|-----------|-----------|------|
| Fuzzy Search | Fuse.js (7.0.x) | Client-side fuzzy matching over video titles |

Search is implemented by loading all video documents into memory and performing fuzzy matching via Fuse.js. This approach is functional at small scale but does not support full-text indexing, relevance scoring, or pagination at the database level.

### Email

| Component | Technology | Role |
|-----------|-----------|------|
| Email Transport | Nodemailer (6.9.x) | SMTP-based transactional email delivery |

Used for email verification tokens and password reset flows. Configured against a private email host (`mail.privateemail.com`) in production.

### Logging

| Component | Technology | Role |
|-----------|-----------|------|
| HTTP Logging | Morgan | Request logging in development |
| Application Logging | Winston (3.17.x) | Structured logging to console and file (`app.log`) |

### Build Tooling

| Component | Technology | Role |
|-----------|-----------|------|
| Bundler | Parcel (2.10.x) | Client-side JavaScript bundling |
| Linting | ESLint (8.56.x) with Airbnb config | Code style enforcement |
| Formatting | Prettier (3.1.x) | Code formatting |

### Additional Libraries

| Library | Role |
|---------|------|
| compression | Gzip response compression |
| cookie-parser | Cookie parsing for JWT extraction |
| date-fns | Date manipulation |
| sharp | Image processing (referenced in dependencies) |
| slugify | URL slug generation |
| validator | String validation utilities |
| axios | HTTP client (used in client-side code) |

---

## 4. System Architecture

### Layered Structure

The application follows a modified MVC pattern with the following layers:

```
Client Request
      |
      v
[Express Middleware Pipeline]
  - CORS
  - Helmet (security headers)
  - Morgan (request logging, development only)
  - Body parsing (JSON, URL-encoded, raw for webhooks)
  - Cookie parsing
  - Mongo sanitization
  - XSS sanitization
  - Compression
  - User attachment to locals
      |
      v
[Route Layer]
  - URL pattern matching
  - Route-specific middleware chains (protect, checkSubscription, multer)
      |
      v
[Controller Layer]
  - Request validation
  - Business logic execution
  - Database interaction via Mongoose
  - External service calls (S3, Stripe, Nodemailer)
  - Response formatting
      |
      v
[Model Layer (Mongoose)]
  - Schema validation
  - Pre/post hooks (password hashing, population)
  - Query execution against MongoDB
      |
      v
[External Services]
  - MongoDB Atlas (persistence)
  - AWS S3 (media storage)
  - Stripe (payments)
  - SMTP server (email)
```

### Request Lifecycle

1. An incoming HTTP request enters the Express middleware pipeline.
2. Global middleware executes sequentially: security headers, CORS, body parsing, sanitization, compression.
3. The request is matched against mounted route handlers (`/api/v1/users`, `/api/v1/videos`, etc.).
4. Route-specific middleware executes: authentication (`protect`), subscription validation (`checkUserSubscription`), file upload parsing (`multer`).
5. The matched controller function executes business logic, interacting with Mongoose models and external services.
6. The controller sends a JSON response (API routes) or renders a Pug template (view routes).
7. If an error occurs in an async controller, `catchAsync` forwards it to Express's error handling chain.

### Routing Patterns

Routes are organized by domain entity and mounted at versioned API paths:

- `/api/v1/users` — User management and authentication
- `/api/v1/videos` — Video CRUD and engagement
- `/api/v1/channels` — Channel management and subscriptions
- `/api/v1/comments` — Comment CRUD (also nested under videos: `/api/v1/videos/:videoId/comments`)
- `/api/v1/wires` — Wire (text post) CRUD
- `/api/v1/pricings` — Subscription tier retrieval and checkout
- `/` — Server-rendered view routes
- `/search` — Search API
- `/webhooks-checkout` — Stripe webhook endpoint

API versioning (`v1`) is present in the URL structure, indicating awareness of future API evolution, though only one version exists.

### Controller Organization

Controllers are decomposed into single-responsibility files grouped by domain:

```
controllers/
  auth-controllers/     # Authentication and authorization
  video-controllers/    # Video CRUD and media operations
  channel-controllers/  # Channel management
  user-controllers/     # User profile operations
  comment-controllers/  # Comment CRUD
  pricing-controllers/  # Payment and subscription
  wires-controller/     # Wire (text post) CRUD
  view-controllers/     # Server-side rendering
  search-controllers/   # Search functionality
  aws_s3-controller/    # S3 upload utilities
  util-controllers/     # Cross-cutting utilities
  _old-controllers/     # Deprecated monolithic controller files
```

The `_old-controllers/` directory preserves an earlier iteration where each domain was a single file. The refactoring into per-function files improved readability and reduced merge conflicts but did not introduce a formal service layer.

### Error Handling Strategy

- **Async errors**: All async controller functions are wrapped with `catchAsync`, which catches rejected promises and forwards them to Express's `next()` error handler.
- **Custom errors**: `AppError` extends `Error` with `statusCode`, `status` (`fail` for 4xx, `error` for 5xx), and `isOperational` flag to distinguish expected errors from programming errors.
- **Process-level errors**: `server.js` registers handlers for `uncaughtException` (synchronous) and `unhandledRejection` (asynchronous), both of which log the error and terminate the process.
- **Limitation**: No centralized error-handling middleware is registered at the end of the Express pipeline. Error responses are constructed individually within controllers rather than through a unified formatter.

### Logging Strategy

- **Development**: Morgan logs HTTP requests in `dev` format to stdout.
- **Application**: Winston provides `logInfo` and `logError` functions that write to both console and `app.log` file. Winston is used selectively (primarily in the Stripe webhook handler) rather than uniformly across all controllers.
- **Ad-hoc**: `console.log` statements are present throughout the codebase for debugging purposes.

---

## 5. Data Management and Persistence Strategy

### Data Modeling Approach

The application uses Mongoose ODM to impose schema structure on MongoDB documents. Eight active models define the domain:

| Model | Collection | Primary Purpose |
|-------|-----------|-----------------|
| User | users | Account credentials, profile, platform settings |
| Video | videos | Video metadata, engagement metrics, S3 references |
| Channel | channels | Creator profiles, subscriber lists, content aggregation |
| Comment | comments | User-generated text responses to videos |
| Wire | wires | Short-form text content published to channels |
| Pricing | pricings | Subscription tier definitions and feature flags |
| Subscription | subscriptions | User-to-pricing-tier binding with payment state |
| Notification | notifications | Event notifications (partially implemented) |

Four additional models (Story, Product, Review, Sponsor) exist in a commented-out state, representing abandoned feature explorations.

### Schema Relationships

The data model centers on the User-Channel-Video triad:

```
User (1) -----> (0..1) Channel
  |                      |
  |                      |-----> (*) Video
  |                      |-----> (*) Wire
  |                      |-----> (*) Comment
  |
  |-----> (*) Subscription -----> (1) Pricing
  |-----> (*) Channel (subscribedChannels)

Video (1) -----> (*) Comment
  |
  |-----> (*) User (likedBy, dislikedBy)

Comment -----> (0..1) Comment (self-referential reply)
```

Relationships are stored as ObjectId references and resolved at query time using Mongoose `populate()`. Several models use `pre(/^find/)` hooks to automatically populate related documents on every query. This simplifies controller code but introduces implicit query expansion: a single `Channel.findById()` triggers population of videos, wires, comments, user, and several commented-out references, resulting in multiple database round-trips per request.

### Validation

Validation operates at two levels:

- **Schema-level**: Mongoose schema definitions enforce `required`, `enum`, `minLength`, `maxLength`, and `type` constraints. For example, `username` is constrained to lowercase with a maximum of 50 characters; `comment` text requires between 1 and 5,000 characters.
- **Controller-level**: Individual controllers perform manual checks (e.g., verifying email and password are present before login). `express-validator` is used in limited scope (pricing ID validation). A dedicated `inputValidation.js` utility provides basic string sanitization.

There is no unified validation middleware layer applied consistently across all endpoints.

### Indexing Strategy

Explicit indexing is minimal. The `channelUserName` field on the Channel model is marked `unique: true`, which creates a unique index. No compound indexes, text indexes, or performance-oriented indexes are defined at the application level. MongoDB's default `_id` index applies to all collections.

### Consistency Considerations

MongoDB does not enforce referential integrity. The application manages consistency through application-level logic:

- When a video is created, the controller pushes the video's ObjectId into the parent channel's `videos` array.
- When a user subscribes to a channel, both the user's `subscribedChannels` array and the channel's `subscribers` array are updated.
- Soft deletion is used for users (`active: false`) rather than hard deletion, preserving referential integrity of existing content.

These operations are not wrapped in transactions, meaning a failure mid-operation could leave the data in an inconsistent state (e.g., a video created but not linked to its channel).

### Scalability Within the Monolith

The populate-heavy query pattern and in-memory search (Fuse.js loads all video documents) represent scaling constraints. As the video collection grows, search response times degrade linearly. Population chains on Channel queries grow proportionally with content volume.

---

## 6. Security Architecture

### Authentication Flow

Authentication is JWT-based with dual delivery mechanisms:

1. **Bearer token**: Extracted from the `Authorization` header.
2. **Cookie**: Extracted from the `jwt` cookie, set on login with a 90-day expiration.

The `protect` middleware verifies the token, decodes the user ID, confirms the user still exists, and checks that the password has not been changed since the token was issued. On success, the authenticated user is attached to `req.user`.

A non-blocking variant, `isLoggedIn`, performs the same verification but does not reject unauthenticated requests. It is used on view routes to conditionally render authenticated UI elements.

### Password Security

- Passwords are hashed using bcryptjs with a cost factor of 12.
- The `passwordConfirm` field is used for client-side confirmation and is explicitly set to `undefined` after hashing.
- Password fields are excluded from query results via `select: false`.
- Password change timestamps are tracked to invalidate tokens issued before a password change.

### Email Verification

New accounts are created with `active: false`. A SHA-256 hashed verification token is generated and emailed to the user. The token expires after 7 days. Verification sets `active: true`. Resend attempts are rate-limited to 3 per cooldown period (1 hour).

### Password Reset

A SHA-256 hashed reset token is generated and emailed. The token expires after 10 minutes. On submission, the token is verified, the password is updated, and a new JWT is issued.

### Authorization Logic

Authorization operates at three levels:

1. **Authentication gate**: The `protect` middleware rejects unauthenticated requests with a 401 status.
2. **Role-based control**: The User model defines roles (`user`, `co-admin`, `admin`). However, role-based middleware restrictions are not consistently applied across routes. Most protected routes verify authentication but do not enforce role requirements.
3. **Subscription-based access**: The `checkSubscription` and `subscriptionAccessControl` middleware verify that the user holds an active subscription with the required feature flags (e.g., `videoUpload`, `channelCreation`). This gates premium functionality behind paid tiers.

### Input Protection

- **NoSQL injection**: `express-mongo-sanitize` strips `$` and `.` characters from request bodies, preventing MongoDB operator injection.
- **XSS**: `xss-clean` sanitizes user input to remove script tags and event handlers.
- **Security headers**: Helmet sets standard security headers, though Content Security Policy and Cross-Origin Opener Policy are explicitly disabled.

### Limitations

- **Rate limiting**: `express-rate-limit` is imported and configured but commented out. No active rate limiting protects against brute-force attacks.
- **CORS**: Configured to allow all origins (`app.use(cors())`), which permits requests from any domain.
- **Cookie security**: The JWT cookie does not set `httpOnly: true` in production, leaving it accessible to client-side JavaScript and vulnerable to XSS-based token theft.
- **CSRF**: No CSRF protection is implemented.
- **Request size limits**: Body parser size limits are commented out.
- **Secret management**: Sensitive values (database credentials, API keys, JWT secret) are stored in a `config.env` file. In the Kubernetes configuration, secrets are stored in ConfigMaps rather than Kubernetes Secrets, which do not provide encryption at rest.

---

## 7. Media Handling and Performance Considerations

### Upload Strategy

Video and image uploads follow a synchronous pipeline:

1. The client sends a multipart form request to the Express server.
2. Multer parses the multipart data and buffers the entire file in server memory (`multer.memoryStorage()`).
3. The buffered file is uploaded to AWS S3 using the `@aws-sdk/client-s3` Upload utility.
4. The S3 object key is stored in the corresponding Mongoose document.

File naming follows the pattern `{type}-{channelId}-{timestamp}.{extension}`, where type is one of `video`, `thumbnail`, `profilepic`, or `banner`.

### Storage and Retrieval

- **Storage**: All media is persisted in a single S3 bucket (`S3_BUCKET_NAME`).
- **Retrieval**: Presigned URLs are generated via `@aws-sdk/s3-request-presigner` for time-limited direct access to S3 objects. A CloudFront distribution (`CLOUDFRONT_DOMAIN`) is referenced for CDN-based delivery, offloading bandwidth from the application server.

### Performance Constraints

- **Memory buffering**: Multer's memory storage strategy loads the entire file into the Node.js process heap before uploading to S3. For large video files, this creates memory pressure and limits concurrent upload capacity. A streaming approach (piping the multipart stream directly to S3) would reduce memory consumption.
- **Single-threaded processing**: Node.js processes uploads on the event loop. Large file transfers block the thread pool, potentially degrading response times for concurrent requests.
- **No transcoding**: The application stores videos in their original uploaded format. There is no server-side transcoding, adaptive bitrate packaging, or format normalization. `fluent-ffmpeg` is listed as a dependency but is not actively used in the codebase.
- **No upload resumption**: Uploads are atomic. A network interruption requires the client to restart the entire upload.
- **No caching layer**: There is no application-level caching (Redis, in-memory cache) for frequently accessed data such as video metadata or channel information. Every request results in a database query with population.

---

## 8. Infrastructure and Deployment Strategy

### Docker

The application is containerized using a single-stage Dockerfile based on `node:20-alpine`:

- Dependencies are installed via `npm install`.
- The entire application directory is copied into the container.
- The container exposes port 80.
- The default command runs `npm start` (which invokes `nodemon server.js`).

Docker Compose provides a development configuration that maps port 80 and injects the MongoDB Atlas connection string as an environment variable.

**Observation**: The production Dockerfile uses `npm start`, which invokes `nodemon` (a development file-watcher). The `prod` script (`node server.js`) or `start:prod` script (with `cross-env NODE_ENV=production`) would be more appropriate for production containers. Additionally, `npm install` installs devDependencies; `npm ci --only=production` would produce a leaner image.

### Kubernetes

A Kubernetes deployment manifest defines:

- A **Deployment** with 1 replica running the Docker image `areeshalam/prod-v1-begenone:1`.
- A **Service** of type `LoadBalancer` exposing port 80.
- Environment variables sourced from a **ConfigMap** (`data-store-env`) for database credentials, JWT configuration, and AWS credentials.

Resource limits are defined but commented out (256Mi memory, 125m CPU).

**Observation**: Sensitive credentials (database password, JWT secret, AWS keys) are stored in a ConfigMap rather than a Kubernetes Secret. ConfigMaps are stored in plaintext in etcd; Secrets provide base64 encoding and can be integrated with encryption providers.

### Environment Configuration

Configuration is managed through environment variables loaded from `config.env` via the `dotenv` package. The application distinguishes between `development` and `production` environments for:

- Logging verbosity (Morgan enabled in development only)
- TLS certificate validation in email transport
- Base URL selection (`DEV_URL` vs `PROD_URL`)

### CI/CD

No CI/CD pipeline configuration is present in the repository. There are no GitHub Actions workflows, GitLab CI files, or Jenkinsfiles. Deployment appears to be manual: build the Docker image, push to Docker Hub, and update the Kubernetes deployment.

---

## 9. Limitations Identified

### Scaling Bottlenecks

- **In-memory search**: The search implementation loads all video documents into memory and performs fuzzy matching with Fuse.js. This approach has O(n) memory consumption and O(n) query time relative to the total video count. It does not support pagination, filtering, or relevance ranking at the database level.
- **Eager population**: Mongoose `pre(/^find/)` hooks on Channel and Video models trigger cascading population queries on every find operation. A single channel query may resolve videos, wires, comments, user, and several additional references, each requiring a separate database round-trip.
- **Memory-buffered uploads**: Video files are fully buffered in process memory before S3 upload, constraining concurrent upload capacity by available heap space.
- **Single-process model**: The application runs as a single Node.js process. CPU-bound operations (if any were introduced) would block the event loop for all concurrent requests.

### Deployment Friction

- All features are deployed as a single artifact. A change to the comment rendering logic requires redeploying the video upload system, the payment integration, and every other subsystem.
- No automated testing exists to validate deployments. Regressions in unrelated subsystems may go undetected.
- The Dockerfile uses `nodemon` in the default command, which is inappropriate for production.

### Tight Coupling

- Controllers directly import and interact with Mongoose models. There is no service layer or repository abstraction to decouple business logic from data access.
- View controllers, API controllers, and utility controllers share the same model instances and middleware, creating implicit dependencies.
- The subscription validation logic is interleaved with route middleware, controller logic, and model hooks across multiple files.

### Team Scalability

- The single-repository, single-process architecture means all developers would work in the same codebase, increasing merge conflict frequency as team size grows.
- No module boundaries or domain isolation exist beyond directory structure. Any developer can import any model or utility from any location.

### Fault Isolation

- An unhandled exception in any subsystem terminates the entire process via the `uncaughtException` handler.
- There is no circuit breaker or fallback mechanism for external service failures (S3, Stripe, MongoDB, SMTP).
- The absence of a global error-handling middleware means some error paths may produce unstructured responses or leak stack traces.

### Testing

- No unit tests, integration tests, or end-to-end tests exist in the repository. There is no test runner configuration, no test directory, and no test scripts in `package.json`.

---

## 10. Evolution Toward Microservices

### Architectural Pressures

Several characteristics of the monolith created pressure toward decomposition:

- **Independent scaling requirements**: Video upload and processing is resource-intensive (memory, bandwidth) and bursty, while comment retrieval is lightweight and consistent. Scaling the entire application to handle upload spikes wastes resources on idle subsystems.
- **Deployment risk surface**: Deploying a payment-related fix requires redeploying the entire application, including unrelated subsystems. The blast radius of any deployment is the entire platform.
- **Feature velocity**: As the domain model stabilized, the boundaries between subsystems became clearer. The commented-out models (Story, Product, Review, Sponsor) demonstrate feature exploration that would benefit from independent lifecycle management.
- **Operational independence**: The payment system (Stripe integration) has different reliability requirements than the content browsing system. In a monolith, a Stripe webhook processing failure can affect video playback availability.

### Natural Service Boundaries

The codebase reveals logical decomposition points that align with domain boundaries:

1. **Authentication Service**: User registration, login, token management, email verification, and password reset. This subsystem has a well-defined interface (issue token, verify token) and minimal coupling to content features.
2. **Media Service**: Video upload, S3 interaction, thumbnail processing, and presigned URL generation. This is the most resource-intensive subsystem and the strongest candidate for independent scaling.
3. **Channel and Content Service**: Channel CRUD, video metadata, wire management, and comment handling. This represents the core domain logic.
4. **Subscription and Payment Service**: Pricing tier management, Stripe checkout, webhook processing, and subscription lifecycle. This has external compliance requirements (PCI-DSS adjacency) that benefit from isolation.
5. **Search Service**: Content indexing and query execution. Replacing the in-memory Fuse.js implementation with a dedicated search engine (Elasticsearch, Meilisearch) is a natural extraction.
6. **Notification Service**: The partially implemented notification model suggests this was already anticipated as a separate concern.

### Domain Boundary Clarity

The existing directory structure (`auth-controllers/`, `video-controllers/`, `channel-controllers/`, `pricing-controllers/`) already reflects domain-driven grouping. The `_old-controllers/` directory, containing the original monolithic controller files, documents the progression from feature-per-file to domain-grouped organization — an intermediate step toward service extraction.

### Distributed System Readiness

The monolith's reliance on external services (MongoDB Atlas, AWS S3, Stripe, SMTP) means the application already handles network boundaries and eventual consistency for those integrations. The patterns established here (webhook-driven state changes for Stripe, presigned URLs for S3) translate directly to inter-service communication patterns in a microservices architecture.

---

## 11. Engineering Reflections

### Key Design Insights

- **Start coupled, decouple later**: The monolith allowed rapid iteration on the domain model without the overhead of distributed system coordination. Features could be added, modified, or abandoned (as evidenced by the commented-out models) with minimal infrastructure cost.
- **Population chains are a hidden cost**: Mongoose's `populate()` convenience obscures the N+1 query problem. Automatic population in `pre(/^find/)` hooks means every query carries the cost of resolving all references, regardless of whether the caller needs them. Selective population or projection would improve performance.
- **Memory-buffered uploads do not scale**: Buffering entire video files in process memory before forwarding to S3 creates an artificial ceiling on concurrent upload capacity. Streaming uploads directly from the client to S3 (via presigned URLs or multipart upload) would eliminate this bottleneck.
- **Validation should be centralized**: Distributing validation across schema definitions, controller logic, and ad-hoc middleware creates inconsistency. A unified validation layer (e.g., schema-based validation at the route level) would reduce duplication and improve reliability.
- **Error handling requires a strategy**: The absence of a global error-handling middleware means error responses are inconsistent across endpoints. A centralized error formatter would improve API predictability and debugging.

### Hindsight Adjustments

- **Introduce a service layer**: Placing business logic directly in controllers couples request handling to domain logic. A service layer would enable reuse across API and view controllers and simplify future extraction into independent services.
- **Implement automated testing early**: The absence of tests increases deployment risk and makes refactoring hazardous. Even basic integration tests for authentication and payment flows would provide meaningful safety.
- **Use streaming uploads from the start**: Presigned S3 URLs for direct client-to-S3 uploads would bypass the server entirely for large files, reducing memory pressure and improving upload reliability.
- **Adopt structured logging consistently**: The mix of `console.log`, Morgan, and Winston creates fragmented observability. A single structured logging approach applied uniformly would improve debugging and enable log aggregation.
- **Separate secrets from configuration**: Using Kubernetes Secrets (or an external secrets manager) rather than ConfigMaps for sensitive values would improve the security posture with minimal effort.

### Influence on Future Design

This implementation established the domain model and interaction patterns that informed the subsequent microservices architecture. The natural service boundaries that emerged from the monolith's directory structure provided a decomposition roadmap. The operational pain points — deployment coupling, scaling inflexibility, and fault propagation — provided concrete justification for the architectural transition rather than speculative motivation.

---

## 12. Repository Status

This repository is archived and preserved for historical, architectural, and portfolio reference. It is no longer under active development. The platform has been superseded by a microservices architecture that addresses the scaling, deployment, and fault isolation limitations documented above.
