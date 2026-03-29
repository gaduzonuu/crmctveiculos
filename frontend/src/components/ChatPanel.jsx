import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { ArrowLeft, Info } from 'lucide-react';

// Reusable avatar with photo/fallback
function LeadAvatar({ lead, sizeClass }) {
  const initial = lead?.name?.charAt(0)?.toUpperCase() || lead?.phone?.charAt(0) || '?';
  return (
    <div className={`lead-avatar ${sizeClass}`}>
      {lead?.profile_photo_url
        ? <img src={lead.profile_photo_url} alt={lead.name || lead.phone}
            onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = initial; }} />
        : initial}
    </div>
  );
}

const parseMarkdown = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <strong key={i}>{part.slice(1, -1)}</strong>;
    return <span key={i}>{part}</span>;
  });
};

export default function ChatPanel({ lead, onBack, onOpenInfo }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const areaRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!lead?.phone) return;
    setItems([]);
    setLoading(true);
    fetchMessages(true);
    intervalRef.current = setInterval(() => fetchMessages(false), 2000);
    return () => clearInterval(intervalRef.current);
  }, [lead?.phone]);

  useEffect(() => {
    if (areaRef.current) {
      areaRef.current.scrollTop = areaRef.current.scrollHeight;
    }
  }, []);

  const isAtBottom = () => {
    if (!areaRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = areaRef.current;
    return scrollHeight - scrollTop - clientHeight < 30;
  };

  const scrollToBottom = () => {
    if (areaRef.current) areaRef.current.scrollTop = areaRef.current.scrollHeight;
  };

  const fetchMessages = async (forceScroll = false) => {
    const shouldScroll = forceScroll || isAtBottom();
    try {
      const { data } = await api.get(`/leads/${lead.phone}/messages`);
      setItems(data);
      if (shouldScroll) setTimeout(scrollToBottom, 50);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        {/* Back button — shown only on mobile via CSS */}
        <button className="chat-header-back" onClick={onBack} aria-label="Voltar">
          <ArrowLeft size={22} />
        </button>

        <LeadAvatar lead={lead} sizeClass="lead-avatar-sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="chat-header-name"
               style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lead.name || lead.phone}
          </div>
          <div className="chat-header-phone">{lead.phone}</div>
        </div>

        {/* Info button — shown on tablet/mobile via CSS */}
        <button className="chat-header-info-btn" onClick={onOpenInfo} aria-label="Informações do lead">
          <Info size={22} />
        </button>
      </div>

      <div className="chat-messages" ref={areaRef}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(255,255,255,0.9)', borderRadius: '8px', alignSelf: 'center', fontSize: '0.85rem', color: '#667781' }}>
            Carregando histórico...
          </div>
        )}
        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#ffeba6', borderRadius: '8px', alignSelf: 'center', fontSize: '0.85rem', color: '#667781' }}>
            Nenhuma mensagem encontrada.
          </div>
        )}
        {!loading && items.map((item, idx) => {
          if (item.type === 'date_separator') {
            return (
              <div key={`sep-${idx}`} style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                <span style={{ background: 'rgba(255,255,255,0.85)', color: '#667781', fontSize: '0.75rem', fontWeight: 600, padding: '4px 14px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
                  {item.date_label}
                </span>
              </div>
            );
          }

          const isLead = item.sender_type === 'lead';
          return (
            <div key={`msg-${idx}`} className={`msg-row ${isLead ? 'right' : 'left'}`}>
              <div className={`msg-bubble ${isLead ? 'user' : 'ai'}`}>
                <div>{parseMarkdown(item.content)}</div>
                {item.time && (
                  <div style={{ fontSize: '0.7rem', color: '#667781', textAlign: 'right', marginTop: '4px', lineHeight: 1 }}>
                    {item.time}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input-disabled"
          type="text"
          placeholder="Modo leitura — atendimento gerenciado pela IA."
          disabled
        />
      </div>
    </div>
  );
}
