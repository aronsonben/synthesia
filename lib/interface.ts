export interface Todo {
  id: number;
  user_id: string;
  task: string;
  is_complete: boolean;
  inserted_at: Date;
}

export interface Note {
  id: number;
  user_id: string;
  title: string;
  inserted_at: Date;
}

export interface Track {
  id: number;
  user_id: string;
  title: string;
  link: string;
  colors: string[];
  track_order: number;
  inserted_at: Date;
}