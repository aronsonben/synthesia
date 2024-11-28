import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hexToRgba, hexToHsva, hsvaToHsla, hslaToHsl } from '@uiw/color-convert';
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../Color.css';
import '../StoUniverse.css';

// Set up env variables
const S3_URL = "https://s3.amazonaws.com/dropcolumn.com/flexonem/";
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Color block object, a small square filled with the chosen color
 */
const ColorBlock = ({colorKey, hex}) => {
  return (
    <div className="PaletteDisplay" key={colorKey+hex}>
      <div className="ColorBlockSide" style={{background: hex}} >
        <span></span>
      </div>
    </div>
  )
}

/**
 * Displays the colors for a given track, sorted by rgba
 */
const TrackPalette = ({colorKey, track}) => {
  const colors = track.colors;
  const clusters = [
    { name: 'red', leadColor: [255, 0, 0], colors: [] },
    { name: 'orange', leadColor: [255, 128, 0], colors: [] },
    { name: 'yellow', leadColor: [255, 255, 0], colors: [] },
    { name: 'chartreuse', leadColor: [128, 255, 0], colors: [] },
    { name: 'green', leadColor: [0, 255, 0], colors: [] },
    { name: 'spring green', leadColor: [0, 255, 128], colors: [] },
    { name: 'cyan', leadColor: [0, 255, 255], colors: [] },
    { name: 'azure', leadColor: [0, 127, 255], colors: [] },
    { name: 'blue', leadColor: [0, 0, 255], colors: [] },
    { name: 'violet', leadColor: [127, 0, 255], colors: [] },
    { name: 'magenta', leadColor: [255, 0, 255], colors: [] },
    { name: 'rose', leadColor: [255, 0, 128], colors: [] },
    { name: 'black', leadColor: [0, 0, 0], colors: [] },
    { name: 'grey', leadColor: [235, 235, 235], colors: [] },
    { name: 'white', leadColor: [255, 255, 255], colors: [] },
  ];

  // Sort the colors by clusters per tomekdev.com
  const sortedClusters = sortWithClusters(colors);
  const sortedColors = sortedClusters.reduce((acc, curr) => {
    // const colors = curr.colors.map((color) => color.hex);
    const colors = curr.colors;
    return [...acc, ...colors];
  }, []);
  // console.log(sortedColors);

  /**
   * Function from: https://tomekdev.com/posts/sorting-colors-in-js
   */
  function blendRgbaWithWhite(rgba) {
    const color = colorUtil.color(rgba);
    const a = color.rgb.a / 256;
    const r = Math.floor(color.rgb.r * a + 0xff * (1 - a));
    const g = Math.floor(color.rgb.g * a + 0xff * (1 - a));
    const b = Math.floor(color.rgb.b * a + 0xff * (1 - a));
    return '#' + ((r << 16) | (g << 8) | b).toString(16);
  }

  /**
   * Function from: https://tomekdev.com/posts/sorting-colors-in-js
   */
  function colorDistance(color1, color2) {
    const x =
      Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2);
    return Math.sqrt(x);
  }

  /**
   * Function from: https://tomekdev.com/posts/sorting-colors-in-js
   */
  function oneDimensionSorting(colors, dim) {
    return colors
      .sort((colorA, colorB) => {
        // console.log("Let's Sort! Colors: ", colorA, colorB);
        // console.log(hexToHsva(colorA));
        // console.log(hsvaToHsla(hexToHsva(colorA)))
        // console.log(hslaToHsl(hsvaToHsla(hexToHsva(colorA))));
        let colA = hslaToHsl(hsvaToHsla(hexToHsva(colorA)));
        let colB = hslaToHsl(hsvaToHsla(hexToHsva(colorB)));
        if (colA[dim] < colB[dim]) {
          return -1;
        } else if (colA[dim] > colB[dim]) {
          return 1;
        } else {
          return 0;
        }
      });
  }

  /**
   * Function from: https://tomekdev.com/posts/sorting-colors-in-js
   */
  function sortWithClusters(colorsToSort) {
    // const clusters = [...]; // as defined above
    const mappedColors = colorsToSort.map((color) => {
        const isRgba = color.includes('rgba');
        if (isRgba) {
          return blendRgbaWithWhite(color);
        } else {
          return color;
        }
      });
      // .map(colorUtil.color);
    
    mappedColors.forEach((color) => {
      let minDistance;
      let minDistanceClusterIndex;

      clusters.forEach((cluster, clusterIndex) => {
        // const colorRgbArr = [color.rgb.r, color.rgb.g, color.rgb.b];
        const rgbaColor = hexToRgba(color);
        const colorRgbArr = [rgbaColor.r, rgbaColor.g, rgbaColor.b];
        const distance = colorDistance(colorRgbArr, cluster.leadColor);

        if (typeof minDistance === 'undefined' || minDistance > distance) {
          minDistance = distance;
          minDistanceClusterIndex = clusterIndex;
        }
      });

      clusters[minDistanceClusterIndex].colors.push(color);
    });
    clusters.forEach((cluster) => {
      // console.log("Cluster Sorting...");
      const dim = ['white', 'grey', 'black'].includes(cluster.name) ? 'l' : 's';
      // console.log("Pre-1d Sort:");
      // console.log(cluster.colors);
      cluster.colors = oneDimensionSorting(cluster.colors, dim);
      // console.log("POST-1d Sort:");
      // console.log(cluster.colors);
    });
    return clusters;
  }

  return (
    <div className="colorPalettePalettePage">
      <div className="paletteTrackTitle"><p>{track.title}</p></div>
      <div className="paletteColorBlocks">
        {track.colors.map((hex, index) => {
          return(
            <ColorBlock key={`color-${colorKey}-${index}-${hex}`} colorKey={`${colorKey}-${index}`} hex={hex} />
          );
        })}
      </div>
    </div>
  );
}

const Palettes = () => {
  const [thisTrack, setThisTrack] = useState({});
  const [trackDB, setTrackDB] = useState({});
  const [tracks, setTracks] = useState([]);
  const [trackID, setTrackID] = useState(1);
  const [currentTrackOrder, setCurrentTrackOrder] = useState(1);
  const [sessions, setSessions] = useState([]);
  const [showDevTools, setShowDevTools] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTracks().then(tracks => {
      // console.log('FOUND: ');
      // console.log(tracks);
      setThisTrack(tracks[0]);
      setTrackID(tracks[0]['id']);
      setCurrentTrackOrder(tracks[0]['track_order']);
    });
    /* let ignore = false;
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
    // const { data } = await supabase.from("tracks").select().order('track_order');
    const { data } = await supabase.from("tracks").select().in('id', [6, 5, 8, 9, 20]).order('track_order');
    // console.log("getting tracks...:");
    // console.log(data);
    setTracks(data);
    return data;
  }

  async function getData() {
    try {
      const jsonValue = await AsyncStorage.getItem('tracks');
      // console.log(JSON.parse(jsonValue));
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log("ERROR: ");
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
      // console.log('added');
    } catch (e) {
      // saving error
      console.log(e);
    }
  }

  /**
   * Admin function to clear the colors from all palettes (except for base white)
   */
  async function clearColors() {
    // For each track in tracks list
    tracks.map(track => {
      let trackColors = track.colors;
      let resetColors = ["#ffffff"];
      // Update colors array for current track with new hex:
      const updatedData = updateColors(track.id, resetColors);
      // console.log("updated...");
    });
  }

  async function updateColors(id, newColors) {
    const { data, error } = await supabase
      .from('tracks')
      .update({ colors: newColors })
      .eq('id', id)
      .select();
    return data;
  }

  /** 
   * Save the current set of color arrays to the database
   * by creating a JSON object containing a user-input Session Name,
   * a timestamped Session Date, and an object mapping each track ID to its color array
   */
  async function saveSession() {
    // Prompt the user for a session name
    const sessionName = prompt("Enter a session name:");
    if (!sessionName) {
      alert("Session name is required.");
      return;
    }
  
    // Get the current date and time
    const sessionDate = new Date().toISOString();
  
    // Create an object mapping each track ID to its color array
    const sessionData = {};
    tracks.forEach(track => {
      sessionData[track.id] = track.colors;
    });
  
    // Create the JSON object to save
    const session = {
      session_name: sessionName,
      session_date: sessionDate,
      session_data: sessionData
    };
  
    // Save the session to the database
    const { data, error } = await supabase
      .from('sessions')
      .insert([session]);
  
    if (error) {
      console.error("Error saving session:", error);
      alert("Failed to save session.");
    } else {
      console.log("Session saved successfully:", data);
      alert("Session saved successfully.");
    }
  }

  /** Fetch existing sessions from the database, parse through the session_data objects
   * to display the session name, date, and track color arrays in a list
   */
  async function viewSessions() {
    // Fetch existing sessions from the database
    const { data, error } = await supabase
      .from('sessions')
      .select('*');

    if (error) {
      console.error("Error fetching sessions:", error);
      alert("Failed to fetch sessions.");
      return;
    }

    // Parse through the session_data which is {1: ['#fff', '#000']} etc.
    // Create Track object, which has: key, title, colors
    // key = id/key of object
    // title = tracks[id]
    // colors = session_data[id]
    data.map(session => {
      let sessionInstance = {}
      let sessionTracks = [];
      Object.keys(session.session_data).map(trackId => {
        let sessionTrackData = {};
        // Create new Track object (this should really be a TypeScript class)
        sessionTrackData.id = trackId;
        sessionTrackData.title = tracks.filter(track => track.id == trackId)[0].title;
        sessionTrackData.colors = session.session_data[trackId];
        // Store new Track object in a sessionTracks array with trackId as key
        sessionTracks.push(sessionTrackData);
      });
      sessionInstance.id = session.id;
      sessionInstance.name = session.session_name;
      sessionInstance.date = session.session_date;
      sessionInstance.tracks = sessionTracks;
      // Push sessionInstance to array of session objects held in state
      setSessions([...sessions, sessionInstance]);
    });
  }


  return (
    <div className="Universe Palettes" id="enter">
      <h1>🎨 palettes</h1>
      <div className="allPalettes">
        {Object.keys(tracks).map((key, index) => {
          return(
            <TrackPalette key={`main-${key}-${index}`} colorKey={"main" + key} track={tracks[key]} />
          );
        })}
      </div>
      <button onClick={() => saveSession()}>save</button>
      <button onClick={() => navigate("/synthesia/color")}>restart</button>
      <hr />
      {
        (process.env.NODE_ENV == 'development') ?
          (
            <div className="devTools" style={{"display": "flex", "flexDirection": "column", "width": "25%", "margin": "0 auto"}}>
              <button onClick={() => setShowDevTools(!showDevTools)}>dev tools</button>
              <hr />
              {(showDevTools) ? 
                  (<>
                    <button onClick={() => clearColors()}>clear colors</button>
                    <hr />
                    <button onClick={initialPopulate}>populate</button>
                    <hr />
                    <button onClick={() => viewSessions()}>view sessions</button>
                  </>) 
                : (<></>)
              }
              </div>
          ) : (<></>)
      }
      <div id="sessionsContainer">
        {
          sessions.map(session => {
            console.log("TRYING to return session", session);
            return(
              <div className="session" key={`session-${session.id}`}>
                <h3>{session.name}</h3>
                <p>{session.date}</p>
                <div className="sessionData allPalettes">
                  {Object.keys(session.tracks).map((key, index) => {
                    return(
                      <TrackPalette key={`session-track-${key}-${index}`} colorKey={`track-${key}-${index}`} track={session.tracks[key]} />
                    );
                  })}
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default Palettes;
