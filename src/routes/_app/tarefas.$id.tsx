import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { emailDaTarefa, estado, fmtComp, fmtData, pendencias, salvar, useTarefas, USUARIO, type Anexo, type Tarefa } from "@/lib/dados";
import { SeloEstado } from "@/components/Tarefas";

export const Route = createFileRoute("/_app/tarefas/$id")({ component: Detalhe });

function Detalhe() {
  const { id } = Route.useParams();
  const todas = useTarefas();
  const t = todas.find((x) => x.id === id);
  const [confirmando, setConfirmando] = useState(false);
  const [aviso, setAviso] = useState("");
  if (!t) return <div className="pagina larga"><main><p>Tarefa não encontrada.</p></main></div>;

  const espera = pendencias(t, todas);
  const libera = todas.filter((x) => x.empresa.id === t.empresa.id && x.comp === t.comp && x.rec.dependeDe.includes(t.rec.id));
  const email = emailDaTarefa(t);
  const aberta = t.situacao !== "concluida";

  function anexar(arquivos: FileList | null) {
    if (!arquivos?.length || !t) return;
    const novos: Anexo[] = [...arquivos].map((a) => ({ nome: a.name, tamanho: `${Math.max(1, Math.round(a.size / 1024))} KB` }));
    salvar(t.id, { anexos: [...t.anexos, ...novos] });
  }

  function concluir(enviar: boolean) {
    if (!t) return;
    const agora = new Date().toISOString();
    const envios = enviar && email ? [...t.envios, { em: agora, para: email.para, assunto: email.assunto, anexos: t.anexos.map((a) => a.nome) }] : t.envios;
    salvar(t.id, { situacao: "concluida", concluidaEm: agora, por: USUARIO, checklist: t.rec.checklist.map(() => true), envios });
    setConfirmando(false);
    const liberadas = libera.filter((x) => pendencias(x, todas).every((p) => p.id === t.id));
    setAviso(
      [enviar && email ? `E-mail enviado para ${email.para.join(", ")}.` : "", liberadas.length ? `Liberou: ${liberadas.map((x) => `${x.rec.nome} (${x.rec.depto} · ${x.resp})`).join("; ")} — o responsável é avisado.` : ""]
        .filter(Boolean).join(" "),
    );
  }

  return (
    <div className="pagina">
      <main>
        <div className="trilha"><Link to="/tarefas">Tarefas</Link> › {t.empresa.nome}</div>
        <h1 className="titulo-pagina">{t.rec.nome} <SeloEstado t={t} todas={todas} /></h1>
        {aviso && <div className="mensagem ok">{aviso}</div>}

        <div className="cartao">
          <div className="indicadores">
            <div className="indicador"><div className="rot">Empresa</div><div className="val pequeno">{t.empresa.codigo} · {t.empresa.nome}</div></div>
            <div className="indicador"><div className="rot">Competência</div><div className="val">{fmtComp(t.comp)}</div></div>
            <div className="indicador"><div className="rot">Responsável</div><div className="val">{t.resp}</div><div className="dica">{t.rec.depto}</div></div>
            <div className="indicador"><div className="rot">Meta interna</div><div className="val">{fmtData(t.meta)}</div></div>
            <div className="indicador"><div className="rot">Prazo legal</div><div className="val">{fmtData(t.prazo)}</div><div className="dica">{t.rec.multa ? "gera multa se atrasar" : "sem multa"}</div></div>
          </div>
        </div>

        {(espera.length > 0 || libera.length > 0) && (
          <div className="cartao">
            <h2>Dependências</h2>
            {espera.length > 0 && aberta && (
              <div className="mensagem alerta">
                Esta tarefa espera: {espera.map((x, i) => <span key={x.id}>{i > 0 && ", "}<Link to="/tarefas/$id" params={{ id: x.id }}>{x.rec.nome}</Link> ({x.rec.depto} · {x.resp})</span>)}
              </div>
            )}
            {libera.length > 0 && <p>Quando concluir, libera: {libera.map((x, i) => <span key={x.id}>{i > 0 && ", "}<Link to="/tarefas/$id" params={{ id: x.id }}>{x.rec.nome}</Link> ({x.rec.depto})</span>)}</p>}
          </div>
        )}

        <div className="cartao">
          <h2>Passo a passo</h2>
          {t.rec.checklist.map((c, i) => (
            <label key={i} className="campo-check">
              <input type="checkbox" disabled={!aberta} checked={t.checklist[i] ?? false} onChange={(e) => salvar(t.id, { checklist: t.rec.checklist.map((_, j) => (j === i ? e.target.checked : t.checklist[j] ?? false)) })} />
              {c}
            </label>
          ))}
        </div>

        <div className="cartao">
          <h2>Documentos</h2>
          {t.anexos.length ? (
            <ul className="anexos">{t.anexos.map((a, i) => <li key={i}><Paperclip size={14} /> {a.nome} <span className="dica">{a.tamanho}</span></li>)}</ul>
          ) : <p className="vazio">Nenhum documento anexado.</p>}
          {aberta && (
            <label className="botao secundario pequeno" style={{ marginTop: 8 }}>
              <Paperclip size={14} /> Anexar documento
              <input type="file" multiple hidden onChange={(e) => anexar(e.target.files)} />
            </label>
          )}
          {t.envios.map((e, i) => (
            <div key={i} className="mensagem ok" style={{ marginTop: 12 }}>
              ✉ Enviado em {new Date(e.em).toLocaleString("pt-BR")} para {e.para.join(", ")} — “{e.assunto}” ({e.anexos.length} anexo{e.anexos.length === 1 ? "" : "s"})
            </div>
          ))}
        </div>

        {aberta && (
          <div className="acoes">
            <button className="botao" onClick={() => (email && t.anexos.length ? setConfirmando(true) : concluir(false))}>Concluir tarefa</button>
            {email && !t.anexos.length && <span className="dica">Anexe a guia para ela seguir por e-mail ao cliente quando concluir.</span>}
          </div>
        )}
        {!aberta && t.concluidaEm && <p className="dica">Concluída em {new Date(t.concluidaEm).toLocaleDateString("pt-BR")}{t.por ? ` por ${t.por}` : ""}.</p>}

        {confirmando && email && <JanelaEnvio t={t} email={email} onEnviar={() => concluir(true)} onSemEnvio={() => concluir(false)} onFechar={() => setConfirmando(false)} />}
      </main>
      <aside className="thomazinho">
        <img className="boneco" src="/thomazinho.svg" alt="Thomazinho" />
        <div className="nome">Thomazinho</div>
        <div className="balao">
          {!aberta ? "Tarefa concluída. ✔" : espera.length ? "Ainda falta outro departamento concluir a parte dele — dá para adiantar o passo a passo." : email ? "Anexe a guia e conclua: o e-mail para o cliente já sai pronto, com o anexo." : "Marque os passos e conclua quando terminar."}
        </div>
        {estado(t, todas) === "multa" && <div className="balao erro">Passou do prazo legal e esta obrigação gera multa.</div>}
      </aside>
    </div>
  );
}

function JanelaEnvio({ t, email, onEnviar, onSemEnvio, onFechar }: { t: Tarefa; email: NonNullable<ReturnType<typeof emailDaTarefa>>; onEnviar: () => void; onSemEnvio: () => void; onFechar: () => void }) {
  return (
    <div className="fundo-janela" onClick={onFechar}>
      <div className="janela" role="dialog" aria-label="Enviar ao cliente" onClick={(e) => e.stopPropagation()}>
        <h2>Enviar ao cliente</h2>
        <p className="dica">E-mail montado com o modelo da recorrente “{t.rec.nome}” e os contatos da empresa que recebem {t.rec.envio!.para}.</p>
        <div className="email">
          <div><b>De:</b> Contabilidade Thomaz &lt;guias@escritoriothomaz.com.br&gt;</div>
          <div><b>Para:</b> {email.para.length ? email.para.join(", ") : <span className="txt-erro">nenhum contato cadastrado para {t.rec.envio!.para}</span>}</div>
          <div><b>Assunto:</b> {email.assunto}</div>
          <pre>{email.corpo}</pre>
          <div className="anexos">{t.anexos.map((a, i) => <span key={i} className="selo neutro"><Paperclip size={12} /> {a.nome}</span>)}</div>
        </div>
        <div className="acoes">
          <button className="botao" disabled={!email.para.length} onClick={onEnviar}><Send size={14} /> Concluir e enviar</button>
          <button className="botao secundario" onClick={onSemEnvio}>Concluir sem enviar</button>
          <button className="botao secundario" onClick={onFechar}>Cancelar</button>
        </div>
        <p className="dica">No protótipo nada sai de verdade: o envio fica só registrado na tarefa e em “Envios ao cliente”.</p>
      </div>
    </div>
  );
}
