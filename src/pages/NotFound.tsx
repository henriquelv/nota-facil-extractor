
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center max-w-md animate-slide-up">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl font-medium mb-6">Página não encontrada</p>
        <p className="text-foreground/70 mb-8">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        <Button className="button-bounce gap-2" onClick={() => window.location.href = "/"}>
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
