// src/services/topicService.ts
import { api } from './api';
import type { Topic, TopicDetail, Note, CreateTopicPayload, CreateNotePayload, UpdateNotePayload } from '@/types/topicTypes';

export const topicService = {
  async getAll(): Promise<Topic[]> {
    const response = await api.get<Topic[]>('/topics/');
    return response.data ?? [];
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

  async addMember(topicId: string, publicId: string): Promise<void> {
    await api.post(`/topics/${topicId}/members`, { publicId });
  },

  async removeMember(topicId: string, memberId: string): Promise<void> {
    await api.delete(`/topics/${topicId}/members/${memberId}`);
  },

};