# Configurar os depoimentos

## Atualizar uma instalação existente para gerenciar os depoimentos

Para habilitar a listagem administrativa, edição e exclusão, substitua todo o código no editor do Apps Script pelo conteúdo atualizado de `google-apps-script/Code.gs`. Salve e use **Implantar → Gerenciar implantações → Editar (lápis) → Nova versão → Implantar** na implantação existente. Só salvar o código não atualiza o endereço `/exec`.

Mantenha a mesma URL e a propriedade `API_SECRET`. Não precisa recriar a planilha, alterar os cabeçalhos ou executar `configurarPlanilha` novamente. Os registros existentes serão mantidos. No ambiente local, reinicie `npm run dev` se a API não atualizar; na Vercel, publique o código novo.

Depois do login em `/admin/depoimentos`, a listagem mostra os publicados e ocultos. Use **Novo depoimento** para cadastrar, **Editar** para alterar os dados e a publicação, e **Excluir** para remover. A exclusão pede confirmação e remove a linha da planilha pelo ID. **Cancelar** não grava alterações.

A edição preserva o ID e a data de criação. Não altere os IDs manualmente na planilha; IDs duplicados impedem a edição/exclusão desse registro para evitar alterar a linha errada. Recarregue a landing page para consultar os dados atualizados.

## 1. Preparar a planilha automaticamente

1. Abra a planilha na conta que tem permissão de edição (preferencialmente a conta do proprietário).
2. No menu superior, clique em **Extensões → Apps Script**.
3. Apague o código inicial do editor e cole todo o conteúdo de `google-apps-script/Code.gs` deste projeto. Salve.
4. Na lista de funções ao lado do botão Executar, selecione **configurarPlanilha**.
5. Clique em **Executar** e autorize o acesso solicitado pelo Google para este script.
6. Volte à planilha: uma aba chamada **depoimentos** aparecerá na parte inferior, junto de abas como “Página1”. Clique nela para ver as colunas. Não é necessário renomear Página1 nem configurar H2:H.

O script cria os cabeçalhos e as caixas de seleção nas colunas **D (eh_adulto)** e **I (ativo)**. Não insere depoimentos de exemplo. Se a aba depoimentos já tiver os cabeçalhos antigos, renomeie essa aba para **depoimentos_antigos** e execute novamente. Isso preserva o conteúdo anterior.

## 2. Publicar o Apps Script

1. No editor do Apps Script, abra **Configurações do projeto** (engrenagem à esquerda).
2. Em **Propriedades do script**, copie o valor de **API_SECRET**. Essa chave foi gerada pela função de configuração; mantenha-a em segredo.
3. Clique em **Implantar → Nova implantação**.
4. Selecione o tipo **App da Web**.
5. Em **Executar como**, escolha **Eu**.
6. Em **Quem pode acessar**, escolha **Qualquer pessoa**. A conta Google precisa permitir essa opção. A API do script exige a chave mesmo assim.
7. Clique em **Implantar**, autorize se solicitado e copie a **URL do app da Web**, terminada em `/exec`.

A planilha permanece com acesso **Restrito**. O script acessa a planilha com a autorização de quem publicou. Nunca coloque a chave API_SECRET em código do navegador.

Quando alterar o código do Apps Script, atualize a implantação em **Implantar → Gerenciar implantações → Editar → Nova versão → Implantar**.

## 3. Configurar a Vercel

Em **Settings → Environment Variables** do projeto, adicione:

| Variável | Valor |
| --- | --- |
| `GOOGLE_APPS_SCRIPT_URL` | URL do app da Web terminada em `/exec` |
| `GOOGLE_APPS_SCRIPT_SECRET` | Valor de API_SECRET do Apps Script |
| `ADMIN_EMAIL` | `pedrolucasbfreitas@gmail.com` |
| `ADMIN_PASSWORD` | Uma senha exclusiva e longa que você escolher |

Use os ambientes em que deseja testar (Production e, se necessário, Preview). Faça um novo deploy para aplicar o código e as variáveis. Não use prefixo `VITE_` para essas variáveis. Não envie senhas ou API_SECRET pelo chat nem faça commit desses valores.

O formulário usa e-mail e senha próprios do cadastro; **não é login com Google e não usa a senha do Gmail**. A API na Vercel valida as credenciais a cada cadastro; o navegador não persiste a senha. A chave de integração é enviada somente da Vercel para o Apps Script.

## 4. Testar

1. Abra `/admin/depoimentos` no endereço da Vercel.
2. Digite o e-mail e a senha configurados na Vercel.
3. Clique em **Novo depoimento** e cadastre Fabrício/Bernardo/8, Andréia/Pietro/9 e Sheila/Gabriel/11, com **É adulto?** desmarcado, nota 5 e ordens 1, 2 e 3. Use os textos dos depoimentos fornecidos na conversa.
4. Confira cada linha criada na planilha e recarregue a página inicial para consultar os cards.
5. Teste um adulto marcando **É adulto?**: nome e idade do atleta desaparecem. O card mostra o autor como **Atleta**.
6. Na listagem, clique em **Editar**. Desmarque **Publicar no site** para ocultar e ajuste **Ordem de exibição** para reordenar. Salve e recarregue o site para ver as alterações.
7. Crie um depoimento temporário e teste **Excluir**: primeiro cancele a confirmação, depois confirme. Confira que apenas a linha desse depoimento foi removida.

A seção exibe somente os depoimentos ativos retornados pela planilha. Enquanto a consulta carrega, a seção mostra cards skeleton animados. Se não houver depoimentos ativos ou se a integração estiver indisponível, a seção fica oculta. Não há depoimentos estáticos de reserva.

O cadastro só confirma sucesso após a resposta da planilha. Se a conexão cair durante a gravação, confira a planilha antes de repetir para evitar duplicar um depoimento.

## Desenvolvimento local

`npm run dev` inicia o frontend e a API local com a mesma autenticação usada na Vercel. Configure as quatro variáveis em `.env` ou `.env.local` (ignorados pelo Git) e reinicie o servidor após alterá-las. Abra `/admin/depoimentos` e entre com `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Não publique arquivos com segredos. As credenciais ficam apenas na memória da tela: ao recarregar ou sair, faça login novamente.

Validação local: `node --test tests/testimonials-crud.test.js` e `npm run build`.
