export type BodyType = "star" | "planet";

export interface CelestialStats {
  /** Equatorial diameter in kilometers. */
  diameter: number;
  /** Mass in kilograms (scientific notation preserved via number). */
  mass: number;
  /** Mean distance from the Sun in kilometers (0 for the Sun itself). */
  distanceFromSun: number;
  /** Length of a sidereal day in Earth hours. */
  dayLength: number;
  /** Length of a year in Earth days. */
  yearLength: number;
  /** Mean surface (or photosphere) temperature in Celsius. */
  avgTemperature: number;
  /** Number of natural satellites. */
  moons: number;
}

export interface CelestialBody {
  id: string;
  name: string;
  englishName: string;
  type: BodyType;
  color: string;
  /** Render radius used in the simplified scene. */
  radius: number;
  /** More physically realistic render radius (still scaled, but relative sizes are truer). */
  realisticRadius: number;
  /** Orbit radius used in the simplified scene (0 for the Sun). */
  orbitRadius: number;
  /** Orbit radius used in the realistic scene. */
  realisticOrbitRadius: number;
  /** Angular orbital speed (radians per second at 1x time scale). */
  orbitSpeed: number;
  /** Self-rotation speed (radians per second). */
  rotationSpeed: number;
  /** Axial tilt in degrees. */
  axialTilt: number;
  /** Short hero-style description. */
  description: string;
  /** Bullet-point facts. */
  facts: string[];
  stats: CelestialStats;
  /** Optional equirectangular texture URL. Falls back to procedural material when missing. */
  textureUrl?: string;
  /** Optional ring configuration (e.g. Saturn). */
  ring?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
  };
  /** Optional ring texture URL (used when `ring` is defined). */
  ringTextureUrl?: string;
  /** Optional emissive intensity boost (used for the Sun). */
  emissiveIntensity?: number;
}

export interface ArchitecturalLandmark {
  id: string;
  name: string;
  country: string;
  city: string;
  year: string;
  description: string;
  interestingFact: string;
  image: string;
  latitude: number;
  longitude: number;
}

export interface ApodResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  url: string;
  media_type: "image" | "video";
  title: string;
  copyright?: string;
}

export interface EpicImage {
  identifier: string;
  caption: string;
  image: string;
  date: string;
  imageUrl: string;
}

export interface MarsRoverPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  rover: { name: string };
  camera: { full_name: string; name: string };
}

export interface NasaSearchItem {
  nasa_id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  date_created?: string;
}

export interface DonkiFlare {
  flrID: string;
  beginTime: string;
  peakTime?: string;
  endTime?: string;
  classType?: string;
  sourceLocation?: string;
  link?: string;
}

export type ScaleMode = "simplified" | "realistic";
export type Language = "ru" | "en";
