const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/**
 * Escapa texto para entrar num HTML montado à mão (o PDF do expo-print). Nomes de lugar e de
 * pessoa são digitados por gente e podem ter `<` ou `&`, que quebrariam a página.
 *
 * @example
 * escapeHtml('Rio <Pardo> & Cia') // "Rio &lt;Pardo&gt; &amp; Cia"
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character])
}
