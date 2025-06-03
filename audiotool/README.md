# Euphonia Audio Tool

This is a reference implementation of a web-based tool which can collect audio data from a study participant at home, and store it in Google Cloud Services (specifically Firestore and GCS). This is not an officially supported Google product.

## One-Time Setup Instructions (MacBook)

NOTE: To get this demo fully working for yourself, you will need to set up a Google Cloud account and project. If you already have one, you can fill in its name and credentials in the places where you see "yourproject" and "yourname" in the config files.

1. Install node: https://nodejs.org/en/download/
2. Run the installer to completion. As of this writing I get:
```
- Node.js v22.13.1 to /usr/local/bin/node
- npm v10.9.2 to /usr/local/bin/npm
- firebase-tools v14.2.1 with npm install -g firebase-tools
```
9. `firebase login`
4. (Optional) I would recommend also installing NVM, it helps juggle multiple node versions on your computer: https://github.com/nvm-sh/nvm
5. git clone https://github.com/google/euphonia.git
6. cd euphonia/audiotool
8. `cp ./.env.example ./.env`
9. `cp ./functions/.env.example ./functinions/.env`
10. Edit the dotenv files and fill in your with your Firebase project credentials
11. `npm run build`
12. `npm start`

## Run Firebase locally

1. `npm run watch`
2. In a new terminal `npm start`
3. Open the browser and navigate to http://localhost:8991

## Deploy

1. `npm run deploy`
2. Open the browser and navigate to https://yourproject.web.app/

# Compatibility

This implementation is intended to work on a broad set of devices and browsers. That said,
it does use several newer APIs which aren't necessarily supported on every device. Here are some
notes on compatibility based on my testing:

### Fully supported and tested:

- MacOS 12.X+ (Apple Silicon)
  - Chrome 110
  - Safari 16.3
  - Firefox 110
- Windows 10
  - Chrome 110
  - Edge
- Android 11+
  - Chrome 83
- iOS 13
  - Safari 13

### Compatibility Workarounds

- iOS 13 Safari
  - Playback feature not compatible with async methods; implemented a different playback widget on Safari
  - ScriptProcessorNode does not work unless a GainNode is added to the chain

### Known issues / Troubleshooting

- iOS 13 + Chrome does not work. Must use Safari on old iOS devices.

- If you get an error like `Error: Failed to get Firebase project`,
  try doing "firebase logout" and then "firebase login" again
  
