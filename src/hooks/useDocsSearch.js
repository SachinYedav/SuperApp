import { useState, useEffect, useCallback } from 'react';
import { DOCS_SEARCH_INDEX } from '@/config/docsSearchMap';

export function useDocsSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback((searchTerm) => {
    if (!searchTerm) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    
    // Fuzzy matching logic for Docs
    const filtered = DOCS_SEARCH_INDEX.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerTerm);
      const keywordMatch = item.keywords.includes(lowerTerm);
      const groupMatch = item.group.toLowerCase().includes(lowerTerm);
      return titleMatch || keywordMatch || groupMatch; 
    }).slice(0, 6); // Top 6 results

    setResults(filtered);
    setIsSearching(false);
  }, []);

  // Debounce Effect (200ms)
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      performSearch(query);
    }, 200);
    return () => clearTimeout(handler);
  }, [query, performSearch]);

  return { query, setQuery, results, isSearching };
}