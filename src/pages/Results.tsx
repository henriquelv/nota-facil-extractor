
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronLeft, Download, FileText, Edit } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products = [], receiptInfo = {} } = location.state || {};

  const handleBack = () => {
    navigate('/');
  };

  const handleExport = (format: string) => {
    console.log(`Exporting data as ${format}`);
    // Implementation for exporting would go here
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="mb-4 gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Produtos Extraídos</h1>
            {receiptInfo.storeName && (
              <p className="text-muted-foreground">
                {receiptInfo.storeName} • {receiptInfo.date}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleExport('csv')}>
              <FileText className="h-4 w-4" />
              CSV
            </Button>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Editar Tabela
            </Button>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableCaption>
                Total de {products.length} produtos extraídos
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="w-[100px] text-right">Qtd</TableHead>
                  <TableHead className="w-[150px] text-right">Preço Unit.</TableHead>
                  <TableHead className="w-[150px] text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">R$ {product.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">R$ {product.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-muted/20">
            <p className="text-xl text-muted-foreground">Nenhum produto encontrado</p>
            <p className="text-sm text-muted-foreground mt-2">Tente novamente com outra imagem</p>
            <Button className="mt-4" onClick={handleBack}>Voltar para o início</Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Results;
