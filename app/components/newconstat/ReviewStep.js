import { View, Text, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useConstatStore } from '../../../store/constatStore';
import { useState, useEffect } from 'react';
import GeneratePDFButton from './GeneratePDFButton';

export default function ReviewStep() {
  const constatState = useConstatStore();
  
  const [currentTemplate, setCurrentTemplate] = useState(null);

  useEffect(() => {
    if (constatState.sketchTemplate && 
        (!currentTemplate || 
         currentTemplate.caseId !== constatState.sketchTemplate.caseId)) {
      setCurrentTemplate(constatState.sketchTemplate);
      console.log("Template updated in review:", constatState.sketchTemplate);
    }
  }, [constatState.sketchTemplate]);
  
  console.log("Sketch template in review:", constatState.sketchTemplate);
  
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

  // Helper function to render circumstances
  const renderCircumstances = (circumstances) => {
    if (!circumstances || !Array.isArray(circumstances) || circumstances.length === 0) return null;
    
    // Define the circumstances list (same as in CircumstancesStep.js)
    const circumstancesList = [
      { id: 1, label: 'en stationnement' },
      { id: 2, label: 'quittait un stationnement' },
      { id: 3, label: 'prenait un stationnement' },
      { id: 4, label: 'sortait d\'un parking, d\'un lieu privé, d\'un chemin de terre' },
      { id: 5, label: 's\'engageait dans un parking, un lieu privé, un chemin de terre' },
      { id: 6, label: 'arrêt de circulation' },
      { id: 7, label: 'frottement sans changement de file' },
      { id: 8, label: 'heurtait à l\'arrière, en roulant dans le même sens et sur une même file' },
      { id: 9, label: 'roulait dans le même sens et sur une file différente' },
      { id: 10, label: 'changeait de file' },
      { id: 11, label: 'doublait' },
      { id: 12, label: 'virait à droite' },
      { id: 13, label: 'virait à gauche' },
      { id: 14, label: 'reculait' },
      { id: 15, label: 'empiétait sur la partie de chaussée réservée à la circulation en sens inverse' },
      { id: 16, label: 'venait de droite (dans un carrefour)' },
      { id: 17, label: 'n\'avait pas observé le signal de priorité' }
    ];
    
    // Convert IDs to labels
    const circumstanceLabels = circumstances.map(id => {
      const circumstance = circumstancesList.find(c => c.id === id);
      return circumstance ? circumstance.label : `Circonstance ${id}`;
    });
    
    return (
      <View style={tw`mt-2`}>
        {circumstanceLabels.map((item, index) => (
          <View key={index} style={tw`flex-row mb-1`}>
            <Text style={tw`text-gray-800 font-[OutfitR]`}>• {item}</Text>
          </View>
        ))}
      </View>
    );
  };
  
  // Helper function to render damages
  const renderDamages = (damagesString) => {
    if (!damagesString) return null;
    
    // Define the damage types list (same as in DamagesStep.js)
    const damageTypes = [
      { id: 'scratches', label: 'Rayures' },
      { id: 'dents', label: 'Bosses' },
      { id: 'broken_lights', label: 'Feux cassés' },
      { id: 'broken_glass', label: 'Vitres brisées' },
      { id: 'bumper_damage', label: 'Pare-chocs endommagé' },
      { id: 'door_damage', label: 'Portes endommagées' },
      { id: 'hood_damage', label: 'Capot endommagé' },
      { id: 'trunk_damage', label: 'Coffre endommagé' },
      { id: 'wheel_damage', label: 'Roues/pneus endommagés' },
      { id: 'other', label: 'Autres dommages' }
    ];
    
    try {
      // Try to parse as JSON
      const damagesArray = JSON.parse(damagesString);
      
      if (Array.isArray(damagesArray)) {
        // Convert IDs to labels
        const damageLabels = damagesArray.map(id => {
          const damage = damageTypes.find(d => d.id === id);
          return damage ? damage.label : id;
        });
        
        return (
          <View style={tw`mt-2`}>
            {damageLabels.map((item, index) => (
              <View key={index} style={tw`flex-row mb-1`}>
                <Text style={tw`text-gray-800 font-[OutfitR]`}>• {item}</Text>
              </View>
            ))}
          </View>
        );
      }
    } catch {
      // If not valid JSON, just return the string as is
      return <Text style={tw`text-gray-800 font-[OutfitR]`}>{damagesString}</Text>;
    }
    
    // Fallback
    return <Text style={tw`text-gray-800 font-[OutfitR]`}>{damagesString}</Text>;
  };
  
  // Helper function to render the sketch
  const renderSketch = () => {
    console.log("Rendering sketch with template:", constatState.sketchTemplate);
    
    // If we have a saved sketch image, show that
    if (constatState.sketchImage) {
      return (
        <View style={tw`mt-2`}>
          <Image 
            source={{ uri: constatState.sketchImage.uri }} 
            style={tw`w-full h-40 rounded-lg`}
            resizeMode="contain"
          />
        </View>
      );
    }
    
    // If we have a selected template but no saved image, show the template
    if (constatState.sketchTemplate && constatState.sketchTemplate.caseId) {
      const caseId = constatState.sketchTemplate.caseId;
      console.log("Displaying template case ID:", caseId);
      
      // Define the case images
      let imageSource;
      try {
        // Try to dynamically require the image based on case ID
        switch(caseId) {
          case 1: imageSource = require('../../../assets/images/croquis/1.png'); break;
          case 2: imageSource = require('../../../assets/images/croquis/2.png'); break;
          case 3: imageSource = require('../../../assets/images/croquis/3.png'); break;
          case 4: imageSource = require('../../../assets/images/croquis/4.png'); break;
          case 5: imageSource = require('../../../assets/images/croquis/5.png'); break;
          case 6: imageSource = require('../../../assets/images/croquis/6.png'); break;
          case 7: imageSource = require('../../../assets/images/croquis/7.png'); break;
          case 8: imageSource = require('../../../assets/images/croquis/8.png'); break;
          case 9: imageSource = require('../../../assets/images/croquis/9.png'); break;
          case 10: imageSource = require('../../../assets/images/croquis/10.png'); break;
          case 11: imageSource = require('../../../assets/images/croquis/11.png'); break;
          case 12: imageSource = require('../../../assets/images/croquis/12.png'); break;
          case 13: imageSource = require('../../../assets/images/croquis/13.png'); break;
          case 14: imageSource = require('../../../assets/images/croquis/14.png'); break;
          case 15: imageSource = require('../../../assets/images/croquis/15.png'); break;
          case 16: imageSource = require('../../../assets/images/croquis/16.png'); break;
          case 17: imageSource = require('../../../assets/images/croquis/17.png'); break;
          case 18: imageSource = require('../../../assets/images/croquis/18.png'); break;
          case 19: imageSource = require('../../../assets/images/croquis/19.png'); break;
          case 20: imageSource = require('../../../assets/images/croquis/20.png'); break;
          case 21: imageSource = require('../../../assets/images/croquis/21.png'); break;
          case 22: imageSource = require('../../../assets/images/croquis/22.png'); break;
          case 23: imageSource = require('../../../assets/images/croquis/23.png'); break;
          case 24: imageSource = require('../../../assets/images/croquis/24.png'); break;
          case 25: imageSource = require('../../../assets/images/croquis/25.png'); break;
          case 26: imageSource = require('../../../assets/images/croquis/26.png'); break;
          default: console.log("No image for case ID:", caseId);
        }
        
        return (
          <View style={tw`mt-2`}>
            <Text style={tw`text-gray-600 font-[OutfitM] mb-1`}>Cas type sélectionné: Cas {caseId}</Text>
            {imageSource ? (
              <Image 
                source={imageSource} 
                style={tw`w-full h-40 rounded-lg`}
                resizeMode="contain"
              />
            ) : (
              <Text style={tw`text-red-500`}>Image non disponible pour le cas {caseId}</Text>
            )}
            <Text style={tw`text-gray-600 font-[OutfitR] mt-1`}>{constatState.sketchTemplate.description}</Text>
            <Text style={tw`text-gray-600 font-[OutfitR] mt-1`}>Responsabilité: {constatState.sketchTemplate.responsibility}</Text>
          </View>
        );
      } catch (error) {
        console.error("Error loading template image:", error);
        return (
          <View style={tw`mt-2`}>
            <Text style={tw`text-gray-600 font-[OutfitM] mb-1`}>Cas type sélectionné: Cas {caseId}</Text>
            <Text style={tw`text-red-500`}>Erreur de chargement de l'image</Text>
            <Text style={tw`text-gray-600 font-[OutfitR] mt-1`}>{constatState.sketchTemplate.description}</Text>
            <Text style={tw`text-gray-600 font-[OutfitR] mt-1`}>Responsabilité: {constatState.sketchTemplate.responsibility}</Text>
          </View>
        );
      }
    }
    
    // If no sketch or template, show a message
    return (
      <Text style={tw`text-gray-500 font-[OutfitR]`}>Aucun croquis disponible</Text>
    );
  };
  
  // Helper function to render impact points
  const renderImpactPoints = (isVehicleA) => {
    // Try to get impact points from store
    let impactPoints = isVehicleA ? constatState.vehicleAImpactPoints : constatState.vehicleBImpactPoints;
    
    // If not available in store, try to extract from observations (our workaround)
    if (!impactPoints) {
      const observations = isVehicleA ? constatState.vehicleAObservations : constatState.vehicleBObservations;
      if (observations && observations.includes('[[IMPACT_POINTS:')) {
        try {
          const marker = '[[IMPACT_POINTS:';
          const markerEnd = ']]';
          const start = observations.indexOf(marker) + marker.length;
          const end = observations.indexOf(markerEnd, start);
          const pointsJSON = observations.substring(start, end);
          impactPoints = JSON.parse(pointsJSON);
        } catch (e) {
          console.error('Error parsing impact points from observations:', e);
        }
      }
    }
    
    if (!impactPoints || !Array.isArray(impactPoints) || impactPoints.length === 0) {
      return (
        <Text style={tw`text-gray-500 font-[OutfitR]`}>Aucun point d'impact indiqué</Text>
      );
    }
    
    return (
      <View style={tw`relative mt-2`}>
        <Image 
          source={require('../../../assets/images/car-diagram.png')} 
          style={tw`w-full h-48`}
          resizeMode="contain"
        />
        
        {impactPoints.map((point, index) => (
          <View 
            key={index}
            style={[
              tw`absolute w-7 h-7 bg-red-500 rounded-full items-center justify-center`,
              { left: point.x - 14, top: point.y - 14 }
            ]}
          >
            <Ionicons name="close" size={20} color="white" />
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <ScrollView style={tw`bg-white rounded-lg p-6 shadow-sm`}>
      <Text style={[tw`text-xl font-[OutfitB] mb-6 text-center`,{fontFamily:'OutfitB'}]}>
        Récapitulatif du constat
      </Text>
      
      {/* Title of the constat if available */}
      {constatState.title && (
        <Text style={[tw`text-lg font-[OutfitM] mb-4 text-center text-gray-700`,{fontFamily:'OutfitB'}]   }>
          {constatState.title}
        </Text>
      )}
      
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
      
      {/* Add point of impact for Vehicle A */}
      {renderNumberedSection('10', 'Point de choc initial', (
        <>
          {renderImpactPoints(true)}
        </>
      ))}
      
      {renderNumberedSection('11', 'Dégâts apparents', (
        <>
          {renderDamages(constatState.vehicleADamages)}
        </>
      ))}
      
      {/* Add circumstances for Vehicle A */}
      {renderNumberedSection('12', 'Circonstances', (
        <>
          {constatState.vehicleACircumstances && Array.isArray(constatState.vehicleACircumstances) && constatState.vehicleACircumstances.length > 0 ? (
            renderCircumstances(constatState.vehicleACircumstances)
          ) : (
            <Text style={tw`text-gray-500 font-[OutfitR]`}>Aucune circonstance sélectionnée</Text>
          )}
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
          
          {/* Add point of impact for Vehicle B */}
          {renderNumberedSection('10', 'Point de choc initial', (
            <>
              {renderImpactPoints(false)}
            </>
          ))}
          
          {renderNumberedSection('11', 'Dégâts apparents', (
            <>
              {renderDamages(constatState.vehicleBDamages)}
            </>
          ))}
          
          {/* Add circumstances for Vehicle B */}
          {renderNumberedSection('12', 'Circonstances', (
            <>
              {constatState.vehicleBCircumstances && Array.isArray(constatState.vehicleBCircumstances) && constatState.vehicleBCircumstances.length > 0 ? (
                renderCircumstances(constatState.vehicleBCircumstances)
              ) : (
                <Text style={tw`text-gray-500 font-[OutfitR]`}>Aucune circonstance sélectionnée</Text>
              )}
            </>
          ))}
          
          {renderNumberedSection('14', 'Observations', (
            <>
              {renderField('Observations', constatState.vehicleBObservations)}
            </>
          ))}
        </>
      )}
      
      {/* Sketch section */}
      {renderNumberedSection('13', 'Croquis de l\'accident', (
        <>
          {renderSketch()}
        </>
      ))}
      
      <Text style={[tw`text-gray-500 text-center mt-4 font-[OutfitR] pb-10`,{fontFamily:'OutfitB'}]}>
        Vérifiez toutes les informations avant de soumettre le constat.
      </Text>
      
      {/* Add the PDF generation button */}
      {/* <View style={tw`items-center mt-4 mb-8`}>
        <GeneratePDFButton />
      </View> */}
    </ScrollView>
  );
} 