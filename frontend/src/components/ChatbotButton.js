import React, { useState } from 'react';
import Chatbot from './Chatbot';
import './ChatbotButton.css';

const ChatbotButton = ({ userRole }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <>
      <button 
        className="chatbot-toggle-btn"
        onClick={toggleChatbot}
        title="Open AI Assistant"
      >
        <span className="chatbot-icon">🤖</span>
        <span className="chatbot-text">AI Assistant</span>
        {isChatbotOpen && <span className="chatbot-close">✕</span>}
      </button>

      <Chatbot 
        userRole={userRole}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </>
  );
};

export default ChatbotButton;
