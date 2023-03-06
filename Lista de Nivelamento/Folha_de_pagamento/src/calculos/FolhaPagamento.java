package calculos;

import javax.swing.JOptionPane;

public class FolhaPagamento {
	
    public static void main(String[] args) {
        double valorHora = Double.parseDouble(JOptionPane.showInputDialog("Digite o valor da sua hora:"));
        int horasTrabalhadas = Integer.parseInt(JOptionPane.showInputDialog("Digite a quantidade de horas trabalhadas no mês:"));
        
        double salarioBruto = valorHora * horasTrabalhadas;
        double ir = 0;
        
        if (salarioBruto <= 900) {
            ir = 0;
        } 
        else if (salarioBruto <= 1500) {
            ir = salarioBruto * 0.05;
        }
        else if (salarioBruto <= 2500) {
            ir = salarioBruto * 0.1;
        } 
        else {
            ir = salarioBruto * 0.2;
        }
        
        double inss = salarioBruto * 0.1;
        double fgts = salarioBruto * 0.11;
        double totalDescontos = ir + inss;
        double salarioLiquido = salarioBruto - totalDescontos;
        
        JOptionPane.showMessageDialog(
        		null, "Salário Bruto: R$ " + salarioBruto + 
                "\n(-)" + "IR (" + ir + "%)" + ": R$ " + ir + 
                "\n(-)" + "INSS (10%)" + ": R$ " + inss + 
                "\nFGTS (11%)" + ": R$ " + fgts + 
                "\nTotal de descontos" + ": R$ " + totalDescontos + 
                "\nSalário Líquido" + ": R$ " + salarioLiquido);
    }
}

