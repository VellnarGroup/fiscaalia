import { useEffect, useState } from 'react'
import './App.css'

interface User {
  id: string
  name: string
  email: string
  role: string
}

function App() {
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function fetchdata() {
      try {
        const response = await fetch('/api/users/test')
        const data = await response.json()

        setMessage(data.example)
        setUsers(data.users || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchdata()
  }, [])

  return (
    <>
      <div></div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setMessage((m) => m + '!')}>
          Message: {message}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <div className="user-list">
        <h2>Utenti Test:</h2>
        {users.length > 0 ? (
          <ul
            style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}
          >
            {users.map((user) => (
              <li
                key={user.id}
                style={{
                  margin: '10px 0',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              >
                <strong>{user.name}</strong> ({user.role})<br />
                <span style={{ color: '#666' }}>{user.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nessun utente trovato</p>
        )}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
