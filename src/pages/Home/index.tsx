import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import illustrationImage from '../../assets/images/illustration.svg';
import logoImage from '../../assets/images/logo.svg';
import googleIconImage from '../../assets/images/google-icon.svg';
import logoDarkImage from '../../assets/images/logo-dark.svg';
import githubIconImage from '../../assets/images/github-icon.png';
import loginImage from '../../assets/images/login.svg';
import { Button } from '../../components/Button';
import { Toggle } from '../../components/Toggle';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { database } from '../../services/firebase';
import '../../styles/auth.scss';
import { useToast } from '../../hooks/useToast';

function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signInWithGithub } = useAuth();
  const [ roomCode, setRoomCode ] = useState('');
  const { theme } = useTheme();
  const { showToast, Toaster } = useToast();

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
      showToast('⚠️', 'Campo está vazio!');
      return;
    }

    let roomCodeClean = roomCode.replace(window.location.href + 'rooms/', '');
    setRoomCode(roomCodeClean);

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      showToast('❌', 'Está sala não existe!');
      return;
    }

    if(roomRef.val().endedAt) {
      showToast('🔴', 'A sala está fechada.');
      return;
    }

    navigate(`/rooms/${roomCode}`);
  }

  function handleGoToRoomList() {
    navigate(`roomlist`);
    return;
  }

  return (
    <div id='page-auth' className={theme}>
      <aside>
        <img src={illustrationImage} alt='Ilustração simbolizando perguntas e respostas' />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
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
            <Button type='submit'>
              <img src={loginImage} alt='login' />
              Entrar na sala
            </Button>
            <Button onClick={handleGoToRoomList}>Lista de Salas</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export { Home };