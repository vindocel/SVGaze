# Editor estático para GitHub Pages

O SVGaze continua sendo um site de arquivos estáticos. Não precisa de servidor Node, API, banco de dados, assinatura ou processo de build na hospedagem. O `index.html`, `css/`, `js/`, `i18n/` e os favicons são publicados como antes; `.nojekyll` explicita que o conteúdo deve ser servido sem Jekyll. O `CNAME` permanece com a configuração existente.

## Recursos integrados

- Editor CodeMirror com fonte de 14 px, paleta XML com tags, atributos, pontuação e valores distintos, busca/substituição, dobramento, fechamento de tags, desfazer/refazer e seletores de cor no código.
- Painel de cores com substituição individual/global e `currentColor`.
- Preview isolado da página, transparente, com hover/click vinculado ao trecho exato do código, arraste, zoom, ajuste real à área e fundos personalizáveis.
- Troca de tema sem recriar o SVG, reiniciar a câmera, trocar de aba ou alterar o código. As classes CSS do SVG não herdam regras do cabeçalho/galeria. Somente cores explicitamente baseadas em `currentColor` acompanham o tema.
- Rotação e espelhamento que respeitam o viewBox, inclusive retangular e com origem deslocada.
- Dimensões com proporção bloqueada por padrão e aplicação durante a digitação; a opção de proporção livre do SVGaze foi preservada.
- SVGO 4.1.0 servido localmente e executado em Web Worker. As 41 opções visíveis, precisão numérica e precisão de transformação realmente controlam a execução. Preferências antigas são migradas para o novo formato.
- Estimativa automática de economia ao carregar, editar ou mudar opções. O código só é otimizado quando o usuário aplica a ação; estimativas antigas não descrevem documentos novos.
- Configurações junto à barra do editor, restauração dos padrões e formatação em 2/4 espaços ou tab, com tags curtas opcionais.
- Conversões React/React Native por estrutura XML, com estilos, namespaces, atributos ARIA/data, texto misto, imports dos componentes utilizados e tipos `SVGProps`/`SvgProps`. Aspas simples e remoção de ponto e vírgula não modificam o conteúdo dos atributos ou textos.
- PNG/JPEG/WebP/ICO, tamanhos próprios, escalas de 0,5× a 16×, fundo, qualidade e ZIP de favicons. A exportação parte do código, sem marcações de inspeção ou ajustes de câmera.
- Data URI compacta, Base64 e URL encoding com suporte Unicode. Copiar, compartilhar por fragmento da URL, arrastar arquivos e colar arquivos SVG permanecem locais.

O editor usa o espaço de trabalho do SVGaze: ações do documento na barra superior, ferramentas de código, inspetor contextual recolhível e controles compactos na prévia. As cores e variáveis de tema, a galeria, os filtros e os favoritos continuam sendo os do SVGaze. Ao iniciar, o editor usa o ícone real do SVGaze incorporado ao módulo, sem buscar arquivos pela rede. Abrir um arquivo da galeria, upload ou link compartilhado substitui esse documento; navegar entre galeria/editor preserva a edição atual. Não foi adicionada IA: isso mantém as funções do editor independentes de chaves e serviços pagos.

## Dependências e manutenção

As bibliotecas de navegador ficam versionadas em `js/vendor/` e `css/vendor/`; não é necessário executar npm para acessar o site. O otimizador é carregado pelo worker quando o editor precisa dele, e o ZIP de favicons é carregado sob demanda.

Para desenvolvimento, com Node.js 22+:

```sh
npm ci
npm test
npm run check
```

Para atualizar/reconstruir as cópias locais de bibliotecas após alterar o lockfile:

```sh
npm run vendor
```

Esse comando é uma tarefa de manutenção, não uma etapa obrigatória de deploy. As licenças estão em `js/vendor/licenses/` e o inventário em `js/vendor/THIRD_PARTY_NOTICES.md`.

## Limites de verificação

Os testes automatizados usam o DOM real do `index.html`, o CodeMirror real e o SVGO real. O transporte de Worker é simulado nos testes de interface; existe teste separado do módulo do worker em outra thread. A geometria do SVG, quando necessária, é simulada no JSDOM. Isso verifica estados, eventos e transformações, mas não substitui a inspeção visual e rasterização em navegador real.

O SVG não é enviado a serviços externos. Recursos remotos referenciados pelo SVG são bloqueados no preview isolado; arquivos que dependam desses recursos podem ter aparência diferente. Alguns elementos do SVG de navegador não têm equivalente no React Native e são informados como não suportados durante a conversão.

A rasterização tem limite de 64 megapixels, até 16384 px por lado; ICO tem limite de 256 × 256. Os links de compartilhamento incluem o documento na URL e só são transmitidos a outra pessoa quando o usuário compartilha esse link.

As alterações locais passam a aparecer em `app.svgaze.com` depois da publicação normal do repositório no GitHub Pages.


## Espaço de trabalho aprovado

O editor agora tem barra de documento com nome, indicação de alterações, desfazer/refazer e menu Exportar. Código e prévia ficam sempre visíveis. Inverter painéis troca sua ordem e guarda a preferência neste navegador; a troca preserva a seleção e o documento da prévia. O inspetor é recolhível. A divisória funciona com arraste e setas do teclado. Em telas estreitas o inspetor abre como painel sobreposto e começa fechado; a prévia inicial é ajustada ao espaço disponível.

O inspetor separa Documento inteiro (transformações, cores e dimensões globais) de Elemento selecionado. Clique na prévia ou posicione o cursor no código para editar geometria suportada, fill, stroke, espessura, opacidade, transform e dados de path/pontos. A edição altera somente a tag inicial selecionada, mantém irmãos/comentários e participa do histórico do CodeMirror. Os valores exibidos são os locais; CSS por classes e herança podem prevalecer. Remover um valor remove sua declaração local.

Comparar calcula pelo mesmo SVGO do botão Otimizar e abre duas versões de imagem ou de código sem modificar o documento. Aplicar substitui o código e mantém desfazer; alterações no documento ou nas opções invalidam a comparação. Os iframes usam o mesmo isolamento da prévia. As configurações de otimização ficam no painel lateral com busca, seções e restauração.

Nenhuma dessas funções requer backend, chave de API, build de produção ou serviço pago. As configurações globais e a galeria permanecem locais.
