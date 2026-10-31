import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { BookOpen, Briefcase, Calculator, CalendarClock, FileText, GitBranch, Home, ListChecks, Mail, Repeat, Users } from "lucide-react";
import { USUARIO } from "@/lib/dados";

export const Route = createFileRoute("/_app")({
  // os dados do protótipo moram no navegador
  ssr: false,
  component: Portal,
});

function Portal() {
  const p = useLocation().pathname;
  const ativo = (...prefs: string[]) => (prefs.some((pref) => p === pref || p.startsWith(pref + "/")) ? "ativo" : "");
  return (
    <div className="portal">
      <aside className="menu">
        <Link to="/" className={`inicio ${p === "/" ? "ativo" : ""}`}><Home />Início</Link>
        <div className="secao">Processos</div>
        <nav>
          <Link to="/tarefas" className={ativo("/tarefas")}><ListChecks />Tarefas</Link>
          <Link to="/envios" className={ativo("/envios")}><Mail />Envios ao cliente</Link>
          <Link to="/fluxos" className={ativo("/fluxos")}><GitBranch />Fluxos</Link>
        </nav>
        <div className="secao">Cadastros</div>
        <nav>
          <Link to="/recorrentes" className={ativo("/recorrentes")}><Repeat />Recorrentes</Link>
          <Link to="/empresas" className={ativo("/empresas")}><Briefcase />Empresas e responsáveis</Link>
          <Link to="/equipe" className={ativo("/equipe")}><Users />Equipe</Link>
        </nav>
        <div className="secao">Módulos</div>
        <nav>
          <Link to="/modulos/$m" params={{ m: "contabil" }} className={ativo("/modulos/contabil")}><Calculator />Contábil · Integra</Link>
          <Link to="/modulos/$m" params={{ m: "fiscal" }} className={ativo("/modulos/fiscal")}><FileText />Fiscal</Link>
          <Link to="/modulos/$m" params={{ m: "pessoal" }} className={ativo("/modulos/pessoal")}><CalendarClock />Pessoal</Link>
        </nav>
        <div className="rodape-menu"><BookOpen size={12} /> Protótipo · dados de exemplo</div>
      </aside>
      <div className="area">
        <header className="topo">
          <Link className="marca" to="/">
            <img src="/logo-thomaz.png" alt="Contabilidade Thomaz" />
            <span>Sistema Thomaz</span>
          </Link>
          <span className="selo alerta">Protótipo para aprovação</span>
          <div className="usuario">
            <span className="avatar" aria-hidden>{USUARIO.slice(0, 1)}</span>
            <span><b>{USUARIO}</b><small>Contabilidade Thomaz</small></span>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
