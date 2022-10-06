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
import { useToast } from '../../hooks/useToast';
import '../../styles/auth.scss';
import { motion } from 'framer-motion';
import { fadeInUp, stagger } from '../../styles/animation';

function NewRoom() {
  const { user } = useAuth();
  const [ newRoom, setNewRoom ] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { showToast, Toaster } = useToast();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if(newRoom.trim() === '') {
      showToast('⚠️', 'Nome da sala está vazio!');
      return;
    }

    if(!user) {
      showToast('⚠️', 'Você precisa estar logado para criar uma sala!');
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
      endedAt: null,
      createdAt: new Date().getTime(),
      author: {
        name: user?.name,
        avatar: user?.avatar,
        id: user?.id,
      },
      roomIsOpen: true,
    });

    showToast('✅', `Sala ${newRoom} criada com sucesso!`);

    navigate(`/admin/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id='page-auth' className={theme}>
      <aside>
        <motion.img 
          src={illustrationImage} 
          alt='Ilustração simbolizando perguntas e respostas' 
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <motion.main variants={fadeInUp}>
        <Toaster position='top-right' toastOptions={{ duration: 3000 }} />
        <div className='main-content'>
          <div className='toggle'>
            <Toggle />
          </div>
          <img src={theme === 'light' ? logoImage : logoDarkImage} alt='Letmeask' />
          { user && (
            <div className='info-user'>
              <img src={user?.avatar} alt={user?.name} />
            </div>
          ) }
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
          <p>Quer entrar em uma sala existente? <br /> ainda não possui uma conta? <Link to='/'>cliquei aqui</Link></p>
        </div>
      </motion.main>
    </div>
  );
}

export { NewRoom };