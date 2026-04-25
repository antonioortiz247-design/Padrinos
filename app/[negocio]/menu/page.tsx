import { Cart } from '@/components/Cart';
import { DeliverySelector } from '@/components/DeliverySelector';
import { FooterActions } from '@/components/FooterActions';
import { Header } from '@/components/Header';
import { MenuList } from '@/components/MenuList';
import { PaymentSelector } from '@/components/PaymentSelector';
import { Product } from '@/lib/types';
import { getBusinessBySlug, getBusinessProducts, getBusinessSettings } from '@/lib/admin-queries';
import { buildPathWithNegocio } from '@/lib/business-config';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const baseProducts = [
  'El Padrino',
  'Mar y Tierra',
  'Pulpo al Ajillo',
  'Camarón',
  'Arrachera',
  'Chistorra',
  'Chorizo Argentino',
  'Aguja Norteña'
];

// Reemplaza "archivo.ext" por el nombre real de archivo (ej: pechuga.jpg o productos/pechuga.jpg).
const PRODUCT_IMAGE_FILE_NAMES: Partial<Record<string, string>> = {
  'El Padrino': 'TacoCampechano.jpg',
  'Mar y Tierra': 'TacodeChuleta.jpg',
  'Pulpo al Ajillo': 'TacodeSuadero.png',
  Camarón: 'TacodePechuga.jpg',
  Arrachera: 'TacodeBarriga.jpg',
  Chistorra: 'TacodeLonganiza.jpg',
  'Chorizo Argentino': 'TacoArgentino.jpg',
  'Aguja Norteña': 'TacodeSuadero.png'
};

function getProductImageUrl(productName: string): string | undefined {
  const fileName = PRODUCT_IMAGE_FILE_NAMES[productName]?.trim();

  if (!fileName || fileName === 'archivo.ext') {
    return undefined;
  }

  return fileName.startsWith('/') ? fileName : `/${fileName}`;
}

const fallbackProducts: Product[] = [
  {
    id: 't-1',
    businessId: 'default',
    category: 'tacos',
    name: 'El Padrino',
    description: 'Arrachera + camarón, combinación perfecta de mar y tierra',
    price: 80,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl('El Padrino')
  },
  {
    id: 't-2',
    businessId: 'default',
    category: 'tacos',
    name: 'Mar y Tierra',
    description: 'Arrachera con camarón al grill',
    price: 80,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl('Mar y Tierra')
  },
  {
    id: 't-3',
    businessId: 'default',
    category: 'tacos',
    name: 'Pulpo al Ajillo',
    description: 'Pulpo suave con mantequilla y ajo',
    price: 80,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl('Pulpo al Ajillo')
  },
  {
    id: 't-4',
    businessId: 'default',
    category: 'tacos',
    name: 'Camarón',
    description: 'Jugoso y dorado al ajillo',
    price: 80,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl('Camarón')
  },
  {
    id: 't-5',
    businessId: 'default',
    category: 'tacos',
    name: 'Arrachera',
    description: 'Carne suave con sazón de la casa',
    price: 50,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl('Arrachera')
  },
  {
    id: 't-6',
    businessId: 'default',
    category: 'tacos',
    name: 'Chistorra',
    description: 'Intensa y ligeramente picante',
    price: 50,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl('Chistorra')
  },
  {
    id: 't-7',
    businessId: 'default',
    category: 'tacos',
    name: 'Chorizo Argentino',
    description: 'Sabor ahumado estilo artesanal',
    price: 50,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl('Chorizo Argentino')
  },
  {
    id: 't-8',
    businessId: 'default',
    category: 'tacos',
    name: 'Aguja Norteña',
    description: 'Corte jugoso con grasa perfecta',
    price: 50,
    active: true,
    customizable: true,
    imageUrl: getProductImageUrl('Aguja Norteña')
  },
  {
    id: 'x-1',
    businessId: 'default',
    category: 'especialidades',
    name: 'Queso extra',
    price: 15,
    active: true,
    customizable: false
  },
  {
    id: 'x-2',
    businessId: 'default',
    category: 'especialidades',
    name: 'Guacamole',
    price: 20,
    active: true,
    customizable: false
  },
  {
    id: 'x-3',
    businessId: 'default',
    category: 'especialidades',
    name: 'Salsa especial',
    price: 10,
    active: true,
    customizable: false
  },
  {
    id: 'b-1',
    businessId: 'default',
    category: 'viernes',
    name: 'Agua natural 1L',
    price: 45,
    active: true,
    customizable: false
  },
  {
    id: 'b-2',
    businessId: 'default',
    category: 'viernes',
    name: 'Refresco',
    price: 30,
    active: true,
    customizable: false
  }
];

export default async function BusinessMenuPage({ params }: { params: { negocio: string } }) {
  // Intentar obtener el negocio real desde la base de datos
  const business = await getBusinessBySlug(params.negocio);
  
  // Obtener configuración del negocio (teléfono de WhatsApp)
  const settings = business ? await getBusinessSettings(business.id) : null;
  const waPhone = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WA_PHONE || "5586495622";

  const businessDisplayName = business?.name || (params.negocio === 'padrinos' ? 'Los Padrinos – Mar y Tierra' : params.negocio);
  const businessId = business?.id || params.negocio;

  // Obtener productos desde la DB
  let dbProducts = business ? await getBusinessProducts(business.id) : [];
  
  // SI NO HAY PRODUCTOS EN DB, usamos el fallback del demo para asegurar que siempre haya contenido
  const products = dbProducts.length > 0 ? (dbProducts as any as Product[]) : fallbackProducts;

  return (
    <main className="mx-auto min-h-screen max-w-6xl pb-24">
      <Header title={businessDisplayName} subtitle="Tacos de mar y tierra al siguiente nivel" eventHref={`/${params.negocio}/eventos`} />

      <section className="grid gap-4 p-4 md:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] md:gap-5 md:p-6">
        <div className="space-y-3">
          <div className="surface-card p-4">
            <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">Menú del día</h2>
            <p className="mt-1 text-sm text-[var(--subtext)]">Selecciona tus favoritos, personaliza y confirma tu pedido en WhatsApp.</p>
          </div>
          <MenuList products={products} />
        </div>

        <div className="space-y-4 md:sticky md:top-[92px] md:self-start">
          <DeliverySelector />
          <PaymentSelector />
          <Cart waPhone={waPhone} businessName={businessDisplayName} businessId={businessId} />
        </div>
      </section>

      <FooterActions dashboardHref={buildPathWithNegocio('/admin/login', params.negocio)} />
    </main>
  );
}
