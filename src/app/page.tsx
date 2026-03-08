'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
  Film,
  Video,
  Camera,
  Sparkles,
  Menu,
  X,
  Mail,
  Youtube,
  Instagram,
  Facebook,
  Music,
  ChevronRight,
  Play,
  Code2,
  Megaphone,
  FileVideo,
  Image,
  Globe,
  MessageSquare,
  Bot,
  ArrowUpRight,
  Lock
} from 'lucide-react';

// Custom TikTok Icon component
function TikTok({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
        fill="currentColor"
      />
    </svg>
  );
}

// Custom WhatsApp Icon component
function WhatsApp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  videoUrl?: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

interface Artist {
  name: string;
  genre: string;
  description: string;
  image: string;
}

interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  url: string;
  company: string | null;
}

interface VideoShowcase {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string | null;
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [videos, setVideos] = useState<VideoShowcase[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const services: Service[] = [
    {
      id: 1,
      title: 'AI Commercial Ads',
      description: 'High-impact AI-powered commercial advertisements that captivate audiences and elevate your brand.',
      icon: <Megaphone className="w-6 h-6" />,
      image: '/service-images/ai-commercial-ads.png'
    },
    {
      id: 2,
      title: 'Cinematic VFX Production',
      description: 'World-class visual effects and cinematic VFX that bring impossible visions to life.',
      icon: <Sparkles className="w-6 h-6" />,
      image: '/service-images/cinematic-vfx.png'
    },
    {
      id: 3,
      title: 'AI Music Video Production',
      description: 'Revolutionary music videos blending AI technology with artistic creativity.',
      icon: <Video className="w-6 h-6" />,
      image: '/service-images/ai-music-video.png'
    },
    {
      id: 4,
      title: 'Documentary Production',
      description: 'Compelling documentary storytelling with cinematic precision and emotional depth.',
      icon: <Film className="w-6 h-6" />,
      image: '/service-images/documentary.png'
    },
    {
      id: 5,
      title: 'AI Photoshoots',
      description: 'Futuristic AI photography creating stunning, impossible-to-capture visuals.',
      icon: <Camera className="w-6 h-6" />,
      image: '/service-images/ai-photoshoots.png'
    },
    {
      id: 6,
      title: 'Website Development',
      description: 'Modern, responsive websites that deliver exceptional user experiences.',
      icon: <Code2 className="w-6 h-6" />,
      image: '/service-images/website-dev.png'
    },
    {
      id: 7,
      title: 'Content Creation',
      description: 'Strategic content that engages, educates, and converts your audience.',
      icon: <FileVideo className="w-6 h-6" />,
      image: '/service-images/content-creation.png'
    },
    {
      id: 8,
      title: 'Digital Marketing',
      description: 'Data-driven digital marketing strategies that amplify your brand presence.',
      icon: <Globe className="w-6 h-6" />,
      image: '/service-images/digital-marketing.png'
    },
    {
      id: 9,
      title: 'Virtual Assistant Services',
      description: 'Intelligent AI-powered virtual assistants for business automation.',
      icon: <Bot className="w-6 h-6" />,
      image: '/service-images/virtual-assistant.png'
    }
  ];

  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: 'Luxury Automotive Campaign',
      category: 'Commercial',
      description: 'A stunning AI-powered commercial for a luxury automotive brand, featuring cinematic cityscapes and dramatic lighting.',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Neon Nights Action Sequence',
      category: 'Cinematic',
      description: 'High-octane action scene with neon-soaked visuals and dynamic camera work.',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Future Fashion Editorial',
      category: 'Fashion',
      description: 'AI-generated fashion photography pushing the boundaries of style and technology.',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Electronic Dreams Music Video',
      category: 'Music Video',
      description: 'Visual journey through electronic soundscapes with mesmerizing AI-generated art.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'The Last Horizon Short Film',
      category: 'Short Film',
      description: 'A dystopian short film exploring humanity\'s relationship with technology.',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      title: 'Ethereal Beauty Campaign',
      category: 'Commercial',
      description: 'Ethereal and otherworldly beauty product campaign with dreamlike aesthetics.',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=600&fit=crop'
    }
  ];

  const artists: Artist[] = [
    {
      name: 'Olaminta',
      genre: 'Alternative / Electronic',
      description: 'Pushing boundaries with innovative soundscapes and AI-enhanced production.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
    },
    {
      name: 'Elox Don',
      genre: 'Hip-Hop / R&B',
      description: 'Chart-topping artist blending traditional beats with modern AI composition.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop'
    }
  ];

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Music', href: '#music' },
    { name: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch ads and videos on mount and periodically
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch ads
        const adsResponse = await fetch('/api/public/ads');
        if (adsResponse.ok) {
          const contentType = adsResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const adsData = await adsResponse.json();
            setAds(adsData.ads);
          } else {
            console.error('Ads API did not return JSON');
          }
        } else {
          console.error('Ads API returned status:', adsResponse.status);
        }

        // Fetch videos
        const videosResponse = await fetch('/api/public/videos?limit=6');
        if (videosResponse.ok) {
          const contentType = videosResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const videosData = await videosResponse.json();
            setVideos(videosData.videos);
          } else {
            console.error('Videos API did not return JSON');
          }
        } else {
          console.error('Videos API returned status:', videosResponse.status);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    // Initial fetch
    fetchContent();

    // Refresh every 30 seconds
    const interval = setInterval(fetchContent, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle video end event for billboard
  const handleAdVideoEnd = () => {
    if (ads.length > 1) {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }
  };

  // Play video when index changes
  useEffect(() => {
    if (videoRefs.current[currentAdIndex]) {
      videoRefs.current[currentAdIndex].play().catch(err => {
        console.log('Auto-play prevented:', err);
      });
    }
  }, [currentAdIndex, ads.length]);

  // Play first video when ads are loaded
  useEffect(() => {
    if (ads.length > 0 && videoRefs.current[0]) {
      videoRefs.current[0].play().catch(err => {
        console.log('Auto-play prevented:', err);
      });
    }
  }, [ads.length]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        toast({
          title: 'Message Sent!',
          description: 'We\'ll get back to you within 24 hours.',
          variant: 'default',
        });
        setContactForm({ name: '', email: '', projectType: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Zee Digital Empire Logo" 
                className="h-8 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-sm font-medium transition-colors hover:text-gold ${
                    activeSection === link.href.substring(1)
                      ? 'text-gold'
                      : 'text-foreground-secondary'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection('#contact')}
                className="bg-gold hover:bg-gold-light text-primary-foreground"
              >
                Start a Project
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left py-2 text-foreground-secondary hover:text-gold transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection('#contact')}
                className="w-full bg-gold hover:bg-gold-light text-primary-foreground mt-4"
              >
                Start a Project
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background-elevated to-background">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-cinematic-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl animate-cinematic-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up stagger-1">
            <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold">Future Cinema Starts Here</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up stagger-2">
            Engineering Cinematic <br />
            <span className="text-gold">Experiences with AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground-secondary max-w-3xl mx-auto mb-10 animate-fade-in-up stagger-3">
            Zee Digital Empire is a next-generation creative studio producing AI-powered films,
            commercials, and digital storytelling that pushes the boundaries of imagination.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-4">
            <Button
              onClick={() => scrollToSection('#portfolio')}
              size="lg"
              className="bg-gold hover:bg-gold-light text-primary-foreground text-lg px-8 py-6"
            >
              View Our Work
              <Play className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => scrollToSection('#contact')}
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10 text-lg px-8 py-6"
            >
              Start a Project
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold rounded-full animate-cinematic-pulse" />
          </div>
        </div>
      </section>

      {/* Video Billboard Section - Advertisements */}
      <section className="py-12 md:py-16 bg-background-elevated relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              <span className="text-gold">Featured</span> Advertisements
            </h2>
            <p className="text-foreground-secondary">Partner brands showcasing their products</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-gold/20">
              {ads.length > 0 ? (
                ads.map((ad, index) => (
                  <div
                    key={ad.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentAdIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={ad.url}
                      autoPlay={index === currentAdIndex}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      onEnded={index === currentAdIndex ? handleAdVideoEnd : undefined}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{ad.title}</h3>
                      {ad.company && (
                        <p className="text-gold font-medium mb-1">{ad.company}</p>
                      )}
                      {ad.description && (
                        <p className="text-white/80 text-sm">{ad.description}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Megaphone className="w-16 h-16 text-gold/50 mx-auto mb-4" />
                    <p className="text-foreground-secondary">No active advertisements</p>
                    <p className="text-foreground-muted text-sm mt-2">Check back soon for featured content</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ad Indicators */}
            {ads.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAdIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentAdIndex ? 'bg-gold' : 'bg-gold/30'
                    }`}
                    aria-label={`Go to advertisement ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      {videos.length > 0 && (
        <section className="py-20 md:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Video <span className="text-gold">Showcase</span>
              </h2>
              <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
                Watch our latest video productions and creative works
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <Card
                  key={video.id}
                  className="group bg-card border border-border hover:border-gold/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <video
                      id={`video-${index}`}
                      src={video.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        onClick={(e) => {
                          try {
                            const video = document.getElementById(`video-${index}`) as HTMLVideoElement;
                            if (video) {
                              if (video.paused) {
                                video.play();
                              } else {
                                video.pause();
                              }
                              e.stopPropagation();
                            }
                          } catch (err) {
                            console.error('Error toggling video play:', err);
                          }
                        }}
                        className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center cursor-pointer hover:bg-gold transition-colors"
                      >
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    {video.category && (
                      <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded inline-block mb-2">
                        {video.category}
                      </span>
                    )}
                    <CardTitle className="group-hover:text-gold transition-colors">
                      {video.title}
                    </CardTitle>
                    {video.description && (
                      <p className="text-sm text-foreground-secondary mt-2 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-background-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Pioneering the <span className="text-gold">Future of Cinema</span>
              </h2>
              <p className="text-foreground-secondary text-lg mb-6">
                Zee Digital Empire is a cutting-edge creative studio at the intersection of artificial
                intelligence and cinematic storytelling. We blend revolutionary AI technology with
                artistic vision to create experiences that were once impossible.
              </p>
              <p className="text-foreground-secondary text-lg mb-8">
                From cinematic VFX and AI-powered commercials to groundbreaking music videos and
                creative direction, we transform ideas into visual masterpieces that captivate and
                inspire audiences worldwide.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: 'Projects', value: '500+' },
                  { label: 'Clients', value: '150+' },
                  { label: 'Awards', value: '25+' },
                  { label: 'Countries', value: '40+' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gold mb-1">{stat.value}</div>
                    <div className="text-sm text-foreground-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gold/20 to-transparent border border-gold/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Film className="w-24 h-24 text-gold/50 mx-auto mb-4 animate-float" />
                    <p className="text-gold/30 text-xl font-light">Visual Excellence</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold/10 rounded-2xl border border-gold/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gold">Services</span>
            </h2>
            <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
              Comprehensive creative solutions powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="group bg-card hover:bg-card-hover border border-border hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <div className="text-gold">{service.icon}</div>
                    </div>
                  </div>
                </div>
                <CardHeader className="pt-4">
                  <CardTitle className="text-xl group-hover:text-gold transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-secondary">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 md:py-32 bg-background-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="text-gold">Work</span>
            </h2>
            <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
              Explore our collection of AI-powered cinematic masterpieces
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden cursor-pointer bg-card border border-border hover:border-gold/30 transition-all duration-300"
                onClick={() => setSelectedProject(item)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-gold transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Music Division Section */}
      <section id="music" className="py-20 md:py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
              <Music className="w-8 h-8 text-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Zee Digital Empire <span className="text-gold">Music</span>
            </h2>
            <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
              Discover our talented artists pushing the boundaries of music with AI-enhanced production
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {artists.map((artist, index) => (
              <Card
                key={index}
                className="bg-card border border-border hover:border-gold/30 transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-gold transition-colors">
                        {artist.name}
                      </h3>
                      <p className="text-gold text-sm mb-2">{artist.genre}</p>
                      <p className="text-foreground-secondary text-sm">
                        {artist.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-background-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Let's Create <span className="text-gold">Together</span>
              </h2>
              <p className="text-foreground-secondary text-lg mb-8">
                Ready to bring your vision to life? Get in touch with our team to discuss your project
                and discover how we can help you achieve extraordinary results.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <a
                      href="mailto:zedigitalempire@gmail.com"
                      className="text-foreground-secondary hover:text-gold transition-colors"
                    >
                      zedigitalempire@gmail.com
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {[
                      { icon: Youtube, href: 'https://www.youtube.com/@ZeesDigitalEmpire', label: 'YouTube' },
                      { icon: Instagram, href: 'https://www.instagram.com/zedigitalempire/', label: 'Instagram' },
                      { icon: Facebook, href: 'https://web.facebook.com/zeedigitalemireltd/', label: 'Facebook' },
                      { icon: TikTok, href: 'https://www.tiktok.com/@zeedigitalempire', label: 'TikTok' },
                      { icon: WhatsApp, href: 'https://wa.me/2348105605524', label: 'WhatsApp' },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-lg bg-card border border-border hover:border-gold/50 hover:bg-gold/10 flex items-center justify-center transition-all duration-300 group"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5 text-foreground-secondary group-hover:text-gold transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type</Label>
                    <Input
                      id="projectType"
                      placeholder="e.g., AI Commercial, Music Video"
                      value={contactForm.projectType}
                      onChange={(e) => setContactForm({ ...contactForm, projectType: e.target.value })}
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      rows={5}
                      className="bg-background border-border resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-gold-light text-primary-foreground"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Zee P Room - Admin Access */}
      <section className="py-16 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Zee P Room
                  </h2>
                </div>
                <Button
                  onClick={() => window.location.href = '/admin/login'}
                  size="lg"
                  className="bg-gold hover:bg-gold-light text-primary-foreground text-lg px-8 py-6"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Enter
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Zee Digital Empire Logo" 
                  className="h-6 w-auto"
                />
              </div>
              <p className="text-foreground-secondary text-sm">
                AI Film & Creative Studio
              </p>
              <p className="text-gold text-sm font-medium mt-2">
                "Future Cinema Starts Here"
              </p>
            </div>

            <div className="flex justify-center space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm text-foreground-secondary hover:text-gold transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              {[
                { icon: Youtube, href: 'https://www.youtube.com/@ZeesDigitalEmpire', label: 'YouTube' },
                { icon: Instagram, href: 'https://www.instagram.com/zedigitalempire/', label: 'Instagram' },
                { icon: Facebook, href: 'https://web.facebook.com/zeedigitalemireltd/', label: 'Facebook' },
                { icon: TikTok, href: 'https://www.tiktok.com/@zeedigitalempire', label: 'TikTok' },
                { icon: WhatsApp, href: 'https://wa.me/2348105605524', label: 'WhatsApp' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gold/10 hover:bg-gold/20 flex items-center justify-center transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gold" />
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-foreground-muted text-sm">
              © {new Date().getFullYear()} Zee Digital Empire. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Portfolio Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl w-full bg-card border border-border">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-gold">
                  {selectedProject.category}
                </DialogDescription>
              </DialogHeader>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-background-elevated">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="w-20 h-20 rounded-full bg-gold/90 flex items-center justify-center cursor-pointer hover:bg-gold transition-colors">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>
              <p className="text-foreground-secondary">{selectedProject.description}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
