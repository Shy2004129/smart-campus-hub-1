import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  // 1. STATE VARIABLES
  const [resources, setResources] = useState([])
  const [bookings, setBookings] = useState([])
  const [tickets, setTickets] = useState([])
  
  // Booking Form State
  const [selectedResId, setSelectedResId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const [notifications, setNotifications] = useState([])
  
  // Ticket Form State
  const [ticketDesc, setTicketDesc] = useState('')
  const [priority, setPriority] = useState('LOW')

  // 2. DATA FETCHING
  const fetchData = () => {
    const API_BASE = 'http://localhost:8084/api' // Make sure this matches your backend port
    
    axios.get(`${API_BASE}/resources`).then(res => setResources(res.data)).catch(err => console.error(err))
    axios.get(`${API_BASE}/bookings`).then(res => setBookings(res.data)).catch(err => console.error(err))
    axios.get(`${API_BASE}/tickets`).then(res => setTickets(res.data)).catch(err => console.error(err))
    axios.get('http://localhost:8084/api/notifications/1').then(res => setNotifications(res.data))
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 3. EVENT HANDLERS
  const handleBooking = (e) => {
    e.preventDefault()
    if (!selectedResId) return alert("Select a resource first!")

    const newBooking = {
      resource: { id: parseInt(selectedResId) },
      user: { id: 1 }, 
      startTime: startTime,
      endTime: endTime,
      purpose: "Campus Activity",
      status: "APPROVED"
    }

    axios.post('http://localhost:8084/api/bookings', newBooking)
      .then(() => {
        alert("✅ Booking Successful!")
        fetchData()
      })
      .catch(err => alert("❌ " + (err.response?.data || "Booking failed")))
  }

  const handleTicket = (e) => {
    e.preventDefault();
    
    // 1. FIRST TRACE: Does the button even work?
    console.log("Button clicked! Form is submitting...");
    alert("Sending ticket to server..."); 

    const newTicket = {
      description: ticketDesc,
      priority: priority,
      locationText: "Main Campus",
      category: "GENERAL",
      createdBy: { id: 1 }
    };

    // 2. SECOND TRACE: Check the URL (Is it 8082?)
    axios.post('http://localhost:8084/api/tickets', newTicket)
      .then(response => {
        console.log("Server response:", response.data);
        alert("✅ SUCCESS: Ticket is in the database!");
        setTicketDesc('');
        fetchData(); // This refreshes your table
      })
      .catch(err => {
        console.error("Network Error:", err);
        alert("❌ ERROR: Could not reach the server. Is it running on 8082?");
      });
  }

  // 4. UI RENDER
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>🎓 Smart Campus Operations Hub</h1>

      {/* NOTIFICATION BOX */}
      <div style={{ backgroundColor: '#e2e3e5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <strong>Notifications ({notifications.filter(n => !n.isRead).length} new)</strong>
        <ul style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
          {notifications.slice(0, 3).map(n => (
            <li key={n.id} style={{ color: n.isRead ? '#666' : 'blue', fontWeight: n.isRead ? 'normal' : 'bold' }}>
              {n.message}
            </li>
          ))}
        </ul>
      </div>
      
      {/* SECTION: BOOKING FORM */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>📅 Make a New Booking</h3>
        <form onSubmit={handleBooking} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={selectedResId} onChange={e => setSelectedResId(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1 }}>
            <option value="">-- Select Resource --</option>
            {resources.map(r => <option key={r.id} value={r.id}>{r.name} ({r.location})</option>)}
          </select>
          <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Book Now</button>
        </form>
      </div>

      {/* SECTION: TICKETS FORM */}
      <div style={{ backgroundColor: '#fff3cd', padding: '25px', borderRadius: '12px', border: '1px solid #ffeeba', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>🚩 Report a Maintenance Issue</h3>
        <form onSubmit={handleTicket} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input placeholder="Describe the problem..." value={ticketDesc} onChange={e => setTicketDesc(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 2 }} />
          <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1 }}>
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">URGENT</option>
          </select>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Ticket</button>
        </form>
      </div>

      <hr />

      {/* SECTION: TABLES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        
        {/* BOOKINGS TABLE */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Your Bookings</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '10px' }}>Resource</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '10px' }}>{b.resource?.name}</td>
                  <td style={{ padding: '10px', color: 'green' }}>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TICKETS TABLE */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Active Tickets</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '10px' }}>Description</th>
                <th style={{ padding: '10px' }}>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '10px' }}>{t.description}</td>
                  <td style={{ padding: '10px', color: t.priority === 'URGENT' ? 'red' : 'black' }}>{t.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default App