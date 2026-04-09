import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [resources, setResources] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedResId, setSelectedResId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    axios.get('http://localhost:8082/api/resources').then(res => setResources(res.data))
    axios.get('http://localhost:8082/api/bookings').then(res => setBookings(res.data))
  }

  const handleBooking = (e) => {
  e.preventDefault();
  
  // This helps us see if the data is correct before sending
  console.log("Attempting booking for Resource ID:", selectedResId);
  console.log("Start:", startTime, "End:", endTime);

  if (!selectedResId) {
    alert("Please select a room first!");
    return;
  }

  const newBooking = {
    resource: { id: parseInt(selectedResId) }, // Make sure it's a number
    user: { id: 1 }, 
    startTime: startTime,
    endTime: endTime,
    purpose: "Study Session",
    status: "APPROVED" 
  };

  axios.post('http://localhost:8082/api/bookings', newBooking)
    .then(response => {
      console.log("Success:", response.data);
      alert("✅ Booking Successful!");
      fetchData(); // Refresh the table
    })
    .catch(err => {
      console.error("Booking Error:", err);
      // Show the specific error from Java
      alert("❌ " + (err.response?.data || "Server error"));
    });
}

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5' }}>
      <h1>🎓 Smart Campus Hub</h1>
      
      {/* SECTION 1: BOOKING FORM */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>Make a New Booking</h3>
        <form onSubmit={handleBooking}>
          <select onChange={e => setSelectedResId(e.target.value)} required style={{padding:'10px', marginRight:'10px'}}>
            <option value="">Select Resource</option>
            {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <input type="datetime-local" onChange={e => setStartTime(e.target.value)} style={{padding:'10px', marginRight:'10px'}} />
          <input type="datetime-local" onChange={e => setEndTime(e.target.value)} style={{padding:'10px', marginRight:'10px'}} />
          <button type="submit" style={{padding:'10px 20px', backgroundColor:'#007bff', color:'white', border:'none', borderRadius:'5px'}}>Book Now</button>
        </form>
      </div>

      {/* SECTION 2: LIST OF BOOKINGS */}
      <h3>Recent Bookings</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', backgroundColor: 'white', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Resource</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.resource?.name}</td>
              <td>{new Date(b.startTime).toLocaleString()}</td>
              <td>{new Date(b.endTime).toLocaleString()}</td>
              <td style={{ color: b.status === 'APPROVED' ? 'green' : 'orange' }}>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App