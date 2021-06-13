export interface MessageFormat {
    id: string;
    author: Author;
    content: Array<MessagePart>;
}

export interface Author {
    author: string;
    isAdmin: boolean;
    isBot: boolean;
    color: string;
}

export interface MessagePart {
    cleanContent: string;
    attachment: Array<string>;
    emoji? : {
        id: string;
        alt: string;
    };
    format?: {
        color: string;
    }
}