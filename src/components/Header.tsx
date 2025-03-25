
import React from 'react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">NF</span>
          </span>
          <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            NotaFácil
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#resources" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Recursos
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Como Funciona
          </a>
          <a href="#pricing" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Preços
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-sm">Entrar</Button>
          <Button className="text-sm button-bounce">Experimente Grátis</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
