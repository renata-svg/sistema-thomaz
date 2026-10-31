import { createFileRoute, Link } from "@tanstack/react-router";
import { DEPTOS, EQUIPE, estado, useTarefas } from "@/lib/dados";

export const Route = createFileRoute("/_app/equipe")({ component: Equipe });

function Equipe() {
  const todas = useTarefas();
  return (
    <div className="pagina larga">
      <main>
        <h1 className="titulo-pagina">Equipe</h1>
        {DEPTOS.map((d) => (
          <div key={d} className="cartao">
            <h2>{d}</h2>
            <table className="tabela">
              <thead><tr><th>Pessoa</th><th className="num">Abertas</th><th className="num">Atrasadas</th><th className="num">Concluídas</th></tr></thead>
              <tbody>
                {EQUIPE[d].map((p) => {
                  const l = todas.filter((t) => t.resp === p && t.rec.depto === d);
                  return (
                    <tr key={p}>
                      <td><Link to="/tarefas" search={{ resp: p }}>{p}</Link></td>
                      <td className="num">{l.filter((t) => t.situacao !== "concluida").length}</td>
                      <td className="num">{l.filter((t) => ["multa", "atrasada"].includes(estado(t, todas))).length}</td>
                      <td className="num">{l.filter((t) => t.situacao === "concluida").length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </main>
    </div>
  );
}
