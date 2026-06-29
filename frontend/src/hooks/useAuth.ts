/** 인증 스토어 셀렉터 훅 */
import { useAuthStore } from '../store/authStore';

export const useAuth = () => useAuthStore();
