# Sistema Thomaz

Sistema único da Contabilidade Thomaz para Contábil, Fiscal e Pessoal, com o módulo **Processos** (controle de tarefas
no lugar do Gestta) e, depois da aprovação, o **Thomaz Integra** embutido como módulo Contábil.

Esta primeira versão é um **protótipo navegável** para apresentar aos departamentos: empresas fictícias, sem banco de
dados — o que se faz nas telas fica só no navegador (há um "Recomeçar do zero" no painel).

- Tarefas geradas das recorrentes × empresas, com meta interna, prazo legal, multa e responsável por departamento
- Dependências entre departamentos (a tarefa espera a outra e é liberada quando ela termina)
- Envio da guia/folha/relatório ao cliente por e-mail ao concluir a tarefa com o documento anexado
- Fluxos (processos eventuais), recorrentes, empresas e responsáveis, equipe

```bash
npm install
npm run dev
```
