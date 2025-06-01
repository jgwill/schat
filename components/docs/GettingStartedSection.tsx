
import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';

const GETTING_STARTED_CONTENT = `
Welcome to Mia's Gem Chat Studio!

**Prerequisites:**
- A modern web browser (Chrome or Edge recommended for Speech & Camera API support).
- **An API key for the Gemini API.** See the "Important: API Key Configuration" section below.
- A microphone for voice input and audio message recording.
- A camera for image input (optional).
- Mia's avatar image file (\`mia_avatar.png\`) placed in the \`/assets/\` directory (or ensure persona avatarPaths point to valid URLs).

**Running the App:**
1. **Configure your Gemini API key** (see details below).
2. Ensure persona avatar images are correctly referenced (e.g., \`/assets/mia_avatar.png\` or valid URLs in \`personas.ts\`).
3. Open \`index.html\` in your browser (typically served by a local web server if you are developing).
4. Grant microphone and camera permissions when prompted if you wish to use those features.

---

### **Important: API Key Configuration**

This application requires a valid Google Gemini API key to function. The API key must be provided to the application through an environment variable.

**Recommended:** \`MIAGEM_API_KEY\`
The primary and recommended environment variable name is \`MIAGEM_API_KEY\`.
\`\`\`
MIAGEM_API_KEY=your_actual_gemini_api_key_here
\`\`\`

**Legacy Fallback:** \`API_KEY\`
For backward compatibility, especially with existing cloud deployments (e.g., on Google Cloud), the application will also check for and use an environment variable named \`API_KEY\` if \`MIAGEM_API_KEY\` is not found.
\`\`\`
API_KEY=your_actual_gemini_api_key_here
\`\`\`
If the application uses the legacy \`API_KEY\`, a warning will be logged to the console encouraging you to switch to \`MIAGEM_API_KEY\`.

**Please Note:**
- The application code specifically looks for \`process.env.MIAGEM_API_KEY\` first, then \`process.env.API_KEY\`.
- Other common environment variable names such as \`GEMINI_API_KEY\`, \`GOOGLE_API_KEY\`, or \`VITE_GOOGLE_API_KEY\` **will not work** with the current setup.

**How to set the environment variable for local development:**

*   **Using a \`.env\` file:** If your local development server or build tool (like Vite, Create React App, Next.js) supports \`.env\` files, create a file named \`.env\` in the root of your project and add the line:
    \`MIAGEM_API_KEY=your_actual_gemini_api_key_here\`
    Your specific tool is responsible for loading this \`.env\` file and making the \`MIAGEM_API_KEY\` variable accessible under \`process.env.MIAGEM_API_KEY\` in the browser environment.

*   **Setting in your terminal/shell:** Before starting your development server, you can export the variable:
    *   macOS/Linux: \`export MIAGEM_API_KEY="your_actual_key"\`
    *   Windows (Command Prompt): \`set MIAGEM_API_KEY=your_actual_key\`
    *   Windows (PowerShell): \`$env:MIAGEM_API_KEY="your_actual_key"\`
    Then run your start command (e.g., \`npm start\`, \`yarn dev\`).

*Consult your development environment's documentation for the most appropriate way to set environment variables so they are accessible in your frontend code.*

**The application will show an error message or fail to connect to the Gemini service if neither \`MIAGEM_API_KEY\` nor \`API_KEY\` is correctly set and accessible.** For new setups, please use \`MIAGEM_API_KEY\`.

---

For more details on features, see the main [README.md](README.md) or other sections of this documentation.
`;

const GettingStartedSection: React.FC = () => {
  return (
    <section id="getting-started" className="mb-12 p-6 bg-gpt-light rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-4 text-white border-b border-gpt-gray pb-2">Getting Started</h2>
      <MarkdownRenderer markdown={GETTING_STARTED_CONTENT} />
    </section>
  );
};

export default GettingStartedSection;
