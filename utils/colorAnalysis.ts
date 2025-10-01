// utils/colorAnalysis.ts (new file)
import chroma from 'chroma-js';
import { ColorAnalysisResult, TrackWithAnalysis } from '@/lib/interface';

// This Map stores results in memory
const analysisCache = new Map<string, ColorAnalysisResult>();

export const analyzeTrackColors = (title: string, colors: string[]): ColorAnalysisResult => {
  // Create unique identifier for this color combination
  const cacheKey = colors.join(','); // e.g., "#ff0000,#00ff00,#0000ff"
  
  // Check if we've already analyzed these exact colors
  if (analysisCache.has(cacheKey)) {
    console.log('Cache hit! Returning stored result');
    return analysisCache.get(cacheKey)!; // Return instantly
  }

  // Ignore white as it is most often a test color or mistake
  console.log('Performing analysis for: ', title);
  const colorsNoWhite = colors.filter((c) => (c.toLocaleLowerCase() !== '#ffffff'));

  // If no colors left after filtering, return default
  if (colorsNoWhite.length === 0) {
    console.log('All colors were white, returning default analysis.');
    return {
      averageHue: 0,
      averageSaturation: 0,
      averageLightness: 1
    };
  }
  
  // Only do expensive calculation if we haven't seen these colors before
  console.log('Cache miss. Calculating...');
  const result = performColorAnalysis(colorsNoWhite);
  
  // Store result for next time
  analysisCache.set(cacheKey, result);
  console.log("Cache result saved.");
  return result;
};


const performColorAnalysis = (colors: string[]): ColorAnalysisResult => {
  // All your color analysis logic here
  // LAB conversions, Delta E calculations, etc.
  var hues: number[] = [];
  var sats: number[] = [];
  var lights: number[] = [];
  colors.map((hex) => {
    // console.log(hex);
    const hsl = chroma(hex).hsl();
    // console.log(hsl);
    // Account for NaN value if color is white, black, or a gray
    if(hsl[0]) { hues.push(hsl[0]); }
    sats.push(hsl[1]);
    lights.push(hsl[2]);
  })
  const avgHue = (hues.reduce((prev: number, cur: number) => (prev + cur))) / hues.length;
  console.log("Avg Hue:", avgHue);
  const avgSat = (sats.reduce((prev: number, cur: number) => (prev + cur))) / hues.length;
  console.log("Avg Sat:", avgSat);
  const avgLight = (lights.reduce((prev: number, cur: number) => (prev + cur))) / hues.length;
  console.log("Avg Sat:", avgLight);
  return {
    averageHue: avgHue,
    averageSaturation: avgSat,
    averageLightness: avgLight
  }
};
