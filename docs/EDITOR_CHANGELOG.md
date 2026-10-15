# SVGaze — Log das implementações do editor

Data: 15/10/2026  
Estado: alterações locais, prontas para revisão e commit manual.

## Espaço de trabalho e design

- Interface nos temas claro/escuro do SVGaze, com tipografia de código de 14 px, cores distintas para tags, atributos, valores e pontuação.
- Barra com nome do documento, indicação de alterações, desfazer/refazer e menu de exportação.
- Código e prévia sempre visíveis; botão Inverter painéis com preferência salva no navegador.
- Divisória ajustável por arraste ou teclado, respeitando a ordem dos painéis.
- Inspetor recolhível, controles compactos da prévia e barra de status com validade e peso do SVG.
- Adaptação para telas estreitas: inspetor sobreposto e inicialmente fechado, ferramentas acessíveis e prévia ajustada à área disponível.
- Agrupamento visual da ação e seta de configurações nos botões de otimização e formatação.

## Código, carregamento e cores

- CodeMirror local com realce XML, quebra de linha, busca/substituição, dobramento, fechamento de tags, correspondência de tags/colchetes e histórico.
- Ícone real do SVGaze como documento inicial, sem substituir arquivos abertos explicitamente pela galeria, upload ou link compartilhado.
- Upload validado, arrastar/soltar, colagem de arquivos SVG e nomes corretos ao abrir pela galeria.
- Pequenas amostras de cor editáveis no código e painel de substituição global/individual de cores, incluindo currentColor.
- Formatação com 2/4 espaços ou tabulação e opção de tags curtas, preservando texto misto, entidades e CDATA.

## Prévia, seleção e edição contextual

- Prévia transparente isolada em iframe, evitando interferência entre estilos do SVG e da aplicação.
- Hover e clique em formas vinculados ao trecho correspondente no código; seleção pelo cursor também atualiza o inspetor.
- Arraste, zoom, centralização, ajuste à tela, grade, quadriculado, fundos e coordenadas contextuais.
- Controles globais de transformação, cores e dimensões separados das propriedades da forma selecionada.
- Inspetor para geometria suportada, fill, stroke, espessura, opacidade, transform, dados de path e pontos.
- Alterações contextuais limitadas à tag inicial selecionada, preservando irmãos, comentários e código não relacionado, com suporte a desfazer.
- Validação numérica e suporte a unidades de comprimento. Propriedades locais podem ser afetadas por regras CSS e herança.
- Troca de tema e inversão dos painéis preservam o documento da prévia e a edição.

## Dimensões e transformações

- Aplicação das dimensões durante a digitação com proporção bloqueada por padrão e possibilidade de desbloquear.
- Rotação e espelhamento respeitando viewBox retangular, origem deslocada e dimensões do documento.
- Composição das transformações em uma única matriz, sem empilhar grupos a cada clique.
- Duas inversões iguais se cancelam; quatro rotações retornam à orientação inicial.
- Consolidação de grupos antigos de transformação reconhecidos, preservando grupos nomeados/estilizados e definições.

## Otimização e comparação

- SVGO 4.1.0 local em Web Worker carregado sob demanda.
- 41 opções funcionais, precisão numérica e de transformação independentes, migração de preferências e restauração de padrões.
- Configurações em painel lateral pesquisável, agrupadas em limpeza, geometria/cores e estrutura.
- Estimativa automática de economia após carregar, editar ou mudar opções, sem alterar o documento.
- Aplicação efetiva do resultado no editor, verificação do conteúdo e suporte a desfazer.
- Estado final discreto e desabilitado de Otimizado; os indicadores de economia voltam quando o código ou as opções mudam.
- Proteção contra respostas atrasadas e documentos alterados enquanto o processamento ocorre.
- Comparação original/otimizado por imagem ou código, com pesos, redução percentual e aplicação explícita.
- Invalidação de comparações desatualizadas; erros de carregamento/processamento são informados sem substituir o motor por uma otimização simplificada.

## Conversões, exportações e compartilhamento

- Conversão estrutural XML para React e React Native com JSX/TSX, imports dinâmicos, estilos, namespaces, atributos ARIA/data e texto misto.
- Opções de TypeScript, aspas e ponto e vírgula sem corromper conteúdo de atributos/textos.
- Exportações PNG, JPEG, WebP e ICO com dimensões, escala, fundo e qualidade, além de cópia e ZIP de favicons.
- Atualização dos resultados de exportação durante a edição e invalidação do cache ao alterar documento/opções.
- Data URI compacta, codificação URL e Base64 compatíveis com Unicode.
- Compartilhamento pelo fragmento da URL, sem armazenar o documento em servidor.
- Downloads a partir do código-fonte, sem atributos adicionados pela inspeção da prévia.

## Correções e padronização

- Corrigida a sobreposição do menu de idioma pela barra fixa da galeria.
- Corrigido o desaparecimento de SVGs na troca de tema.
- Corrigidos atalhos de busca do editor, nomes de arquivos, tamanho das amostras de cor e limpeza de notificações.
- Comentários, testes, changelog e documentação padronizados para a identidade do SVGaze.
- API de depuração exposta como window.svgaze; exemplos de uso atualizados.
- Mantidas as licenças, avisos de terceiros e identificadores técnicos necessários às bibliotecas.

## Hospedagem e dependências

- Processamento no navegador; nenhuma API paga, chave de IA ou backend adicionados.
- Dependências de navegador versionadas em js/vendor e css/vendor, incluindo licenças e inventário de terceiros.
- Módulos com caminhos relativos, worker local e .nojekyll para hospedagem estática.
- GitHub Pages não precisa executar build de produção. npm é utilizado apenas para manutenção das bibliotecas e verificações de desenvolvimento.
- Dependências principais: CodeMirror 5.65.2, SVGO 4.1.0, Prism 1.30.0, parser XML Lezer e fflate.

## Validação

- 37 testes automatizados aprovados, sem falhas, após a revisão final de nomenclatura.
- Verificação estática aprovada: 52 arquivos JavaScript, imports de navegador e recursos de inicialização locais/relativos.
- git diff --check aprovado.
- Verificações anteriores em navegador: desktop claro/escuro, tela de 390 px, seleção, edição de cor, busca nas configurações, comparação, inversão dos painéis e divisória.
- Testes DOM simulam geometria e transporte de Worker; há teste separado do módulo real do worker em outra thread. As verificações não equivalem a garantir todo SVG/exportação em todos os navegadores.

## Commit manual

O CHANGELOG.md contém o resumo consolidado em Unreleased. A mensagem sugerida está em SVGaze-mensagem-commit.txt, entregue separadamente. Incluir no commit os novos módulos, estilos, testes, scripts, bibliotecas locais, licenças e lockfile além dos arquivos já modificados. Nenhum commit, stage, push ou publicação foi realizado nesta revisão.
