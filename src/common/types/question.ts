import { ReactNode } from "react";

export type QuestionType = {
  content: string;
  author: {
    name: string;
    avatar: string;
  },
  createdAt: number;
  children?: ReactNode;
  isAnswered?: boolean;
  isHighLighted?: boolean;
  amountLike?: number;
}

export type QuestionStats = {
  firstStats?: number | undefined;
  secondStats?: number | undefined;
  text: string;
  borderColor?: string | undefined;
  textColor?: string | undefined;
  bgColor?: string | undefined;
}

export type QuestionsType = {
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
  answers: Array<{
    author: {
      name: string;
      avatar: string;
    },
    content: string;
  }>
} 

export type FirebaseQuestions = Record<string, {
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
  }>,
  likeId: string | undefined;
  answers: Record<string, {
    author: {
      name: string;
      avatar: string;
    },
    content: string;
  }>
}>