import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import illustrationImage from '../../assets/images/illustration.svg';
import logoImage from '../../assets/images/logo.svg';
import logoDarkImage from '../../assets/images/logo-dark.svg';
import { Button } from '../../components/Button';
import { Toggle } from '../../components/Toggle';
import { database } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import '../../styles/auth.scss';

function NewRoom() {
  const { user } = useAuth();
  const [ newRoom, setNewRoom ] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if(newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    navigate(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id='page-auth' className={theme}>
      <aside>
        <img src={illustrationImage} alt='Ilustração simbolizando perguntas e respostas' />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <div className='toggle'>
            <Toggle />
          </div>
          <img src={theme === 'light' ? logoImage : logoDarkImage} alt='Letmeask' />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type='text'
              placeholder='Nome da sala'
              value={newRoom}
              onChange={(event) => setNewRoom(event.target.value)}
            />
            <Button type='submit'>Criar sala</Button>
          </form>
          <p>Quer entrar em uma sala existente?<Link to='/'>cliquei aqui</Link></p>
        </div>
      </main>
    </div>
  );
}

export { NewRoom };