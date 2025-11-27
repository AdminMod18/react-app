import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Eye } from 'lucide-react';
import { Button } from './ui/button';

interface Case {
  id: string;
  cliente: string;
  documento: string;
  estado: 'completado' | 'en-proceso' | 'rechazado' | 'revision';
  etapa: string;
  asesor: string;
  fecha: string;
  tiempo: string;
}

const mockCases: Case[] = [
  { id: 'CASO-001', cliente: 'María García López', documento: '1234567890', estado: 'completado', etapa: 'Contrato Firmado', asesor: 'Juan Pérez', fecha: '2025-11-05 10:30', tiempo: '11 min' },
  { id: 'CASO-002', cliente: 'Carlos Rodríguez M.', documento: '2345678901', estado: 'en-proceso', etapa: 'Validación Crediticia', asesor: 'Ana López', fecha: '2025-11-05 11:15', tiempo: '8 min' },
  { id: 'CASO-003', cliente: 'Laura Martínez P.', documento: '3456789012', estado: 'completado', etapa: 'Contrato Firmado', asesor: 'Juan Pérez', fecha: '2025-11-05 09:45', tiempo: '13 min' },
  { id: 'CASO-004', cliente: 'Pedro Sánchez V.', documento: '4567890123', estado: 'rechazado', etapa: 'Validación Identidad', asesor: 'Carlos Díaz', fecha: '2025-11-05 08:20', tiempo: '5 min' },
  { id: 'CASO-005', cliente: 'Ana Fernández C.', documento: '5678901234', estado: 'en-proceso', etapa: 'Enrolamiento', asesor: 'Juan Pérez', fecha: '2025-11-05 12:00', tiempo: '3 min' },
  { id: 'CASO-006', cliente: 'José Torres R.', documento: '6789012345', estado: 'completado', etapa: 'Contrato Firmado', asesor: 'Ana López', fecha: '2025-11-04 16:30', tiempo: '12 min' },
  { id: 'CASO-007', cliente: 'Sofía Ramírez G.', documento: '7890123456', estado: 'revision', etapa: 'Revisión Manual', asesor: 'Carlos Díaz', fecha: '2025-11-05 10:00', tiempo: '15 min' },
  { id: 'CASO-008', cliente: 'Miguel Ángel Cruz', documento: '8901234567', estado: 'completado', etapa: 'Contrato Firmado', asesor: 'Juan Pérez', fecha: '2025-11-04 14:20', tiempo: '10 min' },
];

export function CasesList({ onSelectCase }: { onSelectCase: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCases = mockCases.filter(c => {
    const matchesSearch = c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.documento.includes(searchTerm) ||
                         c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (estado: Case['estado']) => {
    const variants = {
      'completado': { variant: 'default' as const, label: 'Completado', className: 'bg-green-600' },
      'en-proceso': { variant: 'default' as const, label: 'En Proceso', className: 'bg-blue-600' },
      'rechazado': { variant: 'destructive' as const, label: 'Rechazado', className: 'bg-red-600' },
      'revision': { variant: 'default' as const, label: 'Revisión', className: 'bg-orange-600' },
    };
    const config = variants[estado];
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 mb-1">Gestión de Casos</h2>
        <p className="text-slate-600">Lista completa de casos de venta con trazabilidad</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por cliente, documento o ID de caso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="en-proceso">En Proceso</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
                <SelectItem value="revision">Revisión</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Casos Registrados ({filteredCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Caso</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Etapa Actual</TableHead>
                <TableHead>Asesor</TableHead>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((caso) => (
                <TableRow key={caso.id}>
                  <TableCell className="font-mono">{caso.id}</TableCell>
                  <TableCell>{caso.cliente}</TableCell>
                  <TableCell>{caso.documento}</TableCell>
                  <TableCell>{getStatusBadge(caso.estado)}</TableCell>
                  <TableCell>{caso.etapa}</TableCell>
                  <TableCell>{caso.asesor}</TableCell>
                  <TableCell>{caso.fecha}</TableCell>
                  <TableCell>{caso.tiempo}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={onSelectCase}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
