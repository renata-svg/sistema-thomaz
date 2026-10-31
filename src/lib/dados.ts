/**
 * Protótipo do módulo Processos: dados de exemplo (empresas fictícias) e o "banco" do navegador.
 * As tarefas nascem das recorrentes × empresas, como no sistema de verdade; o que a equipe faz
 * (concluir, anexar, enviar ao cliente) fica guardado no localStorage deste navegador.
 */
import { useSyncExternalStore } from "react";

export type Depto = "Contábil" | "Fiscal" | "Pessoal";
export const DEPTOS: Depto[] = ["Contábil", "Fiscal", "Pessoal"];
export type Regime = "Simples Nacional" | "Lucro Presumido" | "Lucro Real";

export interface Empresa {
  id: string;
  codigo: number;
  nome: string;
  cnpj: string;
  regime: Regime;
  temFolha: boolean;
  resp: Record<Depto, string>;
  contatos: { nome: string; email: string; recebe: Array<"guias" | "folha" | "relatorios"> }[];
}

export interface Recorrente {
  id: string;
  nome: string;
  depto: Depto;
  /** dia do mês seguinte à competência */
  meta: number;
  prazoLegal: number;
  multa: boolean;
  regimes: Regime[];
  soComFolha?: boolean;
  dependeDe: string[];
  checklist: string[];
  /** ao concluir com documento, envia ao cliente */
  envio?: { para: "guias" | "folha" | "relatorios"; documento: string; assunto: string; corpo: string };
}

export const EQUIPE: Record<Depto, string[]> = {
  "Contábil": ["Renata", "Renato", "Juliana", "Mayse", "Ari"],
  Fiscal: ["Caroline", "Analli", "Pamela", "Olimpia"],
  Pessoal: ["Miriam", "Beatriz", "Tani", "Lucas"],
};

const TODOS: Regime[] = ["Simples Nacional", "Lucro Presumido", "Lucro Real"];
const NORMAIS: Regime[] = ["Lucro Presumido", "Lucro Real"];

const CORPO_GUIA = "Olá, {contato}!\n\nSegue em anexo {documento} da {empresa}, competência {competencia}, com vencimento em {vencimento}.\n\nQualquer dúvida, estamos à disposição.\n\nContabilidade Thomaz";

export const RECORRENTES: Recorrente[] = [
  // Pessoal
  { id: "folha", nome: "Folha de pagamento", depto: "Pessoal", meta: 3, prazoLegal: 5, multa: false, regimes: TODOS, soComFolha: true, dependeDe: [], checklist: ["Receber variáveis do cliente", "Calcular a folha", "Conferir líquidos", "Gerar holerites e recibos"], envio: { para: "folha", documento: "a folha de pagamento", assunto: "Folha de pagamento {competencia} — {empresa}", corpo: "Olá, {contato}!\n\nSegue em anexo a folha de pagamento da {empresa}, competência {competencia} (holerites e resumo). Os salários vencem em {vencimento}.\n\nContabilidade Thomaz" } },
  { id: "fgts", nome: "FGTS Digital", depto: "Pessoal", meta: 15, prazoLegal: 20, multa: true, regimes: TODOS, soComFolha: true, dependeDe: ["folha"], checklist: ["Fechar o eSocial", "Emitir a guia no FGTS Digital"], envio: { para: "guias", documento: "a guia do FGTS", assunto: "Guia do FGTS {competencia} — {empresa}", corpo: CORPO_GUIA } },
  { id: "dctfweb", nome: "DCTFWeb (DARF previdenciário)", depto: "Pessoal", meta: 15, prazoLegal: 20, multa: true, regimes: TODOS, soComFolha: true, dependeDe: ["folha"], checklist: ["Fechar eSocial e EFD-Reinf", "Transmitir a DCTFWeb", "Emitir o DARF"], envio: { para: "guias", documento: "o DARF da DCTFWeb", assunto: "DARF da DCTFWeb {competencia} — {empresa}", corpo: CORPO_GUIA } },
  // Fiscal
  { id: "das", nome: "DAS — Simples Nacional", depto: "Fiscal", meta: 12, prazoLegal: 20, multa: true, regimes: ["Simples Nacional"], dependeDe: [], checklist: ["Importar notas no Domínio", "Conferir faturamento", "Apurar no PGDAS-D", "Emitir o DAS"], envio: { para: "guias", documento: "o DAS", assunto: "DAS {competencia} — {empresa}", corpo: CORPO_GUIA } },
  { id: "icms", nome: "Apuração de ICMS", depto: "Fiscal", meta: 12, prazoLegal: 20, multa: true, regimes: NORMAIS, dependeDe: [], checklist: ["Importar notas no Domínio", "Conferir CFOP e CST", "Apurar o ICMS", "Emitir a GARE"], envio: { para: "guias", documento: "a guia de ICMS", assunto: "Guia de ICMS {competencia} — {empresa}", corpo: CORPO_GUIA } },
  { id: "pis-cofins", nome: "PIS/COFINS, IRPJ e CSLL", depto: "Fiscal", meta: 18, prazoLegal: 25, multa: true, regimes: NORMAIS, dependeDe: [], checklist: ["Apurar PIS/COFINS", "Apurar IRPJ/CSLL (quando trimestral)", "Emitir os DARFs"], envio: { para: "guias", documento: "os DARFs de PIS/COFINS, IRPJ e CSLL", assunto: "DARFs federais {competencia} — {empresa}", corpo: CORPO_GUIA } },
  { id: "iss", nome: "ISS", depto: "Fiscal", meta: 8, prazoLegal: 10, multa: true, regimes: NORMAIS, dependeDe: [], checklist: ["Conferir notas de serviço", "Emitir a guia no portal da prefeitura"], envio: { para: "guias", documento: "a guia de ISS", assunto: "Guia de ISS {competencia} — {empresa}", corpo: CORPO_GUIA } },
  { id: "reinf", nome: "EFD-Reinf", depto: "Fiscal", meta: 12, prazoLegal: 15, multa: true, regimes: TODOS, dependeDe: [], checklist: ["Conferir retenções", "Transmitir a EFD-Reinf", "Salvar o recibo"] },
  // Contábil
  { id: "bancos", nome: "Lançar bancos e conciliar", depto: "Contábil", meta: 15, prazoLegal: 28, multa: false, regimes: TODOS, dependeDe: [], checklist: ["Receber extratos do cliente", "Importar no Thomaz Integra", "Conciliar saldos"] },
  { id: "prov-folha", nome: "Provisionar folha e encargos", depto: "Contábil", meta: 18, prazoLegal: 28, multa: false, regimes: TODOS, soComFolha: true, dependeDe: ["folha", "fgts", "dctfweb"], checklist: ["Importar a folha", "Conferir provisões"] },
  { id: "impostos-pagos", nome: "Lançar impostos pagos", depto: "Contábil", meta: 22, prazoLegal: 28, multa: false, regimes: TODOS, dependeDe: ["das", "icms", "pis-cofins", "iss"], checklist: ["Baixar comprovantes no e-CAC", "Importar no Thomaz Integra"] },
  { id: "fechamento", nome: "Fechamento do mês", depto: "Contábil", meta: 25, prazoLegal: 28, multa: false, regimes: TODOS, dependeDe: ["bancos", "prov-folha", "impostos-pagos"], checklist: ["Conferir balancete", "Conferir saldos de bancos e impostos", "Gerar relatórios"], envio: { para: "relatorios", documento: "o balancete", assunto: "Relatórios contábeis {competencia} — {empresa}", corpo: "Olá, {contato}!\n\nSegue em anexo o balancete da {empresa}, competência {competencia}.\n\nContabilidade Thomaz" } },
];

export const EMPRESAS: Empresa[] = [
  { id: "aurora", codigo: 101, nome: "AURORA COMÉRCIO DE ALIMENTOS LTDA", cnpj: "11.111.111/0001-11", regime: "Simples Nacional", temFolha: true, resp: { "Contábil": "Renata", Fiscal: "Caroline", Pessoal: "Miriam" }, contatos: [{ nome: "Marta", email: "financeiro@aurora.exemplo.com.br", recebe: ["guias", "folha"] }, { nome: "Paulo", email: "paulo@aurora.exemplo.com.br", recebe: ["relatorios"] }] },
  { id: "bela-vista", codigo: 102, nome: "BELA VISTA MATERIAIS PARA CONSTRUÇÃO LTDA", cnpj: "22.222.222/0001-22", regime: "Lucro Presumido", temFolha: true, resp: { "Contábil": "Renato", Fiscal: "Analli", Pessoal: "Beatriz" }, contatos: [{ nome: "Sônia", email: "sonia@belavista.exemplo.com.br", recebe: ["guias", "folha", "relatorios"] }] },
  { id: "cedro", codigo: 103, nome: "CEDRO SERVIÇOS DE TECNOLOGIA LTDA", cnpj: "33.333.333/0001-33", regime: "Lucro Presumido", temFolha: false, resp: { "Contábil": "Juliana", Fiscal: "Pamela", Pessoal: "Tani" }, contatos: [{ nome: "Ricardo", email: "ricardo@cedro.exemplo.com.br", recebe: ["guias", "relatorios"] }] },
  { id: "delta", codigo: 104, nome: "DELTA VEÍCULOS ESPECIAIS LTDA", cnpj: "44.444.444/0001-44", regime: "Lucro Real", temFolha: true, resp: { "Contábil": "Renata", Fiscal: "Olimpia", Pessoal: "Miriam" }, contatos: [{ nome: "Cláudia", email: "fiscal@delta.exemplo.com.br", recebe: ["guias"] }, { nome: "Rafael", email: "rh@delta.exemplo.com.br", recebe: ["folha"] }, { nome: "Diretoria", email: "diretoria@delta.exemplo.com.br", recebe: ["relatorios"] }] },
  { id: "estrela", codigo: 105, nome: "ESTRELA MODAS LTDA", cnpj: "55.555.555/0001-55", regime: "Simples Nacional", temFolha: true, resp: { "Contábil": "Mayse", Fiscal: "Caroline", Pessoal: "Lucas" }, contatos: [{ nome: "Fernanda", email: "fernanda@estrela.exemplo.com.br", recebe: ["guias", "folha", "relatorios"] }] },
  { id: "flor", codigo: 106, nome: "FLOR DE LIS PADARIA E CONFEITARIA LTDA", cnpj: "66.666.666/0001-66", regime: "Simples Nacional", temFolha: true, resp: { "Contábil": "Juliana", Fiscal: "Pamela", Pessoal: "Beatriz" }, contatos: [{ nome: "José", email: "jose@flordelis.exemplo.com.br", recebe: ["guias", "folha", "relatorios"] }] },
  { id: "girassol", codigo: 107, nome: "GIRASSOL CLÍNICA MÉDICA LTDA", cnpj: "77.777.777/0001-77", regime: "Lucro Presumido", temFolha: true, resp: { "Contábil": "Ari", Fiscal: "Analli", Pessoal: "Tani" }, contatos: [{ nome: "Dra. Helena", email: "helena@girassol.exemplo.com.br", recebe: ["guias", "relatorios"] }, { nome: "Recepção", email: "adm@girassol.exemplo.com.br", recebe: ["folha"] }] },
  { id: "horizonte", codigo: 108, nome: "HORIZONTE TRANSPORTES LTDA", cnpj: "88.888.888/0001-88", regime: "Lucro Real", temFolha: true, resp: { "Contábil": "Renato", Fiscal: "Olimpia", Pessoal: "Lucas" }, contatos: [{ nome: "Marcos", email: "marcos@horizonte.exemplo.com.br", recebe: ["guias", "folha", "relatorios"] }] },
];

// ---------- datas ----------
export const HOJE = (() => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
})();
const DIA = 864e5;
export const fmtData = (d: Date) => d.toLocaleDateString("pt-BR");
export const fmtComp = (c: string) => `${c.slice(5, 7)}/${c.slice(0, 4)}`;
function compDe(d: Date, delta: number) {
  const x = new Date(d.getFullYear(), d.getMonth() + delta, 1);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
}
/** vencimento: dia N do mês seguinte à competência (sábado/domingo passam para segunda) */
function diaDoMesSeguinte(comp: string, dia: number) {
  const [a, m] = comp.split("-").map(Number);
  const d = new Date(a, m, dia);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d;
}
/** a competência que fechou no mês passado e a do mês corrente */
export const COMPETENCIAS = [compDe(HOJE, -1), compDe(HOJE, 0)];

// ---------- tarefas ----------
export type Situacao = "aberta" | "concluida";
export interface Anexo { nome: string; tamanho: string }
export interface Envio { em: string; para: string[]; assunto: string; anexos: string[]; lido?: string }
export interface Registro { situacao: Situacao; concluidaEm?: string; por?: string; checklist: boolean[]; anexos: Anexo[]; envios: Envio[]; obs?: string }

export interface Tarefa extends Registro {
  id: string;
  rec: Recorrente;
  empresa: Empresa;
  comp: string;
  resp: string;
  meta: Date;
  prazo: Date;
}

/** número fixo a partir do texto: a mesma tarefa nasce sempre igual */
function sorte(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

function registroInicial(id: string, rec: Recorrente, comp: string, prazo: Date): Registro {
  const antiga = comp === COMPETENCIAS[0];
  // a competência mais antiga já está quase toda feita; a atual, pela metade do caminho
  const feita = prazo.getTime() < HOJE.getTime() ? sorte(id) < (antiga ? 0.92 : 0.6) : sorte(id) < (antiga ? 0.9 : 0.25);
  if (!feita) return { situacao: "aberta", checklist: rec.checklist.map((_, i) => sorte(id + i) < 0.35), anexos: [], envios: [] };
  const em = new Date(Math.min(prazo.getTime() - 2 * DIA, HOJE.getTime())).toISOString();
  const anexos = rec.envio ? [{ nome: `${rec.id.toUpperCase()}_${fmtComp(comp).replace("/", "-")}.pdf`, tamanho: "84 KB" }] : [];
  return { situacao: "concluida", concluidaEm: em, checklist: rec.checklist.map(() => true), anexos, envios: [] };
}

const CHAVE = "sistema-thomaz:processos:v1";
type Banco = Record<string, Partial<Registro>>;
let banco: Banco = {};
try {
  banco = JSON.parse(localStorage.getItem(CHAVE) || "{}");
} catch {
  banco = {};
}
const ouvintes = new Set<() => void>();
let versao = 0;

export function salvar(id: string, mudanca: Partial<Registro>) {
  banco = { ...banco, [id]: { ...banco[id], ...mudanca } };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(banco));
  } catch {
    /* sem localStorage: vale até recarregar */
  }
  versao++;
  cache = null;
  ouvintes.forEach((f) => f());
}

export function recomecar() {
  banco = {};
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* nada */
  }
  versao++;
  cache = null;
  ouvintes.forEach((f) => f());
}

let cache: Tarefa[] | null = null;
function gerar(): Tarefa[] {
  if (cache) return cache;
  const out: Tarefa[] = [];
  for (const comp of COMPETENCIAS)
    for (const e of EMPRESAS)
      for (const r of RECORRENTES) {
        if (!r.regimes.includes(e.regime) || (r.soComFolha && !e.temFolha)) continue;
        const id = `${comp}.${e.id}.${r.id}`;
        const prazo = diaDoMesSeguinte(comp, r.prazoLegal);
        const ini = registroInicial(id, r, comp, prazo);
        out.push({ ...ini, ...banco[id], id, rec: r, empresa: e, comp, resp: e.resp[r.depto], meta: diaDoMesSeguinte(comp, r.meta), prazo });
      }
  cache = out;
  return out;
}

export function useTarefas(): Tarefa[] {
  useSyncExternalStore(
    (f) => (ouvintes.add(f), () => ouvintes.delete(f)),
    () => versao,
    () => 0,
  );
  return gerar();
}

// ---------- regras do processo ----------
/** tarefas de outro departamento (ou do mesmo) que precisam terminar antes desta */
export function pendencias(t: Tarefa, todas: Tarefa[]) {
  return todas.filter((x) => x.empresa.id === t.empresa.id && x.comp === t.comp && t.rec.dependeDe.includes(x.rec.id) && x.situacao !== "concluida");
}

export type Estado = "concluida" | "bloqueada" | "multa" | "atrasada" | "hoje" | "no-prazo";
export function estado(t: Tarefa, todas: Tarefa[]): Estado {
  if (t.situacao === "concluida") return "concluida";
  if (t.prazo < HOJE) return t.rec.multa ? "multa" : "atrasada";
  if (pendencias(t, todas).length) return "bloqueada";
  if (t.meta <= HOJE) return "hoje";
  return "no-prazo";
}
export const ROTULO: Record<Estado, string> = {
  concluida: "Concluída",
  bloqueada: "Aguardando outro depto.",
  multa: "Gerando multa",
  atrasada: "Atrasada",
  hoje: "Passou da meta",
  "no-prazo": "No prazo",
};
export const COR: Record<Estado, string> = { concluida: "ok", bloqueada: "neutro", multa: "erro", atrasada: "erro", hoje: "alerta", "no-prazo": "info" };

/** e-mail pronto para o cliente, a partir do modelo da recorrente */
export function emailDaTarefa(t: Tarefa) {
  if (!t.rec.envio) return null;
  const contatos = t.empresa.contatos.filter((c) => c.recebe.includes(t.rec.envio!.para));
  const trocar = (s: string) =>
    s
      .replaceAll("{empresa}", t.empresa.nome)
      .replaceAll("{competencia}", fmtComp(t.comp))
      .replaceAll("{vencimento}", fmtData(t.prazo))
      .replaceAll("{documento}", t.rec.envio!.documento)
      .replaceAll("{contato}", contatos.map((c) => c.nome).join(" e ") || "cliente");
  return { para: contatos.map((c) => c.email), assunto: trocar(t.rec.envio.assunto), corpo: trocar(t.rec.envio.corpo) };
}

export const USUARIO = "Renata";
