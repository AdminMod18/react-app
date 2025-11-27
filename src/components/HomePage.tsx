import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { 
  Smartphone, 
  Wifi, 
  Tv, 
  Package, 
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Menu,
  X,
  User,
  ArrowUp
} from 'lucide-react';

interface Props {
  isAuthenticated?: boolean;
  onNavigateToNewCase?: () => void;
}

export function HomePage({ isAuthenticated, onNavigateToNewCase }: Props) {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNewCase = () => {
    if (isAuthenticated) {
      if (onNavigateToNewCase) {
        onNavigateToNewCase();
      } else {
        navigate('/new-case');
      }
    } else {
      navigate('/login', { state: { from: { pathname: '/new-case' } } });
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const services = [
    {
      icon: Smartphone,
      title: 'Planes Móviles',
      description: 'Encuentra el plan perfecto con datos, minutos y beneficios',
      image: 'https://images.unsplash.com/photo-1599009868214-e52f122200f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMHBsYW5zfGVufDF8fHx8MTc2MjQ3MDYzNnww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-blue-600 to-blue-800',
    },
    {
      icon: Wifi,
      title: 'Internet Hogar',
      description: 'Fibra óptica de alta velocidad para tu hogar u oficina',
      image: 'https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcm5ldCUyMGZpYmVyJTIwb3B0aWN8ZW58MXx8fHwxNzYyNDAyODU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-orange-500 to-orange-700',
    },
    {
      icon: Tv,
      title: 'TV & Streaming',
      description: 'Cientos de canales HD y plataformas de streaming incluidas',
      image: 'https://images.unsplash.com/photo-1556889487-b6f8d3fc728b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxldmlzaW9uJTIwc3RyZWFtaW5nfGVufDF8fHx8MTc2MjM1NzcxMHww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-purple-600 to-purple-800',
    },
    {
      icon: Package,
      title: 'Combos',
      description: 'Paquetes completos con descuentos especiales',
      image: 'https://images.unsplash.com/photo-1758874960091-3902ffed7305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMHNtYXJ0cGhvbmUlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MjQ3MDYzMXww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-teal-600 to-teal-800',
    },
  ];

  const features = [
    { icon: Clock, title: 'Activación Rápida', description: 'En menos de 48 horas' },
    { icon: Phone, title: 'Soporte 24/7', description: 'Siempre disponibles' },
    { icon: MapPin, title: 'Cobertura Nacional', description: 'En todo Colombia' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <button className="hover:text-orange-400 transition-colors">Personas</button>
            <button className="hover:text-orange-400 transition-colors">Empresas</button>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              (601) 347 2311
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogin}
              className="text-white hover:text-orange-400"
            >
              <User className="w-4 h-4 mr-2" />
              Ingresar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center">
                <Wifi className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">Telecomunicaciones</h1>
                <p className="text-orange-600 -mt-1">Konrad Lorenz</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <button className="text-slate-700 hover:text-blue-700 transition-colors">Servicios</button>
              <button className="text-slate-700 hover:text-blue-700 transition-colors">Planes</button>
              <button className="text-slate-700 hover:text-blue-700 transition-colors">Beneficios</button>
              <button className="text-slate-700 hover:text-blue-700 transition-colors">Soporte</button>
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={handleStartNewCase}
              >
                Contratar Ahora
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <nav className="flex flex-col gap-4">
                <button className="text-slate-700 text-left py-2">Servicios</button>
                <button className="text-slate-700 text-left py-2">Planes</button>
                <button className="text-slate-700 text-left py-2">Beneficios</button>
                <button className="text-slate-700 text-left py-2">Soporte</button>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 w-full"
                  onClick={handleStartNewCase}
                >
                  Contratar Ahora
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.85)), url('https://images.unsplash.com/photo-1758874960091-3902ffed7305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMHNtYXJ0cGhvbmUlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MjQ3MDYzMXww&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h2 className="mb-4">¡Conéctate al Futuro!</h2>
            <p className="text-xl mb-8">
              Planes de Internet, TV y Telefonía con la mejor tecnología. 
              <br />
              <span className="text-orange-400">Hasta 500 Mbps de velocidad</span>
            </p>

            {/* Quick Access Form */}
            <div className="bg-white rounded-lg p-6 max-w-md">
              <p className="text-slate-900 mb-4">Consulta nuestros planes disponibles</p>
              <div className="flex gap-3">
                <Input
                  type="tel"
                  placeholder="Ingresa tu número"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={handleStartNewCase}
                >
                  Consultar
                </Button>
              </div>
              <p className="text-slate-600 mt-3">
                🎁 <strong>Promoción:</strong> Primer mes con 50% de descuento
              </p>
            </div>

            {/* Features Pills */}
            <div className="flex flex-wrap gap-4 mt-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2"
                >
                  <feature.icon className="w-5 h-5 text-orange-400" />
                  <span>{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-slate-900 mb-4">¿Qué estás buscando?</h2>
            <p className="text-slate-600 text-xl">
              Elige el servicio que más se adapte a tus necesidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-0"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-60 group-hover:opacity-75 transition-opacity`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <service.icon className="w-16 h-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all"
                    onClick={handleStartNewCase}
                  >
                    Conoce más
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">Combo Triple Plus</h2>
              <p className="text-xl mb-6 text-blue-100">
                Internet 500 Mbps + TV 200+ canales + Plan Móvil 20GB
              </p>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-5xl">$220,000</span>
                <span className="text-xl text-blue-200">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">✓</div>
                  Internet de fibra óptica ultra rápido
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">✓</div>
                  Netflix, Disney+ y Paramount+ incluidos
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">✓</div>
                  Llamadas ilimitadas a nivel nacional
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">✓</div>
                  Instalación gratis
                </li>
              </ul>
              <Button 
                size="lg"
                className="bg-orange-600 hover:bg-orange-700"
                onClick={handleStartNewCase}
              >
                Contratar Ahora
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-6 text-center">
                    <Wifi className="w-12 h-12 mx-auto mb-3 text-orange-400" />
                    <p className="text-2xl mb-1">500</p>
                    <p className="text-blue-200">Mbps</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 text-center">
                    <Tv className="w-12 h-12 mx-auto mb-3 text-orange-400" />
                    <p className="text-2xl mb-1">200+</p>
                    <p className="text-blue-200">Canales</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 text-center">
                    <Smartphone className="w-12 h-12 mx-auto mb-3 text-orange-400" />
                    <p className="text-2xl mb-1">20GB</p>
                    <p className="text-blue-200">Datos</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 text-center">
                    <Phone className="w-12 h-12 mx-auto mb-3 text-orange-400" />
                    <p className="text-2xl mb-1">∞</p>
                    <p className="text-blue-200">Llamadas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-slate-900 mb-4">¿Por qué elegirnos?</h2>
            <p className="text-slate-600 text-xl">
              La mejor experiencia en telecomunicaciones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-blue-700" />
              </div>
              <h3 className="text-slate-900 mb-3">Proceso 100% Digital</h3>
              <p className="text-slate-600">
                Contrata en menos de 15 minutos desde la comodidad de tu hogar. 
                Sin papeleos ni trámites complicados.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-slate-900 mb-3">Atención Personalizada</h3>
              <p className="text-slate-600">
                Soporte técnico 24/7 por WhatsApp, chat y teléfono. 
                Siempre estamos para ayudarte.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-teal-700" />
              </div>
              <h3 className="text-slate-900 mb-3">Cobertura Nacional</h3>
              <p className="text-slate-600">
                Red de fibra óptica en las principales ciudades de Colombia. 
                Tecnología de última generación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="mb-6">¿Listo para conectarte?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Únete a miles de familias que ya disfrutan de la mejor conexión
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-orange-600 hover:bg-orange-50"
              onClick={handleStartNewCase}
            >
              Contratar Ahora
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={handleLogin}
            >
              <Phone className="w-5 h-5 mr-2" />
              Llamar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:scale-110"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm">Telecomunicaciones</p>
                  <p className="text-orange-400 text-sm">Konrad Lorenz</p>
                </div>
              </div>
              <p className="text-slate-400">
                Tu conexión al futuro digital
              </p>
            </div>

            <div>
              <h4 className="mb-4">Servicios</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Internet Hogar</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Planes Móviles</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">TV & Streaming</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Combos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Soporte</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Estado de Servicio</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Contacto</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-start gap-2">
                  <Phone className="w-5 h-5 mt-0.5 text-orange-400" />
                  <div>
                    <p>(601) 347 2311</p>
                    <p className="text-sm">Línea gratuita nacional</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-5 h-5 mt-0.5 text-orange-400" />
                  <div>
                    <p>soporte@konrad.edu.co</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 text-orange-400" />
                  <div>
                    <p>Carrera 9 Bis No. 62-43</p>
                    <p className="text-sm">Bogotá D.C., Colombia</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>© 2025 Telecomunicaciones Konrad Lorenz. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
