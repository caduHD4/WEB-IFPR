var listaAlunos=[];
function cadastrar(){
    let nome = document.querySelector("#nome");
    let nota1 = document.querySelector("#nota1");
    let nota2 = document.querySelector("#nota2");
    let nota3 = document.querySelector("#nota3");


    if(validarCampos(nome, "Nome") &&
    validarCampos(nota1, "Nota 1") &&
    validarCampos(nota2, "Nota 2") &&
    validarCampos(nota3, "Nota 3")){
        let aluno = {nome:nome.value,
            nota1:nota1.valueAsNumber,
            nota2:parseFloat(nota2.value),
            nota3:nota3.valueAsNumber};
        aluno.media = calcularMedia(aluno);
        listaAlunos.push(aluno);
        console.log(listaAlunos);
        mostrarDados();
    }
}

function mostrarDados(){

    let informacoes = document.querySelector("#informacoesAdicionais");
    informacoes.innerHTML="Media turma:"+mediaTurma().toFixed(2)+" / Reprovados" +
        verificarAprovadosReprovados('Aprovado') + "/ Reprovados:" +
        verificarAprovadosReprovados('Reprovado');

    let tabela = document.querySelector("#tabela");
    let cabecalho = '<tr><th>Nome</th><th>Nota1</th><th>Nota2</th><th>Nota3</th><th>Media</th><th>Situacao</th>';
    let conteudo="";
    listaAlunos.forEach(el => {
        conteudo += '<tr><td>'+ el.nome + '</td><td>' +
        el.nota1 + '</td><td>' + el.nota2 + '</td><td>' +
        el.nota3 + '</td><td>' + el.media + '</td><td>' +
        verificarSituaçao(el) + '</td></tr>';
    });
    tabela.innerHTML=cabecalho+conteudo;

}

function mediaTurma(){
    let total=0;
    listaAlunos.forEach(element => {
        total+=element.media;
    });
    return total/listaAlunos.length;
}

//tipo: Aprovado ou Reprovado
function verificarAprovadosReprovados(tipo){
    let total=0;
    listaAlunos.forEach(element => {
        if(verificarSituaçao(element)==tipo){
            total+=1;
        }
    });

}

function verificarSituaçao(aluno){
    return aluno.media<7?"Reprovado":"Aprovado";
}


function calcularMedia(aluno){
    return (aluno.nota1+aluno.nota2+aluno.nota3)/3;
}

function validarCampos(campo, nomeCampo){
    if(!campo.value){
        alert(nomeCampo+" preenchimento obrigatorio");
        return false;    
    }
    return true;
}

