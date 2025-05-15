import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Select, Slider, Button } from 'antd';
import 'antd/dist/reset.css';

const { Option } = Select;

const App = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [allPrices, setAllPrices] = useState([0, 1000]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFiltered(data);
        const uniqueCategories = [...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
        const prices = data.map(p => p.price);
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        setPriceRange([min, max]);
        setAllPrices([min, max]);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFiltered(result);
  }, [selectedCategory, priceRange, products]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange(allPrices);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Product Store</h1>

      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Select
          placeholder="Select category"
          onChange={value => setSelectedCategory(value)}
          style={{ width: 200 }}
          value={selectedCategory}
          allowClear
        >
          {categories.map(cat => (
            <Option key={cat} value={cat}>{cat}</Option>
          ))}
        </Select>

        <Slider
          range
          min={allPrices[0]}
          max={allPrices[1]}
          step={1}
          value={priceRange}
          onChange={setPriceRange}
          style={{ width: 300 }}
        />

        <Button onClick={clearFilters}>Clear Filters</Button>
      </div>

      <Row gutter={[16, 16]}>
        {filtered.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              cover={<img alt={product.title} src={product.image} style={{ height: 200, objectFit: 'contain' }} />}
            >
              <Card.Meta title={product.title} description={`$${product.price}`} />
              <p style={{ marginTop: 10 }}>{product.description.slice(0, 50)}...</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default App;
