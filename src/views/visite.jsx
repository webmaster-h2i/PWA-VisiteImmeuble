import React from 'react';
import SelectImmeuble from '../components/selectImmeuble';

export default function Visite() {
  return (
    <div className="h-screen flex items-center">
      <div className="m-auto">
        <div className="flex">
            <SelectImmeuble></SelectImmeuble>
        </div>
      </div>
    </div>
  );
}