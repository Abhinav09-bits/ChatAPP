import React from 'react';

const MessageList = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      {messages.map((msg, idx) => (
        <div key={idx} className={`mb-2 flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
          <div className={`px-4 py-2 rounded-lg ${msg.isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
