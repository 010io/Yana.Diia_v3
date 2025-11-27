/**
 * Requirement Loader - Parses requirements.md and converts to structured data
 * 
 * This module reads the requirements specification and creates
 * Requirement objects for use in the audit system.
 */

import { Requirement, AcceptanceCriterion, RequirementCategory } from './types';

/**
 * Load requirements from requirements.md content
 */
export function parseRequirements(markdownContent: string): Requirement[] {
  const requirements: Requirement[] = [];
  
  // Split by requirement sections (## Requirement N)
  const requirementSections = markdownContent.split(/## Requirement \d+/);
  
  // Skip the first section (introduction/glossary)
  for (let i = 1; i < requirementSections.length; i++) {
    const section = requirementSections[i];
    const requirement = parseRequirementSection(section, i);
    if (requirement) {
      requirements.push(requirement);
    }
  }
  
  return requirements;
}

/**
 * Parse a single requirement section
 */
function parseRequirementSection(section: string, index: number): Requirement | null {
  const lines = section.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return null;
  
  // Extract user story
  const userStoryMatch = section.match(/\*\*User Story:\*\* (.+)/);
  const userStory = userStoryMatch ? userStoryMatch[1] : '';
  
  // Extract title from user story or use default
  const title = extractTitleFromUserStory(userStory) || `Requirement ${index}`;
  
  // Extract acceptance criteria
  const acceptanceCriteria = parseAcceptanceCriteria(section, index);
  
  // Determine category based on content
  const category = determineCategory(title, userStory, acceptanceCriteria);
  
  return {
    id: `req-${index}`,
    title,
    userStory,
    acceptanceCriteria,
    category,
  };
}

/**
 * Extract title from user story
 */
function extractTitleFromUserStory(userStory: string): string {
  // Extract the "I want [feature]" part
  const match = userStory.match(/I want (.+?),/);
  return match ? match[1] : '';
}

/**
 * Parse acceptance criteria from section
 */
function parseAcceptanceCriteria(section: string, requirementIndex: number): AcceptanceCriterion[] {
  const criteria: AcceptanceCriterion[] = [];
  
  // Find acceptance criteria section
  const criteriaMatch = section.match(/#### Acceptance Criteria\s+([\s\S]+?)(?=\n##|$)/);
  if (!criteriaMatch) return criteria;
  
  const criteriaText = criteriaMatch[1];
  
  // Match numbered criteria (1. WHEN... or 1. THE...)
  const criteriaMatches = criteriaText.matchAll(/(\d+)\.\s+(.+?)(?=\n\d+\.|$)/gs);
  
  let criterionIndex = 1;
  for (const match of criteriaMatches) {
    const description = match[2].trim();
    
    criteria.push({
      id: `req-${requirementIndex}-criterion-${criterionIndex}`,
      requirementId: `req-${requirementIndex}`,
      description,
      testable: isTestable(description),
    });
    
    criterionIndex++;
  }
  
  return criteria;
}

/**
 * Determine if a criterion is testable
 */
function isTestable(description: string): boolean {
  // Criteria with WHEN, IF, WHILE, WHERE are typically testable
  const testableKeywords = ['WHEN', 'IF', 'WHILE', 'WHERE', 'THE', 'SHALL'];
  return testableKeywords.some(keyword => description.includes(keyword));
}

/**
 * Determine requirement category based on content
 */
function determineCategory(
  title: string,
  userStory: string,
  criteria: AcceptanceCriterion[]
): RequirementCategory {
  const content = `${title} ${userStory} ${criteria.map(c => c.description).join(' ')}`.toLowerCase();
  
  if (content.includes('ukrainian') || content.includes('nlp') || content.includes('prompt')) {
    return RequirementCategory.NLP;
  }
  if (content.includes('design system') || content.includes('component') || content.includes('whitelist')) {
    return RequirementCategory.DesignSystem;
  }
  if (content.includes('visual') || content.includes('constructor') || content.includes('drag')) {
    return RequirementCategory.VisualConstructor;
  }
  if (content.includes('flow generation') || content.includes('variant')) {
    return RequirementCategory.AIFlowGeneration;
  }
  if (content.includes('judge') || content.includes('evaluation') || content.includes('scoring')) {
    return RequirementCategory.JudgeModule;
  }
  if (content.includes('export') || content.includes('jsx') || content.includes('figma')) {
    return RequirementCategory.Export;
  }
  if (content.includes('yana') || content.includes('collaboration') || content.includes('agent')) {
    return RequirementCategory.Collaboration;
  }
  if (content.includes('registry') || content.includes('api')) {
    return RequirementCategory.RegistryAPI;
  }
  if (content.includes('accessibility') || content.includes('wcag') || content.includes('contrast')) {
    return RequirementCategory.Accessibility;
  }
  if (content.includes('performance') || content.includes('load time')) {
    return RequirementCategory.Performance;
  }
  if (content.includes('debate') || content.includes('persona')) {
    return RequirementCategory.AIDebate;
  }
  if (content.includes('version') || content.includes('history')) {
    return RequirementCategory.VersionControl;
  }
  
  // Default to Performance if unclear
  return RequirementCategory.Performance;
}

/**
 * Load requirements from file path
 */
export async function loadRequirementsFromFile(filePath: string): Promise<Requirement[]> {
  const fs = await import('fs/promises');
  const content = await fs.readFile(filePath, 'utf-8');
  return parseRequirements(content);
}
