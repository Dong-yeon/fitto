/** 관계(Relation) 상태 스토어 — 설계서 v2.0 3.2 / 4.3 */
import { create } from 'zustand';
import { relationApi } from '../api/relation';
import type { Relation } from '../types';

interface RelationState {
  relations: Relation[];
  /** 커플 관계 (활성) */
  couple: Relation | null;
  fetchAll: () => Promise<void>;
  connectCouple: (code: string) => Promise<void>;
  end: (id: number) => Promise<void>;
}

const findActiveCouple = (relations: Relation[]) =>
  relations.find((r) => r.relationType === 'COUPLE' && r.status === 'ACTIVE') ?? null;

export const useRelationStore = create<RelationState>((set, get) => ({
  relations: [],
  couple: null,

  fetchAll: async () => {
    const relations = await relationApi.list();
    set({ relations, couple: findActiveCouple(relations) });
  },

  connectCouple: async (code) => {
    await relationApi.connectCouple(code);
    await get().fetchAll();
  },

  end: async (id) => {
    await relationApi.end(id);
    await get().fetchAll();
  },
}));
