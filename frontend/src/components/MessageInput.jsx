import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-center p-2 border-t">
      <input
        type="text"
        className="flex-1 px-3 py-2 rounded border focus:outline-none"
        placeholder="Type your message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
      />
      <button
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
