# Euphonia Audio Tool

This is a reference implementation of a web-based tool which can collect audio data from a study participant at home, and store it in Google Cloud Services (specifically Firestore and GCS). This is not an officially supported Google product.

## One-Time Setup Instructions (MacBook)

NOTE: To get this demo fully working for yourself, you will need to set up a Google Cloud account and project. If you already have one, you can fill in its name and credentials in the places where you see "yourproject" and "yourname" in the config files.

1. Install node: https://nodejs.org/en/download/
2. Run the installer to completion. As of this writing I get:
```
- Node.js v16.14.1 to /usr/local/bin/node
- npm v8.5.0 to /usr/local/bin/npm
```
3. (Optional) I would recommend also installing NVM, it helps juggle multiple node versions on your computer: https://github.com/nvm-sh/nvm

4. git clone https://github.com/google/euphonia.git

5. cd euphonia/audiotool

6. cp ./.env.example ./.env 
6. cp ./functions/.env.example ./functinions/.env 

7. Edit the dotenv files and fill in your with your Firebase project credentials

8. ./node_modules/.bin/firebase login


## Run Firebase locally

1. firebase serve --host localhost --port 8991
2. http://localhost:8991


## Deploy to test

1. firebase deploy --only "hosting,functions:audioapp,firestore:indexes"
5. https://yourproject.web.app/


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
  
