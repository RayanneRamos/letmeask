import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminRoom } from './pages/AdminRoom';
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';
import { NotFound } from './pages/NotFound';
import { RoomList } from './pages/RoomList';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms/new' element={<NewRoom />} />
          <Route path='/rooms/:id' element={<Room />} />
          <Route path='/admin/rooms/:id' element={<AdminRoom />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/roomList' element={<RoomList />} />
          <Route path='/roomList/rooms/:id' element={<Room />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
