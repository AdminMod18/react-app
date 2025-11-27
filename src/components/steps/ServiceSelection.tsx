import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ArrowLeft, ArrowRight, Wifi, Phone, Tv, Check, Star, Zap } from 'lucide-react';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: any;
  features: string[];
  popular?: boolean;
  discount?: number;
}

interface Combo {
  id: string;
  name: string;
  description: string;
  services: string[];
  price: number;
  originalPrice: number;
  icon: any;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export function ServiceSelection({ data, onNext, onBack }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>(data.selectedService || '');

  const individualServices: Service[] = [
    {
      id: 'telefonia',
      name: 'Telefonía Móvil',
      description: 'Plan móvil con minutos ilimitados',
      price: 45000,
      icon: Phone,
      features: [
        'Minutos ilimitados',
        '5GB de datos',
        'SMS ilimitados',
        'Llamadas nacionales',
      ],
    },
    {
      id: 'internet',
      name: 'Internet Fibra Óptica',
      description: 'Conexión de alta velocidad',
      price: 80000,
      icon: Wifi,
      features: [
        'Velocidad 100 Mbps',
        'Instalación gratuita',
        'Router WiFi incluido',
        'Soporte técnico 24/7',
      ],
      popular: true,
    },
    {
      id: 'tv',
      name: 'TV por Cable',
      description: 'Entretenimiento para toda la familia',
      price: 55000,
      icon: Tv,
      features: [
        '120+ canales HD',
        'Canales premium',
        'Grabación en la nube',
        'Control parental',
      ],
    },
  ];

  const combos: Combo[] = [
    {
      id: 'duo-internet-telefonia',
      name: 'Dúo Digital',
      description: 'Internet + Telefonía',
      services: ['internet', 'telefonia'],
      price: 110000,
      originalPrice: 125000,
      icon: Zap,
      features: [
        'Internet 100 Mbps',
        'Plan móvil 5GB',
        'Minutos ilimitados',
        '15% descuento',
      ],
      badge: '15% OFF',
    },
    {
      id: 'duo-internet-tv',
      name: 'Dúo Entretenimiento',
      description: 'Internet + TV',
      services: ['internet', 'tv'],
      price: 120000,
      originalPrice: 135000,
      icon: Zap,
      features: [
        'Internet 100 Mbps',
        '120+ canales HD',
        'Router WiFi gratis',
        '15% descuento',
      ],
      badge: '15% OFF',
    },
    {
      id: 'combo-triple',
      name: 'Combo Triple',
      description: 'Internet + TV + Telefonía',
      services: ['internet', 'tv', 'telefonia'],
      price: 160000,
      originalPrice: 180000,
      icon: Star,
      features: [
        'Internet 200 Mbps',
        '150+ canales HD',
        'Plan móvil 10GB',
        'Instalación gratis',
      ],
      popular: true,
      badge: '20% OFF',
    },
    {
      id: 'combo-triple-plus',
      name: 'Combo Triple Plus',
      description: 'Paquete premium todo incluido',
      services: ['internet', 'tv', 'telefonia'],
      price: 220000,
      originalPrice: 260000,
      icon: Star,
      features: [
        'Internet 500 Mbps',
        '200+ canales HD + Premium',
        'Plan móvil 20GB',
        'Netflix Basic incluido',
        'Soporte prioritario',
      ],
      badge: 'PREMIUM',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSelect = (id: string) => {
    setSelectedOption(id);
  };

  const handleContinue = () => {
    const selected = [...individualServices, ...combos].find(s => s.id === selectedOption);
    
    if (selected) {
      onNext({
        selectedService: selectedOption,
        serviceName: selected.name,
        servicePrice: selected.price,
        serviceDetails: selected,
      });
    }
  };

  const getSelectedTotal = () => {
    const selected = [...individualServices, ...combos].find(s => s.id === selectedOption);
    return selected ? selected.price : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-900">5. Selección de Servicios</CardTitle>
        <p className="text-slate-600">Selecciona el plan o combo que mejor se adapte a las necesidades del cliente</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Servicios Individuales */}
        <div>
          <h3 className="text-slate-900 mb-4 flex items-center gap-2">
            Servicios Individuales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {individualServices.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedOption === service.id;
              
              return (
                <div
                  key={service.id}
                  onClick={() => handleSelect(service.id)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-slate-200 hover:border-blue-300'
                  } ${service.popular ? 'ring-2 ring-blue-200' : ''}`}
                >
                  {service.popular && (
                    <Badge className="mb-2 bg-blue-600">Más Popular</Badge>
                  )}
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-600' : 'bg-slate-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-900">{service.name}</h4>
                      <p className="text-slate-600">{service.description}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-slate-900">{formatPrice(service.price)}<span className="text-slate-600">/mes</span></p>
                  </div>

                  <Separator className="my-3" />

                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-slate-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isSelected && (
                    <div className="mt-4 p-2 bg-blue-600 text-white rounded-lg text-center">
                      <Check className="w-5 h-5 inline mr-2" />
                      Seleccionado
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Combos */}
        <div>
          <h3 className="text-slate-900 mb-4 flex items-center gap-2">
            Combos y Paquetes
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              Ahorra hasta 20%
            </Badge>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {combos.map((combo) => {
              const Icon = combo.icon;
              const isSelected = selectedOption === combo.id;
              const savings = combo.originalPrice - combo.price;
              
              return (
                <div
                  key={combo.id}
                  onClick={() => handleSelect(combo.id)}
                  className={`border-2 rounded-lg p-5 cursor-pointer transition-all hover:shadow-lg ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-slate-200 hover:border-purple-300'
                  } ${combo.popular ? 'ring-2 ring-purple-200' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-purple-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'
                      }`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="text-slate-900">{combo.name}</h4>
                        <p className="text-slate-600">{combo.description}</p>
                      </div>
                    </div>
                    {combo.badge && (
                      <Badge className={`${
                        combo.badge === 'PREMIUM' 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                          : 'bg-green-600'
                      }`}>
                        {combo.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="flex items-baseline gap-2">
                      <p className="text-slate-900">{formatPrice(combo.price)}<span className="text-slate-600">/mes</span></p>
                      <p className="text-slate-500 line-through">{formatPrice(combo.originalPrice)}</p>
                    </div>
                    <p className="text-green-600">Ahorras {formatPrice(savings)} al mes</p>
                  </div>

                  <Separator className="my-3" />

                  <ul className="space-y-2">
                    {combo.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-slate-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isSelected && (
                    <div className="mt-4 p-2 bg-purple-600 text-white rounded-lg text-center">
                      <Check className="w-5 h-5 inline mr-2" />
                      Seleccionado
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen de Selección */}
        {selectedOption && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-slate-900 mb-3">Resumen de Selección</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Servicio seleccionado:</span>
                <span className="text-slate-900">
                  {[...individualServices, ...combos].find(s => s.id === selectedOption)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Valor mensual:</span>
                <span className="text-slate-900">{formatPrice(getSelectedTotal())}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-slate-900">Total a facturar:</span>
                <span className="text-slate-900">{formatPrice(getSelectedTotal())}/mes</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            <strong>Nota:</strong> Los precios incluyen instalación gratuita. El cliente recibirá el equipo necesario sin costo adicional.
          </p>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={!selectedOption}
          >
            Continuar a Generación de Contrato
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
