import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient'
import "../assets/Home.css";

const App = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, []);

  return (
    <div className="App">
      <div className="topNav">
        {!session ? 
          <button onClick={() => navigate("/auth/sign-in")}>Login</button> 
          : 
          (<>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={() => supabase.auth.signOut()}>Logout</button>
          </>)
        }
      </div>
      <div className="homeHeader">
        <h1>Synthesia</h1>
      </div>
      <div className="colorPalette">
        <div className="colorBlock" style={{ backgroundColor: "#ef476f" }}></div>
        <div className="colorBlock" style={{ backgroundColor: "#ffd166" }}></div>
        <div className="colorBlock" style={{ backgroundColor: "#06d6a0" }}></div>
        <div className="colorBlock" style={{ backgroundColor: "#118ab2" }}></div>
        <div className="colorBlock" style={{ backgroundColor: "#073b4c" }}></div>
      </div>
      <p>crowdsourced color palettes for your music</p>
      <div className="introBlock">
        <a className="App-link" href="" onClick={() => navigate("/synthesia")}>
          e n t e r - {">"}
        </a>
      </div>
      <div className="loginBlock">
        {/* {!session ? <Auth /> : <Account key={session.user.id} session={session} />} */}
      </div>
    </div>
  );
};

export default App;
