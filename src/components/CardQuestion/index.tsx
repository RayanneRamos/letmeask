import React, { ReactNode } from 'react';
import cx from 'classnames';
import { useTheme } from '../../hooks/useTheme';
import { BadgeNewQuestion } from '../BadgeNewQuestion';
import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: number;
  children?: ReactNode;
  isAnswered?: boolean; 
  isHighLighted?: boolean;
  amountLike?: number;
}

function CardQuestion({ content, author, isAnswered = false, isHighLighted = false, amountLike, children, createdAt }: QuestionProps) {
    const { theme } = useTheme();

    return (
        <div className={cx(`question ${theme}`, { answered: isAnswered }, { highlighted: isHighLighted && !isAnswered })}>
            <div className='content'>
                { amountLike !== undefined && (<span className='likes'>{amountLike} {amountLike > 1 ? 'likes' : 'like'}</span>) }
            </div>
            <p>{content}</p>
            <footer>
                <div className='user-info'>
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <BadgeNewQuestion createdAt={createdAt} />
                <div>
                    {children}
                </div>
            </footer>
        </div>
    );
}

export { CardQuestion };