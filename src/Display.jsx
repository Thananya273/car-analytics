// src/Display.jsx
import React, { useState } from 'react';
import { useLocalStorage } from 'react-use';
import carData from './carData.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Ensure Bootstrap JavaScript is included

const LOCAL_STORAGE_KEY = 'highlightedCars';

const Display = () => {
  const [highlightedCars] = useLocalStorage(LOCAL_STORAGE_KEY, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const brands = Object.keys(carData);

  const cars = Object.keys(carData).flatMap((brand) =>
    Object.keys(carData[brand]).map((model) => ({
      ...carData[brand][model],
      brand,
      model,
      isHighlighted: highlightedCars.includes(`${brand}-${model}`),
    }))
  );

  const highlightedCarItems = cars.filter((car) => car.isHighlighted);

  const filteredCars = cars.filter((car) => {
    const matchesSearch = `${car.brand} ${car.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || car.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const renderCarouselItems = (carItems) => {
    const itemsPerSlide = 3; // Number of cards per carousel slide
    const carouselItems = [];

    for (let i = 0; i < carItems.length; i += itemsPerSlide) {
      carouselItems.push(
        <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={i}>
          <div className="row">
            {carItems.slice(i, i + itemsPerSlide).map((car) => (
              <div className="col-md-4 mb-4" key={`${car.brand}-${car.model}`}>
                <div className="card h-100 border-info">
                  <img
                    src={car.image}
                    className="card-img-top"
                    alt={`${car.brand} ${car.model}`}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{`${car.brand} ${car.model}`}</h5>
                    <p className="card-text">
                      <strong>Price:</strong> {car.price.toLocaleString()} Baht<br />
                      <strong>Count:</strong> {car.count}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return carouselItems;
  };

  return (
    <div className="container mt-4">
      <style>
        {`
          .jumbotron {
            background: url("https://images.unsplash.com/photo-1524578772239-fee1bf4805af?q=80&w=3484&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") no-repeat center center; 
            background-size: cover;
          }
        `}
      </style>
      
      <div className="jumbotron">
        <h1 className="text-center mb-4" style={{ color: 'white' }}>Highlighted Cars</h1>
      </div>
      <div class="text-end">
        <a href="/setting" class="btn btn-warning">
          <i class="bi bi-pen-fill"></i> Edit
        </a>
      </div>
      {highlightedCarItems.length > 0 ? (
        <div id="highlightedCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {renderCarouselItems(highlightedCarItems)}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#highlightedCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#highlightedCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      ) : (
        <p className="text-center">No highlighted cars to display.</p>
      )}
      <br></br>
      <h1 className="text-center mb-4">All Cars <i class="bi bi-car-front-fill"></i> </h1> 
      <hr></hr>
      <br></br>

      {/* Dropdown button and search bar */}
      <div className="input-group mb-4">
        <div className="dropdown me-2">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="brandDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedBrand === 'all' ? 'All Brands' : selectedBrand}
          </button>
          <ul className="dropdown-menu" aria-labelledby="brandDropdown">
            <li>
              <button className="dropdown-item" onClick={() => setSelectedBrand('all')}>
                All Brands
              </button>
            </li>
            {brands.map((brand) => (
              <li key={brand}>
                <button className="dropdown-item" onClick={() => setSelectedBrand(brand)}>
                  {brand}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by brand or model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-success" onClick={() => setSearchQuery(searchTerm)}>
          Search
        </button>
      </div>

      <div className="row">
        {filteredCars.map((car) => (
          <div className="col-md-3 mb-4" key={`${car.brand}-${car.model}`}>
            <div className={`card h-100 ${car.isHighlighted ? 'border-info' : ''}`}>
              <img
                src={car.image}
                className="card-img-top"
                alt={`${car.brand} ${car.model}`}
              />
              <div className="card-body">
                <h5 className="card-title">{`${car.brand} ${car.model}`}</h5>
                <p className="card-text">
                  <strong>Price:</strong> {car.price.toLocaleString()} Baht<br />
                  <strong>Count:</strong> {car.count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Display;
