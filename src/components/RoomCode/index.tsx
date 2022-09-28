import copyImage from '../../assets/images/copy.svg';
import './styles.scss';
import toast from 'react-hot-toast';

type RoomCodeProps = {
  code: string;
}

function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);

    toast((t) => {
      t.position = 'bottom-right';
      t.type = 'success';
      t.message = 'Copiado para área de transferència';

      return <></>;
    })
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