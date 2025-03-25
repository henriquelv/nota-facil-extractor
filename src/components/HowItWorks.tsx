
import React from 'react';
import { Camera, FileText, Table, Download } from 'lucide-react';

const steps = [
  {
    title: "Captura",
    description: "Tire uma foto da sua nota fiscal ou faça upload de uma imagem existente",
    icon: Camera,
    color: "bg-blue-500"
  },
  {
    title: "Extração",
    description: "Nossa tecnologia OCR reconhece automaticamente os produtos, preços e quantidades",
    icon: FileText,
    color: "bg-indigo-500"
  },
  {
    title: "Edição",
    description: "Verifique e edite os dados extraídos em uma tabela interativa e intuitiva",
    icon: Table,
    color: "bg-purple-500"
  },
  {
    title: "Exportação",
    description: "Exporte os dados para Excel, CSV ou PDF em apenas um clique",
    icon: Download,
    color: "bg-pink-500"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona</h2>
          <p className="text-lg text-foreground/70">
            Nosso processo simples transforma suas notas fiscais em dados organizados em apenas 4 passos
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group glass-panel rounded-xl p-6 relative overflow-hidden animate-slide-up transition-all duration-300 hover:shadow-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${step.color} opacity-10 -mr-6 -mt-6 transition-transform group-hover:scale-150 duration-500`}></div>
              
              <div className={`h-12 w-12 rounded-lg ${step.color} flex items-center justify-center mb-5 text-white`}>
                <step.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-foreground/70">{step.description}</p>
              
              <div className="absolute top-6 right-6 h-8 w-8 rounded-full border-2 border-muted flex items-center justify-center text-sm font-medium text-foreground/50">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
