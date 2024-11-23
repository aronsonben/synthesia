import { useState } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  return (
    <div className="App">
      <div className="topNav">
      <h1>Synthesia</h1>
      </div>
      <div className="authWrapper">
        <div className="authBlock">
          <p className="description">Sign in via magic link with your email below</p>
          <form className="form-widget" onSubmit={handleLogin}>
            <div>
              <input
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <button className={'button block'} disabled={loading}>
                {loading ? <span>Loading</span> : <span>Send magic link</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}