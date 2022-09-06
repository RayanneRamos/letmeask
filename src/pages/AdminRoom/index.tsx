import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logoImage from '../../assets/images/logo.svg';
import deleteImage from '../../assets/images/delete.svg';
import checkImage from '../../assets/images/check.svg';
import answerImage from '../../assets/images/answer.svg';
import logoDarkImage from '../../assets/images/logo-dark.svg';
import { Button } from '../../components/Button';
import { CardQuestion } from '../../components/CardQuestion';
import { RoomCode } from '../../components/RoomCode';
import { Toggle } from '../../components/Toggle';
import { Modal } from '../../components/Modal';
import { EmptyQuestion } from '../../components/EmptyQuestion';
import '../../components/CardQuestion/styles.scss';
import { useRoom } from '../../hooks/useRoom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import './styles.scss';

type RoomParams = {
  id: string;
}

function AdminRoom() {
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const roomId = params.id as string;
  const { title, questions, dataRoom } = useRoom(roomId);
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const questionsQuantity = questions.length;
  const [ isOpen, setIsOpen ] = useState(false);
  const [ questionIdModal, setQuestionIdModal ] = useState('');
  const [ typeModal, setTypeModal ] = useState('');

  function userIsLogged() {
    if(!user) {
      toast.error('Você deve estar logado!');
      return;
    }

    return true;
  }

  async function userOwnsTheRoom() {
    const authorIdRoom = dataRoom?.authorId;

    if(user?.id === authorIdRoom) {
      return true;
    }

    toast.error('Você não pode executar está ação');
    return;
  }

  async function closedRoom() {
    if(await userOwnsTheRoom()) {
      if(dataRoom?.endedAt) {
        toast.error('Está sala já está fechada!');
        return;
      } else {
        setTypeModal('close');
        setIsOpen(true);
      }
    } 
  }

  async function handleDeleteQuestion(questionId: string) {
    if(userIsLogged()) {
      if(await userOwnsTheRoom()) {
        setQuestionIdModal(questionId);
        setTypeModal('delete');
        setIsOpen(true);
      }
    }
  }

  async function handleCheckQuestionAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true,
    });
  }

  async function handleLogOut() {
    await signOut();
    navigate('/');
  }

  return (
    <>
      { isOpen && (
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          roomId={roomId}
          questionId={questionIdModal}
          type={typeModal}
        />
      ) }
      <div id='page-admin' className={theme}>
        <header className={theme}>
          <div className='content'>
            <Link to='/'><img src={theme === 'light' ? logoImage : logoDarkImage} alt='Letmeask' /></Link>
            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={closedRoom}>Encerrar sala</Button>
              { user && <Button
                isOutlined
                isLogout
                onClick={handleLogOut}
                disabled={!user}
              >
                Sair
              </Button> }
              <Toggle />
            </div>
          </div>
          <Toaster toastOptions={{ duration: 2100 }} />
        </header>
        <main>
          <div className={`room-title ${theme}`}>
            <h1>Sala: {title}</h1>
            { questionsQuantity > 0 && (
              <span>
                { questionsQuantity}{' '}
                { questionsQuantity > 1 ? 'perguntas' : 'pergunta' }
              </span>
            ) }
          </div>
          <div className='question-list'>
            { questionsQuantity > 0 ? (
                questions.map(question => {
                  return (
                    <CardQuestion
                      key={question.id}
                      content={question.content}
                      author={question.author}
                      isAnswered={question.isAnswered}
                      isHighLighted={question.isHighLighted}
                    >
                      { !question.isAnswered && (
                        <>
                          <button
                            type='button'
                            onClick={() => handleCheckQuestionAnswered(question.id)}
                          >
                            <img src={checkImage} alt='Marcar pergunta como respondida' />
                          </button>
                          <button
                            type='button'
                            onClick={() => handleHighlightQuestion(question.id)}
                          >
                            <img src={answerImage} alt='Dar destaque à pergunta' />
                          </button>
                        </>
                      )}
                      <button
                        type='button'
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <img src={deleteImage} alt='Remover pergunta' />
                      </button>
                    </CardQuestion>
                  );
                })
            ) : (
              <div className='wait-question'>
                <EmptyQuestion />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export { AdminRoom };