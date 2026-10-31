import { createFileRoute, Link } from "@tanstack/react-router";
import { fmtComp, useTarefas } from "@/lib/dados";

export const Route = createFileRoute("/_app/envios")({ component: Envios });

function Envios() {
  const todas = useTarefas();
  const envios = todas.flatMap((t) => t.envios.map((e) => ({ t, e }))).sort((a, b) => b.e.em.localeCompare(a.e.em));
  const semEnvio = todas.filter((t) => t.situacao === "concluida" && t.rec.envio && !t.envios.length);
  return (
    <div className="pagina larga">
      <main>
        <h1 className="titulo-pagina">Envios ao cliente</h1>
        <div className="cartao">
          <h2>Como funciona</h2>
          <p>
            Cada recorrente diz o que vai para o cliente (guias, folha ou relatórios) e traz o modelo do e-mail. Quando alguém
            conclui a tarefa com o documento anexado, o e-mail sai para os contatos da empresa que recebem aquele tipo, com o
            anexo, e fica registrado aqui: quem enviou, quando, para quem e se o cliente abriu.
          </p>
        </div>
        <div className="cartao">
          <h2>Enviados ({envios.length})</h2>
          {envios.length ? (
            <table className="tabela">
              <thead><tr><th>Quando</th><th>Empresa</th><th>Assunto</th><th>Para</th><th>Anexos</th></tr></thead>
              <tbody>
                {envios.map(({ t, e }, i) => (
                  <tr key={i}>
                    <td className="nowrap">{new Date(e.em).toLocaleString("pt-BR")}</td>
                    <td>{t.empresa.nome}</td>
                    <td><Link to="/tarefas/$id" params={{ id: t.id }}>{e.assunto}</Link></td>
                    <td>{e.para.join(", ")}</td>
                    <td>{e.anexos.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="vazio">Nada enviado ainda. Abra uma tarefa de guia (DAS, ICMS, FGTS…), anexe o PDF e conclua.</p>}
        </div>
        {semEnvio.length > 0 && (
          <div className="cartao">
            <h2>Concluídas sem envio registrado ({semEnvio.length})</h2>
            <p className="dica">Guias concluídas que não passaram pelo envio do sistema (ex.: mandadas por fora, antes do sistema).</p>
            <ul>{semEnvio.slice(0, 15).map((t) => <li key={t.id}><Link to="/tarefas/$id" params={{ id: t.id }}>{t.rec.nome}</Link> · {t.empresa.nome} · {fmtComp(t.comp)}</li>)}</ul>
          </div>
        )}
      </main>
    </div>
  );
}
