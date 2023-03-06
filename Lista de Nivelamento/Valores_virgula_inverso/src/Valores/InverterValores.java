package Valores;

import javax.swing.JOptionPane;

public class InverterValores {
	
    public static void main(String[] args) {
    	
        String input = JOptionPane.showInputDialog("Digite os valores separados por vígula:");
        String[] valores = input.split(",");
        String resultado = inverter(valores);
        JOptionPane.showMessageDialog(null, resultado);
    }

    public static String inverter(String[] valores) {
    	
        String resultado = "";
        
        for (int i = valores.length - 1; i >= 0; i--) {
            resultado += valores[i].trim() + " ";
        }
        return resultado;
    }
}

