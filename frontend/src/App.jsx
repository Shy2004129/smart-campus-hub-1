import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This talks to your Java Backend running on port 8081
    axios.get('http://localhost:8081/api/resources')
      .then(response => {
        setResources(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50' }}>🎓 Smart Campus Operations Hub</h1>
      <p>Welcome to the University Resource Management System</p>
      
      <hr />

      <h2>Available Facilities & Assets</h2>
      
      {loading && <p>Loading resources from database...</p>}

      {!loading && resources.length === 0 && (
        <p style={{ color: 'orange' }}>Connected to Backend, but no resources found in the database table.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {resources.map(res => (
          <div key={res.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>{res.name}</h3>
            <p><strong>Type:</strong> {res.type}</p>
            <p><strong>Location:</strong> {res.location}</p>
            <p><strong>Capacity:</strong> {res.capacity} people</p>
            <div style={{ 
              display: 'inline-block', 
              padding: '5px 10px', 
              borderRadius: '20px', 
              fontSize: '12px',
              backgroundColor: res.status === 'ACTIVE' ? '#e8f5e9' : '#ffebee',
              color: res.status === 'ACTIVE' ? '#2e7d32' : '#c62828'
            }}>
              {res.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App