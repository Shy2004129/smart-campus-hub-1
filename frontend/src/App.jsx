import { useEffect, useState } from 'react'
import axios from 'axios'
import { Bell, Calendar, Wrench, BarChart, MessageSquare, Trash2, CheckCircle, XCircle } from 'lucide-react'

function App() {
  const API_BASE = 'http://localhost:8084/api' 
  
  // --- 1. STATE MANAGEMENT ---
  const [resources, setResources] = useState([])
  const [bookings, setBookings] = useState([])
  const [tickets, setTickets] = useState([])
  const [notifications, setNotifications] = useState([])
  const [comments, setComments] = useState([])

  // Form States
  const [selectedResId, setSelectedResId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [ticketDesc, setTicketDesc] = useState('')
  const [priority, setPriority] = useState('LOW')
  const [newComment, setNewComment] = useState('')

  // --- 2. DATA FETCHING ---
  const fetchData = () => {
    // We use ID 1 as our test user (Shiney)
    axios.get(`${API_BASE}/resources`).then(res => setResources(res.data)).catch(e => console.log(e))
    axios.get(`${API_BASE}/bookings`).then(res => setBookings(res.data)).catch(e => console.log(e))
    axios.get(`${API_BASE}/tickets`).then(res => setTickets(res.data)).catch(e => console.log(e))
    axios.get(`${API_BASE}/notifications/1`).then(res => setNotifications(res.data)).catch(e => console.log(e))
    axios.get(`${API_BASE}/comments/ticket/1`).then(res => setComments(res.data)).catch(e => console.log(e))
  }

  useEffect(() => { fetchData() }, [])

  // --- 3. EVENT HANDLERS ---

  const handleBooking = (e) => {
    e.preventDefault()
    const booking = { 
      resource: { id: parseInt(selectedResId) }, 
      user: { id: 1 }, 
      startTime, 
      endTime, 
      status: 'PENDING',
      purpose: 'University Lab Work'
    }
    axios.post(`${API_BASE}/bookings`, booking)
      .then(() => { alert("✅ Booking Requested!"); fetchData(); })
      .catch(err => alert("❌ Conflict: This time slot is already taken!"));
  }

  const handleTicket = (e) => {
    e.preventDefault()
    const ticket = { 
      description: ticketDesc, 
      priority, 
      locationText: "Main Campus Block A", 
      category: "Maintenance", 
      createdBy: { id: 1 } 
    }
    axios.post(`${API_BASE}/tickets`, ticket)
      .then(() => { 
        alert("🚩 Ticket Reported Successfully!"); 
        setTicketDesc(''); 
        fetchData(); 
      })
  }

  const updateBookingStatus = (id, status) => {
    // Admin requirement: Update status via API
    axios.put(`${API_BASE}/bookings/${id}/status?status=${status}`)
      .then(() => fetchData())
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    const comment = { ticketId: 1, author: "Student User", content: newComment }
    axios.post(`${API_BASE}/comments`, comment).then(() => { setNewComment(''); fetchData(); })
  }

  const deleteComment = (id) => {
    // REST requirement: DELETE method
    axios.delete(`${API_BASE}/comments/${id}`).then(() => fetchData())
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* HEADER SECTION */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#1e272e', color: 'white', padding: '15px 30px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>🎓 Smart Campus Hub</h1>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Operations & Maintenance Portal</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* OAuth Login Link */}
          <a href="http://localhost:8084/oauth2/authorization/google" style={{ color: '#4bcffa', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Login with Google</a>
          
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Bell size={24} />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#ff3f34', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* INNOVATION: ANALYTICS DASHBOARD SECTION */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <StatCard icon={<Calendar color="#05c46b"/>} title="Total Bookings" value={bookings.length} />
        <StatCard icon={<Wrench color="#ff5e57"/>} title="Active Tickets" value={tickets.length} />
        <StatCard icon={<BarChart color="#34e7e4"/>} title="Resources" value={resources.length} />
        <StatCard icon={<CheckCircle color="#ef5777"/>} title="System Status" value="Online" />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        
        {/* LEFT COLUMN: ACTION FORMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* BOOKING FORM */}
          <div style={cardStyle}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={20}/> New Booking Request</h3>
            <form onSubmit={handleBooking} style={formStyle}>
              <select value={selectedResId} onChange={e => setSelectedResId(e.target.value)} style={inputStyle} required>
                <option value="">-- Choose a Facility / Equipment --</option>
                {resources.map(r => <option key={r.id} value={r.id}>{r.name} ({r.location})</option>)}
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                   <label style={labelStyle}>Start Time</label>
                   <input type="datetime-local" onChange={e => setStartTime(e.target.value)} style={inputStyle} required />
                </div>
                <div style={{ flex: 1 }}>
                   <label style={labelStyle}>End Time</label>
                   <input type="datetime-local" onChange={e => setEndTime(e.target.value)} style={inputStyle} required />
                </div>
              </div>
              <button type="submit" style={btnStyle('#0fbcf9')}>Submit Booking</button>
            </form>
          </div>

          {/* TICKET FORM */}
          <div style={{ ...cardStyle, borderLeft: '5px solid #ff5e57' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Wrench size={20}/> Report Incident</h3>
            <form onSubmit={handleTicket} style={formStyle}>
              <input placeholder="What needs fixing? (e.g. Broken AC in Lab 2)" value={ticketDesc} onChange={e => setTicketDesc(e.target.value)} style={inputStyle} required />
              <select value={priority} onChange={e => setPriority(e.target.value)} style={inputStyle}>
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="URGENT">🔴 URGENT</option>
              </select>
              <button type="submit" style={btnStyle('#ff5e57')}>Submit Ticket</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ADMIN & SOCIAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* ADMIN BOOKING MANAGEMENT */}
          <div style={cardStyle}>
            <h3>📋 Booking Approvals (Admin)</h3>
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr><th style={thStyle}>Resource</th><th style={thStyle}>Status</th><th style={thStyle}>Action</th></tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tdStyle}>{b.resource?.name}</td>
                      <td style={{ ...tdStyle, color: b.status === 'APPROVED' ? '#05c46b' : '#ffa801', fontWeight: 'bold' }}>{b.status}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <CheckCircle size={18} onClick={() => updateBookingStatus(b.id, 'APPROVED')} style={{ cursor: 'pointer' }} color="#05c46b"/>
                          <XCircle size={18} onClick={() => updateBookingStatus(b.id, 'REJECTED')} style={{ cursor: 'pointer' }} color="#ff5e57"/>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COMMENTS SECTION */}
          <div style={cardStyle}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MessageSquare size={20}/> Live Updates</h3>
            <div style={{ backgroundColor: '#f1f2f6', borderRadius: '8px', padding: '10px', marginBottom: '10px', maxHeight: '150px', overflowY: 'auto' }}>
              {comments.length === 0 && <p style={{ fontSize: '12px', color: '#7f8c8d' }}>No comments yet.</p>}
              {comments.map(c => (
                <div key={c.id} style={{ fontSize: '12px', padding: '8px', borderBottom: '1px solid #dcdde1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><strong>{c.author}:</strong> {c.content}</span>
                  <Trash2 size={14} onClick={() => deleteComment(c.id)} style={{ cursor: 'pointer', color: '#ff5e57' }} />
                </div>
              ))}
            </div>
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '5px' }}>
              <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Type a message..." style={{ ...inputStyle, padding: '8px', flex: 1 }} />
              <button type="submit" style={{ ...btnStyle('#2f3542'), padding: '8px 15px' }}>Send</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

// --- STYLING OBJECTS ---
const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #dcdde1', fontSize: '14px', width: '100%', boxSizing: 'border-box' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#57606f', marginBottom: '5px', display: 'block' };
const thStyle = { padding: '10px', textAlign: 'left', color: '#57606f' };
const tdStyle = { padding: '10px' };
const btnStyle = (color) => ({ padding: '12px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s opacity' });

const StatCard = ({ icon, title, value }) => (
  <div style={{ ...cardStyle, textAlign: 'center', padding: '20px' }}>
    <div style={{ marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '12px', color: '#747d8c', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2f3542' }}>{value}</div>
  </div>
);

export default App