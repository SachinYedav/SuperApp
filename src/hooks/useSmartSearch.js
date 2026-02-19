import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import service from '@/services/database'; 
import { STATIC_SEARCH_INDEX } from '@/config/searchMap';

export function useSmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false); // UI Loader ke liye
  
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?.$id;

  // 1. Fetch History (Local or Cloud) on Load
  useEffect(() => {
    async function loadHistory() {
      setIsFetchingHistory(true);
      if (userId) {
        // Logged In: Appwrite Cloud se top 5 laao
        const historyData = await service.getSearchHistory(userId);
        if (historyData && historyData.documents) {
            // Map icon string back for UI
            setRecentSearches(historyData.documents);
        }
      } else {
        // Guest: Local Storage
        const localHistory = JSON.parse(localStorage.getItem('guest_search_history') || '[]');
        setRecentSearches(localHistory);
      }
      setIsFetchingHistory(false);
    }
    loadHistory();
  }, [userId]); // Jab userId change ho (login/logout) to dobara fetch karo

  // 2. Smart Search Algorithm
  const performSearch = useCallback((searchTerm) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    
    // Fuzzy/Keyword Check
    const filtered = STATIC_SEARCH_INDEX.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerTerm);
      const keywordMatch = item.keywords.includes(lowerTerm);
      return titleMatch || keywordMatch; 
    }).slice(0, 5); 

    setResults(filtered);
    setIsSearching(false);
  }, []);

  // 3. Debounce
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, performSearch]);

  // 4. Save to History Logic (Cloud + Local)
  const addToHistory = async (selectedItem) => {
    // React component (icon) ko string me convert kar rahe hain taaki DB me save ho sake
    const searchDataToSave = {
        title: selectedItem.title,
        path: selectedItem.path || "",
        type: selectedItem.type || "history",
        iconName: selectedItem.icon?.render?.name || "Search", // Extracts icon name from lucide component
    };

    if (userId) {
      // Optimitstic UI Update (Pehle UI update kardo taaki fast lage, fir background me cloud par save karo)
      setRecentSearches(prev => {
          const filtered = prev.filter(i => i.title !== searchDataToSave.title);
          return [searchDataToSave, ...filtered].slice(0, 5);
      });
      
      // Background Appwrite Call
      await service.addSearchHistory(userId, searchDataToSave);
      
    } else {
      // Local Save for Guest
      const updated = [searchDataToSave, ...recentSearches.filter(i => i.title !== searchDataToSave.title)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('guest_search_history', JSON.stringify(updated));
    }
  };

  // 5. Delete Manual History Item
  const deleteHistoryItem = async (e, item) => {
      e.stopPropagation(); // Parent par click trigger hone se rokne ke liye
      
      if (userId && item.$id) {
          // Cloud
          setRecentSearches(prev => prev.filter(i => i.$id !== item.$id)); // Optimistic UI
          await service.deleteSearchHistory(item.$id);
      } else {
          // Local
          const updated = recentSearches.filter(i => i.title !== item.title);
          setRecentSearches(updated);
          localStorage.setItem('guest_search_history', JSON.stringify(updated));
      }
  };

  return { 
      query, 
      setQuery, 
      results, 
      recentSearches, 
      isSearching, 
      isFetchingHistory,
      addToHistory,
      deleteHistoryItem 
  };
}