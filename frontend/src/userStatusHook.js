import { useState, useEffect } from 'react';

const useFetchData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/app/get-resume`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        const result = await response.json();
        if (result.status === 'S') {
          setData(result.data);
        } else {
          setError('Error fetching data');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  return { data, error, loading };
};

export default useFetchData;
