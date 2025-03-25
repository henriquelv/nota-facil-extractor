
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Clock, Database, LineChart, Zap, Laptop } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="resources" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos avançados</h2>
          <p className="text-lg text-foreground/70">
            Tudo o que você precisa para gerenciar os produtos das suas notas fiscais
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Tabela totalmente editável",
              description: "Adicione, edite ou remova produtos com facilidade para corrigir qualquer erro de reconhecimento",
              icon: Edit,
              color: "bg-pink-100 text-pink-600"
            },
            {
              title: "Histórico de processamento",
              description: "Acesse suas notas fiscais processadas anteriormente e suas respectivas tabelas de produtos",
              icon: Clock,
              color: "bg-blue-100 text-blue-600"
            },
            {
              title: "Armazenamento seguro",
              description: "Suas notas fiscais e dados são armazenados com segurança e criptografia de ponta a ponta",
              icon: Database,
              color: "bg-indigo-100 text-indigo-600"
            },
            {
              title: "Análises e insights",
              description: "Visualize tendências de compras, preços médios e gastos com produtos específicos",
              icon: LineChart,
              color: "bg-green-100 text-green-600"
            },
            {
              title: "Processamento rápido",
              description: "Reconhecimento OCR de alta velocidade para resultados quase instantâneos",
              icon: Zap,
              color: "bg-amber-100 text-amber-600"
            },
            {
              title: "Acesso em qualquer dispositivo",
              description: "Utilize o serviço no seu computador, tablet ou smartphone com interface adaptativa",
              icon: Laptop,
              color: "bg-purple-100 text-purple-600"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-panel rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center h-12 w-12 rounded-lg ${feature.color} mb-5`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button className="button-bounce text-base px-8 py-6 h-auto" size="lg">
            Comece a usar agora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
