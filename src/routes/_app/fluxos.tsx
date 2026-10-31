import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/fluxos")({ component: Fluxos });

/** Processos que não se repetem todo mês: cada um é uma sequência de etapas entre departamentos. */
const FLUXOS: { nome: string; empresa: string; etapas: [string, string, boolean][] }[] = [
  { nome: "Entrada de cliente novo", empresa: "HORIZONTE TRANSPORTES LTDA", etapas: [["Legal", "Contrato e procurações", true], ["Contábil", "Saldos de abertura e plano de contas", true], ["Fiscal", "Cadastro no Domínio e certificados", false], ["Pessoal", "Importar funcionários do contador anterior", false]] },
  { nome: "Admissão", empresa: "ESTRELA MODAS LTDA", etapas: [["Pessoal", "Receber documentos do funcionário", true], ["Pessoal", "Registro no eSocial", false], ["Pessoal", "Enviar contrato para assinatura", false]] },
  { nome: "Rescisão", empresa: "BELA VISTA MATERIAIS PARA CONSTRUÇÃO LTDA", etapas: [["Pessoal", "Calcular a rescisão", true], ["Pessoal", "Guia do FGTS rescisório ao cliente", true], ["Contábil", "Lançar a rescisão", false]] },
  { nome: "Alteração contratual", empresa: "CEDRO SERVIÇOS DE TECNOLOGIA LTDA", etapas: [["Legal", "Minuta e registro na Junta", false], ["Fiscal", "Atualizar inscrições", false], ["Contábil", "Atualizar quadro societário", false]] },
];

function Fluxos() {
  return (
    <div className="pagina larga">
      <main>
        <h1 className="titulo-pagina">Fluxos</h1>
        <p className="dica" style={{ marginTop: -10, marginBottom: 16 }}>
          Processos que acontecem de vez em quando. Cada etapa vai para o departamento certo, e a seguinte só abre quando a anterior termina.
        </p>
        {FLUXOS.map((f) => {
          const feitas = f.etapas.filter((e) => e[2]).length;
          return (
            <div key={f.nome + f.empresa} className="cartao">
              <div className="cabecalho-cartao"><h2>{f.nome} · <span className="dica">{f.empresa}</span></h2><span className="selo info">{feitas}/{f.etapas.length} etapas</span></div>
              <ol className="etapas-fluxo">
                {f.etapas.map(([d, n, ok], i) => (
                  <li key={i} className={ok ? "feita" : i === feitas ? "atual" : ""}><b>{n}</b><span>{d}</span></li>
                ))}
              </ol>
            </div>
          );
        })}
      </main>
    </div>
  );
}
