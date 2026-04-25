'use client';

import { useState, useMemo } from 'react';
import { updateProductPrice, seedProducts, createProduct, deleteProduct } from '@/lib/actions';
import { Product, ProductCategory } from '@/lib/types';
import { Save, Loader2, DollarSign, CheckCircle2, Search, Filter, Tag, PlusCircle, X, Trash2 } from 'lucide-react';

export function ProductPriceManager({ products: initialProducts, businessId }: { products: Product[], businessId?: string }) {
  const [products, setProducts] = useState(initialProducts);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [searchTerm, setSearchBar] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isSeeding, setIsSeeding] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const businessIdentifierKind = useMemo<'uuid' | 'slug' | 'missing'>(() => {
    if (!businessId) return 'missing';
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(businessId);
    return isUUID ? 'uuid' : 'slug';
  }, [businessId]);
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: 'tacos' as ProductCategory,
    description: '',
    imageUrl: ''
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageFile = (file?: File) => {
    if (!file) return;
    const maxFileSize = 1.5 * 1024 * 1024; // 1.5MB
    if (file.size > maxFileSize) {
      alert('La imagen es muy grande. Usa una imagen menor a 1.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setNewProduct((prev) => ({ ...prev, imageUrl: result }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    setIsAdding(true);
    try {
      const result = await createProduct({
        ...newProduct,
        businessId
      });
      if (result.success) {
        setProducts(prev => [...prev, result.product as any]);
        setIsAdding(false);
        setNewProduct({ name: '', price: 0, category: 'tacos', description: '', imageUrl: '' });
        setImagePreview('');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto del menú?')) return;
    const result = await deleteProduct(id);
    if (!result.success) {
      alert(`No se pudo eliminar: ${result.error}`);
      return;
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSeed = async () => {
    console.log('Iniciando importación para businessId:', businessId);
    if (!businessId) {
      alert('Error: ID de negocio no encontrado. Revisa tus variables de entorno.');
      return;
    }
    setIsSeeding(true);
    try {
      const result = await seedProducts(businessId);
      console.log('Resultado de seed:', result);
      if (result.success) {
        alert('¡Menú importado con éxito! La página se recargará.');
        window.location.reload();
      } else {
        alert('Error al importar el menú: ' + result.error);
      }
    } catch (error) {
      console.error('Error en handleSeed:', error);
      alert('Error de conexión al intentar importar');
    } finally {
      setIsSeeding(false);
    }
  };

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  const handlePriceChange = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price: isNaN(price) ? 0 : price } : p));
  };

  const handleSave = async (id: string, price: number) => {
    if (price < 0) {
      alert('El precio no puede ser negativo');
      return;
    }
    
    setUpdatingId(id);
    setSuccessId(null);
    try {
      const result = await updateProductPrice(id, price);
      if (result.success) {
        setSuccessId(id);
        setTimeout(() => setSuccessId(null), 3000);
      } else {
        alert(`Error al actualizar el precio: ${result.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error inesperado de conexión');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const categoryLabels: Record<string, string> = {
    tacos: 'Tacos',
    especialidades: 'Extras',
    viernes: 'Bebidas',
    miercoles: 'Miércoles',
    jueves: 'Jueves'
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 shadow-sm overflow-hidden">
      <div className="border-b border-white/10 bg-white/5 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
              <DollarSign size={22} className="text-[var(--accent)]" />
              Editor de Menú
            </h2>
            <p className="text-sm text-[var(--subtext)] mt-1">Actualiza los precios de tu menú en tiempo real</p>
            <p className="mt-2 text-xs text-[var(--subtext)]">
              Identificador actual:{' '}
              <span className="font-mono">{businessId || 'no configurado'}</span>{' '}
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text)]">
                {businessIdentifierKind}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {products.length === 0 && (
              <button 
                onClick={handleSeed}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-[var(--bg)] hover:opacity-90 disabled:opacity-50"
              >
                {isSeeding ? <Loader2 className="animate-spin" size={16} /> : <PlusCircle size={16} />}
                Importar Menú Base
              </button>
            )}
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-2 rounded-xl bg-[rgb(var(--primary-rgb)/0.25)] px-4 py-2 text-xs font-bold text-[var(--text)] hover:bg-[rgb(var(--primary-rgb)/0.3)]"
            >
              {isAdding ? <X size={16} /> : <PlusCircle size={16} />}
              {isAdding ? 'Cerrar' : 'Añadir Producto'}
            </button>
            <span className="inline-flex items-center rounded-full bg-[rgb(var(--accent-rgb)/0.15)] px-3 py-1 text-xs font-bold text-[var(--accent)]">
              {products.length} productos
            </span>
          </div>
        </div>
        
        {isAdding && (
          <form onSubmit={handleAddProduct} className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-sm font-bold text-[var(--text)]">Nuevo Producto</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <input 
                required
                placeholder="Nombre del producto"
                value={newProduct.name}
                onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
              <input 
                required
                type="number"
                placeholder="Precio"
                value={newProduct.price || ''}
                onChange={e => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
              <select
                value={newProduct.category}
                onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="tacos">Tacos</option>
                <option value="especialidades">Extras</option>
                <option value="viernes">Bebidas</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
              </select>
              <button 
                type="submit"
                disabled={isAdding && !newProduct.name}
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--bg)] hover:opacity-90 disabled:opacity-50"
              >
                Guardar Nuevo Producto
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                type="url"
                placeholder="URL de imagen (opcional)"
                value={newProduct.imageUrl}
                onChange={(e) => {
                  setNewProduct((prev) => ({ ...prev, imageUrl: e.target.value }));
                  setImagePreview(e.target.value);
                }}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFile(e.target.files?.[0])}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--accent)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[var(--bg)]"
              />
            </div>
            {imagePreview ? (
              <div className="mt-3">
                <p className="mb-1 text-xs text-[var(--subtext)]">Vista previa de imagen</p>
                <img src={imagePreview} alt="Vista previa" className="h-24 w-24 rounded-lg border object-cover" />
              </div>
            ) : null}
          </form>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchBar(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.2)]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.2)]"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{categoryLabels[cat] || cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
        <table className="min-w-[720px] w-full text-left text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-[rgb(var(--bg-rgb)/0.95)] backdrop-blur-sm text-[var(--subtext)]">
            <tr>
              <th className="border-b border-white/10 px-3 py-4 font-semibold sm:px-6">Producto</th>
              <th className="border-b border-white/10 px-3 py-4 font-semibold sm:px-6">Imagen</th>
              <th className="border-b border-white/10 px-3 py-4 font-semibold text-right sm:px-6">Precio ($)</th>
              <th className="border-b border-white/10 px-3 py-4 font-semibold text-center sm:px-6">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                <td className="px-3 py-4 sm:px-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {product.name}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--subtext)] mt-0.5">
                      <Tag size={10} />
                      {categoryLabels[product.category] || product.category}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 sm:px-6">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg border border-white/10 object-cover"
                    />
                  ) : (
                    <span className="text-xs text-[var(--subtext)]">Sin imagen</span>
                  )}
                </td>
                <td className="px-3 py-4 text-right sm:px-6">
                  <div className="inline-flex items-center rounded-xl border-2 border-white/10 bg-white/5 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[rgb(var(--accent-rgb)/0.2)] transition-all shadow-sm">
                    <span className="pl-3 text-[var(--subtext)] font-medium">$</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={product.price}
                      onChange={(e) => handlePriceChange(product.id, e.target.value)}
                      className="w-16 bg-transparent py-2 pr-3 text-right text-sm font-black text-[var(--text)] focus:outline-none sm:w-20"
                    />
                  </div>
                </td>
                <td className="px-3 py-4 text-center sm:px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleSave(product.id, product.price)}
                      disabled={updatingId === product.id}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl min-w-[92px] px-3 py-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 sm:min-w-[100px] sm:px-4 ${
                        successId === product.id
                          ? 'bg-[rgb(var(--primary-rgb)/0.7)] text-[var(--text)] shadow-[rgb(var(--primary-rgb)/0.25)]'
                          : updatingId === product.id
                          ? 'bg-white/10 text-[var(--subtext)] cursor-not-allowed'
                          : 'bg-[var(--accent)] text-[var(--bg)] hover:opacity-90 hover:shadow-md'
                      }`}
                    >
                      {successId === product.id ? (
                        <CheckCircle2 size={16} />
                      ) : updatingId === product.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      <span>{successId === product.id ? 'OK' : updatingId === product.id ? '...' : 'Guardar'}</span>
                    </button>
                    <button
                      onClick={() => void handleDelete(product.id)}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      title="Eliminar producto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center text-[var(--subtext)]">
            <div className="rounded-full bg-white/5 p-4 mb-4">
              <Search size={32} className="text-[var(--subtext)]" />
            </div>
            <p className="text-sm font-medium">No se encontraron productos</p>
            {products.length === 0 ? (
              <div className="mt-4 max-w-xs mx-auto">
                <p className="text-xs mb-4">Parece que tu menú aún no está en la base de datos. ¿Quieres importar el menú predeterminado?</p>
                <button 
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-bold text-[var(--bg)] hover:opacity-90 disabled:opacity-50"
                >
                  {isSeeding ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
                  Importar Menú Base
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs mt-1">Prueba con otros filtros o términos de búsqueda</p>
                <button 
                  onClick={() => { setSearchBar(''); setCategoryFilter('all'); }}
                  className="mt-4 text-xs font-bold text-[var(--accent)] hover:underline"
                >
                  Limpiar filtros
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
