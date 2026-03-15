// src/services/topicService.ts
import { api } from './api';
import type { Topic, TopicDetail, Note, CreateTopicPayload, CreateNotePayload, UpdateNotePayload, ActivityEvent, TopicStats, PaginatedTopics } from '@/types/topicTypes';

export const topicService = {
  async getAll(page = 1, limit = 16): Promise<PaginatedTopics> {
    const response = await api.get<PaginatedTopics>('/topics/', { params: { page, limit } });
    return response.data;
  },

  async getById(id: string): Promise<TopicDetail> {
    const response = await api.get<TopicDetail>(`/topics/${id}`);
    return response.data;
  },

  async create(payload: CreateTopicPayload, passphrase?: string): Promise<Topic> {
    const response = await api.post<Topic>('/topics/', payload, {
      headers: passphrase ? { 'x-note-passphrase': passphrase } : {},
    });
    return response.data;
  },

  async update(id: string, payload: CreateTopicPayload): Promise<Topic> {
    const response = await api.put<Topic>(`/topics/${id}`, payload);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/topics/${id}`);
  },

  async getNotes(topicId: string): Promise<Note[]> {
    const response = await api.get<Note[]>(`/topics/${topicId}/notes`);
    return response.data;
  },

  async createNote(topicId: string, payload: CreateNotePayload): Promise<Note> {
    const response = await api.post<Note>(`/topics/${topicId}/notes`, payload);
    return response.data;
  },

  async updateNote(noteId: string, payload: UpdateNotePayload): Promise<Note> {
    const response = await api.put<Note>(`/topics/notes/${noteId}`, payload);
    return response.data;
  },

  async deleteNote(noteId: string): Promise<void> {
    await api.delete(`/topics/notes/${noteId}`);
  },

  async addMember(topicId: string, publicId: string, role: 'read' | 'write'): Promise<void> {
    await api.post(`/topics/${topicId}/members`, { publicId, role });
  },

  async removeMember(topicId: string, memberId: string): Promise<void> {
    await api.delete(`/topics/${topicId}/members/${memberId}`);
  },

  async updateVisibility(topicId: string, visibility: 'public' | 'private', encryptionMode?: 'server' | 'passphrase', passphrase?: string): Promise<Topic> {
    const response = await api.put<Topic>(`/topics/${topicId}/visibility`, {
      visibility,
      encryption_mode: encryptionMode,
    }, {
      headers: passphrase ? { 'x-note-passphrase': passphrase } : {},
    });
    return response.data;
  },

  async updatePassphrase(topicId: string, currentPassphrase: string, newPassphrase: string): Promise<Topic> {
    const response = await api.put<Topic>(`/topics/${topicId}/passphrase`, {}, {
      headers: {
        'x-current-passphrase': currentPassphrase,
        'x-new-passphrase': newPassphrase,
      },
    });
    return response.data;
  },

  async getStats(topicId: string): Promise<TopicStats> {
    const response = await api.get<TopicStats>(`/topics/${topicId}/stats`);
    return response.data;
  },

  async getActivity(topicId: string): Promise<ActivityEvent[]> {
    const response = await api.get<ActivityEvent[]>(`/topics/${topicId}/activity`);
    return response.data ?? [];
  },

  async updateMemberRole(topicId: string, memberPublicId: string, role: 'read' | 'write'): Promise<void> {
    await api.patch(`/topics/${topicId}/members/${memberPublicId}`, { role });
  },

  async archive(topicId: string): Promise<void> {
    await api.post(`/topics/${topicId}/archive`);
  },

  async restore(topicId: string): Promise<void> {
    await api.post(`/topics/${topicId}/restore`);
  },

};