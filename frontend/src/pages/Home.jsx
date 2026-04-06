import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const Home = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data.data); // data payload from express
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="home-mobile-hero-banner d-lg-none"></div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-12 px-10-percent">
            <div className="row hot-products-row px-xl-6">
              <div className="col-12">
                <h3>Hot Products</h3>
              </div>

              {loading ? (
                <div className="col-12"><p>Loading products...</p></div>
              ) : products && products.length > 0 ? (
                products.map((product) => (
                  <div className="col-md-4 hot-product-card" key={product.id || product._id}>
                    <Link to={`/product/${product.id || product._id}`}>
                      <img loading="lazy" src={product.picture} alt={product.name} />
                      <div className="hot-product-card-img-overlay"></div>
                    </Link>
                    <div>
                      <div className="hot-product-card-name">{product.name}</div>
                      <div className="hot-product-card-price">
                        {product.price ? `$${(product.price.units + product.price.nanos / 1000000000).toFixed(2)}` : '$0.00'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12"><p>No products found.</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
