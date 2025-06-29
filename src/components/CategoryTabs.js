import React from 'react';
import './CategoryTabs.css';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  const allCategories = ['all', 'favourites', ...categories];

  return (
    <div className="category-tabs">
      <div className="tabs-container">
        {allCategories.map((category) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category === 'all' ? 'All' : 
             category === 'favourites' ? 'Favourites' : 
             category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs; 