import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/modulos/$m")({ component: Modulo });

const MODULOS: Record<string, { nome: string; depto: string; texto: string; itens: string[] }> = {
  contabil: { nome: "Contábil · Thomaz Integra", depto: "Contábil", texto: "O Thomaz Integra entra aqui depois da aprovação. As tarefas “Lançar bancos”, “Lançar impostos pagos” e “Fechamento” vão abrir direto as telas do Integra, já na empresa e na competência certas.", itens: ["Integrador de extratos (layout 401)", "Conciliador", "Impostos pagos (comprovantes da Receita)", "Migração do Escritório Inteligente"] },
  fiscal: { nome: "Fiscal", depto: "Fiscal", texto: "Espaço para as ferramentas do Fiscal, a definir com o departamento.", itens: ["Conferência de notas", "Controle de guias por município (ISS)", "Recibos de SPED, Reinf e GIA"] },
  pessoal: { nome: "Pessoal", depto: "Pessoal", texto: "Espaço para as ferramentas do Pessoal, a definir com o departamento.", itens: ["Recebimento das variáveis da folha pelo cliente", "Controle de admissões e rescisões", "Conferência FGTS × DCTFWeb"] },
};

function Modulo() {
  const { m } = Route.useParams();
  const mod = MODULOS[m];
  if (!mod) return <div className="pagina larga"><main><p>Módulo não encontrado.</p></main></div>;
  return (
    <div className="pagina larga">
      <main>
        <h1 className="titulo-pagina">{mod.nome}</h1>
        <div className="cartao">
          <p>{mod.texto}</p>
          <h3>Ideias</h3>
          <ul>{mod.itens.map((i) => <li key={i}>{i}</li>)}</ul>
          <div className="acoes"><Link to="/tarefas" search={{ depto: mod.depto }} className="botao">Ver as tarefas do departamento</Link></div>
        </div>
      </main>
    </div>
  );
}
