## ADDED Requirements

### Requirement: Assessment list availability
The system SHALL provide a test list screen in mobile that displays available assessments and their entry points, using the same backend list contract as web.

#### Scenario: Assessment list loads successfully
- **WHEN** an authenticated user opens the tests screen
- **THEN** the app fetches available tests from the existing API and renders list items for each assessment

#### Scenario: Assessment list request fails
- **WHEN** the list API returns an error
- **THEN** the app shows an error state with retry action

### Requirement: MBTI flow completeness
The system SHALL provide MBTI introduction, questionnaire, result, and history screens, and each stage MUST use existing MBTI APIs consistent with web behavior.

#### Scenario: User starts MBTI from introduction
- **WHEN** the user taps start on the MBTI introduction page
- **THEN** the app navigates to MBTI questionnaire and initializes answer state

#### Scenario: User submits MBTI answers
- **WHEN** the user completes all required MBTI questions and submits
- **THEN** the app sends the answer payload to the MBTI submit API and navigates to result on success

#### Scenario: User views MBTI history
- **WHEN** the user opens MBTI history
- **THEN** the app loads historical MBTI records and supports entering a historical result detail

### Requirement: City match flow completeness
The system SHALL provide city match introduction, questionnaire, result, and history screens, and each stage MUST use existing city match APIs consistent with web behavior.

#### Scenario: User starts city match test
- **WHEN** the user taps start on the city match introduction page
- **THEN** the app navigates to city match questionnaire and initializes answer state

#### Scenario: User submits city match answers
- **WHEN** the user completes the city match questionnaire and submits
- **THEN** the app calls the city match submit API and renders the returned result

#### Scenario: User views city match history
- **WHEN** the user opens city match history
- **THEN** the app fetches and displays city match historical records
