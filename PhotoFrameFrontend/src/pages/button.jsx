import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';

const FavoriteButton = ({ userId, productId }) => {
  const [favoriteStatus, setFavoriteStatus] = useState(''); // 'added' or 'removed'

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/favorites/${userId}`);
        const isFavorited = response.data.favorites.some(id => id === productId);
        setFavoriteStatus(isFavorited ? 'added' : 'removed');
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavoriteStatus();
  }, [userId, productId]);

  const handleFavoriteAction = async () => {
    try {
      if (favoriteStatus === 'removed') {
        await axios.post(`${API_URL}/add-favorite`, { userId, productId });
        setFavoriteStatus('added');
      } else {
        await axios.post(`${API_URL}/remove-favorite`, { userId, productId });
        setFavoriteStatus('removed');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <button onClick={handleFavoriteAction}>
      {favoriteStatus === 'added' ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
  );
};

export default FavoriteButton;
