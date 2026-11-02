
let professor = document.getElementById("professor");
let jogo = document.getElementById("jogo");

let professorY = 150;
let velocidade = 0;
let gravidade = 0.25;
let impulso = -6.5;

let pontos = 0;
let ativo = true;
let livros = [];

const larguraProfessor = 50;
const larguraLivro = 60;
const distanciaEntreLivros = 180;
const velocidadeLivros = 2.2;

// Fazer o professor voar
function voar() {
    if (ativo) {
        velocidade = impulso;
    }
}

// Apertar espaço
document.addEventListener("keydown", function(evento) {
    if (evento.code === "Space") {
        evento.preventDefault();
        voar();
    }
});

// Clicar na tela
jogo.addEventListener("click", voar);

// Criar os livros
function criarLivro() {
    if (!ativo) return;

    let altura = Math.floor(Math.random() * 120) + 50;

    let cima = document.createElement("div");
    cima.className = "livro";
    cima.style.height = altura + "px";
    cima.style.top = "0px";

    let baixo = document.createElement("div");
    baixo.className = "livro";
    baixo.style.height = (400 - altura - distanciaEntreLivros) + "px";
    baixo.style.bottom = "0px";

    jogo.appendChild(cima);
    jogo.appendChild(baixo);

    livros.push({
        cima: cima,
        baixo: baixo,
        x: 600,
        altura: altura,
        marcou: false
    });
}

// Criar livros a cada 2,5 segundos
setInterval(function() {
    criarLivro();
}, 2500);

// Finalizar o jogo
function fimDeJogo() {
    if (!ativo) return;

    ativo = false;
    document.getElementById("fim").style.display = "block";
}

// Movimento do jogo
function jogar() {

    if (ativo) {

        // Movimento do professor
        velocidade += gravidade;
        professorY += velocidade;

        professor.style.top = professorY + "px";

        // Movimentar os livros
        livros.forEach(function(livro) {

            livro.x -= velocidadeLivros;

            livro.cima.style.left = livro.x + "px";
            livro.baixo.style.left = livro.x + "px";

            // Contar pontos
            if (!livro.marcou && livro.x + larguraLivro < 100) {
                pontos++;
                livro.marcou = true;

                document.getElementById("pontos").innerText = pontos;
            }

            // Verificar se o professor está na horizontal do livro
            let professorDireita = 100 + larguraProfessor;
            let livroDireita = livro.x + larguraLivro;

            let naHorizontal =
                professorDireita > livro.x &&
                100 < livroDireita;

            // Verificar se bateu nos livros
            if (naHorizontal) {

                let bateuEmCima = professorY < livro.altura;

                let bateuEmBaixo =
                    professorY + larguraProfessor >
                    livro.altura + distanciaEntreLivros;

                if (bateuEmCima || bateuEmBaixo) {
                    fimDeJogo();
                }
            }
        });

        // Remover livros que saíram da tela
        livros = livros.filter(function(livro) {

            if (livro.x < -60) {
                livro.cima.remove();
                livro.baixo.remove();
                return false;
            }

            return true;
        });

        // Verificar teto e chão
        if (professorY < 0 || professorY + larguraProfessor > 400) {
            fimDeJogo();
        }
    }

    requestAnimationFrame(jogar);
}

// Reiniciar
function reiniciar() {

    livros.forEach(function(livro) {
        livro.cima.remove();
        livro.baixo.remove();
    });

    livros = [];

    professorY = 100;
    velocidade = 0;
    pontos = 0;
    ativo = true;

    professor.style.top = "100px";

    document.getElementById("pontos").innerText = "0";
    document.getElementById("fim").style.display = "none";
}

// Começar o jogo
jogar();
