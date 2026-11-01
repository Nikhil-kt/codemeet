'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth as firebaseAuth, isLiveFirebaseFrontend } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export interface AuthContextType {
  user: any;
  profile: any;
  role: 'VOLUNTEER' | 'ORGANIZATION' | 'ADMIN' | 'TEAM_LEADER' | null;
  session: any;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; role?: 'VOLUNTEER' | 'ORGANIZATION' | 'ADMIN' | 'TEAM_LEADER'; message?: string; emailNotConfirmed?: boolean }>;
  register: (payload: any) => Promise<{ success: boolean; message?: string; emailConfirmationRequired?: boolean }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (new_password: string) => Promise<{ success: boolean; message?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<'VOLUNTEER' | 'ORGANIZATION' | 'ADMIN' | 'TEAM_LEADER' | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('impactlink_token');
    localStorage.removeItem('impactlink_user');
    setUser(null);
    setRole(null);
    setProfile(null);
    setSession(null);
  }, []);

  const fetchBackendProfile = useCallback(async () => {
    const res = await api.me();
    if (res.success && res.data?.user) {
      const u = res.data.user;
      setUser(u);
      setRole(u.role);
      setProfile(u);
      localStorage.setItem('impactlink_user', JSON.stringify(u));
    } else {
      // Token is invalid on backend; clear session
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    // 1. Initial check: Verify stored session with backend
    const storedToken = localStorage.getItem('impactlink_token');
    const storedUser = localStorage.getItem('impactlink_user');

    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setRole(parsed.role);
        setProfile(parsed);
      } catch (e) {
        localStorage.removeItem('impactlink_user');
      }
    }

    // 2. Firebase Auth listener for real-time authentication state
    if (isLiveFirebaseFrontend()) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          try {
            const idToken = await fbUser.getIdToken();
            localStorage.setItem('impactlink_token', idToken);
            setSession({ user: fbUser, access_token: idToken });
            await fetchBackendProfile();
          } catch (e) {
            console.error('Error fetching backend profile for Firebase user:', e);
          }
        } else {
          // If no Firebase user and no backend token, clear session
          const activeToken = localStorage.getItem('impactlink_token');
          if (!activeToken) {
            clearSession();
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      if (storedToken) {
        fetchBackendProfile().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [fetchBackendProfile, clearSession]);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);

    // 1. Authenticate with Firebase if configured
    if (isLiveFirebaseFrontend()) {
      try {
        const userCred = await signInWithEmailAndPassword(firebaseAuth, credentials.email, credentials.password);
        const fbUser = userCred.user;
        const idToken = await fbUser.getIdToken();
        localStorage.setItem('impactlink_token', idToken);
        setSession({ user: fbUser, access_token: idToken });

        const meRes = await api.me();
        if (meRes.success && meRes.data?.user) {
          const u = meRes.data.user;
          setUser(u);
          setRole(u.role);
          setProfile(u);
          localStorage.setItem('impactlink_user', JSON.stringify(u));
          setLoading(false);
          return { success: true, role: u.role };
        }
      } catch (fbErr: any) {
        // Fall back to backend authentication (e.g. seeded accounts)
      }
    }

    // 2. Authenticate with Backend Gateway
    const res = await api.login(credentials);
    setLoading(false);

    if (res.success && res.data) {
      const u = res.data.user;
      setUser(u);
      setRole(u.role);
      setProfile(u);
      localStorage.setItem('impactlink_token', res.data.token);
      localStorage.setItem('impactlink_user', JSON.stringify(u));

      if (res.data.session) {
        setSession(res.data.session);
      }

      return { success: true, role: u.role };
    }

    return {
      success: false,
      message: res.message || 'Invalid email or password.',
      emailNotConfirmed: (res.data as any)?.emailNotConfirmed,
    };
  };

  const register = async (payload: any) => {
    setLoading(true);

    let authUserId: string | undefined;

    // 1. Create user in Firebase Auth
    if (isLiveFirebaseFrontend()) {
      try {
        const userCred = await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
        const fbUser = userCred.user;
        authUserId = fbUser.uid;

        try {
          await sendEmailVerification(fbUser);
        } catch (e) {}

        const idToken = await fbUser.getIdToken();
        localStorage.setItem('impactlink_token', idToken);
      } catch (fbErr: any) {
        if (fbErr.code === 'auth/email-already-in-use') {
          try {
            const userCred = await signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password);
            authUserId = userCred.user.uid;
            const idToken = await userCred.user.getIdToken();
            localStorage.setItem('impactlink_token', idToken);
          } catch (signInErr) {
            setLoading(false);
            return { success: false, message: 'This email is already registered. Please sign in.' };
          }
        } else {
          console.warn('[Firebase Auth] Registration notice:', fbErr.message);
        }
      }
    }

    // 2. Synchronize profile with backend
    const res = await api.register({
      ...payload,
      ...(authUserId ? { auth_user_id: authUserId } : {}),
    });
    setLoading(false);

    if (res.success && res.data) {
      const u = res.data.user;
      setUser(u);
      setRole(u.role);
      setProfile(u);
      if (res.data.token && !localStorage.getItem('impactlink_token')) {
        localStorage.setItem('impactlink_token', res.data.token);
      }
      localStorage.setItem('impactlink_user', JSON.stringify(u));

      return {
        success: true,
        message: res.data.message || 'Account successfully created.',
        emailConfirmationRequired: res.data.emailConfirmationRequired,
      };
    }

    return {
      success: false,
      message: res.message || 'Registration failed.',
    };
  };

  const forgotPassword = async (email: string) => {
    if (isLiveFirebaseFrontend()) {
      try {
        await sendPasswordResetEmail(firebaseAuth, email);
        return { success: true, message: `Password reset email dispatched to ${email}.` };
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to dispatch password reset email.' };
      }
    }
    return await api.forgotPassword(email);
  };

  const resetPassword = async (new_password: string) => {
    return await api.resetPassword(new_password);
  };

  const resendVerification = async (email: string) => {
    if (isLiveFirebaseFrontend() && firebaseAuth.currentUser) {
      try {
        await sendEmailVerification(firebaseAuth.currentUser);
        return { success: true, message: `Verification email resent to ${email}.` };
      } catch (e: any) {
        return { success: false, message: e.message || 'Failed to resend verification email.' };
      }
    }
    return await api.resendVerification(email);
  };

  const logout = async () => {
    if (isLiveFirebaseFrontend()) {
      try {
        await firebaseSignOut(firebaseAuth);
      } catch (e) {}
    }
    clearSession();
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        session,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        resendVerification,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
