import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminViewModel } from '../../viewmodels';
import { useAuthStore } from '../../store';
import { StatusBadge, Modal, Button } from '../../components/ui';
import type { Booking, BookingStatus } from '../../models';
import logoImg from '../../assets/logo.png';

export const AdminDashboardPage: React.FC = () => {
  const vm = useAdminViewModel();
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Booking | null>(null);

  const handleLogout = () => { logout(); navigate('/admin'); };

  const statusColor = (s: BookingStatus) => ({
    pending: 'var(--gold)', confirmed: '#10b981', cancelled: '#ef4444', completed: '#8b5cf6',
  }[s]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--blush)', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Nav */}
      <header style={{
        background: 'var(--brown-dark)', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64, flexShrink: 0,
        borderBottom: '1px solid rgba(215,166,41,.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src={logoImg} alt="Lumiê" style={{ height: 44, objectFit: 'contain' }} />
          <span style={{ fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--nude)' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/" target="_blank" rel="noreferrer" style={{ fontSize: '.72rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--nude)', textDecoration: 'none' }}>Ver site ↗</a>
          <button onClick={handleLogout} style={{
            fontSize: '.72rem', letterSpacing: '.15em', textTransform: 'uppercase',
            color: 'var(--nude)', cursor: 'pointer', padding: '.4rem .9rem',
            border: '1px solid rgba(175,160,144,.3)', background: 'transparent',
            transition: 'color .25s, border-color .25s',
          }}
            onMouseEnter={e => { (e.currentTarget.style.color = '#ef4444'); (e.currentTarget.style.borderColor = '#ef4444'); }}
            onMouseLeave={e => { (e.currentTarget.style.color = 'var(--nude)'); (e.currentTarget.style.borderColor = 'rgba(175,160,144,.3)'); }}
          >Sair</button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {/* Page title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--brown)', fontWeight: 300 }}>Dashboard</h1>
          <p style={{ fontSize: '.85rem', color: 'var(--text-soft)' }}>Gerencie os agendamentos do Lumiê Studio</p>
        </div>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total de Agendamentos', value: vm.stats.total, accent: 'var(--brown)' },
            { label: 'Pendentes', value: vm.stats.pending, accent: 'var(--gold)' },
            { label: 'Confirmados Hoje', value: vm.stats.confirmedToday, accent: '#10b981' },
            { label: 'Concluídos no Mês', value: vm.stats.completedMonth, accent: '#8b5cf6' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--white)', padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              borderTop: `3px solid ${stat.accent}`,
              animation: 'fadeUp .5s ease both',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: stat.accent, display: 'block', lineHeight: 1 }}>{stat.value}</span>
              <span style={{ fontSize: '.72rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--text-soft)', display: 'block', marginTop: '.4rem' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          background: 'var(--white)', padding: '1.2rem 1.5rem', marginBottom: '1rem',
          display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-soft)', display: 'block', marginBottom: '.4rem' }}>Buscar cliente</label>
            <input
              placeholder="Nome ou telefone..."
              value={vm.search}
              onChange={e => vm.setSearch(e.target.value)}
              style={{ width: '100%', padding: '.6rem .9rem', border: '1px solid var(--blush-dark)', background: 'var(--blush)', fontSize: '.88rem', fontFamily: 'var(--font-body)', borderRadius: 2 }}
            />
          </div>
          <div>
            <label style={{ fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-soft)', display: 'block', marginBottom: '.4rem' }}>Status</label>
            <select value={vm.filterStatus} onChange={e => vm.setFilterStatus(e.target.value)}
              style={{ padding: '.6rem .9rem', border: '1px solid var(--blush-dark)', background: 'var(--blush)', fontSize: '.88rem', fontFamily: 'var(--font-body)', borderRadius: 2, cursor: 'pointer' }}>
              <option value="all">Todos</option>
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmado</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-soft)', display: 'block', marginBottom: '.4rem' }}>Data</label>
            <input type="date" value={vm.filterDate} onChange={e => vm.setFilterDate(e.target.value)}
              style={{ padding: '.6rem .9rem', border: '1px solid var(--blush-dark)', background: 'var(--blush)', fontSize: '.88rem', fontFamily: 'var(--font-body)', borderRadius: 2 }} />
          </div>
          {(vm.filterStatus !== 'all' || vm.filterDate || vm.search) && (
            <button onClick={() => { vm.setFilterStatus('all'); vm.setFilterDate(''); vm.setSearch(''); }}
              style={{ padding: '.6rem 1rem', border: '1px solid var(--nude)', background: 'transparent', fontSize: '.78rem', letterSpacing: '.1em', cursor: 'pointer', color: 'var(--text-soft)', borderRadius: 2 }}>
              Limpar filtros ✕
            </button>
          )}
        </div>

        {/* Bookings table */}
        <div style={{ background: 'var(--white)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {vm.filtered.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--nude)' }}>Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--blush-dark)' }}>
                    {['Cliente','Serviço','Profissional','Data','Horário','Status','Ações'].map(h => (
                      <th key={h} style={{
                        padding: '.9rem 1rem', textAlign: 'left',
                        fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase',
                        color: 'var(--text-soft)', fontWeight: 500,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vm.filtered.map((booking, i) => (
                    <tr key={booking.id} style={{
                      borderBottom: '1px solid var(--blush)',
                      background: i % 2 === 0 ? 'var(--white)' : 'var(--blush)',
                      transition: 'background .2s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(215,166,41,.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'var(--white)' : 'var(--blush)')}
                    >
                      <td style={{ padding: '.9rem 1rem' }}>
                        <div style={{ fontWeight: 500, fontSize: '.9rem', color: 'var(--text)' }}>{booking.clientName}</div>
                        <div style={{ fontSize: '.75rem', color: 'var(--text-soft)' }}>{booking.clientPhone}</div>
                      </td>
                      <td style={{ padding: '.9rem 1rem', fontSize: '.87rem', color: 'var(--text-soft)' }}>{vm.getServiceName(booking.serviceId)}</td>
                      <td style={{ padding: '.9rem 1rem', fontSize: '.87rem', color: 'var(--text-soft)' }}>{vm.getProfName(booking.professionalId)}</td>
                      <td style={{ padding: '.9rem 1rem', fontSize: '.87rem', color: 'var(--text)' }}>{vm.formatDate(booking.date)}</td>
                      <td style={{ padding: '.9rem 1rem' }}>
                        <span style={{
                          fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--brown)',
                          background: 'rgba(215,166,41,.1)', padding: '.2rem .6rem',
                        }}>{booking.time}</span>
                      </td>
                      <td style={{ padding: '.9rem 1rem' }}>
                        <StatusBadge status={booking.status} />
                      </td>
                      <td style={{ padding: '.9rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '.5rem' }}>
                          <button onClick={() => setSelected(booking)} style={{
                            padding: '.3rem .7rem', border: '1px solid var(--blush-dark)',
                            background: 'transparent', fontSize: '.72rem', cursor: 'pointer',
                            color: 'var(--text-soft)', borderRadius: 2, transition: 'all .2s',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--brown)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--blush-dark)'; e.currentTarget.style.color = 'var(--text-soft)'; }}
                          >Ver</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ padding: '.8rem 1rem', borderTop: '1px solid var(--blush-dark)', fontSize: '.75rem', color: 'var(--text-soft)' }}>
            {vm.filtered.length} agendamento(s) encontrado(s)
          </div>
        </div>
      </main>

      {/* Booking Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Detalhes do Agendamento">
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Cliente', value: selected.clientName },
                { label: 'Telefone', value: selected.clientPhone },
                { label: 'E-mail', value: selected.clientEmail },
                { label: 'Serviço', value: vm.getServiceName(selected.serviceId) },
                { label: 'Profissional', value: vm.getProfName(selected.professionalId) },
                { label: 'Data & Hora', value: `${vm.formatDate(selected.date)} às ${selected.time}` },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--blush)', padding: '.8rem' }}>
                  <span style={{ fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--nude)', display: 'block', marginBottom: '.2rem' }}>{item.label}</span>
                  <span style={{ fontSize: '.9rem', color: 'var(--text)' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {selected.notes && (
              <div style={{ background: 'var(--blush)', padding: '.8rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--nude)', display: 'block', marginBottom: '.2rem' }}>Observações</span>
                <span style={{ fontSize: '.88rem', color: 'var(--text-soft)' }}>{selected.notes}</span>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-soft)', display: 'block', marginBottom: '.6rem' }}>Atualizar Status</label>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                {(['pending','confirmed','completed','cancelled'] as BookingStatus[]).map(s => (
                  <button key={s} onClick={() => { vm.updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }}
                    style={{
                      padding: '.4rem .9rem', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase',
                      border: `1px solid ${selected.status === s ? statusColor(s) : 'var(--blush-dark)'}`,
                      background: selected.status === s ? `${statusColor(s)}18` : 'transparent',
                      color: selected.status === s ? statusColor(s) : 'var(--text-soft)',
                      cursor: 'pointer', borderRadius: 2, transition: 'all .2s',
                    }}>
                    {{ pending:'Pendente', confirmed:'Confirmar', completed:'Concluir', cancelled:'Cancelar' }[s]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="danger" size="sm" onClick={() => { vm.deleteBooking(selected.id); setSelected(null); }}>
                Excluir
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Fechar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
