const supabase = require('../config/supabase');

async function getLeads(req, res, next) {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(leads);
  } catch (err) {
    next(err);
  }
}

async function getLeadById(req, res, next) {
  try {
    const { id } = req.params;
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    return res.json(lead);
  } catch (err) {
    next(err);
  }
}

function formatMessageDate(createdAt) {
  try {
    const date = new Date(createdAt);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const time = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });

    let dateLabel;
    if (isToday) {
      dateLabel = 'Hoje';
    } else if (isYesterday) {
      dateLabel = 'Ontem';
    } else {
      dateLabel = date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    }

    return { time, date: dateLabel };
  } catch {
    return { time: '--:--', date: '' };
  }
}

async function getLeadMessages(req, res, next) {
  try {
    const { phone } = req.params;
    if (!phone) {
      return res.status(400).json({ error: 'Phone parameter is required' });
    }

    const { data: rows, error } = await supabase
      .from('lead_messages')
      .select('*')
      .eq('lead_phone', phone)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    // Build response with date separators
    const result = [];
    let lastDateLabel = null;

    for (const row of rows) {
      const { time, date } = formatMessageDate(row.created_at);

      if (date !== lastDateLabel) {
        result.push({ type: 'date_separator', date_label: date });
        lastDateLabel = date;
      }

      result.push({
        type: 'message',
        sender_type: row.sender_type,    // "lead" | "bot"
        content: row.content,
        created_at: row.created_at,
        time,
        date
      });
    }

    return res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLeads,
  getLeadById,
  getLeadMessages
};
