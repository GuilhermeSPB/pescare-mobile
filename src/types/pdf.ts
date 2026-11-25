// Um PDF a gerar: o HTML da página e o nome com que o arquivo chega a quem recebe ou fica salvo.
export type PdfDocument = {
  html: string
  // Nome final com ".pdf", sem barras nem acentos.
  fileName: string
}

// Como terminou o "salvar no celular": gravou na pasta escolhida (Android), a pessoa fechou o
// seletor de pastas, ou abriu o menu de compartilhar, onde no iPhone fica "Salvar em Arquivos".
export type PdfSaveOutcome = 'saved' | 'canceled' | 'shared'
