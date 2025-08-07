// Clear localStorage data to force regeneration
console.log('Clearing localStorage data...');

// Clear the specific keys used by DataManager
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('heritage_risk_assessments');
  localStorage.removeItem('heritage_sites');
  console.log('✅ Cleared heritage_risk_assessments and heritage_sites from localStorage');
} else {
  console.log('localStorage not available in this environment');
}

console.log('Data cleared. Refresh the application to regenerate initial data.');