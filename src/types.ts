export type AnimeResponse = {
  top: Anime[]
}

export type Anime = {
  "mal_id": number,
  "rank": number,
  "title": string,
  "url": string,
  "image_url": string,
  "type": string,
  "episodes": number,
  "start_date": string,
  "end_date": string,
  "members": number,
  "score": number,
}

export type SortType = 'score' | 'type' | 'members' | 'title' | "";