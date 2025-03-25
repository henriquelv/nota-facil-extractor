
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Camera, Upload, ChevronDown, Image } from 'lucide-react';
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
  
  const processReceipt = (file: File) => {
    setIsProcessing(true);
    
    // Simulate OCR processing with a timeout
    // In a real implementation, this would be an API call to an OCR service
    setTimeout(() => {
      setIsProcessing(false);
      
      // Mock data - in a real app, this would come from the OCR service
      const mockProducts = [
        {
          id: '1',
          name: 'Arroz Integral 1kg',
          quantity: 2,
          unitPrice: 8.99,
          totalPrice: 17.98
        },
        {
          id: '2',
          name: 'Feijão Preto 1kg',
          quantity: 1,
          unitPrice: 6.49,
          totalPrice: 6.49
        },
        {
          id: '3',
          name: 'Azeite de Oliva Extra Virgem 500ml',
          quantity: 1,
          unitPrice: 24.90,
          totalPrice: 24.90
        },
        {
          id: '4',
          name: 'Café em Grãos 250g',
          quantity: 2,
          unitPrice: 15.90,
          totalPrice: 31.80
        },
        {
          id: '5',
          name: 'Leite Integral 1L',
          quantity: 3,
          unitPrice: 4.99,
          totalPrice: 14.97
        }
      ];
      
      const mockReceiptInfo = {
        storeName: 'Supermercado Brasil',
        date: '15/06/2023',
        totalAmount: 96.14
      };
      
      // Navigate to results page with the extracted data
      navigate('/results', { 
        state: { 
          products: mockProducts,
          receiptInfo: mockReceiptInfo
        } 
      });
      
      toast.success('Nota fiscal processada com sucesso!');
    }, 3000);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('image')) {
        processReceipt(file);
      } else {
        toast.error("Por favor, envie apenas arquivos de imagem");
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.includes('image')) {
        processReceipt(file);
      } else {
        toast.error("Por favor, envie apenas arquivos de imagem");
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
          Tire uma foto ou envie a imagem da sua nota fiscal e transforme-a automaticamente em uma tabela editável com todos os detalhes dos produtos.
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
              accept="image/*"
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Image className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium mb-1">Envie sua nota fiscal</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Arraste e solte aqui ou selecione no seu dispositivo
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
