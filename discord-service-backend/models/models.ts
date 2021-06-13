export interface MessageFormat {
    id: string;
    author: Author;
    content: Array<MessagePart>;
    attachments: Array<string>;
}

export interface Author {
    author: string;
    isAdmin: boolean;
    isBot: boolean;
    color: string;
}

export interface MessagePart {
    cleanContent: string;

    emoji? : {
        id: string;
        alt: string;
    };
    format?: {
        color: string;
    }
}