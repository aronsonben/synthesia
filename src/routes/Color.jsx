import { useState, useEffect, useRef } from 'react';
import { Colorful } from '@uiw/react-color';
import { hsvaToHex } from '@uiw/color-convert';
import { useNavigate } from 'react-router-dom';
import { UniverseButton } from '../Components';
import { GetColorName } from 'hex-color-to-color-name';
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../Navbar';
import '../StoUniverse.css';
import '../Color.css';
// import '@wcj/dark-mode';

// Setting up environment variables
const S3_URL = "https://s3.amazonaws.com/dropcolumn.com/flexonem/";
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const TrackAudio = ({track}) => {
  console.log("PRING TING", track);
  return (
    <div className="TrackAudio">
      <audio controls src={track.link}></audio>
      <p>{track.title}</p>
    </div>
  );
}

/**
 * Color block object, a small square filled with the chosen color
 */
const ColorBlock = ({hex, colorKey}) => {
  return (
    <div className="PaletteDisplay">
      <div className="ColorBlockSide" style={{background: hex}} key={colorKey}>
        <span></span>
      </div>
    </div>
  )
}

const Color = () => {
  const [hsva, setHsva] = useState({ h: 226, s: 29, v: 68, a: 1 });
  const [textColor, setTextColor] = useState({ h: 226, s: 29, v: 100, a: 1 });
  const [thisTrack, setThisTrack] = useState({});
  const [sessionColors, setSessionColors] = useState({});
  const [tracks, setTracks] = useState([]);
  const [trackID, setTrackID] = useState(1);
  const [currentTrackOrder, setCurrentTrackOrder] = useState(1);
  const [showDevTools, setShowDevTools] = useState(true);
  const navigate = useNavigate();

  let colorText = {"color": textColor};

  useEffect(() => {
    // TODO: test internet connection?
    // Supabase implementation
    getTracks().then(tracks => {
      console.log('FOUND: ');
      console.log(tracks);
      setThisTrack(tracks[0]);
      setTrackID(tracks[0]['id']);
      setCurrentTrackOrder(tracks[0]['track_order']);
    }).catch(() => {
      console.log('ERROR: Could not connect to database (Supabase)');
      // On error, pre-fill with sample database
      initialPopulate();
    });

    // Pre-supabase:
    /* let ignore = false;
    initialPopulate();
    setTrackDB({});
    setThisTrack({});
    getData().then(result => {
      if (!ignore) {
        setTrackDB(result);
        setThisTrack(result[1]);
      }
    });
    return () => {
      ignore = true;
    }; */
  }, []);

  async function getTracks() {
    const { data } = await supabase.from("tracks").select().order('track_order');
    console.log("getting tracks...:");
    console.log(data);
    setTracks(data);
    return data;
  }

  /** onSubmit:
   * - save new hex to current trackID
   * - change trackID to next trackID
   */
  async function submitColor(hex) {
    console.log("submiting: ",hex);
    // Fetch data
    let tracks = await getData();
    // Get color array for current track
    let trackColors = tracks[trackID]["colors"];
    // Add new hex to color array
    trackColors.push(hex);
    // Update track object with new array
    tracks[trackID]["colors"] = trackColors;
    // Save data
    await storeData(tracks);
    // Check that we're not at the end of the tracklist
    if(trackID < Object.keys(tracks).length) {
      // If so, change to next trackID
      nextTrack(trackID + 1);
    } else {
      // Otherwise, go to final review page
      console.log('redir');
      navigate("/synthesia/palettes");
    }
  }

  /** submitColor function modified to work with supabase */
  async function submitColorSupa(hex) {
    console.log("submiting: ",hex);
    // Fetch data
    // tracks
    // Get color array for current track
    const { data, error } = await supabase.from('tracks').select().eq('id', trackID);
    let trackColors = data[0]["colors"];
    // Add new hex to color array
    trackColors.push(hex);
    sessionColors[trackID] = hex;
    // Update colors array for current track with new hex:
    const updatedData = updateColors(trackID, trackColors);
    // Get count of tracks
    const { count, ctError } = await supabase.from('tracks').select('*', { count: 'exact', head: true });
    console.log('count', count);
    // Check that we're not at the end of the tracklist
    if(currentTrackOrder <= count) {
      // If not, change to next trackID
      nextTrack(currentTrackOrder + 1);
    } else {
      // Otherwise, go to final review page
      console.log('redir');
      navigate("/synthesia/palettes");
    }
  }

  async function updateColors(id, newColors) {
    const { data, error } = await supabase
      .from('tracks')
      .update({ colors: newColors })
      .eq('id', id)
      .select();
    return data;
  }

  /** Prepare next track question:
   * - Set next track id
   * - Fetch next track data
   * - Reset color
   */
  async function nextTrack(nextID) {
    // Check if nextID exists??
    console.log(nextID);
    const { data, error } = await supabase.from("tracks").select().eq("track_order", nextID).limit(1);
    console.log(data);
    setTrackID(data[0]['id']);
    setCurrentTrackOrder(data[0]['track_order']);
    setThisTrack(data[0]);
    // Pre-supa
    // setTrackID(nextID);
    // setThisTrack(trackDB[nextID]);
    setHsva({ h: 226, s: 29, v: 68, a: 1 });
  }

  async function selectTrack(track) {
    const { data, error } = await supabase.from("tracks").select().eq("track_order", track.track_order).limit(1);
    const nuTrack = data[0];
    setTrackID(nuTrack.id);
    setCurrentTrackOrder(nuTrack.track_order);
    setThisTrack(nuTrack);
    console.log("set: ", nuTrack);
    setHsva({ h: 226, s: 29, v: 68, a: 1 });
  }

  async function getData() {
    try {
      const jsonValue = await AsyncStorage.getItem('tracks');
      console.log(JSON.parse(jsonValue));
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log("ERROR: ");
    }
  }

  async function getOneData(id) {
    try {
      const rawJson = await AsyncStorage.getItem('tracks');
      const jsonValue = JSON.parse(rawJson);
      const oneValue = jsonValue[id];
      return oneValue != null ? oneValue : null;
    } catch (e) {
      // error reading value
      console.log("ERROR: ")
      console.log(e);
    }
  }

  async function storeData(value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('tracks', jsonValue);
    } catch (e) {
      // saving error
    }
  }

  async function initialPopulate() {
    try {
      const tracksInit = {
        1: {"title": "waxxx", "colors": ["#ffffff"], "link": S3_URL.concat("waxxx.mp3")}, 
        2: {"title": "pecans", "colors": ["#ffffff"], "link": S3_URL.concat("pecans.mp3")},
        3: {"title": "thunda", "colors": ["#ffffff"], "link": S3_URL.concat("thunda.mp3")}
      }
      await AsyncStorage.setItem('tracks', JSON.stringify(tracksInit));
      console.log('added');
      return tracksInit;
    } catch (e) {
      // saving error
    }
  }

  async function clearDB() {
    storeData({});
  }

  return (
    <div className="Universe" id="enter" style={{ background: hsvaToHex(hsva) }}>
      <div className="trackTable">
        <h4><i>Tracklist</i></h4>
        <ol className="sideTrackList">
          {
            tracks.map((track) => {
              return(
                <li 
                  className={currentTrackOrder == track.track_order ? "selectedTrack" : ""}
                  key={track.track_order} 
                  onClick={() => selectTrack(track)}
                  >
                  <div className="trackListItem">
                    {track.title}
                    <ColorBlock
                      hex={ (sessionColors[track.id]) ? (sessionColors[track.id]) : "#ffffff" } 
                      colorKey={"1"} 
                      key={"1"} />
                  </div>
                </li>
              );
            })
          }
        </ol>
        <button onClick={() => navigate('/synthesia/palettes')}>palettes</button>
      </div>
      <div className="ColorHolder">
        {
          (process.env.NODE_ENV == 'development') ?
            (
              <div className="devTools" style={{"display": "flex", "flex-direction": "column", "width": "25%", "margin": "0 auto"}}>
                <button onClick={() => setShowDevTools(!showDevTools)}>dev tools</button>
                {(showDevTools) ? 
                    (<>
                      <button onClick={getData}>show</button>
                      <button onClick={clearDB}>clear</button>
                      <button onClick={initialPopulate}>populate</button>
                    </>) 
                  : (<></>)
                }
                </div>
            ) : (<></>)
        }
        <h1>synthesia</h1>
        <h4><i>What does this sound look like?</i></h4>
        <div className="ColorBox">
          <div className="TextShiftLeft">
            <p className="TextBubble TBLeft">listen to this song...</p>
          </div>
          <TrackAudio track={thisTrack} />
        </div>
        <div className="ColorBox">
          <div className="TextShiftRight">
            <p className="TextBubble TBRight">...then pick the color it makes you feel</p>
          </div>
          <div className="ColorPickBox">
            <Colorful
              color={hsva}
              disableAlpha={true}
              onChange={(color) => {
                setHsva(color.hsva);
                setTextColor({});
              }}
              style={{ width: '300px' }}
            />
            <div className="ColorCard" style={{ background: hsvaToHex(hsva)}}>
              <p>{GetColorName(hsvaToHex(hsva))}</p>
              <p style={{color: hsvaToHex(textColor), mixBlendMode: "difference"}}>{JSON.stringify(hsvaToHex(hsva)).substring(1,8)}</p>
            </div>
          </div>
        </div>
        <button className={(currentTrackOrder >= 1) ? "mobileNav" : "disabledMobileNav"} onClick={() => (currentTrackOrder >= 1) ? nextTrack(currentTrackOrder - 1) : ''}>{'<'} Previous</button>
        <button className="ColorSubmit" onClick={() => submitColorSupa(hsvaToHex(hsva))}>SUBMIT</button>
        <button className={(currentTrackOrder <= tracks.length) ? "mobileNav" : "disabledMobileNav"} onClick={() => (currentTrackOrder <= tracks.length) ? nextTrack(currentTrackOrder + 1) : ''}>Next {'>'}</button>
        <div className="FormProgress" style={{"display": "none"}}>
          {currentTrackOrder >= 4 ? (<span>...</span>) : null}
          {
            (tracks.filter((track) => 
              track.track_order > currentTrackOrder-3 && track.track_order < currentTrackOrder+3
            )).map(track => {
              if(track.track_order != 0) {
                return (
                  <span 
                    className={currentTrackOrder == track.track_order ? "BoldID TrackNav" : "TrackNav"}
                    key={track.track_order} 
                    onClick={() => selectTrack(track)}
                  >
                      {track.track_order}
                  </span>
                );
              } else return null;
            })
          }
          {currentTrackOrder <= 18 ? (<span>...</span>) : null}
          <div>
            <button onClick={() => navigate('/synthesia/palettes')}>palettes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Color;
