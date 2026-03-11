// src/types/topicTypes.ts
export interface Vote {
  user_id: string;
  created_at: string;
}

export interface Note {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  up_votes: Vote[];
  down_votes: Vote[];
  created_at: string;
  updated_at: string;
}

export interface TopicMember {
  id: string;
  username: string;
  public_id: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  visibility: 'public' | 'private';
  encryption_mode: 'server' | 'passphrase';
  created_at: string;
  updated_at: string;
}

export interface TopicDetail extends Topic {
  members: TopicMember[];
  notes: Note[];
}

export interface CreateTopicPayload {
  title: string;
  description?: string;
  visibility?: 'public' | 'private';
  encryptionMode?: 'server' | 'passphrase';
}

export interface CreateNotePayload {
  title: string;
  description?: string;
}

export interface UpdateNotePayload {
  title: string;
  description?: string;
}