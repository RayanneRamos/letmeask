import './styles.scss';
import { Button } from '../Button';
import { FormEvent, forwardRef, Ref } from 'react';

type AnswerProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
}

function Answer({ content, author }: AnswerProps) {
  return (
    <div className='container'>
      <p>{content}</p>
      <footer>
        <div className='user-info'>
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
      </footer>
    </div>
  );
}

export { Answer };