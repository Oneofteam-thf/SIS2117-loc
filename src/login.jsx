import React from 'react'
import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useState } from 'react';
import { pb } from 'shared/api';
import { useAuth } from 'useAuth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {

  const {user} = useAuth()

  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля.');
      setLoading(false);
      return;
    }

    try {
      // Simulate an API call
      await pb.collection('_superusers').authWithPassword(email, password)
      .then(() => {
        navigate('/')
      })
    } catch (err) {
      setError('Ошибка входа. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const getRandomColor = () => {
    const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'indigo', 'pink', 'gray', 'teal', 'cyan', 'lime', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [buttonColor, setButtonColor] = useState(getRandomColor());

  React.useEffect(() => {
    setButtonColor(getRandomColor());
  }, []);

  React.useEffect(() => {
    if (user?.id) {
      navigate('/')
    }
  }, [user?.id])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Вход</h2>
        <form className="space-y-1" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Адрес электронной почты
            </label>
            <TextInput
              variant='filled'
              id="email"
              name="email"
              type="email"
              required
              className='mt-3'
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <PasswordInput
              variant='filled'
              id="password"
              name="password"
              required
              className='mt-3'
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          <div className='mt-5'>
            <Button fullWidth variant="filled" color={buttonColor} type="submit" loading={loading}>
              Войти
            </Button>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};
