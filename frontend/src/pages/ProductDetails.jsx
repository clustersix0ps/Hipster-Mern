import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data); // data payload from express
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first to add items to cart.");
      navigate('/login');
      return;
    }
    try {
      await axios.post('/api/cart', {
        item: { productId: id, quantity: 1 }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/cart');
    } catch (err) {
      console.error('Failed to add to cart', err);
      alert("Failed to add to cart");
    }
  };

  if (loading) return <Layout><div className="container mt-5"><p>Loading...</p></div></Layout>;
  if (!product) return <Layout><div className="container mt-5"><p>Product not found.</p></div></Layout>;

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-5">
            <img className="product-image" loading="lazy" src={product.picture} alt={product.name} />
          </div>
          <div className="col-12 col-lg-7">
            <div className="product-info">
              <h2>{product.name}</h2>
              <div className="product-price">
                {product.price ? `$${(product.price.units + product.price.nanos / 1000000000).toFixed(2)}` : '$0.00'}
              </div>
              <p className="product-description">{product.description}</p>
              
              <div className="mt-4">
                <form onSubmit={addToCart}>
                  <button type="submit" className="btn auth-btn-solid">
                    Add to Cart
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
