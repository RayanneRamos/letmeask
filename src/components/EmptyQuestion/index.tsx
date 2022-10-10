import React from 'react';
import emptyImage from '../../assets/images/empty-questions.svg';
import { useTheme } from '../../hooks/useTheme';
import { Loading } from '../Loading';
import './styles.scss';

function EmptyQuestion() {
    const theme = useTheme();

    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(window.location.href);

        const shareData = {
            title: 'Letmeask',
            text: 'Sala',
            url: window.location.href,
        };

        navigator.share(shareData);
    }

    return (
        <div className={`empty-question ${theme}`}>
            <img src={emptyImage} alt='nenhuma questão' />
            <h3>Nenhuma pergunta por aqui...</h3>
            <hr />
            <span>Compartilhe o link da sala com o público interessado: </span>
            <button className='link' onClick={copyRoomCodeToClipboard}>
                {window.location.href}
            </button>
            <Loading />
        </div>
    );
}

export { EmptyQuestion };