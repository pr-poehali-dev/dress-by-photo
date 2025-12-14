import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Outfit {
  id: number;
  originalPhotoUrl: string;
  resultPhotoUrl: string;
  clothingItemId: number;
  clothingName: string;
  createdAt: string;
}

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const USERS_API = 'https://functions.poehali.dev/7aac71f1-f491-497d-9ccc-4845523944c2';
const OUTFITS_API = 'https://functions.poehali.dev/b768f89b-5208-47f1-a88b-232c1067c4f5';

const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');
    
    if (storedUserId) {
      setUserId(Number(storedUserId));
      setEmail(storedEmail || '');
      setName(storedName || '');
      loadOutfits(Number(storedUserId));
    }
  }, [open]);

  const handleLogin = async () => {
    if (!email) {
      toast({
        title: 'Ошибка',
        description: 'Введите email',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(USERS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });

      const data = await response.json();
      
      if (response.ok) {
        setUserId(data.userId);
        localStorage.setItem('userId', data.userId.toString());
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.name || '');
        
        toast({
          title: 'Успешно!',
          description: 'Вы вошли в личный кабинет'
        });
        
        loadOutfits(data.userId);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось войти',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOutfits = async (uid: number) => {
    try {
      const response = await fetch(OUTFITS_API, {
        method: 'GET',
        headers: {
          'X-User-Id': uid.toString()
        }
      });

      const data = await response.json();
      if (response.ok) {
        setOutfits(data.outfits || []);
      }
    } catch (error) {
      console.error('Failed to load outfits:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setUserId(null);
    setEmail('');
    setName('');
    setOutfits([]);
    toast({
      title: 'Вы вышли',
      description: 'До скорой встречи!'
    });
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Личный кабинет</DialogTitle>
        </DialogHeader>

        {!userId ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Имя (опционально)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Войти / Зарегистрироваться'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="text-sm text-muted-foreground">Ваш аккаунт</p>
                <p className="font-semibold">{email}</p>
                {name && <p className="text-sm">{name}</p>}
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Сохранённые образы ({outfits.length})
              </h3>
              
              {outfits.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="ImageOff" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>У вас пока нет сохранённых образов</p>
                  <p className="text-sm mt-2">Создайте примерку и сохраните результат</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {outfits.map((outfit) => (
                    <Card key={outfit.id} className="overflow-hidden">
                      <div className="aspect-[4/5] relative">
                        <img 
                          src={outfit.resultPhotoUrl} 
                          alt={outfit.clothingName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{outfit.clothingName}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(outfit.createdAt).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => downloadImage(outfit.resultPhotoUrl, `outfit-${outfit.id}.jpg`)}
                          >
                            <Icon name="Download" size={16} className="mr-2" />
                            Скачать
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              navigator.share?.({
                                title: 'Мой образ',
                                text: `Примерил(а) ${outfit.clothingName}`,
                                url: outfit.resultPhotoUrl
                              }).catch(() => {
                                navigator.clipboard.writeText(outfit.resultPhotoUrl);
                                toast({
                                  title: 'Ссылка скопирована',
                                  description: 'Теперь можно поделиться'
                                });
                              });
                            }}
                          >
                            <Icon name="Share2" size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
