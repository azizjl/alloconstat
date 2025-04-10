import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import tw from 'twrnc';
import { useConstatStore } from '../../../store/constatStore';
import { generateConstatPDF } from '../../utils/pdfGenerator';

export default function GeneratePDFButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const constatState = useConstatStore();
  
  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      
      // First, ensure we have the template PDF in the file system
      // You'll need to implement this part to copy your template from assets
      // to the FileSystem.documentDirectory
      
      // Generate the PDF
      const pdfPath = await generateConstatPDF(constatState);
      
      Alert.alert(
        "PDF Généré",
        "Le constat a été généré avec succès et est prêt à être partagé.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la génération du PDF. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <TouchableOpacity
      style={tw`bg-blue-600 py-3 px-6 rounded-lg mt-4 items-center`}
      onPress={handleGeneratePDF}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={tw`text-white font-[OutfitM] text-lg`}>
          Générer le PDF du Constat
        </Text>
      )}
    </TouchableOpacity>
  );
} 