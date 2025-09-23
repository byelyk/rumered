#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const applicationsDir = path.join(process.cwd(), 'applications');

function listApplications() {
  console.log('📋 Room Applications\n');
  
  if (!fs.existsSync(applicationsDir)) {
    console.log('No applications directory found.');
    return;
  }

  const files = fs.readdirSync(applicationsDir)
    .filter(file => file.endsWith('.json'))
    .sort((a, b) => {
      const statA = fs.statSync(path.join(applicationsDir, a));
      const statB = fs.statSync(path.join(applicationsDir, b));
      return statB.mtime - statA.mtime; // Sort by newest first
    });

  if (files.length === 0) {
    console.log('No applications found.');
    return;
  }

  files.forEach((file, index) => {
    try {
      const filePath = path.join(applicationsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      console.log(`${index + 1}. ${data.fullName || 'Anonymous'}`);
      console.log(`   📧 Email: ${data.email || 'Not provided'}`);
      console.log(`   🏠 Room: ${data.hallName || 'Unknown'} - ${data.roomNumber || 'N/A'}`);
      console.log(`   🏫 School: ${data.school || 'Not specified'}`);
      console.log(`   📅 Submitted: ${new Date(data.submittedAt).toLocaleString()}`);
      console.log(`   📄 Status: ${data.status || 'PENDING'}`);
      console.log(`   📝 Description: ${data.description ? data.description.substring(0, 100) + '...' : 'No description'}`);
      console.log(`   📁 File: ${file}`);
      console.log('');
    } catch (error) {
      console.log(`❌ Error reading ${file}: ${error.message}`);
    }
  });
}

function viewApplication(fileName) {
  const filePath = path.join(applicationsDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Application file not found: ${fileName}`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log('📋 Application Details\n');
    console.log(`ID: ${data.id}`);
    console.log(`Name: ${data.fullName || 'Anonymous'}`);
    console.log(`Email: ${data.email || 'Not provided'}`);
    console.log(`Phone: ${data.phoneNumber || 'Not provided'}`);
    console.log(`Hall: ${data.hallName || 'Not specified'}`);
    console.log(`Room: ${data.roomNumber || 'Not specified'}`);
    console.log(`Campus: ${data.campus || 'Not specified'}`);
    console.log(`School: ${data.school || 'Not specified'}`);
    console.log(`Year: ${data.academicYear || 'Not specified'}`);
    console.log(`Status: ${data.status || 'PENDING'}`);
    console.log(`Submitted: ${new Date(data.submittedAt).toLocaleString()}`);
    console.log(`\nDescription:\n${data.description || 'No description provided'}`);
    console.log(`\nPhotos:\n${data.photoUrls ? data.photoUrls.join('\n') : 'No photos provided'}`);
  } catch (error) {
    console.log(`❌ Error reading application: ${error.message}`);
  }
}

function updateStatus(fileName, newStatus) {
  const filePath = path.join(applicationsDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Application file not found: ${fileName}`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.status = newStatus.toUpperCase();
    data.updatedAt = new Date().toISOString();
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Status updated to ${newStatus.toUpperCase()} for ${data.fullName || 'Anonymous'}`);
  } catch (error) {
    console.log(`❌ Error updating status: ${error.message}`);
  }
}

function deleteApplication(fileName) {
  const filePath = path.join(applicationsDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Application file not found: ${fileName}`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    fs.unlinkSync(filePath);
    console.log(`🗑️  Deleted application for ${data.fullName || 'Anonymous'}`);
  } catch (error) {
    console.log(`❌ Error deleting application: ${error.message}`);
  }
}

// Command line interface
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'list':
  case 'ls':
    listApplications();
    break;
    
  case 'view':
  case 'show':
    if (!arg) {
      console.log('❌ Please provide a filename. Usage: node view-applications.js view <filename>');
      process.exit(1);
    }
    viewApplication(arg);
    break;
    
  case 'approve':
    if (!arg) {
      console.log('❌ Please provide a filename. Usage: node view-applications.js approve <filename>');
      process.exit(1);
    }
    updateStatus(arg, 'APPROVED');
    break;
    
  case 'reject':
    if (!arg) {
      console.log('❌ Please provide a filename. Usage: node view-applications.js reject <filename>');
      process.exit(1);
    }
    updateStatus(arg, 'REJECTED');
    break;
    
  case 'delete':
  case 'rm':
    if (!arg) {
      console.log('❌ Please provide a filename. Usage: node view-applications.js delete <filename>');
      process.exit(1);
    }
    deleteApplication(arg);
    break;
    
  default:
    console.log('📋 Room Application Manager\n');
    console.log('Usage:');
    console.log('  node view-applications.js list                    - List all applications');
    console.log('  node view-applications.js view <filename>         - View specific application');
    console.log('  node view-applications.js approve <filename>      - Approve application');
    console.log('  node view-applications.js reject <filename>       - Reject application');
    console.log('  node view-applications.js delete <filename>       - Delete application');
    console.log('\nExamples:');
    console.log('  node view-applications.js list');
    console.log('  node view-applications.js view application_123_1234567890.json');
    console.log('  node view-applications.js approve application_123_1234567890.json');
}
