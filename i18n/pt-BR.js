/**
 * SVGaze - Portuguese (Brazil) Translations
 *
 * All text strings used throughout the application.
 * Do not hardcode strings in HTML or JavaScript - use this file instead.
 */

export const translations = {
  // === Application Info ===
  app: {
    name: 'SVGaze',
    tagline: 'Visualizador moderno de ícones SVG',
    description: 'Funcionalidades: busca, filtro por categoria, modal, favoritos, personalização de cor e tamanho'
  },

  // === Header ===
  header: {
    title: 'SVGaze',
    selectFolder: 'Selecionar pasta',
    searchPlaceholder: 'Pesquisar por nome...',
    searchLabel: 'Pesquisar ícones',
    categoryFilterLabel: 'Filtrar categoria',
    allCategories: 'Todas as categorias',
    sizeLabel: 'Tamanho',
    colorLabel: 'Cor global do ícone',
    clearFavorites: 'Limpar favoritos',
    themeToggle: 'Alternar tema',
    languageToggle: 'Alterar idioma',
    backToHome: 'Voltar ao início'
  },

  // === Toolbar ===
  toolbar: {
    iconsLoaded: 'ícones carregados',
    icon: 'ícone',
    icons: 'ícones',
    activeColorLabel: 'Cor ativa',
    currentCategory: 'Categoria'
  },

  // === Welcome Screen ===
  welcome: {
    title: '👋 Bem-vindo ao visualizador',
    message: 'Use "Selecionar pasta" para escolher a pasta que contém seus .svg — o visualizador agrupa por pasta.'
  },

  // === Cards ===
  card: {
    favorite: 'Favoritar',
    unfavorite: 'Remover dos favoritos',
    open: 'Abrir',
    edit: 'Editar',
    copy: 'Copiar',
    download: 'Baixar',
    invalidSvg: 'SVG inválido'
  },

  // === Modal ===
  modal: {
    copySvg: 'Copiar SVG',
    copyName: 'Copiar nome',
    copyPath: 'Copiar caminho',
    close: 'Fechar',
    invalidSvg: 'SVG inválido'
  },

  // === Notifications ===
  notifications: {
    copied: 'Copiado!',
    copyError: 'Não foi possível copiar',
    noSvgFound: 'Nenhum .svg encontrado.',
    noResults: 'Nenhum resultado encontrado.',
    loadError: 'Erro ao carregar arquivos SVG. Veja o console para detalhes.',
    favoritesCleared: 'Favoritos limpos com sucesso'
  },

  // === Category Headers ===
  category: {
    root: 'Raiz',
    count: '{count} ícone',
    countPlural: '{count} ícones'
  },

  // === Accessibility ===
  a11y: {
    headerLabel: 'Cabeçalho do visualizador',
    mainControlsLabel: 'Controles principais',
    fileInputHidden: 'Seletor de arquivo oculto',
    modalDialog: 'Janela de pré-visualização',
    gridLive: 'Grade de ícones atualizada'
  },

  // === Views ===
  views: {
    gallery: 'Galeria',
    editor: 'Editor'
  },

  // === Upload File ===
  uploadFile: 'Carregar SVG',

  // === Editor Tools ===
  editor: {
    // Buttons
    upload: 'Upload',
    uploadTitle: 'Upload SVG',
    copy: 'Copiar',
    copyTitle: 'Copiar código SVG',
    download: 'Baixar',
    downloadTitle: 'Baixar SVG',
    optimize: 'Otimizar',
    optimizeTitle: 'Otimizar SVG',
    prettify: 'Formatar',
    prettifyTitle: 'Formatar código',

    // Tools
    rotate: 'Rotacionar 90°',
    flipHorizontal: 'Espelhar Horizontal',
    flipVertical: 'Espelhar Vertical',
    dimensions: 'Alterar dimensões',
    dimensionsModal: 'DIMENSÕES',
    widthLabel: 'L',
    heightLabel: 'A',
    lockProportions: 'Travar proporções',
    apply: 'Aplicar',

    // Messages
    placeholder: 'Cole ou digite código SVG no editor',
    noContent: 'Nenhum SVG para visualizar',
    invalidSvg: 'SVG inválido',
    optimized: 'Otimizado',

    // Theme toggle
    themeToggle: 'Alternar tema claro/escuro'
  },

  // === Export Tabs ===
  exportTabs: {
    preview: 'Prévia',
    react: 'React',
    reactNative: 'React Native',
    png: 'PNG',
    dataUri: 'Data URI',
    reactComponent: 'Componente React',
    reactNativeComponent: 'Componente React Native'
  },

  // === Export Settings ===
  exportSettings: {
    typescript: 'TypeScript',
    singleQuotes: 'Aspas Simples',
    stripSemicolons: 'Remover Ponto e Vírgula',
    minifiedDataUri: 'Data URI Minificado',
    base64: 'base64',
    encodeUriComponent: 'encodeURIComponent',
    downloadJsx: 'Baixar JSX',
    downloadPng: 'Baixar PNG',
    copyCode: 'Copiar código'
  },

  // === Preview Controls ===
  preview: {
    zoomIn: 'Aumentar Zoom',
    zoomOut: 'Diminuir Zoom',
    fitToView: 'Ajustar à Tela',
    toggleGrid: 'Alternar Grade',
    toggleCheckered: 'Alternar Fundo Quadriculado',
    downloadSvg: 'Baixar SVG',
    dimensionsPlaceholder: '—'
  },

  // === Toast Messages ===
  toasts: {
    // Success
    svgCopied: '✓ Código SVG copiado!',
    svgDownloaded: '✓ SVG baixado!',
    codeCopied: '✓ Código copiado!',
    reactCopied: '✓ Código React copiado!',
    reactNativeCopied: '✓ Código React Native copiado!',
    jsxDownloaded: '✓ JSX baixado!',
    pngExported: '✓ PNG exportado!',
    dataUriCopied: '✓ Data URI copiado!',
    svgFormatted: '✓ SVG formatado!',
    svgMinified: '✓ SVG minificado!',
    svgValid: '✓ SVG válido!',
    svgRotated: '✅ Rotacionado {degrees}°',
    svgFlipped: '✅ Espelhado {axis}mente',
    dimensionsApplied: '✅ Dimensões: {width}×{height}',
    transformsReset: '✅ Transformações resetadas',
    settingsRestored: '✅ Configurações restauradas',
    codeManualCopy: 'Código copiado! (ou pressione Ctrl+C para copiar manualmente)',

    // Errors
    errorCopy: '✗ Erro ao copiar',
    errorExportPng: '✗ Erro ao exportar PNG',
    errorNoContent: '✗ Nenhum SVG para exportar',
    errorFormat: 'Erro ao formatar SVG.',
    errorMinify: 'Erro ao minificar SVG.',
    errorValidate: 'Erro ao validar SVG.',
    errorRotate: '❌ Erro ao rotacionar SVG',
    errorFlip: '❌ Erro ao espelhar SVG',
    errorDimensions: '❌ Erro ao aplicar dimensões',
    errorTransforms: '❌ Erro ao resetar transformações',
    errorOptimize: '❌ Erro ao otimizar SVG',
    errorExport: 'Erro ao exportar para {format}.',
    errorReactConvert: 'Erro ao converter para React JSX.',
    errorReactNativeConvert: 'Erro ao converter para React Native.',
    errorDataUriCreate: 'Erro ao criar Data URI.',
    errorReadFile: 'Erro ao ler o arquivo. Por favor, tente novamente.',

    // Warnings
    warningNoSvgElement: '⚠️ Nenhum elemento SVG encontrado',
    warningNoSvgToOptimize: '⚠️ Nenhum código SVG para otimizar',
    warningNoContentToCopy: 'Não há conteúdo para copiar.',
    warningNoContentToDownload: 'Não há conteúdo para baixar.',
    warningNoContentToFormat: 'Não há conteúdo para formatar.',
    warningNoContentToMinify: 'Não há conteúdo para minificar.',
    warningNoContentToValidate: 'Não há conteúdo para validar.',
    warningNoContentToExport: 'Não há conteúdo para exportar.',
    warningInvalidFile: 'Por favor, selecione um arquivo SVG válido.',
    warningInvalidDimensions: 'Por favor, insira dimensões válidas.',
    warningSyntaxError: '❌ Erro de sintaxe no SVG:\n\n{error}',
    warningNoSvgTag: '❌ Nenhum elemento <svg> encontrado.'
  },

  // === Favorites ===
  favorites: {
    title: '⭐ Favoritos'
  },

  // === Validation Messages ===
  validation: {
    noSvgFiles: 'Nenhum arquivo .svg encontrado na pasta selecionada.'
  },

  // === Keyboard Shortcuts ===
  shortcuts: {
    escape: 'Fechar modal',
    ctrlF: 'Focar na busca',
    arrowKeys: 'Navegar entre ícones',
    enter: 'Abrir modal',
    f: 'Adicionar/remover favorito'
  },

  // === Themes ===
  themes: {
    light: 'Tema Claro',
    dark: 'Tema Escuro',
    system: 'Usar preferência do sistema'
  },

  // === Languages ===
  languages: {
    'pt-BR': 'Português (Brasil)',
    'en-US': 'English (United States)'
  },

  // === File Processing ===
  files: {
    loading: 'Carregando arquivos...',
    processing: 'Processando {count} arquivos',
    loaded: 'Successfully loaded {count} SVG files',
    parsingError: 'Erro ao processar SVG'
  },

  // === Settings (Future) ===
  settings: {
    title: 'Configurações',
    appearance: 'Aparência',
    language: 'Idioma',
    theme: 'Tema',
    performance: 'Performance',
    about: 'Sobre'
  },

  // === Stats (Future) ===
  stats: {
    title: 'Estatísticas',
    totalIcons: 'Total de Ícones',
    totalCategories: 'Total de Categorias',
    totalFavorites: 'Total de Favoritos',
    totalSize: 'Tamanho Total',
    avgSize: 'Tamanho Médio'
  },

  // === Error Messages ===
  errors: {
    generic: 'Ocorreu um erro inesperado',
    fileRead: 'Erro ao ler arquivo',
    parseError: 'Erro ao processar SVG',
    networkError: 'Erro de conexão',
    permissionDenied: 'Permissão negada',
    unsupportedBrowser: 'Navegador não suportado. Use Chrome, Edge, Firefox ou Safari.'
  },

  // === Success Messages ===
  success: {
    saved: 'Salvo com sucesso',
    exported: 'Exportado com sucesso',
    imported: 'Importado com sucesso',
    deleted: 'Excluído com sucesso'
  },

  // === Confirmation Messages ===
  confirmations: {
    clearFavorites: 'Tem certeza que deseja limpar todos os favoritos?',
    deleteItem: 'Tem certeza que deseja excluir este item?',
    resetSettings: 'Tem certeza que deseja redefinir as configurações?'
  },

  // === Time & Dates ===
  time: {
    now: 'Agora',
    today: 'Hoje',
    yesterday: 'Ontem',
    daysAgo: '{days} dias atrás',
    weeksAgo: '{weeks} semanas atrás',
    monthsAgo: '{months} meses atrás'
  },

  // === Units ===
  units: {
    px: 'px',
    kb: 'KB',
    mb: 'MB',
    bytes: 'bytes'
  }
};

/**
 * Get translation by key
 * Supports nested keys with dot notation: 'header.title'
 * Supports variable interpolation: '{count} items'
 *
 * @param {string} key - Translation key
 * @param {Object} vars - Variables for interpolation
 * @returns {string} Translated text
 */
export function t(key, vars = {}) {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }

  // Variable interpolation
  return value.replace(/\{(\w+)\}/g, (match, varName) => {
    return vars[varName] !== undefined ? vars[varName] : match;
  });
}

/**
 * Get plural form based on count
 * @param {number} count - Number for plural check
 * @param {string} singular - Singular key
 * @param {string} plural - Plural key
 * @returns {string} Translated text
 */
export function tPlural(count, singular, plural) {
  const key = count === 1 ? singular : plural;
  return t(key, { count });
}

export default translations;
