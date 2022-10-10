import React, { FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCornerDownRight } from 'react-icons/fi';
import logoImage from '../../assets/images/logo.svg';
import logoDarkImage from '../../assets/images/logo-dark.svg';
import { database } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';
import { useStateRoom } from '../../hooks/useStateRoom';
import { Button } from '../../components/Button';
import { CardQuestion } from '../../components/CardQuestion';
import { RoomCode } from '../../components/RoomCode';
import { Toggle } from '../../components/Toggle';
import { Loading } from '../../components/Loading';
import { Stats } from '../../components/Stats';
import { Answer } from '../../components/Answer';
import './styles.scss';
import '../../components/CardQuestion/styles.scss';
import { fadeInUp, stagger } from '../../styles/animation';

type RoomParams = {
  id: string;
}

function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id as string;
  const [ newQuestion, setNewQuestion ] = useState('');
  const { user, signInWithGoogle, signOut, signInWithGithub } = useAuth();
  const { title, questions, dataRoom } = useRoom(roomId);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const questionsQuantity = questions.length;
  const limitCaracterNewQuestion = 1000;
  const minCaracterNewQuestion = 20;
  const { showToast, Toaster } = useToast();
  const state = useStateRoom(roomId);

  useEffect(() => {
    if(state) {
      navigate('/');
    }
  }, [ [], navigate, roomId, state ]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if(dataRoom?.endedAt) {
      showToast('❌', 'Esta sala já está fechada!');
      return;
    }

    if(newQuestion.trim() === '') {
      showToast('⚠️', 'Campo de pergunta está vazio!');
      return;
    }

    if(!user) {
      showToast('⚠️', 'Você deve estar logado.');
      return;
    }

    if(newQuestion.trim().length < minCaracterNewQuestion) {
      showToast('⚠️', 'Por favor enviar apenas perguntas. Mínimo 20 caracteres.');
      return;
    }

    const question = {
      content: newQuestion,
      author: {
        id: user?.id,
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighLighted: false,
      isAnswered: false,
    };

    try {
      setNewQuestion('');
      await database.ref(`rooms/${roomId}/questions`).push(question);
      showToast('✅', 'Pergunta enviada com sucesso!');
    } catch(error) {
      showToast('❌', 'Ocorreu algum erro ao enviar sua pergunta. Tente novamente.');
      setNewQuestion(question.content);
    }
  }

  function handleSetQuestion(value: string) {
    if(value.length > limitCaracterNewQuestion) {
      showToast('⚠️', 'Máximo 1000 caracteres');
    } else {
      setNewQuestion(value);
    }
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    
    if(!user) {
      showToast('⚠️', 'Você deve estar logado!');
      return;
    }
    
    if(likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  function getAllLikes() {
    const allLikeQuestions = questions.reduce((somaLikes, question) => {
      return somaLikes + question.likeCount;
    }, 0);

    return allLikeQuestions;
  }

  function getAllAnsweredQuestions() {
    const allAnsweredQuestions = questions.reduce((somaAnswered, questions) => {
      if(questions.isAnswered) {
        somaAnswered++;
      }

      return somaAnswered;
    }, 0);
    
    return allAnsweredQuestions;
  }

  async function handleUserLoginGoogle() {
    if(!user) {
      showToast('💻', 'Abrirá a janela de autenticação do Google.');
      await signInWithGoogle();
    }
  }

  async function handleUserLoginGithub() {
    if(!user) {
      showToast('💻', 'Abrirá a janela de autenticação do Github.');
      await signInWithGithub();
    }
  }

  async function handleLogOut() {
    if(user) {
      await signOut();
      navigate('/');
    } else {
      showToast('⚠️', 'Você não está logado!');
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
          <Link to='/'>
            <img src={theme === 'light' ? logoImage : logoDarkImage} alt='Letmeask' />
          </Link>
          <div>
            <RoomCode code={roomId} />
            <Toggle />
          </div>
        </div>
        <Toaster toastOptions={{ duration: 2100 }} />
      </header>
      <motion.main variants={fadeInUp}>
        <div className='room-title'>
          <div className='avatar'>
            <img src={user?.avatar} alt={user?.name} />
            <p>{user?.name}</p>
          </div>
          <h1>Sala: {title}</h1>
          { questionsQuantity > 0 && (
            <span>
              { questionsQuantity }{' '}
              {questionsQuantity > 1 ? 'perguntas' : 'pergunta'}
            </span>
          )}
        </div>
        <div className='all-stats'>
          <Stats text='Respondida(s)' firstStats={getAllAnsweredQuestions()} borderColor='#835afd' />
          <Stats text='Likes' secondStats={getAllLikes()} borderColor='#e559f9' />
        </div>
        <form onSubmit={handleSendQuestion}>
            <textarea 
              placeholder='O que você quer perguntar?'
              value={newQuestion}
              onChange={(event) => handleSetQuestion(event.target.value)}
            />
            <div className='form-footer'>
              { !user ? (
                <span className='login'>
                  Para enviar uma pergunta, faça seu login com o { "" }
                  <Button className='link google' onClick={handleUserLoginGoogle}>
                    Google
                  </Button>
                  ou
                  <Button className='link github' onClick={handleUserLoginGithub}>
                    Github
                  </Button>
                </span>
              ) : (
                <>
                  <div className='user-info'>
                    <img src={user.avatar}  alt={user.name} />
                    <p>{user.name}</p>
                    <span className='limit'>{`${newQuestion.length} | ${limitCaracterNewQuestion}`}</span>
                    <div className='logout'>
                      <span onClick={handleLogOut}>Deslogar</span>
                    </div>
                  </div>
                </>
              ) }
              <Button type='submit' disabled={!user}>Enviar pergunta</Button>
            </div>
          </form>
        
        <div className='question-list'>
          { questionsQuantity === 0 ? (
            <Loading />
          ) : (
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
                    { !question.isAnswered && (
                      <motion.button
                        className={`like-button ${question.likeId ? 'liked' : ''}`}
                        type='button'
                        aria-label='Marcar como gostei'
                        onClick={() => handleLikeQuestion(question.id, question.likeId)}
                        whileTap={
                          !question.likeId && user ? {
                            scale: 1.1,
                          } : {}
                        }
                      >
                        { question.likeCount > 0 && <span>{question.likeCount}</span> }
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.button>
                    ) }
                  </CardQuestion>
                </div>
                { question.answers.map((v) => (
                  <motion.div
                    className='answer-container'
                    key={v.content}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FiCornerDownRight size={24} color='#e559f9' />
                    <Answer author={v.author} content={v.content} />
                  </motion.div>
                )) }
              </>
            )) }
           </div>
          )}
        </div>
      </motion.main>
    </motion.div>
  );
}

export { Room };