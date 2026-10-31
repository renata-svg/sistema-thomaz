import { Link } from "@tanstack/react-router";
import { COR, estado, fmtComp, fmtData, pendencias, ROTULO, type Tarefa } from "@/lib/dados";

export function SeloEstado({ t, todas }: { t: Tarefa; todas: Tarefa[] }) {
  const e = estado(t, todas);
  return <span className={`selo ${COR[e]}`}>{ROTULO[e]}</span>;
}

export function TabelaTarefas({ lista, todas, vazio = "Nenhuma tarefa." }: { lista: Tarefa[]; todas: Tarefa[]; vazio?: string }) {
  if (!lista.length) return <p className="vazio">{vazio}</p>;
  return (
    <div className="rolagem">
      <table className="tabela">
        <thead>
          <tr><th>Tarefa</th><th>Empresa</th><th>Comp.</th><th>Depto.</th><th>Responsável</th><th>Meta</th><th>Prazo legal</th><th>Situação</th></tr>
        </thead>
        <tbody>
          {lista.map((t) => {
            const p = pendencias(t, todas);
            return (
              <tr key={t.id}>
                <td>
                  <Link to="/tarefas/$id" params={{ id: t.id }}><b>{t.rec.nome}</b></Link>
                  {t.situacao !== "concluida" && p.length > 0 && <div className="dica">espera: {p.map((x) => x.rec.nome).join(", ")}</div>}
                  {t.envios.length > 0 && <div className="dica">✉ enviada ao cliente</div>}
                </td>
                <td>{t.empresa.codigo} · {t.empresa.nome}</td>
                <td className="nowrap">{fmtComp(t.comp)}</td>
                <td><span className={`depto d-${t.rec.depto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()}`}>{t.rec.depto}</span></td>
                <td>{t.resp}</td>
                <td className="nowrap">{fmtData(t.meta)}</td>
                <td className="nowrap">{fmtData(t.prazo)}</td>
                <td className="nowrap"><SeloEstado t={t} todas={todas} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const ORDEM = { multa: 0, atrasada: 1, hoje: 2, "no-prazo": 3, bloqueada: 4, concluida: 5 };
export function ordenar(lista: Tarefa[], todas: Tarefa[]) {
  return [...lista].sort((a, b) => ORDEM[estado(a, todas)] - ORDEM[estado(b, todas)] || a.prazo.getTime() - b.prazo.getTime() || a.empresa.codigo - b.empresa.codigo);
}
