import React, { useState } from 'react';
import { X, Send, User, CheckCheck, Paperclip } from 'lucide-react';

export default function QuickChatModal({ isOpen, onClose, driverName = "Mr. Arjun Sharma", shipmentNumber = "BH-2017287528", isDarkMode }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'driver', text: `Hello Dispatch, this is ${driverName}. I'm currently at 3 Birrel Avenue corridor.`, time: '10:42 AM' },
    { id: 2, sender: 'dispatch', text: `Hi! Package ${shipmentNumber} is priority. Weather and traffic look clear on your remaining route.`, time: '10:43 AM' },
    { id: 3, sender: 'driver', text: 'Understood. ETA to delivery point is 4 minutes.', time: '10:44 AM' }
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'dispatch',
      text: inputVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputVal('');

    // Driver simulated reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'driver',
          text: 'Acknowledged! Updating GPS delivery receipt.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className={`chat-drawer-card ${isDarkMode ? 'dark-chat' : 'light-chat'}`}>
        
        <div className="chat-drawer-header">
          <div className="chat-user-info">
            <div className="chat-avatar-pill">
              <User size={16} />
            </div>
            <div>
              <h4>{driverName}</h4>
              <p>Tracking Package #{shipmentNumber}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="chat-messages-container">
          {messages.map((m) => (
            <div key={m.id} className={`chat-msg-row ${m.sender === 'dispatch' ? 'msg-outgoing' : 'msg-incoming'}`}>
              <div className="chat-bubble">
                <p>{m.text}</p>
                <span className="msg-time">{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="chat-input-form">
          <input 
            type="text" 
            placeholder="Type dispatch instruction..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="chat-send-btn">
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}
