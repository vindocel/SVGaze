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
    description: 'Visualize e organize arquivos SVG locais diretamente no navegador'
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
    languageToggle: 'Alterar idioma'
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

  // === Footer ===
  footer: {
    text: 'SVGaze - Visualizador moderno de ícones SVG',
    features: 'Funcionalidades: busca, filtro por categoria, modal, favoritos, personalização de cor e tamanho'
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
