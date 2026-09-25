# Fragrantica Reworked

Deixa o Fragrantica mais agradavel de usar: aproveita a tela inteira, aumenta as fotos dos perfumes, tira os anuncios e junta as resenhas em ingles do fragrantica.com com as resenhas em portugues do fragrantica.com.br.

Nao e um site nem um aplicativo: e uma extensao de navegador para Chrome, Edge, Brave, Opera e Firefox, com instalacao manual (nao esta nas lojas de extensoes).

Baixar a ultima versao: https://github.com/yodog/fragrantica-reworked/releases/latest

> Projeto pessoal, sem nenhuma ligacao oficial com o Fragrantica. Nasceu como userscript: https://github.com/yodog/userscripts

## O que ele faz

### Na pagina de um perfume

- **Fotos maiores**: a primeira imagem passa a ser a arte de divulgacao do perfume, em resolucao alta. A foto normal continua logo abaixo, do mesmo tamanho.
- **Resenhas em ingles junto com as brasileiras**: as 10 resenhas mais recentes escritas em ingles, no site fragrantica.com, sao buscadas em segundo plano e misturadas com as resenhas em portugues. Tudo fica ordenado da mais recente para a mais antiga. As resenhas vindas do site em ingles aparecem com uma borda azul a esquerda, para voce saber de onde vieram.
- **Pros e contras**: a secao "O que as pessoas dizem" do site em ingles e copiada para o topo da area de resenhas.
- **Datas completas**: onde antes aparecia so "17 horas atras", agora aparece tambem a data e a hora exatas (formato AAAA-MM-DD HH:MM:SS).
- **Resenhas inteiras**: o corte de texto do "ler mais" e removido, entao a resenha aparece completa sem precisar clicar.
- **Piramide olfativa com votos**: os votos aparecem automaticamente, sem precisar clicar em "Mostrar votos".
- **Resenhas carregadas na hora**: a area de resenhas e aberta assim que a pagina carrega, em vez de esperar voce rolar ate ela. Acontece um leve movimento de rolagem que volta para o topo logo em seguida.
- **Sem anuncios**: os banners do Freestar e do Yandex e os quadros de anuncio sao removidos, junto com os blocos marcados como "Sponsored".
- **Carrossel do lado das resenhas**: o carrossel de perfumes sobe para perto da area de resenhas, em vez de ficar perdido no meio da pagina.

### No seu perfil e na estante

- **Tela inteira**: a largura maxima do site e liberada, aproveitando todo o espaco da sua tela.
- **Miniaturas grandes**: aquelas fotos minusculas dos perfumes na estante ficam grandes.

### Em qualquer pagina do fragrantica.com.br

- **Sem largura travada**: o conteudo ocupa a tela toda, em qualquer pagina do site.
- **Fotos sem espera**: as imagens que aparecem nas listas e na estante carregam na hora, sem o atraso do carregamento preguicoso.

## Instalacao

### Chrome, Edge, Brave e Opera

1. Na pagina de releases, baixe o arquivo que termina em `.zip`.
2. Extraia o conteudo em uma pasta que voce nao vai apagar (por exemplo, `Documentos/fragrantica-reworked`).
3. Abra `chrome://extensions` no Chrome (no Edge, `edge://extensions`).
4. Ligue o **Modo do desenvolvedor**, no canto superior direito.
5. Clique em **Carregar sem compactacao** e escolha a pasta que voce extraiu.
6. Pronto. Nao mova nem apague essa pasta depois, senao a extensao para de funcionar.

### Firefox

1. Na pagina de releases, baixe o arquivo que termina em `.xpi`.
2. Escolha uma das duas formas de instalar:
   - **Temporaria** (some quando voce fechar o navegador): abra `about:debugging#/runtime/this-firefox`, clique em **Carregar add-on temporario** e escolha o arquivo `.xpi`.
   - **Permanente**: disponivel no Firefox Developer Edition, Nightly ou ESR. Abra `about:config`, aceite o aviso, mude `xpinstall.signatures.required` para `false` e depois abra o arquivo `.xpi` baixado. A extensao nao e assinada, e por isso o Firefox comum nao aceita.

## O que esperar ao usar

- Nao ha botoes nem tela de opcoes: instale e navegue normalmente.
- Ao abrir a pagina de um perfume, a extensao abre uma aba do fragrantica.com escondida em segundo plano, espera a verificacao de seguranca do site passar, le as resenhas em ingles e fecha essa aba sozinha. Voce pode ver uma aba aparecer e sumir na barra de abas: e normal, nao e preciso fazer nada.
- As resenhas em ingles chegam alguns segundos depois das brasileiras, ja misturadas na ordem certa.
- Se o site em ingles demorar mais de 30 segundos para liberar (por causa da verificacao de seguranca), as resenhas em ingles nao aparecem nesta visita. Basta recarregar a pagina.

## Como atualizar

1. Baixe o arquivo da versao nova na pagina de releases.
2. Chrome, Edge, Brave e Opera: extraia por cima da pasta que voce ja usa (substituindo os arquivos) e depois clique no botao de recarregar no cartao da extensao em `chrome://extensions`.
3. Firefox: repita a instalacao temporaria, ou instale o `.xpi` novo por cima do antigo se voce usa a instalacao permanente.

## Limitacoes conhecidas

- So funciona nas paginas do fragrantica.com.br. As resenhas em ingles vem do fragrantica.com, mas os ajustes de layout nao se aplicam ao site em ingles.
- Precisa de internet para buscar as resenhas em ingles, e essa busca consome um pouco da sua banda.
- O Fragrantica muda de layout de vez em quando. Quando isso acontece, algum ajuste pode parar de funcionar ate sair uma versao nova.
- O movimento de rolagem que abre a area de resenhas nao acontece se voce ja tiver rolado a pagina.

## Privacidade

- Nada e enviado para servidores de terceiros e nada e salvo sobre voce: a extensao apenas le a pagina do Fragrantica que voce ja abriu.
- Ela pede tres permissoes: acessar a aba atual, executar codigo nas paginas do Fragrantica e abrir e fechar a aba escondida do site em ingles. Sem essas permissoes, a mistura de resenhas nao funciona.
- Nenhum dado pessoal e coletado ou compartilhado.

## Creditos e origem

- Criado por [yodog](https://github.com/yodog), a partir do userscript *Fragrantica new options*.
- Quando a pagina nao traz as bibliotecas que a extensao usa, elas sao carregadas de CDN publica (jQuery e Sugar.js). Se o seu navegador ou rede bloquear essas CDNs, alguns ajustes podem nao funcionar.

## Encontrou um problema ou tem uma sugestao

Abra uma issue em https://github.com/yodog/fragrantica-reworked/issues descrevendo o que voce fez, o que esperava e o que aconteceu. Se puder, diga tambem qual navegador e qual versao da extensao voce esta usando (a versao aparece no cartao da extensao em `chrome://extensions` ou em `about:debugging`).

## Aviso

Projeto pessoal e sem qualquer vinculo oficial com o Fragrantica. Nao ha garantia de funcionamento: o site muda com o tempo e esta extensao e mantida por hobby. Use por sua conta e risco.
