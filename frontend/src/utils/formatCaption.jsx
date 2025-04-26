import { Link } from "react-router-dom";

export function formatCaption(text) {
    const hashtagRegex = /#\w+/g;
    const parts = [];

    let lastIndex = 0;
    let match;

    while ((match = hashtagRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: text.slice(lastIndex, match.index)
            });
        }
        parts.push({
            type: 'hashtag',
            content: match[0]
        });
        lastIndex = hashtagRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push({
            type: 'text',
            content: text.slice(lastIndex)
        });
    }

    return parts.map((part, index) => {
        if (part.type === 'hashtag') {
            return (
                <Link 
                    key={index} 
                    className="text-blue-500 dark:text-blue-400 cursor-pointer hover:underline transition-all ease-in-out duration-75" 
                    to={`/hashtag/${part.content.slice(1)}`}
                >
                    {part.content}
                </Link>
            );
        } else {
            return <span key={index}>{part.content}</span>;
        }
    });
}