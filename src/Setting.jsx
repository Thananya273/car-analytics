// src/Setting.js
import React, { useState } from 'react';
import carData from './carData.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import { useLocalStorage } from 'react-use';

const LOCAL_STORAGE_KEY = 'highlightedCars';

const Setting = () => {
  const [highlightedCars, setHighlightedCars] = useLocalStorage(LOCAL_STORAGE_KEY, []);
  const [filter, setFilter] = useState('all'); // State to manage the filter
  const [searchTerm, setSearchTerm] = useState(''); // State to manage search input
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query after button click

  const brands = Object.keys(carData);

  const handleHighlight = (brand, model) => {
    const carId = `${brand}-${model}`;
    if (!highlightedCars.includes(carId)) {
      setHighlightedCars([...highlightedCars, carId]);
    }
  };

  const handleUnhighlight = (brand, model) => {
    const carId = `${brand}-${model}`;
    if (highlightedCars.includes(carId)) {
      setHighlightedCars(highlightedCars.filter((id) => id !== carId));
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm); // Update the search query when the button is clicked
  };

  const filteredCars = (brand, model) => {
    const carId = `${brand}-${model}`;
    if (filter === 'highlighted' && !highlightedCars.includes(carId)) return false;
    if (filter === 'unhighlighted' && highlightedCars.includes(carId)) return false;
    if (searchQuery && !`${brand} ${model}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4"> <i class="bi bi-gear-fill"></i> Display Settings</h1>
      
      {/* Search bar*/}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by brand or model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleSearch}>
          Search
        </button>
      </div>
      
      {/* group for filtering */}
      <div className="btn-group btn-group-toggle mb-4" data-toggle="buttons">
        <label className={`btn btn-secondary ${filter === 'all' ? 'active' : ''}`}>
          <input
            type="radio"
            name="options"
            id="option1"
            autoComplete="off"
            checked={filter === 'all'}
            onChange={() => setFilter('all')}
          /> All
        </label>
        <label className={`btn btn-secondary ${filter === 'highlighted' ? 'active' : ''}`}>
          <input
            type="radio"
            name="options"
            id="option2"
            autoComplete="off"
            checked={filter === 'highlighted'}
            onChange={() => setFilter('highlighted')}
          /> Highlighted
        </label>
        <label className={`btn btn-secondary ${filter === 'unhighlighted' ? 'active' : ''}`}>
          <input
            type="radio"
            name="options"
            id="option3"
            autoComplete="off"
            checked={filter === 'unhighlighted'}
            onChange={() => setFilter('unhighlighted')}
          /> Unhighlighted
        </label>
      </div>
      
      <div className="row">
        {brands.map((brand) =>
          Object.keys(carData[brand]).map((model) => {
            const carId = `${brand}-${model}`;
            const isHighlighted = highlightedCars.includes(carId);

            if (!filteredCars(brand, model)) return null; // Apply the filter and search

            return (
              <div className="col-md-3 mb-4" key={carId}>
                <div className={`card h-100 ${isHighlighted ? 'border-info' : ''}`}>
                  <img
                    src={carData[brand][model].image}
                    className="card-img-top"
                    alt={`${brand} ${model}`}
                  />
                  <div className="card-body d-flex flex-column">
                    <div className="mb-3">
                      <h5 className="card-title">{`${brand} ${model}`}</h5>
                      <p className="card-text">
                        <strong>Price:</strong> {carData[brand][model].price.toLocaleString()} Baht<br />
                        <strong>Count:</strong> {carData[brand][model].count}
                      </p>
                    </div>
                    <div className="mt-auto text-end">
                      <button
                        className={`btn ${isHighlighted ? 'btn-warning' : 'btn-outline-info'}`}
                        onClick={() => isHighlighted ? handleUnhighlight(brand, model) : handleHighlight(brand, model)}
                      >
                        <i className={`bi ${isHighlighted ? 'bi-pin-fill' : 'bi-pin'}`}></i>
                        {isHighlighted ? ' Unhighlight' : ' Highlight'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Setting;
