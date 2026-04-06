import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function OrderPage() {
  const { orderId } = useParams();

  return (
    <main role="main" className="order">
      <section className="container order-complete-section">
        <div className="row">
          <div className="col-12 text-center">
            <h3>Your order is complete!</h3>
          </div>
          <div className="col-12 text-center">
            <p>We've sent you a confirmation email.</p>
          </div>
        </div>
        <div className="row border-bottom-solid padding-y-24">
          <div className="col-6 pl-md-0">Confirmation #</div>
          <div className="col-6 pr-md-0 text-right">{orderId}</div>
        </div>
        <div className="row padding-y-24">
          <div className="col-12 text-center" style={{ marginTop: '24px' }}>
            <Link className="cymbal-button-primary" to="/" role="button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OrderPage;
