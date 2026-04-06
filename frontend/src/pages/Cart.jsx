import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const cartRes = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const cartData = cartRes.data;
        setCart(cartData);

        // Fetch details for each product in the cart
        if (cartData && cartData.items && cartData.items.length > 0) {
          const productPromises = cartData.items.map(item => 
            axios.get(`/api/products/${item.productId}`)
          );
          const productResponses = await Promise.all(productPromises);
          const productsMap = {};
          productResponses.forEach(res => {
            productsMap[res.data.id || res.data._id] = res.data;
          });
          setProducts(productsMap);
        }
      } catch (err) {
        console.error('Failed to load cart', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCartAndProducts();
  }, [navigate]);

  const handleEmptyCart = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart({ items: [] });
    } catch (err) {
      console.error('Failed to empty cart', err);
    }
  };

  if (loading) return <Layout><div className="container mt-5"><p>Loading Cart...</p></div></Layout>;

  let total = 0;
  if (cart && cart.items && cart.items.length > 0) {
    cart.items.forEach(item => {
      const product = products[item.productId];
      if (product && product.price) {
        const price = product.price.units + product.price.nanos / 1000000000;
        total += price * item.quantity;
      }
    });
  }

  return (
    <Layout>
      <div className="container">
        <h3 className="mb-4">Shopping Cart</h3>
        {(!cart || !cart.items || cart.items.length === 0) ? (
          <div>
            <p>Your cart is empty.</p>
            <Link to="/" className="btn auth-btn-solid">Continue Shopping</Link>
          </div>
        ) : (
          <div>
            <div className="row">
              <div className="col-12 col-md-8">
                {cart.items.map((item, index) => {
                  const product = products[item.productId];
                  if (!product) return <div key={index}>Loading item...</div>;
                  const price = product.price.units + product.price.nanos / 1000000000;
                  return (
                    <div className="card mb-3 p-3 shadow-sm" key={index}>
                      <div className="row align-items-center">
                        <div className="col-3">
                          <img src={product.picture} alt={product.name} className="img-fluid" />
                        </div>
                        <div className="col-5">
                          <h5>{product.name}</h5>
                          <p className="text-muted">Quantity: {item.quantity}</p>
                        </div>
                        <div className="col-4 text-right">
                          <h6>${(price * item.quantity).toFixed(2)}</h6>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="col-12 col-md-4">
                <div className="card p-4 shadow-sm" style={{ border: 'none', backgroundColor: '#f9f9f9'}}>
                  <h4>Order Summary</h4>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between font-weight-bold mb-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button className="btn auth-btn-solid w-100 mb-2" onClick={() => alert("Checkout flow not fully implemented yet!")}>Proceed to Checkout</button>
                  <button className="btn auth-btn-outline w-100" onClick={handleEmptyCart}>Empty Cart</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
