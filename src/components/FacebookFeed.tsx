import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { FacebookPost } from '../context/ClubContext';

interface FacebookFeedProps {
  posts: FacebookPost[];
  clubName?: string;
}

const FacebookFeed: React.FC<FacebookFeedProps> = ({ posts, clubName }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">f</span>
        </div>
        <span>Actualités Facebook {clubName && `- ${clubName}`}</span>
      </h3>
      
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PL</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {clubName || 'Phuong Long Vo Dao'}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{post.content}</p>
          
          {post.image && (
            <div className="mb-4">
              <img
                src={post.image}
                alt="Publication Facebook"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Commenter</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {posts.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucune actualité récente disponible.</p>
        </div>
      )}
    </div>
  );
};

export default FacebookFeed;