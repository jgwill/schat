# Basic Usage Example

This example demonstrates consuming the **miagemchatstudio** package in a fresh Vite + React app.

1. From the repository root, build the library and create a tarball:
   
   ```bash
   npm run build:lib
   npm pack
   ```
   
   This produces `miagemchatstudio-0.0.1.tgz`.

2. Inside this `examples/basic-usage` folder run:

   ```bash
   npm install ../miagemchatstudio-0.0.1.tgz
   npm install
   npm run dev
   ```

   The app will start on <http://localhost:5173> and display `ChatWindow` with an input box.

You can also replace the local tarball with the package name once it is published to npm:

```bash
npm install miagemchatstudio
```
