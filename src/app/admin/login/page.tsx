'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Film, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', 'valid');
        
        toast({
          title: 'Access Granted',
          description: 'Welcome to the admin dashboard',
        });

        router.push('/admin/dashboard');
      } else {
        toast({
          title: 'Access Denied',
          description: data.error || 'Invalid access code',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to authenticate. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-4">
            <Film className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Zee Digital Empire</h1>
          <p className="text-foreground-secondary">Admin Portal</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gold" />
              Admin Access
            </CardTitle>
            <CardDescription>
              Enter the access code to enter the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Access Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter your access code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="bg-background border-border text-center text-lg tracking-widest"
                  maxLength={20}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold hover:bg-gold-light text-primary-foreground"
              >
                {isLoading ? 'Verifying...' : 'Enter Dashboard'}
                <Lock className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-foreground-muted mt-8">
          © {new Date().getFullYear()} Zee Digital Empire. All rights reserved.
        </p>
      </div>
    </div>
  );
}
