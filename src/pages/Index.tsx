import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClothingItem {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  trend: string;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const clothingItems: ClothingItem[] = [
    {
      id: 1,
      name: 'Классический блейзер',
      category: 'jacket',
      price: '12 990 ₽',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=600&fit=crop',
      trend: 'Business Chic'
    },
    {
      id: 2,
      name: 'Шёлковое платье',
      category: 'dress',
      price: '8 490 ₽',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop',
      trend: 'Elegant Evening'
    },
    {
      id: 3,
      name: 'Джинсовая куртка',
      category: 'jacket',
      price: '6 990 ₽',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop',
      trend: 'Urban Street'
    },
    {
      id: 4,
      name: 'Кожаная юбка',
      category: 'skirt',
      price: '9 990 ₽',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=600&fit=crop',
      trend: 'Edgy Modern'
    },
    {
      id: 5,
      name: 'Льняная рубашка',
      category: 'shirt',
      price: '4 990 ₽',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=600&fit=crop',
      trend: 'Casual Minimal'
    },
    {
      id: 6,
      name: 'Трикотажное платье',
      category: 'dress',
      price: '7 490 ₽',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop',
      trend: 'Cozy Comfort'
    }
  ];

  const trends = [
    { name: 'Business Chic', icon: 'Briefcase', color: 'bg-blue-100 text-blue-700' },
    { name: 'Urban Street', icon: 'Wallet', color: 'bg-orange-100 text-orange-700' },
    { name: 'Elegant Evening', icon: 'Sparkles', color: 'bg-purple-100 text-purple-700' },
    { name: 'Casual Minimal', icon: 'Coffee', color: 'bg-green-100 text-green-700' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredItems = activeFilter === 'all' 
    ? clothingItems 
    : clothingItems.filter(item => item.category === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary">
      <header className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">VOGUE FIT</h1>
            <nav className="flex items-center gap-6">
              <Button variant="ghost" className="text-sm font-medium">
                Каталог
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                Мои образы
              </Button>
              <Button variant="default" className="bg-accent hover:bg-accent/90">
                <Icon name="User" size={18} className="mr-2" />
                Войти
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              AI-powered виртуальная примерка
            </Badge>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Примерь любой образ не выходя из дома
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Загрузи своё фото и посмотри, как на тебе будет смотреться одежда из нашего каталога. 
              Современные технологии для твоего идеального стиля.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Icon name="Upload" size={20} className="mr-2" />
                Загрузить фото
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button size="lg" variant="outline" className="px-8">
                <Icon name="Play" size={20} className="mr-2" />
                Как это работает
              </Button>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="aspect-[3/4] bg-gradient-to-br from-muted to-accent/5 rounded-3xl overflow-hidden shadow-2xl">
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Uploaded" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="ImagePlus" size={64} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-lg">Загрузите своё фото</p>
                  </div>
                </div>
              )}
              {selectedClothing && selectedImage && (
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg animate-fade-in">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedClothing.image} 
                      alt={selectedClothing.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{selectedClothing.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedClothing.price}</p>
                    </div>
                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                      <Icon name="ShoppingBag" size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="mb-12">
          <h3 className="text-3xl font-bold mb-4">Актуальные тренды</h3>
          <p className="text-muted-foreground text-lg">Стили сезона, которые покорили модные столицы</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {trends.map((trend, idx) => (
            <Card 
              key={idx} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className={`${trend.color} w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                  <Icon name={trend.icon as any} size={28} />
                </div>
                <h4 className="font-semibold">{trend.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-8">Каталог одежды</h3>
          
          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveFilter}>
            <TabsList className="bg-muted">
              <TabsTrigger value="all">Всё</TabsTrigger>
              <TabsTrigger value="jacket">Верхняя одежда</TabsTrigger>
              <TabsTrigger value="dress">Платья</TabsTrigger>
              <TabsTrigger value="shirt">Рубашки</TabsTrigger>
              <TabsTrigger value="skirt">Юбки</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <Card 
                key={item.id}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
                onClick={() => setSelectedClothing(item)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                      <Badge variant="secondary" className="text-xs">{item.trend}</Badge>
                    </div>
                    <p className="font-bold text-lg">{item.price}</p>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-primary hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClothing(item);
                    }}
                  >
                    <Icon name="Wand2" size={18} className="mr-2" />
                    Примерить
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-6">Готов к стильным экспериментам?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Присоединяйся к тысячам пользователей, которые уже нашли свой идеальный стиль с VOGUE FIT
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="px-12"
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            <Icon name="Sparkles" size={20} className="mr-2" />
            Начать примерку
          </Button>
        </div>
      </section>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">VOGUE FIT</h4>
              <p className="text-muted-foreground text-sm">
                Виртуальная примерка одежды с использованием ИИ
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Каталог</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Верхняя одежда</li>
                <li>Платья</li>
                <li>Аксессуары</li>
                <li>Обувь</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Компания</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>О нас</li>
                <li>Контакты</li>
                <li>Вакансии</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Социальные сети</h5>
              <div className="flex gap-4">
                <Icon name="Instagram" size={20} className="text-muted-foreground cursor-pointer hover:text-accent transition-colors" />
                <Icon name="Facebook" size={20} className="text-muted-foreground cursor-pointer hover:text-accent transition-colors" />
                <Icon name="Twitter" size={20} className="text-muted-foreground cursor-pointer hover:text-accent transition-colors" />
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 VOGUE FIT. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
