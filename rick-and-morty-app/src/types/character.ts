export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface ResourceRef {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: ResourceRef;
  location: ResourceRef;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterListResponse {
  info: Info;
  results: Character[];
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
}

export interface CharacterFilters {
  name: string;
  status: string;
  type: string;
  gender: string;
}

export interface EpisodeListResponse {
  info: Info;
  results: Episode[];
}