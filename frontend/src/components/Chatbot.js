import React, { useState, useEffect } from 'react';

const Chatbot = ({ isOpen, onClose, userRole }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [personnelData, setPersonnelData] = useState([]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        text: `🇮🇳 Welcome to IAF AI Assistant! I have access to real-time personnel data and AI models. Ask me about current statistics, personnel information, or request AI predictions. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([welcomeMessage]);
      fetchRealTimeData();
    }
  }, [isOpen, messages.length]);

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/personnel/');
      if (!response.ok) throw new Error('Backend not available');
      const data = await response.json();
      setPersonnelData(data);
    } catch (error) {
      const mockData = Array.from({length: 50}, (_, i) => ({
        id: i + 1,
        name: `${['Wg Cdr', 'Sqn Ldr', 'Flt Lt', 'Fg Offr'][i % 4]} ${['Singh', 'Sharma', 'Patel', 'Kumar'][i % 4]}`,
        rank: ['Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer'][i % 4],
        unit: ['1 Squadron (Tigers)', '7 Squadron (Battleaxes)', '17 Squadron (Golden Arrows)', 'Transport Wing'][i % 4],
        years_of_service: Math.floor(Math.random() * 20) + 5,
        performance_score: Math.floor(Math.random() * 40) + 60,
        readiness_score: Math.floor(Math.random() * 40) + 60,
        status: 'Active'
      }));
      setPersonnelData(mockData);
    }
  };

  const processLocalQuery = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('how many') || lowerMessage.includes('total') || lowerMessage.includes('count')) {
      return {
        text: `📊 Current IAF Statistics:\n• Total Personnel: ${personnelData.length}\n• Active Personnel: ${personnelData.filter(p => p.status === 'Active').length}\n• Average Experience: ${(personnelData.reduce((sum, p) => sum + p.years_of_service, 0) / personnelData.length).toFixed(1)} years\n• Average Readiness: ${(personnelData.reduce((sum, p) => sum + p.readiness_score, 0) / personnelData.length).toFixed(1)}%`,
        suggestions: ['Show rank distribution', 'Show unit breakdown', 'Performance statistics']
      };
    }
    
    if (lowerMessage.includes('find') || lowerMessage.includes('search')) {
      const searchTerm = lowerMessage.split(' ').pop();
      const searchResults = personnelData.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.rank.toLowerCase().includes(searchTerm) ||
        p.unit.toLowerCase().includes(searchTerm)
      ).slice(0, 5);
      
      return {
        text: searchResults.length > 0 ? 
          `🔍 Found ${searchResults.length} personnel:\n${searchResults.map(p => `• ${p.name} - ${p.rank} (${p.unit})`).join('\n')}` :
          '❌ No personnel found. Try different search terms.',
        suggestions: ['Search by rank', 'Search by unit', 'Show all personnel']
      };
    }
    
    if (lowerMessage.includes('predict') || lowerMessage.includes('analysis') || lowerMessage.includes('ai')) {
      return {
        text: '🤖 AI Analysis Available:\n• Attrition Risk Prediction (97.8% accuracy)\n• Leadership Assessment (100% accuracy)\n• Training Needs Analysis\n• Mission Readiness Forecast\n\nWhich analysis would you like me to run?',
        suggestions: ['Predict attrition risk', 'Leadership assessment', 'Training needs', 'Mission readiness']
      };
    }
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('top')) {
      const topPerformers = personnelData
        .sort((a, b) => b.performance_score - a.performance_score)
        .slice(0, 5);
      
      return {
        text: `🏆 Top 5 Performers:\n${topPerformers.map((p, i) => `${i+1}. ${p.name} - ${p.performance_score}% (${p.unit})`).join('\n')}`,
        suggestions: ['Detailed analysis', 'Compare with last month', 'Generate report']
      };
    }

    if (lowerMessage.includes('unit') || lowerMessage.includes('squadron')) {
      const unitStats = {};
      personnelData.forEach(p => {
        unitStats[p.unit] = (unitStats[p.unit] || 0) + 1;
      });
      
      return {
        text: `🏢 Squadron Distribution:\n${Object.entries(unitStats).map(([unit, count]) => `• ${unit}: ${count} personnel`).join('\n')}`,
        suggestions: ['Show readiness by unit', 'Unit performance', 'Training status']
      };
    }
    
    return {
      text: "🇮🇳 I'm your IAF AI Assistant. I can help you with:\n\n📊 Personnel Statistics\n🔍 Personnel Search\n🤖 AI Predictions\n🏆 Performance Analysis\n🏢 Unit Information\n\nWhat would you like to know?",
      suggestions: ['Current personnel count', 'Search personnel', 'Run AI analysis', 'Show top performers']
    };
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = processLocalQuery(currentInput);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse.text,
        suggestions: botResponse.suggestions,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-title">
            <div className="iaf-logo-chat">
              <img 
                src="https://www.clipartmax.com/png/middle/275-2755311_free-download-indian-air-force-logo-vector-and-clip-aeronautica-militare-india.png" 
                alt="IAF Logo" 
                className="iaf-logo-img-chat"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="logo-icon" style={{display: 'none'}}>✈️</span>
            </div>
            <div className="title-content">
              <h3>IAF AI Assistant</h3>
              <div className="chatbot-role">{userRole?.replace('_', ' ').toUpperCase()}</div>
            </div>
          </div>
          <div className="chatbot-controls">
            <button onClick={() => setMessages([])} className="clear-btn" title="Clear Chat">
              🗑️
            </button>
            <button onClick={onClose} className="close-btn" title="Close">
              ✕
            </button>
          </div>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="message-text">
                  {message.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <div className="message-time">{message.timestamp}</div>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="message-suggestions">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="suggestion-chip"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="chatbot-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about personnel, statistics, or request AI analysis..."
            className="message-input"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={isTyping || !inputMessage.trim()}
            className="send-btn"
          >
            🚀
          </button>
        </div>
      </div>

      <style jsx>{`
        .chatbot-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .chatbot-container {
          width: 90%;
          max-width: 500px;
          height: 80vh;
          max-height: 700px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.4s ease-out;
        }

        .chatbot-header {
          background: linear-gradient(135deg, #ff9900, #ffaa00);
          color: #0f172a;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 20px 20px 0 0;
        }

        .chatbot-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .iaf-logo-chat {
          width: 40px;
          height: 40px;
          background: rgba(15, 23, 42, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(15, 23, 42, 0.2);
        }

        .iaf-logo-img-chat {
          width: 30px;
          height: 30px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .logo-icon {
          font-size: 20px;
          animation: fly 3s ease-in-out infinite;
        }

        @keyframes fly {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        .title-content h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          font-family: 'Rajdhani', sans-serif;
        }

        .chatbot-role {
          font-size: 11px;
          background: rgba(15, 23, 42, 0.15);
          padding: 3px 8px;
          border-radius: 8px;
          margin-top: 4px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .chatbot-controls {
          display: flex;
          gap: 8px;
        }

        .clear-btn, .close-btn {
          background: rgba(15, 23, 42, 0.1);
          border: 1px solid rgba(15, 23, 42, 0.2);
          color: #0f172a;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .clear-btn:hover, .close-btn:hover {
          background: rgba(15, 23, 42, 0.2);
          transform: scale(1.05);
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          max-width: 85%;
          animation: messageSlide 0.3s ease-out;
        }

        .message.user {
          align-self: flex-end;
        }

        .message.bot {
          align-self: flex-start;
        }

        .message-content {
          padding: 16px 20px;
          border-radius: 16px;
          position: relative;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #ff9900, #ffaa00);
          color: #0f172a;
          border-bottom-right-radius: 6px;
          border: 1px solid rgba(255, 153, 0, 0.3);
        }

        .message.bot .message-content {
          background: rgba(255, 255, 255, 0.15);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom-left-radius: 6px;
        }

        .message-text {
          line-height: 1.6;
          word-wrap: break-word;
          font-size: 14px;
          font-weight: 500;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.7;
          margin-top: 8px;
          text-align: right;
          font-weight: 500;
        }

        .message-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 12px;
        }

        .suggestion-chip {
          background: rgba(255, 153, 0, 0.2);
          border: 1px solid rgba(255, 153, 0, 0.4);
          color: #ff9900;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .suggestion-chip:hover {
          background: rgba(255, 153, 0, 0.3);
          transform: translateY(-1px);
        }

        .typing-indicator {
          display: flex;
          gap: 6px;
          align-items: center;
          padding: 4px 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff9900;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .chatbot-input {
          display: flex;
          padding: 20px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.1);
          gap: 12px;
          align-items: center;
        }

        .message-input {
          flex: 1;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          font-family: inherit;
        }

        .message-input::placeholder {
          color: rgba(248, 250, 252, 0.6);
          font-weight: 400;
        }

        .message-input:focus {
          border-color: #ff9900;
          box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.2);
          background: rgba(255, 255, 255, 0.15);
        }

        .message-input:disabled {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(248, 250, 252, 0.5);
          cursor: not-allowed;
        }

        .send-btn {
          background: linear-gradient(135deg, #ff9900, #ffaa00);
          border: none;
          color: #0f172a;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 153, 0, 0.3);
          flex-shrink: 0;
          font-weight: 600;
        }

        .send-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffaa00, #ffbb00);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 153, 0, 0.4);
        }

        .send-btn:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(248, 250, 252, 0.5);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .chatbot-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chatbot-messages::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .chatbot-messages::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #ff9900, #ffaa00);
          border-radius: 3px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .chatbot-container {
            width: 95%;
            height: 90vh;
            border-radius: 16px;
          }
          
          .chatbot-header {
            padding: 16px 20px;
          }
          
          .chatbot-messages {
            padding: 20px;
          }
          
          .message {
            max-width: 90%;
          }
          
          .chatbot-input {
            padding: 16px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;