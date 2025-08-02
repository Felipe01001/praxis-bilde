import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, CreditCard, Zap, Users, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const SubscriptionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para assinar');
      navigate('/auth/login');
      return;
    }

    setIsLoading(true);

    try {
      // Call edge function to create AbacatePay billing
      const response = await fetch('https://praxiis.xyz/functions/v1/create-abacatepay-billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`, // Use user ID as simple auth
        },
        body: JSON.stringify({
          user_id: user.id,
          user_data: {
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Cliente',
            email: user.email,
            cpf: user.user_metadata?.cpf || '00000000000'
          },
          amount: 9.90, // R$ 9,90
          description: 'Assinatura mensal PRAXIS'
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar cobrança');
      }

      const data = await response.json();

      if (data.success && data.redirect_url) {
        // Redirect to AbacatePay payment page
        window.location.href = data.redirect_url;
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Erro ao processar assinatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Gestão Completa de Clientes",
      description: "Organize todos os dados dos seus clientes em um só lugar"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Automação de Processos",
      description: "Automatize tarefas repetitivas e ganhe tempo"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Colaboração em Equipe",
      description: "Trabalhe em equipe de forma organizada"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Segurança e Backup",
      description: "Seus dados protegidos e sempre seguros"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Assine o PRAXIS
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Tenha acesso completo a todas as funcionalidades do sistema
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              R$ 9,90/mês
            </Badge>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="border-muted/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Plano Mensal</CardTitle>
                <div className="text-3xl font-bold text-primary mt-2">
                  R$ 9,90<span className="text-lg text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Acesso completo ao sistema</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Gestão ilimitada de clientes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Geração de petições</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Consulta de processos</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Backup automático</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Suporte técnico</span>
                  </div>
                </div>

                <Button 
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Assinar Agora'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Pagamento seguro via PIX • Cancele quando quiser
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Support */}
          <Card className="mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Precisa de Ajuda?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Entre em contato conosco se tiver dúvidas sobre a assinatura.
              </p>
              <Button variant="outline" size="sm">
                Falar com Suporte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;