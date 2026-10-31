import { createFileRoute, Link } from "@tanstack/react-router";
import { DEPTOS, EMPRESAS } from "@/lib/dados";

export const Route = createFileRoute("/_app/empresas")({ component: Empresas });

function Empresas() {
  return (
    <div className="pagina larga">
      <main>
        <h1 className="titulo-pagina">Empresas e responsáveis</h1>
        <div className="cartao">
          <table className="tabela">
            <thead><tr><th>Cód.</th><th>Empresa</th><th>Regime</th>{DEPTOS.map((d) => <th key={d}>{d}</th>)}<th>Contatos (o que recebem)</th></tr></thead>
            <tbody>
              {EMPRESAS.map((e) => (
                <tr key={e.id}>
                  <td>{e.codigo}</td>
                  <td><Link to="/tarefas" search={{ empresa: e.id }}><b>{e.nome}</b></Link><div className="dica">{e.cnpj}{e.temFolha ? "" : " · sem folha"}</div></td>
                  <td>{e.regime}</td>
                  {DEPTOS.map((d) => <td key={d}>{e.resp[d]}</td>)}
                  <td>{e.contatos.map((c) => <div key={c.email}>{c.nome} &lt;{c.email}&gt; <span className="dica">{c.recebe.join(", ")}</span></div>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
