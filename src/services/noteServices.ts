// src/services/noteService.ts
import { api } from './api';
import type { Note, CreateNotePayload, UpdateNotePayload } from '@/types/topicTypes';

export const noteService = {
    async getNotes(topicId: string, passphrase?: string): Promise<Note[]> {
        const response = await api.get<Note[]>(`/topics/${topicId}/notes`, {
            headers: passphrase ? { 'x-note-passphrase': passphrase } : {},
        });
        return response.data ?? [];
    },

    async createNote(topicId: string, payload: CreateNotePayload, passphrase?: string): Promise<Note> {
        const response = await api.post<Note>(`/topics/${topicId}/notes`, payload, {
            headers: passphrase ? { 'x-note-passphrase': passphrase } : {},
        });
        return response.data;
    },

    async updateNote(noteId: string, payload: UpdateNotePayload, passphrase?: string): Promise<Note> {
        const response = await api.put<Note>(`/topics/notes/${noteId}`, payload, {
            headers: passphrase ? { 'x-note-passphrase': passphrase } : {},
        });
        return response.data;
    },

    async deleteNote(noteId: string): Promise<void> {
        await api.delete(`/topics/notes/${noteId}`);
    },

    async upvote(noteId: string): Promise<Note> {
        const response = await api.post<Note>(`/topics/notes/${noteId}/upvote`);
        return response.data;
    },

    async removeUpvote(noteId: string): Promise<Note> {
        const response = await api.delete<Note>(`/topics/notes/${noteId}/upvote`);
        return response.data;
    },

    async downvote(noteId: string): Promise<Note> {
        const response = await api.post<Note>(`/topics/notes/${noteId}/downvote`);
        return response.data;
    },

    async removeDownvote(noteId: string): Promise<Note> {
        const response = await api.delete<Note>(`/topics/notes/${noteId}/downvote`);
        return response.data;
    },

    async addReaction(noteId: string, emoji: string): Promise<Note> {
        const response = await api.post<Note>(`/topics/notes/${noteId}/reactions`, { emoji });
        return response.data;
    },

    async removeReaction(noteId: string, emoji: string): Promise<Note> {
        const response = await api.delete<Note>(`/topics/notes/${noteId}/reactions/${encodeURIComponent(emoji)}`);
        return response.data;
    },

    async pinNote(noteId: string): Promise<Note> {
        const response = await api.post<Note>(`/topics/notes/${noteId}/pin`);
        return response.data;
    },

    async unpinNote(noteId: string): Promise<Note> {
        const response = await api.delete<Note>(`/topics/notes/${noteId}/pin`);
        return response.data;
    },
};