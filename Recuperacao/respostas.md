## Qual é a diferença entre uma aplicação WEB com renderização no cliente e no servidor? Em quais situações cada um é mais adequado?
* A diferença fundamental entre a renderização no cliente e no servidor é o local onde o código HTML é gerado. Na renderização no cliente, o código HTML é gerado no navegador do usuário por meio do JavaScript, enquanto na renderização no servidor, o código HTML é gerado no servidor antes de ser enviado para o navegador do usuário.


* A renderização no cliente é mais adequada para aplicativos que têm muita interação do usuário, como jogos e aplicativos de edição de fotos, em que as atualizações devem ser rápidas e frequentes. A renderização no cliente permite que esses aplicativos atualizem rapidamente partes específicas da página, sem a necessidade de recarregar toda a página. Além disso, a renderização no cliente também pode melhorar o desempenho do aplicativo, pois o processamento é distribuído pelo navegador do usuário.


* Por outro lado, a renderização no servidor é mais adequada para aplicativos que possuem muitas páginas com conteúdo estático e informações que não mudam com frequência. Um exemplo comum de aplicativo que usa a renderização no servidor são os sites de notícias, onde o conteúdo da página é gerado no servidor e enviado para o navegador do usuário. Isso ajuda a garantir que o conteúdo seja consistente em diferentes navegadores e dispositivos, e também ajuda a garantir que o conteúdo seja indexado corretamente pelos mecanismos de pesquisa.

## Qual é a diferença entre uma requisição síncrona e uma requisição assíncrona em programação web?
* Uma requisição síncrona é uma solicitação feita pelo cliente (geralmente um navegador da web) ao servidor, na qual o cliente espera pela resposta antes de continuar a executar o código. Isso significa que o cliente fica bloqueado (ou "travado") até que a resposta do servidor seja recebida, o que pode causar atrasos significativos em aplicativos com muitas solicitações.


* Por outro lado, uma requisição assíncrona é uma solicitação feita pelo cliente ao servidor na qual o cliente não espera pela resposta antes de continuar a executar o código. Em vez disso, o cliente continua a executar outras tarefas enquanto aguarda a resposta do servidor. Isso significa que o cliente não fica bloqueado enquanto espera a resposta, permitindo que o aplicativo continue a ser executado sem interrupções.


* As requisições assíncronas são frequentemente usadas em aplicativos da web para melhorar a experiência do usuário. Por exemplo, quando um usuário envia um formulário em uma página da web, o envio do formulário pode ser feito de forma assíncrona para que o usuário possa continuar a interagir com a página enquanto o formulário está sendo enviado. Outro exemplo é o carregamento de conteúdo dinâmico, como uma lista de tweets atualizados em tempo real, que pode ser carregado de forma assíncrona para que a página continue a ser utilizada enquanto o conteúdo é carregado em segundo plano.

## Considerando o projeto apresentado na imagem abaixo que se refere a um site estático e sabendo que o mesmo encontra-se hospedado no github pages, se o usuário acessar o link (https://frankwco.github.io/ifpr2023/contato.html) do formulário de contato, responda:
* quantas requisições o cliente (navegador) irá fazer para o servidor?
* qual o conteúdo de cada requisição?
* qual o status de cada requisição?

https://lh3.googleusercontent.com/beY4SVuLtJ7FC7UGwARaiBaPC-ui-1ezItqtuhLISrHde4VNj9D-v-OFq2tVTdLFtHDEahSHnVco4UstuZm6_jODGysES87hKgdCy3TVOHV1UsS8JOHm_CdfgIRuEBQvSO2C_vZ4_hPI5PYUtBx8UWo

* a) Quantas requisições o cliente (navegador) irá fazer para o servidor

Serão realizadas 5 requisições.

* b) Qual o conteúdo de cada requisição

  * 1ª requisição o servidor responderá com o conteúdo html da página contato.html. Quando o navegador iniciar a construção da página ele identificará outros recursos que serão necessários solicitar ao servidor, assim, ele realizará as demais requisições.

  * 2ª requisição será para o arquivo CSS com o nome meu-css.css

  * 3ª requisição será para uma imagem no caminho imagens/capa-contato.png

  * 4ª requisição será para uma imagem no caminho imagens/rodape-contato.png

  * 5ª requisição será para um arquivo javascript no caminho js/script.js


* c) Qual o status de cada requisição.

  *1ª requisição: o servidor não retornará conteúdo, status 404, pois não encontrará o arquivo no local indicado. 

  * 2ª requisição: o arquivo existe no caminho indicado, assim retornará o conteúdo e o status 200.

  * 3ª requisição: o arquivo não existe no caminho indicado, assim não retornará o conteúdo e o será status 404.

  * 4ª requisição:  o arquivo não existe no caminho indicado, assim não retornará o conteúdo e o será status 404.

  * 5ª requisição: o arquivo existe no caminho indicado, assim retornará o conteúdo e o status 200.
