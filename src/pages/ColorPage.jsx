import { useState, useEffect, useRef } from 'react';
import { Colorful } from '@uiw/react-color';
import { hsvaToHex } from '@uiw/color-convert';
import { useNavigate } from 'react-router-dom';
import { UniverseButton } from '../Components';
import { GetColorName } from 'hex-color-to-color-name';
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../Color.css';
// import '@wcj/dark-mode';

// Setting up environment variables
const S3_URL = "https://s3.amazonaws.com/dropcolumn.com/flexonem/";
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}
let supabaseUrl = '';
let supabaseAnonKey = '';
if (import.meta.env.DEV) {
  console.log('Connecting to Supabase in development');
  supabaseUrl = import.meta.env.VITE_SUPABASE_DEV_URL
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_DEV_ANON_KEY
} else if (import.meta.env.PROD) {
  console.log('Connecting to Supabase in production');
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
} else {
  console.log('ERROR: Could not connect to Supabase');
  throw new Error('Could not instantiate connection to Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const TrackAudio = ({ track }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => {
      if (audioElement.currentTime >= 60) {
        audioElement.pause();
        audioElement.currentTime = 30; // Optionally reset to the beginning
      }
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);

    const handleLoadedData = () => {
      console.log('Track loaded');
      audioElement.currentTime = 30;
    };

    audioElement.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <div className="TrackAudio">
      <audio ref={audioRef} controls controlsList="nodownload noplaybackrate" src={track.link}></audio>
      <span style={{"fontSize": "10px"}}><i>*30sec snippet</i></span>
      <p>{track.title}</p>
    </div>
  );
};

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
    // Supabase implementation
    getTracks().then(tracks => {
      console.log('FOUND: ');
      console.log(tracks);
      setThisTrack(tracks[0]);
      setTrackID(tracks[0]['id']);
      setCurrentTrackOrder(tracks[0]['track_order']);
      // Trying to not use the track_order value and instead allow for filtering:
      // setCurrentTrackOrder(0);
    }).catch(() => {
      console.log('ERROR: Could not connect to database (Supabase)');
      // On error, pre-fill with sample database
      initialPopulate();
    });
  }, []);

  async function getTracks() {
    const { data } = await supabase.from("tracks").select().order('track_order');
    // const { data } = await supabase.from("tracks").select().in('id', [6, 5, 8, 9, 20]).order('track_order'); // Thanksgiving demo filter
    console.log("getting tracks...:");
    console.log(data);
    setTracks(data);
    return data;
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
    if(currentTrackOrder < count) {
      // If not, change to next trackID
      nextTrack(currentTrackOrder + 1);
    } else {
      // Otherwise, go to final review page
      console.log('redir');
      navigate("/palettes");
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
    setHsva({ h: 226, s: 29, v: 68, a: 1 });
  }

  /**
   * Set the next track to the next track in the track list fetched from the database upon load,
   * instead of just incrementing the current track order.
   */
  async function nextTrackFiltered() {
    console.log("trying to get next track (filtered)...");
    console.log
    // get the next track from tracks[]
    let nextTrack = tracks[currentTrackOrder+1];
    console.log(nextTrack);
    setTrackID(nextTrack.id);
    setCurrentTrackOrder(currentTrackOrder+1);
    setThisTrack(nextTrack);
    setHsva({ h: 226, s: 29, v: 68, a: 1 });
    console.log("coming up next...", currentTrackOrder+1);
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
        <button onClick={() => navigate('/palettes')}>palettes</button>
      </div>
      <div className="ColorHolder">
        {
          (process.env.NODE_ENV == 'development') ?
            (
              <div className="devTools" style={{"display": "flex", "flexDirection": "column", "width": "25%", "margin": "0 auto"}}>
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
            <p className="TextBubble TBLeft">listen to this song snippet...</p>
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
        <div className="navButtons">
          <button className={(currentTrackOrder >= 1) ? "mobileNav" : "disabledMobileNav"} onClick={() => (currentTrackOrder >= 1) ? nextTrack(currentTrackOrder - 1) : ''}>{'<'} Previous</button>
          <button className="ColorSubmit" onClick={() => submitColorSupa(hsvaToHex(hsva))}>SUBMIT</button>
          <button className={(currentTrackOrder <= tracks.length) ? "mobileNav" : "disabledMobileNav"} onClick={() => (currentTrackOrder <= tracks.length) ? nextTrack(currentTrackOrder + 1) : ''}>Next {'>'}</button>
        </div>
        <button onClick={() => navigate('/palettes')}>Finish (go to palettes)</button>
      </div>
    </div>
  );
};

export default Color;
