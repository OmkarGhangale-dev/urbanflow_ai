import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Grid, User } from 'lucide-react';

export default function DriverCallModal({ isOpen, onClose, driverName = "Mr. Arjun Sharma", isDarkMode }) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [callStatus, setCallStatus] = useState("Connecting...");

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setCallStatus("Connecting...");
      return;
    }

    const timer = setTimeout(() => {
      setCallStatus("00:00");
    }, 1500);

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay">
      <div className={`call-modal-card ${isDarkMode ? 'dark-call' : 'light-call'}`}>
        
        <div className="call-avatar-wrapper">
          <div className="call-pulse-ring"></div>
          <div className="call-avatar-circle">
            <User size={38} />
          </div>
        </div>

        <h3 className="call-driver-name">{driverName}</h3>
        <p className="call-driver-role">Logistics Carrier Fleet Driver · Vehicle MH-12</p>
        
        <div className="call-timer-badge">
          {callStatus === "Connecting..." ? "Ringing Secure Dispatch Line..." : formatDuration(callDuration)}
        </div>

        <div className="call-controls-grid">
          <button 
            className={`call-ctrl-circle ${isMuted ? 'active' : ''}`}
            onClick={() => setIsMuted(!isMuted)}
            title="Mute"
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button 
            className={`call-ctrl-circle ${isSpeaker ? 'active' : ''}`}
            onClick={() => setIsSpeaker(!isSpeaker)}
            title="Speaker"
          >
            {isSpeaker ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button 
            className="call-ctrl-circle"
            title="Keypad"
          >
            <Grid size={20} />
          </button>
        </div>

        <div className="call-hangup-wrapper">
          <button className="call-hangup-btn" onClick={onClose} title="End Call">
            <PhoneOff size={24} />
          </button>
        </div>

      </div>
    </div>
  );
}
