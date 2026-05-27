"use client";

import { useRouter } from "next/navigation";

export default function TemasPage() {

  const router = useRouter();

  const temas = [
    {
      id: "Tema 1",
      titulo: "Princípios de Economia",
      emoji: "📘",
    },
    {
      id: "Tema 2",
      titulo: "Estudo dos Mercados",
      emoji: "📈",
    },
    {
      id: "Tema 3",
      titulo: "Teoria do Consumidor",
      emoji: "🛒",
    },
    {
      id: "Tema 4",
      titulo: "Elasticidade e Sistema de Preços",
      emoji: "💰",
    },
    {
      id: "Tema 5",
      titulo: "Teoria da Firma",
      emoji: "🏭",
    },
    {
      id: "Tema 6",
      titulo: "Desenvolvimento Rural no Brasil",
      emoji: "🌱",
    },
  ];

  function selecionarTema(tema: string) {

    localStorage.setItem("temaSelecionado", tema);

    router.push("/jogo");
  }

  function jogarTodos() {

    localStorage.setItem("temaSelecionado", "TODOS");

    router.push("/jogo");
  }

  return (

    <main className="h-screen overflow-hidden bg-[#061b11] text-white relative flex flex-col">

      {/* FUNDO */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f5132_0%,#061b11_55%,#020303_100%)]"></div>

      {/* EFEITO LUZ */}
      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 bg-green-500/10 blur-[160px] rounded-full"></div>

      {/* GRID DECORATIVO */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      {/* CONTEÚDO */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-3">

        {/* HEADER */}
        <div className="text-center mb-6">

          <div className="inline-block mb-3 px-5 py-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 text-yellow-300 text-sm font-semibold tracking-wide uppercase backdrop-blur-sm shadow-lg">

            Safra Milionária

          </div>

          <h1 className="text-3xl md:text-5xl font-black uppercase text-yellow-400 leading-tight tracking-tight drop-shadow-[0_0_20px_rgba(255,215,0,0.25)]">

            Noções Gerais de Economia

          </h1>

          <div className="w-28 h-1 bg-yellow-400 rounded-full mx-auto mt-4 mb-4 shadow-[0_0_15px_rgba(255,215,0,0.4)]"></div>

          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">

            Escolha um tema específico para testar seus conhecimentos
            ou jogue no modo completo e enfrente o desafio total.

          </p>

        </div>

        {/* GRID */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 w-full">

          {temas.map((tema) => (

            <button
              key={tema.id}
              onClick={() => selecionarTema(tema.id)}
              className="
                group
                relative
                overflow-hidden
                bg-white/5
                hover:bg-green-700/20
                border
                border-green-900/40
                backdrop-blur-xl
                rounded-3xl
                p-5
                shadow-2xl
                transition-all
                duration-300
                hover:scale-[1.03]
                hover:border-yellow-400/30
                min-h-[145px]
                flex
                flex-col
                justify-center
                items-center
                text-center
              "
            >

              {/* BRILHO */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.12),transparent_70%)]"></div>

              {/* EMOJI */}
              <div className="relative z-10 text-3xl mb-2">

                {tema.emoji}

              </div>

              {/* TEMA */}
              <h2 className="relative z-10 text-2xl font-black text-yellow-400 mb-2">

                {tema.id}

              </h2>

              {/* TÍTULO */}
              <p className="relative z-10 text-gray-300 text-base leading-relaxed">

                {tema.titulo}

              </p>

            </button>

          ))}

        </div>

        {/* BOTÃO */}
        <div className="max-w-4xl mx-auto mt-6 w-full">

          <button
            onClick={jogarTodos}
            className="
              group
              relative
              overflow-hidden
              w-full
              bg-yellow-400
              hover:bg-yellow-300
              text-black
              font-black
              text-xl
              py-4
              rounded-3xl
              shadow-[0_0_35px_rgba(255,215,0,0.35)]
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >

            {/* EFEITO */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-white/20"></div>

            <span className="relative z-10">

              🎯 JOGAR TODOS OS TEMAS

            </span>

          </button>

        </div>

      </div>

      {/* RODAPÉ PREMIUM */}
      <footer className="relative z-10 border-t border-green-900/50 bg-black/20 backdrop-blur-md py-3">

        <div className="text-center">

          <p className="text-sm text-gray-400 tracking-wide">

            Desenvolvido pelo Tutor

            <span className="text-yellow-400 font-semibold">
              {" "}Reginaldo V. Vantini
            </span>

            <span className="text-gray-500">
              {" "}— professorvantini@gmail.com
            </span>

          </p>

        </div>

      </footer>

    </main>

  );
}