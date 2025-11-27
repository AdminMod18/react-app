import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, CheckCircle2, XCircle, Clock, TrendingUp, Wifi, Phone, Tv, Star } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { EmailTestPanel } from './EmailTestPanel';
import { isDemoMode } from '../services/config';

const cycleTimeData = [
  { day: 'Lun', tiempo: 12 },
  { day: 'Mar', tiempo: 14 },
  { day: 'Mie', tiempo: 11 },
  { day: 'Jue', tiempo: 13 },
  { day: 'Vie', tiempo: 10 },
];

const statusData = [
  { name: 'Completados', value: 145, color: '#10b981' },
  { name: 'En proceso', value: 38, color: '#3b82f6' },
  { name: 'Rechazados', value: 12, color: '#ef4444' },
];

const rejectionData = [
  { motivo: 'Identidad', casos: 5 },
  { motivo: 'Crédito', casos: 4 },
  { motivo: 'Documentos', casos: 3 },
];

const servicesData = [
  { name: 'Internet', ventas: 45, ingresos: 3600000 },
  { name: 'Telefonía', ventas: 32, ingresos: 1440000 },
  { name: 'TV', ventas: 28, ingresos: 1540000 },
  { name: 'Combo Triple', ventas: 35, ingresos: 5600000 },
  { name: 'Triple Plus', ventas: 18, ingresos: 3960000 },
];

export function Dashboard() {
  const isProduction = !isDemoMode();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 mb-1">Panel de Control - KPIs Operativos</h2>
        <p className="text-slate-600">Métricas en tiempo real del proceso de ventas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-slate-600">Casos Totales</CardTitle>
            <Activity className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">195</div>
            <p className="text-slate-600 mt-1">+12% vs. semana anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-slate-600">Completados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">145</div>
            <p className="text-slate-600 mt-1">74.4% de completitud</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-slate-600">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">12.3 min</div>
            <p className="text-slate-600 mt-1">✓ Meta: ≤15 min</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-slate-600">Tasa de Rechazo</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">6.2%</div>
            <p className="text-slate-600 mt-1">-2.1% vs. mes anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Tiempo de Ciclo por Día</CardTitle>
            <p className="text-slate-600">Promedio en minutos</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cycleTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tiempo" stroke="#3b82f6" strokeWidth={2} name="Minutos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Distribución de Estados</CardTitle>
            <p className="text-slate-600">Casos actuales por estado</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Motivos de Rechazo</CardTitle>
            <p className="text-slate-600">Top 3 causas de rechazo</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rejectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="motivo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="casos" fill="#ef4444" name="Casos Rechazados" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Métricas de Eficiencia</CardTitle>
            <p className="text-slate-600">Indicadores clave del proceso</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-900">Reducción de Reprocesos</p>
                  <p className="text-slate-600">vs. proceso manual</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">65%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-900">Casos sin Papel</p>
                  <p className="text-slate-600">Digitalización</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">94%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-900">Trazabilidad Completa</p>
                  <p className="text-slate-600">Auditoría de eventos</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">100%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-900">SLA Cumplimiento</p>
                  <p className="text-slate-600">Tareas en tiempo</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">92%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-900">Errores de Integración</p>
                  <p className="text-slate-600">Por 1000 transacciones</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900">2.3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nueva sección de Servicios */}
      <div>
        <h3 className="text-slate-900 mb-4">Servicios Vendidos</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">Ventas por Servicio</CardTitle>
              <p className="text-slate-600">Distribución de servicios contratados</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={servicesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ventas" fill="#3b82f6" name="Contratos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900">Servicios Populares</CardTitle>
              <p className="text-slate-600">Top 5 servicios más vendidos</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-slate-900">Internet Fibra</p>
                      <p className="text-slate-600">45 contratos</p>
                    </div>
                  </div>
                  <span className="text-blue-600">$3.6M</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-slate-900">Combo Triple</p>
                      <p className="text-slate-600">35 contratos</p>
                    </div>
                  </div>
                  <span className="text-purple-600">$5.6M</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-slate-900">Telefonía</p>
                      <p className="text-slate-600">32 contratos</p>
                    </div>
                  </div>
                  <span className="text-green-600">$1.4M</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Tv className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-slate-900">TV Cable</p>
                      <p className="text-slate-600">28 contratos</p>
                    </div>
                  </div>
                  <span className="text-amber-600">$1.5M</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-slate-900">Triple Plus</p>
                      <p className="text-slate-600">18 contratos</p>
                    </div>
                  </div>
                  <span className="text-indigo-600">$4.0M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Panel de Configuración y Pruebas */}
      <div>
        <h3 className="text-slate-900 mb-4">Configuración y Herramientas</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmailTestPanel />
        </div>
      </div>
    </div>
  );
}
