import React, { useState } from 'react';
import { LogOut, Search } from 'lucide-react';

// Reusable avatar with photo/fallback
function LeadAvatar({ lead, sizeClass }) {
  const initial = lead?.name?.charAt(0)?.toUpperCase() || lead?.phone?.charAt(0) || '?';
  return (
    <div className={`lead-avatar ${sizeClass}`}>
      {lead?.profile_photo_url
        ? <img src={lead.profile_photo_url} alt={lead.name || lead.phone} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = initial; }} />
        : initial}
    </div>
  );
}

function TempBadge({ temp }) {
  if (!temp) return null;
  const t = temp.toLowerCase();
  const isHot  = t.includes('quen') || t === 'hot';
  const isWarm = t.includes('morn') || t === 'warm';
  const isCold = t.includes('fri')  || t === 'cold';

  const style = {
    display: 'inline-block',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '1px 6px',
    borderRadius: '10px',
    marginRight: '4px',
    ...(isHot  ? { background: '#fff0e0', color: '#c05000' } :
        isWarm ? { background: '#fffde0', color: '#9a7500' } :
        isCold ? { background: '#e8f4ff', color: '#1a5fa8' } :
                 { background: '#f0f2f5', color: '#667781' })
  };

  const emoji = isHot ? '🔥' : isWarm ? '🟡' : isCold ? '❄️' : '';
  const label = isHot ? 'Quente' : isWarm ? 'Morno' : isCold ? 'Frio' : temp;

  return <span style={style}>{emoji} {label}</span>;
}

const HANDOFF_OPTIONS = [
  { value: 'all',      label: 'Todos' },
  { value: 'handoff',  label: '🔴 Handoff' },
  { value: 'no_handoff', label: 'Sem handoff' },
];

export default function Sidebar({ leads, loading, selectedLead, onSelectLead, logout, user }) {
  const [search, setSearch]               = useState('');
  const [handoffFilter, setHandoffFilter] = useState('all');

  // 1. Sort by score descending (null score → end)
  const sorted = [...leads].sort((a, b) => {
    const sa = a.lead_score ?? -1;
    const sb = b.lead_score ?? -1;
    return sb - sa;
  });

  // 2. Filter by handoff
  const afterHandoff = sorted.filter(lead => {
    if (handoffFilter === 'handoff')    return !!lead.human_handoff;
    if (handoffFilter === 'no_handoff') return !lead.human_handoff;
    return true;
  });

  // 3. Filter by search query (name or phone)
  const q = search.trim().toLowerCase();
  const filtered = afterHandoff.filter(lead => {
    if (!q) return true;
    return (lead.name  || '').toLowerCase().includes(q) ||
           (lead.phone || '').toLowerCase().includes(q);
  });

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-header-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div className="sidebar-header-info">
          <div className="sidebar-header-name">{user?.name || 'Administrador'}</div>
          <div className="sidebar-header-role">Gestor de Leads</div>
        </div>
        <LogOut
          size={18}
          style={{ color: '#8696a0', cursor: 'pointer', flexShrink: 0 }}
          onClick={logout}
          title="Sair"
        />
      </div>

      {/* Search bar */}
      <div style={{ padding: '10px 12px 6px', background: '#ffffff', borderBottom: '1px solid #f0f2f5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f2f5', borderRadius: '8px', padding: '7px 12px' }}>
          <Search size={15} style={{ color: '#8696a0', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontSize: '0.88rem', color: '#111b21', width: '100%', fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      {/* Handoff filter tabs */}
      <div style={{ display: 'flex', gap: '4px', padding: '6px 12px', background: '#ffffff', borderBottom: '1px solid #f0f2f5' }}>
        {HANDOFF_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setHandoffFilter(opt.value)}
            style={{
              flex: 1,
              padding: '4px 2px',
              fontSize: '0.72rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.12s',
              background: handoffFilter === opt.value ? '#00a884' : '#f0f2f5',
              color: handoffFilter === opt.value ? '#ffffff' : '#667781',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Section title */}
      <div className="sidebar-section-title">
        {filtered.length} contato{filtered.length !== 1 ? 's' : ''} · por score
      </div>

      {/* Lead list */}
      <div className="sidebar-list">
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#8696a0', fontSize: '0.9rem' }}>Carregando leads...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#8696a0', fontSize: '0.9rem' }}>
            {q || handoffFilter !== 'all' ? 'Nenhum resultado encontrado.' : 'Nenhum contato encontrado.'}
          </div>
        ) : (
          filtered.map((lead) => {
            const isActive = selectedLead?.id === lead.id;
            const temp = lead.lead_temperature || '';
            const score = lead.lead_score;

            return (
              <div
                key={lead.id}
                className={`sidebar-item${isActive ? ' active' : ''}`}
                onClick={() => onSelectLead(lead)}
              >
                <LeadAvatar lead={lead} sizeClass="lead-avatar-md" />
                <div className="sidebar-item-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'space-between' }}>
                    <div className="sidebar-item-name" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lead.name || lead.phone}
                    </div>
                    {lead.human_handoff && (
                      <span style={{ fontSize: '0.6rem', background: '#fff0f0', color: '#c0392b', borderRadius: '6px', padding: '1px 5px', fontWeight: 700, flexShrink: 0 }}>
                        HANDOFF
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '3px' }}>
                    <TempBadge temp={temp} />
                    <span style={{ fontSize: '0.78rem', color: '#667781' }}>
                      {score != null ? `Score ${score}` : 'Sem score'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
