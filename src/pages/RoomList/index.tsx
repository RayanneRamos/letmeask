import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/images/logo.svg';
import logoDarkImage from '../../assets/images/logo-dark.svg';
import emptyRoomImage from '../../assets/images/empty-room.svg';
import { Toggle } from '../../components/Toggle';
import { database } from '../../services/firebase';
import { useTheme } from '../../hooks/useTheme';
import './styles.scss';
import { useToast } from '../../hooks/useToast';
import { motion } from 'framer-motion';
import { fadeInUp, stagger } from '../../styles/animation';

type RoomTypeProps = {
  roomId: string;
  title: string;
  roomIsOpen?: boolean;
}[];

function RoomList() {
  const navigate = useNavigate();
  const [ rooms, setRooms ] = useState<RoomTypeProps>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const { theme } = useTheme();
  const { showToast, Toaster } = useToast();

  useEffect(() => {
    const dbRef = database.ref(`rooms`);
    dbRef.once('value', rooms => {
      const dbRoom: object = rooms.val() ?? {};
      const parsedRooms = Object.entries(dbRoom).map(([ key, value ]) => {
        return {
          roomId: key,
          title: value.title,
          roomIsOpen: value.roomIsOpen,
        }
      });

      setRooms(parsedRooms);
      setIsLoading(false);
    });
  }, []);

  function handleGoHomePage() {
    return navigate('/');
  }

  function handleGoToRoom(roomId: string, isOpen: boolean) {
    if(isOpen) {
      return navigate(`/roomList/rooms/${roomId}`);
    } else {
      return showToast('❌', 'A sala já fechou');
    }
  }

  return (
    <motion.div 
      id='page-room' 
      className={theme}
      variants={stagger}
      initial='initial'
      animate='animate'
      exit={{ opacity: 0 }}
    >
      <header>
        <div className='content'>
          <img src={theme === 'light' ? logoImage : logoDarkImage} alt='Letmeask' onClick={handleGoHomePage} />
          <div>
            <Toggle />
          </div>
        </div>
        <Toaster toastOptions={{ duration: 2100 }} />
      </header>
      <motion.main className='content' variants={fadeInUp}>
        <div className='question-list'>
          <div className='room-box-div'>
            { rooms.length !== 0 && isLoading === false ? 
              rooms.map((item: any) => {
                return (
                  <div 
                    className={`room-item-div ${item.roomIsOpen ? '' : 'closed'}`} 
                    onClick={() => handleGoToRoom(item.roomId, item?.roomIsOpen)} 
                    key={item.roomId}
                  >
                    {item.title}
                  </div>
                )
              }) : (
                <div className='empty-list'>
                  <h1>Não temos salas no momento</h1>
                  <img src={emptyRoomImage} alt='Empty Room' />
                </div>
              )
            }       
          </div>
        </div>
      </motion.main>
    </motion.div>
  );
}

export { RoomList };