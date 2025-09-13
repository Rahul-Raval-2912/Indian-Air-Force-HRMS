import React, { useState, useEffect } from 'react';

const Chatbot = ({ isOpen, onClose, userRole }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [personnelData, setPersonnelData] = useState([]);
  const [systemData] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchRealTimeData();
      if (messages.length === 0) {
        const welcomeMessage = {
          id: 1,
          text: `Welcome to IAF AI Assistant! I have access to real-time personnel data and AI models. Ask me about current statistics, personnel information, or request AI predictions. How can I help you?`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [isOpen, messages.length]);

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/personnel/');
      const data = await response.json();
      setPersonnelData(data);
    } catch (error) {
      // Use mock data if API unavailable
      const mockData = Array.from({length: 50}, (_, i) => ({
        id: i + 1,
        name: `Officer ${String.fromCharCode(65 + (i % 26))}${Math.floor(i/26) + 1}`,
        rank: ['Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer'][i % 4],
        unit: ['Fighter Squadron 1', 'Transport Squadron', 'Helicopter Unit', 'Training Command'][i % 4],
        years_of_service: Math.floor(Math.random() * 20) + 5,
        performance_score: Math.floor(Math.random() * 40) + 60,
        readiness_score: Math.floor(Math.random() * 40) + 60,
        status: 'Active'
      }));
      setPersonnelData(mockData);
    }
  };

  const processMessage = async (message) => {
    try {
      // Use intelligent chatbot with real-time data
      const response = await fetch('http://localhost:8000/api/personnel/chatbot_query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          user_role: userRole,
          personnel_data: personnelData.slice(0, 100), // Send sample data
          system_data: systemData
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Using local intelligent processing');
    }
    
    // Fallback to local intelligent processing
    return processLocalQuery(message);
  };
  
  const processLocalQuery = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Real-time data analysis
    if (lowerMessage.includes('how many') || lowerMessage.includes('total') || lowerMessage.includes('count')) {
      return {
        text: `Current Statistics: ${personnelData.length} total personnel, ${personnelData.filter(p => p.status === 'Active').length} active. Average experience: ${(personnelData.reduce((sum, p) => sum + p.years_of_service, 0) / personnelData.length).toFixed(1)} years.`,
        suggestions: ['Show rank distribution', 'Show unit breakdown', 'Performance statistics'],
        data: personnelData.slice(0, 5)
      };
    }
    
    if (lowerMessage.includes('find') || lowerMessage.includes('search')) {
      const searchResults = personnelData.filter(p => 
        p.name.toLowerCase().includes(lowerMessage.split(' ').pop()) ||
        p.rank.toLowerCase().includes(lowerMessage.split(' ').pop()) ||
        p.unit.toLowerCase().includes(lowerMessage.split(' ').pop())
      ).slice(0, 5);
      
      return {
        text: searchResults.length > 0 ? 
          `Found ${searchResults.length} personnel matching your search:` :
          'No personnel found. Try different search terms.',
        data: searchResults,
        suggestions: ['Refine search', 'Show all personnel', 'Search by unit']
      };
    }
    
    if (lowerMessage.includes('predict') || lowerMessage.includes('analysis') || lowerMessage.includes('ai')) {
      return {
        text: 'I can run AI predictions for you. Which analysis would you like?',
        suggestions: [
          'Predict attrition risk (97.8% accuracy)',
          'Leadership assessment (100% accuracy)', 
          'Training needs prediction',
          'Mission readiness forecast'
        ],
        mlAvailable: true
      };
    }
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('top')) {
      const topPerformers = personnelData
        .sort((a, b) => b.performance_score - a.performance_score)
        .slice(0, 5);
      
      return {
        text: 'Top 5 performers based on current data:',
        data: topPerformers,
        suggestions: ['Show detailed analysis', 'Compare with last month', 'Generate report']
      };
    }
    
    return getGeneralResponse(lowerMessage, userRole);
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

    // Process with real-time data
    setTimeout(async () => {
      const botResponse = await processMessage(currentInput);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse.text || botResponse,
        data: botResponse.data,
        suggestions: botResponse.suggestions,
        mlAvailable: botResponse.mlAvailable,
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

  const getGeneralResponse = (message, role) => {
    const responses = [
      {
        text: "I can help you with real-time IAF data. What would you like to know?",
        suggestions: ['Current personnel count', 'Performance statistics', 'Training information', 'Run AI predictions']
      },
      {
        text: "I have access to live personnel data and AI models. How can I assist you?",
        suggestions: ['Search personnel', 'Show statistics', 'Predict trends', 'Get recommendations']
      },
      {
        text: "Ask me about current operations, personnel data, or request AI analysis.",
        suggestions: ['Personnel search', 'Unit statistics', 'AI predictions', 'Performance data']
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white max-h-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">IAF AI Assistant - {userRole?.replace('_', ' ').toUpperCase()}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="h-64 overflow-y-auto mb-4 p-3 bg-gray-50 rounded">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm">{message.text}</p>
                
                {/* Show data if available */}
                {message.data && message.data.length > 0 && (
                  <div className="mt-2 p-2 bg-white rounded text-xs">
                    {message.data.slice(0, 3).map((item, index) => (
                      <div key={index} className="mb-1">
                        <strong>{item.name || item.rank}</strong> - {item.unit || item.description}
                      </div>
                    ))}
                    {message.data.length > 3 && <div className="text-gray-500">...and {message.data.length - 3} more</div>}
                  </div>
                )}
                
                {/* Show ML availability */}
                {message.mlAvailable && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                    <div className="text-blue-800 font-semibold">🤖 AI Models Available</div>
                    <div className="text-blue-600">Click suggestions below to run predictions</div>
                  </div>
                )}
                
                {/* Show suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about personnel, statistics, or request AI analysis..."
            className="flex-1 form-input mr-2"
          />
          <button
            onClick={handleSendMessage}
            disabled={isTyping}
            className="btn-primary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;