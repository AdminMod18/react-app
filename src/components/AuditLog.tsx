import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Download, Calendar } from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  caseId: string;
  user: string;
  event: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

const mockAuditLog: AuditEntry[] = [
  { id: 'AUD-001', timestamp: '2025-11-05 12:35:42', caseId: 'CASO-005', user: 'Juan Pérez', event: 'Inicio de Caso', details: 'Caso iniciado para cliente Ana Fernández C.', status: 'success' },
  { id: 'AUD-002', timestamp: '2025-11-05 12:36:15', caseId: 'CASO-005', user: 'Sistema BPMS', event: 'Validación Identidad', details: 'Llamada API ID-TRUE - Respuesta OK (998ms)', status: 'success' },
  { id: 'AUD-003', timestamp: '2025-11-05 12:37:03', caseId: 'CASO-005', user: 'Juan Pérez', event: 'Enrolamiento', details: 'Datos personales capturados y validados', status: 'success' },
  { id: 'AUD-004', timestamp: '2025-11-05 11:18:22', caseId: 'CASO-002', user: 'Sistema BPMS', event: 'Validación Crediticia', details: 'Consulta centrales de riesgo - Score: 720', status: 'success' },
  { id: 'AUD-005', timestamp: '2025-11-05 11:19:45', caseId: 'CASO-002', user: 'Ana López', event: 'Carga de Documentos', details: '3 archivos adjuntados (Cédula, Comprobante domicilio, RUT)', status: 'success' },
  { id: 'AUD-006', timestamp: '2025-11-05 10:32:10', caseId: 'CASO-001', user: 'Sistema BPMS', event: 'Generación Contrato', details: 'Contrato CONT-2025-001 generado exitosamente', status: 'success' },
  { id: 'AUD-007', timestamp: '2025-11-05 10:33:28', caseId: 'CASO-001', user: 'María García López', event: 'Firma Digital', details: 'Contrato firmado con OTP verificado', status: 'success' },
  { id: 'AUD-008', timestamp: '2025-11-05 10:33:55', caseId: 'CASO-001', user: 'Sistema BPMS', event: 'Envío Contrato', details: 'Correo certificado enviado a maria.garcia@email.com', status: 'success' },
  { id: 'AUD-009', timestamp: '2025-11-05 10:34:01', caseId: 'CASO-001', user: 'Sistema BPMS', event: 'Almacenamiento ECM', details: 'Contrato archivado en ECM con hash SHA-256', status: 'success' },
  { id: 'AUD-010', timestamp: '2025-11-05 10:34:05', caseId: 'CASO-001', user: 'Sistema BPMS', event: 'Cierre de Caso', details: 'Caso completado exitosamente - Duración: 11 min', status: 'success' },
  { id: 'AUD-011', timestamp: '2025-11-05 08:22:33', caseId: 'CASO-004', user: 'Sistema BPMS', event: 'Validación Identidad', details: 'Rechazo por discrepancia en datos biométricos', status: 'error' },
  { id: 'AUD-012', timestamp: '2025-11-05 08:22:40', caseId: 'CASO-004', user: 'Carlos Díaz', event: 'Cierre de Caso', details: 'Caso rechazado - No supera validación de identidad', status: 'error' },
  { id: 'AUD-013', timestamp: '2025-11-05 10:05:12', caseId: 'CASO-007', user: 'Sistema BPMS', event: 'Validación Crediticia', details: 'Score bajo (580) - Requiere revisión manual', status: 'warning' },
  { id: 'AUD-014', timestamp: '2025-11-05 10:06:30', caseId: 'CASO-007', user: 'Carlos Díaz', event: 'Revisión Manual', details: 'Caso escalado a supervisor para aprobación', status: 'warning' },
];

export function AuditLog() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLog = mockAuditLog.filter(entry => 
    entry.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: AuditEntry['status']) => {
    const variants = {
      'success': { className: 'bg-green-600', label: 'Éxito' },
      'warning': { className: 'bg-orange-600', label: 'Advertencia' },
      'error': { className: 'bg-red-600', label: 'Error' },
    };
    const config = variants[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleExport = () => {
    alert('Exportando registro de auditoría a CSV...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 mb-1">Registro de Auditoría</h2>
        <p className="text-slate-600">Trazabilidad completa de eventos del sistema BPMS</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Filtros y Exportación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por ID de caso, usuario o evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Filtrar Fecha
            </Button>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Eventos Registrados ({filteredLog.length})</CardTitle>
          <p className="text-slate-600">Cada operación crítica queda registrada con usuario, fecha y payload</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>ID Caso</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono">{entry.timestamp}</TableCell>
                  <TableCell className="font-mono">{entry.caseId}</TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>{entry.event}</TableCell>
                  <TableCell className="max-w-md">{entry.details}</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Cumplimiento de Trazabilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-slate-600">Eventos Registrados Hoy</p>
              <p className="text-slate-900 mt-1">{mockAuditLog.length}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-slate-600">Cobertura de Auditoría</p>
              <p className="text-slate-900 mt-1">100%</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-slate-600">Retención de Logs</p>
              <p className="text-slate-900 mt-1">7 años</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
