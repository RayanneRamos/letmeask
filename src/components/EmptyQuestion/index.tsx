import emptyImage from '../../assets/images/empty-questions.svg';
import { Loading } from '../Loading';
import { useTheme } from '../../hooks/useTheme';
import './styles.scss';

function EmptyQuestion() {
  const theme = useTheme();

  return (
    <div className={`empty-question ${theme}`}>
      <img src={emptyImage} alt='' />
      <p>Nenhuma pergunta por aqui...</p>
      <span>
        Envie o código desta sala para seus amigos e <br /> comece a responder perguntas!
      </span>
      <Loading />
    </div>
  );
}

export { EmptyQuestion };