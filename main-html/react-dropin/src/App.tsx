import React from 'react';
import logo from './logo.svg';
import './App.css';
import ToggleButton from "./ToggleButton";
import DeleteAccountButton from "./DeleteAccountButton";
import {LocalStorageProvider} from "./LocalStorageContext"


function App() {
  return (
  <div className="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
    <div className="flex flex-col justify-end mx-8 py-8 items-center">
      <LocalStorageProvider>
        <ToggleButton></ToggleButton>
        <DeleteAccountButton></DeleteAccountButton>
      </LocalStorageProvider>

    </div>
  </div>
 );
}

export default App;
