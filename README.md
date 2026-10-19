# OAuth Google Login

Aplicação de exemplo que demonstra como implementar autenticação com uma conta Google em uma aplicação web utilizando **React, Node.js e OAuth 2.0**.

O projeto foi desenvolvido para fins didáticos, como material de apoio às aulas de Programação Front-End, permitindo explorar a integração entre uma interface web e um servidor responsável pelo processamento da autenticação.

## Tecnologias utilizadas

- **React** — construção da interface e gerenciamento do estado.
- **JavaScript** — implementação da lógica da aplicação.
- **Node.js** — execução do servidor.
- **Express** — criação do endpoint de autenticação.
- **Google OAuth 2.0** — integração com o fluxo de autorização do Google.
- **google-auth-library** — integração com os serviços de autenticação do Google.
- **Axios** — comunicação HTTP entre o Front-End e o Back-End.
- **jwt-decode** — decodificação do JWT no navegador.
- **JSON Web Token (JWT)** — geração de um token próprio para representar a autenticação na aplicação.

## Como funciona

A aplicação utiliza o protocolo OAuth 2.0 para permitir que o usuário entre com sua conta Google. O processo envolve o Front-End, desenvolvido em React, e o Back-End, implementado com Node.js e Express.

O fluxo de autenticação funciona da seguinte maneira:

1. O usuário clica em **Login com Google**.
2. O Front-End redireciona o navegador para a página de autorização do Google, solicitando os escopos `openid`, `profile` e `email`.
3. Após a autenticação e a autorização, o Google redireciona o navegador para a aplicação com um código de autorização.
4. O Front-End captura esse código da URL e o envia ao Back-End.
5. O servidor troca o código por tokens do Google e valida o ID Token recebido.
6. Após a validação, o servidor gera um JWT próprio para a aplicação e o devolve ao Front-End.
7. O Front-End armazena o JWT no `localStorage` e decodifica seu conteúdo para obter os dados utilizados na interface.
8. Quando a página é recarregada, a aplicação recupera o JWT armazenado e tenta reconstruir o estado do usuário.

### Endpoint de autenticação

O servidor disponibiliza o seguinte endpoint:

`POST /api/auth/google`

O corpo da requisição contém o código de autorização:

```json
{
  "code": "CODIGO_DE_AUTORIZACAO"
}
```

Em caso de sucesso, a API retorna o JWT da aplicação:

```json
{
  "jwtToken": "TOKEN_DA_APLICACAO"
}
```

Os exemplos representam a estrutura das mensagens trocadas com a API. Os valores apresentados são ilustrativos.

O JWT retornado é diferente dos tokens emitidos pelo Google: ele é gerado pelo próprio servidor para uso na aplicação.

### Interface do usuário

A interface apresenta dois estados principais:

- **Não autenticado:** exibe o botão Login com Google.
- **Autenticado:** exibe uma mensagem de boas-vindas com o nome do usuário ou, como alternativa, seu identificador, além do botão Logout.

O logout remove o JWT armazenado no navegador e limpa o estado de autenticação mantido pelo React.

Essa operação encerra a sessão apenas no contexto local da aplicação. Ela não revoga os tokens emitidos pelo Google.

## Pré-requisitos

Para executar o projeto, você precisará de:

- Node.js instalado.
- npm, instalado junto com o Node.js.
- Uma conta Google.
- Um projeto configurado no Google Cloud Console.
- Credenciais OAuth 2.0 do tipo Aplicativo da Web.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/davifelipef/oauth-google-login.git
```

Acesse o diretório:

```bash
cd oauth-google-login
```

Instale as dependências:

```bash
npm install
```

## Configuração do Google OAuth

Para habilitar a autenticação, é necessário configurar as credenciais da aplicação no Google Cloud Console.

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um projeto ou selecione um projeto existente.
3. Configure a tela de consentimento OAuth, conforme solicitado pela plataforma.
4. Crie um cliente OAuth do tipo **Aplicativo da Web**.
5. Configure as origens JavaScript autorizadas e os URIs de redirecionamento.
6. Copie o ID do cliente e o segredo do cliente gerados.

### Front-End

No arquivo `src/App.js`, localize as configurações do cliente OAuth:

```javascript
const clientId = "cole seu id do cliente aqui";
const redirectUri = "http://localhost:3000";
```

Substitua o valor de `clientId` pelo ID do cliente fornecido pelo Google Cloud Console.

O endereço `http://localhost:3000` corresponde ao ambiente de desenvolvimento local. Caso o endereço da aplicação seja alterado, atualize também as configurações correspondentes no Google Cloud Console.

### Back-End

No arquivo `server.js`, configure as credenciais utilizadas pelo servidor OAuth.

O ID do cliente deve corresponder ao configurado no Front-End. O segredo do cliente deve permanecer exclusivamente no Back-End.

Em uma aplicação real, armazene essas credenciais em variáveis de ambiente, evitando incluí-las diretamente no código-fonte ou publicá-las no repositório.

**Importante:** os nomes das configurações devem corresponder aos utilizados efetivamente pelo servidor.

## Executando a aplicação

A aplicação possui dois processos independentes: o servidor Express e o servidor de desenvolvimento do React.

### 1. Inicie o Back-End

Abra um terminal na raiz do projeto e execute:

```bash
node server.js
```

O servidor Express utiliza a porta `5000`.

Mantenha esse terminal aberto durante a execução da aplicação.

### 2. Inicie o Front-End

Abra outro terminal na raiz do projeto e execute:

```bash
npm start
```

O Create React App iniciará o servidor de desenvolvimento.

### 3. Acesse a aplicação

Abra o navegador e acesse:

http://localhost:3000

Clique em **Login com Google** para iniciar o processo de autenticação.

Mantenha os dois processos em execução durante os testes.

## Scripts disponíveis

Os seguintes scripts são normalmente disponibilizados pelo Create React App e devem ser conferidos no `package.json` do projeto:

| Comando         | Descrição                                                                       |
| --------------- | ------------------------------------------------------------------------------- |
| `npm start`     | Inicia o servidor de desenvolvimento do React.                                  |
| `npm test`      | Executa os testes configurados no projeto.                                      |
| `npm run build` | Gera a versão de produção do Front-End no diretório `build`.                    |
| `npm run eject` | Expõe as configurações internas do Create React App. A operação é irreversível. |

O servidor Express é iniciado separadamente por meio do comando `node server.js`.

## Estrutura do projeto

A estrutura principal da aplicação é organizada da seguinte forma:

```text
oauth-google-login/
├── public/
├── src/
│   └── App.js
├── package.json
├── package-lock.json
└── server.js
```

- `src/App.js`: implementa a interface, inicia o fluxo de autenticação com o Google, envia o código de autorização ao Back-End e gerencia o JWT no navegador.
- `server.js`: implementa o servidor Express e o endpoint responsável pelo processamento da autenticação.
- `package.json`: declara as dependências e os scripts do projeto.
- `package-lock.json`: registra as versões das dependências resolvidas pelo npm.
- `public/`: contém os arquivos públicos utilizados pelo Front-End.

## Segurança e limitações

Este projeto tem finalidade didática e não deve ser considerado uma implementação pronta para produção.

### Armazenamento do JWT

A aplicação utiliza `localStorage` para persistir o token entre recarregamentos da página.

Embora essa abordagem facilite a implementação de uma demonstração, o token pode ser acessado por JavaScript executado na mesma origem. Uma vulnerabilidade de Cross-Site Scripting (XSS), por exemplo, pode comprometer esse armazenamento.

Para aplicações reais, é necessário avaliar cuidadosamente a estratégia de gerenciamento de sessão e os riscos envolvidos.

### Decodificação e validação do JWT

A biblioteca `jwt-decode` permite acessar as informações contidas no token, mas não verifica sua assinatura nem garante sua autenticidade.

A decodificação realizada pelo Front-End é utilizada para apresentar os dados do usuário na interface. Ela não deve ser considerada uma validação de segurança.

Se o JWT for utilizado para autorizar operações no Back-End, o servidor deverá verificar sua assinatura, sua expiração e as demais condições necessárias antes de aceitar o token.

### Proteção das credenciais OAuth

O ID do cliente é utilizado pelo Front-End para iniciar o fluxo de autorização. O segredo do cliente, por sua vez, deve permanecer exclusivamente no servidor.

Em uma aplicação de produção:

- Armazene credenciais e segredos em variáveis de ambiente ou em um gerenciador de segredos apropriado.
- Não publique credenciais privadas no repositório.
- Utilize HTTPS nos ambientes de produção.
- Configure corretamente as origens e os URIs autorizados.

### Proteção do fluxo OAuth

O fluxo implementado é uma demonstração didática e não contempla todas as proteções recomendadas para aplicações reais.

Entre as melhorias necessárias estão:

- Implementar e validar o parâmetro `state`, protegendo o fluxo contra ataques de falsificação de requisição.
- Avaliar o uso do PKCE, conforme as características do cliente e do fluxo de autorização.
- Validar corretamente os tokens recebidos do Google no Back-End.
- Restringir os endereços de redirecionamento aos previamente autorizados.

### Sessão e logout

O logout implementado remove o JWT do `localStorage` e limpa o estado do usuário no React.

Essa operação não revoga os tokens emitidos pelo Google nem invalida automaticamente um JWT que ainda esteja válido.

Caso a aplicação seja ampliada para incluir operações protegidas, será necessário implementar a validação do JWT no servidor e definir uma estratégia adequada para o gerenciamento e o encerramento das sessões.

### Tratamento de erros

Atualmente, o Front-End registra erros de autenticação e comunicação no console do navegador.

Uma aplicação real deve apresentar mensagens apropriadas ao usuário, tratar falhas de maneira consistente e evitar a exposição de informações internas ou sensíveis.

## Objetivos educacionais

O projeto permite estudar, na prática:

- Integração entre Front-End e Back-End.
- Fluxos de autorização e autenticação com um provedor externo.
- Comunicação entre aplicações por meio de requisições HTTP.
- Criação de endpoints com Express.
- Troca de códigos de autorização por tokens.
- Diferenças entre ID Tokens e JWTs próprios da aplicação.
- Gerenciamento de estado com React.
- Persistência de dados no `localStorage`.
- Decodificação e validação de tokens.
- Configuração de credenciais OAuth.
- Cuidados de segurança no desenvolvimento de aplicações web.

## Finalidade educacional

O objetivo deste projeto é servir como referência prática para o estudo da autenticação em aplicações web, demonstrando a comunicação entre uma interface desenvolvida com React e um servidor Node.js responsável pela integração com o Google.

O código pode ser utilizado como ponto de partida para atividades práticas, experimentações e extensões propostas durante as aulas de Programação Front-End.
