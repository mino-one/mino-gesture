# PRD

## 1. Overview

mino-gesture is a lightweight macOS gesture app focused on small, beautiful, and efficient interaction enhancements.

It is designed for users who want simple mouse gestures to trigger common system and app actions without heavy configuration or bloated UI.

## 2. Goals

- Lightweight runtime and small app bundle
- Beautiful and minimal interface
- Focused feature set
- Native-feeling macOS experience
- Modern and maintainable tech stack

## 3. Non-Goals

- Not a full automation platform
- Not a complex window manager in v1
- Not a multi-platform product in v1
- Not a plugin marketplace
- Not a scripting-first power-user tool in v1

## 4. Target Users

- macOS users who want faster everyday interactions
- Users who prefer small focused utilities
- Users who want a polished setup experience

## 5. Core Use Cases

1. Trigger Mission Control with an upward gesture
2. Switch Spaces with left and right gestures
3. Navigate back and forward in browsers with app-specific gestures
4. Launch apps or send keyboard shortcuts from custom gestures

## 6. MVP Scope

### Included
- Right-button drag gestures
- Gesture recognition for simple directions and basic combinations
- Global rules
- App-specific rule overrides
- Actions:
  - Send hotkey
  - Open app
  - Run shell command or AppleScript
- Menu bar control
- Permissions guidance
- Launch at login

### Excluded
- Trackpad multi-touch gestures
- Advanced window management
- Cloud sync
- Plugin system
- Analytics dashboard
- Complex automation chains

## 7. Product Principles

- Small and focused
- Fast to open, fast to configure
- Minimal UI, low cognitive load
- Clear defaults
- No unnecessary pages or settings

## 8. Success Criteria

- Users can create a gesture rule in under 30 seconds
- Core gesture actions feel reliable and responsive
- App remains visually minimal and easy to understand
- Resource usage stays low during idle and active gesture listening

## 9. Milestones

### Milestone 1
- Basic app shell
- Menu bar app
- Permissions flow
- Global gesture listening
- Hotkey action support

### Milestone 2
- Rule editor UI
- App-specific rules
- Open app and script actions
- Import/export config

### Milestone 3
- Polish
- Improved gesture feedback
- Better onboarding
- Release preparation
