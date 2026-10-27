// Banco de questões — "correta" é o índice (0 a 3) da alternativa certa.
// Fica apenas no servidor: o navegador do aluno nunca recebe o gabarito.
// A cada partida são sorteadas 15 destas 30 questões.
module.exports = [
  // ---------- Conceitos básicos ----------
  {
    categoria: "Conceitos básicos",
    pergunta: "O que é hardware?",
    opcoes: [
      "Os programas instalados no computador",
      "A parte física do computador, que podemos tocar",
      "A conexão com a internet",
      "Os arquivos salvos na nuvem"
    ],
    correta: 1,
    dica: "Pense em algo que você consegue pegar com as mãos, como um teclado ou um mouse."
  },
  {
    categoria: "Conceitos básicos",
    pergunta: "O que é software?",
    opcoes: [
      "Os programas e instruções que o computador executa",
      "As peças internas do gabinete",
      "O monitor e o teclado",
      "Os cabos de energia"
    ],
    correta: 0,
    dica: "É a parte lógica: você não toca nele, mas usa, como um aplicativo ou um jogo."
  },
  {
    categoria: "Conceitos básicos",
    pergunta: "Qual é a menor unidade de informação em um computador?",
    opcoes: ["Byte", "Kilobyte", "Bit", "Pixel"],
    correta: 2,
    dica: "Ela só pode valer 0 ou 1."
  },
  {
    categoria: "Conceitos básicos",
    pergunta: "Quantos bits formam 1 byte?",
    opcoes: ["4", "8", "16", "1024"],
    correta: 1,
    dica: "É o mesmo número de pernas de uma aranha."
  },
  {
    categoria: "Conceitos básicos",
    pergunta: "Qual a ordem correta, da MENOR para a MAIOR unidade?",
    opcoes: [
      "GB, MB, KB, TB",
      "KB, GB, MB, TB",
      "KB, MB, GB, TB",
      "MB, KB, TB, GB"
    ],
    correta: 2,
    dica: "Kilo < Mega < Giga < Tera."
  },

  // ---------- Hardware ----------
  {
    categoria: "Hardware",
    pergunta: "Qual componente é considerado o 'cérebro' do computador?",
    opcoes: ["Memória RAM", "Placa-mãe", "Fonte de alimentação", "Processador (CPU)"],
    correta: 3,
    dica: "É ele que faz todos os cálculos e executa as instruções. A sigla tem 3 letras."
  },
  {
    categoria: "Hardware",
    pergunta: "Qual destes é um dispositivo de ENTRADA?",
    opcoes: ["Monitor", "Impressora", "Teclado", "Caixa de som"],
    correta: 2,
    dica: "Dispositivos de entrada ENVIAM informação para o computador. Você digita com ele."
  },
  {
    categoria: "Hardware",
    pergunta: "Qual destes é um dispositivo de SAÍDA?",
    opcoes: ["Mouse", "Monitor", "Scanner", "Microfone"],
    correta: 1,
    dica: "Dispositivos de saída MOSTRAM o resultado para você. Você está olhando para um agora."
  },
  {
    categoria: "Hardware",
    pergunta: "Qual peça conecta e permite a comunicação entre todos os componentes do computador?",
    opcoes: ["Placa-mãe", "Cooler", "Gabinete", "Placa de som"],
    correta: 0,
    dica: "É a placa principal, onde o processador e a memória são encaixados."
  },
  {
    categoria: "Hardware",
    pergunta: "Qual componente é responsável por processar imagens, vídeos e jogos?",
    opcoes: ["Placa de rede", "Fonte", "Placa de vídeo (GPU)", "Memória ROM"],
    correta: 2,
    dica: "Os gamers adoram investir nela para ter mais FPS."
  },
  {
    categoria: "Hardware",
    pergunta: "Um dispositivo que é ao mesmo tempo de entrada E de saída é:",
    opcoes: ["Teclado", "Tela touchscreen", "Impressora", "Webcam"],
    correta: 1,
    dica: "Ele mostra a imagem e, ao mesmo tempo, você toca nele para dar comandos."
  },
  {
    categoria: "Hardware",
    pergunta: "Qual a função da fonte de alimentação?",
    opcoes: [
      "Resfriar o processador",
      "Armazenar arquivos",
      "Converter e fornecer energia elétrica aos componentes",
      "Conectar o computador à internet"
    ],
    correta: 2,
    dica: "Pense no nome: 'alimentação'. O que todo componente precisa para ligar?"
  },

  // ---------- Software ----------
  {
    categoria: "Software",
    pergunta: "Qual destes é um sistema operacional?",
    opcoes: ["Microsoft Word", "Google Chrome", "Windows", "Excel"],
    correta: 2,
    dica: "É o programa principal que aparece logo que você liga o PC, com área de trabalho e menu Iniciar."
  },
  {
    categoria: "Software",
    pergunta: "Qual é a principal função de um sistema operacional?",
    opcoes: [
      "Editar textos e planilhas",
      "Gerenciar o hardware e permitir que os programas funcionem",
      "Proteger contra vírus apenas",
      "Acessar redes sociais"
    ],
    correta: 1,
    dica: "Ele funciona como um 'gerente' entre as peças do computador e os aplicativos."
  },
  {
    categoria: "Software",
    pergunta: "O Google Chrome, o Firefox e o Edge são exemplos de:",
    opcoes: ["Sistemas operacionais", "Antivírus", "Navegadores de internet", "Editores de texto"],
    correta: 2,
    dica: "Você usa esses programas para entrar em sites."
  },
  {
    categoria: "Software",
    pergunta: "Um software livre (open source) é aquele que:",
    opcoes: [
      "Sempre vem instalado de fábrica",
      "Tem o código-fonte aberto, podendo ser estudado e modificado",
      "Só funciona sem internet",
      "É obrigatoriamente pago"
    ],
    correta: 1,
    dica: "'Open source' significa 'código aberto'."
  },
  {
    categoria: "Software",
    pergunta: "Qual é a função de um antivírus?",
    opcoes: [
      "Aumentar a memória RAM",
      "Detectar e remover programas maliciosos",
      "Acelerar a internet",
      "Formatar o HD automaticamente"
    ],
    correta: 1,
    dica: "O nome já diz: ele age contra os vírus e outras ameaças."
  },
  {
    categoria: "Software",
    pergunta: "Qual destes é um sistema operacional usado em celulares?",
    opcoes: ["Android", "Photoshop", "PowerPoint", "Linux Mint"],
    correta: 0,
    dica: "O símbolo dele é um robozinho verde."
  },

  // ---------- Memória ----------
  {
    categoria: "Memória",
    pergunta: "Qual memória é VOLÁTIL, ou seja, perde os dados quando o computador é desligado?",
    opcoes: ["HD", "SSD", "Memória RAM", "Pen drive"],
    correta: 2,
    dica: "É a memória de trabalho, que guarda o que está aberto agora."
  },
  {
    categoria: "Memória",
    pergunta: "A memória ROM tem como característica:",
    opcoes: [
      "Ser apenas de leitura e guardar instruções de inicialização (como a BIOS)",
      "Perder os dados ao desligar o computador",
      "Ser usada para armazenar fotos e vídeos",
      "Ser um tipo de armazenamento em nuvem"
    ],
    correta: 0,
    dica: "ROM = Read Only Memory, ou 'memória somente de leitura'."
  },
  {
    categoria: "Memória",
    pergunta: "Qual é a memória mais rápida, localizada dentro do próprio processador?",
    opcoes: ["Memória cache", "Memória RAM", "HD", "Memória virtual"],
    correta: 0,
    dica: "Ela é pequena e guarda os dados que o processador usa com mais frequência."
  },
  {
    categoria: "Memória",
    pergunta: "Ter MAIS memória RAM geralmente permite:",
    opcoes: [
      "Guardar mais fotos permanentemente",
      "Executar mais programas ao mesmo tempo com mais fluidez",
      "Ter internet mais rápida",
      "Aumentar o tamanho da tela"
    ],
    correta: 1,
    dica: "A RAM é como uma mesa de trabalho: quanto maior, mais coisas cabem abertas ao mesmo tempo."
  },
  {
    categoria: "Memória",
    pergunta: "Quando a RAM fica cheia, o sistema usa parte do disco como se fosse RAM. Isso se chama:",
    opcoes: ["Memória cache", "Memória ROM", "Memória virtual", "Memória flash"],
    correta: 2,
    dica: "Ela não existe fisicamente como RAM: é 'simulada' no disco."
  },

  // ---------- Armazenamento local ----------
  {
    categoria: "Armazenamento local",
    pergunta: "Qual a principal diferença entre SSD e HD?",
    opcoes: [
      "O HD é mais rápido que o SSD",
      "O SSD não tem partes móveis e é muito mais rápido",
      "O SSD perde os dados ao desligar",
      "O HD só funciona em notebooks"
    ],
    correta: 1,
    dica: "O HD tem um disco que gira; o SSD usa chips de memória flash."
  },
  {
    categoria: "Armazenamento local",
    pergunta: "Qual destes é um dispositivo de armazenamento PORTÁTIL?",
    opcoes: ["Processador", "Memória RAM", "Pen drive", "Placa-mãe"],
    correta: 2,
    dica: "Cabe no bolso e você conecta na porta USB."
  },
  {
    categoria: "Armazenamento local",
    pergunta: "Um HD externo de 1 TB tem aproximadamente quantos GB?",
    opcoes: ["10 GB", "100 GB", "1.000 GB", "1.000.000 GB"],
    correta: 2,
    dica: "Cada unidade é cerca de mil vezes a anterior: 1 TB ≈ mil GB."
  },
  {
    categoria: "Armazenamento local",
    pergunta: "Armazenamento local significa que os arquivos ficam guardados:",
    opcoes: [
      "Em servidores de uma empresa na internet",
      "No próprio dispositivo ou em mídia física conectada a ele",
      "Somente no e-mail",
      "Na memória RAM"
    ],
    correta: 1,
    dica: "'Local' quer dizer 'aqui com você', sem depender da internet."
  },

  // ---------- Armazenamento em nuvem ----------
  {
    categoria: "Nuvem",
    pergunta: "O que é armazenamento em nuvem?",
    opcoes: [
      "Guardar arquivos em servidores acessados pela internet",
      "Guardar arquivos em um pen drive",
      "Um tipo de memória RAM",
      "Uma pasta oculta do Windows"
    ],
    correta: 0,
    dica: "A 'nuvem' na verdade são computadores de empresas, acessados de longe."
  },
  {
    categoria: "Nuvem",
    pergunta: "Qual destes é um serviço de armazenamento em nuvem?",
    opcoes: ["Paint", "Google Drive", "Bloco de Notas", "BIOS"],
    correta: 1,
    dica: "É do Google e já vem com 15 GB grátis na sua conta Gmail."
  },
  {
    categoria: "Nuvem",
    pergunta: "Qual é uma VANTAGEM do armazenamento em nuvem?",
    opcoes: [
      "Funciona sem nenhum tipo de conexão",
      "Acessar os arquivos de qualquer lugar e dispositivo com internet",
      "Deixa o processador mais rápido",
      "Nunca precisa de senha"
    ],
    correta: 1,
    dica: "Pense em abrir o mesmo arquivo no celular, na escola e em casa."
  }
];
