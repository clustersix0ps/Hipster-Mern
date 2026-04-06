function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-5">
      <div className="footer-top">
        <div className="container footer-social">
          <p className="footer-text" style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.5px' }}>
            Hipster Shop &mdash; Microservices Demo
          </p>
          <p className="footer-text" style={{ color: '#aaaaaa', fontSize: '13px' }}>
            A cloud-native microservices application deployed on Kubernetes.
          </p>
          <hr style={{ borderColor: '#333333', marginTop: '24px' }} />
          <p className="footer-text" style={{ fontSize: '13px', color: '#888888', marginBottom: 0 }}>
            &copy; {year}&nbsp;|&nbsp;<strong style={{ color: 'white' }}>Team 4 &mdash; DevOps Batch 1</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
