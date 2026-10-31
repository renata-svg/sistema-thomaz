import { createFileRoute, Link } from "@tanstack/react-router";
import { DEPTOS, estado, fmtComp, recomecar, useTarefas, USUARIO, type Depto, type Estado } from "@/lib/dados";
import { ordenar, TabelaTarefas } from "@/components/Tarefas";

export const Route = createFileRoute("/_app/")({ component: Painel });

function Painel() {
  const todas = useTarefas();
  const conta = (lista: typeof todas, ...es: Estado[]) => lista.filter((t) => es.includes(estado(t, todas))).length;
  const minhas = ordenar(todas.filter((t) => t.resp === USUARIO && t.situacao !== "concluida"), todas);
  return (
    <div className="pagina larga">
      <main>
        <div className="boas-vindas">
          <div className="cartao-boas-vindas">
            <span>Bom trabalho,</span>
            <b>{USUARIO}</b>
            <span>Contábil, Fiscal e Pessoal no mesmo painel</span>
          </div>
        </div>

        <div className="indicadores grandes">
          <Link to="/tarefas" search={{ estado: "multa" }} className="indicador borda-erro"><div className="rot">Gerando multa</div><div className="val">{conta(todas, "multa")}</div></Link>
          <Link to="/tarefas" search={{ estado: "atrasada" }} className="indicador borda-erro"><div className="rot">Atrasadas</div><div className="val">{conta(todas, "atrasada", "multa")}</div></Link>
          <Link to="/tarefas" search={{ estado: "hoje" }} className="indicador borda-alerta"><div className="rot">Passaram da meta</div><div className="val">{conta(todas, "hoje")}</div></Link>
          <Link to="/tarefas" search={{ estado: "bloqueada" }} className="indicador"><div className="rot">Esperando outro depto.</div><div className="val">{conta(todas, "bloqueada")}</div></Link>
          <Link to="/tarefas" search={{ estado: "concluida" }} className="indicador borda-ok"><div className="rot">Concluídas</div><div className="val">{conta(todas, "concluida")}</div></Link>
        </div>

        <div className="cartao">
          <h2>Andamento por departamento</h2>
          <div className="deptos">
            {DEPTOS.map((d) => <Andamento key={d} depto={d} todas={todas} />)}
          </div>
        </div>

        <div className="cartao">
          <div className="cabecalho-cartao">
            <h2>Minhas tarefas abertas ({minhas.length})</h2>
            <Link to="/tarefas" search={{ resp: USUARIO }} className="botao secundario pequeno">Ver todas</Link>
          </div>
          <div style={{ marginTop: 12 }}><TabelaTarefas lista={minhas.slice(0, 12)} todas={todas} vazio="Nada aberto com você." /></div>
        </div>

        <p className="dica">
          Protótipo: as empresas são fictícias e o que você fizer aqui fica só neste navegador.{" "}
          <button className="link" onClick={recomecar}>Recomeçar do zero</button>
        </p>
      </main>
    </div>
  );
}

function Andamento({ depto, todas }: { depto: Depto; todas: ReturnType<typeof useTarefas> }) {
  const comps = [...new Set(todas.map((t) => t.comp))];
  return (
    <div className="andamento">
      <h3>{depto}</h3>
      {comps.map((c) => {
        const l = todas.filter((t) => t.rec.depto === depto && t.comp === c);
        const ok = l.filter((t) => t.situacao === "concluida").length;
        const atras = l.filter((t) => ["multa", "atrasada"].includes(estado(t, todas))).length;
        return (
          <Link key={c} to="/tarefas" search={{ depto, comp: c }} className="barra-linha">
            <span className="nowrap">{fmtComp(c)}</span>
            <span className="barra"><i style={{ width: `${(ok / Math.max(l.length, 1)) * 100}%` }} /></span>
            <span className="nowrap">{ok}/{l.length}{atras > 0 && <b className="txt-erro"> · {atras} atrasada{atras > 1 ? "s" : ""}</b>}</span>
          </Link>
        );
      })}
    </div>
  );
}
