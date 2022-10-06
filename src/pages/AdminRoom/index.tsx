import { useState, useEffect, useRef, FormEvent, Fragment, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
import { Stats } from '../../components/Stats';
import { useStateRoom } from '../../hooks/useStateRoom';
import { Answer } from '../../components/Answer';
import { delay } from '../../utils/delay';
import { FiMessageSquare, FiCornerDownRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { fadeInUp, stagger } from '../../styles/animation';
import likeImage from '../../assets/images/like.svg';

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
  const { showToast, Toaster } = useToast();
  const state = useStateRoom(roomId);
  const [ answer, setAnswer ] = useState<string>();
  const [ showAnswerQuestion, setShowAnswerQuestion ] = useState<string | undefined>();
  const textareaAnswerRef = useRef<HTMLTextAreaElement>(null);
  const [ showInputError, setShowInputError ] = useState<boolean>(false);

  useEffect(() => {
    if(state) {
      navigate('/');
    }
  }, [ navigate, roomId, state ]);

  function userIsLogged() {
    if(!user) {
      showToast('⚠️', 'Você deve estar logado!');
      return;
    }

    return true;
  }

  async function userOwnsTheRoom() {
    const authorIdRoom = dataRoom?.authorId;

    if(user?.id === authorIdRoom) {
      return true;
    }

    showToast('🔴', 'Você não pode executar está ação');
    return;
  }

  async function handleEndRoom () {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
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

  async function handleShowAnswerInput(questionId: string, isHighLighted: boolean) {
    setShowAnswerQuestion((oldState) => (!oldState ? questionId : undefined));
    setAnswer(undefined);

    if(!isHighLighted) {
      await delay();
      textareaAnswerRef.current?.focus();
    }

    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: !isHighLighted,
    });
  }

  const handleAnswerQuestion = useCallback(
    async (event: FormEvent, questionId: string) => {
      event.preventDefault();

      if(!answer || answer.trim() === '') {
        showToast('⚠️', 'Insira uma pergunta');
        setShowInputError(true);
        return;
      } 

      setShowAnswerQuestion(undefined);

      await database.ref(`rooms/${roomId}/questions/${questionId}/answers`).push({
        content: answer,
        author: {
          avatar: user?.avatar,
          name: user?.name,
        },
      });

      showToast('✅', 'Resposta enviada!');

      await handleCheckQuestionAnswered(questionId);
    },
    [handleCheckQuestionAnswered]
  );

  function getAllLikes() {
    const allLikeQuestions = questions.reduce((somaLikes, question) => {
      return somaLikes + question.likeCount;
    }, 0)

    return allLikeQuestions;
  }

  function getAllAnsweredQuestions() {
    const allAnsweredQuestions = questions.reduce((somaAnswered, question) => {
      if(question.isAnswered) {
        somaAnswered++;
      }

      return somaAnswered;
    }, 0);

    return allAnsweredQuestions;
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
      <motion.div 
        id='page-admin' 
        className={theme}
        variants={stagger}
        initial='initial'
        animate='animate'
        exit={{ opacity: 0 }}
      >
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
        <motion.main variants={fadeInUp}>
          <div className={`room-title ${theme}`}>
            <h1>Sala: {title}</h1>
            { questionsQuantity > 0 && (
              <span>
                { questionsQuantity}{' '}
                { questionsQuantity > 1 ? 'perguntas' : 'pergunta' }
              </span>
            ) }
          </div>   
          <div className='all-stats'>
            <Stats text='Respondida(s)' firstStats={getAllAnsweredQuestions()} borderColor='#835afd' />
            <Stats text='Likes' secondStats={getAllLikes()} borderColor='#e559f9' />    
          </div>   
          <div className='question-list'>
            { questionsQuantity > 0 ? (
              <div className='question-and-answer-list'>
                { questions.map((question) => (
                  <>
                    <div className='question-container'>
                      <CardQuestion
                        key={question.id}
                        content={question.content}
                        author={question.author}
                        isAnswered={question.isAnswered}
                        isHighLighted={question.isHighLighted}
                        createdAt={question.createdAt}
                      >
                        <button type='button' aria-label='likes'>
                          { question.likeCount > 0 && <span>{question.likeCount}</span> }
                          <img src={likeImage} alt='Likes' />
                        </button>
                        { !question.isAnswered && (
                          <>
                            <motion.button
                              type='button'
                              onClick={() => handleShowAnswerInput(question.id, question.isHighLighted)}
                              className='answer-button'
                              whileTap={{
                                scale: 1.1,
                              }}
                            >
                              <FiMessageSquare size={24} />
                            </motion.button>
                            <motion.button
                              type='button'
                              onClick={() => handleCheckQuestionAnswered(question.id)}
                              whileTap={{
                                scale: 1.1,
                              }}
                            >
                              <img src={checkImage} alt='Marcar pergunta como respondida' />
                            </motion.button>
                            <motion.button
                              type='button'
                              onClick={() => handleHighlightQuestion(question.id)}
                              whileTap={{
                                scale: 1.1,
                              }}
                            >
                              <img src={answerImage} alt='Dar destaque à pergunta' />
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          type='button'
                          onClick={() => handleDeleteQuestion(question.id)}
                          whileTap={{
                            scale: 1.1,
                          }}
                        >
                          <img src={deleteImage} alt='Remover pergunta' />
                        </motion.button>
                      </CardQuestion>
                    </div>
                    { showAnswerQuestion === question.id && (
                      <motion.form
                        onSubmit={(event: FormEvent) => handleAnswerQuestion(event, question.id)}
                        className='answer-container-input'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <FiCornerDownRight size={24} color='#e559f9' />
                        <div>
                          <textarea 
                            ref={textareaAnswerRef}
                            value={answer ?? ''}
                            onChange={(value) => {
                              setShowInputError(false);
                              setAnswer(value.target.value);
                            }}
                            style={
                              showInputError ? { boxShadow: `0 2px 12px rgba(215, 55, 84 ,0.5)` } : {}
                            }
                          />
                          <Button>Responder</Button>
                        </div>
                      </motion.form>
                    )}
                    { question.answers.map((v) => (
                      <motion.div 
                        className='answer-containaer'
                        key={v.content}  
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Answer author={v.author} content={v.content} />
                      </motion.div>
                    )) }
                  </>
                )) }
              </div>    
            ) : (
              <div className='wait-question'>
                <EmptyQuestion />
              </div>
            )}
          </div>
        </motion.main>
      </motion.div>
    </>
  );
}

export { AdminRoom };