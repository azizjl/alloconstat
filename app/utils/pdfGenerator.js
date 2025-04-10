import * as FileSystem from 'expo-file-system';
import { Platform, Share, Image } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

// Define positions for all elements on the PDF
const positions = {
  dateAccident: { x: 50, y: 720 },
  heure_accident: { x: 128, y: 720 },
  lieu: { x: 180, y: 720 },
  blesses: { 
    yes: { x: 535, y: 721 },
    no: { x: 458, y: 721 }
  },
  vehicles: {
    A: {
      marque: { x: 100, y: 600 },
      numeroImmatriculation: { x: 100, y: 580 },
      degatsApparents: { x: 100, y: 560 },
      observations: { x: 100, y: 540 }
    },
    B: {
      marque: { x: 300, y: 600 },
      numeroImmatriculation: { x: 300, y: 580 },
      degatsApparents: { x: 300, y: 560 },
      observations: { x: 300, y: 540 }
    }
  }
};

export async function generateConstatPDF(constatState) {
  try {
    console.log("Starting PDF generation with data:", JSON.stringify(constatState, null, 2));
    
    // Get the template image URI
    const templateImage = Image.resolveAssetSource(require('../../assets/template.jpg'));
    const templateImageUri = templateImage.uri;
    
    console.log("Template image URI:", templateImageUri);
    
    // Create HTML with the template as background
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=595px, height=842px, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 595px;
            height: 842px;
            position: relative;
            background-image: url('${templateImageUri}');
            background-size: 595px 842px;
            background-repeat: no-repeat;
          }
          .field {
            position: absolute;
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #000000;
          }
        </style>
      </head>
      <body>
        <div class="field" style="top: ${positions.dateAccident.y}px; left: ${positions.dateAccident.x}px;">${constatState.accidentDate || ''}</div>
        <div class="field" style="top: ${positions.heure_accident.y}px; left: ${positions.heure_accident.x}px;">${constatState.accidentTime || ''}</div>
        <div class="field" style="top: ${positions.lieu.y}px; left: ${positions.lieu.x}px;">${constatState.accidentLocation || ''}</div>
        
        <div class="field" style="top: ${positions.vehicles.A.marque.y}px; left: ${positions.vehicles.A.marque.x}px;">Marque: ${constatState.vehicleAMake || ''}</div>
        <div class="field" style="top: ${positions.vehicles.A.numeroImmatriculation.y}px; left: ${positions.vehicles.A.numeroImmatriculation.x}px;">Immatriculation: ${constatState.vehicleAPlate || ''}</div>
        
        ${constatState.vehicleCount === 2 ? `
          <div class="field" style="top: ${positions.vehicles.B.marque.y}px; left: ${positions.vehicles.B.marque.x}px;">Marque: ${constatState.vehicleBMake || ''}</div>
          <div class="field" style="top: ${positions.vehicles.B.numeroImmatriculation.y}px; left: ${positions.vehicles.B.numeroImmatriculation.x}px;">Immatriculation: ${constatState.vehicleBPlate || ''}</div>
        ` : ''}
        
        ${constatState.hasInjuries ? `
          <div class="field" style="top: ${positions.blesses.yes.y}px; left: ${positions.blesses.yes.x}px; font-weight: bold;">X</div>
        ` : `
          <div class="field" style="top: ${positions.blesses.no.y}px; left: ${positions.blesses.no.x}px; font-weight: bold;">X</div>
        `}
      </body>
      </html>
    `;
    
    // Generate PDF from HTML
    console.log("Generating PDF...");
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      width: 595,
      height: 842
    });
    
    console.log("PDF generated at:", uri);
    
    // Share the PDF
    if (Platform.OS === 'ios') {
      await Sharing.shareAsync(uri);
    } else {
      const contentUri = await FileSystem.getContentUriAsync(uri);
      await Share.share({
        url: contentUri,
        title: 'Constat Amiable',
      });
    }
    
    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

// Helper function to download the asset to a local file
async function downloadAsset(assetUri) {
  const fileUri = `${FileSystem.documentDirectory}constat_template.pdf`;
  
  // Check if the file already exists
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (!fileInfo.exists) {
    // Download the file from assets to document directory
    await FileSystem.downloadAsync(assetUri, fileUri);
  }
  
  return fileUri;
} 