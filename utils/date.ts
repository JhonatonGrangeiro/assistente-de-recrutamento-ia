export const formatRelativeDate = (isoDateString?: string): string => {
  if (!isoDateString) return '';

  const date = new Date(isoDateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours < 1) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        if (diffMinutes < 1) return "agora";
        return `há ${diffMinutes} min`;
    }
    return `há ${diffHours}h`;
  }
  if (diffDays === 1) return 'ontem';
  if (diffDays < 30) return `há ${diffDays} dias`;

  return new Intl.DateTimeFormat('pt-BR').format(date);
};
