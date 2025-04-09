import { View, Text, ScrollView, Image } from 'react-native';
import tw from 'twrnc';
import { useConstatStore } from '../../../store/constatStore';

export default function ReviewStep() {
  const constatState = useConstatStore();
  
  const renderSection = (title, content) => {
    return (
      <View style={tw`mb-6`}>
        <Text style={tw`text-lg font-[OutfitM] mb-2 text-[#0a7ea4]`}>{title}</Text>
        <View style={tw`bg-gray-50 p-4 rounded-lg`}>
          {content}
        </View>
      </View>
    );
  };
  
  const renderField = (label, value) => {
    if (!value && value !== false) return null;
    
    return (
      <View style={tw`mb-2`}>
        <Text style={tw`text-gray-600 font-[OutfitM]`}>{label}:</Text>
        <Text style={tw`text-gray-800 font-[OutfitR]`}>{value === true ? 'Oui' : value === false ? 'Non' : value}</Text>
      </View>
    );
  };
  
  const renderNumberedSection = (number, title, content) => {
    return (
      <View style={tw`mb-6`}>
        <View style={tw`flex-row items-center mb-2`}>
          <View style={tw`h-6 w-6 rounded-full bg-gray-700 items-center justify-center mr-2`}>
            <Text style={tw`text-white font-[OutfitB] text-xs`}>{number}</Text>
          </View>
          <Text style={tw`text-lg font-[OutfitM] text-[#0a7ea4]`}>{title}</Text>
        </View>
        <View style={tw`bg-gray-50 p-4 rounded-lg`}>
          {content}
        </View>
      </View>
    );
  };
  
  return (
    <View style={tw`bg-white rounded-lg p-6 shadow-sm`}>
      <Text style={tw`text-xl font-[OutfitB] mb-6 text-center`}>
        Récapitulatif du constat
      </Text>
      
      {renderNumberedSection('1', 'Date et Heure', (
        <>
          {renderField('Date de l\'accident', constatState.accidentDate)}
          {renderField('Heure de l\'accident', constatState.accidentTime)}
        </>
      ))}
      
      {renderNumberedSection('2', 'Lieu', (
        <>
          {renderField('Lieu de l\'accident', constatState.accidentLocation)}
        </>
      ))}
      
      {renderNumberedSection('3', 'Blessés', (
        <>
          {renderField('Blessés même légers', constatState.hasInjuries ? 'Oui' : 'Non')}
        </>
      ))}
      
      {renderNumberedSection('4', 'Dégâts matériels', (
        <>
          {renderField('Dégâts matériels autres qu\'aux véhicules A et B', constatState.hasMaterialDamage ? 'Oui' : 'Non')}
        </>
      ))}
      
      {renderNumberedSection('5', 'Témoins', (
        <>
          {renderField('Témoins (noms, adresses, tél)', constatState.witnesses)}
        </>
      ))}
      
      {/* Vehicle A Information */}
      <Text style={tw`text-xl font-[OutfitB] mb-4 mt-6 text-center text-yellow-500`}>
        Véhicule A
      </Text>
      
      {renderNumberedSection('6', 'Société d\'Assurances', (
        <>
          {renderField('Véhicule assuré par', constatState.vehicleAInsurance)}
          {renderField('Police d\'Assurance N°', constatState.vehicleAInsurancePolicy)}
          {renderField('Agence', constatState.vehicleAAgency)}
          {renderField('Attestation valable du', constatState.vehicleACertificateValidFrom)}
          {renderField('au', constatState.vehicleACertificateValidTo)}
        </>
      ))}
      
      {renderNumberedSection('7', 'Identité du Conducteur', (
        <>
          {renderField('Nom', constatState.driverAName)}
          {renderField('Prénom', constatState.driverAFirstName)}
          {renderField('Adresse', constatState.driverAAddress)}
          {renderField('Téléphone', constatState.driverAPhone)}
          {renderField('Permis de conduire N°', constatState.driverALicense)}
          {renderField('Délivré le', constatState.driverALicenseDate)}
        </>
      ))}
      
      {renderNumberedSection('8', 'Assuré', (
        <>
          {renderField('Nom', constatState.insuredAName)}
          {renderField('Prénom', constatState.insuredAFirstName)}
          {renderField('Adresse', constatState.insuredAAddress)}
          {renderField('Téléphone', constatState.insuredAPhone)}
        </>
      ))}
      
      {renderNumberedSection('9', 'Identité du Véhicule', (
        <>
          {renderField('Marque', constatState.vehicleAMake)}
          {renderField('Modèle', constatState.vehicleAModel)}
          {renderField('N° d\'immatriculation', constatState.vehicleAPlate)}
          {renderField('Sens suivi', constatState.vehicleADirection)}
          {renderField('Venant de', constatState.vehicleAFrom)}
          {renderField('Allant à', constatState.vehicleATo)}
          
          {constatState.vehicleAImage && (
            <View style={tw`mt-2`}>
              <Text style={tw`text-gray-600 font-[OutfitM] mb-1`}>Photo du véhicule:</Text>
              <Image 
                source={{ uri: constatState.vehicleAImage.uri }} 
                style={tw`w-full h-40 rounded-lg`}
                resizeMode="cover"
              />
            </View>
          )}
        </>
      ))}
      
      {renderNumberedSection('11', 'Dégâts apparents', (
        <>
          {renderField('Description des dégâts', constatState.vehicleADamages)}
        </>
      ))}
      
      {renderNumberedSection('14', 'Observations', (
        <>
          {renderField('Observations', constatState.vehicleAObservations)}
        </>
      ))}
      
      {/* Vehicle B Information (if applicable) */}
      {constatState.vehicleCount === 2 && (
        <>
          <Text style={tw`text-xl font-[OutfitB] mb-4 mt-6 text-center text-green-500`}>
            Véhicule B
          </Text>
          
          {renderNumberedSection('6', 'Société d\'Assurances', (
            <>
              {renderField('Véhicule assuré par', constatState.vehicleBInsurance)}
              {renderField('Police d\'Assurance N°', constatState.vehicleBInsurancePolicy)}
              {renderField('Agence', constatState.vehicleBAgency)}
              {renderField('Attestation valable du', constatState.vehicleBCertificateValidFrom)}
              {renderField('au', constatState.vehicleBCertificateValidTo)}
            </>
          ))}
          
          {renderNumberedSection('7', 'Identité du Conducteur', (
            <>
              {renderField('Nom', constatState.driverBName)}
              {renderField('Prénom', constatState.driverBFirstName)}
              {renderField('Adresse', constatState.driverBAddress)}
              {renderField('Téléphone', constatState.driverBPhone)}
              {renderField('Permis de conduire N°', constatState.driverBLicense)}
              {renderField('Délivré le', constatState.driverBLicenseDate)}
            </>
          ))}
          
          {renderNumberedSection('8', 'Assuré', (
            <>
              {renderField('Nom', constatState.insuredBName)}
              {renderField('Prénom', constatState.insuredBFirstName)}
              {renderField('Adresse', constatState.insuredBAddress)}
              {renderField('Téléphone', constatState.insuredBPhone)}
            </>
          ))}
          
          {renderNumberedSection('9', 'Identité du Véhicule', (
            <>
              {renderField('Marque', constatState.vehicleBMake)}
              {renderField('Modèle', constatState.vehicleBModel)}
              {renderField('N° d\'immatriculation', constatState.vehicleBPlate)}
              {renderField('Sens suivi', constatState.vehicleBDirection)}
              {renderField('Venant de', constatState.vehicleBFrom)}
              {renderField('Allant à', constatState.vehicleBTo)}
              
              {constatState.vehicleBImage && (
                <View style={tw`mt-2`}>
                  <Text style={tw`text-gray-600 font-[OutfitM] mb-1`}>Photo du véhicule:</Text>
                  <Image 
                    source={{ uri: constatState.vehicleBImage.uri }} 
                    style={tw`w-full h-40 rounded-lg`}
                    resizeMode="cover"
                  />
                </View>
              )}
            </>
          ))}
          
          {renderNumberedSection('11', 'Dégâts apparents', (
            <>
              {renderField('Description des dégâts', constatState.vehicleBDamages)}
            </>
          ))}
          
          {renderNumberedSection('14', 'Observations', (
            <>
              {renderField('Observations', constatState.vehicleBObservations)}
            </>
          ))}
        </>
      )}
      
      {constatState.sketchImage && renderNumberedSection('13', 'Croquis de l\'accident', (
        <>
          <Image 
            source={{ uri: constatState.sketchImage.uri }} 
            style={tw`w-full h-60 rounded-lg`}
            resizeMode="contain"
          />
          {renderField('Notes sur le croquis', constatState.sketchNotes)}
        </>
      ))}
      
      <Text style={tw`text-gray-500 text-center mt-4 font-[OutfitR]`}>
        Vérifiez toutes les informations avant de soumettre le constat.
      </Text>
    </View>
  );
} 