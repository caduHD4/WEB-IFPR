package valores;

import javax.swing.JOptionPane;

public class OrdenarValores {
	
    public static void main(String[] args) {
    	
        String input = JOptionPane.showInputDialog("Digite os 3 valores separados por vírgula:");
        String[] valores = input.split(",");
        int[] valoresInt = new int[valores.length];

        for (int i = 0; i < valores.length; i++) {
            valoresInt[i] = Integer.parseInt(valores[i].trim());
        }

        ordenar(valoresInt);
        JOptionPane.showMessageDialog(null, valoresInt[0] + ", " + valoresInt[1] + ", " + valoresInt[2]);
    }

    public static void ordenar(int[] valores) {
        int temp;
        
        for (int i = 0; i < valores.length; i++) {
            for (int j = i + 1; j < valores.length; j++) {
            	
                if (valores[i] > valores[j]) {
                    temp = valores[i];
                    valores[i] = valores[j];
                    valores[j] = temp;
                }
            }
        }
    }
}

