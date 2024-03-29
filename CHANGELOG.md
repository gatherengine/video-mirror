## 2022-09-29 v4.6.1

- Add `logEnabled` check to each console.log
  - enable with `localStorage.setItem('debug', 'video-mirror')`

## 2022-06-07 v4.6.0

- Add 'contain' option to Video component (defaults to 'cover')

## 2022-06-02 v4.5.3

- Fix null stream issue causing Continue button to fail

## 2022-05-20 v4.5.2

- Fix packaging deps issue

## 2022-05-20 v4.5.1

- Add logging to getUserMedia request

## 2022-04-26 v4.5.0

- Switch to pnpm package manager
- Default autoGainControl to true

## 2022-03-11 v4.4.1

- Remove redundant 'Join with mic on' message

## 2022-03-10 v4.4.0

- Fall back to mic if video hardware not available

## 2022-03-10 v4.3.1

- Show console warning when unable to getUserMedia

## 2022-01-26 v4.3.0

- Add 'autoFocus' property which puts focus on Use Cam & Mic / Continue button

## 2022-01-26 v4.2.1

- Pass `tr` translation object through from VideoMirror to internal Setup component

## 2022-01-01 v4.2.0

- Turn off mic/cam if nothing is used

## 2021-12-20 v4.1.1

- Fix that preferred device was not selected in dropdown

## 2021-12-29 v4.1.0

- Use default background color for select box rows
- Replace selectedDeviceIds store with preferredDeviceIds component param

## 2021-12-29 v4.0.1

- Add type information for State, Message, etc.
- Remove unused CSS warning

## 2021-12-29 v4.0.0

- Uses sane functional UI based on `raj` (Elm-like)
- Transition to Typescript
