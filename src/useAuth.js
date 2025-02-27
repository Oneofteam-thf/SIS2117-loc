import React from 'react';
import PocketBase from 'pocketbase';
import { pb } from 'shared/api';

const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const authData = pb.authStore.model;
    if (authData) {
      setUser(authData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const authData = await pb.collection('_superusers').authWithPassword(email, password);
      setUser(authData);
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};

export { useAuth } 