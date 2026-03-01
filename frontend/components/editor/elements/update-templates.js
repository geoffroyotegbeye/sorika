/**
 * Script pour ajouter automatiquement les data-template-id aux templates existants
 * 
 * Ce script met à jour tous les templates pour ajouter l'attribut data-template-id
 * nécessaire à la détection des blocs par le système de propriétés.
 */

const fs = require('fs');
const path = require('path');

// Mapping des templates et leurs IDs
const TEMPLATE_MAPPINGS = {
  // Hero templates
  'hero-templates.ts': [
    { id: 'hero-centered', pattern: /id: 'hero-centered'/ },
    { id: 'hero-split', pattern: /id: 'hero-split'/ },
    { id: 'hero-gradient-dark', pattern: /id: 'hero-gradient-dark'/ }
  ],
  
  // Banner templates
  'banner-templates.ts': [
    { id: 'banner-announcement', pattern: /id: 'banner-announcement'/ }
  ],
  
  // Blog templates
  'blog-templates.ts': [
    { id: 'blog-grid-3', pattern: /id: 'blog-grid-3'/ }
  ],
  
  // Contact templates
  'contact-templates.ts': [
    { id: 'contact-split', pattern: /id: 'contact-split'/ },
    { id: 'contact-newsletter', pattern: /id: 'contact-newsletter'/ }
  ],
  
  // CTA templates
  'cta-templates.ts': [
    { id: 'cta-centered', pattern: /id: 'cta-centered'/ },
    { id: 'cta-split', pattern: /id: 'cta-split'/ }
  ],
  
  // Features templates
  'features-templates.ts': [
    { id: 'features-3-cols', pattern: /id: 'features-3-cols'/ }
  ],
  
  // Footer templates
  'footer-templates.ts': [
    { id: 'footer-full', pattern: /id: 'footer-full'/ },
    { id: 'footer-minimal', pattern: /id: 'footer-minimal'/ }
  ],
  
  // Gallery templates
  'gallery-templates.ts': [
    { id: 'gallery-grid-4', pattern: /id: 'gallery-grid-4'/ }
  ],
  
  // Pricing templates
  'pricing-templates.ts': [
    { id: 'pricing-3-cards', pattern: /id: 'pricing-3-cards'/ }
  ],
  
  // Team templates
  'team-templates.ts': [
    { id: 'team-grid', pattern: /id: 'team-grid'/ }
  ],
  
  // Testimonials templates
  'testimonials-templates.ts': [
    { id: 'testimonials-grid', pattern: /id: 'testimonials-grid'/ }
  ]
};

function updateTemplate(filePath, templateId) {
  console.log(`Updating ${filePath} for template ${templateId}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern pour trouver le template avec cet ID
  const templatePattern = new RegExp(
    `(\\s*id: '${templateId}',[\\s\\S]*?template: {[\\s\\S]*?)(type: '[^']+',\\s*tag: '[^']+',)(\\s*)`,
    'g'
  );
  
  // Remplacer pour ajouter l'attribut data-template-id
  content = content.replace(templatePattern, (match, before, typeTag, after) => {
    // Vérifier si data-template-id existe déjà
    if (match.includes('data-template-id')) {
      console.log(`  - Template ${templateId} already has data-template-id`);
      return match;
    }
    
    console.log(`  - Adding data-template-id to ${templateId}`);
    return `${before}${typeTag}${after}attributes: {
        'data-template-id': '${templateId}'
      },${after}`;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
}

function main() {
  const templatesDir = path.join(__dirname, 'templates');
  
  console.log('🚀 Starting template update process...\n');
  
  for (const [fileName, templates] of Object.entries(TEMPLATE_MAPPINGS)) {
    const filePath = path.join(templatesDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File ${fileName} not found, skipping...`);
      continue;
    }
    
    console.log(`📝 Processing ${fileName}:`);
    
    for (const template of templates) {
      try {
        updateTemplate(filePath, template.id);
      } catch (error) {
        console.error(`❌ Error updating ${template.id}:`, error.message);
      }
    }
    
    console.log('');
  }
  
  console.log('✅ Template update process completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Review the updated template files');
  console.log('2. Test the block property system');
  console.log('3. Verify that data-template-id attributes are correctly added');
}

if (require.main === module) {
  main();
}

module.exports = { updateTemplate, TEMPLATE_MAPPINGS };