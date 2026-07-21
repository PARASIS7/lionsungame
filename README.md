# Lion & Sun Maze — Canvas edition

This directory is the browser-native port of the existing Pygame game. It uses
plain HTML5 Canvas and JavaScript, keeps the original sprite sheets and game
rules, and does not download a Python or WebAssembly runtime. The interface uses
the Persepolis stone-relief direction and adapts independently to portrait
mobile screens and landscape desktop displays.

The game can be served as static files or opened directly through `index.html`.
The memorial list loads in the background and can no longer hold the game on an
infinite loading screen. The stone-gate loader reports real progress and offers
a retry action if a required image is unavailable.

The approved `persepolis-ui-skin-v1` artwork is the only portrait/mobile skin;
landscape displays use the matching desktop composition.

Controls: arrow keys/WASD or swipe. Enter/tap starts and continues; P pauses;
M toggles sound. The original ambient loop and game effects are synthesized
with Web Audio after the first user interaction, so no large audio download is
required.

Memorial entries support structured `name`, `age`, `deathDay`, and `city`
fields. Legacy string entries remain compatible; missing dates are shown as
`تاریخ نامشخص` rather than guessed.
