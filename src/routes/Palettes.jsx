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
const ColorBlock = ({hex, colorKey}) => {
  return (
    <div className="PaletteDisplay">
      <div className="ColorBlockSide" style={{background: hex}} key={colorKey}>
        <span></span>
      </div>
    </div>
  )
}

/**
 * Displays the colors for a given track, sorted by rgba
 */
const TrackPalette = ({track, colorKey}) => {
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
  console.log(sortedColors);

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
        {track.colors.map(hex => {
          return(
            <ColorBlock hex={hex} colorKey={colorKey+hex} key={colorKey+hex} />
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
  const [showDevTools, setShowDevTools] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTracks().then(tracks => {
      console.log('FOUND: ');
      console.log(tracks);
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
    const { data } = await supabase.from("tracks").select().order('track_order');
    console.log("getting tracks...:");
    console.log(data);
    setTracks(data);
    return data;
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

  async function initialPopulate() {
    try {
      const tracksInit = {
        1: {"title": "waxxx", "colors": ["#ffffff"], "link": S3_URL.concat("waxxx.mp3")}, 
        2: {"title": "pecans", "colors": ["#ffffff"], "link": S3_URL.concat("pecans.mp3")},
        3: {"title": "thunda", "colors": ["#ffffff"], "link": S3_URL.concat("thunda.mp3")}
      }
      await AsyncStorage.setItem('tracks', JSON.stringify(tracksInit));
      console.log('added');
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
      console.log("updated...");
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


  return (
    <div className="Universe Palettes" id="enter">
      <h1>🎨 palettes</h1>
      <div className="allPalettes">
        {Object.keys(tracks).map(key => {
          return(
            <TrackPalette key={"track"+key} track={tracks[key]} colorKey={"track"+key} />
          );
        })}
      </div>
      <button onClick={() => navigate("/synthesia/color")}>restart</button>
      <hr />
      {
          (process.env.NODE_ENV == 'development') ?
            (
              <div className="devTools" style={{"display": "flex", "flex-direction": "column", "width": "25%", "margin": "0 auto"}}>
                <button onClick={() => setShowDevTools(!showDevTools)}>dev tools</button>
                <hr />
                {(showDevTools) ? 
                    (<>
                      <button onClick={() => clearColors()}>clear colors</button>
                      <hr />
                      <button onClick={initialPopulate}>populate</button>
                    </>) 
                  : (<></>)
                }
                </div>
            ) : (<></>)
        }
    </div>
  );
};

export default Palettes;
