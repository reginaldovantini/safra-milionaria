"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {

    const userAgent = window.navigator.userAgent.toLowerCase();

    const ios =
      /iphone|ipad|ipod/.test(userAgent);

    setIsIOS(ios);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
    };

  }, []);

  const handleInstall = async () => {

    if (isIOS) {

      alert(
        "No iPhone:\n\n1. Toque em Compartilhar\n2. Adicionar à Tela de Início"
      );

      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    setDeferredPrompt(null);

  };

  return (

    <main className="relative h-screen overflow-hidden bg-[#061b11] text-white">

      {/* FUNDO AGRO CINEMATOGRÁFICO */}
<div
  className="
    absolute
    inset-0
    bg-cover
    bg-center
    bg-no-repeat
    scale-105
  "
  style={{
    backgroundImage: "url('/bg-agro.png')"
  }}
/>

{/* OVERLAY ESCURO */}
<div className="
  absolute
  inset-0
  bg-black/55
" />

{/* GRID SUTIL */}
<div className="
  absolute
  inset-0
  opacity-[0.035]
  bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
  bg-[size:90px_90px]
" />

{/* GLOW CENTRAL */}
<div className="
  absolute
  top-1/2
  left-1/2
  w-[900px]
  h-[900px]
  -translate-x-1/2
  -translate-y-1/2
  bg-yellow-500/10
  blur-[170px]
  rounded-full
" />

      {/* GLOW CENTRAL */}
      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 bg-green-500/10 blur-[170px] rounded-full" />

     

      {/* CONTEÚDO */}
      <div className="relative z-10 h-full flex flex-col">

        {/* CENTRO */}
        <div className="flex-1 flex items-center justify-center px-6">

          <div className="w-full max-w-5xl flex flex-col items-center text-center -mt-6">

{/* LOGO SENAR CENTRAL */}
<div className="mb-5 opacity-90">

  <Image
    src="/logo-senar.png"
    alt="Logo SENAR"
    width={190}
    height={70}
    priority
    className="
      object-contain
      mx-auto
      drop-shadow-[0_0_25px_rgba(0,255,120,0.10)]
    "
  />

</div>

            {/* BADGE */}
            <div className="
              mb-7
              px-5
              py-2
              rounded-full
              border
              border-yellow-400/15
              bg-yellow-400/10
              text-yellow-300
              text-xs
              md:text-sm
              font-semibold
              tracking-[0.25em]
              uppercase
              backdrop-blur-sm
            ">

              SENAR • EXPERIÊNCIA GAMIFICADA

            </div>

            {/* TÍTULO */}
            <h1 className="
              font-black
              uppercase
              tracking-tight
              leading-none
            ">

              <span className="
                block
                text-5xl
                md:text-7xl
                text-yellow-400
                drop-shadow-[0_0_25px_rgba(255,215,0,0.25)]
              ">

                Safra

              </span>

              <span className="
                block
                text-6xl
                md:text-8xl
                text-white
                mt-1
                drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]
              ">

                Milionária

              </span>

            </h1>

            {/* LINHA */}
            <div className="
              w-28
              h-1
              bg-yellow-400
              rounded-full
              mt-7
              mb-8
              shadow-[0_0_15px_rgba(255,215,0,0.30)]
            " />

            {/* DESCRIÇÃO */}
            <p className="
              text-center
              text-lg
              md:text-2xl
              text-gray-200
              max-w-3xl
              leading-relaxed
            ">

              Aprenda{" "}

              <span className="text-green-400 font-bold">

                Economia do Agronegócio

              </span>{" "}

              através de uma experiência gamificada,
              estratégica e interativa.

              <br />

              Responda perguntas, avance de nível e tente conquistar

              <span className="text-yellow-400 font-black">

                {" "}R$ 1 MILHÃO

              </span>.

            </p>

            {/* BOTÃO */}
            <Link
              href="/cadastro"
              className="
                mt-12
                group
                relative
                overflow-hidden
                bg-yellow-400
                hover:bg-yellow-300
                text-black
                font-black
                text-xl
                md:text-2xl
                px-14
                py-5
                rounded-2xl
                shadow-[0_0_35px_rgba(255,215,0,0.30)]
                transition-all
                duration-300
                hover:scale-105
              "
            >

              {/* EFEITO */}
              <div className="
                absolute
                inset-0
                opacity-0
                group-hover:opacity-100
                transition
                duration-500
                bg-white/20
              " />

              <span className="
                relative
                z-10
                flex
                items-center
                gap-3
              ">

                🚜 COMEÇAR JOGO

              </span>

            </Link>

           {/* BOTÃO INSTALAR APP */}
<button
  onClick={handleInstall}
  className="
    mt-5
    group
    relative
    overflow-hidden
    border
    border-yellow-400/20
    bg-black/35
    hover:bg-black/50
    text-yellow-300
    font-bold
    text-sm
    md:text-base
    px-8
    py-4
    rounded-2xl
    backdrop-blur-md
    transition-all
    duration-300
    hover:scale-105
    shadow-[0_0_25px_rgba(255,215,0,0.10)]
  "
>

  <div className="
    absolute
    inset-0
    opacity-0
    group-hover:opacity-100
    transition
    duration-500
    bg-white/5
  " />

  <span className="
    relative
    z-10
    flex
    items-center
    gap-3
    tracking-wide
  ">

    📲 INSTALAR APP

  </span>

</button>

<p className="
  mt-3
  text-xs
  md:text-sm
  text-gray-400
  tracking-wide
">

  Jogue em tela cheia no celular

</p>
          </div>

        </div>

        {/* RODAPÉ */}
        <footer className="
          relative
          z-10
          border-t
          border-green-900/50
          bg-black/20
          backdrop-blur-md
          py-3
        ">

          <div className="text-center">

            <p className="
              text-sm
              text-gray-400
              tracking-wide
            ">

              Desenvolvido pelo Instrutor

              <span className="text-yellow-400 font-semibold">

                {" "}Reginaldo V. Vantini

              </span>

              <span className="text-gray-500">

                {" "}— professorvantini@gmail.com

              </span>

            </p>

          </div>

        </footer>

      </div>

    </main>

  );
}