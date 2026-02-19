import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  FileJson, Type, Code, Shield, Search, Key, Terminal 
} from 'lucide-react';

// Shared Layout
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import Seo from '@/components/seo/Seo';
import { devToolsSeo } from '@/config/seoData';

// Components
import JsonFormatter from './components/JsonFormatter';
import TextUtils from './components/TextUtils';
import Base64Encoder from './components/Base64Encoder';
import PasswordGen from './components/PasswordGen';
import JwtDecoder from './components/JwtDecoder';
import RegexTester from './components/RegexTester';

const TOOLS = [
  { id: 'json', label: 'JSON', icon: FileJson, desc: 'Format & Validate' },
  { id: 'text', label: 'Text', icon: Type, desc: 'Convert & Analyze' },
  { id: 'base64', label: 'Base64', icon: Code, desc: 'Encode/Decode' },
  { id: 'jwt', label: 'JWT', icon: Key, desc: 'Decode Tokens' },
  { id: 'regex', label: 'Regex', icon: Search, desc: 'Test Patterns' },
  { id: 'pass', label: 'Password', icon: Shield, desc: 'Generator' },
];

export default function TextTools() {
  const { tab } = useParams(); 
  const activeTool = tab || devToolsSeo.defaultTab;
  const currentMeta = devToolsSeo.tabs[activeTool] || devToolsSeo.tabs[devToolsSeo.defaultTab];

  return (
    <>
    <Seo 
      title={currentMeta.title}
      description={currentMeta.description}
      keywords={currentMeta.keywords}
      url={`${devToolsSeo.basePath}/${activeTool}`}
      type={devToolsSeo.type} 
    />
    <ToolPageLayout
      title="DevTools"
      subtitle="Utilities for Developers"
      icon={Terminal}
      themeColor="blue"
      tabs={TOOLS}
      activeTab={activeTool}
      basePath="/dev-tools"
    >
      {activeTool === 'json' && <JsonFormatter />}
      {activeTool === 'text' && <TextUtils />}
      {activeTool === 'base64' && <Base64Encoder />}
      {activeTool === 'jwt' && <JwtDecoder />}
      {activeTool === 'regex' && <RegexTester />}
      {activeTool === 'pass' && <PasswordGen />}
    </ToolPageLayout>
    </>
  );
}