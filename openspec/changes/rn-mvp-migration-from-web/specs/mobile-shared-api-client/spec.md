## ADDED Requirements

### Requirement: Shared API contract parity
The system SHALL implement a mobile API client layer that preserves endpoint paths, request fields, response mapping, and error semantics used by the existing web application.

#### Scenario: Endpoint mapping follows existing backend contract
- **WHEN** a feature module invokes an API method from the mobile client
- **THEN** the request path, HTTP method, and payload shape match the corresponding web contract

#### Scenario: API adapter normalizes platform-specific errors
- **WHEN** a network failure or timeout occurs on mobile runtime
- **THEN** the client maps it into a standardized domain error object consumed by feature modules

### Requirement: Authentication-aware request interception
The system SHALL inject access tokens for protected requests and MUST skip token injection for public endpoints.

#### Scenario: Protected request receives token injection
- **WHEN** a protected API call is issued with an active session
- **THEN** the client attaches the access token in authorization headers

#### Scenario: Public request bypasses auth header
- **WHEN** an endpoint is marked as public
- **THEN** the client sends the request without authorization header

### Requirement: Consistent API failure handling
The system SHALL provide consistent handling for unauthorized, forbidden, validation, and server errors so feature modules can render deterministic UI states.

#### Scenario: API returns validation error
- **WHEN** backend returns a validation error payload
- **THEN** the client exposes structured field/message data to the calling feature

#### Scenario: API returns server error
- **WHEN** backend returns an internal server error
- **THEN** the client returns a standardized recoverable error and allows UI retry flow
