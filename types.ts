
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface MessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface Message {
  id: string;
  role: Role;
  parts: MessagePart[];
  timestamp: Date;
}

export interface AppState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
