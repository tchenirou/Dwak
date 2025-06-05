import { useState } from "react";

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Dr. Tahri Hichem",
    role: "Médecin généraliste",
    image: "/Images/person1-removebg-preview.png",
    rating: 5,
    text: "Dwak a transformé ma façon d'interagir avec mes patients. Je le recommande vivement !",
  },
  {
    id: 2,
    name: "Dr. Yasmine B.",
    role: "psychologue ",
    image: "/Images/image3.png",
    rating: 4,
    text: "Une plateforme fiable et facile à utiliser pour les médecins et les patients.",
  },
  {
    id: 3,
    name: "Amine Keddad.",
    role: "Patient",
    image: "/Images/image_2-removebg-preview.png",
    rating: 5,
    text: "Le meilleur service de consultation en ligne que j'ai connu jusqu'à présent.",
  },
  
];

/**
 * Testimonial component displays a testimonial section with ratings, text, author information, and navigation dots.
 * 
 * @component
 * @example
 * return (
 *   <Testimonial />
 * )
 * 
 * @returns {JSX.Element} The rendered testimonial section.
 */
function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="testimonial">
      <div className="container">
        <div className="testimonial-content">
          <div className="stars">{"★".repeat(testimonials[currentIndex].rating)}</div>
          <p>{testimonials[currentIndex].text}</p>
          <div className="testimonial-author">
            <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
            />
            <span>{testimonials[currentIndex].name}</span>
            <span>|</span>
            <span>{testimonials[currentIndex].role}</span>
          </div>
        </div>

        {/* Dot Navigation */}
        <div className="testimonial-nav">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`nav-dot ${currentIndex === index ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
