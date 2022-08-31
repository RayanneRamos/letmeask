import { useNavigate, useParams } from 'react-router-dom';
import logoImage from '../../assets/images/logo.svg';
import deleteImage from '../../assets/images/delete.svg';
import checkImage from '../../assets/images/check.svg';
import answerImage from '../../assets/images/answer.svg';
import logoDarkImage from '../../assets/images/logo-dark.svg';
import { Button } from '../../components/Button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
import { Toggle } from '../../components/Toggle';
import { useRoom } from '../../hooks/useRoom';
import { useTheme } from '../../hooks/useTheme';
import { database } from '../../services/firebase';
import '../../styles/room.scss';
import '../../components/Question/styles.scss';

type RoomParams = {
  id: string;
}

function AdminRoom() {
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const roomId = params.id as string;
  const { title, questions } = useRoom(roomId);
  const { theme } = useTheme();

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    navigate('/');
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

  return (
    <div id='page-room' className={theme}>
      <header className={theme}>
        <div className='content'>
          <img src={theme === 'light' ? logoImage : logoDarkImage} alt='Letmeask' />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
            <Toggle />
          </div>
        </div>
      </header>
      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>
        <div className='question-list'>
          { questions.map(question => {
            return (
              <Question
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
              </Question>
            )
          })} 
        </div>
      </main>
    </div>
  );
}

export { AdminRoom };