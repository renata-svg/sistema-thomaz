import { createFileRoute } from "@tanstack/react-router";
import { DEPTOS, RECORRENTES } from "@/lib/dados";

export const Route = createFileRoute("/_app/recorrentes")({ component: Recorrentes });

const nome = (id: string) => RECORRENTES.find((r) => r.id === id)?.nome || id;

function Recorrentes() {
  return (
    <div className="pagina larga">
      <main>
        <h1 className="titulo-pagina">Recorrentes</h1>
        <p className="dica" style={{ marginTop: -10, marginBottom: 16 }}>
          O modelo de cada obrigação. Todo mês o sistema cria uma tarefa por empresa que se encaixa (regime, tem folha), com o
          responsável da empresa naquele departamento.
        </p>
        {DEPTOS.map((d) => (
          <div key={d} className="cartao">
            <h2>{d}</h2>
            <table className="tabela">
              <thead><tr><th>Obrigação</th><th>Para quem</th><th>Meta</th><th>Prazo legal</th><th>Depende de</th><th>Envia ao cliente</th></tr></thead>
              <tbody>
                {RECORRENTES.filter((r) => r.depto === d).map((r) => (
                  <tr key={r.id}>
                    <td><b>{r.nome}</b><div className="dica">{r.checklist.length} passos{r.multa ? " · gera multa" : ""}</div></td>
                    <td>{r.regimes.length === 3 ? "Todos os regimes" : r.regimes.join(", ")}{r.soComFolha ? " · com folha" : ""}</td>
                    <td className="nowrap">dia {r.meta}</td>
                    <td className="nowrap">dia {r.prazoLegal}</td>
                    <td>{r.dependeDe.length ? r.dependeDe.map(nome).join(", ") : "—"}</td>
                    <td>{r.envio ? <span className="selo ok">{r.envio.para}</span> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </main>
    </div>
  );
}
