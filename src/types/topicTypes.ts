// src/types/topicTypes.ts
export interface Vote {
  user_id: string;
  created_at: string;
}

export interface Reaction {
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface Note {
  id: string;
  topic_id: string;
  title: string;
  description?: string;
  pinned: boolean;
  up_votes: Vote[];
  down_votes: Vote[];
  reactions: Reaction[];
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface TopicMember {
  id: string;
  username: string;
  public_id: string;
  role?: 'read' | 'write';
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  owner_id: string;
  visibility: 'public' | 'private';
  encryption_mode?: 'server' | 'passphrase';
  categories?: string[];
  created_at: string;
  updated_at: string;
  archived_at?: string;
}

export interface TopicDetail extends Topic {
  members: TopicMember[];
  notes: Note[];
}

export interface TopicStats {
  total_notes: number;
  total_up_votes: number;
  total_down_votes: number;
  total_members: number;
  last_activity_at: string | null;
}

export interface ActivityEvent {
  id: string;
  topic_id: string;
  user_id: string;
  username: string;
  action: 'note_created' | 'note_updated' | 'note_deleted' | 'member_added' | 'member_removed' | 'role_changed' | 'topic_updated' | 'topic_archived' | 'topic_restored';
  metadata: Record<string, string>;
  created_at: string;
}

export interface CreateTopicPayload {
  title: string;
  description?: string;
  visibility?: 'public' | 'private';
  encryptionMode?: 'server' | 'passphrase';
  categories?: string[];
}

export interface CreateNotePayload {
  title: string;
  description?: string;
  expiresAt?: string | null;
}

export interface UpdateNotePayload {
  title: string;
  description?: string;
  expiresAt?: string | null;
}

export interface PaginatedTopics {
  data: Topic[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}