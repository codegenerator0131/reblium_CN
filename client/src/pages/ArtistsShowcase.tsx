'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Globe } from 'lucide-react';

interface Artist {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  website: string;
  portfolio?: string;
  specialties: string[];
  assetCount: number;
  featured: boolean;
}

const artists: Artist[] = [
  {
    id: 'andre-ferwerda',
    name: 'André Ferwerda',
    title: 'Resident Artist',
    bio: 'Renowned digital artist specializing in character design and clothing creation for avatar platforms. André brings over 15 years of experience in 3D modeling and texture design.',
    image: '/assets/images/artist-lora.jpg',
    website: 'https://andreferwerda.com',
    specialties: ['Character Design', '3D Modeling', 'Clothing', 'Texturing'],
    assetCount: 6,
    featured: true,
  },
  {
    id: 'kristina-nedeljkovic',
    name: 'Kristina Nedeljkovic',
    title: 'Fashion & Digital Design Director',
    bio: 'I am a Founder and Creative Director of LORA LEGARTH, a Scandinavian clothing brand that focuses on simplicity by crafting cosy collections with a minimalistic layout and 3DKN, a digital studio aimed to help fashion and creative industries on their digital journey and express their designs with innovation.',
    image: '/assets/images/artist-akira.jpg',
    website: 'https://loralegarth.com',
    portfolio: 'https://3dkn.studio',
    specialties: ['Fashion Design', 'Minimalist Design', 'Digital Innovation', 'Clothing'],
    assetCount: 8,
    featured: false,
  },
  {
    id: 'marcus-stone',
    name: 'Marcus Stone',
    title: 'Fashion & Accessories Designer',
    bio: 'Expert in contemporary and futuristic fashion design. Marcus creates wearable art that combines style with functionality for the digital age.',
    image: '/assets/images/artist-marcus.jpg',
    website: 'https://marcusstone.io',
    portfolio: 'https://dribbble.com/marcusstone',
    specialties: ['Fashion Design', 'Accessories', 'Texturing', 'Rigging'],
    assetCount: 12,
    featured: false,
  },
  {
    id: 'zara-neon',
    name: 'Zara Neon',
    title: 'Hair & Beauty Specialist',
    bio: 'Innovative hair and beauty designer pushing the boundaries of avatar customization. Zara creates stunning hairstyles and beauty options for diverse avatar expressions.',
    image: '/assets/images/artist-zara.jpg',
    website: 'https://zaraneon.art',
    specialties: ['Hair Design', 'Beauty', 'Makeup', 'Color Theory'],
    assetCount: 10,
    featured: false,
  },
];

export default function ArtistsShowcase() {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const featuredArtist = artists.find(a => a.featured);
  const otherArtists = artists.filter(a => !a.featured);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Artists Showcase</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Meet our talented resident artists and explore their exclusive collections
          </p>
        </div>

        {/* Featured Artist Section */}
        {featuredArtist && (
          <div className="border border-border rounded-lg p-8 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Featured Artist Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-background rounded-lg p-1">
                  <img 
                    src={featuredArtist.image} 
                    alt={featuredArtist.name}
                    className="w-full h-auto rounded-lg object-cover max-h-96"
                  />
                </div>
              </div>

              {/* Featured Artist Info */}
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold mb-3">
                    Featured Artist
                  </div>
                  <h2 className="text-4xl font-bold text-foreground mb-2">{featuredArtist.name}</h2>
                  <p className="text-lg text-cyan-400">{featuredArtist.title}</p>
                </div>

                <p className="text-muted-foreground text-base leading-relaxed">{featuredArtist.bio}</p>

                {/* Specialties */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {featuredArtist.specialties.map(specialty => (
                      <span 
                        key={specialty}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links & CTA */}
                <div className="flex gap-3 pt-4">
                  <a 
                    href={featuredArtist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Portfolio
                  </a>
                  <Link href={`/artist/${featuredArtist.id}`}>
                    <Button variant="outline" className="gap-2">
                      View Assets
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Asset Count */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold">{featuredArtist.assetCount}</span> assets available in store
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Artists Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Our Artist Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArtists.map(artist => (
              <Link key={artist.id} href={`/artist/${artist.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img 
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{artist.name}</CardTitle>
                    <CardDescription>{artist.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>
                    <div className="flex flex-wrap gap-1">
                      {artist.specialties.slice(0, 2).map(specialty => (
                        <span 
                          key={specialty}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {artist.assetCount} assets in store
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
