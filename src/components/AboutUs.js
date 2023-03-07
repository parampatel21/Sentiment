import React from 'react';
import '../styles/HomePage.css'

function AboutUs() {
  return (
    <div className="container-fluid">
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </nav>
        <div className="user-panel">
          {/* Put user panel here */}
        </div>
      </header>

      <main>
        <div className="hero">
          <h1>About Us</h1>
          <p>We are a company that provides great products and services to our customers. We strive to create innovative solutions that meet the needs of our customers.</p>
        </div>

        <div className="features">
          <div className="feature">
            <i className="fas fa-users"></i>
            <h2>Our Team</h2>
            <p>We have a dedicated team of professionals who work hard to ensure our customers are satisfied.</p>
          </div>
          <div className="feature">
            <i className="fas fa-certificate"></i>
            <h2>Our Mission</h2>
            <p>Our mission is to provide the best products and services to our customers.</p>
          </div>
          <div className="feature">
            <i className="fas fa-star"></i>
            <h2>Our Vision</h2>
            <p>Our vision is to be the leading company in our industry.</p>
          </div>
        </div>

        <div className="call-to-action">
          <h2>Want to learn more about us?</h2>
          <button>Get in touch</button>
        </div>
      </main>

      <footer>
        <p>&copy; 2023 Company Name</p>
      </footer>
    </div>
  );
}

export default AboutUs;
