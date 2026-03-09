'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
  Film,
  Upload,
  Trash2,
  LogOut,
  Video,
  Megaphone,
  Plus,
  X,
  Home,
  ArrowLeft
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  filename: string;
  category: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

interface Ad {
  id: string;
  title: string;
  description: string | null;
  url: string;
  filename: string;
  company: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  fileType: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'feature-work' | 'billboard'>('feature-work');
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Video upload form
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoCategory, setVideoCategory] = useState('');
  const [isVideoFeatured, setIsVideoFeatured] = useState(false);

  // Ad upload form
  const [adFile, setAdFile] = useState<File | null>(null);
  const [adCompany, setAdCompany] = useState('');
  const [adPriority, setAdPriority] = useState(0);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos');
      const data = await response.json();
      if (response.ok) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/admin/ads');
      const data = await response.json();
      if (response.ok) {
        setAds(data.ads);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  useEffect(() => {
    // Check if admin is logged in with simple code auth
    const token = localStorage.getItem('adminToken');
    
    if (token !== 'valid') {
      router.push('/admin/login');
      return;
    }

    // Fetch data on mount
    setTimeout(() => {
      fetchVideos();
      fetchAds();
    }, 0);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    router.push('/admin/login');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
  };

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile || !videoTitle) {
      toast({
        title: 'Error',
        description: 'Please select a file and enter a title',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('title', videoTitle);
    formData.append('description', videoDescription);
    formData.append('category', videoCategory);
    formData.append('isFeatured', isVideoFeatured.toString());

    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to upload video';
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
        return;
      }

      const data = await response.json();
      toast({
        title: 'Success',
        description: 'Video uploaded successfully',
      });
      setVideoFile(null);
      setVideoTitle('');
      setVideoDescription('');
      setVideoCategory('');
      setIsVideoFeatured(false);
      fetchVideos();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload video. Please try a smaller file or check your connection.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleAdUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adFile) {
      toast({
        title: 'Error',
        description: 'Please select a video file',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', adFile);
    formData.append('title', ''); // Auto-generated by API
    formData.append('description', '');
    formData.append('company', adCompany);
    formData.append('priority', adPriority.toString());

    try {
      const response = await fetch('/api/admin/ads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to upload advertisement';
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
        return;
      }

      const data = await response.json();
      toast({
        title: 'Success',
        description: 'Advertisement uploaded successfully',
      });
      setAdFile(null);
      setAdCompany('');
      setAdPriority(0);
      fetchAds();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload advertisement. Please try a smaller file or check your connection.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    console.log('Deleting video with ID:', id);

    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE'
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Video deleted successfully',
        });
        fetchVideos();
      } else {
        let errorMessage = 'Failed to delete video';
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
          console.log('Server error response:', data);
        } catch (e) {
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
          console.log('Failed to parse error:', e);
        }
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete video',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    console.log('Deleting ad with ID:', id);

    try {
      const response = await fetch(`/api/admin/ads/${id}`, {
        method: 'DELETE'
      });

      console.log('Delete ad response status:', response.status);

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Advertisement deleted successfully',
        });
        fetchAds();
      } else {
        let errorMessage = 'Failed to delete advertisement';
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
          console.log('Server error response:', data);
        } catch (e) {
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
          console.log('Failed to parse error:', e);
        }
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete advertisement',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-gold" />
              <div>
                <h1 className="text-xl font-bold">Zee Digital Empire</h1>
                <p className="text-sm text-foreground-secondary">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('feature-work')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'feature-work'
                ? 'text-gold border-b-2 border-gold'
                : 'text-foreground-secondary hover:text-gold'
            }`}
          >
            <Video className="w-4 h-4 inline mr-2" />
            Feature Work Upload
          </button>
          <button
            onClick={() => setActiveTab('billboard')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'billboard'
                ? 'text-gold border-b-2 border-gold'
                : 'text-foreground-secondary hover:text-gold'
            }`}
          >
            <Megaphone className="w-4 h-4 inline mr-2" />
            Billboard Upload
          </button>
        </div>

        {/* Feature Work Tab */}
        {activeTab === 'feature-work' && (
          <div className="space-y-8">
            {/* Upload Video Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-gold" />
                  Upload Feature Work
                </CardTitle>
                <CardDescription>
                  Upload videos to showcase your work on the website. Clients can view these in the Video Showcase section.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVideoUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="videoFile">Video File</Label>
                    <Input
                      id="videoFile"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="videoTitle">Title *</Label>
                    <Input
                      id="videoTitle"
                      placeholder="Video title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="videoDescription">Description</Label>
                    <Textarea
                      id="videoDescription"
                      placeholder="Video description"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      rows={3}
                      className="bg-background border-border resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="videoCategory">Category</Label>
                    <Input
                      id="videoCategory"
                      placeholder="e.g., Commercial, Music Video"
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={isVideoFeatured}
                      onChange={(e) => setIsVideoFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <Label htmlFor="isFeatured">Feature this video</Label>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gold hover:bg-gold-light text-primary-foreground"
                  >
                    {isLoading ? 'Uploading...' : 'Upload Video'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Videos List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Uploaded Videos ({videos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {videos.length === 0 ? (
                  <p className="text-center text-foreground-secondary py-8">
                    No videos uploaded yet
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{video.title}</h3>
                          {video.description && (
                            <p className="text-sm text-foreground-secondary mt-1">
                              {video.description}
                            </p>
                          )}
                          {video.category && (
                            <span className="inline-block text-xs bg-gold/10 text-gold px-2 py-1 rounded mt-2">
                              {video.category}
                            </span>
                          )}
                          {video.isFeatured && (
                            <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-2 ml-2">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <video
                            src={video.url}
                            className="w-20 h-14 object-cover rounded"
                            muted
                          />
                          <Button
                            onClick={() => handleDeleteVideo(video.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billboard Tab */}
        {activeTab === 'billboard' && (
          <div className="space-y-8">
            {/* Upload Ad Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-gold" />
                  Upload to Billboard ({ads.length}/7)
                </CardTitle>
                <CardDescription>
                  Upload advertisement images or videos that will appear in the Featured Advertisements billboard section on the homepage. Maximum 7 items.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adFile">Advertisement Image or Video (Max 10MB)</Label>
                    <Input
                      id="adFile"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setAdFile(e.target.files?.[0] || null)}
                      required
                      disabled={ads.length >= 7}
                      className="bg-background border-border"
                    />
                    {adFile && (
                      <p className="text-sm text-foreground-secondary">
                        Selected: {adFile.name} ({(adFile.size / (1024 * 1024)).toFixed(2)}MB)
                        {adFile.size > 10 * 1024 * 1024 && (
                          <span className="text-destructive ml-2"> - File too large! Max 10MB</span>
                        )}
                      </p>
                    )}
                    {ads.length >= 7 && (
                      <p className="text-sm text-destructive">Maximum limit of 7 items reached. Delete some items to upload more.</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || ads.length >= 7}
                    className="w-full bg-gold hover:bg-gold-light text-primary-foreground"
                  >
                    {isLoading ? 'Uploading...' : 'Upload to Billboard'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Ads List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Billboard Items ({ads.length}/7)</CardTitle>
              </CardHeader>
              <CardContent>
                {ads.length === 0 ? (
                  <p className="text-center text-foreground-secondary py-8">
                    No items in billboard yet
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {ads.map((ad, index) => (
                      <div
                        key={ad.id}
                        className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-semibold text-sm">
                            {index + 1}
                          </div>
                          {ad.fileType === 'image' ? (
                            <img
                              src={ad.url}
                              alt={ad.title}
                              className="w-32 h-20 object-cover rounded"
                            />
                          ) : (
                            <video
                              src={ad.url}
                              className="w-32 h-20 object-cover rounded"
                              muted
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{ad.title}</span>
                            <span className="text-xs text-foreground-muted capitalize">{ad.fileType}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDeleteAd(ad.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
