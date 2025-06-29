import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import BiohackCard from './BiohackCard';
import CategoryTabs from './CategoryTabs';
import SearchBar from './SearchBar';
import ProtocolBuilder from './ProtocolBuilder';
import TopNavigation from './TopNavigation';
import './CreateProtocol.css';

const CreateProtocol = () => {
  const navigate = useNavigate();
  const [biohacks, setBiohacks] = useState([]);
  const [filteredBiohacks, setFilteredBiohacks] = useState([]);
  const [selectedHacks, setSelectedHacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch biohacks and categories on component mount
  useEffect(() => {
    fetchBiohacks();
    fetchCategories();
    fetchFavourites();
  }, []);

  // Filter biohacks based on search and category
  useEffect(() => {
    let filtered = biohacks;

    // Filter by category
    if (activeCategory === 'favourites') {
      filtered = biohacks.filter(hack => 
        favourites.some(fav => fav.hack_id === hack.id)
      );
    } else if (activeCategory !== 'all') {
      filtered = biohacks.filter(hack => hack.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(hack =>
        hack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hack.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBiohacks(filtered);
  }, [biohacks, activeCategory, searchQuery, favourites]);

  const fetchBiohacks = async () => {
    try {
      const { data, error } = await supabase
        .from('biohacks')
        .select('*')
        .order('name');

      if (error) throw error;
      setBiohacks(data || []);
      console.log('Fetched biohacks:', data?.length || 0);
    } catch (error) {
      console.error('Error fetching biohacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('biohacks')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;
      
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
      console.log('Fetched categories:', uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFavourites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('hack_favourited')
        .select('hack_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavourites(data || []);
      console.log('Fetched favourites:', data?.length || 0);
    } catch (error) {
      console.error('Error fetching favourites:', error);
    }
  };

  const handleAddToProtocol = (hack) => {
    if (selectedHacks.length >= 8) {
      alert('Maximum 8 biohacks allowed per protocol');
      return;
    }
    
    if (selectedHacks.some(selected => selected.id === hack.id)) {
      alert('This biohack is already in your protocol');
      return;
    }

    setSelectedHacks([...selectedHacks, hack]);
  };

  const handleRemoveFromProtocol = (hackId) => {
    setSelectedHacks(selectedHacks.filter(hack => hack.id !== hackId));
  };

  const handleToggleFavourite = async (hackId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isFavourited = favourites.some(fav => fav.hack_id === hackId);

      if (isFavourited) {
        // Remove from favourites
        const { error } = await supabase
          .from('hack_favourited')
          .delete()
          .eq('user_id', user.id)
          .eq('hack_id', hackId);

        if (error) throw error;
        setFavourites(favourites.filter(fav => fav.hack_id !== hackId));
      } else {
        // Add to favourites
        const { error } = await supabase
          .from('hack_favourited')
          .insert({
            user_id: user.id,
            hack_id: hackId,
            timestamp: new Date().toISOString()
          });

        if (error) throw error;
        setFavourites([...favourites, { hack_id: hackId }]);
      }
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  const handleProtocolSave = async (protocolData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to save protocols');
        return;
      }

      // Check if protocol name is unique for this user
      const { data: existingProtocols } = await supabase
        .from('protocols')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', protocolData.name);

      if (existingProtocols && existingProtocols.length > 0) {
        alert('A protocol with this name already exists');
        return;
      }

      // Insert protocol
      const { data: protocol, error: protocolError } = await supabase
        .from('protocols')
        .insert({
          user_id: user.id,
          name: protocolData.name,
          description: protocolData.description,
          status: protocolData.activated ? 'active' : 'draft',
          created_at: new Date().toISOString(),
          activated_at: protocolData.activated ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (protocolError) throw protocolError;

      // Insert protocol hacks
      const protocolHacks = selectedHacks.map((hack, index) => ({
        protocol_id: protocol.id,
        hack_id: hack.id,
        position: index
      }));

      const { error: hacksError } = await supabase
        .from('protocol_hacks')
        .insert(protocolHacks);

      if (hacksError) throw hacksError;

      alert(protocolData.activated ? 'Protocol created and activated!' : 'Protocol created!');
      navigate('/protocols');
    } catch (error) {
      console.error('Error creating protocol:', error);
      alert('Error creating protocol. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="create-protocol">
        <TopNavigation activePage="create-protocol" />
        <div className="loading">Loading biohacks...</div>
      </div>
    );
  }

  return (
    <div className="create-protocol">
      <TopNavigation activePage="create-protocol" />
      
      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-filter-container">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search biohacks..."
          />
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </div>

      {/* Biohacks Grid */}
      <div className="biohacks-grid-container">
        <div className="biohacks-grid">
          {filteredBiohacks.map((hack) => (
            <BiohackCard
              key={hack.id}
              hack={hack}
              isFavourited={favourites.some(fav => fav.hack_id === hack.id)}
              isSelected={selectedHacks.some(selected => selected.id === hack.id)}
              onAddToProtocol={handleAddToProtocol}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      </div>

      {/* Protocol Builder Bar */}
      <ProtocolBuilder
        selectedHacks={selectedHacks}
        onRemoveHack={handleRemoveFromProtocol}
        onSaveProtocol={handleProtocolSave}
        onNavigateToMyProtocols={() => navigate('/protocols/my')}
      />
    </div>
  );
};

export default CreateProtocol; 