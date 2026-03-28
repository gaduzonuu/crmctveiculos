import React from 'react';

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

export default function LeadInfo({ lead }) {
  if (!lead) return null;

  const Row = ({ label, value }) => (
    <div className="info-row">
      <div className="info-label">{label}</div>
      <div className="info-value">{value || '---'}</div>
    </div>
  );

  return (
    <div className="lead-info">
      {/* Header with photo */}
      <div className="lead-info-header" style={{ flexDirection: 'column', height: 'auto', padding: '20px', gap: '10px', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#f0f2f5', borderBottom: '1px solid #e9edef' }}>
        <LeadAvatar lead={lead} sizeClass="lead-avatar-lg" />
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111b21' }}>{lead.name || 'Contato'}</div>
          <div style={{ fontSize: '0.82rem', color: '#667781', marginTop: '2px' }}>{lead.phone}</div>
        </div>
      </div>

      <div className="lead-info-body">
        <div className="info-card">
          <div className="info-card-title">Resumo</div>
          <div className="score-grid">
            <div className="score-box">
              <div className="score-box-label">Score</div>
              <div className="score-box-value">{lead.lead_score ?? '0'}</div>
            </div>
            <div className="score-box">
              <div className="score-box-label">Temperatura</div>
              <div className="score-box-value" style={{ fontSize: '1rem', marginTop: '6px', textTransform: 'capitalize', color: '#00a884' }}>
                {lead.lead_temperature || 'Cold'}
              </div>
            </div>
          </div>
          <Row label="Estágio" value={lead.stage} />
        </div>

        <div className="info-card">
          <div className="info-card-title">Interesse Comercial</div>
          <Row label="Veículo desejado" value={lead.vehicle_interest} />
          <Row label="Forma de pagamento" value={lead.payment_method} />
          <Row label="Previsão de visita" value={lead.visit_interest} />
          <Row label="Nível de urgência" value={lead.urgency} />
          <Row label="Localidade" value={lead.city} />
        </div>

        <div className="info-card">
          <div className="info-card-title">Alertas</div>
          {lead.has_down_payment && (
            <div className="alert-badge alert-green">💰 Possui entrada disponível</div>
          )}
          {lead.has_trade_in && (
            <div className="alert-badge alert-blue">🚙 Veículo para troca</div>
          )}
          {lead.human_handoff && (
            <div className="alert-badge alert-red">⚠️ SOLICITOU ATENDENTE HUMANO</div>
          )}
          {!lead.has_down_payment && !lead.has_trade_in && !lead.human_handoff && (
            <p style={{ fontSize: '0.85rem', color: '#8696a0' }}>Nenhum alerta ativo.</p>
          )}
        </div>
      </div>
    </div>
  );
}
