export type ModalType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  roomId: string;
  questionId?: string;
  type: string;
}