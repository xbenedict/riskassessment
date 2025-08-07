// Debug script to test ComprehensiveAssessments import
import { comprehensiveAssessments } from './src/services/ComprehensiveAssessments.js';

console.log('Testing ComprehensiveAssessments import...');
console.log('Available site IDs:', Object.keys(comprehensiveAssessments));

for (const [siteId, assessments] of Object.entries(comprehensiveAssessments)) {
  console.log(`Site ${siteId}: ${assessments.length} assessments`);
  if (assessments.length !== 10) {
    console.warn(`⚠️  Site ${siteId} has ${assessments.length} assessments instead of 10!`);
  }
}

console.log('\nTotal assessments:', Object.values(comprehensiveAssessments).reduce((sum, assessments) => sum + assessments.length, 0));