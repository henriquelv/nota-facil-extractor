import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronLeft, FileText, Download, Edit, Save, X } from 'lucide-react';
import { toast } from "sonner";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface FileInfo {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  products?: Product[];
}

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
  const [fileInfo, setFileInfo] = useState<FileInfo>(location.state || {});
  const [isEditing, setIsEditing] = useState(false);
  const [editingProducts, setEditingProducts] = useState<Product[]>([]);

  const handleBack = () => {
    navigate('/');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const exportToExcel = () => {
    try {
      const headers = ['Produto', 'Quantidade', 'Preço Unitário', 'Total'];
      const productsData = fileInfo.products?.map(product => [
        product.name,
        product.quantity,
        product.unitPrice.toFixed(2),
        product.totalPrice.toFixed(2)
      ]) || [];
      
      const csvContent = [
        headers.join(','),
        ...productsData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `produtos_${fileInfo.fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Arquivo CSV exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar arquivo:', error);
      toast.error('Erro ao exportar arquivo. Tente novamente.');
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Adiciona título
      doc.setFontSize(16);
      doc.text('Relatório de Produtos', 14, 20);
      
      // Adiciona informações do arquivo
      doc.setFontSize(10);
      doc.text(`Arquivo: ${fileInfo.fileName}`, 14, 30);
      doc.text(`Data: ${formatDate(fileInfo.uploadDate)}`, 14, 35);
      
      // Configura a tabela
      const headers = [['Produto', 'Qtd', 'Preço Unit. (R$)', 'Total (R$)']];
      const data = fileInfo.products?.map(product => [
        product.name,
        product.quantity.toString(),
        product.unitPrice.toFixed(2),
        product.totalPrice.toFixed(2)
      ]) || [];
      
      // Adiciona a tabela
      (doc as any).autoTable({
        head: headers,
        body: data,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });
      
      // Calcula o total
      const total = fileInfo.products?.reduce((sum, product) => sum + product.totalPrice, 0) || 0;
      const finalY = (doc as any).lastAutoTable.finalY || 40;
      doc.text(`Total: R$ ${total.toFixed(2)}`, 14, finalY + 10);
      
      // Salva o PDF
      doc.save(`produtos_${fileInfo.fileName}.pdf`);
      
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF. Tente novamente.');
    }
  };

  const handleEdit = () => {
    setEditingProducts(fileInfo.products?.map(p => ({...p})) || []);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Recalcula os totais e atualiza o estado
    const updatedProducts = editingProducts.map(product => ({
      ...product,
      totalPrice: product.quantity * product.unitPrice
    }));
    
    setFileInfo(prev => ({
      ...prev,
      products: updatedProducts
    }));
    setIsEditing(false);
    toast.success('Alterações salvas com sucesso!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingProducts([]);
  };

  const handleProductChange = (id: string, field: keyof Product, value: string) => {
    setEditingProducts(prev => 
      prev.map(product => {
        if (product.id === id) {
          const updatedProduct = { ...product };
          if (field === 'quantity') {
            updatedProduct[field] = parseInt(value) || 0;
          } else if (field === 'unitPrice') {
            updatedProduct[field] = parseFloat(value) || 0;
          } else {
            updatedProduct[field] = value;
          }
          return updatedProduct;
        }
        return product;
      })
    );
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
            <h1 className="text-3xl font-bold">Detalhes do Arquivo</h1>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" className="gap-2" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button className="gap-2" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="gap-2" onClick={exportToExcel}>
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
                <Button variant="outline" className="gap-2" onClick={exportToPDF}>
                  <FileText className="h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button className="gap-2" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                  Editar Tabela
                </Button>
              </>
            )}
          </div>
        </div>

        {fileInfo.fileName ? (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  {fileInfo.fileName}
                </CardTitle>
                <CardDescription>
                  Informações do arquivo processado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Tipo do Arquivo</h3>
                      <p className="text-muted-foreground">{fileInfo.fileType}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Tamanho</h3>
                      <p className="text-muted-foreground">{formatFileSize(fileInfo.fileSize)}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Data de Upload</h3>
                    <p className="text-muted-foreground">{formatDate(fileInfo.uploadDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(isEditing ? editingProducts : fileInfo.products)?.length > 0 ? (
              <div className="rounded-lg border shadow-sm overflow-hidden">
                <Table>
                  <TableCaption>
                    Total de {fileInfo.products?.length} produtos extraídos
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
                    {(isEditing ? editingProducts : fileInfo.products)?.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={product.name}
                              onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                              className="w-full"
                            />
                          ) : (
                            <span className="font-medium">{product.name}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                              className="w-20 ml-auto"
                            />
                          ) : (
                            product.quantity
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={product.unitPrice}
                              onChange={(e) => handleProductChange(product.id, 'unitPrice', e.target.value)}
                              className="w-28 ml-auto"
                            />
                          ) : (
                            `R$ ${product.unitPrice.toFixed(2)}`
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {(product.quantity * product.unitPrice).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16 border rounded-lg bg-muted/20">
                <p className="text-xl text-muted-foreground">Nenhum produto encontrado</p>
                <p className="text-sm text-muted-foreground mt-2">O arquivo não contém produtos ou não foi possível extraí-los</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-muted/20">
            <p className="text-xl text-muted-foreground">Nenhum arquivo processado</p>
            <p className="text-sm text-muted-foreground mt-2">Tente novamente com outro arquivo</p>
            <Button className="mt-4" onClick={handleBack}>Voltar para o início</Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Results;
