import copyImage from '../../assets/images/copy.svg';
import './styles.scss';
import { useToast } from '../../hooks/useToast';

type RoomCodeProps = {
  code: string;
}

function RoomCode(props: RoomCodeProps) {
  const { showToast } = useToast();

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);

    showToast('✅', `Código da sala copiado!`);
  }

  return (
    <button className='room-code' onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImage} alt='Copy room code' />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
}

export { RoomCode };