package Idade;

public class Pessoa {
    private String nome;
    private int idade;

    public Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public String classificarIdade() {
        if (idade < 13) {
            return "Criança";
        } 
        
        else if (idade < 18) {
            return "Adolescente";
        } 
        
        else if (idade < 60) {
            return "Adulto";
        } 
        
        else {
            return "Idoso";
        }
    }
}

