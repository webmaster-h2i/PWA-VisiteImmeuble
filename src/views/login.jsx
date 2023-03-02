import React from 'react';
import LoginForm from '../components/loginForm';

export default function Login() {
  return (
    <div className="h-screen flex items-center">
      <div className="m-auto">
        <div className="flex justify-center pb-9">
          <h1 className="text-white text-3xl">Bienvenu sur NaviLite</h1>
        </div>
        <LoginForm></LoginForm>
      </div>
    </div>
  );
}