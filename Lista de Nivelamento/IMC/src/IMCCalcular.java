import javax.swing.JOptionPane;

public class IMCCalcular {
	
    public static void main(String[] args) {
    	
        String sex = JOptionPane.showInputDialog("Informe seu sexo (M/F):");
        String pesoStr = JOptionPane.showInputDialog("Informe seu peso:");
        String alturaStr = JOptionPane.showInputDialog("Informe sua altura:");

        double peso = Double.parseDouble(pesoStr);
        double altura = Double.parseDouble(alturaStr);
        double imc = calcularIMC(peso, altura);

        JOptionPane.showMessageDialog(null, getIMCInterpretation(imc, sex));
    }

    private static double calcularIMC(double peso, double altura) {
        return peso / (altura * altura);
    }

    private static String getIMCInterpretation(double imc, String sex) {
        String interpretation = "";

        if (sex.equalsIgnoreCase("M")) {
            if (imc < 18.5) {
                interpretation = "Abaixo do peso.";
            } 
            else if (imc >= 18.6 && imc <= 24.99) {
                interpretation = "Peso normal.";
            } 
            else if (imc >= 25 && imc <= 29.99) {
                interpretation = "Sobrepeso.";
            } 
            else if (imc >= 30 && imc <= 31) {
                interpretation = "Acima do peso ideal.";
            } 
            else {
                interpretation = "Obeso.";
            }
        } 
        
        else if (sex.equalsIgnoreCase("F")) {
            if (imc < 18.5) {
                interpretation = "Abaixo do peso.";
            } 
            else if (imc >= 18.6 && imc <= 24.99) {
                interpretation = "Peso normal.";
            } 
            else if (imc >= 25 && imc <= 29.99) {
                interpretation = "Sobrepeso.";
            } 
            else if (imc >= 30 && imc <= 34.9) {
                interpretation = "Acima do peso ideal.";
            } 
            else {
                interpretation = "Obesa.";
            }
        } 
        
        else {
            interpretation = "Sexo inválido.";
        }

        return interpretation;
    }
}

