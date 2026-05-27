"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";

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

  document.body.style.zoom =
    `${valor}%`;

  setZoomInterface(valor);
}
  async function toggleTelaCheia() {

  if (!document.fullscreenElement) {

    await document.documentElement.requestFullscreen();

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

// HISTÓRICO
const chaveHistorico =
  "safra-history";

// LER HISTÓRICO
const historicoSalvo =
  localStorage.getItem(chaveHistorico);

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
  localStorage.getItem(
    "ultima-questao-errada"
  );

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
// ESTATÍSTICAS DOS TEMAS
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


    // =========================
// TIMER CIRCULAR SVG
// =========================

const raioTimer = 48;

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
    "🌱 Produção Inicial";

  let corFase =
    "text-green-400";

  if (indiceQuestao >= 5) {

    faseAtual =
      "🚜 Expansão Rural";

    corFase =
      "text-yellow-400";
  }

  if (indiceQuestao >= 10) {

    faseAtual =
      "🏭 Império Agro";

    corFase =
      "text-orange-400";
  }

  if (indiceQuestao >= 15) {

    faseAtual =
      "👑 Final do Milhão";

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
  // CONSULTORIA TÉCNICA
  // =========================

  function usarConsultoria() {

    if (
      consultoriaUsada ||
      respostaConfirmada
    ) return;

        tocarSom(clickSound);

    setConsultoriaUsada(true);

    const chanceAcerto = Math.random();

    let sugestao;

    if (chanceAcerto <= 0.75) {

      sugestao = questaoAtual.correta;

    } else {

      const alternativasErradas =
        questaoAtual.alternativas
          .map((_: any, i: number) => i)
          .filter(
            (i: number) =>
              i !== questaoAtual.correta
          );

      sugestao =
        alternativasErradas[
          Math.floor(
            Math.random() *
            alternativasErradas.length
          )
        ];
    }

    setSugestaoConsultoria(sugestao);

    setMostrarConsultoria(true);
  }

  // =========================
  // CARTAS DA FAZENDA
  // =========================

  function usarCartas() {

    if (
      cartasUsada ||
      respostaConfirmada
    ) return;

        tocarSom(clickSound);

    setCartasUsada(true);

    const erradas =
      questaoAtual.alternativas
        .map((_: any, i: number) => i)
        .filter(
          (i: number) =>
            i !== questaoAtual.correta
        );

    const embaralhadas =
      shuffleArray(erradas);

    const remover =
      embaralhadas.slice(0, 2);

    setAlternativasEliminadas(remover);
  }

  // =========================
  // TROCAR TALHÃO
  // =========================

  function usarTrocaTalhao() {

    if (
      trocaUsada ||
      respostaConfirmada
    ) return;

        tocarSom(clickSound);

    setTrocaUsada(true);

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
    h-screen
    overflow-hidden
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

        <footer className="relative z-10 border-t border-green-900/60 py-5 text-center text-sm text-gray-400 bg-black/20 backdrop-blur-sm">

          Desenvolvido pelo Tutor Reginaldo V. Vantini — professorvantini@gmail.com

        </footer>

      </main>
    );
  }

  return (
    <main className="h-screen bg-[#061b11] text-white flex flex-col relative overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f5132_0%,#061b11_55%,#020303_100%)]"></div>

      <div
  className="
    relative
    z-10
    flex-1
    px-4
    py-2
    overflow-y-auto
    flex
    flex-col
    justify-center
  "
>

        {/* TOPO */}
<div className="max-w-7xl mx-auto mb-2 w-full">

  <div
    className="
      bg-white/5
      border
      border-green-900/40
      backdrop-blur-md
      rounded-3xl
      px-5
      py-3
      shadow-2xl
    "
  >

    {/* GRID PRINCIPAL */}
    <div className="grid grid-cols-2 md:grid-cols-[1.1fr_1fr_1fr_150px] gap-3 md:gap-6 items-center">

      {/* COLUNA 1 */}
      <div className="space-y-3">

        {/* JOGADOR */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">
            Jogador
          </p>

          <h2 className="text-lg font-black text-yellow-400 truncate">
            {nome}
          </h2>
        </div>

        {/* QUESTÃO */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400">
            Questão
          </p>

          <h2 className="text-lg font-black text-yellow-400">
            {indiceQuestao + 1} / {perguntasFiltradas.length}
          </h2>
        </div>

      </div>

      {/* COLUNA 2 */}
      <div className="space-y-1 md:space-y-3">

        {/* POLO */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">
            Polo
          </p>

          <h2 className="text-lg font-semibold truncate">
            {polo}
          </h2>
        </div>

        {/* PONTUAÇÃO */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400">
            Pontuação
          </p>

          <h2 className="text-lg font-black text-green-400">
            R$ {pontuacao}
          </h2>
        </div>

      </div>

      {/* COLUNA 3 */}
      <div className="space-y-1 md:space-y-3">

        {/* CURSO */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">
            Curso
          </p>

          <h2 className="text-lg font-semibold truncate">
            {curso}
          </h2>
        </div>

        {/* FASE */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400">
            Fase Atual
          </p>

          <h2 className={`text-sm font-black ${corFase}`}>
            {faseAtual}
          </h2>
        </div>

      </div>
{/* COLUNA 4 — CONTROLES */}
<div
  className="
    flex
    flex-col
    items-end
    justify-center
    gap-2
  "
>

  {/* FULLSCREEN */}
  <button
    onClick={toggleTelaCheia}

    className="
      flex
      items-center
      justify-center
      gap-2

      min-w-[150px]

      px-4
      py-2

      rounded-2xl

      bg-black/25
      border
      border-green-400/20

      text-white
      text-sm
      font-bold

      hover:scale-[1.02]
      hover:bg-green-500/15

      transition-all
      duration-300

      shadow-[0_0_15px_rgba(0,255,140,0.08)]
    "
  >

    <span className="text-lg">

      {telaCheia ? "🗗" : "🗖"}

    </span>

    <span>

      Tela Cheia

    </span>

  </button>

  {/* ÁUDIO */}
  <button
    onClick={toggleAudio}

    className="
      flex
      items-center
      justify-center
      gap-2

      min-w-[150px]

      px-4
      py-2

      rounded-2xl

      bg-black/25
      border
      border-green-400/20

      text-white
      text-sm
      font-bold

      hover:scale-[1.02]
      hover:bg-green-500/15

      transition-all
      duration-300

      shadow-[0_0_15px_rgba(0,255,140,0.08)]
    "
  >

    <span className="text-lg">

      {audioLigado ? "🔊" : "🔇"}

    </span>

    <span>

      Áudio

    </span>

  </button>

</div>

    </div>

    {/* PREMIAÇÃO */}
    <div className="mt-3">

          

    </div>

    {/* PROGRESSO */}
    <div className="mt-3">

      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">

        <div
          className="h-full bg-yellow-400 transition-all duration-500"
          style={{
            width: `${progresso}%`,
          }}
        />

      </div>

    </div>

  </div>

</div>

{/* TIMER FLUTUANTE GLOBAL */}
<div className="absolute left-1/2 top-[85px] md:top-[110px] -translate-x-1/2 z-50 pointer-events-none">

  <div className="relative w-[92px] h-[92px] md:w-[118px] md:h-[118px]">

    {/* GLOW */}
    <div
      className={`
        absolute
        inset-0
        rounded-full
        blur-2xl
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
      className="absolute inset-0 -rotate-90"
      viewBox="0 0 120 120"
    >

      {/* FUNDO */}
      <circle
        cx="60"
        cy="60"
        r="52"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="7"
        fill="transparent"
      />

      {/* PROGRESSO */}
      <circle
        cx="60"
        cy="60"
        r="52"

        fill="transparent"

        strokeWidth="7"

        strokeLinecap="round"

        stroke={
          tempoRestante <= 10
            ? "#ef4444"
            : tempoRestante <= 20
            ? "#facc15"
            : "#22c55e"
        }

        strokeDasharray={2 * Math.PI * 52}

        strokeDashoffset={
          (2 * Math.PI * 52) -
          (
            (tempoRestante / TEMPO_LIMITE)
            *
            (2 * Math.PI * 52)
          )
        }

        style={{
          transition:
            "stroke-dashoffset 1s linear, stroke 0.4s ease"
        }}

        className="
          drop-shadow-[0_0_4px_rgba(0,255,120,0.25)]
        "
      />

    </svg>

    {/* CENTRO */}
    <div
      className="
        absolute
        inset-[10px]

        rounded-full

        bg-[radial-gradient(circle_at_top,#114d33,#071b12)]

        border
        border-white/10

        flex
        items-center
        justify-center

        shadow-[0_0_25px_rgba(0,255,140,0.18)]
      "
    >

      <span
        className={`
          text-[34px]
          md:text-[42px]

          font-black

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

          <div className="bg-white/5 border border-green-900/40 backdrop-blur-md rounded-3xl p-2 md:p-3 shadow-2xl">

           {/* NÍVEL + ENUNCIADO CINEMATOGRÁFICO */}
<div
  className="
    relative
    bg-gradient-to-br
    from-[#0d2e21]
    to-[#071b12]
    border
    border-green-500/20
    rounded-[32px]
    px-4
md:px-6

pt-5
md:pt-8

pb-4
md:pb-7
    mb-5
    shadow-2xl
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
        text-[11px]
        uppercase
        tracking-[0.25em]
        text-green-300/70
        font-bold
        mb-2
        pt1
      "
    >

      Pergunta da Rodada ID: {questaoAtual?.id}
</p>
{questaoAtual?.nivel
  ?.toLowerCase() === "ouro" && (

  <div
    className="
      inline-flex
      items-center
      gap-2
      mb-4
      px-4
      py-2
      rounded-full
      bg-yellow-400/15
      border
      border-yellow-400/30
      text-yellow-300
      font-black
      text-sm
      shadow-[0_0_20px_rgba(255,215,0,0.15)]
    "
  >

    ⭐ QUESTÃO OURO

  </div>

)}
    
    {/* ENUNCIADO */}
    <h1
      className="
        text-[22px]
        md:text-[26px]
        font-black
        leading-[1.35]
        text-white
        drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]
      "
    >

      {questaoAtual?.pergunta}

      

    </h1>

  </div>

</div>

          {/* ALTERNATIVAS */}
<div className="grid gap-3">

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
            rounded-2xl
            px-4
            py-2.5
            text-left
            transition-opacity duration-700
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

          <span className="font-black mr-3">
            {String.fromCharCode(65 + index)})
          </span>

          {alternativa}

        </button>
      );
    }
  )}

</div>

{/* =========================================
PAINEL AJUDAS PREMIUM
========================================= */}

<div
  className="
    mt-3
    rounded-3xl
    border
    border-green-900/40
    bg-black/20
    backdrop-blur-md
    p-2
  "
>

  {/* TOPO */}
  <div className="flex items-center justify-between p0 mb-2">
 
  </div>

  
{/* =========================
    HUD ESTRATÉGICA PREMIUM
========================= */}

<div
  className="
    relative

    border
    border-green-500/20

    rounded-[28px]

    bg-gradient-to-br
    from-[#071b12]
    to-[#04110b]

    px-3
    pt-7
    pb-3

    mt-2

    shadow-[0_0_35px_rgba(0,255,140,0.06)]
  "
>

  {/* TÍTULO SUPERIOR */}

  <div
    className="
      absolute
      top-2
      left-4

      text-[11px]
      uppercase
      tracking-[0.25em]

      text-green-300/70
      font-bold
    "

    
  >
    Recursos Estratégicos
  </div>

  {/* GRID MASTER */}

  <div
    className="
      grid
      lg:grid-cols-[auto_1px_minmax(0,1fr)]

      items-center

      gap-x-3

      w-full
    "
  >

    {/* =========================
        COLUNA ESQUERDA
        AJUDAS
    ========================= */}

    <div
      className="
        grid
        grid-cols-5

        gap-3

        items-center
        justify-start
      "
    >

      {/* CONSULTORIA */}
      <button
        disabled={consultoriaUsada}
        onClick={usarConsultoria}
        className={`
          relative
          overflow-hidden

          h-[88px]
          w-[78px]

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

          <p className="font-black text-[11px] text-center tracking-wide text-green-100">
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

          h-[88px]
          w-[78px]

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

          <p className="font-black text-[11px] text-center tracking-wide text-green-100">
            Cartas
          </p>

        </div>

      </button>

      {/* IA */}
      <button
        className="
          relative
          overflow-hidden

          h-[88px]
          w-[78px]

          rounded-2xl
          border

          bg-[#071b12]
          hover:bg-[#0d2e21]

          border-green-700/40

          transition-all
          duration-300

          hover:scale-[1.02]

          shadow-[0_0_18px_rgba(0,255,140,0.06)]
        "
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.12),transparent_70%)]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-1">

          <div className="text-[28px] leading-none mb-1">
            🤖
          </div>

          <p className="font-black text-[11px] text-center tracking-wide text-green-100">
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

          h-[88px]
          w-[78px]

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

          <p className="font-black text-[11px] text-center tracking-wide text-green-100">
            Trocar
          </p>

        </div>

      </button>

      {/* ENCERRAR */}
      <button
        onClick={sairDoJogo}
        className="
          relative
          overflow-hidden

          h-[88px]
          w-[78px]

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

          <p className="font-black text-[11px] text-red-200 text-center tracking-wide">
            Encerrar
          </p>

        </div>

      </button>

    </div>

    {/* DIVISÓRIA */}

    <div className="hidden lg:flex justify-center">

      <div className="w-px h-[88px] bg-green-500/20 rounded-full"></div>

    </div>

    {/* =========================
        COLUNA DIREITA
        STATUS FINANCEIRO
    ========================= */}

    <div
      className="
        grid
        grid-cols-3

        gap-3

        w-full
        items-center
      "
    >

      {/* ERRAR */}
      <div
        className="
          relative
          overflow-hidden

          h-[88px]

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

        <h2 className="text-[22px] font-black text-red-300 mt-1 leading-none">

          R$ {valorErrar.toLocaleString("pt-BR")}

        </h2>

      </div>

      {/* PARAR */}
      <div
        className="
          relative
          overflow-hidden

          h-[88px]

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

        <h2 className="text-[22px] font-black text-yellow-300 mt-1 leading-none">

          R$ {valorParar.toLocaleString("pt-BR")}

        </h2>

      </div>

      {/* ACERTAR */}
      <div
        className="
          relative
          overflow-hidden

          h-[88px]

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

          <h2 className="text-[22px] font-black text-green-300 mt-1 leading-none">

            R$ {valorAtual.toLocaleString("pt-BR")}

          </h2>

        </div>

      </div>

    </div>

  </div>

</div>

</div>


{/* POPUP CONFIRMAÇÃO */}
{mostrarConfirmacao && (

  <div className="fixed inset-0 z-[998] flex items-center justify-center px-4">

    {/* BACKDROP */}
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

    {/* MODAL */}
    <div
      className="
        relative
        z-10
        w-full
        max-w-xl
        rounded-[32px]
        border
        border-green-400/30
        bg-[#082b1d]/95
        shadow-[0_0_25px_rgba(0,255,150,0.2)]
        backdrop-blur-2xl
        p-8
        animate-[popup_.3s_ease]
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

  </div>

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

          </div>

        </div>

      </div>

      {/* RODAPÉ PREMIUM */}
      <footer className="relative z-10 border-t border-green-900/50 bg-black/20 backdrop-blur-md py-2">

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