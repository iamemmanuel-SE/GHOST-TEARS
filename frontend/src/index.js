import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { CatContextProvider } from './context/CategoryContext';
import { KeyBoardProvider } from './context/KeyboardActivation';
import { RoomNameProvider } from './context/RoomNameContext';
import { KeySocketProvider } from './context/KeySocketContext';
import { GameOverProvider } from './context/GameOverContext';
// import 'bootstrap/dist/css/bootstrap.min.css';





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <GameOverProvider>
      <KeySocketProvider>
        <RoomNameProvider>
          <KeyBoardProvider>
            <CatContextProvider>
              <AuthContextProvider>
                  <App />
              </AuthContextProvider>
            </CatContextProvider>
          </KeyBoardProvider>
        </RoomNameProvider> 
      </KeySocketProvider>
    </GameOverProvider>

  </React.StrictMode>
);
