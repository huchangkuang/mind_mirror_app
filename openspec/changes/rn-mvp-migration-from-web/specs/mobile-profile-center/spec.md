## ADDED Requirements

### Requirement: Profile center baseline
The system SHALL provide a profile center screen that displays user profile basics and history summary data returned by existing backend APIs.

#### Scenario: Profile center loads with authenticated user
- **WHEN** an authenticated user enters the profile center
- **THEN** the app loads profile information and summary metrics from existing profile-related APIs

#### Scenario: Profile center handles load failure
- **WHEN** profile or summary API fails
- **THEN** the app shows a recoverable error state and allows retry

### Requirement: Nickname update workflow
The system SHALL allow users to update nickname from mobile and MUST validate input before submitting to the existing backend endpoint.

#### Scenario: Nickname update succeeds
- **WHEN** the user inputs a valid nickname and confirms save
- **THEN** the app calls the nickname update API and updates displayed profile data on success

#### Scenario: Nickname validation fails on client
- **WHEN** the user inputs an empty or invalid nickname format
- **THEN** the app blocks submission and shows validation feedback

### Requirement: Password update workflow
The system SHALL allow users to change password from mobile using the existing backend contract and MUST require current and new password fields according to validation rules.

#### Scenario: Password update succeeds
- **WHEN** the user submits valid current and new passwords
- **THEN** the app calls the password update API and confirms success

#### Scenario: Password update API returns business error
- **WHEN** the update API rejects the current password or new password policy
- **THEN** the app displays an actionable error message and keeps user on the change password form
