import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWindow, ChatInput } from 'miagemchatstudio';

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <ChatWindow messages={[]} />
      <ChatInput onSendMessage={(msg) => console.log(msg)} isLoading={false} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
