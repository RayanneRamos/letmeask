import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  },
  createdAt: number;
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  },
  createdAt: number;
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

type DataRoomProps = {
  authorId: string;
  endedAt: string;
  title: string;
}

type AuthorRoom = {
  id: string;
  avatar: string;
  name: string;
}

function useRoom(roomId: string) {
  const { user } = useAuth();
  const [ questions, setQuestions ] = useState<QuestionType[]>([]);
  const [ title, setTitle ] = useState('');
  const [ dataRoom, setDataRoom ] = useState<DataRoomProps>();
  const navigate = useNavigate();
  const [ author, setAuthor ] = useState<AuthorRoom>();
  const [ createdAt, setCreatedAt ] = useState<number>();
  const [ endedAt, setEndedAt ] = useState<number>();


  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();

      if(databaseRoom !== null) {
        const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
        setDataRoom(databaseRoom);

        const parsedQuestions = Object.entries(firebaseQuestions).map(([ key, value ]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            createdAt: value.createdAt,
            isHighLighted: value.isHighLighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(([ key, like ]) => like.authorId === user?.id)?.[0],
          };
        });

        const orderQuestionsByLikeCount = parsedQuestions.sort((roomA, roomB) => (
          roomA.likeCount < roomB.likeCount ? 1 : roomA.likeCount > roomB.likeCount ? -1 : 0
        ));

        const orderQuestionsByNotAnswer = orderQuestionsByLikeCount.sort((roomA, roomB) => (
          roomA.isAnswered > roomB.isAnswered ? 1 : roomA.isAnswered < roomB.isAnswered ? -1 : 0
        ));

        setTitle(databaseRoom.title);
        setQuestions(orderQuestionsByNotAnswer);
        setCreatedAt(databaseRoom.createdAt);
        setAuthor(databaseRoom.author);
        setEndedAt(databaseRoom.endedAt);
      } else {
        navigate('/');
      }
    });

    return () => {
      roomRef.off('value');
    }
  }, [ roomId, user?.id, navigate ]);

  return {
    questions,
    title,
    dataRoom,
    endedAt,
    createdAt,
    author,
  }
}

export { useRoom };