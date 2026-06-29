/** 관계(Relation) 상태 스토어 — 설계서 v2.0 3.2 / 4.3 */
import { create } from 'zustand';
import { relationApi } from '../api/relation';
import type { InviteCode, Relation } from '../types';

interface RelationState {
  relations: Relation[];
  /** 활성 커플 관계 */
  couple: Relation | null;
  loading: boolean;
  fetchAll: () => Promise<void>;
  createInvite: () => Promise<InviteCode>;
  connectCouple: (code: string) => Promise<void>;
  end: (id: number) => Promise<void>;
}

const findActiveCouple = (relations: Relation[]) =>
  relations.find((r) => r.relationType === 'COUPLE' && r.status === 'ACTIVE') ?? null;

export const useRelationStore = create<RelationState>((set, get) => ({
  relations: [],
  couple: null,
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const relations = await relationApi.list();
      set({ relations, couple: findActiveCouple(relations) });
    } finally {
      set({ loading: false });
    }
  },

  createInvite: async () => relationApi.createCoupleInvite(),

  connectCouple: async (code) => {
    await relationApi.connectCouple(code);
    await get().fetchAll();
  },

  end: async (id) => {
    await relationApi.end(id);
    await get().fetchAll();
  },
}));
