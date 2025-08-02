import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound, FileCheck, CalendarClock, Users, FileText } from 'lucide-react';
import { useHoverEffect } from '@/hooks/useHoverEffect';

interface DashboardStatCardsProps {
  totalClients: number;
  totalCases: number;
  totalTasks: number;
  totalJudicialProcesses: number;
}

const DashboardStatCards = ({
  totalClients,
  totalCases,
  totalTasks,
  totalJudicialProcesses
}: DashboardStatCardsProps) => {
  const { handleMouseEnter, handleMouseLeave } = useHoverEffect();

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Link to="/clients">
        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200"
          onMouseEnter={(e) => handleMouseEnter(e, 0.4)}
          onMouseLeave={handleMouseLeave}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base lg:text-lg flex items-center gap-2 min-h-[40px] line-clamp-2">
              <Users className="h-5 w-5 flex-shrink-0 text-praxis-olive" />
              <span>Total de Clientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{totalClients}</div>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/cases">
        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200"
          onMouseEnter={(e) => handleMouseEnter(e, 0.4)}
          onMouseLeave={handleMouseLeave}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base lg:text-lg flex items-center gap-2 min-h-[40px] line-clamp-2">
              <FileCheck className="h-5 w-5 flex-shrink-0 text-praxis-olive" />
              <span>Total de Atendimentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{totalCases}</div>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/tasks">
        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200"
          onMouseEnter={(e) => handleMouseEnter(e, 0.4)}
          onMouseLeave={handleMouseLeave}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base lg:text-lg flex items-center gap-2 min-h-[40px] line-clamp-2">
              <CalendarClock className="h-5 w-5 flex-shrink-0 text-praxis-olive" />
              <span>Total de Tarefas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/judicial-processes">
        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200"
          onMouseEnter={(e) => handleMouseEnter(e, 0.4)}
          onMouseLeave={handleMouseLeave}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base lg:text-lg flex items-center gap-2 min-h-[40px] line-clamp-2">
              <FileText className="h-5 w-5 flex-shrink-0 text-praxis-olive" />
              <span>Processos Judiciais</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{totalJudicialProcesses}</div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default DashboardStatCards;
