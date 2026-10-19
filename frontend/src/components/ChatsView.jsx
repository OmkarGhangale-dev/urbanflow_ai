import React, { useState } from 'react';
import { Search, Send, User, CheckCheck, Phone, Video, MoreVertical, Sparkles } from 'lucide-react';

export default function ChatsView({ isDarkMode, onCallDriver }) {
  const [activeDriverId, setActiveDriverId] = useState('driver-1');
  const [inputVal, setInputVal] = useState('');

  const [drivers, setDrivers] = useState([
    {
      id: 'driver-1',
      name: 'Mr. Arjun Sharma',
      role: 'Fleet Carrier 1 (MH-12-UF-01)',
      avatar: 'AS',
      status: 'online',
      unread: 0,
      lastMsg: 'ETA to 3 Birrel Avenue is 4 minutes.',
      messages: [
        { id: 1, sender: 'driver', text: 'Good morning Dispatch! Just loaded package BH-2017287528.', time: '09:15 AM' },
        { id: 2, sender: 'dispatch', text: 'Route confirmed via Senapati Bapat road. All clear.', time: '09:18 AM' },
        { id: 3, sender: 'driver', text: 'Approaching turn on Birrel Avenue now.', time: '10:14 AM' }
      ]
    },
    {
      id: 'driver-2',
      name: 'Mr. Ravi Deshmukh',
      role: 'Fleet Carrier 2 (MH-12-UF-02)',
      avatar: 'RD',
      status: 'online',
      unread: 1,
      lastMsg: 'Confirming bypass route for Deccan delivery.',
      messages: [
        { id: 1, sender: 'dispatch', text: 'Ravi, heavy waterlogging near FC road. Take the bypass corridor.', time: '09:40 AM' },
        { id: 2, sender: 'driver', text: 'Confirming bypass route for Deccan delivery.', time: '09:42 AM' }
      ]
    },
    {
      id: 'driver-3',
      name: 'Mr. Sunil Patil',
      role: 'Fleet Carrier 3 (MH-12-UF-03)',
      avatar: 'SP',
      status: 'offline',
      unread: 0,
      lastMsg: 'Kothrud consignment safely delivered and signed.',
      messages: [
        { id: 1, sender: 'driver', text: 'Kothrud consignment safely delivered and signed.', time: '08:50 AM' },
        { id: 2, sender: 'dispatch', text: 'Great work! Proceed to East Depot D2 for restock.', time: '08:55 AM' }
      ]
    }
  ]);

  const activeDriver = drivers.find(d => d.id === activeDriverId) || drivers[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'dispatch',
      text: inputVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setDrivers(prev => prev.map(d => {
      if (d.id === activeDriverId) {
        return {
          ...d,
          lastMsg: inputVal,
          messages: [...d.messages, newMsg]
        };
      }
      return d;
    }));

    setInputVal('');

    // Auto driver response simulation
    setTimeout(() => {
      setDrivers(prev => prev.map(d => {
        if (d.id === activeDriverId) {
          return {
            ...d,
            lastMsg: 'Copy that! GPS waypoints updated on my vehicle dashboard.',
            messages: [
              ...d.messages,
              {
                id: Date.now() + 1,
                sender: 'driver',
                text: 'Copy that! GPS waypoints updated on my vehicle dashboard.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]
          };
        }
        return d;
      }));
    }, 1500);
  };

  return (
    <div className="chats-view-container">
      
      {/* LEFT: DRIVERS LIST */}
      <div className="chats-sidebar">
        <div className="chats-sidebar-header">
          <h2>Driver Communications</h2>
          <span className="live-badge">3 Active Radios</span>
        </div>

        <div className="chats-search-box">
          <Search size={16} />
          <input type="text" placeholder="Search driver or vehicle..." />
        </div>

        <div className="driver-threads-list">
          {drivers.map(driver => (
            <div 
              key={driver.id} 
              className={`driver-thread-item ${activeDriverId === driver.id ? 'active' : ''}`}
              onClick={() => setActiveDriverId(driver.id)}
            >
              <div className="thread-avatar">
                <span>{driver.avatar}</span>
                <span className={`status-indicator ${driver.status}`}></span>
              </div>

              <div className="thread-content">
                <div className="thread-title-row">
                  <strong>{driver.name}</strong>
                  <span className="thread-time">Just now</span>
                </div>
                <p className="thread-subtext">{driver.role}</p>
                <p className="thread-preview">{driver.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: CHAT MESSAGES WINDOW */}
      <div className="chats-window">
        <div className="chat-window-header">
          <div className="chat-active-driver-info">
            <div className="thread-avatar">
              <span>{activeDriver.avatar}</span>
              <span className={`status-indicator ${activeDriver.status}`}></span>
            </div>
            <div>
              <h3>{activeDriver.name}</h3>
              <p>{activeDriver.role}</p>
            </div>
          </div>

          <div className="chat-actions-group">
            <button 
              className="chat-header-btn" 
              onClick={() => onCallDriver(activeDriver.name)}
              title="Call Driver"
            >
              <Phone size={16} />
              <span>Voice Radio</span>
            </button>
          </div>
        </div>

        <div className="chat-conversation-area">
          <div className="chat-ai-notice">
            <Sparkles size={14} />
            <span>AI Automated Dispatch is monitoring this channel for re-routing alerts</span>
          </div>

          {activeDriver.messages.map(m => (
            <div 
              key={m.id} 
              className={`chat-message-row ${m.sender === 'dispatch' ? 'msg-out' : 'msg-in'}`}
            >
              <div className="chat-bubble-styled">
                <p>{m.text}</p>
                <span className="bubble-time">{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-bar">
          <input 
            type="text" 
            placeholder={`Message ${activeDriver.name}...`}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="btn-send">
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  );
}
