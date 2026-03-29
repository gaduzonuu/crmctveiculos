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
        
        {/* WhatsApp Action Button */}
        <div style={{ marginBottom: '16px' }}>
          <button 
            className={`wa-action-btn ${lead.human_handoff ? 'handoff-active' : ''}`}
            onClick={() => {
              if (!lead?.phone) return;
              let num = lead.phone.replace(/\D/g, '');
              if (num.length > 0) {
                if (num.length <= 11) num = '55' + num;
                window.open(`https://wa.me/${num}`, '_blank');
              }
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            {lead.human_handoff ? 'Atender Handoff no WhatsApp' : 'Falar no WhatsApp'}
          </button>
        </div>

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
