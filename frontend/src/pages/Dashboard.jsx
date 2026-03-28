import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

import Sidebar from '../components/Sidebar';
import ChatPanel from '../components/ChatPanel';
import LeadInfo from '../components/LeadInfo';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const leadsIntervalRef = useRef(null);

  useEffect(() => {
    fetchLeads();
    // Poll leads every 5 seconds
    leadsIntervalRef.current = setInterval(fetchLeads, 5000);
    return () => clearInterval(leadsIntervalRef.current);
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await api.get('/leads');
      setLeads(data);
      // Keep selectedLead in sync with updated data
      setSelectedLead(prev => {
        if (!prev) return prev;
        const updated = data.find(l => l.id === prev.id);
        return updated || prev;
      });
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crm-app">
      <Sidebar 
        leads={leads}
        loading={loading}
        selectedLead={selectedLead}
        onSelectLead={setSelectedLead}
        logout={logout}
        user={user}
      />
      
      {selectedLead ? (
        <>
          <ChatPanel lead={selectedLead} />
          <LeadInfo lead={selectedLead} />
        </>
      ) : (
        <div className="empty-chat">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h2>CRM CTVeiculos</h2>
          <p>Selecione um contato à esquerda para visualizar o histórico e os dados extraídos pela IA.</p>
        </div>
      )}
    </div>
  );
}
