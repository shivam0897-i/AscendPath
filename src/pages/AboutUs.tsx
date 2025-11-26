
import { Link } from "react-router-dom";

import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function AboutUs() {

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Main content area */}
      <main className="flex-grow">
        {/* KEEP EXISTING CONTENT */} 
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="text-charcoal dark:text-cream">About </span>
              <span className="gradient-text">AscendPath</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-8"> {/* Changed text-lg to text-base md:text-lg */}
              Empowering working professionals and students through personalized education and community support
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-terracotta-light/30 to-sage-light/30 p-6 rounded-2xl relative z-10">
              
        <img
          src="/images/team.jpg"
          alt="Image of our team"
          className="rounded-xl w-full h-auto shadow-warm"
          onContextMenu={(e) => e.preventDefault()} // Disable right-click
          draggable="false" // Disable dragging
        />

              </div>
              {/* Decorative elements - Hidden on mobile */}
              <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-amber-400 rounded-full opacity-20 z-0 hidden md:block"></div> {/* Added hidden md:block */}
              <div className="absolute bottom-[-30px] left-[-30px] w-16 h-16 bg-terracotta rounded-full opacity-30 z-0 hidden md:block"></div> {/* Added hidden md:block */}
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6 text-charcoal dark:text-cream">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                AscendPath was founded in 2025 with a clear mission: to bridge the gender gap in education and career
                advancement through personalized learning experiences.
              </p>
              <p className="text-gray-600 mb-4">
                What began as a small initiative to help working professionals and students navigate their educational journeys has grown into a
                comprehensive platform that serves thousands of learners worldwide.
              </p>
              <p className="text-gray-600">
                Our team of educators, technologists, and mentors work together to create tailored educational roadmaps
                that consider each individual's goals, skills, and schedule, ensuring that every woman or student has the opportunity
                to chart her own path to success.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="bg-warm-gradient py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-heading font-bold mb-6 text-charcoal dark:text-cream">Our Mission</h2>
              <p className="text-muted-foreground text-lg">
                To empower working professionals and student through accessible, personalized education that adapts to their unique needs and
                circumstances.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl shadow-warm hover:shadow-warm-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-terracotta-light to-cream rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-terracotta"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4 text-center text-charcoal dark:text-cream">Personalization</h3>
                <p className="text-muted-foreground text-center">
                  We create custom learning paths that adapt to individual goals, skills, and schedules.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl shadow-warm hover:shadow-warm-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-sage-light to-cream rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-sage-dark"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4 text-center text-charcoal dark:text-cream">Community</h3>
                <p className="text-muted-foreground text-center">
                  We foster a supportive network where working professionals and students can connect, collaborate, and grow together.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl shadow-warm hover:shadow-warm-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-cream rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-600"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4 text-center text-charcoal dark:text-cream">Innovation</h3>
                <p className="text-muted-foreground text-center">
                  We continuously evolve our platform with cutting-edge tools and resources for effective learning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-heading font-bold mb-6 text-charcoal dark:text-cream">Our Team</h2>
            <p className="text-muted-foreground text-lg">
              Meet the passionate individuals behind AscendPath who are dedicated to transforming education for students
              worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3 ,4].map((i) => (
              <div key={i} className="text-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6"> {/* Changed w-40 h-40 to w-32 h-32 md:w-40 md:h-40 */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-terracotta-light to-sage-light"></div>
                  <img
                    src="/placeholder.svg?height=160&width=160"
                    alt={`Team Member ${i}`}
                    className="rounded-full relative z-10 w-32 h-32 md:w-40 md:h-40" 
                  />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2 text-charcoal dark:text-cream">Team Member {i}</h3>
                <p className="text-terracotta mb-4">Position</p>
                <p className="text-muted-foreground">
                  Passionate about education and dedicated to creating impactful learning experiences.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-warm-gradient py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-heading font-bold mb-6 text-charcoal dark:text-cream">Our Values</h2>
              <p className="text-muted-foreground text-lg">The core principles that guide everything we do at AscendPath.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-2xl shadow-warm flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-terracotta-light to-cream rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-terracotta font-heading font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3 text-charcoal dark:text-cream">Inclusivity</h3>
                  <p className="text-muted-foreground">
                    We believe in creating educational opportunities that are accessible to working professionals and students from all backgrounds,
                    regardless of their circumstances.
                  </p>
                </div>
              </div>

              <div className="bg-card p-8 rounded-2xl shadow-warm flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-sage-light to-cream rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-sage-dark font-heading font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3 text-charcoal dark:text-cream">Empowerment</h3>
                  <p className="text-muted-foreground">
                    We empower working professionals and students to take control of their educational journey and develop the confidence to pursue
                    their goals.
                  </p>
                </div>
              </div>

              <div className="bg-card p-8 rounded-2xl shadow-warm flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-cream rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-amber-600 font-heading font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3 text-charcoal dark:text-cream">Adaptability</h3>
                  <p className="text-muted-foreground">
                    We recognize that each woman or students journey is unique, and we adapt our approach to meet individual needs
                    and circumstances.
                  </p>
                </div>
              </div>

              <div className="bg-card p-8 rounded-2xl shadow-warm flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-terracotta-light to-sage-light rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-charcoal font-heading font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3 text-charcoal dark:text-cream">Excellence</h3>
                  <p className="text-muted-foreground">
                    We strive for excellence in everything we do, from the quality of our educational content to the user
                    experience on our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-bold mb-6 text-charcoal dark:text-cream">Join Our Community</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Ready to chart your own educational journey? Join thousands of working professionals and students who are transforming their lives
              through personalized learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/onboarding" // Link to onboarding
                className="bg-terracotta text-white px-8 py-3 rounded-lg hover:bg-terracotta-dark transition-colors font-medium shadow-warm"
              >
                Get Started →
              </Link>
              <Link
                to="/community" // Link to community or another relevant page
                className="bg-card text-charcoal border border-charcoal/20 px-8 py-3 rounded-lg hover:border-terracotta hover:text-terracotta transition-colors font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </PageTransition>
  )
}
