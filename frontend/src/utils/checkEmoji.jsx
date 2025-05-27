export function isOnlyEmoji(str) {
    return str && str.trim().length > 0 && 
        /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\s)+$/u.test(str.trim());
}