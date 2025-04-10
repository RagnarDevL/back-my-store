import { Controller, Get, Post, Body, Header, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { TransactionRepository, TRANSACTION_REPOSITORY } from './core/ports/transaction.repository';
import { Transaction } from './core/domain/transaction.entity';
import { ProductService } from './core/services/product.service';
import { Product } from './core/domain/product.entity';
import axios from 'axios';
// @ts-ignore
const CryptoJS = require('crypto-js');
import { WompiConfig } from './config/wompi.config';

@Controller()
export class AppController {
  constructor(
    private readonly productService: ProductService,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository
  ) {}

  @Get('/api/test')
  @Header('Access-Control-Allow-Origin', '*')
  getTest(): { message: string } {
    return { message: 'Backend connection successful!' };
  }

  @Get('/api/products')
  async getProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }


  @Post('/api/payments/secure')
  @Header('Access-Control-Allow-Origin', '*')
  async processSecurePayment(@Body() paymentData: any) {
    
    function generarReferencia() {
      const prefijo = "my-store-";
      const longitudNumeros = 6;
      const longitudLetras = 6;
  
      const generarLetras = (longitud) => {
          const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
          let resultado = '';
          for (let i = 0; i < longitud; i++) {
              const indice = Math.floor(Math.random() * caracteres.length);
              resultado += caracteres[indice];
          }
          return resultado;
      };
  
      const generarNumeros = (longitud) => {
          const caracteres = '0123456789';
          let resultado = '';
          for (let i = 0; i < longitud; i++) {
              const indice = Math.floor(Math.random() * caracteres.length);
              resultado += caracteres[indice];
          }
          return resultado;
      };
  
      const numeros = generarNumeros(longitudNumeros);
      const letras = generarLetras(longitudLetras);
  
      return prefijo + numeros + letras;
    }
    const Referencia = generarReferencia();
    const transaction = await this.transactionRepository.create({
      reference: Referencia,
      amount: paymentData.amount,
      product: paymentData.product,
      status: 'PENDING',
      shippingData: paymentData.shippingData
    });

    try {
      const wompiResponse = await this.processWompiPayment(paymentData.encryptedData, paymentData.amount);
      
      await this.transactionRepository.update(transaction.id, {
        status: wompiResponse.success ? 'COMPLETED' : 'FAILED'
        
      });

      const product = await this.productService.getProductById(paymentData.product.id);
      if (product) {
        await this.productService.updateProduct(product.id, {
          stock: product.stock - 1
        });
      }
    
      return {
        success: true,
        transactionId: transaction.id,
        reference: transaction.reference,
        wompiResponse
      };
    } catch (error) {
      await this.transactionRepository.update(transaction.id, {
        status: 'FAILED',
        wompiResponse: { error: error.message }
      });
      
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.BAD_REQUEST
      );
    }
    
  }

  private async processWompiPayment(encryptedData: string, amount: number): Promise<any> {
    try {
      const secretKey = "ClaveSecretaWompi";
      const decryptedStr = CryptoJS.AES.decrypt(
        encryptedData, 
        secretKey
      ).toString(CryptoJS.enc.Utf8);
      const cardData = JSON.parse(decryptedStr);
      
      if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
        throw new HttpException('Datos de tarjeta inválidos', HttpStatus.BAD_REQUEST);
      }

      const TokenCard = await axios.post(
        `${WompiConfig.SANDBOX_URL}/tokens/cards`,
        {
          number: cardData.number,
          exp_month: cardData.expiry.substring(0, 2),
          exp_year: cardData.expiry.substring(2, 4),
          cvc: cardData.cvv,
          card_holder: cardData.name
        },
        {
          headers: {
            'Authorization': `Bearer ${WompiConfig.PUBLIC_KEY}`
          }
        }
      );

      const ACCEPTANCE_TOKEN = await axios.get(
        `${WompiConfig.SANDBOX_URL}/merchants/${WompiConfig.PUBLIC_KEY}`
      );

      const PublicKey = ACCEPTANCE_TOKEN.data.data.presigned_acceptance.acceptance_token;
      function generarReferencia() {
          const prefijo = "my-store-";
          const longitudNumeros = 6;
          const longitudLetras = 6;
      
          const generarLetras = (longitud) => {
              const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
              let resultado = '';
              for (let i = 0; i < longitud; i++) {
                  const indice = Math.floor(Math.random() * caracteres.length);
                  resultado += caracteres[indice];
              }
              return resultado;
          };
      
          const generarNumeros = (longitud) => {
              const caracteres = '0123456789';
              let resultado = '';
              for (let i = 0; i < longitud; i++) {
                  const indice = Math.floor(Math.random() * caracteres.length);
                  resultado += caracteres[indice];
              }
              return resultado;
          };
      
          const numeros = generarNumeros(longitudNumeros);
          const letras = generarLetras(longitudLetras);
      
          return prefijo + numeros + letras;
      }
      const Referencia = generarReferencia();

      var cadenaConcatenada = Referencia+amount+WompiConfig.CURRENCY+WompiConfig.INTEGRITY_KEY;


      const encondedText = new TextEncoder().encode(cadenaConcatenada);
      const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
   

      const wompiResponse = await axios.post(
        `${WompiConfig.SANDBOX_URL}/transactions`,
        {
          acceptance_token: PublicKey,
          amount_in_cents: amount,
          signature: signature,
          currency: WompiConfig.CURRENCY,
          customer_email: WompiConfig.DEFAULT_EMAIL,
          payment_method: {
            type: 'CARD',
            token: TokenCard.data.data.id,
            installments: 1
          },
          reference: Referencia
        },
        {
          headers: {
            'Authorization': `Bearer ${WompiConfig.PRIVATE_KEY}`
          }
        }
      );

      if (wompiResponse.data.data.status != 'PENDING') {
        throw new HttpException('Pago no aprobado', HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        data: wompiResponse.data.data,
        message: 'pago valido'
      };
    } catch (error) {
      console.log("ERORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",error.response.data);

    }
  }
}
