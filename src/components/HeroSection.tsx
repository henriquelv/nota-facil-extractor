import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Camera, Upload, ChevronDown, FileText } from 'lucide-react';
import { toast } from "sonner";

const HeroSection: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const processReceipt = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      let extractedProducts = [];

      const extractProductsFromText = (text: string) => {
        const lines = text.split('\n');
        const products = [];
        
        // Padrões de regex melhorados
        const pricePattern = /R\$\s*(\d+[.,]\d{2})/;
        const quantityPatterns = [
          /(\d+)\s*[xX]\s*(?=R\$)/,  // Formato: "2 x R$"
          /(\d+)\s*(?:UN|UNID|UND?|PÇ|PC)\b/i,  // Formatos: UN, UNID, UND, PÇ, PC
          /QTD[E:]?\s*(\d+)/i,  // Formato: QTD: 2 ou QTDE 2
          /(\d+)\s*(?=\s*(?:R\$|,|\.))/  // Número seguido de R$ ou vírgula/ponto
        ];
        
        // Padrões para identificar linhas de produto
        const productLinePatterns = [
          /R\$\s*\d+[.,]\d{2}/,  // Linha contém preço
          /\d+\s*(?:UN|UNID|UND?|PÇ|PC)\b/i,  // Linha contém unidade
          /ITEM|PRODUTO|DESCRIÇÃO/i  // Linha contém palavras-chave
        ];

        let currentProduct = null;
        
        for (let line of lines) {
          line = line.trim();
          
          // Verifica se a linha parece ser um produto
          const isProductLine = productLinePatterns.some(pattern => pattern.test(line));
          
          if (isProductLine) {
            // Extrai o preço
            const priceMatch = line.match(pricePattern);
            const unitPrice = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
            
            // Extrai a quantidade usando vários padrões
            let quantity = 1;
            for (const pattern of quantityPatterns) {
              const match = line.match(pattern);
              if (match) {
                quantity = parseInt(match[1]);
                break;
              }
            }
            
            // Remove preços e quantidades do nome do produto
            let name = line
              .replace(pricePattern, '')
              .replace(/(\d+)\s*(?:UN|UNID|UND?|PÇ|PC)\b/ig, '')
              .replace(/QTD[E:]?\s*\d+/ig, '')
              .replace(/\s+/g, ' ')
              .trim();
            
            // Remove códigos de produto comuns
            name = name.replace(/^\d{1,6}\s*[-–]\s*/, '');
            
            // Se o nome não estiver vazio, adiciona o produto
            if (name && unitPrice > 0) {
              products.push({
                id: `product-${products.length + 1}`,
                name,
                quantity,
                unitPrice,
                totalPrice: quantity * unitPrice
              });
            }
          }
        }
        
        return products;
      };

      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        const text = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });

        extractedProducts = extractProductsFromText(text as string);

      } else if (file.type.includes('image/')) {
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker('por');
        
        const imageData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result);
          reader.readAsDataURL(file);
        });

        const { data: { text } } = await worker.recognize(imageData as string);
        await worker.terminate();

        extractedProducts = extractProductsFromText(text);
      }

      navigate('/results', { 
        state: { 
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadDate: new Date().toISOString(),
          products: extractedProducts
        } 
      });
      
      toast.success('Arquivo processado com sucesso!');
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast.error('Erro ao processar o arquivo. Por favor, tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Accept images, PDFs and other document formats
      const acceptedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      const isAccepted = acceptedTypes.some(type => file.type.includes(type));
      
      if (isAccepted) {
        processReceipt(file);
      } else {
        toast.error("Formato de arquivo não suportado. Por favor, envie imagens, PDFs ou documentos do Word.");
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Accept images, PDFs and other document formats
      const acceptedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      const isAccepted = acceptedTypes.some(type => file.type.includes(type));
      
      if (isAccepted) {
        processReceipt(file);
      } else {
        toast.error("Formato de arquivo não suportado. Por favor, envie imagens, PDFs ou documentos do Word.");
      }
    }
  };
  
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const activateCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
    }
  };
  
  const deactivateCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };
  
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            // Convert blob to file
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            processReceipt(file);
            deactivateCamera();
          }
        }, 'image/jpeg');
      }
    }
  };
  
  return (
    <section className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-50"></div>
        <div className="absolute top-48 left-1/4 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse-opacity"></div>
        <div className="absolute bottom-24 right-1/4 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl opacity-20 animate-pulse-opacity" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 animate-slide-down" style={{ animationDelay: '0.3s' }}>
        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mb-4">
          Reconhecimento inteligente de notas fiscais
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 max-w-3xl mx-auto leading-tight">
          Extraia produtos de notas fiscais em segundos
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-10">
          Tire uma foto ou envie a imagem/PDF da sua nota fiscal e transforme-a automaticamente em uma tabela editável com todos os detalhes dos produtos.
        </p>
        
        {!cameraActive ? (
          <div 
            className={`max-w-xl mx-auto rounded-xl border-2 border-dashed p-8 transition-all duration-300 ${
              isDragging 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium mb-1">Envie sua nota fiscal</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Arraste e solte aqui ou selecione no seu dispositivo (imagens, PDFs ou documentos)
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button 
                    onClick={openFileDialog}
                    className="button-bounce gap-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Selecionar Arquivo
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={activateCamera}
                    className="button-bounce gap-2"
                    disabled={isProcessing}
                  >
                    <Camera className="h-4 w-4" />
                    Usar Câmera
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto rounded-xl overflow-hidden border shadow-lg">
            <div className="relative">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                className="w-full h-auto"
              ></video>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={deactivateCamera}
                    className="button-bounce bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={captureImage}
                    className="button-bounce gap-2 bg-white text-primary hover:bg-white/90"
                  >
                    <Camera className="h-4 w-4" />
                    Capturar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <a 
        href="#how-it-works" 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
      >
        <span className="text-sm">Saiba mais</span>
        <ChevronDown className="h-5 w-5 animate-bounce-subtle" />
      </a>
    </section>
  );
};

export default HeroSection;
