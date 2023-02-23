import React from 'react';
import LoginForm from '../components/loginForm';

export default function Home() {
  return (
    <div className="h-screen flex items-center">
      <div className="m-auto">
        <div className="flex justify-center pb-9">
          <h1 className="text-white md:text-4xl text-3xl">Visite d'immeuble .NET</h1>
        </div>
        <LoginForm></LoginForm>
      </div>
    </div>
  );
}