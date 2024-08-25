import React, { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import carData from './carData.json';
import './App.css'; // Import App.css for custom styles

const Dashboard = () => {
  const [tab, setTab] = useState(0);
  const [openRows, setOpenRows] = useState({});

  const brands = Object.keys(carData);

  // Create a set of all unique models across all brands
  const allModels = [...new Set(brands.flatMap(brand => Object.keys(carData[brand])))];

  const brandCounts = brands.map(
    brand => Object.values(carData[brand]).reduce((total, { count }) => total + count, 0)
  );

  const doughnutData = {
    labels: brands,
    datasets: [{
      data: brandCounts,
      backgroundColor: ['#9bd1d4', '#078d95', '#022a2c'],
    }],
  };

  const barData = {
    labels: allModels,
    datasets: brands.map((brand, index) => ({
      label: brand,
      data: allModels.map(model => carData[brand]?.[model]?.count || 0),
      backgroundColor: ['#9bd1d4', '#078d95', '#022a2c'][index % 3],
    })),
  };

  const barConfig = {
    type: 'bar',
    data: barData,
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Car Models by Brand'
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
        }
      }
    }
  };

  const handleTabChange = (event, newValue) => setTab(newValue);
  const handleRowClick = (brand) => setOpenRows(prev => ({ ...prev, [brand]: !prev[brand] }));

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4"><i class="bi bi-clipboard-data"></i> Dashboard</h1>

      <Tabs value={tab} onChange={handleTabChange} aria-label="dashboard-tabs">
        <Tab label="Table" />
        <Tab label="Charts" />
      </Tabs>

      {tab === 0 && (
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="table-header" style={{ backgroundColor: '#022a2c', color: '#FFFFFF' }}>Brand</TableCell>
                <TableCell className="table-header" style={{ backgroundColor: '#022a2c', color: '#FFFFFF' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.map((brand) => (
                <React.Fragment key={brand}>
                  <TableRow>
                    <TableCell>
                      <IconButton onClick={() => handleRowClick(brand)} aria-expanded={openRows[brand] ? 'true' : 'false'}>
                        {openRows[brand] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                      {brand}
                    </TableCell>
                    <TableCell style={{color: '#979797' }}>{openRows[brand] ? '' : 'Expand'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} style={{ padding: 0 }}>
                      <Collapse in={openRows[brand]} timeout="auto" unmountOnExit>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className="table-header" style={{ backgroundColor: '#f5f5f5', color: '#333' }}>Model</TableCell>
                              <TableCell className="table-header" style={{ backgroundColor: '#f5f5f5', color: '#333' }}>Count</TableCell>
                              <TableCell className="table-header" style={{ backgroundColor: '#f5f5f5', color: '#333' }}>Price (Baht)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.keys(carData[brand]).map(model => (
                              <TableRow key={model}>
                                <TableCell>{model}</TableCell>
                                <TableCell>{carData[brand][model].count}</TableCell>
                                <TableCell>{carData[brand][model].price.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 1 && (
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="chart-container">
              <h2 className="text-center">Car Distribution by Brand</h2>
              <Doughnut data={doughnutData} options={{ cutout: '50%' }} />
            </div>
          </div>
          <div className="col-md-8 mb-4">
            <div className="chart-container">
              <h2 className="text-center">Car Models by Brand</h2>
              <Bar {...barConfig} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
