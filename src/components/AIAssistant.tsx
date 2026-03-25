'use client';

import { useState } from 'react';
import { aiAgent, AIResponse } from '@/lib/ai-agent';

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    setIsLoading(true);
    
    try {
      const response = await aiAgent.processCommand(input);
      setResponses(prev => [response, ...prev].slice(0, 5)); // Keep last 5 responses
      setInput('');
    } catch {
      setResponses(prev => [{
        success: false,
        message: 'Failed to process command. Please try again.',
        details: null,
        command: {
          type: 'unknown' as const,
          action: '',
          targets: [],
          exceptions: [],
          confidence: 0,
          explanation: 'Processing error'
        }
      }, ...prev].slice(0, 5));
    } finally {
      setIsLoading(false);
    }
  };

  const exampleCommands = [
    "Mark all orders shipped except 101 and 103",
    "Set order 46716288 to delivered",
    "Cancel order 52607740",
    "Mark all orders from 24 Mar 2026 to 25 Mar 2026 shipped except 46716288",
    "Make Chicken & Brown Rice out of stock",
    "Reduce inventory for Puppy Growth Formula by 5"
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-deep-green text-white rounded-full p-3 shadow-lg hover:bg-deep-green/90 transition-all duration-200 mb-2"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* AI Assistant Panel */}
      {isExpanded && (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-deep-green to-green-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs text-white/80">Natural language commands</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Response History */}
          {responses.length > 0 && (
            <div className="max-h-32 overflow-y-auto p-3 bg-gray-50 border-b border-gray-200">
              {responses.map((response, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg text-sm ${
                    response.success
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <div className="font-medium">{response.success ? '✓' : '✗'} {response.message}</div>
                  {response.command.explanation && (
                    <div className="text-xs mt-1 opacity-75">{response.command.explanation}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a command like 'Mark all orders shipped except 101'..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/30 focus:border-deep-green resize-none"
                rows={2}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full bg-deep-green text-white py-2 px-4 rounded-lg hover:bg-deep-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Execute Command
                </>
              )}
            </button>
          </form>

          {/* Example Commands */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">Example commands:</p>
            <div className="space-y-1">
              {exampleCommands.map((command, index) => (
                <button
                  key={index}
                  onClick={() => setInput(command)}
                  className="block w-full text-left text-xs text-gray-600 hover:text-deep-green hover:bg-white px-2 py-1 rounded transition-colors"
                >
                  &quot;{command}&quot;
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
