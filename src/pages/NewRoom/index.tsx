import illustrationImage from '../../assets/images/illustration.svg';
import logoImage from '../../assets/images/logo.svg';
import { Button } from '../../components/Button';
import '../../styles/auth.scss';

function NewRoom() {
  return (
    <div id='page-auth'>
      <aside>
        <img src={illustrationImage} alt='Ilustração simbolizando perguntas e respostas' />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImage} alt='Letmeask' />
          <h2>Criar uma nova sala</h2>
          <form>
            <input 
              type='text'
              placeholder='Nome da sala'
            />
            <Button>Criar sala</Button>
          </form>
          <p>Quer entrar em uma sala existente?<a>cliquei aqui</a></p>
        </div>
      </main>
    </div>
  );
}

export { NewRoom };