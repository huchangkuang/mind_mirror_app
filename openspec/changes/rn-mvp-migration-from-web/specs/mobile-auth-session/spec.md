## ADDED Requirements

### Requirement: Mobile authentication entry points
The system SHALL provide login, registration, and logout entry points in the mobile app, and each flow MUST call the same backend authentication APIs used by the web application.

#### Scenario: Login succeeds with valid credentials
- **WHEN** the user submits a valid account and password on the login screen
- **THEN** the app calls the existing login API and proceeds to authenticated state on success

#### Scenario: Registration succeeds for a new user
- **WHEN** the user submits valid registration information not used by another account
- **THEN** the app calls the existing registration API and shows a successful registration result

#### Scenario: User logs out
- **WHEN** the user taps logout from an authenticated screen
- **THEN** the app clears local auth state and navigates to an unauthenticated screen

### Requirement: Token persistence and security
The system SHALL store `refreshToken` in a secure storage mechanism on mobile, and MUST NOT store `refreshToken` in plain text persistent storage.

#### Scenario: Refresh token is written after authentication
- **WHEN** login or token refresh returns a new `refreshToken`
- **THEN** the app saves the value in secure storage before finishing the auth update

#### Scenario: Refresh token is removed on logout or session invalidation
- **WHEN** the user logs out or refresh is deemed invalid
- **THEN** the app removes the stored `refreshToken` from secure storage

### Requirement: Automatic token refresh with single-flight lock
The system SHALL automatically attempt token refresh on unauthorized API responses, MUST ensure only one refresh request is in flight at a time, and SHALL replay queued requests only after successful refresh.

#### Scenario: Multiple requests hit 401 concurrently
- **WHEN** two or more protected API calls return 401 within the same refresh window
- **THEN** the app sends one refresh request and queues remaining failed requests until refresh completes

#### Scenario: Refresh succeeds and queued requests continue
- **WHEN** the refresh request returns a valid new token pair
- **THEN** queued requests are retried with the updated access token and continue normally

#### Scenario: Refresh fails and session is cleared
- **WHEN** the refresh request fails due to expiration or invalid token
- **THEN** the app clears auth state and sends the user to login
