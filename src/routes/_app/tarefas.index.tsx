import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { COMPETENCIAS, DEPTOS, EMPRESAS, EQUIPE, estado, fmtComp, ROTULO, useTarefas, type Estado } from "@/lib/dados";
import { ordenar, TabelaTarefas } from "@/components/Tarefas";

interface Filtros { depto?: string; comp?: string; resp?: string; empresa?: string; estado?: string }

export const Route = createFileRoute("/_app/tarefas/")({
  validateSearch: (s: Record<string, unknown>): Filtros => ({
    depto: typeof s.depto === "string" ? s.depto : undefined,
    comp: typeof s.comp === "string" ? s.comp : undefined,
    resp: typeof s.resp === "string" ? s.resp : undefined,
    empresa: typeof s.empresa === "string" ? s.empresa : undefined,
    estado: typeof s.estado === "string" ? s.estado : undefined,
  }),
  component: Tarefas,
});

function Tarefas() {
  const f = Route.useSearch();
  const navigate = useNavigate({ from: "/tarefas/" });
  const todas = useTarefas();
  const muda = (k: keyof Filtros, v: string) => navigate({ search: (s: Filtros) => ({ ...s, [k]: v || undefined }) });
  const lista = ordenar(
    todas.filter((t) => {
      const e = estado(t, todas);
      return (!f.depto || t.rec.depto === f.depto) && (!f.comp || t.comp === f.comp) && (!f.resp || t.resp === f.resp) && (!f.empresa || t.empresa.id === f.empresa)
        && (!f.estado || e === f.estado || (f.estado === "atrasada" && e === "multa"));
    }),
    todas,
  );
  const pessoas = f.depto ? EQUIPE[f.depto as keyof typeof EQUIPE] || [] : Object.values(EQUIPE).flat();
  return (
    <div className="pagina larga">
      <main>
        <h1 className="titulo-pagina">Tarefas</h1>
        <div className="cartao">
          <div className="filtros">
            <select className="entrada" value={f.comp || ""} onChange={(e) => muda("comp", e.target.value)} aria-label="Competência">
              <option value="">Todas as competências</option>
              {COMPETENCIAS.map((c) => <option key={c} value={c}>{fmtComp(c)}</option>)}
            </select>
            <select className="entrada" value={f.depto || ""} onChange={(e) => muda("depto", e.target.value)} aria-label="Departamento">
              <option value="">Todos os departamentos</option>
              {DEPTOS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select className="entrada" value={f.resp || ""} onChange={(e) => muda("resp", e.target.value)} aria-label="Responsável">
              <option value="">Todos os responsáveis</option>
              {pessoas.map((p) => <option key={p}>{p}</option>)}
            </select>
            <select className="entrada" value={f.empresa || ""} onChange={(e) => muda("empresa", e.target.value)} aria-label="Empresa">
              <option value="">Todas as empresas</option>
              {EMPRESAS.map((e) => <option key={e.id} value={e.id}>{e.codigo} · {e.nome}</option>)}
            </select>
            <select className="entrada" value={f.estado || ""} onChange={(e) => muda("estado", e.target.value)} aria-label="Situação">
              <option value="">Todas as situações</option>
              {(Object.keys(ROTULO) as Estado[]).map((e) => <option key={e} value={e}>{ROTULO[e]}</option>)}
            </select>
          </div>
          <p className="dica">{lista.length} tarefa{lista.length === 1 ? "" : "s"} · as que dependem de outro departamento ficam “aguardando” até ele concluir a parte dele.</p>
          <TabelaTarefas lista={lista} todas={todas} vazio="Nenhuma tarefa com esses filtros." />
        </div>
      </main>
    </div>
  );
}
