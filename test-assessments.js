// Test script to verify that each site gets 10 risk assessments
import { DataManager } from './src/services/DataManager.js';

async function testAssessments() {
  try {
    // Clear existing data to start fresh
    await DataManager.clearAllData();
    
    // Get all sites
    const sites = await DataManager.getHeritageSites();
    console.log(`Found ${sites.length} heritage sites`);
    
    // Check assessments for each site
    for (const site of sites) {
      const assessments = await DataManager.getAssessmentsForSite(site.id);
      console.log(`Site "${site.name}" (ID: ${site.id}): ${assessments.length} assessments`);
      
      if (assessments.length !== 10) {
        console.warn(`⚠️  Site ${site.name} has ${assessments.length} assessments instead of 10!`);
      } else {
        console.log(`✅ Site ${site.name} has exactly 10 assessments`);
      }
    }
    
    // Get total assessments
    const allAssessments = await DataManager.getAllAssessments();
    console.log(`\nTotal assessments across all sites: ${allAssessments.length}`);
    console.log(`Expected: ${sites.length * 10} (${sites.length} sites × 10 assessments each)`);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAssessments();