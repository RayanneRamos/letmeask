import React from 'react';
import './styles.scss';

type QuestionsType = {
  firstStats?: number | undefined;
  secondStats?: number | undefined;
  text: string;
  borderColor?: string | undefined;
  textColor?: string | undefined;
  bgColor?: string | undefined;
}

function Stats({ firstStats = 0, secondStats = 0, text, borderColor, textColor = borderColor, bgColor = 'transparent' }: QuestionsType) {
  return (
    <div 
      className='room-stats'
      style={{ 
        borderColor: `${borderColor}`,
        color: `${textColor}`,
        backgroundColor: `${bgColor}`,  
      }}
    >
      <h3>
        { firstStats ? firstStats : secondStats } { text }
      </h3>
    </div>
  );
}

export { Stats };