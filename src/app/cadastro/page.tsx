"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {

  const router = useRouter();

  // ESTADOS
  const [nome, setNome] = useState("");
  const [polo, setPolo] = useState("");
  const [curso, setCurso] = useState("");

  // CARREGAR DADOS
  useEffect(() => {

    const nomeSalvo = localStorage.getItem("nome");
    const poloSalvo = localStorage.getItem("polo");
    const cursoSalvo = localStorage.getItem("curso");

    if (nomeSalvo) setNome(nomeSalvo);
    if (poloSalvo) setPolo(poloSalvo);
    if (cursoSalvo) setCurso(cursoSalvo);

  }, []);

  // INICIAR JOGO
  function iniciarJogo() {

    if (!nome || !polo || !curso) {

      alert("Preencha todos os campos.");
      return;

    }

    localStorage.setItem("nome", nome);
    localStorage.setItem("polo", polo);
    localStorage.setItem("curso", curso);

    router.push("/temas");
  }

  return (

    <main className="h-screen overflow-hidden bg-[#061b11] text-white relative flex flex-col">

      {/* FUNDO */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f5132_0%,#061b11_55%,#020303_100%)]"></div>

      {/* EFEITO LUZ */}
      <div className="absolute top-1/2 left-1/2 w-[850px] h-[850px] -translate-x-1/2 -translate-y-1/2 bg-green-500/10 blur-[170px] rounded-full"></div>

      {/* GRID DECORATIVO */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      {/* CONTEÚDO */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-4">

        {/* CARD */}
        <div className="
          w-full
          max-w-xl
          bg-white/5
          border
          border-green-900/40
          backdrop-blur-xl
          rounded-[32px]
          px-10
          py-8
          shadow-[0_0_60px_rgba(0,0,0,0.35)]
          relative
          overflow-hidden
        ">

          {/* BRILHO INTERNO */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.08),transparent_65%)]"></div>

          {/* HEADER */}
          <div className="relative z-10 text-center mb-8">

            {/* BADGE */}
            <div className="inline-block mb-4 px-5 py-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 text-yellow-300 text-sm font-semibold tracking-wide uppercase backdrop-blur-sm shadow-lg">

              Safra Milionária

            </div>

            {/* TÍTULO */}
            <h1 className="text-4xl md:text-5xl font-black uppercase text-yellow-400 tracking-tight drop-shadow-[0_0_20px_rgba(255,215,0,0.25)]">

              Identificação

            </h1>

            {/* LINHA */}
            <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto mt-4 mb-4 shadow-[0_0_15px_rgba(255,215,0,0.4)]"></div>

            {/* TEXTO */}
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-md mx-auto">

              Informe seus dados para iniciar sua jornada
              rumo à safra do milhão.

            </p>

          </div>

          {/* FORMULÁRIO */}
          <div className="relative z-10 space-y-5">

            {/* NOME */}
            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-300">

                Nome Completo

              </label>

              <input
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="
                  w-full
                  rounded-2xl
                  bg-black/30
                  border
                  border-green-900/40
                  px-5
                  py-4
                  text-white
                  placeholder:text-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                  transition-all
                  duration-300
                "
              />

            </div>

            {/* POLO */}
            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-300">

                Polo

              </label>

              <select
                value={polo}
                onChange={(e) => setPolo(e.target.value)}
                className="
                  w-full
                  rounded-2xl
                  bg-black/30
                  border
                  border-green-900/40
                  px-5
                  py-4
                  text-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                  transition-all
                  duration-300
                "
              >
                <option value="">Selecione um polo</option>
                <option>Anastácio</option> <option>Aparecida do Taboado</option> <option>Bataguassu</option> <option>Camapuã</option> <option>Campo Grande</option> <option>Chapadão do Sul</option> <option>Coxim</option> <option>Dourados</option> <option>Inocência</option> <option>Ivinhema</option> <option>Maracaju</option> <option>Sidrolândia</option> <option>Três Lagoas</option>
              </select>

            </div>

            {/* CURSO */}
            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-300">

                Curso

              </label>

              <select
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                className="
                  w-full
                  rounded-2xl
                  bg-black/30
                  border
                  border-green-900/40
                  px-5
                  py-4
                  text-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                  transition-all
                  duration-300
                "
              >
                <option value="">Selecione um curso</option>
                <option>Especialização Técnica em Sistemas de Produção de Animais Ruminantes</option> <option>Técnico em Agronegócio</option> <option>Técnico em Agricultura</option> <option>Técnico em Agropecuária</option> <option>Técnico em Florestas</option> <option>Técnico em Fruticultura</option> <option>Técnico em Segurança do Trabalho no Agro</option> <option>Técnico em Zootecnia</option>
              </select>

            </div>

            {/* BOTÃO */}
            <button
              onClick={iniciarJogo}
              className="
                group
                relative
                overflow-hidden
                w-full
                mt-2
                bg-yellow-400
                hover:bg-yellow-300
                text-black
                font-black
                text-xl
                py-4
                rounded-2xl
                shadow-[0_0_35px_rgba(255,215,0,0.35)]
                transition-all
                duration-300
                hover:scale-[1.02]
              "
            >

              {/* EFEITO */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-white/20"></div>

              <span className="relative z-10">

                🚜 COMEÇAR JOGO

              </span>

            </button>

          </div>

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