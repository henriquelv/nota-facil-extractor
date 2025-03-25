
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const plans = [
    {
      name: "Gratuito",
      description: "Para usuários individuais com necessidades básicas",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "5 notas fiscais por mês",
        "Extração básica de produtos",
        "Exportação para CSV",
        "7 dias de histórico"
      ],
      highlight: false,
      buttonText: "Começar Grátis"
    },
    {
      name: "Pro",
      description: "Para usuários frequentes que precisam de mais recursos",
      monthlyPrice: 29.90,
      yearlyPrice: 19.90,
      features: [
        "100 notas fiscais por mês",
        "Extração avançada com alta precisão",
        "Exportação para Excel, CSV e PDF",
        "Histórico ilimitado",
        "Suporte prioritário"
      ],
      highlight: true,
      buttonText: "Assinar Agora"
    },
    {
      name: "Empresarial",
      description: "Para empresas com grandes volumes de notas fiscais",
      monthlyPrice: 99.90,
      yearlyPrice: 79.90,
      features: [
        "Notas fiscais ilimitadas",
        "API para integração com ERP",
        "Todos os recursos do plano Pro",
        "Suporte dedicado",
        "Personalização de campos"
      ],
      highlight: false,
      buttonText: "Fale Conosco"
    }
  ];
  
  return (
    <section id="pricing" className="py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos e preços</h2>
          <p className="text-lg text-foreground/70 mb-8">
            Escolha o plano ideal para suas necessidades
          </p>
          
          <div className="inline-flex items-center p-1 rounded-full border bg-white shadow-sm">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                isAnnual 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-foreground/70 hover:text-foreground"
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Anual
              <span className="ml-2 text-xs font-normal opacity-80">
                (Economize 33%)
              </span>
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-foreground/70 hover:text-foreground"
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Mensal
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`glass-panel rounded-xl overflow-hidden transition-all duration-300 animate-slide-up ${
                plan.highlight 
                  ? "ring-2 ring-primary shadow-xl transform md:-translate-y-4" 
                  : "hover:shadow-lg"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.highlight && (
                <div className="bg-primary text-primary-foreground py-2 text-center text-sm font-medium">
                  Mais Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-foreground/70 h-12">{plan.description}</p>
                
                <div className="my-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      R$ {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-foreground/60 ml-2">
                        /mês
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.monthlyPrice > 0 && (
                    <p className="text-xs text-foreground/60 mt-1">
                      Cobrado anualmente como R$ {(plan.yearlyPrice * 12).toFixed(2)}
                    </p>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full button-bounce ${
                    plan.highlight ? "" : "bg-white border border-primary text-primary hover:bg-primary/10"
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
