import { useEffect, useState, useReducer } from 'react';
import Gun from 'gun';

// connect to the server
const gun = Gun({
  peers: [
    'https://eight-pointer-server.herokuapp.com/gun'
  ]
})

const initialState = {
  messages: []
}

function reducer(state, message) {
  return {
    messages: [message, ...state.messages]
  }
}

export default function App() {
    const [formState, setForm] = useState({
    username: '', point_estimate: ''
  })

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const messages = gun.get('messages');
    messages.map().on(m => {
      dispatch({
        username: m.username,
        point_estimate: m.point_estimate,
        createdAt: m.createdAt
      })
    })
  }, [])

  function saveMessage() {
    const messages = gun.get('messages')
    messages.set({
      username: formState.username,
      point_estimate: formState.point_estimate,
      createdAt: Date.now()
    })
    setForm({
      username: '', point_estimate: ''
    })
  }

  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value  })
  }

  return (
    <div style={{ padding: 30 }}>
      <input
        onChange={onChange}
        placeholder="Username"
        name="username"
        value={formState.username}
      />
      <input
        onChange={onChange}
        placeholder="Point Estimate"
        name="point_estimate"
        value={formState.point_estimate}
      />
      <button onClick={saveMessage}>Estimate</button>
      {
        state.messages.map(message => (
          <div key={message.createdAt}>
            <p>{`${message.username} estimated: ${message.point_estimate} points`}</p>
          </div>
        ))
      }
    </div>
  );
}