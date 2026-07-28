export function estimateTokens(text: string): number {
  return Math.ceil(text.split(/\s+/).length * 1.3);
}

export function truncateToTokenLimit(text: string, maxTokens: number): string {
  const words = text.split(/\s+/);
  const maxWords = Math.floor(maxTokens / 1.3);
  return words.slice(0, maxWords).join(' ');
}

export function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '**$1**')
    .replace(/\*(.*?)\*/g, '*$1*')
    .replace(/`(.*?)`/g, '`$1`');
}
