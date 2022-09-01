import closedImage from '../../assets/images/close.svg';
import deleteModalImage from '../../assets/images/delete-modal.svg';
import { Button } from '../Button';
import { database } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import './styles.scss'; 

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  roomId: string;
  questionId?: string;
  type: string;
}

function Modal({ isOpen, setIsOpen, roomId, questionId, type }: ModalProps) {
  const navigate = useNavigate();

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    closeModal();
    navigate('/');
  }

  async function handleDeleteQuestion() {
    closeModal();
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  }

  function closeModal() {
    setIsOpen(false);
  }

  const title_close = 'Encerrar sala';
  const subtitle_close = 'Tem certeza que você deseja encerrar esta sala?';
  const title_delete = 'Deletar pergunta';
  const subtitle_delete = 'Tem certeza que você deseja deletar esta pergunta?';

  return (
    <div className='modal-container'>
      <div className='modal'>
        <img src={type === 'close' ? closedImage : deleteModalImage} alt='Closed Room' />
        <h3>{type === 'close' ? title_close : title_delete}</h3>
        <span>{type === 'close' ? subtitle_close : subtitle_delete}</span>
        <div className='buttons'>
          <Button isOutlined isLogout onClick={closeModal}>
            Cancelar
          </Button>
          <Button isOutlined isDanger onClick={type === 'close' ? handleCloseRoom : handleDeleteQuestion}>
            {type === 'close' ? 'Sim, encerrar' : 'Sim deletar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Modal };