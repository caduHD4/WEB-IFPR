package Idade;

import javax.swing.JOptionPane;

public class ClassificarIdade {
	
    public static void main(String[] args) {
    	
        String input = JOptionPane.showInputDialog("Digite a sua idade:");
        int idade = Integer.parseInt(input);
        
        if (idade < 13) {
            JOptionPane.showMessageDialog(null, "Criança.");
        } 
        
        else if (idade < 18) {
            JOptionPane.showMessageDialog(null, "Adolescente.");
        } 
        
        else if (idade < 60) {
            JOptionPane.showMessageDialog(null, "Adulto.");
        } 
        
        else {
            JOptionPane.showMessageDialog(null, "Idoso.");
        }
    }
}

