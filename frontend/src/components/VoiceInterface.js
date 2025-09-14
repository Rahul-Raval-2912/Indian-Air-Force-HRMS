import React, { useState, useEffect, useRef } from 'react';

const VoiceInterface = ({ onCommand, userRole }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [volume, setVolume] = useState(0);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  const supportedLanguages = [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te-IN', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'मराठी', flag: '🇮🇳' }
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        startVolumeMonitoring();
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        stopVolumeMonitoring();
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        stopVolumeMonitoring();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopVolumeMonitoring();
    };
  }, [language]);

  const startVolumeMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      microphone.connect(analyserRef.current);
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateVolume = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(Math.min(100, (average / 128) * 100));
          requestAnimationFrame(updateVolume);
        }
      };
      
      updateVolume();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopVolumeMonitoring = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setVolume(0);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setTranscript('');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const processVoiceCommand = (command) => {
    const processedCommand = {
      text: command,
      language: language,
      timestamp: new Date().toISOString(),
      confidence: 0.85 + Math.random() * 0.1
    };

    // Simulate command processing
    const response = generateResponse(command);
    
    if (onCommand) {
      onCommand(processedCommand, response);
    }

    // Speak response
    speakResponse(response.text, language);
  };

  const generateResponse = (command) => {
    const commandLower = command.toLowerCase();
    
    const responses = {
      'personnel': {
        text: 'Displaying personnel information. Total active personnel: 9,847.',
        action: 'show_personnel',
        data: { total: 9847, active: 9500 }
      },
      'leave': {
        text: 'Opening leave application. You have 25 days of annual leave remaining.',
        action: 'open_leave_form',
        data: { remaining: 25, pending: 2 }
      },
      'training': {
        text: 'Your training completion rate is 88%. Next course: Advanced Combat Training on March 25th.',
        action: 'show_training',
        data: { completion: 88, next_course: 'Advanced Combat Training' }
      },
      'mission': {
        text: 'Current mission readiness: 94.2%. No active deployments for your unit.',
        action: 'show_missions',
        data: { readiness: 94.2, active_missions: 0 }
      },
      'weather': {
        text: 'Current weather: Clear skies, 28 degrees Celsius, wind 15 knots from southwest.',
        action: 'show_weather',
        data: { temp: 28, conditions: 'Clear', wind: '15 knots SW' }
      },
      'equipment': {
        text: 'All assigned equipment operational. Next maintenance scheduled for Aircraft A-101 on April 20th.',
        action: 'show_equipment',
        data: { operational: 95, maintenance_due: 5 }
      }
    };

    for (const [key, response] of Object.entries(responses)) {
      if (commandLower.includes(key)) {
        return response;
      }
    }

    return {
      text: 'I understand your request. Please check your dashboard for more information.',
      action: 'general_response',
      data: {}
    };
  };

  const speakResponse = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to find a voice for the selected language
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      if (voice) {
        utterance.voice = voice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const quickCommands = [
    { text: 'Show personnel info', icon: '👥' },
    { text: 'Check my training', icon: '📚' },
    { text: 'Apply for leave', icon: '📅' },
    { text: 'Mission status', icon: '🎯' },
    { text: 'Weather report', icon: '🌤️' },
    { text: 'Equipment status', icon: '⚙️' }
  ];

  if (!isSupported) {
    return (
      <div className="card p-6 text-center">
        <div className="text-6xl mb-4">🎤</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Voice Interface Not Supported</h3>
        <p className="text-gray-600">Your browser doesn't support speech recognition.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Voice Control Panel */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Voice Interface</h2>
          <div className="flex items-center space-x-4">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="form-input text-sm"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Microphone Control */}
        <div className="text-center mb-6">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative w-24 h-24 rounded-full border-4 transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 border-red-300 shadow-lg shadow-red-200' 
                : 'bg-blue-500 border-blue-300 hover:bg-blue-600'
            }`}
          >
            <div className="text-white text-2xl">
              {isListening ? '🔴' : '🎤'}
            </div>
            
            {/* Volume Indicator */}
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-pulse"
                   style={{ 
                     transform: `scale(${1 + (volume / 200)})`,
                     opacity: volume / 100 
                   }}>
              </div>
            )}
          </button>
          
          <p className="mt-4 text-sm text-gray-600">
            {isListening ? 'Listening... Speak now' : 'Click to start voice command'}
          </p>
          
          {/* Volume Bar */}
          {isListening && (
            <div className="mt-2 w-32 mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${volume}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-600">
            <h4 className="text-sm font-medium text-gray-200 mb-2">Transcript:</h4>
            <p className="text-white font-medium">{transcript}</p>
          </div>
        )}

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
            <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
              isSupported ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <p className="text-xs text-gray-200 font-medium">Speech Recognition</p>
          </div>
          <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
            <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
              'speechSynthesis' in window ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <p className="text-xs text-gray-200 font-medium">Text-to-Speech</p>
          </div>
          <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
            <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
              isListening ? 'bg-blue-500' : 'bg-gray-400'
            }`}></div>
            <p className="text-xs text-gray-200 font-medium">Microphone</p>
          </div>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Voice Commands</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickCommands.map((command, index) => (
            <button
              key={index}
              onClick={() => processVoiceCommand(command.text)}
              className="flex items-center space-x-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
            >
              <span className="text-lg">{command.icon}</span>
              <span className="text-sm font-medium text-gray-200">{command.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Commands Help */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Commands Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-200 mb-2">Personnel Commands:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• "Show personnel information"</li>
              <li>• "Find officer [name]"</li>
              <li>• "Personnel count by unit"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-200 mb-2">Training Commands:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• "Check my training status"</li>
              <li>• "Upcoming training courses"</li>
              <li>• "Training completion rate"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-200 mb-2">Leave Commands:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• "Apply for leave"</li>
              <li>• "Check leave balance"</li>
              <li>• "Pending leave requests"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-200 mb-2">Mission Commands:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• "Mission readiness status"</li>
              <li>• "Active operations"</li>
              <li>• "Equipment availability"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;
