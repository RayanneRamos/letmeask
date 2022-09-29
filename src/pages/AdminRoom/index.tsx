import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
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
import { useToast } from '../../hooks/useToast';
import { useDistanceInWords } from '../../hooks/useDistanceInWords';
import roomClosedImage from '../../assets/images/room-closed.svg';

type RoomParams = {
  id: string;
}

type OrderType = 'OLDER' | 'LAST';

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: number;
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

function AdminRoom() {
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const roomId = params.id as string;
  const { title, questions, dataRoom, author, createdAt, endedAt } = useRoom(roomId);
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const questionsQuantity = questions.length;
  const [ isOpen, setIsOpen ] = useState(false);
  const [ questionIdModal, setQuestionIdModal ] = useState('');
  const [ typeModal, setTypeModal ] = useState('');
  const { showToast, Toaster } = useToast();
  const [ order, setOrder ] = useState<OrderType>('OLDER');
  const [ sortedQuestions, setSortedQuestions ] = useState<QuestionType[]>([]);
  const distanceInWords = useDistanceInWords();

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

  async function handleEndRoom () {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
      roomIsOpen: false
    })
    navigate('/');
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
    const currentQuestion = questions.filter(question => question.id === questionId);

    if(currentQuestion[0].isHighLighted) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighLighted: false,
      });
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighLighted: true,
      });
    }
  }

  const handleSortQuestion = useCallback(
    (    event: { target: { value: any; }; }) => {
      let orderNew = event.target.value;
      setOrder(orderNew);

      let newOrder = sortedQuestions.sort((a, b) => 
        order === 'OLDER' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
      );
      setSortedQuestions(newOrder);
    },
    [ sortedQuestions, order ]
  );

  useEffect(() => {
    let newOrder = questions.sort((a, b) => 
      order === 'LAST' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );
    setSortedQuestions(newOrder);
  }, [ questions, order ])

  async function handleLogOut() {
    await signOut();
    navigate('/');
  }

  useEffect(() => {
    if(!user) {
      navigate(`/rooms/${roomId}`)
      showToast('👀', `Ops você precisa está logado para acessar essa página`);
    }

    if(user && author) {
      if(user.id !== author.id) {
        navigate(`/rooms/${roomId}`)
        showToast('👀', `Ops somente admin pode acessar essa página`);
      }
    } 
  })

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
              <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
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
          <div className='room-header'>
            <div className={`room-title ${theme}`}>
              <div>
                <h1>Sala: {title}</h1>
                { questionsQuantity > 0 && (
                  <span>
                    { questionsQuantity}{' '}
                    { questionsQuantity > 1 ? 'perguntas' : 'pergunta' }
                  </span>
                ) }
              </div>
              <span>Iniciada há {distanceInWords(createdAt as number)}</span>
            </div>
            <div className='room-author'>
              <img src={author?.avatar} alt={author?.name} />
              <div>
                <span>@{author?.name}</span>
                <span>Proprietário</span>
              </div>                  
            </div>
          </div>
          { endedAt && (
            <div className='room-closed'>
              <img src={roomClosedImage} alt='Sala encerrada' />
              <p>Sala encerrada</p>
              <span>O bate papo dessa sala chegou ao fim, veja a baixo o que rolou</span>
            </div>
          )}
          <div className='wrapper-filters'>
            <p>Ver primeiro
              <select
                defaultValue={order}
                onChange={(event) => handleSortQuestion(event)}
              >
                <option value='LAST'>mais recentes</option>
                <option value='OLDER'>mais antigos</option>
              </select>
            </p>
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
                      createdAt={question.createdAt}
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