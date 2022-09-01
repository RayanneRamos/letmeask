import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import illustrationImage from '../../assets/images/illustration.svg';
import logoImage from '../../assets/images/logo.svg';
import googleIconImage from '../../assets/images/google-icon.svg';
import logoDarkImage from '../../assets/images/logo-dark.svg';
import githubIconImage from '../../assets/images/github-icon.png';
import { Button } from '../../components/Button';
import { Toggle } from '../../components/Toggle';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { database } from '../../services/firebase';
import '../../styles/auth.scss';

function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signInWithGithub } = useAuth();
  const [ roomCode, setRoomCode ] = useState('');
  const { theme } = useTheme();

  async function handleCreateRoomGoogle() {
    if(!user) {
      await signInWithGoogle();
    }

    navigate('/rooms/new');
  }

  async function handleCreateRoomGithub() {
    if(!user) {
      await signInWithGithub();
    }

    navigate('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if(roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    navigate(`/rooms/${roomCode}`);
  }

  return (
    <div id='page-auth' className={theme}>
      <aside>
        <img src={illustrationImage} alt='Ilustração simbolizando perguntas e respostas' />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <div className='toggle'>
            <Toggle />
          </div>
          <img src={theme === 'light' ? logoImage : logoDarkImage} alt='Letmeask' />
          <button className='create-room create-room-google' onClick={handleCreateRoomGoogle}>
            <img src={googleIconImage} alt='Logo do Google' />
            Crie sua sala com o Google
          </button>
          <button className='create-room create-room-github' onClick={handleCreateRoomGithub}>
            <img src={githubIconImage} alt='Logo do Github' />
            Crie sua sala com o Github
          </button>
          <div className='separator'>ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type='text'
              placeholder='Digite o código da sala'
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type='submit'>Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export { Home };