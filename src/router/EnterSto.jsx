import { useState } from 'react';
import '../StoUniverse.css';

const EnterSto = () => {
  const [count, setCount] = useState(0);
  const [stepOne, setStepOne] = useState(false); 

  function showNext(e) {
    setStepOne(true);
  }

  return (
    <div className="Universe" id="enter">
      <NavLink className="smol-link" link={"/"} text={"home"} back={true} />
      <h1>sto's universe</h1>
      <p className="Transmission">You are now about to enter a text-facilitated galactic exploration, art gallery, and adventure.</p>
      { stepOne ? 
        <StepBox msg={"Explore the universe by clicking on the hyperlinks available on each page."} />
        : null 
      }
      <div className="Next">
       <UniverseButton showNext={() => showNext()} />
      </div>
      { stepOne ? <Navigation /> : null}
    </div>
  );
};

const UniverseButton = ({showNext}) => (
  <button 
    className="UniverseBtn" 
    onClick={() => showNext()} >
    Next
  </button>
);

const StepBox = ({msg}) => (
  <div className="StepTransmission">
    <p>{msg}</p>
  </div>
);

const Navigation = () => (
  <div>
    <NavLink link={"music/"} text={"music"} />
    <NavLink link={"gallery/"} text={"gallery"} />
    <NavLink link={"story/"} text={"story"} />
    <NavLink link={"thoughts/"} text={"thoughts"} />
  </div>
)

const NavLink = ({link, text, back}) => (
  <p>
    <a href={link}
      className="NavLink"
    >
      { back ? ('← ' + text) : (text + ' →') }
    </a>
  </p>
)

export default EnterSto;
