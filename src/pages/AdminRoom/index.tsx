import logoImage from '../../assets/images/logo.svg';
import deleteImage from '../../assets/images/delete.svg';
import checkImage from '../../assets/images/check.svg';
import answerImage from '../../assets/images/answer.svg';
import { Button } from '../../components/Button';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
import '../../styles/room.scss';
import '../../components/Question/styles.scss';

function AdminRoom() {
  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <img src={logoImage} alt='Letmeask' />
          <div>
            <RoomCode code={''} />
            <Button isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className='room-title'>
          <h1>Sala</h1>
        </div>
        <div>
          <Question content={''} author={{
            name: '',
            avatar: ''
          }}>
            <>
              <button
                type='button'
              >
                <img src={checkImage} alt='Marcar pergunta como respondida' />
              </button>
              <button
                type='button'
              >
                <img src={answerImage} alt='Dar destaque à pergunta' />
              </button>
            </>
            <button
              type='button'
            >
              <img src={deleteImage} alt='Remover pergunta' />
            </button>
          </Question>
        </div>
      </main>
    </div>
  );
}

export { AdminRoom };