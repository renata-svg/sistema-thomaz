import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, type ErrorComponentProps } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="tela-entrada">
      <div className="caixa" style={{ textAlign: "center" }}>
        <h1 className="titulo-pagina" style={{ fontSize: 56, margin: 0 }}>404</h1>
        <p>Esta página não existe ou foi movida.</p>
        <div className="acoes" style={{ justifyContent: "center" }}>
          <Link to="/" className="botao">Voltar ao painel</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="tela-entrada">
      <div className="caixa" style={{ textAlign: "center" }}>
        <h1 className="titulo-pagina">Esta página não carregou</h1>
        <p className="dica">{error instanceof Error ? error.message : String(error)}</p>
        <div className="acoes" style={{ justifyContent: "center" }}>
          <button className="botao" onClick={reset}>Tentar de novo</button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sistema Thomaz" },
      { name: "description", content: "Contábil, Fiscal e Pessoal num só lugar: tarefas do mês, prazos, dependências e envio de guias ao cliente." },
      { name: "author", content: "Contabilidade Thomaz" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Sora:wght@600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
