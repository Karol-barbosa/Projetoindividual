# Web Application Document - Projeto Individual - Módulo 2 - Inteli

##  BookUp

#### Autora: Karol Rocha Barbosa

## Sumário

1. [Introdução](#c1)  
2. [Visão Geral da Aplicação Web](#c2)  
3. [Projeto Técnico da Aplicação Web](#c3)  
4. [Desenvolvimento da Aplicação Web](#c4)  
5. [Referências](#c5)  

<br>

## <a name="c1"></a>1. Introdução (Semana 01)

 Projeto: Sistema de reserva de Salas de Estudo 

&nbsp;&nbsp;&nbsp;&nbsp; No Inteli (faculdade de tecnologia e liderança), trabalhamos em grupo para desenvolver projetos para empresas parceiras. Muita vezes, as equipes precisam de uma salinha reservada para trabalhar com mais foco. A faculdade tem algumas dessas salinhas pelo campus, porém, atualmente, os alunos precisam ir à recepção para reservar, o que pode ser um processo complicado, especialmente para estudantes de outros anos, que começam as aulas em horários diferentes. Por exemplo, os alunos do primeiro ano iniciam às 7h40, enquanto os do segundo ano começam às 10h, tornando a reserva mais vantajosa para os primeiros. Além disso, a reserva só pode ser feita no mesmo dia, e algumas salas são fixas para determinadas pessoas, o que limita a disponibilidade. 

 &nbsp;&nbsp;&nbsp;&nbsp; Pensando nisso, o objetivo deste projeto é criar um sistema online para reserva de salas de estudo. O sistema permitirá que os alunos visualizem, em tempo real, as salas disponíveis e realizem suas reservas diretamente pelo site. O projeto iria continuar com a regra atual de reservar no mesmo dia, e também continuaram com as salas fixas, mas o aluno poderia ver as salas que já estão reservadas e reservar um horário. Com isso, pretende-se melhorar a organização, otimizar o tempo dos usuários e tornar o processo mais acessível.

---

## <a name="c2"></a>2. Visão Geral da Aplicação Web

### 2.1. Personas (Semana 01)

&nbsp;&nbsp;&nbsp;&nbsp; Com o intuito de atender às necessidades dos usuários, é essencial entender quem serão as pessoas que utilizarão o sistema e definir as personas de quem vai usufruir da plataforma. No caso do BookUp, o sistema de reserva de salas de estudo, é fundamental conhecer as características, desejos e desafios dos usuários para criar uma solução que seja útil.A seguir, apresentamos uma persona que representa os principais usuários do sistema e suas necessidades.

<br>

<div align="center">
<sub>Figura 01 - Persona</sub>
 
<br>
<br>
<img src="assets/Persona.png" alt='imagem da persona' width="100%">
<br>
<br>

<sup>Fonte: Material produzido pela autora (2025)</sup>

</div>

<br>

Assim, o BookUp resolve o problema do usuário de forma prática.



### 2.2. User Stories (Semana 01)

US01: Como estudante, quero reservar uma sala de estudos diretamente pelo site, para que eu consiga agendar sem precisar ir até a recepção.

US02: Como usuário, quero ver a disponibilidade das salas em tempo real, para conseguir ver se há salas livres no momento e realizar a reserva.

US03: Como usuário, quero visualizar quais salas são fixas para determinadas pessoas, para que eu possa entender melhor a disponibilidade e planejar minha reserva.

US04: Como usuário, gostaria de poder cancelar minha reserva de sala até um certo horário antes da ocupação, para liberar a sala para outras pessoas caso eu não precise mais dela.

Análise INVEST da US02

I = A possibilidade de ver a disponibilidade das salas em tempo real pode ser desenvolvida de forma independente, sem depender de outras funcionalidades como agendamento ou cancelamento. 

N = Podemos negociar aspectos como a forma de visualização lista, mapa interativo, etc. ou a atualização da disponibilidade tempo real contínuo ou a cada minuto.

V = Essa funcionalidade é valiosa porque resolve um problema real dos usuários. Saber a disponibilidade das salas em tempo real facilita a reserva e evita que os usuários percam tempo verificando manualmente.

E = É possível estimar o esforço necessário para desenvolver a funcionalidade. Embora envolva integração com o banco de dados e a interface do usuário, o trabalho pode ser dividido em partes menores, como a criação do banco de dados de reservas e a atualização da interface.

S = A User Story pode ser quebrada em tarefas menores, como:
Criar a estrutura do banco de dados para as salas.
Implementar o sistema de atualização em tempo real.
Desenvolver a interface para exibição da disponibilidade.

T = A funcionalidade é testável. Podemos verificar se a disponibilidade das salas está sendo exibida corretamente e se é atualizada conforme o esperado. Também é possível testar casos em que a sala está ocupada e quando está disponível.


---

## <a name="c3"></a>3. Projeto da Aplicação Web

### 3.1. Modelagem do banco de dados  (Semana 3)

O modelo abaixo representa a estrutura do banco de dados utilizada no sistema de reservas de salas. Para construir esse modelo lógico, utilizei a ferramenta Draw.io. Onde defini as principais entidades, seus atributos e os relacionamentos entre elas.

O sistema foi estruturado com três tabelas principais:

• Usuário: que armazena os dados dos usuários do sistema, como e-mail e senha.

• Salas: Guarda as informações das salas que podem ser reservadas. como o número.

• Reserva: Essa tabela registra cada reserva feita por um usuário em uma sala. como id, usuario_id, sala_id, data_checkin, data_checkout e status

Relacionamentos:

• Um usuário pode realizar várias reservas (1:N).    
• Uma sala pode ser reservada várias vezes (1:N).    
• Cada reserva está sempre vinculada a um usuário e uma sala.

Esse modelo garante uma estrutura organizada, facilita a integridade dos dados e permite futuras expansões no sistema.

<br>
<div align="center">
<sub>Figura 02 - Modelo Lógico</sub>
<br>
<br>
<img src="assets/modelo.drawio.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>

</div>

<br>

Esse modelo de banco de dados oferece uma estrutura eficiente e organizada para o sistema de reservas de salas,

[Clique aqui para acessar o modelo SQL](modelo.sql)


### 3.1.1 BD e Models (Semana 5)

O sistema utiliza um banco de dados relacional PostgreSQL (via Supabase) com três tabelas principais: users, salas e reservas. Cada tabela representa um model no sistema e armazena dados fundamentais para o funcionamento da aplicação de reserva de salas.

## Tabela Users
# 3.1.1 Modelos de Banco de Dados (BD e Models)

O sistema utiliza um banco de dados relacional PostgreSQL (via Supabase) com três tabelas principais: **users**, **salas** e **reservas**. Cada tabela representa um *model* no sistema e armazena dados fundamentais para o funcionamento da aplicação de reserva de salas.

---

### Tabela: `users`

Armazena os dados dos usuários do sistema.

| Campo | Tipo  | Descrição                    |
|-------|-------|-----------------------------|
| `id`  | UUID  | Identificador único do usuário |
| `name`| TEXT  | Nome do usuário             |
| `email`| TEXT | Email do usuário            |

---

### Tabela: `salas`

Contém informações sobre as salas disponíveis para reserva.

| Campo       | Tipo    | Descrição                     |
|-------------|---------|-------------------------------|
| `id`        | UUID    | Identificador único da sala    |
| `numero`      | TEXT    |   Número da sala               |
| `nome`| INTEGER | Nome do usuário      |


---

### Tabela: `reservas`

Registra as reservas feitas pelos usuários.

| Campo         | Tipo  | Descrição                                   |
|---------------|-------|---------------------------------------------|
| `id`          | UUID  | Identificador único da reserva               |
| `usuario_id`  | UUID  | Referência ao usuário que fez a reserva      |
| `sala_id`     | UUID  | Referência à sala reservada                   |
| `data_checkin`| DATE  | Data de início da reserva                     |
| `data_checkout`| DATE | Data de fim da reserva                         |
| `status`      | TEXT  | Status da reserva (pendente, confirmada...) |

---

### 3.2. Arquitetura (Semana 5)

 A imagem mostra a arquitetura do sistema baseado em MVC, com a comunicação entre cliente, servidor e banco de dados. As camadas de controllers e models organizam as funções e acessos aos dados de usuários, salas e reservas.


<br>
<div align="center">
<sub>Figura 3 - Arquitetura </sub>
<br>
<br>
<img src="assets/diagrama.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>

</div>

<br>


### 3.3. Wireframes (Semana 03)

Abaixo estão todos os wireframes desenvolvidos para o site, representando a estrutura visual e a navegação entre as principais telas da aplicação:

<div align="center">
<sub>Figura 04 - Tela Login</sub>
<br>
<br>
<img src="assets/login.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>

</div>


<div align="center">
<sub>Figura 05 - Tela inicial </sub>
<br>
<br>
<img src="assets/tela3.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>
</div>



<div align="center">
<sub>Figura 06 - Tela Horários e Salas </sub>
<br>
<br>
<img src="assets/tela1.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>
</div>


<div align="center">
<sub>Figura 07 - Tela Horários e Salas</sub>
<br>
<br>
<img src="assets/tela2.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>

</div>

Segue o link para o figma: https://www.figma.com/design/Jzm3baNhTEWNguXyodE3WI/Untitled?node-id=0-1&t=RNA1EONufhE1tBat-1

### 3.4. Guia de estilos (Semana 05)

Este guia de estilos foi desenvolvido para garantir consistência visual e comunicativa na construção da solução BookUp. A seguir, você encontrará orientações sobre como utilizar corretamente os principais componentes: tipografia, paleta de cores e assets gráficos.

## Tipografia

A variação maior é para títulos e elementos de destaque.

A variação média é ideal para subtítulos ou botões.

A variação menor deve ser usada para textos auxiliares, legendas ou descrições.

## Cores

As cores devem ser utilizadas conforme abaixo:

#15867D (verde escuro): cor principal, usada em fundos (como cabeçalhos e barra lateral).

#3DD7CA (verde claro): cor de apoio, utilizada para realce de sessões e rodapés.

#6B7267 (cinza escuro): usada em botões e elementos de ação como filtros

#AEAAAA (cinza claro): fundo de campos de entrada e botões neutros.

#000000 (preto): usado em ícones, textos e contrastes.

## Assets

 Ícones de e-mail, usuário, cadeado e engrenagem, foram escolhidos por sua simplicidade e clareza, reforçando a usabilidade e a comunicação direta com o usuário.

<div align="center">
<sub>Figura 08 - Guia de estilos</sub>
<br>
<br>
<img src="assets/guia.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>

</div>

O guia de estilos do BookUp é uma ferramenta essencial para garantir a padronização visual, a clareza na navegação.

### 3.5. Protótipo de alta fidelidade (Semana 05)

A seguir, estão as telas do protótipo de alta fidelidade da aplicação BookUp: 
<div align="center">
<sub>Figura 09 - Login</sub>
<br>
<br>
<img src="assets/Loginn.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>
</div>


<div align="center">
<sub>Figura 10 - Tela inicial</sub>
<br>
<br>
<img src="assets/tela.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>
</div>


<div align="center">
<sub>Figura 11 - Horários e Salas</sub>
<br>
<br>
<img src="assets/tela (1).png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>
</div>



<div align="center">
<sub>Figura 12 - Horários e Salas</sub>
<br>
<br>
<img src="assets/tela (2).png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>
</div>


```Link para o Figma:``` https://www.figma.com/design/Jzm3baNhTEWNguXyodE3WI/Untitled?node-id=69-1693&t=90OSd43c8MJKb60D-1


### 3.6. WebAPI e endpoints (Semana 05)


## Usuários

- **GET /users** = Lista todos os usuários

- **GET /users/id** = Retorna um usuário específico

- **POST /users** = Cria um novo usuário

- **PUT /users/id** = Atualiza um usuário existente

- **DELETE /users** = Remove um usuário 

## Salas

- **Get /salas** = Lista todas as salas

- **Post /salas** = Cria uma nova sala

## Reservas

- **Get /reservas**= Lista todas as reservas

- **Post /reserva** = Cria uma nova reserva

- **Put /reserva/id** = Atualiza uma reserva completa

- **Patch /reserva/id/status** = Atualiza apenas o status da reserva

- **Delete /reserva/id** =  Cancela uma reserva

Os endpoints foram organizados para garantir clareza, eficiência e fácil integração com o sistema, facilitando futuras manutenções e melhorias.

### 3.7 Interface e Navegação (Semana 07)

Nesta etapa do projeto, foi desenvolvido o frontend do sistema web, com foco em páginas funcionais para cadastro e login de usuários. Utilizando EJS (Embedded JavaScript Templates) no Node.js, criamos interfaces simples e funcionais que se comunicam diretamente com o backend já implementado com Supabase.

## Página de Cadastro

A página de cadastro permite que novos usuários criem uma conta informando e-mail e senha. 

<div align="center">
<sub>Figura 13 - Cadastro</sub>
<br>
<br>
<img src="assets/teladois.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>

---

## Login

A tela de login permite que usuários registrados entrem no sistema. 


<div align="center">
<sub>Figura 14 - Login</sub>
<br>
<br>
<img src="assets/telaum.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>

## Reservar 

Nesta tela, o usuário pode reservar uma sala de estudo escolhendo a data, o horário e a sala desejada. Após preencher as informações, ele clica no botão "Reservar".


<div align="center">
<sub>Figura 15 - Reserva</sub>
<br>
<br>
<img src="assets/telatres.png" alt='imagem do modelo' width="100%">
<br>
<br>
<sup>Fonte: Material produzido pela autora (2025)</sup>

## <a name="c4"></a>4. Desenvolvimento da Aplicação Web (Semana 8)

### 4.1 Demonstração do Sistema Web (Semana 8)

*VIDEO: Insira o link do vídeo demonstrativo nesta seção*
*Descreva e ilustre aqui o desenvolvimento do sistema web completo, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

### 4.2 Conclusões e Trabalhos Futuros (Semana 8)

*Indique pontos fortes e pontos a melhorar de maneira geral.*
*Relacione também quaisquer outras ideias que você tenha para melhorias futuras.*



## <a name="c5"></a>5. Referências

_Incluir as principais referências de seu projeto, para que seu parceiro possa consultar caso ele se interessar em aprofundar. Um exemplo de referência de livro e de site:_<br>

---
---
