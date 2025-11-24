'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/common/Navbar';
import { Sidebar } from '@/components/common/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';

export default function PrintOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Print Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Loading order {id}...</p>
                  {/* Order details will be implemented with React Query */}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
