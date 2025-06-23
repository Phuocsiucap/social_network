import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  Globe,
  Users,
  Lock,
  MapPin,
  ThumbsUp,
  Laugh,
  Angry,
  Frown
} from 'lucide-react';
import { Button, Card, Avatar, Dropdown } from '../../ui';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [reaction, setReaction] = useState(null);
  const reactions = [
    { type: 'like', icon: ThumbsUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { type: 'love', icon: Heart, color: 'text-red-600', bg: 'bg-red-100' },
    { type: 'laugh', icon: Laugh, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { type: 'angry', icon: Angry, color: 'text-red-600', bg: 'bg-red-100' },
    { type: 'sad', icon: Frown, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  const privacyIcons = {
    public: Globe,
    friends: Users,
    private: Lock
  };

  const postMenuItems = [
    { label: 'Lưu bài viết', onClick: () => setIsSaved(!isSaved) },
    { label: 'Sao chép liên kết', onClick: () => {} },
    { label: 'Báo cáo', onClick: () => {} },
    { label: 'Ẩn bài viết', onClick: () => {} },
  ];

  const handleReaction = (reactionType) => {
    setReaction(reaction === reactionType ? null : reactionType);
    setIsLiked(reactionType === 'like');
  };

  const PrivacyIcon = privacyIcons[post.privacy] || Globe;

  return (
    <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar 
              src={post.user.avatar}
              alt={post.user.name}
              size="md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {post.user.name}
                </h3>
                {post.user.verified && (
                  <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>
                  {formatDistanceToNow(new Date(post.timestamp), { 
                    addSuffix: true, 
                    locale: vi 
                  })}
                </span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <PrivacyIcon className="h-3 w-3" />
                </div>
                {post.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {post.location}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <Dropdown
            trigger={
              <Button variant="ghost" size="sm" className="p-2">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </Button>
            }
            items={postMenuItems}
            align="right"
          />
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        
        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="mt-4">
            {post.images.length === 1 ? (
              <img 
                src={post.images[0]} 
                alt="Post content"
                className="w-full max-h-96 object-cover rounded-2xl cursor-pointer hover:opacity-95 transition-opacity"
              />
            ) : (
              <div className={`grid gap-2 rounded-2xl overflow-hidden ${
                post.images.length === 2 ? 'grid-cols-2' : 
                post.images.length === 3 ? 'grid-cols-2 grid-rows-2' : 
                'grid-cols-2 grid-rows-2'
              }`}>
                {post.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image} 
                      alt={`Post content ${index + 1}`}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    />
                    {index === 3 && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          +{post.images.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reactions Summary */}
      {(post.likes > 0 || post.comments > 0) && (
        <div className="px-6 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              {post.likes > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-1">
                    <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <ThumbsUp className="h-3 w-3 text-white" />
                    </div>
                    <div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Heart className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <span>{post.likes}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {post.comments > 0 && (
                <span>{post.comments} bình luận</span>
              )}
              {post.shares > 0 && (
                <span>{post.shares} chia sẻ</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 py-3 border-t border-gray-100">
        <div className="flex items-center justify-around">
          {/* Like Button with Reactions */}
          <div className="relative group">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('like')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                reaction === 'like' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart className={`h-5 w-5 ${reaction === 'like' ? 'fill-current' : ''}`} />
              <span className="font-medium">Thích</span>
            </Button>
            
            {/* Reactions Popup */}
            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
              <div className="flex space-x-1">
                {reactions.map(({ type, icon: Icon, color, bg }) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(type)}
                    className={`p-2 rounded-full hover:scale-110 transition-transform duration-200 ${bg}`}
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">Bình luận</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
          >
            <Share2 className="h-5 w-5" />
            <span className="font-medium">Chia sẻ</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSaved(!isSaved)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isSaved ? 'text-yellow-600 bg-yellow-50' : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          {/* Add Comment */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar 
              src="https://ui-avatars.com/api/?name=Current+User&background=3b82f6&color=fff"
              alt="Current User"
              size="sm"
            />
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Viết bình luận..."
                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                variant="primary" 
                size="sm"
                disabled={!comment.trim()}
                className="rounded-full"
              >
                Gửi
              </Button>
            </div>
          </div>

          {/* Sample Comments */}
          <div className="space-y-3">
            {post.sampleComments?.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Avatar 
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="bg-white px-4 py-2 rounded-2xl">
                    <p className="font-medium text-gray-900 text-sm">{comment.user.name}</p>
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <button className="hover:text-blue-600">Thích</button>
                    <button className="hover:text-blue-600">Trả lời</button>
                    <span>{comment.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default PostCard;