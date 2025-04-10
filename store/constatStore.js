import { create } from 'zustand';

export const useConstatStore = create((set, get) => ({
  // Basic information
  vehicleCount: null,
  setVehicleCount: (count) => set({ vehicleCount: count }),
  
  title: '',
  setTitle: (title) => set({ title }),
  
  accidentDate: '',
  setAccidentDate: (date) => set({ accidentDate: date }),
  
  accidentTime: '',
  setAccidentTime: (time) => set({ accidentTime: time }),
  
  accidentLocation: '',
  setAccidentLocation: (location) => set({ accidentLocation: location }),
  
  hasInjuries: null,
  setHasInjuries: (value) => set({ hasInjuries: value }),
  
  hasMaterialDamage: null,
  setHasMaterialDamage: (value) => set({ hasMaterialDamage: value }),
  
  witnesses: '',
  setWitnesses: (witnesses) => set({ witnesses }),
  
  // Document images
  vehicleAIdCard: null,
  setVehicleAIdCard: (image) => set({ vehicleAIdCard: image }),
  
  vehicleARegistration: null,
  setVehicleARegistration: (image) => set({ vehicleARegistration: image }),
  
  vehicleAInsuranceCard: null,
  setVehicleAInsuranceCard: (image) => set({ vehicleAInsuranceCard: image }),
  
  vehicleBIdCard: null,
  setVehicleBIdCard: (image) => set({ vehicleBIdCard: image }),
  
  vehicleBRegistration: null,
  setVehicleBRegistration: (image) => set({ vehicleBRegistration: image }),
  
  vehicleBInsuranceCard: null,
  setVehicleBInsuranceCard: (image) => set({ vehicleBInsuranceCard: image }),
  
  // Vehicle A information
  vehicleAMake: '',
  setVehicleAMake: (make) => set({ vehicleAMake: make }),
  
  vehicleAModel: '',
  setVehicleAModel: (model) => set({ vehicleAModel: model }),
  
  vehicleAPlate: '',
  setVehicleAPlate: (plate) => set({ vehicleAPlate: plate }),
  
  vehicleAInsurance: '',
  setVehicleAInsurance: (insurance) => {
    // console.log('Setting vehicle A insurance:', insurance);
    set((state) => {
      // console.log('Previous state:', state.vehicleAInsurance);
      // console.log('New state:', insurance);
      return { vehicleAInsurance: insurance };
    });
  },
  
  vehicleAInsurancePolicy: '',
  setVehicleAInsurancePolicy: (policy) => {
    // console.log('Setting vehicle A policy:', policy);
    set((state) => {
      // console.log('Previous state:', state.vehicleAInsurancePolicy);
      // console.log('New state:', policy);
      return { vehicleAInsurancePolicy: policy };
    });
  },
  
  vehicleAAgency: '',
  setVehicleAAgency: (agency) => set({ vehicleAAgency: agency }),
  
  vehicleACertificateValidFrom: '',
  setVehicleACertificateValidFrom: (date) => {
    // console.log('Setting vehicle A valid from:', date);
    set((state) => {
      // console.log('Previous state:', state.vehicleACertificateValidFrom);
      // console.log('New state:', date);
      return { vehicleACertificateValidFrom: date };
    });
  },
  
  vehicleACertificateValidTo: '',
  setVehicleACertificateValidTo: (date) => {
    // console.log('Setting vehicle A valid to:', date);
    set((state) => {
      // console.log('Previous state:', state.vehicleACertificateValidTo);
      // console.log('New state:', date);
      return { vehicleACertificateValidTo: date };
    });
  },
  
  vehicleADamages: '',
  setVehicleADamages: (damages) => set({ vehicleADamages: damages }),
  
  vehicleADirection: '',
  setVehicleADirection: (direction) => set({ vehicleADirection: direction }),
  
  vehicleAFrom: '',
  setVehicleAFrom: (from) => set({ vehicleAFrom: from }),
  
  vehicleATo: '',
  setVehicleATo: (to) => set({ vehicleATo: to }),
  
  vehicleAObservations: '',
  setVehicleAObservations: (observations) => set({ vehicleAObservations: observations }),
  
  vehicleAImages: null,
  setVehicleAImages: (images) => set({ vehicleAImages: images }),
  
  // Driver A information
  driverAName: '',
  setDriverAName: (name) => set({ driverAName: name }),
  
  driverAFirstName: '',
  setDriverAFirstName: (firstName) => set({ driverAFirstName: firstName }),
  
  driverAAddress: '',
  setDriverAAddress: (address) => set({ driverAAddress: address }),
  
  driverAPhone: '',
  setDriverAPhone: (phone) => set({ driverAPhone: phone }),
  
  driverALicense: '',
  setDriverALicense: (license) => set({ driverALicense: license }),
  
  driverALicenseDate: '',
  setDriverALicenseDate: (date) => set({ driverALicenseDate: date }),
  
  // Vehicle B information
  vehicleBMake: '',
  setVehicleBMake: (make) => set({ vehicleBMake: make }),
  
  vehicleBModel: '',
  setVehicleBModel: (model) => set({ vehicleBModel: model }),
  
  vehicleBPlate: '',
  setVehicleBPlate: (plate) => set({ vehicleBPlate: plate }),
  
  vehicleBInsurance: '',
  setVehicleBInsurance: (insurance) => set({ vehicleBInsurance: insurance }),
  
  vehicleBInsurancePolicy: '',
  setVehicleBInsurancePolicy: (policy) => set({ vehicleBInsurancePolicy: policy }),
  
  vehicleBAgency: '',
  setVehicleBAgency: (agency) => set({ vehicleBAgency: agency }),
  
  vehicleBCertificateValidFrom: '',
  setVehicleBCertificateValidFrom: (date) => set({ vehicleBCertificateValidFrom: date }),
  
  vehicleBCertificateValidTo: '',
  setVehicleBCertificateValidTo: (date) => set({ vehicleBCertificateValidTo: date }),
  
  vehicleBDamages: '',
  setVehicleBDamages: (damages) => set({ vehicleBDamages: damages }),
  
  vehicleBDirection: '',
  setVehicleBDirection: (direction) => set({ vehicleBDirection: direction }),
  
  vehicleBFrom: '',
  setVehicleBFrom: (from) => set({ vehicleBFrom: from }),
  
  vehicleBTo: '',
  setVehicleBTo: (to) => set({ vehicleBTo: to }),
  
  vehicleBObservations: '',
  setVehicleBObservations: (observations) => set({ vehicleBObservations: observations }),
  
  vehicleBImages: null,
  setVehicleBImages: (images) => set({ vehicleBImages: images }),
  
  // Driver B information
  driverBName: '',
  setDriverBName: (name) => set({ driverBName: name }),
  
  driverBFirstName: '',
  setDriverBFirstName: (firstName) => set({ driverBFirstName: firstName }),
  
  driverBAddress: '',
  setDriverBAddress: (address) => set({ driverBAddress: address }),
  
  driverBPhone: '',
  setDriverBPhone: (phone) => set({ driverBPhone: phone }),
  
  driverBLicense: '',
  setDriverBLicense: (license) => set({ driverBLicense: license }),
  
  driverBLicenseDate: '',
  setDriverBLicenseDate: (date) => set({ driverBLicenseDate: date }),
  
  // Sketch information
  sketchNotes: '',
  setSketchNotes: (notes) => set({ sketchNotes: notes }),
  
  sketchImage: null,
  setSketchImage: (image) => set({ sketchImage: image }),
  
  // Add sketch template information
  sketchTemplate: null,
  setSketchTemplate: (template) => set({ sketchTemplate: template }),
  
  // Add sketch paths for saving drawing state
  sketchPaths: [],
  setSketchPaths: (paths) => set({ sketchPaths: paths }),
  
  // Add new state properties for insurance info
  vehicleAInsuranceInfo: null,
  vehicleBInsuranceInfo: null,
  
  // Add new setter functions
  setVehicleAInsuranceInfo: (info) => set({
    vehicleAInsurance: info.company || '',
    vehicleAInsurancePolicy: info.policyNumber || '',
    vehicleACertificateValidFrom: info.validFrom || '',
    vehicleACertificateValidTo: info.validUntil || '',
    // You can add the insuredName if you have a field for it
    // vehicleAInsuredName: info.insuredName || ''
  }),
  setVehicleBInsuranceInfo: (info) => set({
    vehicleBInsurance: info.company || '',
    vehicleBInsurancePolicy: info.policyNumber || '',
    vehicleBCertificateValidFrom: info.validFrom || '',
    vehicleBCertificateValidTo: info.validUntil || '',
    // You can add the insuredName if you have a field for it
    // vehicleBInsuredName: info.insuredName || ''
  }),
  
  // Add driver info state and setters
  vehicleADriverInfo: null,
  vehicleBDriverInfo: null,
  setVehicleADriverInfo: (info) => set({ 
    driverAName: info.lastName || '',
    driverAFirstName: info.firstName || '',
    driverALicense: info.licenseNumber || '',
    driverALicenseDate: info.dateOfBirth || ''
  }),
  setVehicleBDriverInfo: (info) => set({ 
    driverBName: info.lastName,
    driverBFirstName: info.firstName,
    driverBLicense: info.licenseNumber,
    driverBLicenseDate: info.dateOfBirth
  }),

  // Add vehicle info setters
  setVehicleAVehicleInfo: (info) => set({
    vehicleAPlate: info.licensePlate || '',
    vehicleAMake: info.make || '',
    vehicleAModel: info.model || ''
  }),
  setVehicleBVehicleInfo: (info) => set({
    vehicleBPlate: info.licensePlate || '',
    vehicleBMake: info.make || '',
    vehicleBModel: info.model || ''
  }),
  
  // Add these properties to your store
  vehicleAImpactPoint: null,
  setVehicleAImpactPoint: (point) => set({ vehicleAImpactPoint: point }),

  vehicleBImpactPoint: null,
  setVehicleBImpactPoint: (point) => set({ vehicleBImpactPoint: point }),
  
  // Add these new state variables and setters to your constatStore
  vehicleACircumstances: null,
  setVehicleACircumstances: (circumstances) => set({ vehicleACircumstances: circumstances }),

  vehicleBCircumstances: null,
  setVehicleBCircumstances: (circumstances) => set({ vehicleBCircumstances: circumstances }),

  // Insured person information (Section 8)
  insuredAName: '',
  setInsuredAName: (name) => set({ insuredAName: name }),

  insuredAFirstName: '',
  setInsuredAFirstName: (firstName) => set({ insuredAFirstName: firstName }),

  insuredAAddress: '',
  setInsuredAAddress: (address) => set({ insuredAAddress: address }),

  insuredAPhone: '',
  setInsuredAPhone: (phone) => set({ insuredAPhone: phone }),

  // Vehicle B insured person
  insuredBName: '',
  setInsuredBName: (name) => set({ insuredBName: name }),

  insuredBFirstName: '',
  setInsuredBFirstName: (firstName) => set({ insuredBFirstName: firstName }),

  insuredBAddress: '',
  setInsuredBAddress: (address) => set({ insuredBAddress: address }),

  insuredBPhone: '',
  setInsuredBPhone: (phone) => set({ insuredBPhone: phone }),



   // Add these new properties and setters
   vehicleAImpactPoints: [],
   vehicleBImpactPoints: [],
   
   setVehicleAImpactPoints: (points) => set({ vehicleAImpactPoints: points }),
   setVehicleBImpactPoints: (points) => set({ vehicleBImpactPoints: points }),
   

    // New state for signatures
  signatureA: null,
  signatureB: null,
  
  // Functions to set signatures
  setSignatureA: (signature) => set({ signatureA: signature }),
  setSignatureB: (signature) => set({ signatureB: signature }),
  

  // Reset all state
  resetState: () => set({
    vehicleCount: null,
    title: '',
    accidentDate: '',
    accidentTime: '',
    accidentLocation: '',
    hasInjuries: null,
    hasMaterialDamage: null,
    witnesses: '',
    vehicleAImages: null,
    vehicleBImages: null,
    sketchImage: null,
    sketchTemplate: null,
    sketchPaths: [],
    // Reset all other fields
    // ...
    vehicleAImpactPoint: null,
    vehicleBImpactPoint: null,
    vehicleACircumstances: null,
    vehicleBCircumstances: null,
    signatureA: null,
    signatureB: null,
    
  })
}));