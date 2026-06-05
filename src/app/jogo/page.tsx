"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import LayoutDesktop from "@/components/game/LayoutDesktop";
import LayoutMobile from "@/components/game/LayoutMobile";
import GameModal from "@/components/ui/GameModal";

// EMBARALHAR ARRAY
function shuffleArray(array: any[]) {

  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [newArray[i], newArray[j]] =
      [newArray[j], newArray[i]];
  }

  return newArray;
}

// EMBARALHAR ALTERNATIVAS
function embaralharAlternativas(pergunta: any) {

  const alternativasComIndice =
    pergunta.alternativas.map(
      (alt: string, index: number) => ({
        texto: alt,
        original: index,
      })
    );



  const embaralhadas =
    shuffleArray(alternativasComIndice);

  const novaCorreta =
    embaralhadas.findIndex(
      (alt) => alt.original === pergunta.correta
    );

  return {
    ...pergunta,
    alternativas: embaralhadas.map(
      (alt) => alt.texto
    ),
    correta: novaCorreta,
  };
}

export default function JogoPage() {

    // =========================
  // ÁUDIO
  // =========================

  const backgroundMusic =
    useRef<HTMLAudioElement | null>(null);

  const correctSound =
    useRef<HTMLAudioElement | null>(null);

  const wrongSound =
    useRef<HTMLAudioElement | null>(null);

  const clickSound =
    useRef<HTMLAudioElement | null>(null);

  const winSound =
    useRef<HTMLAudioElement | null>(null);

  const gameOverSound =
    useRef<HTMLAudioElement | null>(null);

  const [audioLigado, setAudioLigado] =
    useState(true);

  const [telaCheia, setTelaCheia] =
  useState(false);

  const [zoomInterface, setZoomInterface] =
useState(100);

      // =========================
  // TIMER
  // =========================

  const TEMPO_LIMITE = 60;

  const [tempoRestante, setTempoRestante] =
    useState(TEMPO_LIMITE);

  const [tempoEsgotado, setTempoEsgotado] =
    useState(false);

  const [carregandoPergunta, setCarregandoPergunta] =
  useState(true);



      // =========================
  // PREMIAÇÃO OFICIAL
  // =========================

  const premiacao = [
    1000,
    2000,
    3000,
    4000,
    5000,

    10000,
    20000,
    30000,
    40000,
    50000,

    100000,
    200000,
    300000,
    400000,
    500000,

    1000000,
  ];

  // JOGADOR
  const [nome, setNome] = useState("");
  const [polo, setPolo] = useState("");
  const [curso, setCurso] = useState("");

  // GAME
  const [pontuacao, setPontuacao] = useState(0);
const [temasSelecionados, setTemasSelecionados] =
  useState<string[]>(() => {

    if (
      typeof window === "undefined"
    ) {
      return ["Tema 1"];
    }

    const temasSalvos =
      localStorage.getItem(
        "safra-temas"
      );

    return temasSalvos
      ? JSON.parse(temasSalvos)
      : ["Tema 1"];
  });


useEffect(() => {

  localStorage.setItem(
    "safra-temas",
    JSON.stringify(
      temasSelecionados
    )
  );

}, [temasSelecionados]);


  const [quantidadeAcertos, setQuantidadeAcertos] =
  useState(0);
  const [gameOver, setGameOver] = useState(false);

  // QUESTÕES
  const [perguntasFiltradas, setPerguntasFiltradas] =
    useState<any[]>([]);

    const [estatisticasTemas, setEstatisticasTemas] =
  useState<any[]>([]);

  const [indiceQuestao, setIndiceQuestao] =
    useState(0);

  // RESPOSTAS
  const [respostaSelecionada, setRespostaSelecionada] =
    useState("");

  const [respostaConfirmada, setRespostaConfirmada] =
    useState(false);

  const [acertou, setAcertou] =
    useState(false);

  // TRANSIÇÃO
  const [transicao, setTransicao] =
    useState(false);

    // =========================
// ANIMAÇÃO DAS ALTERNATIVAS
// =========================

const [alternativasVisiveis, setAlternativasVisiveis] =
  useState<number[]>([]);

    // =========================
// CONFIRMAÇÃO CINEMATOGRÁFICA
// =========================

const [mostrarConfirmacao, setMostrarConfirmacao] =
  useState(false);

const [processandoResposta, setProcessandoResposta] =
  useState(false);
  
   

  // =========================
  // AJUDAS
  // =========================

  const [consultoriaUsada, setConsultoriaUsada] =
    useState(false);

  const [cartasUsada, setCartasUsada] =
    useState(false);

  const [trocaUsada, setTrocaUsada] =
    useState(false);

  const [mostrarConsultoria, setMostrarConsultoria] =
    useState(false);



    // =========================
// CONSULTORIA TÉCNICA
// =========================

const [consultores, setConsultores] =
  useState<any[]>([]);

const [consultoriaCarregando, setConsultoriaCarregando] =
  useState(false);

///////////////////////////////////////////////////////

// =========================
// IA AGRO
// =========================

const [mostrarIAAgro, setMostrarIAAgro] =
  useState(false);

const [iaAgroUsada, setIAAgroUsada] =
  useState(false);

const [iaCarregando, setIACarregando] =
  useState(false);

const [respostaIA, setRespostaIA] =
  useState<number | null>(null);

  /////////////////////////////////////////////////////

// =========================
// PULAR QUESTÃO
// =========================

const [mostrarPularPopup, setMostrarPularPopup] =
  useState(false);

const [processandoPulo, setProcessandoPulo] =
  useState(false);

/////////////////////////////////////////

// =========================
// PARAR JOGO
// =========================

const [mostrarPararPopup, setMostrarPararPopup] =
  useState(false);

const [processandoParada, setProcessandoParada] =
  useState(false);

  ///////////////////////////////////

  const [alternativasEliminadas, setAlternativasEliminadas] =
    useState<number[]>([]);

  const [sugestaoConsultoria, setSugestaoConsultoria] =
    useState<number | null>(null);
  
async function salvarRanking() {

  const { error } = await supabase
    .from("Classificação")
    .insert([
      {
        Nome: nome,
        Polo: polo,
        Curso: curso,
        Pontuacao: pontuacao,
        acertos: quantidadeAcertos,
      },
    ]);

  if (error) {

    console.log(
      "Erro ao salvar ranking:",
      error
    );

  } else {

    console.log(
      "Ranking salvo com sucesso!"
    );
  }
}

    // =========================
   // CARREGAR ÁUDIOS
  // =========================

  useEffect(() => {

    backgroundMusic.current =
      new Audio("/sounds/background.mp3");

    correctSound.current =
      new Audio("/sounds/correct.mp3");

    wrongSound.current =
      new Audio("/sounds/wrong.mp3");

    clickSound.current =
      new Audio("/sounds/click.mp3");

    winSound.current =
      new Audio("/sounds/win.mp3");

    gameOverSound.current =
      new Audio("/sounds/gameover.mp3");

    if (backgroundMusic.current) {

      backgroundMusic.current.loop = true;

      backgroundMusic.current.volume = 0.2;

      backgroundMusic.current.play()
        .catch(() => {});
    }

    const audioSalvo =
      localStorage.getItem("audioLigado");

    if (audioSalvo === "false") {

      setAudioLigado(false);

      backgroundMusic.current?.pause();
    }

  }, []);


  
  // TOGGLE ÁUDIO
  function toggleAudio() {

    const novoEstado =
      !audioLigado;

    setAudioLigado(novoEstado);

    localStorage.setItem(
      "audioLigado",
      novoEstado.toString()
    );

    if (novoEstado) {

      backgroundMusic.current?.play();

    } else {

      backgroundMusic.current?.pause();
    }
  }
  function alterarZoom(valor: number) {

  if (
    typeof document === "undefined"
  ) return;

  document.body.style.zoom =
    `${valor}%`;

  setZoomInterface(valor);
}
  async function toggleTelaCheia() {

  if (
    typeof document === "undefined"
  ) return;

  if (!document.fullscreenElement) {

    await document.documentElement
      .requestFullscreen();

    setTelaCheia(true);

  } else {

    await document.exitFullscreen();

    setTelaCheia(false);
  }
}

  // TOCAR SOM
  function tocarSom(
    audio: React.RefObject<HTMLAudioElement | null>
  ) {

    if (!audioLigado) return;

    if (audio.current) {

      audio.current.currentTime = 0;

      audio.current.play()
        .catch(() => {});
    }
  }

   // =========================
  // CARREGAR EXCEL
  // =========================

  
    async function iniciarNovaPartida() {

      // =========================
// RESETAR PARTIDA
// =========================

setGameOver(false);

setIndiceQuestao(0);

setPontuacao(0);

setQuantidadeAcertos(0);

setTempoRestante(TEMPO_LIMITE);

setTempoEsgotado(false);

setRespostaSelecionada("");

setRespostaConfirmada(false);

setAlternativasEliminadas([]);

setMostrarConsultoria(false);

setSugestaoConsultoria(null);

setConsultoriaUsada(false);

setCartasUsada(false);

setTrocaUsada(false);

// =========================
// RESET IA AGRO
// =========================

setIAAgroUsada(false);

setMostrarIAAgro(false);

setIACarregando(false);

setRespostaIA(null);

// RESET PULAR QUESTÃO

setMostrarPularPopup(false);

setProcessandoPulo(false);

////////////////////

// RESET PARAR JOGO

setMostrarPararPopup(false);

setProcessandoParada(false);

///////////////////////

setCarregandoPergunta(true);

      try {

        const nomeSalvo =
          localStorage.getItem("nome");

        const poloSalvo =
          localStorage.getItem("polo");

        const cursoSalvo =
          localStorage.getItem("curso");

        if (nomeSalvo) setNome(nomeSalvo);
        if (poloSalvo) setPolo(poloSalvo);
        if (cursoSalvo) setCurso(cursoSalvo);

        const resposta =
          await fetch(
            "/data/questions.xlsx"
          );

        const arrayBuffer =
          await resposta.arrayBuffer();

        const workbook =
          XLSX.read(arrayBuffer, {
            type: "array",
          });

        const primeiraAba =
          workbook.SheetNames[0];

        const worksheet =
          workbook.Sheets[primeiraAba];

        const dados =
          XLSX.utils.sheet_to_json(
            worksheet
          );

const dadosLimpos =
  dados.filter(
    (linha: any) =>
      linha.ENUNCIADO &&
      linha.GABARITO
  );

        // CONVERTER
        const perguntasConvertidas =
          dadosLimpos.map((linha: any) => ({

            id:
  linha.ID,

tema:
  linha.TEMA,

            pergunta:
              linha.ENUNCIADO,

            alternativas: [

              linha.A,
              linha.B,
              linha.C,
              linha.D,
              linha.E,

            ],

            correta:
  Number(linha.GABARITO),

            feedback:
  linha.FEEDBACK,

fonte:
  linha.FONTE,

nivel:
  linha.NIVEL || "",

          }));

        // =========================
// ENGINE INTELIGENTE
// QUESTÕES NÃO REPETIDAS
// =========================

// LER HISTÓRICO

const historicoSalvo =

  typeof window !== "undefined"

    ? localStorage.getItem(
        chaveHistorico
      )

    : null;

const historico =
  historicoSalvo
    ? JSON.parse(historicoSalvo)
    : {};


// FILTRAR QUESTÕES DOS TEMAS
const perguntasTema =
  perguntasConvertidas.filter(
    (q: any) =>
      temasSelecionados.includes(
        q.tema
      )
  );

// =========================
// IDs JÁ JOGADOS
// MULTITEMAS
// =========================

const idsJogadas =
  temasSelecionados.flatMap(
    (tema) =>
      historico[tema] || []
  );

// REMOVER REPETIDAS
let perguntasDisponiveis =
  perguntasTema.filter(
    (q: any) =>
      !idsJogadas.includes(q.id)
  );

// REINICIAR CICLO
if (
  perguntasDisponiveis.length < 16
) {

  temasSelecionados.forEach((tema) => {

  historico[tema] = [];

});

  localStorage.setItem(
    chaveHistorico,
    JSON.stringify(historico)
  );

  perguntasDisponiveis =
    perguntasTema;
}

// =========================
// QUESTÕES OURO
// PRIORIDADE MÁXIMA
// =========================

const perguntasOuro =
  perguntasDisponiveis.filter(
    (q: any) =>
      q.nivel?.toLowerCase() ===
      "ouro"
  );

const perguntasNormais =
  perguntasDisponiveis.filter(
    (q: any) =>
      q.nivel?.toLowerCase() !==
      "ouro"
  );

// EMBARALHAR
const ouroEmbaralhadas =
  shuffleArray(perguntasOuro);

const normaisEmbaralhadas =
  shuffleArray(perguntasNormais);

  // =========================
// ÚLTIMA QUESTÃO ERRADA
// =========================

const ultimaErradaSalva =

  typeof window !== "undefined"

    ? localStorage.getItem(
        "ultima-questao-errada"
      )

    : null;

let ultimaErrada: any = null;

if (ultimaErradaSalva) {

  ultimaErrada =
    JSON.parse(ultimaErradaSalva);
}

// =========================
// PRIORIDADE OURO
// =========================

let perguntasSelecionadas = [

  ...ouroEmbaralhadas,

  ...normaisEmbaralhadas,

];

// =========================
// ÚLTIMA ERRADA PRIMEIRO
// =========================

if (ultimaErrada) {

  perguntasSelecionadas =
    perguntasSelecionadas.filter(
      (q: any) =>
        q.id !== ultimaErrada.id
    );

  perguntasSelecionadas.unshift(
    ultimaErrada
  );
}

// PEGAR 16
perguntasSelecionadas =
  perguntasSelecionadas.slice(0, 16);


  

        const perguntasComAlternativas =
          perguntasSelecionadas.map(
            (pergunta: any) =>
              embaralharAlternativas(
                pergunta
              )
          );

        setPerguntasFiltradas(
          perguntasComAlternativas
        );

        // =========================
// ESTATÍSTICAS AUTOMÁTICAS
// =========================

const temasMap = new Map();

perguntasConvertidas.forEach((q: any) => {

  if (!temasMap.has(q.tema)) {

    temasMap.set(q.tema, {
      tema: q.tema,
      total: 0,
      jogadas:
        historico[q.tema]?.length || 0,
    });
  }

  temasMap.get(q.tema).total++;
});

const estatisticas =
  Array.from(temasMap.values())
    .map((tema: any) => ({

      ...tema,

      restantes:
        tema.total - tema.jogadas,

    }));

setEstatisticasTemas(estatisticas);

        setCarregandoPergunta(false);

      } catch (erro) {

        console.error(
          "Erro ao carregar Excel:",
          erro
        );

        alert(
          "Erro ao carregar questions.xlsx"
        );
      }
    }

   useEffect(() => {

  iniciarNovaPartida();

}, []);

  // =========================
  // TIMER
  // =========================

  useEffect(() => {

  // =========================
  // BLOQUEAR TIMER
  // =========================

  if (

    carregandoPergunta ||

    perguntasFiltradas.length === 0 ||

    respostaConfirmada ||

    tempoEsgotado

  ) return;

  // =========================
  // TEMPO ESGOTADO
  // =========================

  if (tempoRestante <= 0) {

    setTempoEsgotado(true);

    setRespostaConfirmada(true);

    setAcertou(false);

    tocarSom(wrongSound);

    
    return;
  }

 

  // =========================
  // CONTAGEM
  // =========================

  const intervalo =
    setInterval(() => {

      setTempoRestante(
        (prev) => prev - 1
      );

    }, 1000);

  return () =>
    clearInterval(intervalo);

}, [

  carregandoPergunta,

  perguntasFiltradas,

  tempoRestante,

  respostaConfirmada,

  tempoEsgotado,

]);

  // QUESTÃO
  const questaoAtual =
    perguntasFiltradas[indiceQuestao];

      const valorQuestaoAtual =
    premiacao[indiceQuestao] || 0;


    // =========================
// VALORES DINÂMICOS DO JOGO
// =========================

const valorAtual =
  premiacao[indiceQuestao] || 0;

const valorParar =
  pontuacao;

const valorErrar =
  indiceQuestao === premiacao.length - 1
    ? 0
    : Math.floor(pontuacao / 2);

// =========================
// VALOR FINAL GAME OVER
// =========================

const valorFinalGameOver =
  acertou
    ? pontuacao
    : valorErrar;


// =========================
// AJUDAS DISPONÍVEIS
// =========================

const ajudasDisponiveis = [];

if (!cartasUsada) {

  ajudasDisponiveis.push(
    "🚜 Cartas da Fazenda"
  );

}

if (!consultoriaUsada) {

  ajudasDisponiveis.push(
    "👨‍🌾 Consultoria Técnica"
  );

}

if (!iaAgroUsada) {

  ajudasDisponiveis.push(
    "🤖 IA Agro"
  );

}

if (!trocaUsada) {

  ajudasDisponiveis.push(
    "🌱 Pular Questão"
  );

}


    // =========================
// ESTATÍSTICAS DOS TEMAS
// =========================

const chaveHistorico =
  "safra-history";

const historicoSalvo =

  typeof window !== "undefined"

    ? localStorage.getItem(
        chaveHistorico
      )

    : null;

const historico =
  historicoSalvo
    ? JSON.parse(historicoSalvo)
    : {};


    // =========================
// TIMER CIRCULAR SVG
// =========================

const raioTimer = 18;

const circunferenciaTimer =
  2 * Math.PI * raioTimer;

const progressoTimer =
  (tempoRestante / TEMPO_LIMITE) *
  circunferenciaTimer;

// =========================
// ENTRADA CINEMATOGRÁFICA
// =========================

useEffect(() => {

  if (!questaoAtual) return;

  // LIMPA
  setAlternativasVisiveis([]);

  // TIMERS
  const timers: NodeJS.Timeout[] = [];

  // MOSTRA UMA POR VEZ
  questaoAtual.alternativas.forEach(
    (_: string, index: number) => {

      const timer = setTimeout(() => {

        setAlternativasVisiveis(prev => {

          if (prev.includes(index))
            return prev;

          return [...prev, index];
        });

      }, 1200 + index * 320);

      timers.push(timer);
    }
  );

  // LIMPA TIMERS
  return () => {

    timers.forEach(clearTimeout);

  };

}, [indiceQuestao, questaoAtual]);

  // =========================
  // FASES
  // =========================

  let faseAtual =
    "🌱Produção Inicial";

  let corFase =
    "text-green-400";

  if (indiceQuestao >= 5) {

    faseAtual =
      "🚜Expansão Rural";

    corFase =
      "text-yellow-400";
  }

  if (indiceQuestao >= 10) {

    faseAtual =
      "🏭Império Agro";

    corFase =
      "text-orange-400";
  }

  if (indiceQuestao >= 15) {

    faseAtual =
      "👑Final do Milhão";

    corFase =
      "text-purple-400 animate-pulse";
  }


  // PROGRESSO
  const progresso = useMemo(() => {

    if (perguntasFiltradas.length === 0)
      return 0;

    return (
      ((indiceQuestao + 1) /
        perguntasFiltradas.length) * 100
    );

  }, [indiceQuestao, perguntasFiltradas]);

  function confirmarResposta() {

  if (respostaConfirmada) return;

  if (!respostaSelecionada) {

    alert("Selecione uma alternativa.");

    return;
  }

  tocarSom(clickSound);

  setRespostaConfirmada(true);

  // =========================
  // RESPOSTA CORRETA
  // =========================

  if (

    Number(respostaSelecionada) ===
    questaoAtual.correta

  ) {

    setAcertou(true);

    tocarSom(correctSound);

    setPontuacao(
      valorQuestaoAtual
    );

    setQuantidadeAcertos(
      (prev) => prev + 1
    );

    // =========================
    // SALVAR HISTÓRICO
    // SOMENTE ACERTOS
    // =========================

    const chaveHistorico =
      "safra-history";

    const historicoSalvo =
      localStorage.getItem(
        chaveHistorico
      );

    const historico =
      historicoSalvo
        ? JSON.parse(historicoSalvo)
        : {};

    // CRIAR TEMA
    if (
      !historico[
        questaoAtual.tema
      ]
    ) {

      historico[
        questaoAtual.tema
      ] = [];
    }

    // EVITAR DUPLICAÇÃO
    if (
      !historico[
        questaoAtual.tema
      ].includes(
        questaoAtual.id
      )
    ) {

      historico[
        questaoAtual.tema
      ].push(
        questaoAtual.id
      );
    }

    // SALVAR
    localStorage.setItem(

      chaveHistorico,

      JSON.stringify(
        historico
      )
    );

    // =========================
    // LIMPAR ÚLTIMA ERRADA
    // =========================

    localStorage.removeItem(
      "ultima-questao-errada"
    );

  }

  // =========================
  // RESPOSTA ERRADA
  // =========================

  else {

    setAcertou(false);

    tocarSom(wrongSound);

    // =========================
    // SALVAR ÚLTIMA ERRADA
    // =========================

    localStorage.setItem(

      "ultima-questao-errada",

      JSON.stringify(
        questaoAtual
      )
    );
  }
}


  // PRÓXIMA QUESTÃO
  function proximaQuestao() {

  tocarSom(clickSound);

  setTransicao(true);

  // RESETAR TIMER
  setTempoRestante(TEMPO_LIMITE);

  setTempoEsgotado(false);

  // VERIFICAR SE É A ÚLTIMA QUESTÃO
  const ultimaQuestao =
    indiceQuestao >=
    perguntasFiltradas.length - 1;

  setTimeout(async () => {

    // SALVAR RANKING
    if (ultimaQuestao) {

      await salvarRanking();

    }

    setRespostaSelecionada("");

    setRespostaConfirmada(false);

    setAlternativasEliminadas([]);

    setMostrarConsultoria(false);

    setSugestaoConsultoria(null);

    setIndiceQuestao(
      (prev) => prev + 1
    );

    setTransicao(false);

  }, 350);
}

// =========================
// SAIR DO JOGO
// =========================

async function sairDoJogo() {

  tocarSom(clickSound);

  await salvarRanking();

  setGameOver(true);
}

// =========================
// CONFIRMAR PARADA
// =========================

async function confirmarParada() {

  if (processandoParada)
    return;

  setProcessandoParada(true);

  tocarSom(clickSound);

  // DELAY CINEMATOGRÁFICO

  await new Promise(
    resolve =>
      setTimeout(resolve, 1800)
  );

  setMostrarPararPopup(false);

  setProcessandoParada(false);

  // ENCERRAR JOGO

  await sairDoJogo();
}


 
 // =========================
// CONSULTORIA TÉCNICA
// =========================

function usarConsultoria() {

  if (
    consultoriaUsada ||
    respostaConfirmada
  ) return;

  tocarSom(clickSound);

  setConsultoriaUsada(true);

  setMostrarConsultoria(true);

  setConsultoriaCarregando(true);

  // =========================
  // ESPECIALISTAS
  // =========================

  const especialistas = [

    {
      nome: "ATEG",
      emoji: "👨‍🌾",
      cor:
        "from-[#0d3b2e] to-[#071b15]",
      borda:
        "border-green-500/30",
    },

    {
      nome: "Agrônomo",
      emoji: "🌱",
      cor:
        "from-[#3b2e0d] to-[#1b1507]",
      borda:
        "border-yellow-500/30",
    },

    {
      nome: "Zootecnista",
      emoji: "🐄",
      cor:
        "from-[#0d2840] to-[#07131d]",
      borda:
        "border-cyan-400/30",
    },

  ];

  // =========================
  // GERAR SUGESTÕES
  // =========================

  const respostas =
    especialistas.map(
      (especialista) => {

        const chance =
          Math.random();

        let sugestao;

        // 75% ACERTO
        if (chance <= 0.75) {

          sugestao =
            questaoAtual.correta;

        }

        // 25% ERRO
        else {

          const erradas =
            questaoAtual.alternativas
              .map(
                (_: any, i: number) => i
              )
              .filter(
                (i: number) =>
                  i !==
                  questaoAtual.correta
              );

          sugestao =
            erradas[
              Math.floor(
                Math.random() *
                erradas.length
              )
            ];
        }

        return {

          ...especialista,

          resposta:
            sugestao,

        };
      }
    );

  // =========================
  // REVELAÇÃO CINEMATOGRÁFICA
  // =========================

  setConsultores([]);

  setTimeout(() => {

    setConsultoriaCarregando(false);

    respostas.forEach(
      (consultor, index) => {

        setTimeout(() => {

          setConsultores(
            prev => [
              ...prev,
              consultor,
            ]
          );

        }, index * 1200);

      }
    );

  }, 1800);
}

  // =========================
// CARTAS DA FAZENDA
// =========================

const [mostrarCartasPopup, setMostrarCartasPopup] =
  useState(false);

const [cartasEmbaralhadas, setCartasEmbaralhadas] =
  useState<any[]>([]);

const [cartaVirada, setCartaVirada] =
  useState<number | null>(null);

const [resultadoCarta, setResultadoCarta] =
  useState<any | null>(null);

function usarCartas() {

  if (
    cartasUsada ||
    respostaConfirmada
  ) return;

  tocarSom(clickSound);

  const cartas = shuffleArray([

    {
      id: 1,
      nome: "Enxada",
      emoji: "🪓",
      subtitulo: "Elimina 1 alternativa",
      elimina: 1,
      cor:
        "from-[#3b2b17] to-[#1d1208]",
      borda:
        "border-amber-700/40",
    },

    {
      id: 2,
      nome: "Trator",
      emoji: "🚜",
      subtitulo: "Elimina 2 alternativas",
      elimina: 2,
      cor:
        "from-[#0d3b2e] to-[#061b15]",
      borda:
        "border-green-500/30",
    },

    {
      id: 3,
      nome: "Colheitadeira",
      emoji: "🌾",
      subtitulo: "Elimina 3 alternativas",
      elimina: 3,
      cor:
        "from-[#4b3a0f] to-[#1d1405]",
      borda:
        "border-yellow-500/30",
    },

    {
      id: 4,
      nome: "Drone Agrícola",
      emoji: "🚁",
      subtitulo: "Elimina 4 alternativas",
      elimina: 4,
      cor:
        "from-[#0b2840] to-[#06131f]",
      borda:
        "border-cyan-400/30",
    },

  ]);

  setCartasEmbaralhadas(cartas);

  setCartaVirada(null);

  setResultadoCarta(null);

  setMostrarCartasPopup(true);
}

// =========================
// VIRAR CARTA
// =========================

function virarCarta(carta: any, index: number) {

  if (cartaVirada !== null)
    return;

  tocarSom(clickSound);

  setCartaVirada(index);

  setResultadoCarta(carta);

  // =========================
  // ELIMINAR ALTERNATIVAS
  // =========================

  const erradas =
    questaoAtual.alternativas
      .map((_: any, i: number) => i)
      .filter(
        (i: number) =>
          i !== questaoAtual.correta
      );

  const erradasEmbaralhadas =
    shuffleArray(erradas);

  const remover =
    erradasEmbaralhadas.slice(
      0,
      carta.elimina
    );

  setTimeout(() => {

    setAlternativasEliminadas(
      remover
    );

    setCartasUsada(true);

  }, 900);
}

// =========================
// IA AGRO
// =========================

function usarIAAgro() {

  // BLOQUEIOS
  if (
    iaAgroUsada ||
    respostaConfirmada ||
    !questaoAtual
  ) return;

  tocarSom(clickSound);

  // ABRIR POPUP
  setMostrarIAAgro(true);

  // MARCAR USADA
  setIAAgroUsada(true);

  // LOADING
  setIACarregando(true);

  // LIMPAR
  setRespostaIA(null);

  // =========================
  // RESPOSTA CORRETA
  // =========================

  const respostaFinal =
    questaoAtual.correta;

  // =========================
  // DELAY CINEMATOGRÁFICO
  // =========================

  setTimeout(() => {

    setIACarregando(false);

    setRespostaIA(
      respostaFinal
    );

  }, 3200);
}
  // =========================
// PULAR QUESTÃO
// =========================

function usarTrocaTalhao() {

  if (
    trocaUsada ||
    respostaConfirmada
  ) return;

  tocarSom(clickSound);

  setMostrarPularPopup(true);
}
  

// =========================
// CONFIRMAR PULO
// =========================

async function confirmarPuloQuestao() {

  if (processandoPulo)
    return;

  setProcessandoPulo(true);

  tocarSom(clickSound);

  // DELAY CINEMATOGRÁFICO
  await new Promise(
    resolve =>
      setTimeout(resolve, 1400)
  );

  setTrocaUsada(true);

  setMostrarPularPopup(false);

  setProcessandoPulo(false);

  proximaQuestao();
}



  // FINAL SOM
  useEffect(() => {

    if (
      perguntasFiltradas.length > 0 &&
      indiceQuestao >= perguntasFiltradas.length
    ) {

      backgroundMusic.current?.pause();

      tocarSom(winSound);
    }

  }, [indiceQuestao]);

  // GAME OVER
  if (gameOver) {

  return (

    <main
  className="
    min-h-[100dvh]
    overflow-x-hidden
    overflow-y-auto
    bg-[#03140F]
    text-white
    flex
    flex-col
  "
>

      <div
        className="
          w-full
          max-w-5xl
          bg-black/20
          border
          border-green-900/40
          rounded-3xl
          p-8
        "
      >

        {/* TOPO */}
        <div className="text-center mb-8">

          <h1
            className="
              text-5xl
              font-black
              text-red-400
              mb-3
            "
          >

            QUEBRA DE SAFRA

          </h1>

          <h2
            className="
              text-2xl
              md:text-4xl
              font-black
              text-yellow-300
            "
          >

            R$ {valorFinalGameOver}

          </h2>

        </div>

        {/* TABELA */}
        <div className="space-y-3 mb-8">

          {estatisticasTemas.map((tema) => {

            const ativo =
              temasSelecionados.includes(
                tema.tema
              );

            return (

              <div
                key={tema.tema}
                className="
                  grid
                  grid-cols-5
                  items-center
                  gap-3
                  bg-black/30
                  rounded-2xl
                  p-4
                  border
                  border-green-900/30
                "
              >

                {/* TEMA */}
                <div className="font-black text-green-300">

                  {tema.tema}

                </div>

                {/* TOTAL */}
                <div className="text-center">

                  <p className="text-xs text-gray-400">
                    TOTAL
                  </p>

                  <h3 className="font-black">

                    {tema.total}

                  </h3>

                </div>

                {/* JOGADAS */}
                <div className="text-center">

                  <p className="text-xs text-gray-400">
                    JOGADAS
                  </p>

                  <h3 className="font-black text-yellow-300">

                    {tema.jogadas}

                  </h3>

                </div>

                {/* RESTANTES */}
                <div className="text-center">

                  <p className="text-xs text-gray-400">
                    RESTANTES
                  </p>

                  <h3 className="font-black text-green-300">

                    {tema.restantes}

                  </h3>

                </div>

                {/* BOTÃO */}
                <div className="text-center">

                  <button

                    onClick={() => {

                      let novosTemas =
                        [...temasSelecionados];

                      if (ativo) {

                        novosTemas =
                          novosTemas.filter(
                            (t) =>
                              t !== tema.tema
                          );

                      } else {

                        if (
                          novosTemas.length >= 3
                        ) return;

                        novosTemas.push(
                          tema.tema
                        );
                      }

                      setTemasSelecionados(
                        novosTemas
                      );
                    }}

                    className={`
                      px-4
                      py-2
                      rounded-xl
                      font-black
                      text-sm
                      transition-all

                      ${
                        ativo

                          ? "bg-yellow-400 text-black"

                          : "bg-green-500/10 text-green-300 border border-green-500/30"
                      }
                    `}
                  >

                    {
                      ativo
                        ? "SELECIONADO"
                        : "JOGAR"
                    }

                  </button>

                </div>

              </div>

            );
          })}

        </div>

        {/* BOTÃO FINAL */}
        <div className="text-center">

          <button

            onClick={() => {

              iniciarNovaPartida();

            }}

            className="
              bg-yellow-400
              hover:bg-yellow-300
              text-black
              font-black
              text-xl
              px-10
              py-4
              rounded-2xl
              transition-all
            "
          >

            NOVA PARTIDA

          </button>

        </div>

      </div>

    </main>

  );
}

  // FINAL
  if (
    perguntasFiltradas.length > 0 &&
    indiceQuestao >= perguntasFiltradas.length
  ) {

    const totalPerguntas =
      perguntasFiltradas.length;

    const acertos =
  quantidadeAcertos;

    const percentual =
      Math.round(
        (acertos / totalPerguntas) * 100
      );

    let medalha = "🥉 Bronze";

    if (percentual >= 90)
      medalha = "🏆 Lenda do Agro";

    else if (percentual >= 70)
      medalha = "🥇 Ouro";

    else if (percentual >= 50)
      medalha = "🥈 Prata";

    return (
      <main className="min-h-screen bg-[#061b11] text-white flex flex-col justify-between relative overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f5132_0%,#061b11_55%,#020303_100%)]"></div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-6">

          <div className="max-w-4xl w-full bg-white/5 border border-green-900/40 backdrop-blur-md rounded-3xl p-12 shadow-2xl text-center">

            <h1 className="text-6xl font-black text-yellow-400 mb-8">

  {
    pontuacao >= 1000000
      ? "👑 LENDA DO AGRONEGÓCIO"
      : "🌾 SAFRA CONCLUÍDA"
  }

</h1>

           <p className="text-lg mb-6">

  {
    pontuacao >= 1000000
      ? "Você conquistou o topo do agronegócio, "
      : pontuacao >= 500000
      ? "Você construiu um verdadeiro império rural, "
      : pontuacao >= 50000
      ? "Excelente crescimento no agronegócio, "
      : pontuacao >= 10000
      ? "Sua fazenda está evoluindo, "
      : "Continue expandindo sua produção, "
  }

  <span className="text-yellow-400 font-bold">
    {nome}
  </span>

</p>

            <div className="grid md:grid-cols-3 gap-3 md:gap-6 my-10">

              <div className="bg-black/20 rounded-2xl p-6">
                <p className="text-gray-400 mb-2">
                  Patrimônio
                </p>

                <h2 className="text-2xl md:text-4xl font-black text-green-400">
                  R$ {pontuacao}
                </h2>
              </div>

              <div className="bg-black/20 rounded-2xl p-6">
                <p className="text-gray-400 mb-2">
                  Desempenho
                </p>

                <h2 className="text-2xl md:text-4xl font-black text-yellow-400">
                  {percentual}%
                </h2>
              </div>

              <div className="bg-black/20 rounded-2xl p-6">
                <p className="text-gray-400 mb-2">
                  Medalha
                </p>

                <h2 className="text-3xl font-black">
                  {medalha}
                </h2>
              </div>

            </div>

{/* TEMAS */}
<div className="mb-8">

  <h3 className="text-2xl font-black text-yellow-400 mb-4">

    🎯 Escolha os Temas

  </h3>

  <div className="flex flex-wrap gap-3 justify-center">

    {[
      "Tema 1",
      "Tema 2",
      "Tema 3",
      "Tema 4",
      "Tema 5",
      "Tema 6",
    ].map((tema) => {

      const ativo =
        temasSelecionados.includes(tema);

      return (

        <button
          key={tema}

          onClick={() => {

            if (ativo) {

              setTemasSelecionados(
                temasSelecionados.filter(
                  (t) => t !== tema
                )
              );

            } else {

              if (
                temasSelecionados.length >= 3
              ) return;

              setTemasSelecionados([
                ...temasSelecionados,
                tema,
              ]);
            }
          }}

          className={`
            px-5
            py-3
            rounded-2xl
            font-black
            transition-all
            duration-300
            border

            ${
              ativo

                ? "bg-yellow-400 text-black border-yellow-300"

                : "bg-black/20 text-white border-green-900/40 hover:bg-green-500/10"
            }
          `}
        >

          {tema}

        </button>
      );
    })}

  </div>

  <p className="text-sm text-gray-400 mt-3">

    Máximo de 3 temas simultâneos

  </p>

</div>

            {/* ESTATÍSTICAS */}
<div className="mt-10">

  <h3 className="text-2xl font-black text-yellow-400 mb-5">

    📊 Progresso dos Temas

  </h3>

  <div className="space-y-4">

    {estatisticasTemas.map((tema) => (

      <div
        key={tema.tema}
        className="
          rounded-2xl
          border
          border-green-900/40
          bg-black/20
          p-5
          text-left
        "
      >

        {/* TOPO */}
        <div className="flex items-center justify-between mb-4">

          <h4 className="text-xl font-black text-green-300">

            {tema.tema}

          </h4>

          <button
            onClick={() => {

              localStorage.setItem(
                "temaSelecionado",
                tema.tema
              );

              iniciarNovaPartida();

            }}
            className="
              bg-yellow-400
              hover:bg-yellow-300
              text-black
              font-black
              px-5
              py-2
              rounded-xl
              transition-all
              duration-300
            "
          >

            JOGAR

          </button>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-3">

          {/* TOTAL */}
          <div className="bg-black/30 rounded-xl p-3 text-center">

            <p className="text-xs text-gray-400 mb-1">
              TOTAL
            </p>

            <h2 className="text-2xl font-black text-white">

              {tema.total}

            </h2>

          </div>

          {/* JOGADAS */}
          <div className="bg-black/30 rounded-xl p-3 text-center">

            <p className="text-xs text-gray-400 mb-1">
              JOGADAS
            </p>

            <h2 className="text-2xl font-black text-yellow-300">

              {tema.jogadas}

            </h2>

          </div>

          {/* RESTANTES */}
          <div className="bg-black/30 rounded-xl p-3 text-center">

            <p className="text-xs text-gray-400 mb-1">
              RESTANTES
            </p>

            <h2 className="text-2xl font-black text-green-300">

              {tema.restantes}

            </h2>

          </div>

        </div>

      </div>

    ))}

  </div>

</div>

{/* BOTÃO */}
<button
  onClick={() => iniciarNovaPartida()}
  className="
    mt-8
    bg-yellow-400
    hover:bg-yellow-300
    text-black
    font-black
    text-lg
    px-10
    py-5
    rounded-2xl
    transition-all
    duration-300
  "
>
  JOGAR NOVAMENTE
</button>

          </div>

        </div>

        <footer
  className="
    relative
    z-10

    mt-auto

    border-t
    border-green-900/40

    py-2

    text-center

    text-[11px]
    md:text-sm

    text-gray-400

    bg-black/20
  "
>

  Desenvolvido pelo Tutor
  <span className="text-yellow-400 font-bold">
    {" "}Reginaldo V. Vantini
  </span>

  — professorvantini@gmail.com

</footer>

      </main>
    );
  }

  return (

    <LayoutMobile>

    <main className="min-h-[100dvh] bg-[#061b11] text-white flex flex-col relative overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f5132_0%,#061b11_55%,#020303_100%)]"></div>

      <div
  className="
    relative
    z-10

    flex-1

    w-full

    px-[2px]
    md:px-3

    pt-[4px]
    pb-[4px]

    flex
    flex-col

    overflow-visible
  "
>
  

        {/* TOPO MOBILE PREMIUM */}
<div
  className="
    w-full
    max-w-[1400px]
    mx-auto

    flex
    flex-col

    gap-2

    mb-2
  "
>

  {/* LINHA SUPERIOR */}
  <div
    className="
      relative

      rounded-[18px]

      border
      border-green-900/40

      bg-black/25
      backdrop-blur-md

      px-[8px]
      pt-[4px]
      pb-[18px]

      overflow-hidden
    "
  >

    {/* GLOW */}
    <div
      className="
        absolute
        inset-0

        bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.08),transparent_70%)]
      "
    />

    <div
      className="
  relative
  z-10

  grid
  grid-cols-[1fr_auto_1fr]

  items-center

  gap-[10px]

  min-w-0
"
    >

      

      {/* ESQUERDA */}
<div
  className="
    min-w-0

    flex
    flex-col

    justify-center

    justify-self-start
  "
>

        {/* BLOCO ESQUERDO CABEÇALHO */}
<div
  className="
    flex
    flex-col

    justify-start

    pt-[2px]

    leading-none

    min-w-0

    h-[0px]
  "
>

  {/* QUESTÃO */}
  <div
    className="
      flex
      items-center
      gap-[5px]

      whitespace-nowrap
    "
  >

    <span
      className="
        text-[12px]
        uppercase
        tracking-[0.18em]
        text-green-300/65
        font-black
      "
    >
      QUESTÃO
    </span>

    <span
      className="
        text-[13px]
        font-black
        text-yellow-300
      "
    >
      {indiceQuestao + 1}/{perguntasFiltradas.length}
    </span>

{/* BARRA PROGRESSO PREMIUM */}
<div
  className="
    absolute

    left-[0px]
    right-[0px]

    bottom-[1px]

    h-[5px]

    rounded-full

    bg-black/35

    overflow-hidden
  "
>

  <div
    className="
      h-full

      rounded-full

      bg-gradient-to-r
      from-yellow-300
      via-green-400
      to-green-300

      transition-all
      duration-500

      shadow-[0_0_12px_rgba(0,255,120,0.35)]
    "
    style={{
      width: `${progresso}%`,
    }}
  />

</div>

{/* FASE CENTRAL */}
<div
  className="
    absolute

    left-1/2
    -translate-x-1/2

    bottom-[-16px]

    px-3

    flex
    items-center
    justify-center

    whitespace-nowrap
  "
>

  <span
    className="
      text-[12px]

      uppercase

      tracking-[0.18em]

      text-green-300/45

      font-bold

      mr-[4px]
    "
  >
    FASE:
  </span>

  <span
    className={`
      text-[13px]

      font-semibold

      ${corFase}
    `}
  >
    {faseAtual}
  </span>

</div>

  </div>

 
</div>

        
      </div>

      {/* TIMER HEADER */}
<div
  className="
    shrink-0

    justify-self-center
  "
>

  <div className="relative w-[54px] h-[54px]">

    {/* GLOW */}
    <div
      className={`
        absolute
        inset-0
        rounded-full
        blur-[8px]
        transition-all
        duration-500

        ${
          tempoRestante <= 10
            ? "bg-red-500/25"
            : tempoRestante <= 20
            ? "bg-yellow-400/20"
            : "bg-green-400/20"
        }
      `}
    />

    {/* SVG */}
    <svg
  className="
    absolute
    inset-0
    -rotate-90
  "
  viewBox="0 0 64 64"
>

  {/* ANEL BASE */}
  <circle
    cx="32"
    cy="32"
    r="22"

    fill="none"

    stroke="rgba(255,255,255,0.07)"

    strokeWidth="3.5"
  />

  {/* ANEL ANIMADO */}
  <circle
    cx="32"
    cy="32"
    r="26"

    fill="none"

    strokeWidth="3.5"

    strokeLinecap="round"

    stroke={
      tempoRestante <= 10
        ? "#ef4444"
        : tempoRestante <= 20
        ? "#facc15"
        : "#22c55e"
    }

    strokeDasharray={circunferenciaTimer}

    strokeDashoffset={
      circunferenciaTimer *
      (1 - tempoRestante / TEMPO_LIMITE)
    }

    style={{
      transition:
        "stroke-dashoffset 1s linear, stroke 0.4s ease",
      transformOrigin: "50% 50%",
    }}

    className="
      drop-shadow-[0_0_3px_rgba(0,255,120,0.22)]
    "
  />

</svg>

    {/* CENTRO */}
    <div
      className="
        absolute
        inset-[8px]

        rounded-full

        bg-[radial-gradient(circle_at_top,#145236,#081710)]

        border
        border-white/10

        flex
        items-center
        justify-center

        shadow-[0_0_8px_rgba(0,255,140,0.12)]
      "
    >

      <span
        className={`
          text-[21px]

          font-extrabold

          transition-all
          duration-300

          ${
            tempoRestante <= 10
              ? "text-red-400 animate-pulse"
              : tempoRestante <= 20
              ? "text-yellow-300"
              : "text-white"
          }
        `}
      >
        {tempoRestante}
      </span>

    </div>

  </div>

</div>

     {/* CONTROLES */}
<div
  className="
    flex
    flex-col

    items-end
    justify-center

    justify-self-end

    shrink-0
  "
>

  {/* AUDIO */}
  <button
    onClick={toggleAudio}

    className="
      w-[38px]
      h-[38px]

      rounded-full

      bg-black/30

      border
      border-green-400/20

      flex
      items-center
      justify-center

      text-lg

      transition-all
      duration-300

      active:scale-95
    "
  >

    {audioLigado ? "🔊" : "🔇"}

  </button>

  

</div>

    </div>

  </div>

  
</div>



{carregandoPergunta && (

  <div className="absolute inset-0 z-50 flex items-center justify-center">

    <div className="text-center">

      <div
        className="
          w-24
          h-24
          rounded-full
          border-4
          border-green-400/20
          border-t-green-400
          animate-spin
          mx-auto
          mb-6
        "
      />

      <h2 className="text-2xl font-black text-green-300">

        Preparando Safra...

      </h2>

      <p className="text-gray-400 mt-2">

        Organizando questões do jogo

      </p>

    </div>

  </div>

)}

        {/* ÁREA CENTRAL */}
        <div
  className={`
    max-w-7xl
    mx-auto
    w-full

    flex-1
    min-h-0

    transition-all
    duration-300

    ${
      transicao
        ? "opacity-0 scale-95"
        : "opacity-100 scale-100"
    }
  `}
>

         <div className="mt0">

           {/* NÍVEL + ENUNCIADO CINEMATOGRÁFICO */}
<div
  className="
    relative

    bg-gradient-to-br
    from-[#0d2e21]
    to-[#071b12]

    border
    border-green-500/15

    rounded-[24px]

    px-[10px]
    md:px-[18px]

    pt-[14px]
    md:pt-[18px]

    pb-[10px]
    md:pb-[16px]

    mb-3

    shadow-[0_0_18px_rgba(0,255,140,0.05)]

    overflow-hidden

    animate-[questionFade_1.2s_ease]
  "
>

  {/* GLOW FUNDO */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,150,0.08),transparent_55%)]"></div>

  {/* LINHA SUPERIOR */}
  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-400/40 to-transparent"></div>

  


  {/* CONTEÚDO */}
  <div className="relative z-10">

    {/* LABEL */}
    <p
      className="
        text-[10px]
        uppercase
        tracking-[0.25em]
        text-green-300/70
        font-bold
        mb-2
        pt1
      "
    >

      Pergunta ID: {questaoAtual?.id}

{questaoAtual?.nivel
  ?.toLowerCase() === "ouro"
    ? " ⭐"
    : ""}
</p>

    
    {/* ENUNCIADO */}
    <h1
      className="
  question-clamp

  text-[clamp(1rem,2.1vw,1.4rem)]
  md:text-[clamp(1rem,1.6vw,1.6rem)]

  font-semibold

  leading-[1.18]

  tracking-[0em]

  text-white

  text-left

  antialiased

  drop-shadow-[0_0_4px_rgba(255,255,255,0.03)]
"
    >

      {questaoAtual?.pergunta}

      

    </h1>

  </div>

</div>

          {/* ALTERNATIVAS */}
<div className="grid gap-[10px] mt-[2px]">

  {questaoAtual?.alternativas.map(
    (alternativa: string, index: number) => {

      const eliminada =
        alternativasEliminadas.includes(index);

      return (

        <button
          key={index}

          disabled={
            respostaConfirmada ||
            eliminada
          }

          onClick={() => {

            if (
              respostaConfirmada ||
              processandoResposta
            ) return;

            // SOM CLIQUE
            clickSound.current?.play();

            // SALVA RESPOSTA
            setRespostaSelecionada(
              index.toString()
            );

            // ABRE POPUP
            setMostrarConfirmacao(true);

          }}

          
          className={`
  ${
alternativasVisiveis.includes(index)
  ? "opacity-100"
  : "opacity-0 pointer-events-none"
}

  rounded-[16px]

px-[12px]
py-[5px]

min-h-[42px]

text-left

flex
items-center

  transition-all
  duration-300

  border

            ${
              eliminada

                ? "opacity-20 blur-[1px] bg-black/10 border-gray-700 line-through"

                : respostaSelecionada ===
                  index.toString()

                ? `
                    bg-yellow-400
                    text-black
                    border-yellow-300
                    scale-[1.015]
                    answer-selected
                  `

                : "bg-black/30 hover:bg-green-700/40 border-green-900/40 hover:scale-[1.02]"
            }
          `}
        >

          <span
  className="
    font-bold

    text-[clamp(1rem,2vw,1.08rem)]

    text-white/95

    mr-2

    shrink-0
  "
>
            {String.fromCharCode(65 + index)})
          </span>

          <span
  className="
    text-[clamp(0.93rem,1.9vw,1.02rem)]

    leading-[1.08]

    font-normal

    tracking-[0em]

    text-white/92
  "
>
  {alternativa}
</span>

        </button>
      );
    }
  )}

</div>
</div>

  
  
{/* =========================
    HUD ESTRATÉGICA PREMIUM
========================= */}

<div className="mt-1">

  
 {/* ÁREA ESTRATÉGICA */}

<div
  className="
    flex
    flex-col

    gap-3

    w-full
  "
>

    {/* =========================
                AJUDAS
    ========================= */}

    <div
      className="
  grid

  grid-cols-5

  gap-2

  w-full
"
    >

      {/* CONSULTORIA */}
      <button
        disabled={consultoriaUsada}
        onClick={usarConsultoria}
        className={`
          relative
          overflow-hidden

          h-[74px]
          sm:h-[88px]
          w-full
          min-w-0

          rounded-2xl
          border

          transition-all
          duration-300

          shadow-[0_0_18px_rgba(0,255,140,0.06)]

          ${
            consultoriaUsada
              ? "opacity-40 bg-black/20 border-gray-700"
              : "bg-[#071b12] hover:bg-[#0d2e21] border-green-700/40 hover:scale-[1.02]"
          }
        `}
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.12),transparent_70%)]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-1">

          <div className="text-[28px] leading-none mb-1">
            👨‍🌾
          </div>

          <p
  className="
    font-semibold

    text-[10px]

    leading-[1]

    tracking-[-0.01em]

    text-[#f3fff8]

    text-center

    drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]
  "
>
            Consultoria
          </p>

        </div>

      </button>

      {/* CARTAS */}
      <button
        disabled={cartasUsada}
        onClick={usarCartas}
        className={`
          relative
          overflow-hidden

          h-[74px]
          sm:h-[88px]
          w-full
          min-w-0

          rounded-2xl
          border

          transition-all
          duration-300

          shadow-[0_0_18px_rgba(0,255,140,0.06)]

          ${
            cartasUsada
              ? "opacity-40 bg-black/20 border-gray-700"
              : "bg-[#071b12] hover:bg-[#0d2e21] border-green-700/40 hover:scale-[1.02]"
          }
        `}
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.12),transparent_70%)]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-1">

          <div className="text-[28px] leading-none mb-1">
            🚜
          </div>

          <p
  className="
    font-semibold

    text-[10px]

    leading-[1]

    tracking-[-0.01em]

    text-[#f3fff8]

    text-center

    drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]
  "
>
            Cartas
          </p>

        </div>

      </button>

      {/* IA */}
<button

  disabled={iaAgroUsada}

  onClick={usarIAAgro}

  className={`
    relative
    overflow-hidden

    h-[74px]
    sm:h-[88px]
    w-full
    min-w-0

    rounded-2xl
    border

    transition-all
    duration-300

    shadow-[0_0_18px_rgba(0,255,140,0.06)]

    ${
      iaAgroUsada

        ? "opacity-40 bg-black/20 border-gray-700"

        : "bg-[#071b12] hover:bg-[#0d2e21] border-cyan-400/30 hover:scale-[1.02]"
    }
  `}
>

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,255,0.15),transparent_70%)]"></div>

  <div className="relative z-10 flex flex-col items-center justify-center h-full px-1">

    <div className="text-[28px] leading-none mb-1">
      🤖
    </div>

    <p
  className="
    font-semibold

    text-[10px]

    leading-[1]

    tracking-[-0.01em]

    text-[#f3fff8]

    text-center

    drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]
  "
>
      IA Agro
    </p>

  </div>

</button>


      {/* TROCAR */}
      <button
        disabled={trocaUsada}
        onClick={usarTrocaTalhao}
        className={`
          relative
          overflow-hidden

          h-[74px]
          sm:h-[88px]
          w-full
          min-w-0

          rounded-2xl
          border

          transition-all
          duration-300

          shadow-[0_0_18px_rgba(0,255,140,0.06)]

          ${
            trocaUsada
              ? "opacity-40 bg-black/20 border-gray-700"
              : "bg-[#071b12] hover:bg-[#0d2e21] border-green-700/40 hover:scale-[1.02]"
          }
        `}
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.12),transparent_70%)]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-1">

          <div className="text-[28px] leading-none mb-1">
            🌱
          </div>

          <p
  className="
    font-semibold

    text-[10px]

    leading-[1]

    tracking-[-0.01em]

    text-[#f3fff8]

    text-center

    drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]
  "
>
            Pular
          </p>

        </div>

      </button>

      {/* ENCERRAR */}
      <button
        onClick={() => {

  tocarSom(clickSound);

  setMostrarPararPopup(true);

}}
        className="
          relative
          overflow-hidden

          h-[74px]
          sm:h-[88px]
          w-full
          min-w-0

          rounded-2xl
          border

          bg-red-500/10
          hover:bg-red-500/20

          border-red-500/30

          transition-all
          duration-300

          hover:scale-[1.02]

          shadow-[0_0_18px_rgba(255,0,0,0.08)]
        "
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.15),transparent_70%)]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-1">

          <div className="text-[28px] leading-none mb-1">
            🛑
          </div>

          <p
  className="
    font-semibold

    text-[10px]

    leading-[1]

    tracking-[-0.01em]

    text-[#f3fff8]

    text-center

    drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]
  "
>
            Parar
          </p>

        </div>

      </button>

    </div>

</div>
</div>


{/* =========================================
HUD FINANCEIRO PREMIUM
========================================= */}

<div className="mt-2">

    
    {/* =========================
          STATUS FINANCEIRO
    ========================= */}

    <div
      className="
  grid

  grid-cols-3

  gap-2

  w-full
"
    >

      {/* ERRAR */}
      <div
        className="
          relative
          overflow-hidden

          h-[52px]
          sm:h-[70px]

          rounded-2xl
          border
          border-red-500/20

          bg-gradient-to-br
          from-[#2a0f0f]
          to-[#120606]

          px-4
          py-2

          flex
          flex-col
          justify-center

          shadow-[0_0_18px_rgba(255,0,0,0.06)]
        "
      >

        <p className="text-[9px] uppercase tracking-[0.18em] text-red-300/60 font-black">

          ERRAR

        </p>

        <h2 className="text-[12px] font-black text-red-300 mt-1 leading-none">

          R$ {valorErrar.toLocaleString("pt-BR")}

        </h2>

      </div>

      {/* PARAR */}
      <div
        className="
          relative
          overflow-hidden

          h-[52px]
          sm:h-[70px]

          rounded-2xl
          border
          border-yellow-500/20

          bg-gradient-to-br
          from-[#2a2208]
          to-[#120d03]

          px-4
          py-2

          flex
          flex-col
          justify-center

          shadow-[0_0_18px_rgba(255,200,0,0.06)]
        "
      >

        <p className="text-[9px] uppercase tracking-[0.18em] text-yellow-300/60 font-black">

          PARAR

        </p>

        <h2 className="text-[12px] font-black text-yellow-300 mt-1 leading-none">

          R$ {valorParar.toLocaleString("pt-BR")}

        </h2>

      </div>

      {/* ACERTAR */}
      <div
        className="
          relative
          overflow-hidden

          h-[52px]
          sm:h-[70px]

          rounded-2xl
          border
          border-green-500/20

          bg-gradient-to-br
          from-[#0d2e21]
          to-[#07110b]

          px-4
          py-2

          flex
          flex-col
          justify-center

          shadow-[0_0_22px_rgba(0,255,120,0.10)]
        "
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,120,0.15),transparent_60%)]"></div>

        <div className="relative z-10">

          <p className="text-[9px] uppercase tracking-[0.18em] text-green-300/60 font-black">

            ACERTAR

          </p>

          <h2 className="text-[12px] font-black text-green-300 mt-1 leading-none">

            R$ {valorAtual.toLocaleString("pt-BR")}

          </h2>

        </div>

      </div>

    </div>

  </div>

</div>

</div>

{/* =========================================
POPUP CARTAS DA FAZENDA
========================================= */}

{mostrarCartasPopup && (

  <div
    className="
      fixed
      inset-0
      z-[997]

      flex
      items-start
      justify-center

      pt-[95px]
      md:pt-[110px]

      pb-[95px]

      px-4
    "
  >

    {/* BACKDROP */}

    <div
      className="
        absolute
        inset-0

        bg-black/75
        backdrop-blur-sm
      "
    />

    {/* MODAL */}

    <div
      className="
        relative
        z-10

        w-full
        max-w-[760px]

        rounded-[30px]

        border
        border-green-400/20

        bg-gradient-to-br
        from-[#0b2f23]
        to-[#05150f]

        shadow-[0_0_45px_rgba(0,255,140,0.15)]

        overflow-hidden

        animate-[popup_.35s_ease]
      "
    >

      {/* GLOW */}

      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_top,rgba(0,255,150,0.10),transparent_70%)]
        "
      />

      {/* HEADER */}

      <div
        className="
          relative
          z-10

          flex
          items-center
          justify-between

          px-5
          pt-5
        "
      >

        <div>

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]

              text-green-300/60
              font-bold

              mb-1
            "
          >

            Recurso Estratégico

          </p>

          <h2
            className="
              text-2xl
              md:text-3xl

              font-black
              text-white
            "
          >

            Cartas da Fazenda

          </h2>

        </div>

        {/* FECHAR */}

        <button

          disabled={cartaVirada !== null}

          onClick={() => {

            if (cartaVirada !== null)
              return;

            setMostrarCartasPopup(
              false
            );

          }}

          className="
            w-10
            h-10

            rounded-full

            border
            border-white/10

            bg-white/5

            text-xl
            text-white

            transition-all
            duration-300

            hover:bg-white/10
          "
        >

          ✕

        </button>

      </div>

      {/* TEXTO */}

      <div
        className="
          relative
          z-10

          px-5
          pt-3
        "
      >

        <div
          className="
            rounded-2xl

            border
            border-green-500/10

            bg-black/20

            px-4
            py-3
          "
        >

          <p
            className="
              text-center

              text-lg
              md:text-xl

              font-black

              text-yellow-300
            "
          >

            {
              resultadoCarta

                ? `${resultadoCarta.elimina} alternativa(s) eliminada(s)!`

                : "Escolha uma carta para eliminar até 4 alternativas"
            }

          </p>

        </div>

      </div>s

      {/* GRID */}

      <div
        className="
          relative
          z-10

          grid
          grid-cols-2

          gap-3

          px-4
          py-4
        "
      >

        {cartasEmbaralhadas.map(
          (carta, index) => {

            const virou =
              cartaVirada === index;

            return (

              <button
                key={carta.id}

                disabled={
                  cartaVirada !== null
                }

                onClick={() =>
                  virarCarta(
                    carta,
                    index
                  )
                }

                className="
                  group

                  h-[150px]
                  md:h-[170px]
                "
              >

                <div
                  className={`
                    relative

                    h-full
                    w-full

                    transition-all
                    duration-700

                    [transform-style:preserve-3d]

                    ${
                      virou
                        ? "[transform:rotateY(180deg)]"
                        : ""
                    }
                  `}
                >

                  {/* COSTAS */}

                  <div
                    className="
                      absolute
                      inset-0

                      rounded-[24px]

                      border
                      border-green-400/20

                      bg-gradient-to-br
                      from-[#0a2a1f]
                      to-[#06130e]

                      overflow-hidden

                      [backface-visibility:hidden]

                      shadow-[0_0_20px_rgba(0,255,140,0.08)]
                    "
                  >

                    {/* GLOW */}

                    <div
                      className="
                        absolute
                        inset-0

                        opacity-20

                        bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.20),transparent_60%)]
                      "
                    />

                    {/* CONTEÚDO */}

                    <div
                      className="
                        relative
                        z-10

                        h-full

                        flex
                        flex-col
                        items-center
                        justify-center

                        text-center
                      "
                    >

                      <div
                        className="
                          text-4xl
                          mb-2
                        "
                      >

                        🌾

                      </div>

                      <h2
                        className="
                          text-lg
                          md:text-xl

                          font-black

                          text-yellow-300

                          tracking-wide
                        "
                      >

                        SAFRA

                      </h2>

                      <h3
                        className="
                          text-sm
                          md:text-base

                          font-black

                          text-green-300
                        "
                      >

                        MILIONÁRIA

                      </h3>

                    </div>

                  </div>

                  {/* FRENTE */}

                  <div
                    className={`
                      absolute
                      inset-0

                      rounded-[24px]

                      border

                      ${carta.borda}

                      bg-gradient-to-br
                      ${carta.cor}

                      overflow-hidden

                      [transform:rotateY(180deg)]
                      [backface-visibility:hidden]

                      shadow-[0_0_25px_rgba(0,255,140,0.10)]
                    `}
                  >

                    {/* GLOW */}

                    <div
                      className="
                        absolute
                        inset-0

                        bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_70%)]
                      "
                    />

                    {/* CONTEÚDO */}

                    <div
                      className="
                        relative
                        z-10

                        h-full

                        flex
                        flex-col
                        items-center
                        justify-center

                        text-center

                        px-3
                      "
                    >

                      <div
                        className="
                          text-4xl
                          mb-2
                        "
                      >

                        {carta.emoji}

                      </div>

                      <h2
                        className="
                          text-lg
                          md:text-xl

                          font-black

                          text-white

                          mb-1
                        "
                      >

                        {carta.nome}

                      </h2>

                      <p
                        className="
                          text-[11px]
                          md:text-xs

                          font-bold

                          text-white/80
                        "
                      >

                        {carta.subtitulo}

                      </p>

                    </div>

                  </div>

                </div>

              </button>

            );
          }
        )}

      </div>

      {/* BOTÃO */}

      {resultadoCarta && (

        <div
          className="
            relative
            z-10

            px-4
            pb-4
          "
        >

          <button

            onClick={() => {

              setMostrarCartasPopup(
                false
              );

            }}

            className="
              w-full

              py-3

              rounded-2xl

              bg-gradient-to-r
              from-yellow-400
              to-yellow-300

              text-black
              font-black
              text-base

              transition-all
              duration-300

              hover:scale-[1.01]

              shadow-[0_0_20px_rgba(255,215,0,0.25)]
            "
          >

            CONTINUAR

          </button>

        </div>

      )}

    </div>

  </div>

)}


{/* =========================================
POPUP CONSULTORIA TÉCNICA
========================================= */}

{mostrarConsultoria && (

  <div
    className="
      fixed
      inset-0
      z-[996]

      flex
      items-start
      justify-center

      pt-[95px]
      md:pt-[110px]

      pb-[95px]

      px-4
    "
  >

    {/* BACKDROP */}

    <div
      className="
        absolute
        inset-0

        bg-black/75
        backdrop-blur-sm
      "
    />

    {/* MODAL */}

    <div
      className="
        relative
        z-10

        w-full
        max-w-[760px]

        rounded-[30px]

        border
        border-green-400/20

        bg-gradient-to-br
        from-[#0b2f23]
        to-[#05150f]

        shadow-[0_0_45px_rgba(0,255,140,0.15)]

        overflow-hidden

        animate-[popup_.35s_ease]
      "
    >

      {/* GLOW */}

      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_top,rgba(0,255,150,0.10),transparent_70%)]
        "
      />

      {/* HEADER */}

      <div
        className="
          relative
          z-10

          flex
          items-center
          justify-between

          px-5
          pt-5
        "
      >

        <div>

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]

              text-green-300/60
              font-bold

              mb-1
            "
          >

            Recurso Estratégico

          </p>

          <h2
            className="
              text-2xl
              md:text-3xl

              font-black
              text-white
            "
          >

            Consultoria Técnica

          </h2>

        </div>

        {/* FECHAR */}

        <button

          disabled={consultoriaCarregando}

          onClick={() => {

            if (
              consultoriaCarregando
            ) return;

            setMostrarConsultoria(
              false
            );

          }}

          className="
            w-10
            h-10

            rounded-full

            border
            border-white/10

            bg-white/5

            text-xl
            text-white

            transition-all
            duration-300

            hover:bg-white/10
          "
        >

          ✕

        </button>

      </div>

      {/* TEXTO */}

      <div
        className="
          relative
          z-10

          px-5
          pt-3
        "
      >

        <div
          className="
            rounded-2xl

            border
            border-green-500/10

            bg-black/20

            px-4
            py-3
          "
        >

          <p
            className="
              text-center

              text-lg
              md:text-xl

              font-black

              text-yellow-300
            "
          >

            Consultando especialistas do agro...

          </p>

        </div>

      </div>

      {/* LOADING */}

      {consultoriaCarregando && (

        <div
          className="
            flex
            flex-col
            items-center
            justify-center

            py-14
          "
        >

          <div
            className="
              w-20
              h-20

              rounded-full

              border-4
              border-green-400/20
              border-t-green-400

              animate-spin

              mb-6
            "
          />

          <p
            className="
              text-green-300
              font-black
              text-lg
            "
          >

            Analisando lavoura...

          </p>

        </div>

      )}

      {/* CONSULTORES */}

      {!consultoriaCarregando && (

        <div
          className="
            relative
            z-10

            grid
            md:grid-cols-3

            gap-4

            px-5
            py-5
          "
        >

          {consultores.map(
            (
              consultor,
              index
            ) => (

              <div
                key={index}

                className={`
                  relative

                  rounded-[24px]

                  border

                  ${consultor.borda}

                  bg-gradient-to-br
                  ${consultor.cor}

                  overflow-hidden

                  p-5

                  animate-[popup_.35s_ease]
                `}
              >

                {/* GLOW */}

                <div
                  className="
                    absolute
                    inset-0

                    bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_70%)]
                  "
                />

                {/* CONTEÚDO */}

                <div
                  className="
                    relative
                    z-10

                    text-center
                  "
                >

                  <div
                    className="
                      text-5xl
                      mb-3
                    "
                  >

                    {consultor.emoji}

                  </div>

                  <h2
                    className="
                      text-xl

                      font-black

                      text-white

                      mb-4
                    "
                  >

                    {consultor.nome}

                  </h2>

                  <div
                    className="
                      rounded-2xl

                      bg-black/25

                      border
                      border-white/10

                      px-4
                      py-3
                    "
                  >

                    <p
                      className="
                        text-sm
                        text-white/70
                        mb-2
                      "
                    >

                      Sugestão:

                    </p>

                    <h3
                      className="
                        text-3xl

                        font-black

                        text-yellow-300
                      "
                    >

                      {
                        String.fromCharCode(
                          65 +
                          consultor.resposta
                        )
                      }

                    </h3>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

      {/* BOTÃO */}

      {
        !consultoriaCarregando &&
        consultores.length === 3
        && (

          <div
            className="
              relative
              z-10

              px-5
              pb-5
            "
          >

            <button

              onClick={() => {

                setMostrarConsultoria(
                  false
                );

              }}

              className="
                w-full

                py-3

                rounded-2xl

                bg-gradient-to-r
                from-yellow-400
                to-yellow-300

                text-black
                font-black
                text-base

                transition-all
                duration-300

                hover:scale-[1.01]

                shadow-[0_0_20px_rgba(255,215,0,0.25)]
              "
            >

              CONTINUAR

            </button>

          </div>

      )}

    </div>

  </div>

)}


{/* =========================================
POPUP IA AGRO
========================================= */}

{mostrarIAAgro && (

  <div
    className="
      fixed
      inset-0
      z-[995]

      flex
      items-start
      justify-center

      pt-[95px]
      md:pt-[110px]

      pb-[95px]

      px-4
    "
  >

    {/* BACKDROP */}

    <div
      className="
        absolute
        inset-0

        bg-black/75
        backdrop-blur-sm
      "
    />

    {/* MODAL */}

    <div
      className="
        relative
        z-10

        w-full
        max-w-[760px]

        rounded-[30px]

        border
        border-cyan-400/20

        bg-gradient-to-br
        from-[#07131d]
        to-[#040b11]

        shadow-[0_0_45px_rgba(0,180,255,0.15)]

        overflow-hidden

        animate-[popup_.35s_ease]
      "
    >

      {/* GLOW */}

      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_top,rgba(0,180,255,0.12),transparent_70%)]
        "
      />

      {/* HEADER */}

      <div
        className="
          relative
          z-10

          flex
          items-center
          justify-between

          px-5
          pt-5
        "
      >

        <div>

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]

              text-cyan-300/60
              font-bold

              mb-1
            "
          >

            Inteligência Artificial Rural

          </p>

          <h2
            className="
              text-2xl
              md:text-3xl

              font-black
              text-white
            "
          >

            IA Agro

          </h2>

        </div>

        {/* FECHAR */}

        <button

          disabled={iaCarregando}

          onClick={() => {

            if (
              iaCarregando
            ) return;

            setMostrarIAAgro(
              false
            );

          }}

          className="
            w-10
            h-10

            rounded-full

            border
            border-white/10

            bg-white/5

            text-xl
            text-white

            transition-all
            duration-300

            hover:bg-white/10
          "
        >

          ✕

        </button>

      </div>

      {/* TEXTO */}

      <div
        className="
          relative
          z-10

          px-5
          pt-3
        "
      >

        <div
          className="
            rounded-2xl

            border
            border-cyan-400/10

            bg-black/20

            px-4
            py-3
          "
        >

          <p
            className="
              text-center

              text-lg
              md:text-xl

              font-black

              text-cyan-300
            "
          >

            Sistema neural agrícola iniciado...

          </p>

        </div>

      </div>

      {/* PROCESSAMENTO */}

      {iaCarregando && (

        <div
          className="
            relative
            z-10

            px-5
            py-5
          "
        >

          <div
            className="
              relative

              h-[180px]

              rounded-[24px]

              border
              border-cyan-400/20

              bg-black/25

              overflow-hidden

              mb-5
            "
          >

            {/* LINHA */}

            <div
              className="
                absolute
                top-0
                left-0

                w-full
                h-[3px]

                bg-cyan-400

                shadow-[0_0_25px_rgba(0,255,255,0.8)]

                animate-[scanner_2s_linear_infinite]
              "
            />

            {/* GRID */}

            <div
              className="
                absolute
                inset-0

                opacity-20

                bg-[linear-gradient(rgba(0,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.15)_1px,transparent_1px)]

                bg-[size:24px_24px]
              "
            />

            {/* CONTEÚDO */}

            <div
              className="
                relative
                z-10

                h-full

                flex
                flex-col
                items-center
                justify-center
              "
            >

              <div
                className="
                  text-5xl
                  mb-4

                  animate-pulse
                "
              >

                🤖

              </div>

              <p
                className="
                  text-cyan-300
                  font-black
                  text-lg
                  mb-4
                "
              >

                Processando alternativas...

              </p>

              {/* BARRA */}

              <div
                className="
                  w-full
                  max-w-[320px]

                  h-3

                  rounded-full

                  bg-black/30

                  overflow-hidden
                "
              >

                <div
                  className="
                    h-full
                    rounded-full

                    bg-gradient-to-r
                    from-cyan-400
                    to-cyan-200

                    animate-[loading_3s_linear]
                  "
                />

              </div>

            </div>

          </div>

        </div>

      )}

      {/* RESULTADO */}

      {
        !iaCarregando &&
        respostaIA !== null
        && (

          <div
            className="
              relative
              z-10

              px-5
              py-5
            "
          >

            <div
              className="
                rounded-[26px]

                border
                border-cyan-400/20

                bg-gradient-to-br
                from-[#0a2030]
                to-[#07131d]

                p-5

                text-center

                shadow-[0_0_30px_rgba(0,180,255,0.10)]
              "
            >

              <div
                className="
                  text-5xl
                  mb-4
                "
              >

                🧠

              </div>

              <p
                className="
                  text-cyan-300/70
                  text-sm
                  uppercase
                  tracking-[0.25em]
                  font-bold
                  mb-3
                "
              >

                Maior probabilidade encontrada

              </p>

              <h2
                className="
                  text-6xl

                  font-black

                  text-white

                  mb-4

                  drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]
                "
              >

                {
                  String.fromCharCode(
                    65 + respostaIA
                  )
                }

              </h2>

              <div
                className="
                  rounded-2xl

                  border
                  border-cyan-400/10

                  bg-black/20

                  px-4
                  py-3
                "
              >

                <p
                  className="
                    text-cyan-100/70
                    text-sm
                  "
                >

                  Compatibilidade neural detectada acima de 99%

                </p>

              </div>

            </div>

          </div>

      )}

      {/* BOTÃO */}

      {
        !iaCarregando &&
        respostaIA !== null
        && (

          <div
            className="
              relative
              z-10

              px-5
              pb-5
            "
          >

            <button

              onClick={() => {

                setMostrarIAAgro(
                  false
                );

              }}

              className="
                w-full

                py-3

                rounded-2xl

                bg-gradient-to-r
                from-cyan-400
                to-cyan-300

                text-black
                font-black
                text-base

                transition-all
                duration-300

                hover:scale-[1.01]

                shadow-[0_0_20px_rgba(0,180,255,0.25)]
              "
            >

              CONTINUAR

            </button>

          </div>

      )}

    </div>

  </div>

)}


{/* =========================================
POPUP PULAR QUESTÃO
========================================= */}

{mostrarPularPopup && (

  <div
    className="
      fixed
      inset-0
      z-[997]

      flex
      items-start
      justify-center

      pt-[95px]
      md:pt-[110px]

      pb-[95px]

      px-4
    "
  >

    {/* BACKDROP */}

    <div
      className="
        absolute
        inset-0

        bg-black/75
        backdrop-blur-sm
      "
    />

    {/* MODAL */}

    <div
      className="
        relative
        z-10

        w-full
        max-w-[760px]

        rounded-[30px]

        border
        border-green-400/20

        bg-gradient-to-br
        from-[#0b2f23]
        to-[#05150f]

        shadow-[0_0_45px_rgba(0,255,140,0.15)]

        overflow-hidden

        animate-[popup_.35s_ease]
      "
    >

      {/* GLOW */}

      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_top,rgba(0,255,150,0.10),transparent_70%)]
        "
      />

      {/* HEADER */}

      <div
        className="
          relative
          z-10

          flex
          items-center
          justify-between

          px-5
          pt-5
        "
      >

        <div>

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]

              text-green-300/60
              font-bold

              mb-1
            "
          >

            Decisão Estratégica

          </p>

          <h2
            className="
              text-2xl
              md:text-3xl

              font-black
              text-white
            "
          >

            Pular Questão

          </h2>

        </div>

        {/* FECHAR */}

        <button

          disabled={processandoPulo}

          onClick={() => {

            if (
              processandoPulo
            ) return;

            setMostrarPularPopup(
              false
            );

          }}

          className="
            w-10
            h-10

            rounded-full

            border
            border-white/10

            bg-white/5

            text-xl
            text-white

            transition-all
            duration-300

            hover:bg-white/10
          "
        >

          ✕

        </button>

      </div>

      {/* CONTEÚDO */}

      <div
        className="
          relative
          z-10

          px-5
          py-5
        "
      >

        <div
          className="
            rounded-[28px]

            border
            border-green-400/10

            bg-black/20

            p-6

            text-center
          "
        >

          {/* ÍCONE */}

          <div
            className="
              text-6xl
              mb-5

              animate-pulse
            "
          >

            🌱

          </div>

          {/* TEXTO */}

          <h2
            className="
              text-2xl
              md:text-3xl

              font-black

              text-yellow-300

              mb-4
            "
          >

            Deseja realmente pular esta questão?

          </h2>

          <p
            className="
              text-white/75

              text-base
              md:text-lg

              leading-relaxed

              max-w-[520px]

              mx-auto
            "
          >

            Você irá abandonar esta rodada e avançar para a próxima pergunta.

          </p>

          {/* ALERTA */}

          <div
            className="
              mt-5

              rounded-2xl

              border
              border-yellow-400/15

              bg-yellow-400/10

              px-4
              py-3
            "
          >

            <p
              className="
                text-yellow-200
                text-sm
                font-bold
              "
            >

              ⚠️ Esta ajuda pode ser utilizada apenas uma vez por partida.

            </p>

          </div>

        </div>

      </div>

      {/* BOTÕES */}

      <div
        className="
          relative
          z-10

          grid
          grid-cols-2

          gap-4

          px-5
          pb-5
        "
      >

        {/* CANCELAR */}

        <button

          disabled={processandoPulo}

          onClick={() => {

            if (
              processandoPulo
            ) return;

            setMostrarPularPopup(
              false
            );

          }}

          className="
            py-4

            rounded-2xl

            border
            border-white/10

            bg-white/5

            text-white
            font-bold

            transition-all
            duration-300

            hover:bg-white/10
          "
        >

          Voltar

        </button>

        {/* CONFIRMAR */}

        <button

          disabled={processandoPulo}

          onClick={
            confirmarPuloQuestao
          }

          className="
            py-4

            rounded-2xl

            bg-gradient-to-r
            from-yellow-400
            to-yellow-300

            text-black
            font-black

            transition-all
            duration-300

            hover:scale-[1.01]

            shadow-[0_0_20px_rgba(255,215,0,0.25)]
          "
        >

          {
            processandoPulo

              ? "Redirecionando safra..."

              : "Pular Questão"
          }

        </button>

      </div>

    </div>

  </div>

)}

{/* =========================================
POPUP PARAR JOGO
========================================= */}

{mostrarPararPopup && (

  <div
    className="
      fixed
      inset-0
      z-[998]

      flex
      items-start
      justify-center

      pt-[95px]
      md:pt-[110px]

      pb-[95px]

      px-4
    "
  >

    {/* BACKDROP */}

    <div
      className="
        absolute
        inset-0

        bg-black/75
        backdrop-blur-sm
      "
    />

    {/* MODAL */}

    <div
      className="
        relative
        z-10

        w-full
        max-w-[760px]

        rounded-[30px]

        border
        border-yellow-400/20

        bg-gradient-to-br
        from-[#2b1d05]
        to-[#120b02]

        shadow-[0_0_45px_rgba(255,200,0,0.15)]

        overflow-hidden

        animate-[popup_.35s_ease]
      "
    >

      {/* GLOW */}

      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_top,rgba(255,200,0,0.10),transparent_70%)]
        "
      />

      {/* HEADER */}

      <div
        className="
          relative
          z-10

          flex
          items-center
          justify-between

          px-5
          pt-5
        "
      >

        <div>

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]

              text-yellow-300/60
              font-bold

              mb-1
            "
          >

            Encerrar Safra

          </p>

          <h2
            className="
              text-2xl
              md:text-3xl

              font-black
              text-white
            "
          >

            Deseja parar o jogo?

          </h2>

        </div>

        {/* FECHAR */}

        <button

          disabled={processandoParada}

          onClick={() => {

            if (
              processandoParada
            ) return;

            setMostrarPararPopup(
              false
            );

          }}

          className="
            w-10
            h-10

            rounded-full

            border
            border-white/10

            bg-white/5

            text-xl
            text-white

            transition-all
            duration-300

            hover:bg-white/10
          "
        >

          ✕

        </button>

      </div>

      {/* CONTEÚDO */}

      <div
        className="
          relative
          z-10

          px-5
          py-5
        "
      >

        {/* PREMIAÇÃO */}

        <div
          className="
            rounded-[28px]

            border
            border-yellow-400/15

            bg-black/20

            p-5

            text-center

            mb-5
          "
        >

          <div
            className="
              text-5xl
              mb-4
            "
          >

            💰

          </div>

          <p
            className="
              text-yellow-300/70

              text-sm
              uppercase

              tracking-[0.25em]

              font-bold

              mb-2
            "
          >

            Premiação Atual

          </p>

          <h2
            className="
              text-4xl
              md:text-5xl

              font-black

              text-white

              mb-3
            "
          >

            R$ {pontuacao.toLocaleString("pt-BR")}

          </h2>

          <p
            className="
              text-white/70
              text-sm
            "
          >

            Você chegou até a rodada {indiceQuestao + 1}

          </p>

        </div>

        {/* AJUDAS */}

        <div
          className="
            rounded-[24px]

            border
            border-green-400/10

            bg-green-400/5

            p-5
          "
        >

          {

            ajudasDisponiveis.length > 0

              ? (

                <>

                  <h3
                    className="
                      text-green-300

                      font-black

                      text-lg

                      mb-3
                    "
                  >

                    🚜 Recursos Estratégicos Disponíveis

                  </h3>

                  <p
                    className="
                      text-white/75

                      text-sm

                      leading-relaxed

                      mb-4
                    "
                  >

                    Você ainda possui recursos estratégicos que podem ajudá-lo a avançar com mais segurança.

                  </p>

                  <div
                    className="
                      flex
                      flex-wrap

                      gap-2
                    "
                  >

                    {
                      ajudasDisponiveis.map(
                        (
                          ajuda,
                          index
                        ) => (

                          <div
                            key={index}

                            className="
                              px-3
                              py-2

                              rounded-xl

                              bg-black/25

                              border
                              border-white/10

                              text-sm
                              font-bold

                              text-green-200
                            "
                          >

                            {ajuda}

                          </div>

                        )
                      )
                    }

                  </div>

                </>

              )

              : (

                <div
                  className="
                    text-center
                  "
                >

                  <h3
                    className="
                      text-yellow-300

                      font-black

                      text-lg

                      mb-3
                    "
                  >

                    ⚠️ Todos os recursos já foram utilizados

                  </h3>

                  <p
                    className="
                      text-white/70
                      text-sm
                    "
                  >

                    Agora tudo depende apenas do seu conhecimento.

                  </p>

                </div>

              )

          }

        </div>

      </div>

      {/* BOTÕES */}

      <div
        className="
          relative
          z-10

          grid
          grid-cols-2

          gap-4

          px-5
          pb-5
        "
      >

        {/* CONTINUAR */}

        <button

          disabled={processandoParada}

          onClick={() => {

            if (
              processandoParada
            ) return;

            setMostrarPararPopup(
              false
            );

          }}

          className="
            py-4

            rounded-2xl

            border
            border-white/10

            bg-white/5

            text-white
            font-bold

            transition-all
            duration-300

            hover:bg-white/10
          "
        >

          Continuar Jogando

        </button>

        {/* PARAR */}

        <button

          disabled={processandoParada}

          onClick={confirmarParada}

          className="
            py-4

            rounded-2xl

            bg-gradient-to-r
            from-yellow-400
            to-yellow-300

            text-black
            font-black

            transition-all
            duration-300

            hover:scale-[1.01]

            shadow-[0_0_20px_rgba(255,215,0,0.25)]
          "
        >

          {
            processandoParada

              ? "Encerrando safra..."

              : "Parar Jogo"
          }

        </button>

      </div>

    </div>

  </div>

)}


{/* POPUP CONFIRMAÇÃO */}
{mostrarConfirmacao && (

  <GameModal
  maxWidth="max-w-[560px]"
  zIndex="z-[998]"
>

    
    {/* MODAL */}
    <div
      className="
  relative

  border
  border-green-400/30

  bg-[#082b1d]/95

  backdrop-blur-2xl

  p-5
  md:p-8
"
    >

      {/* GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,150,0.12),transparent_70%)]"></div>

      <div className="relative z-10">

        {/* TÍTULO */}
        <h2 className="text-3xl font-black text-white text-center mb-4">

          Confirmar Resposta

        </h2>

        {/* TEXTO */}
        <p className="text-center text-green-100/80 text-lg leading-relaxed mb-8">

          Você tem certeza dessa alternativa?

        </p>

        {/* RESPOSTA */}
        <div
          className="
            rounded-2xl
            border
            border-yellow-400/20
            bg-black/30
            p-5
            text-center
            text-2xl
            font-black
            text-yellow-300
            mb-8
          "
        >

          {respostaSelecionada !== "" && (
            <>
              {String.fromCharCode(
                65 + Number(respostaSelecionada)
              )}){" "}

              {
                questaoAtual?.alternativas[
                  Number(respostaSelecionada)
                ]
              }
            </>
          )}

        </div>

        {/* BOTÕES */}
        <div className="flex gap-4">

          {/* CANCELAR */}
          <button
            onClick={() => {

              if (processandoResposta) return;

              setMostrarConfirmacao(false);

            }}
            className="
              flex-1
              rounded-2xl
              border
              border-white/10
              bg-white/5
              py-4
              font-bold
              text-white
              transition-all
              duration-300
              hover:bg-white/10
            "
          >

            Escolher Outra

          </button>

          {/* CONFIRMAR */}
          <button
            onClick={async () => {

              setProcessandoResposta(true);

              // SOM SUSPENSE FUTURO
              await new Promise(
                resolve =>
                  setTimeout(resolve, 1800)
              );

              setMostrarConfirmacao(false);

              confirmarResposta();

              setProcessandoResposta(false);

            }}
            className="
              flex-1
              rounded-2xl
              bg-gradient-to-r
              from-yellow-400
              to-yellow-300
              py-4
              font-black
              text-black
              shadow-[0_0_25px_rgba(255,215,0,0.4)]
              transition-all
              duration-300
              hover:scale-[1.03]
            "
          >

            {processandoResposta
              ? "Analisando..."
              : "Confirmar"}

          </button>

        </div>

      </div>

    </div>

  </GameModal>

)}
            
            {/* POPUP FEEDBACK */}
{respostaConfirmada && (

  <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">

    {/* FUNDO ESCURO */}
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

    {/* MODAL */}
    <div
      className={`
        relative
        z-10
        w-full
        max-w-3xl
        rounded-3xl
        border
        shadow-2xl
        backdrop-blur-md
        p-6
        animate-[popup_.25s_ease]
        ${
          acertou
            ? "bg-green-500/10 border-green-400/40"
            : "bg-red-500/10 border-red-400/40"
        }
      `}
    >

      {/* TÍTULO */}
      <h2
        className={`
          text-3xl
          font-black
          mb-5
          ${
            acertou
              ? "text-green-300"
              : "text-red-300"
          }
        `}
      >

        {tempoEsgotado
          ? "⏳ Tempo Esgotado!"
          : acertou
          ? "✅ Certa Resposta!"
          : "❌ Resposta Incorreta!"}

      </h2>

      {/* TEXTO */}
      <div className="space-y-4">

        <p className="text-lg leading-relaxed text-white">

          <strong className="text-yellow-400">
            Gabarito:
            {" "}
            {String.fromCharCode(
              65 + questaoAtual?.correta
            )}.
          </strong>

          {" "}

          {tempoEsgotado
            ? "O tempo terminou antes da resposta. "
            : ""}

          {questaoAtual?.feedback}

        </p>

        <p className="text-sm text-gray-300 leading-relaxed">

          <span className="font-semibold text-gray-200">
            Fonte:
          </span>

          {" "}

          {questaoAtual?.fonte}

        </p>

      </div>

     {/* BOTÃO */}
<button
  onClick={() => {

    if (acertou) {

      proximaQuestao();

    } else {

      sairDoJogo();

    }

  }}
  className={`
    w-full
    mt-8
    text-black
    font-black
    text-lg
    py-4
    rounded-2xl
    shadow-[0_0_25px_rgba(255,215,0,0.35)]
    transition-all
    duration-300
    hover:scale-[1.01]

    ${
      acertou
        ? "bg-yellow-400 hover:bg-yellow-300"
        : "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_25px_rgba(255,0,0,0.35)]"
    }
  `}
>
  {acertou
    ? "PRÓXIMA PERGUNTA"
    : "SAIR"}
</button>

    </div>

  </div>

)}

                

      

      
    </main>
    </LayoutMobile>
  );
}