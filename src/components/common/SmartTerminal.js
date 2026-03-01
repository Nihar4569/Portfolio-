import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { useTerminal } from '../../context/TerminalContext';
import { useSound } from '../../context/SoundContext';
import { useNavigate } from 'react-router-dom';

// Import data
import skills from '../../data/skills';
import projects from '../../data/projects';

// Import contact service
import { sendContactMessage } from '../../services/contactService';

// ==================== TYPO CORRECTION & FUZZY MATCHING ====================

// Calculate Levenshtein distance between two strings
const levenshteinDistance = (str1, str2) => {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1;
      }
    }
  }
  return dp[m][n];
};

// Find best match from a list of commands
const findBestMatch = (input, commands, threshold = 2) => {
  let bestMatch = null;
  let bestDistance = Infinity;
  
  const inputLower = input.toLowerCase().trim();
  
  // Don't match if input is too short or is a number
  if (inputLower.length < 3 || /^\d+$/.test(inputLower)) {
    return null;
  }
  
  for (const cmd of commands) {
    const distance = levenshteinDistance(inputLower, cmd.toLowerCase());
    // Only match if distance is proportionally small relative to word length
    const maxAllowedDistance = Math.min(threshold, Math.floor(cmd.length / 3));
    if (distance < bestDistance && distance <= maxAllowedDistance && distance > 0) {
      bestDistance = distance;
      bestMatch = cmd;
    }
  }
  
  return bestMatch;
};

// Common command variations and typos mapping
const commandAliases = {
  // About variations
  'about': ['abut', 'abot', 'aboit', 'abuot', 'abour', 'abou', 'abbout', 'baout', 'avout', 'sbout', 'qbout', 'aboutt', 'aboute', 'abount'],
  // Skills variations
  'skills': ['skils', 'skill', 'skilss', 'skils', 'sklls', 'skiils', 'skillz', 'skilla', 'skllls', 'sills', 'skikls', 'skilsl'],
  // Projects variations
  'projects': ['project', 'projcts', 'projetcs', 'projexts', 'porjects', 'prjects', 'projectss', 'projetc', 'projct', 'projecrs', 'projwcts'],
  // Contact variations
  'contact': ['contac', 'contct', 'contat', 'conatct', 'contacr', 'contakt', 'contsct', 'cntact', 'kontact', 'contect', 'conract'],
  // Experience variations
  'experience': ['experince', 'expereince', 'exprience', 'experiance', 'experienc', 'expirience', 'experence', 'experiense', 'experiwnce'],
  // Education variations
  'education': ['educaton', 'educaiton', 'eductaion', 'educatoin', 'eduaction', 'educashun', 'educaion', 'eudcation'],
  // Help variations
  'help': ['hlep', 'halp', 'hepl', 'helpp', 'jelp', 'hwlp', 'hekp'],
  // Social variations
  'social': ['socail', 'soical', 'socal', 'scoial', 'sociaal', 'sociel', 'sosial'],
  // Theme variations
  'theme': ['tehme', 'themee', 'theem', 'thene', 'rtheme'],
  // Send message variations
  'send message': ['send msg', 'sendmessage', 'sned message', 'send mesage', 'senf message', 'send messsage', 'sed message', 'send massge'],
  // Clear variations
  'clear': ['cler', 'claer', 'clera', 'clearr', 'clrar', 'clesr'],
  // Navigation variations
  'go home': ['gohome', 'go hom', 'go hme', 'go homee', 'gp home'],
  'go projects': ['goprojects', 'go project', 'go projets', 'go projectss'],
  'go contact': ['gocontact', 'go contct', 'go contac', 'go conatct'],
  'go albums': ['goalbums', 'go album', 'go albms', 'go albuns'],
  // Greetings - only clear typos, not numbers
  'hello': ['helo', 'hllo', 'helllo', 'hellp', 'jello', 'hwllo', 'gello'],
  'hey': ['heyy', 'heey', 'hye']
};

// Get corrected command - only for clear typos
const correctTypo = (input) => {
  const inputLower = input.toLowerCase().trim();
  
  // Never correct numbers - they might be project selections
  if (/^\d+$/.test(inputLower)) {
    return input;
  }
  
  // Never correct short inputs (1-2 chars) to avoid false matches
  if (inputLower.length <= 2) {
    return input;
  }
  
  // Check direct aliases first
  for (const [correct, typos] of Object.entries(commandAliases)) {
    if (typos.includes(inputLower)) {
      return correct;
    }
  }
  
  // Use fuzzy matching for remaining cases - but be strict
  const allCommands = Object.keys(commandAliases);
  const match = findBestMatch(inputLower, allCommands, 2);
  return match || input;
};

// Natural language understanding - extract intent from sentences
const understandIntent = (input) => {
  const lower = input.toLowerCase().trim();
  
  // Project-related intents
  if (/show\s*(me\s*)?(his\s*|your\s*|nihar'?s?\s*)?(all\s*)?(project|work|portfolio)/i.test(lower) ||
      /what\s*(are\s*)?(his\s*|your\s*|nihar'?s?\s*)?(project|work)/i.test(lower) ||
      /list\s*(all\s*)?(project|work)/i.test(lower) ||
      /tell\s*(me\s*)?(about\s*)?(his\s*|your\s*|nihar'?s?\s*)?(project|work)/i.test(lower) ||
      /(his|your|nihar'?s?)\s*project/i.test(lower) ||
      /see\s*(his\s*|your\s*|nihar'?s?\s*)?(project|work)/i.test(lower)) {
    return { intent: 'projects' };
  }
  
  // About/who intents
  if (/who\s*(is\s*)?(nihar|he|this\s*guy)/i.test(lower) ||
      /tell\s*(me\s*)?(about\s*)?(nihar|him|yourself)/i.test(lower) ||
      /about\s*(nihar|him|yourself)/i.test(lower) ||
      /introduce\s*(yourself|nihar|him)/i.test(lower) ||
      /what\s*(does\s*)?(nihar|he)\s*do/i.test(lower)) {
    return { intent: 'about' };
  }
  
  // Skills intents
  if (/what\s*(are\s*)?(his\s*|your\s*|nihar'?s?\s*)?(skill|tech|expertise|stack)/i.test(lower) ||
      /show\s*(me\s*)?(his\s*|your\s*|nihar'?s?\s*)?(skill|tech|expertise)/i.test(lower) ||
      /what\s*(can\s*)?(nihar|he)\s*(do|build|code)/i.test(lower) ||
      /(his|your|nihar'?s?)\s*(skill|tech|expertise)/i.test(lower) ||
      /technologies?\s*(nihar|he)\s*(know|use)/i.test(lower)) {
    return { intent: 'skills' };
  }
  
  // Contact intents
  if (/how\s*(can\s*i\s*)?(contact|reach|email|message)\s*(nihar|him|you)?/i.test(lower) ||
      /want\s*to\s*(contact|reach|email|message|hire)/i.test(lower) ||
      /get\s*in\s*touch/i.test(lower) ||
      /(nihar'?s?|his|your)\s*(email|contact|phone)/i.test(lower) ||
      /hire\s*(nihar|him|you)/i.test(lower)) {
    return { intent: 'contact' };
  }
  
  // Send message intent
  if (/send\s*(a\s*)?(message|msg|email)/i.test(lower) ||
      /write\s*(to\s*)?(nihar|him)/i.test(lower) ||
      /message\s*(nihar|him)/i.test(lower) ||
      /i\s*want\s*to\s*(send|write)/i.test(lower)) {
    return { intent: 'send_message' };
  }
  
  // Experience intents
  if (/where\s*(does\s*)?(nihar|he)\s*work/i.test(lower) ||
      /(his\s*|nihar'?s?\s*)(job|work|experience|career)/i.test(lower) ||
      /work\s*experience/i.test(lower) ||
      /cisco/i.test(lower) ||
      /what\s*(is\s*)?(his\s*|nihar'?s?\s*)?(current\s*)?(job|role|position)/i.test(lower)) {
    return { intent: 'experience' };
  }
  
  // Education intents
  if (/(his\s*|nihar'?s?\s*)(education|degree|college|university|qualification)/i.test(lower) ||
      /where\s*(did\s*)?(nihar|he)\s*(study|graduate)/i.test(lower) ||
      /what\s*(did\s*)?(nihar|he)\s*study/i.test(lower)) {
    return { intent: 'education' };
  }
  
  // Social/links intents
  if (/(his\s*|nihar'?s?\s*)?(github|linkedin|social|links)/i.test(lower) ||
      /social\s*(media\s*)?(links|accounts|profiles)/i.test(lower)) {
    return { intent: 'social' };
  }
  
  // Navigation intents
  if (/go\s*to\s*(home|projects?|albums?|photos?|contact|gallery)/i.test(lower) ||
      /take\s*me\s*to\s*(home|projects?|albums?|photos?|contact)/i.test(lower) ||
      /open\s*(home|projects?|albums?|photos?|contact|gallery)\s*(page)?/i.test(lower) ||
      /navigate\s*to\s*(home|projects?|albums?|contact)/i.test(lower)) {
    const pageMatch = lower.match(/(home|projects?|albums?|photos?|contact|gallery)/i);
    if (pageMatch) {
      let page = pageMatch[1].toLowerCase();
      if (page === 'project') page = 'projects';
      if (page === 'album' || page === 'photo' || page === 'photos' || page === 'gallery') page = 'albums';
      return { intent: 'navigate', page };
    }
  }
  
  // Theme intents
  if (/change\s*(the\s*)?(theme|mode|color)/i.test(lower) ||
      /switch\s*(to\s*)?(dark|light)\s*(mode|theme)?/i.test(lower) ||
      /(dark|light)\s*(mode|theme)/i.test(lower) ||
      /toggle\s*(the\s*)?(theme|mode)/i.test(lower)) {
    return { intent: 'theme' };
  }
  
  // Help intents
  if (/what\s*can\s*(you|this\s*bot)\s*do/i.test(lower) ||
      /how\s*(do\s*i\s*)?(use\s*)?(this|you)/i.test(lower) ||
      /show\s*(me\s*)?(commands|options|menu)/i.test(lower)) {
    return { intent: 'help' };
  }
  
  // Recruiter/Hiring intents - IMPORTANT FOR JOB OPPORTUNITIES
  if (/looking\s*(for|to\s*hire)/i.test(lower) ||
      /hiring|recruit|job\s*opening|position|opportunity|candidate/i.test(lower) ||
      /interview|schedule|availability/i.test(lower) ||
      /why\s*(should\s*(i|we)\s*)?(hire|consider)/i.test(lower) ||
      /good\s*(fit|candidate|developer|engineer)/i.test(lower) ||
      /strengths?|weakness|qualities/i.test(lower) ||
      /salary|compensation|expectation|notice\s*period/i.test(lower) ||
      /available|open\s*to\s*(new\s*)?(opportunities|roles|positions)/i.test(lower) ||
      /relocate|remote|onsite|hybrid/i.test(lower) ||
      /team|company|startup|organization/i.test(lower) ||
      /full\s*time|part\s*time|freelance|contract/i.test(lower) ||
      /resume|cv|portfolio/i.test(lower)) {
    return { intent: 'recruiter' };
  }

  // Specific project lookup
  const projectNames = [
    { name: 'fir vault', aliases: ['fir', 'firvault', 'fir-vault'] },
    { name: 'delhi health connect', aliases: ['caresync', 'health connect', 'delhi health', 'care sync', 'healthcare'] },
    { name: 'nagrik', aliases: ['samvidhan', 'citizen', 'constitution', 'nagrik aur'] },
    { name: 'rainfall', aliases: ['rain', 'prediction', 'smote', 'lstm', 'weather'] },
    { name: 'classroom', aliases: ['class', 'management', 'classroom management'] },
    { name: 'chat', aliases: ['group chat', 'chat application', 'messaging'] },
    { name: 'career', aliases: ['ai career', 'navigator', 'career navigator'] },
    { name: 'calendar', aliases: ['academic', 'annual calendar', 'academic calendar'] }
  ];
  
  for (const proj of projectNames) {
    if (lower.includes(proj.name) || proj.aliases.some(a => lower.includes(a))) {
      return { intent: 'view_project', projectHint: proj.name };
    }
  }
  
  return null;
};

// Check if input matches any project by name (fuzzy)
const findProjectByName = (input) => {
  const inputLower = input.toLowerCase().trim();
  
  // Direct match
  let found = projects.find(p => 
    p.title.toLowerCase().includes(inputLower) ||
    inputLower.includes(p.title.toLowerCase().split(' ')[0].toLowerCase())
  );
  
  if (found) return found;
  
  // Fuzzy match project names
  for (const project of projects) {
    const titleWords = project.title.toLowerCase().split(' ');
    for (const word of titleWords) {
      if (word.length > 3) {
        const distance = levenshteinDistance(inputLower, word);
        if (distance <= 2) return project;
      }
    }
  }
  
  // Match by project number
  const numMatch = inputLower.match(/project\s*(\d+)/);
  if (numMatch) {
    const projectNum = parseInt(numMatch[1]);
    if (projectNum >= 1 && projectNum <= projects.length) {
      return projects[projectNum - 1];
    }
  }
  
  return null;
};

// ==================== ANIMATIONS ====================

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100%); opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const scanLine = keyframes`
  0% { top: 0; }
  100% { top: 100%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const ripple = keyframes`
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(2); opacity: 0; }
`;

// ==================== STYLED COMPONENTS ====================
const TerminalToggle = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: ${({ theme, $isOpen }) => $isOpen 
    ? 'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)' 
    : theme.background === '#0d1117'
      ? 'linear-gradient(135deg, #00e676 0%, #00c853 100%)'
      : 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'};
  border: none;
  cursor: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.background === '#0d1117'
    ? '0 4px 20px rgba(0, 230, 118, 0.4), 0 0 40px rgba(0, 230, 118, 0.2)'
    : '0 4px 20px rgba(52, 152, 219, 0.4), 0 0 40px rgba(52, 152, 219, 0.2)'};
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10000;
  animation: ${float} 3s ease-in-out infinite;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.background === '#0d1117'
      ? '0 6px 30px rgba(0, 230, 118, 0.6), 0 0 60px rgba(0, 230, 118, 0.3)'
      : '0 6px 30px rgba(52, 152, 219, 0.6), 0 0 60px rgba(52, 152, 219, 0.3)'};
  }
  
  &:active {
    transform: scale(0.95);
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: inherit;
    animation: ${ripple} 2s ease-out infinite;
  }

  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
    bottom: 20px;
    right: 20px;
  }
`

const TerminalIcon = styled.span`
  font-size: 28px;
  color: white;
  z-index: 1;
  transition: transform 0.3s ease;
  
  ${TerminalToggle}:hover & {
    transform: rotate(${({ $isOpen }) => $isOpen ? '180deg' : '0deg'});
  }
`;

const TerminalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 9998;
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const TerminalContainer = styled.div`
  position: fixed;
  bottom: 110px;
  right: 30px;
  width: 450px;
  max-width: calc(100vw - 40px);
  height: 550px;
  max-height: calc(100vh - 150px);
  background: ${({ theme }) => theme.background === '#0d1117' 
    ? 'linear-gradient(145deg, rgba(13, 17, 23, 0.98), rgba(30, 30, 46, 0.98))' 
    : 'linear-gradient(145deg, rgba(248, 251, 255, 0.98), rgba(240, 248, 255, 0.98))'};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.background === '#0d1117' 
    ? 'rgba(0, 230, 118, 0.3)' 
    : 'rgba(52, 152, 219, 0.4)'};
  box-shadow: ${({ theme }) => theme.background === '#0d1117'
    ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(0, 230, 118, 0.1)'
    : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 100px rgba(52, 152, 219, 0.1)'};
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${({ $isOpen, $isClosing }) => {
    if ($isClosing) return css`${slideDown} 0.3s ease-out forwards`;
    if ($isOpen) return css`${slideUp} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
    return 'none';
  }};
  visibility: ${({ $isOpen, $isClosing }) => ($isOpen || $isClosing) ? 'visible' : 'hidden'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 230, 118, 0.03) 50%,
      transparent 100%
    );
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00e676, transparent);
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    bottom: 90px;
    right: 10px;
    width: calc(100vw - 20px);
    height: calc(100vh - 120px);
    border-radius: 15px;
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: ${({ theme }) => theme.background === '#0d1117'
    ? 'linear-gradient(90deg, rgba(0, 230, 118, 0.15), rgba(0, 230, 118, 0.02))'
    : 'linear-gradient(90deg, rgba(52, 152, 219, 0.15), rgba(52, 152, 219, 0.02))'};
  border-bottom: 1px solid ${({ theme }) => theme.background === '#0d1117'
    ? 'rgba(0, 230, 118, 0.3)'
    : 'rgba(52, 152, 219, 0.3)'};
  position: relative;

  @media (max-width: 768px) {
    padding: 12px 15px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.background === '#0d1117'
      ? 'linear-gradient(90deg, #00e676, transparent)'
      : 'linear-gradient(90deg, #3498db, transparent)'};
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ theme }) => theme.background === '#0d1117' ? '#00e676' : '#3498db'};
  box-shadow: ${({ theme }) => theme.background === '#0d1117' 
    ? '0 0 10px #00e676, 0 0 20px rgba(0, 230, 118, 0.5)' 
    : '0 0 10px #3498db, 0 0 20px rgba(52, 152, 219, 0.5)'};
  animation: ${blink} 2s ease-in-out infinite;

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

const TerminalTitle = styled.span`
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.background === '#0d1117' ? '#00e676' : '#3498db'};
  letter-spacing: 2px;
  text-shadow: ${({ theme }) => theme.background === '#0d1117'
    ? '0 0 10px rgba(0, 230, 118, 0.5), 0 0 20px rgba(0, 230, 118, 0.3)'
    : '0 0 10px rgba(52, 152, 219, 0.5), 0 0 20px rgba(52, 152, 219, 0.3)'};

  @media (max-width: 768px) {
    font-size: 14px;
    letter-spacing: 1px;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const HeaderButton = styled.button`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:nth-child(1) {
    background: #ff5f56;
    &:hover { background: #ff3b30; transform: scale(1.2); }
  }
  &:nth-child(2) {
    background: #ffbd2e;
    &:hover { background: #ff9500; transform: scale(1.2); }
  }
  &:nth-child(3) {
    background: #27ca40;
    &:hover { background: #28cd41; transform: scale(1.2); }
  }

  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
  }
`;

const TerminalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  position: relative;
  background: ${({ theme }) => theme.background === '#0d1117'
    ? 'transparent'
    : 'rgba(255, 255, 255, 0.5)'};

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 12px;
    line-height: 1.5;
  }
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background === '#0d1117'
      ? 'rgba(0, 0, 0, 0.2)'
      : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.background === '#0d1117'
      ? 'rgba(0, 230, 118, 0.3)'
      : 'rgba(52, 152, 219, 0.3)'};
    border-radius: 3px;
    &:hover {
      background: ${({ theme }) => theme.background === '#0d1117'
        ? 'rgba(0, 230, 118, 0.5)'
        : 'rgba(52, 152, 219, 0.5)'};
    }
  }

  /* Scan line effect */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.background === '#0d1117'
      ? 'linear-gradient(90deg, transparent, rgba(0, 230, 118, 0.1), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(52, 152, 219, 0.1), transparent)'};
    animation: ${scanLine} 8s linear infinite;
    pointer-events: none;
    z-index: 100;
  }
`;

const OutputLine = styled.div`
  margin-bottom: 8px;
  animation: ${fadeIn} 0.3s ease;
  word-wrap: break-word;
  
  ${({ $type, theme }) => {
    const isDark = theme?.background === '#0d1117';
    switch ($type) {
      case 'command':
        return css`color: ${isDark ? '#00e676' : '#27ae60'};`;
      case 'response':
        return css`color: ${isDark ? '#e0e0e0' : '#333333'};`;
      case 'error':
        return css`color: #ff5252;`;
      case 'success':
        return css`color: ${isDark ? '#69f0ae' : '#27ae60'};`;
      case 'info':
        return css`color: ${isDark ? '#64b5f6' : '#3498db'};`;
      case 'warning':
        return css`color: #ffab40;`;
      case 'highlight':
        return css`color: ${isDark ? '#e040fb' : '#9b59b6'};`;
      case 'system':
        return css`color: ${isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'}; font-style: italic;`;
      default:
        return css`color: ${isDark ? '#e0e0e0' : '#333333'};`;
    }
  }}
`;

const CommandPrefix = styled.span`
  color: ${({ theme }) => theme?.background === '#0d1117' ? '#e040fb' : '#9b59b6'};
  margin-right: 8px;
`;

const AsciiArt = styled.pre`
  color: ${({ theme }) => theme?.background === '#0d1117' ? '#00e676' : '#3498db'};
  font-size: 10px;
  line-height: 1.2;
  margin: 10px 0;
  text-shadow: ${({ theme }) => theme?.background === '#0d1117'
    ? '0 0 10px rgba(0, 230, 118, 0.5)'
    : '0 0 10px rgba(52, 152, 219, 0.5)'};
  overflow-x: auto;

  @media (max-width: 768px) {
    font-size: 8px;
    line-height: 1.1;
    margin: 5px 0;
    display: none; /* Hide ASCII art on mobile to save space */
  };
`;

const SuggestionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Chip = styled.button`
  padding: 6px 12px;
  background: ${({ theme }) => theme?.background === '#0d1117'
    ? 'rgba(0, 230, 118, 0.1)'
    : 'rgba(52, 152, 219, 0.1)'};
  border: 1px solid ${({ theme }) => theme?.background === '#0d1117'
    ? 'rgba(0, 230, 118, 0.3)'
    : 'rgba(52, 152, 219, 0.3)'};
  border-radius: 20px;
  color: ${({ theme }) => theme?.background === '#0d1117' ? '#00e676' : '#3498db'};
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme?.background === '#0d1117'
      ? 'rgba(0, 230, 118, 0.2)'
      : 'rgba(52, 152, 219, 0.2)'};
    border-color: ${({ theme }) => theme?.background === '#0d1117' ? '#00e676' : '#3498db'};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme?.background === '#0d1117'
      ? '0 4px 15px rgba(0, 230, 118, 0.3)'
      : '0 4px 15px rgba(52, 152, 219, 0.3)'};
  }

  @media (max-width: 768px) {
    padding: 5px 10px;
    font-size: 10px;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 0;
  
  span {
    width: 8px;
    height: 8px;
    background: ${({ theme }) => theme?.background === '#0d1117' ? '#00e676' : '#3498db'};
    border-radius: 50%;
    animation: ${float} 0.6s ease-in-out infinite;
    
    &:nth-child(2) { animation-delay: 0.1s; }
    &:nth-child(3) { animation-delay: 0.2s; }
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: ${({ theme }) => theme?.background === '#0d1117'
    ? 'rgba(0, 0, 0, 0.3)'
    : 'rgba(52, 152, 219, 0.05)'};
  border-top: 1px solid ${({ theme }) => theme?.background === '#0d1117'
    ? 'rgba(0, 230, 118, 0.2)'
    : 'rgba(52, 152, 219, 0.2)'};
  gap: 10px;

  @media (max-width: 768px) {
    padding: 12px 15px;
    gap: 8px;
  }
`;

const InputPrefix = styled.span`
  color: ${({ theme }) => theme?.background === '#0d1117' ? '#00e676' : '#3498db'};
  font-family: 'Fira Code', monospace;
  font-weight: bold;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme?.background === '#0d1117' ? '#fff' : '#333'};
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 14px;
  caret-color: ${({ theme }) => theme?.background === '#0d1117' ? '#00e676' : '#3498db'};
  
  &::placeholder {
    color: ${({ theme }) => theme?.background === '#0d1117'
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 0, 0, 0.3)'};
  }

  @media (max-width: 768px) {
    font-size: 16px; /* Prevents iOS zoom on focus */
  }
`;

const SendButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme?.background === '#0d1117'
    ? 'linear-gradient(135deg, #00e676, #00c853)'
    : 'linear-gradient(135deg, #3498db, #2980b9)'};
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme?.background === '#0d1117'
      ? '0 4px 15px rgba(0, 230, 118, 0.4)'
      : '0 4px 15px rgba(52, 152, 219, 0.4)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProjectCard = styled.div`
  background: ${({ theme }) => theme?.background === '#0d1117'
    ? 'rgba(0, 230, 118, 0.05)'
    : 'rgba(52, 152, 219, 0.05)'};
  border: 1px solid ${({ theme }) => theme?.background === '#0d1117'
    ? 'rgba(0, 230, 118, 0.2)'
    : 'rgba(52, 152, 219, 0.2)'};
  border-radius: 10px;
  padding: 12px;
  margin: 8px 0;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme?.background === '#0d1117'
      ? 'rgba(0, 230, 118, 0.1)'
      : 'rgba(52, 152, 219, 0.1)'};
    border-color: ${({ theme }) => theme?.background === '#0d1117' ? '#00e676' : '#3498db'};
  }
`;

const ProjectTitle = styled.div`
  color: ${({ theme }) => theme?.background === '#0d1117' ? '#00e676' : '#3498db'};
  font-weight: bold;
  margin-bottom: 5px;
`;

const ProjectDesc = styled.div`
  color: ${({ theme }) => theme?.background === '#0d1117'
    ? 'rgba(255, 255, 255, 0.7)'
    : 'rgba(0, 0, 0, 0.7)'};
  font-size: 11px;
  line-height: 1.4;
`;

const SkillBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0;
`;

const SkillName = styled.span`
  width: 100px;
  color: ${({ theme }) => theme?.background === '#0d1117' ? '#e0e0e0' : '#333'};
  font-size: 12px;
`;

const SkillProgress = styled.div`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme?.background === '#0d1117'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  overflow: hidden;
`;

const SkillFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme?.background === '#0d1117'
    ? 'linear-gradient(90deg, #00e676, #69f0ae)'
    : 'linear-gradient(90deg, #3498db, #5dade2)'};
  border-radius: 4px;
  width: ${({ $level }) => $level}%;
  transition: width 1s ease;
`;

const Link = styled.a`
  color: ${({ theme }) => theme?.background === '#0d1117' ? '#64b5f6' : '#3498db'};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme?.background === '#0d1117' ? '#90caf9' : '#2980b9'};
  }
`;

const SkillLevelText = styled.span`
  color: ${({ theme }) => theme?.background === '#0d1117' ? '#00e676' : '#3498db'};
  font-size: 11px;
  width: 35px;
`;

const TechStackText = styled.div`
  margin-top: 8px;
  font-size: 10px;
  color: ${({ theme }) => theme?.background === '#0d1117' ? '#00e676' : '#3498db'};
`;

// ==================== MAIN COMPONENT ====================
const SmartTerminal = () => {
  const { isTerminalOpen, setIsTerminalOpen } = useTerminal();
  const { playTerminalOpen, playTerminalClose, playMessage, playClick } = useSound();
  const [isClosing, setIsClosing] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Contact form flow states
  const [contactFlow, setContactFlow] = useState({
    active: false,
    step: null, // 'name', 'email', 'message', 'confirm'
    data: { name: '', email: '', message: '' }
  });
  
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { toggleTheme, isDarkMode } = useContext(ThemeContext);

  // Play sound when terminal opens/closes
  useEffect(() => {
    if (isTerminalOpen && !isClosing) {
      playTerminalOpen();
    }
  }, [isTerminalOpen, isClosing, playTerminalOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isTerminalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isTerminalOpen]);

  // Refocus input after typing completes
  useEffect(() => {
    if (!isTyping && isTerminalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isTyping, isTerminalOpen]);

  // Initial greeting
  useEffect(() => {
    if (isTerminalOpen && history.length === 0) {
      showWelcomeMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTerminalOpen]);

  const showWelcomeMessage = () => {
    const welcomeMessages = [
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'ascii', content: `
 ███╗   ██╗██╗██╗  ██╗ █████╗ ██████╗ 
 ████╗  ██║██║██║  ██║██╔══██╗██╔══██╗
 ██╔██╗ ██║██║███████║███████║██████╔╝
 ██║╚██╗██║██║██╔══██║██╔══██║██╔══██╗
 ██║ ╚████║██║██║  ██║██║  ██║██║  ██║
 ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝` },
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'success', content: 'NIHAR-AI' },
      { type: 'info', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
      { type: 'response', content: "Hey there! 👋 I'm Nihar's AI assistant." },
      { type: 'info', content: '' },
      { type: 'response', content: "I can help you explore Nihar's portfolio, learn about his skills, view projects, or connect with him!" },
      { type: 'info', content: '' },
      { type: 'highlight', content: "🎯 Recruiters: Type 'why hire' or just tell me about your opportunity!" },
      { type: 'highlight', content: "💡 Everyone: Ask me anything or type 'help' for commands!" },
      { type: 'suggestions', suggestions: ['about', 'skills', 'projects', 'why hire', 'contact'] }
    ];
    
    setHistory(welcomeMessages);
  };

  const addOutput = useCallback((messages, delay = 50) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setHistory(prev => [...prev, ...messages]);
      setIsTyping(false);
    }, delay);
  }, []);

  // Handle contact form flow input
  const handleContactFlowInput = useCallback(async (input) => {
    const trimmedInput = input.trim();
    
    // Cancel flow
    if (['cancel', 'exit', 'quit', 'back', 'no'].includes(trimmedInput.toLowerCase())) {
      setContactFlow({ active: false, step: null, data: { name: '', email: '', message: '' } });
      return [
        { type: 'info', content: '❌ Contact form cancelled.' },
        { type: 'response', content: 'No worries! Let me know if you need anything else.' },
        { type: 'suggestions', suggestions: ['about', 'projects', 'skills'] }
      ];
    }

    switch (contactFlow.step) {
      case 'name':
        if (trimmedInput.length < 2) {
          return [
            { type: 'error', content: '❌ Please enter a valid name (at least 2 characters).' },
            { type: 'highlight', content: '📝 What is your name?' }
          ];
        }
        setContactFlow(prev => ({
          ...prev,
          step: 'email',
          data: { ...prev.data, name: trimmedInput }
        }));
        return [
          { type: 'success', content: `✓ Nice to meet you, ${trimmedInput}!` },
          { type: 'highlight', content: '📧 What is your email address?' },
          { type: 'info', content: "(Type 'cancel' to exit)" }
        ];

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedInput)) {
          return [
            { type: 'error', content: '❌ Please enter a valid email address.' },
            { type: 'highlight', content: '📧 What is your email address?' }
          ];
        }
        setContactFlow(prev => ({
          ...prev,
          step: 'message',
          data: { ...prev.data, email: trimmedInput }
        }));
        return [
          { type: 'success', content: '✓ Email saved!' },
          { type: 'highlight', content: '💬 What message would you like to send to Nihar?' },
          { type: 'info', content: "(Type 'cancel' to exit)" }
        ];

      case 'message':
        if (trimmedInput.length < 10) {
          return [
            { type: 'error', content: '❌ Please enter a longer message (at least 10 characters).' },
            { type: 'highlight', content: '💬 What message would you like to send?' }
          ];
        }
        setContactFlow(prev => ({
          ...prev,
          step: 'confirm',
          data: { ...prev.data, message: trimmedInput }
        }));
        const { name, email } = contactFlow.data;
        return [
          { type: 'success', content: '📋 Message Preview' },
          { type: 'system', content: '─────────────────────────────────────' },
          { type: 'info', content: `👤 Name: ${name}` },
          { type: 'info', content: `📧 Email: ${email}` },
          { type: 'info', content: `💬 Message:` },
          { type: 'response', content: trimmedInput },
          { type: 'system', content: '─────────────────────────────────────' },
          { type: 'highlight', content: "🚀 Type 'send' to submit or 'cancel' to discard" }
        ];

      case 'confirm':
        if (['send', 'yes', 'submit', 'confirm', 'y'].includes(trimmedInput.toLowerCase())) {
          // Send the message
          setIsTyping(true);
          const { name, email, message } = contactFlow.data;
          
          try {
            const result = await sendContactMessage({ name, email, message });
            setContactFlow({ active: false, step: null, data: { name: '', email: '', message: '' } });
            
            if (result.success) {
              return [
                { type: 'success', content: '🎉 Message Sent Successfully!' },
                { type: 'system', content: '─────────────────────────────────────' },
                { type: 'response', content: 'Thank you for reaching out!' },
                { type: 'info', content: 'Nihar will get back to you within 24 hours.' },
                { type: 'highlight', content: '✨ Looking forward to connecting with you!' },
                { type: 'suggestions', suggestions: ['about', 'projects', 'social'] }
              ];
            } else {
              return [
                { type: 'error', content: '❌ Failed to send message' },
                { type: 'response', content: result.error || 'Something went wrong. Please try again.' },
                { type: 'highlight', content: "💡 You can also email directly: nihar4569@gmail.com" },
                { type: 'suggestions', suggestions: ['contact', 'social'] }
              ];
            }
          } catch (error) {
            setContactFlow({ active: false, step: null, data: { name: '', email: '', message: '' } });
            return [
              { type: 'error', content: '❌ Error sending message' },
              { type: 'response', content: 'Network error. Please try again later.' },
              { type: 'highlight', content: "💡 You can email directly: nihar4569@gmail.com" },
              { type: 'suggestions', suggestions: ['contact', 'social'] }
            ];
          }
        } else if (['edit', 'change', 'modify'].includes(trimmedInput.toLowerCase())) {
          setContactFlow(prev => ({ ...prev, step: 'name', data: { name: '', email: '', message: '' } }));
          return [
            { type: 'info', content: '🔄 Starting over...' },
            { type: 'highlight', content: '📝 What is your name?' }
          ];
        } else {
          return [
            { type: 'info', content: "Please type 'send' to submit or 'cancel' to discard." },
            { type: 'highlight', content: "You can also type 'edit' to start over." }
          ];
        }

      default:
        setContactFlow({ active: false, step: null, data: { name: '', email: '', message: '' } });
        return [{ type: 'error', content: 'Something went wrong. Please try again.' }];
    }
  }, [contactFlow]);

  // Function to show detailed project info
  const showProjectDetail = (project) => {
    return [
      { type: 'success', content: `🚀 ${project.title}` },
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'response', content: project.description },
      { type: 'info', content: '' },
      { type: 'highlight', content: '✨ Key Features:' },
      ...project.features.slice(0, 4).map(f => ({ type: 'response', content: `• ${f}` })),
      { type: 'info', content: '' },
      { type: 'highlight', content: '🛠️ Tech Stack:' },
      { type: 'info', content: project.techStack.join(' • ') },
      { type: 'info', content: '' },
      { type: 'highlight', content: '🔗 Links:' },
      ...(project.links.github ? [{ type: 'link', content: '📦 GitHub Repository', href: project.links.github }] : []),
      ...(project.links.live ? [{ type: 'link', content: '🌐 Live Demo', href: project.links.live }] : []),
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'suggestions', suggestions: ['projects', 'go projects', 'skills', 'contact'] }
    ];
  };

  // List all projects with numbers
  const listAllProjects = () => {
    let response = [
      { type: 'success', content: '📋 All Projects' },
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'info', content: "Type a project number or name to see details:" },
      { type: 'info', content: '' }
    ];
    
    projects.forEach((project, index) => {
      response.push({
        type: 'highlight',
        content: `${index + 1}. ${project.title} ${project.featured ? '⭐' : ''}`
      });
    });
    
    response.push(
      { type: 'info', content: '' },
      { type: 'response', content: "Example: Type 'show fir vault' or 'project 1' to see details" },
      { type: 'suggestions', suggestions: projects.slice(0, 4).map(p => p.title.split(' ')[0].toLowerCase()) }
    );
    
    return response;
  };

  const processCommand = useCallback(async (cmd) => {
    const originalCmd = cmd.trim();
    let trimmedCmd = originalCmd.toLowerCase();
    
    // Apply typo correction
    const correctedCmd = correctTypo(trimmedCmd);
    const wasTypoCorrected = correctedCmd !== trimmedCmd && correctedCmd !== originalCmd.toLowerCase();
    
    // Use corrected command
    if (wasTypoCorrected) {
      trimmedCmd = correctedCmd;
    }
    
    const words = trimmedCmd.split(' ');
    const mainCommand = words[0];
    const args = words.slice(1).join(' ');

    // Add command to history display (show original input)
    setHistory(prev => [...prev, { type: 'command', content: `$ ${originalCmd}` }]);
    setCommandHistory(prev => [originalCmd, ...prev.slice(0, 49)]);

    // Handle contact flow if active
    if (contactFlow.active) {
      const response = await handleContactFlowInput(cmd);
      addOutput(response, 300);
      return;
    }

    // Process based on command/query
    let response = [];
    
    // Show typo correction message if applicable
    const typoMessage = wasTypoCorrected ? [
      { type: 'info', content: `🔧 Did you mean "${correctedCmd}"? I'll help with that!` }
    ] : [];

    // Check for specific project request first
    const projectMatch = findProjectByName(trimmedCmd);
    if (projectMatch && !['projects', 'project'].includes(mainCommand)) {
      // Check if user is asking to show/view/open a specific project
      if (['show', 'view', 'open', 'see', 'tell', 'about'].some(w => trimmedCmd.includes(w)) || 
          trimmedCmd.match(/project\s*\d+/) ||
          projects.some(p => trimmedCmd.includes(p.title.toLowerCase().split(' ')[0].toLowerCase()))) {
        response = [...typoMessage, ...showProjectDetail(projectMatch)];
        addOutput(response, 300);
        return;
      }
    }
    
    // Check for project number request (e.g., "1", "2", "project 1")
    const projectNumMatch = trimmedCmd.match(/^(\d+)$|^project\s*(\d+)$/);
    if (projectNumMatch) {
      const num = parseInt(projectNumMatch[1] || projectNumMatch[2]);
      if (num >= 1 && num <= projects.length) {
        response = [...typoMessage, ...showProjectDetail(projects[num - 1])];
        addOutput(response, 300);
        return;
      }
    }

    // Try natural language understanding first
    const intent = understandIntent(originalCmd);
    if (intent) {
      switch (intent.intent) {
        case 'projects':
          response = getProjectsResponse(args);
          addOutput(response, 300);
          return;
        case 'about':
          response = getAboutResponse();
          addOutput(response, 300);
          return;
        case 'skills':
          response = getSkillsResponse(args);
          addOutput(response, 300);
          return;
        case 'contact':
          response = getContactResponse();
          addOutput(response, 300);
          return;
        case 'send_message':
          response = startContactFlow();
          addOutput(response, 300);
          return;
        case 'experience':
          response = getExperienceResponse();
          addOutput(response, 300);
          return;
        case 'education':
          response = getEducationResponse();
          addOutput(response, 300);
          return;
        case 'social':
          response = getSocialResponse();
          addOutput(response, 300);
          return;
        case 'navigate':
          response = handleNavigation(intent.page);
          addOutput(response, 300);
          return;
        case 'theme':
          response = handleTheme();
          addOutput(response, 300);
          return;
        case 'help':
          response = getHelpResponse();
          addOutput(response, 300);
          return;
        case 'recruiter':
          response = getRecruiterResponse(originalCmd);
          addOutput(response, 300);
          return;
        case 'view_project':
          // Find project by hint
          const proj = projects.find(p => 
            p.title.toLowerCase().includes(intent.projectHint)
          );
          if (proj) {
            response = showProjectDetail(proj);
            addOutput(response, 300);
            return;
          }
          break;
        default:
          break;
      }
    }

    // Greetings
    if (['hi', 'hello', 'hey', 'hola', 'namaste'].includes(trimmedCmd)) {
      response = [...typoMessage, ...getGreetingResponse()];
    }
    // Help
    else if (['help', '?', 'commands', 'menu'].includes(trimmedCmd)) {
      response = [...typoMessage, ...getHelpResponse()];
    }
    // About Nihar
    else if (['about', 'who', 'nihar', 'whoami', 'who is nihar', 'tell me about nihar', 'about nihar'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...getAboutResponse()];
    }
    // Skills
    else if (['skills', 'tech', 'technologies', 'stack', 'what can nihar do', 'expertise'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...getSkillsResponse(args)];
    }
    // List all projects
    else if (['list projects', 'all projects', 'show all projects', 'project list'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...listAllProjects()];
    }
    // Projects overview
    else if (['projects', 'work', 'portfolio', 'show projects', 'what has nihar built'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...getProjectsResponse(args)];
    }
    // Send Message - Start contact flow
    else if (['send message', 'send msg', 'write message', 'message nihar', 'contact nihar', 'write to nihar'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...startContactFlow()];
    }
    // Contact info
    else if (['contact', 'hire', 'email', 'reach', 'connect', 'get in touch', 'message'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...getContactResponse()];
    }
    // Social links
    else if (['social', 'github', 'linkedin', 'twitter', 'links', 'socials'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...getSocialResponse()];
    }
    // Education
    else if (['education', 'degree', 'college', 'university', 'study', 'qualification'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...getEducationResponse()];
    }
    // Experience
    else if (['experience', 'job', 'work experience', 'cisco', 'career', 'company'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...getExperienceResponse()];
    }
    // Navigation
    else if (['go', 'navigate', 'open', 'goto', 'nav'].includes(mainCommand)) {
      response = [...typoMessage, ...handleNavigation(args)];
    }
    // Theme
    else if (['theme', 'dark', 'light', 'mode', 'toggle theme', 'switch theme'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...handleTheme()];
    }
    // Clear
    else if (['clear', 'cls', 'reset'].includes(trimmedCmd)) {
      setHistory([]);
      showWelcomeMessage();
      return;
    }
    // Fun stuff
    else if (['joke', 'fun', 'funny', 'make me laugh'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...getFunResponse()];
    }
    // Thanks
    else if (['thanks', 'thank you', 'thx', 'ty'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage,
        { type: 'response', content: "You're welcome! 😊" },
        { type: 'info', content: "Is there anything else I can help you with?" },
        { type: 'highlight', content: "💡 Tip: Nihar would love to hear from you! Type 'contact' to reach out." }
      ];
    }
    // Why hire / convince
    else if (['why hire', 'why nihar', 'convince', 'why should'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage, ...getWhyHireResponse()];
    }
    // Resume / CV
    else if (['resume', 'cv', 'download'].some(k => trimmedCmd.includes(k))) {
      response = [...typoMessage,
        { type: 'success', content: '📄 Resume / CV' },
        { type: 'response', content: "Want Nihar's resume? Great choice!" },
        { type: 'info', content: "You can request it directly by contacting him." },
        { type: 'highlight', content: "Type 'send message' to reach out and request his CV!" },
        { type: 'suggestions', suggestions: ['send message', 'about', 'experience'] }
      ];
    }
    // Try fuzzy project match before giving up
    else {
      // Last attempt - try to find a project by fuzzy match
      const fuzzyProject = findProjectByName(trimmedCmd);
      if (fuzzyProject) {
        response = [...typoMessage, ...showProjectDetail(fuzzyProject)];
      } else {
        response = [...typoMessage, ...getSmartResponse(trimmedCmd)];
      }
    }

    addOutput(response, 300 + Math.random() * 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addOutput, toggleTheme, navigate, isDarkMode, contactFlow.active, handleContactFlowInput]);

  // Response generators
  const getGreetingResponse = () => [
    { type: 'response', content: `Hello! 👋 Great to see you here!` },
    { type: 'info', content: "I'm Nihar's AI assistant, ready to help you explore his portfolio." },
    { type: 'response', content: "What would you like to know about Nihar?" },
    { type: 'suggestions', suggestions: ['about', 'skills', 'projects', 'contact'] }
  ];

  const getHelpResponse = () => [
    { type: 'success', content: '📚 Available Commands & Queries' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'info', content: '🧑 about         → Learn about Nihar' },
    { type: 'info', content: '💼 experience    → Work experience at Cisco' },
    { type: 'info', content: '🎓 education     → Educational background' },
    { type: 'info', content: '🛠️ skills        → Technical skills & expertise' },
    { type: 'info', content: '🚀 projects      → View all projects' },
    { type: 'info', content: '📦 [project]     → View specific project (e.g., "fir vault")' },
    { type: 'info', content: '📧 contact       → Contact information' },
    { type: 'info', content: '💬 send message  → Send a message directly!' },
    { type: 'info', content: '🔗 social        → Social media links' },
    { type: 'info', content: '🎨 theme         → Toggle dark/light mode' },
    { type: 'info', content: '🧭 go [page]     → Navigate (home/projects/albums/contact)' },
    { type: 'info', content: '🧹 clear         → Clear terminal' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'highlight', content: '💡 I understand typos! Just type naturally.' },
    { type: 'response', content: "Try: 'skils', 'projcts', 'contac' - I'll understand!" },
    { type: 'suggestions', suggestions: ['about', 'projects', 'send message', 'fir vault'] }
  ];

  const getAboutResponse = () => [
    { type: 'success', content: '🧑‍💻 About Nihar Sahu' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'response', content: "Nihar is a Software Automation Engineer at Cisco, passionate about building innovative solutions." },
    { type: 'info', content: '📍 Location: Bengaluru, India' },
    { type: 'info', content: '💼 Current Role: Software Automation Engineer @ Cisco' },
    { type: 'info', content: '🎓 Education: B.Tech in Computer Science (Completed 2024)' },
    { type: 'response', content: '' },
    { type: 'response', content: "He specializes in full-stack development with expertise in Java, Python, React, and Spring Boot." },
    { type: 'response', content: "When not coding, he's probably exploring new technologies or working on side projects! 🚀" },
    { type: 'highlight', content: "💡 Interested in working with Nihar? Type 'contact' to reach out!" },
    { type: 'suggestions', suggestions: ['skills', 'experience', 'projects', 'contact'] }
  ];

  const getSkillsResponse = (category) => {
    let response = [
      { type: 'success', content: '🛠️ Technical Skills & Expertise' },
      { type: 'system', content: '─────────────────────────────────────' }
    ];

    // Programming Languages
    response.push({ type: 'highlight', content: '💻 Programming Languages' });
    skills.programming.forEach(skill => {
      response.push({ type: 'skill', skill: skill });
    });

    // Frameworks
    response.push({ type: 'highlight', content: '\n🔧 Frameworks & Libraries' });
    skills.frameworks.forEach(skill => {
      response.push({ type: 'skill', skill: skill });
    });

    // Databases
    response.push({ type: 'highlight', content: '\n🗄️ Databases' });
    skills.databases.forEach(skill => {
      response.push({ type: 'skill', skill: skill });
    });

    response.push(
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'response', content: "These skills have been honed through real projects and professional experience at Cisco!" },
      { type: 'suggestions', suggestions: ['projects', 'experience', 'contact'] }
    );

    return response;
  };

  const getProjectsResponse = (filter) => {
    let response = [
      { type: 'success', content: '🚀 Projects Portfolio' },
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'info', content: '⭐ Featured Projects:' },
      { type: 'info', content: '' }
    ];

    // Show featured projects as clickable items
    const featuredProjects = projects.filter(p => p.featured);
    featuredProjects.forEach((project, index) => {
      response.push({ type: 'project', project: project });
    });

    response.push(
      { type: 'info', content: '' },
      { type: 'highlight', content: '📋 All Projects:' }
    );
    
    // List all projects with numbers
    projects.forEach((project, index) => {
      response.push({
        type: 'info',
        content: `  ${index + 1}. ${project.title} ${project.featured ? '⭐' : ''}`
      });
    });

    response.push(
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'info', content: `📊 Total Projects: ${projects.length}` },
      { type: 'response', content: "💡 Type a project name (e.g., 'fir vault') or number (e.g., '1') to see details!" },
      { type: 'highlight', content: "🌐 Type 'go projects' to visit the full projects page" },
      { type: 'suggestions', suggestions: ['fir vault', 'caresync', '1', 'go projects'] }
    );

    return response;
  };

  const getContactResponse = () => [
    { type: 'success', content: '📧 Contact Nihar' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'response', content: "Nihar would love to hear from you! Here's how to reach him:" },
    { type: 'info', content: '' },
    { type: 'link', content: '📧 Email: nihar4569@gmail.com', href: 'mailto:nihar4569@gmail.com' },
    { type: 'link', content: '💼 LinkedIn: /in/nihar-sahu', href: 'https://linkedin.com/in/nihar-sahu' },
    { type: 'link', content: '🐙 GitHub: /Nihar4569', href: 'https://github.com/Nihar4569' },
    { type: 'info', content: '' },
    { type: 'highlight', content: "🌟 Whether it's a job opportunity, collaboration, or just to say hi - don't hesitate!" },
    { type: 'response', content: "Nihar responds to all messages, usually within 24 hours." },
    { type: 'info', content: '' },
    { type: 'success', content: "💬 Want to send a message right now? Type 'send message'!" },
    { type: 'success', content: "📝 Or type 'go contact' to use the full contact form." },
    { type: 'suggestions', suggestions: ['send message', 'go contact', 'social', 'about'] }
  ];

  const startContactFlow = () => {
    // Start the contact form flow
    setContactFlow({
      active: true,
      step: 'name',
      data: { name: '', email: '', message: '' }
    });
    
    return [
      { type: 'success', content: '💬 Send a Message to Nihar' },
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'response', content: "Great! I'll help you send a message directly to Nihar." },
      { type: 'info', content: "Just answer a few quick questions." },
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'highlight', content: '📝 What is your name?' },
      { type: 'info', content: "(Type 'cancel' anytime to exit)" }
    ];
  };

  const getSocialResponse = () => [
    { type: 'success', content: '🔗 Social Links' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'link', content: '🐙 GitHub: github.com/Nihar4569', href: 'https://github.com/Nihar4569' },
    { type: 'link', content: '💼 LinkedIn: linkedin.com/in/nihar-sahu', href: 'https://linkedin.com/in/nihar-sahu' },
    { type: 'link', content: '📧 Email: nihar4569@gmail.com', href: 'mailto:nihar4569@gmail.com' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'highlight', content: '⭐ Give his GitHub repos a star if you like his work!' },
    { type: 'suggestions', suggestions: ['projects', 'contact', 'about'] }
  ];

  const getEducationResponse = () => [
    { type: 'success', content: '🎓 Educational Background' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'info', content: '🏛️ Siksha O Anusandhan University' },
    { type: 'response', content: 'B.Tech in Computer Science & Engineering' },
    { type: 'response', content: '📅 2020 - 2024 (Completed)' },
    { type: 'response', content: '📊 CGPA: 8.5+' },
    { type: 'info', content: '' },
    { type: 'highlight', content: '🏆 Achievements:' },
    { type: 'response', content: '• Smart India Hackathon 2024 Finalist' },
    { type: 'response', content: '• Multiple project awards during academics' },
    { type: 'response', content: '• Strong foundation in DSA and system design' },
    { type: 'suggestions', suggestions: ['experience', 'skills', 'projects'] }
  ];

  const getExperienceResponse = () => [
    { type: 'success', content: '💼 Work Experience' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'highlight', content: '🏢 Cisco Systems' },
    { type: 'info', content: 'Software Automation Engineer' },
    { type: 'response', content: '📅 September 2024 - Present' },
    { type: 'response', content: '📍 Bengaluru, India' },
    { type: 'response', content: '' },
    { type: 'response', content: '• Developing automation solutions for network infrastructure' },
    { type: 'response', content: '• Working with Python, FastAPI, and testing frameworks' },
    { type: 'response', content: '• Collaborating with global teams on enterprise solutions' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'highlight', content: '🏢 Evolvision IT Solutions' },
    { type: 'info', content: 'Software Developer Intern' },
    { type: 'response', content: '📅 Jan 2024 - Apr 2024' },
    { type: 'response', content: '' },
    { type: 'response', content: '• Built full-stack applications using React & Spring Boot' },
    { type: 'response', content: '• Implemented RESTful APIs and database solutions' },
    { type: 'suggestions', suggestions: ['skills', 'projects', 'contact'] }
  ];

  const handleNavigation = (page) => {
    const pageMap = {
      'home': '/',
      'projects': '/projects',
      'albums': '/albums',
      'photos': '/albums',
      'contact': '/contact',
      'gallery': '/albums'
    };

    const targetPage = pageMap[page];
    
    if (targetPage) {
      setTimeout(() => {
        navigate(targetPage);
        setIsTerminalOpen(false);
      }, 500);
      
      return [
        { type: 'success', content: `🧭 Navigating to ${page}...` },
        { type: 'system', content: 'Redirecting you now! ✨' }
      ];
    }
    
    return [
      { type: 'error', content: `❌ Unknown page: "${page}"` },
      { type: 'info', content: 'Available pages: home, projects, albums, contact' },
      { type: 'suggestions', suggestions: ['go home', 'go projects', 'go contact'] }
    ];
  };

  const handleTheme = () => {
    setTimeout(() => toggleTheme(), 300);
    return [
      { type: 'success', content: '🎨 Switching theme...' },
      { type: 'response', content: `Toggling to ${isDarkMode ? 'light' : 'dark'} mode!` },
      { type: 'system', content: 'Watch the magic happen! ✨' }
    ];
  };

  const getFunResponse = () => {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?' 😄",
      "Why was the JavaScript developer sad? Because he didn't Node how to Express himself! 😂",
      "What's a programmer's favorite hangout place? Foo Bar! 🍺",
      "Why did the developer go broke? Because he used up all his cache! 💸"
    ];
    
    return [
      { type: 'response', content: jokes[Math.floor(Math.random() * jokes.length)] },
      { type: 'info', content: "Hope that made you smile! 😊" },
      { type: 'highlight', content: "Now, how about checking out Nihar's projects? They're even better than my jokes!" },
      { type: 'suggestions', suggestions: ['projects', 'about', 'contact'] }
    ];
  };

  const getWhyHireResponse = () => [
    { type: 'success', content: '🌟 Why Work with Nihar?' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'response', content: "Great question! Here's what makes Nihar stand out:" },
    { type: 'info', content: '' },
    { type: 'highlight', content: '🚀 Technical Excellence' },
    { type: 'response', content: '• Full-stack expertise with modern technologies' },
    { type: 'response', content: '• Currently working at Cisco on enterprise solutions' },
    { type: 'response', content: '• Strong foundation in Java, Python, React, Spring Boot' },
    { type: 'info', content: '' },
    { type: 'highlight', content: '💡 Problem Solver' },
    { type: 'response', content: '• Smart India Hackathon 2024 Finalist' },
    { type: 'response', content: '• Built 10+ real-world projects' },
    { type: 'response', content: '• Passionate about clean, efficient code' },
    { type: 'info', content: '' },
    { type: 'highlight', content: '🤝 Team Player' },
    { type: 'response', content: '• Excellent communication skills' },
    { type: 'response', content: '• Quick learner and adaptable' },
    { type: 'response', content: '• Collaborative mindset' },
    { type: 'system', content: '─────────────────────────────────────' },
    { type: 'success', content: "🎯 Don't miss out! Type 'send message' to connect with Nihar!" },
    { type: 'suggestions', suggestions: ['send message', 'projects', 'experience'] }
  ];

  // RECRUITER-FOCUSED RESPONSE - Designed to convert visitors to contacts
  const getRecruiterResponse = (query) => {
    const lower = query.toLowerCase();
    
    // Availability questions
    if (/available|open\s*to|looking\s*for/i.test(lower)) {
      return [
        { type: 'success', content: '💼 Availability & Opportunities' },
        { type: 'system', content: '─────────────────────────────────────' },
        { type: 'response', content: "Yes! Nihar is always open to exciting opportunities." },
        { type: 'info', content: '' },
        { type: 'highlight', content: '📍 Current Status:' },
        { type: 'response', content: '• Currently: Software Automation Engineer @ Cisco' },
        { type: 'response', content: '• Location: Bengaluru, India' },
        { type: 'response', content: '• Open to: Full-time roles, Remote opportunities' },
        { type: 'info', content: '' },
        { type: 'highlight', content: '🎯 Interested In:' },
        { type: 'response', content: '• Software Development / Full-Stack roles' },
        { type: 'response', content: '• Backend Engineering positions' },
        { type: 'response', content: '• DevOps / Automation opportunities' },
        { type: 'response', content: '• Challenging projects with growth potential' },
        { type: 'system', content: '─────────────────────────────────────' },
        { type: 'success', content: "📧 Let's connect! Type 'send message' to reach out directly." },
        { type: 'suggestions', suggestions: ['send message', 'experience', 'skills', 'projects'] }
      ];
    }
    
    // Resume/CV request
    if (/resume|cv|portfolio/i.test(lower)) {
      return [
        { type: 'success', content: '📄 Resume & Portfolio' },
        { type: 'system', content: '─────────────────────────────────────' },
        { type: 'response', content: "You're looking at Nihar's interactive portfolio right now! 🎉" },
        { type: 'info', content: '' },
        { type: 'highlight', content: '📋 Quick Overview:' },
        { type: 'response', content: '• B.Tech Computer Science (2024) - SOA University' },
        { type: 'response', content: '• Current: Software Automation Engineer @ Cisco' },
        { type: 'response', content: '• 8+ Production-Ready Projects' },
        { type: 'response', content: '• Smart India Hackathon 2024 Finalist' },
        { type: 'info', content: '' },
        { type: 'highlight', content: '🔗 Quick Links:' },
        { type: 'link', content: '💼 LinkedIn Profile', href: 'https://linkedin.com/in/nihar-sahu' },
        { type: 'link', content: '🐙 GitHub Portfolio', href: 'https://github.com/Nihar4569' },
        { type: 'info', content: '' },
        { type: 'success', content: "📧 Want the detailed resume? Type 'send message' to request!" },
        { type: 'suggestions', suggestions: ['send message', 'skills', 'projects', 'experience'] }
      ];
    }
    
    // Interview/Schedule
    if (/interview|schedule|call|meet|discuss/i.test(lower)) {
      return [
        { type: 'success', content: '📅 Schedule a Conversation' },
        { type: 'system', content: '─────────────────────────────────────' },
        { type: 'response', content: "Nihar would love to discuss opportunities with you!" },
        { type: 'info', content: '' },
        { type: 'highlight', content: '📞 How to Connect:' },
        { type: 'response', content: "• Send a message through this chat (type 'send message')" },
        { type: 'response', content: '• Email: nihar4569@gmail.com' },
        { type: 'response', content: '• LinkedIn: linkedin.com/in/nihar-sahu' },
        { type: 'info', content: '' },
        { type: 'response', content: '⏰ Response Time: Usually within 24 hours' },
        { type: 'response', content: '🌍 Time Zone: IST (UTC+5:30)' },
        { type: 'system', content: '─────────────────────────────────────' },
        { type: 'success', content: "🚀 Ready to chat? Type 'send message' now!" },
        { type: 'suggestions', suggestions: ['send message', 'about', 'experience'] }
      ];
    }
    
    // Salary/Compensation
    if (/salary|compensation|expectation|ctc|package/i.test(lower)) {
      return [
        { type: 'success', content: '💰 Compensation Discussion' },
        { type: 'system', content: '─────────────────────────────────────' },
        { type: 'response', content: "Compensation is best discussed based on the specific role and responsibilities." },
        { type: 'info', content: '' },
        { type: 'highlight', content: '💡 Nihar values:' },
        { type: 'response', content: '• Challenging and impactful work' },
        { type: 'response', content: '• Growth opportunities and learning' },
        { type: 'response', content: '• Good team culture and work-life balance' },
        { type: 'response', content: '• Competitive compensation aligned with market' },
        { type: 'info', content: '' },
        { type: 'success', content: "📧 Let's discuss! Type 'send message' to start a conversation." },
        { type: 'suggestions', suggestions: ['send message', 'experience', 'skills'] }
      ];
    }
    
    // Remote/Location
    if (/remote|onsite|hybrid|relocate|location|wfh/i.test(lower)) {
      return [
        { type: 'success', content: '🌍 Work Location Preferences' },
        { type: 'system', content: '─────────────────────────────────────' },
        { type: 'response', content: "Nihar is flexible with work arrangements!" },
        { type: 'info', content: '' },
        { type: 'highlight', content: '📍 Current:' },
        { type: 'response', content: '• Based in: Bengaluru, India' },
        { type: 'response', content: '• Currently: Hybrid at Cisco' },
        { type: 'info', content: '' },
        { type: 'highlight', content: '✅ Open to:' },
        { type: 'response', content: '• Remote positions (global)' },
        { type: 'response', content: '• Hybrid roles' },
        { type: 'response', content: '• Onsite in Bengaluru' },
        { type: 'response', content: '• Relocation for the right opportunity' },
        { type: 'system', content: '─────────────────────────────────────' },
        { type: 'success', content: "📧 Discuss specifics? Type 'send message'!" },
        { type: 'suggestions', suggestions: ['send message', 'experience', 'about'] }
      ];
    }
    
    // Notice Period
    if (/notice\s*period|joining|start|when.*available|immediate/i.test(lower)) {
      return [
        { type: 'success', content: '⏰ Availability & Notice Period' },
        { type: 'system', content: '─────────────────────────────────────' },
        { type: 'response', content: "For current notice period and availability details:" },
        { type: 'info', content: '' },
        { type: 'highlight', content: "📧 Please reach out directly to discuss:" },
        { type: 'response', content: '• Current notice period' },
        { type: 'response', content: '• Earliest joining date' },
        { type: 'response', content: '• Flexibility for urgent requirements' },
        { type: 'system', content: '─────────────────────────────────────' },
        { type: 'success', content: "🚀 Type 'send message' to get this information!" },
        { type: 'suggestions', suggestions: ['send message', 'experience', 'contact'] }
      ];
    }
    
    // Default recruiter response
    return [
      { type: 'success', content: '👋 Hello, Recruiter!' },
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'response', content: "Thanks for your interest in Nihar! Here's a quick summary:" },
      { type: 'info', content: '' },
      { type: 'highlight', content: '🎯 Quick Facts:' },
      { type: 'response', content: '• Role: Software Automation Engineer @ Cisco' },
      { type: 'response', content: '• Experience: Full-Stack Development, Automation' },
      { type: 'response', content: '• Tech: Java, Python, React, Spring Boot, FastAPI' },
      { type: 'response', content: '• Education: B.Tech CSE (2024) - SOA University' },
      { type: 'info', content: '' },
      { type: 'highlight', content: '🏆 Highlights:' },
      { type: 'response', content: '• Smart India Hackathon 2024 Finalist' },
      { type: 'response', content: '• 8+ Production Projects (see: FIR Vault, CareSync)' },
      { type: 'response', content: '• Currently at Cisco - Enterprise Automation' },
      { type: 'info', content: '' },
      { type: 'highlight', content: '✅ Open to: Full-time, Remote, Challenging roles' },
      { type: 'system', content: '─────────────────────────────────────' },
      { type: 'success', content: "🚀 Interested? Type 'send message' to connect!" },
      { type: 'highlight', content: "Or explore: 'projects', 'skills', 'experience'" },
      { type: 'suggestions', suggestions: ['send message', 'projects', 'skills', 'why hire'] }
    ];
  };

  const getSmartResponse = (query) => {
    // AI-like contextual responses for unknown queries
    const responses = [
      {
        keywords: ['available', 'free', 'freelance', 'open'],
        response: [
          { type: 'response', content: "Nihar is currently working at Cisco, but he's always open to interesting opportunities and collaborations!" },
          { type: 'highlight', content: "💡 Type 'contact' to discuss potential opportunities." },
          { type: 'suggestions', suggestions: ['contact', 'experience', 'about'] }
        ]
      },
      {
        keywords: ['rate', 'cost', 'price', 'charge', 'salary'],
        response: [
          { type: 'response', content: "For discussions about compensation or project rates, it's best to reach out directly to Nihar." },
          { type: 'highlight', content: "📧 Type 'contact' to start a conversation!" },
          { type: 'suggestions', suggestions: ['contact', 'projects'] }
        ]
      },
      {
        keywords: ['location', 'where', 'based', 'city', 'country'],
        response: [
          { type: 'response', content: "Nihar is based in Bengaluru, India 🇮🇳" },
          { type: 'info', content: "He works at Cisco's Bengaluru office and is open to remote collaborations globally!" },
          { type: 'suggestions', suggestions: ['experience', 'contact'] }
        ]
      },
      {
        keywords: ['hobby', 'hobbies', 'interest', 'free time', 'fun'],
        response: [
          { type: 'response', content: "When not coding, Nihar enjoys:" },
          { type: 'info', content: "📸 Photography - Check out his photo albums!" },
          { type: 'info', content: "🎮 Gaming & Tech exploration" },
          { type: 'info', content: "📚 Learning new technologies" },
          { type: 'suggestions', suggestions: ['go albums', 'about', 'projects'] }
        ]
      },
      {
        keywords: ['strength', 'strong', 'best', 'good at'],
        response: [
          { type: 'success', content: '💪 Key Strengths' },
          { type: 'response', content: '• Full-Stack Development expertise' },
          { type: 'response', content: '• Quick learner - adapts to new technologies fast' },
          { type: 'response', content: '• Problem solver - loves debugging complex issues' },
          { type: 'response', content: '• Team player with excellent communication' },
          { type: 'response', content: '• Automation mindset - optimize everything!' },
          { type: 'suggestions', suggestions: ['skills', 'projects', 'experience'] }
        ]
      },
      {
        keywords: ['weakness', 'improve', 'growth', 'learning'],
        response: [
          { type: 'success', content: '📈 Growth Areas' },
          { type: 'response', content: "Nihar believes in continuous improvement:" },
          { type: 'info', content: '• Currently deepening expertise in cloud architecture' },
          { type: 'info', content: '• Exploring AI/ML for practical applications' },
          { type: 'info', content: '• Always striving for cleaner, more efficient code' },
          { type: 'highlight', content: '💡 "Never stop learning" is his motto!' },
          { type: 'suggestions', suggestions: ['skills', 'about'] }
        ]
      },
      {
        keywords: ['team', 'collaborate', 'work with', 'colleague'],
        response: [
          { type: 'success', content: '🤝 Team Collaboration' },
          { type: 'response', content: 'Nihar thrives in collaborative environments!' },
          { type: 'info', content: '• Currently collaborating with global teams at Cisco' },
          { type: 'info', content: '• Led teams in hackathon projects (SIH 2024 Finalist)' },
          { type: 'info', content: '• Values knowledge sharing and code reviews' },
          { type: 'info', content: '• Experience with Agile/Scrum methodologies' },
          { type: 'suggestions', suggestions: ['experience', 'projects', 'send message'] }
        ]
      },
      {
        keywords: ['challenge', 'difficult', 'hard', 'problem'],
        response: [
          { type: 'success', content: '🎯 Handling Challenges' },
          { type: 'response', content: 'Nihar approaches challenges methodically:' },
          { type: 'info', content: '1. Break down complex problems into smaller parts' },
          { type: 'info', content: '2. Research and explore multiple solutions' },
          { type: 'info', content: '3. Implement, test, and iterate' },
          { type: 'info', content: '4. Document learnings for the team' },
          { type: 'highlight', content: '💡 Check out his projects to see problem-solving in action!' },
          { type: 'suggestions', suggestions: ['projects', 'fir vault', 'caresync'] }
        ]
      },
      {
        keywords: ['goal', 'future', 'plan', 'aspire', 'ambition'],
        response: [
          { type: 'success', content: '🚀 Future Goals' },
          { type: 'response', content: "Nihar's career aspirations:" },
          { type: 'info', content: '• Lead impactful engineering projects' },
          { type: 'info', content: '• Contribute to open-source communities' },
          { type: 'info', content: '• Build products that solve real-world problems' },
          { type: 'info', content: '• Mentor and help upcoming developers' },
          { type: 'suggestions', suggestions: ['about', 'experience', 'send message'] }
        ]
      },
      {
        keywords: ['thank', 'thanks', 'awesome', 'great', 'cool', 'nice', 'amazing'],
        response: [
          { type: 'success', content: '😊 Thanks for the kind words!' },
          { type: 'response', content: "I'm glad I could help!" },
          { type: 'info', content: "Is there anything else you'd like to know about Nihar?" },
          { type: 'suggestions', suggestions: ['about', 'projects', 'send message'] }
        ]
      },
      {
        keywords: ['bye', 'goodbye', 'see you', 'later', 'exit'],
        response: [
          { type: 'success', content: '👋 Goodbye!' },
          { type: 'response', content: "Thanks for visiting Nihar's portfolio!" },
          { type: 'highlight', content: "Feel free to come back anytime. Best of luck! 🍀" },
          { type: 'info', content: "Don't forget to connect on LinkedIn if you haven't!" },
          { type: 'suggestions', suggestions: ['social', 'send message'] }
        ]
      }
    ];

    for (const resp of responses) {
      if (resp.keywords.some(k => query.includes(k))) {
        return resp.response;
      }
    }

    // Default intelligent response
    return [
      { type: 'response', content: `Hmm, I'm not sure about "${query}", but I'd love to help!` },
      { type: 'info', content: "Here's what I can tell you about:" },
      { type: 'response', content: "• Nihar's background and experience" },
      { type: 'response', content: "• His technical skills and projects" },
      { type: 'response', content: "• How to get in touch with him" },
      { type: 'highlight', content: "💡 Try 'help' for all available commands!" },
      { type: 'success', content: "Or better yet, type 'contact' to ask Nihar directly! 🎯" },
      { type: 'suggestions', suggestions: ['help', 'about', 'contact'] }
    ];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    playMessage();
    const currentInput = input;
    // Clear input immediately
    setInput('');
    setHistoryIndex(-1);
    
    // Process the command
    processCommand(currentInput);
    
    // Refocus input after processing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleToggle = () => {
    if (isTerminalOpen) {
      playTerminalClose();
      setIsClosing(true);
      setTimeout(() => {
        setIsTerminalOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsTerminalOpen(true);
    }
  };

  const handleChipClick = (suggestion) => {
    playClick();
    // Clear input first
    setInput('');
    // Process command
    processCommand(suggestion);
    // Refocus input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Render output line based on type
  const renderOutput = (item, index) => {
    switch (item.type) {
      case 'ascii':
        return <AsciiArt key={index}>{item.content}</AsciiArt>;
      
      case 'command':
        return (
          <OutputLine key={index} $type="command">
            <CommandPrefix>❯</CommandPrefix>
            {item.content}
          </OutputLine>
        );
      
      case 'suggestions':
        return (
          <SuggestionChips key={index}>
            {item.suggestions.map((s, i) => (
              <Chip key={i} onClick={() => handleChipClick(s)}>{s}</Chip>
            ))}
          </SuggestionChips>
        );
      
      case 'project':
        return (
          <ProjectCard key={index}>
            <ProjectTitle>🚀 {item.project.title}</ProjectTitle>
            <ProjectDesc>{item.project.description.substring(0, 100)}...</ProjectDesc>
            <TechStackText>
              {item.project.techStack.slice(0, 4).join(' • ')}
            </TechStackText>
          </ProjectCard>
        );
      
      case 'skill':
        return (
          <SkillBar key={index}>
            <SkillName>{item.skill.name}</SkillName>
            <SkillProgress>
              <SkillFill $level={item.skill.level} />
            </SkillProgress>
            <SkillLevelText>{item.skill.level}%</SkillLevelText>
          </SkillBar>
        );
      
      case 'link':
        return (
          <OutputLine key={index} $type="info">
            <Link href={item.href} target="_blank" rel="noopener noreferrer">
              {item.content}
            </Link>
          </OutputLine>
        );
      
      default:
        return (
          <OutputLine key={index} $type={item.type}>
            {item.content}
          </OutputLine>
        );
    }
  };

  return (
    <>
      <TerminalOverlay $isOpen={isTerminalOpen} onClick={handleToggle} />
      
      <TerminalContainer $isOpen={isTerminalOpen} $isClosing={isClosing}>
        <TerminalHeader>
          <HeaderLeft>
            <StatusDot />
            <TerminalTitle>NIHAR-AI</TerminalTitle>
          </HeaderLeft>
          <HeaderButtons>
            <HeaderButton onClick={() => setHistory([])} title="Clear" />
            <HeaderButton title="Minimize" />
            <HeaderButton onClick={handleToggle} title="Close" />
          </HeaderButtons>
        </TerminalHeader>
        
        <TerminalBody ref={bodyRef}>
          {history.map((item, index) => renderOutput(item, index))}
          {isTyping && (
            <TypingIndicator>
              <span /><span /><span />
            </TypingIndicator>
          )}
        </TerminalBody>
        
        <InputContainer>
          <InputPrefix>❯</InputPrefix>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flex: 1, gap: '10px' }}>
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isTyping}
            />
            <SendButton type="submit" disabled={isTyping || !input.trim()}>
              Send
            </SendButton>
          </form>
        </InputContainer>
      </TerminalContainer>
      
      <TerminalToggle onClick={handleToggle} $isOpen={isTerminalOpen}>
        <TerminalIcon $isOpen={isTerminalOpen}>
          {isTerminalOpen ? '✕' : '💬'}
        </TerminalIcon>
      </TerminalToggle>
    </>
  );
};

export default SmartTerminal;
