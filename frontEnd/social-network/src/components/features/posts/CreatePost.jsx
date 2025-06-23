import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  MapPin, 
  Smile, 
  X, 
  Image as ImageIcon,
  Globe,
  Users,
  Lock
} from 'lucide-react';
import { Button, Card, Avatar } from '../../ui';
import { useAuth } from '../../../hooks';

const CreatePost = () => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [privacy, setPrivacy] = useState('public');
  const [selectedImages, setSelectedImages] = useState([]);

  const privacyOptions = [
    { value: 'public', label: 'Công khai', icon: Globe },
    { value: 'friends', label: 'Bạn bè', icon: Users },
    { value: 'private', label: 'Chỉ mình tôi', icon: Lock },
  ];

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...imageUrls]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim() && selectedImages.length === 0) return;
    
    // Handle post submission here
    console.log({ content, privacy, images: selectedImages });
    
    // Reset form
    setContent('');
    setSelectedImages([]);
    setIsExpanded(false);
  };

  return (
    <Card className="p-6 mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <div className="flex items-start space-x-4">
        <Avatar 
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=3b82f6&color=fff`}
          alt={user?.fullName || 'User'}
          size="md"
        />
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Bạn đang nghĩ gì?"
            className="w-full p-4 border-0 resize-none bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-500"
            rows={isExpanded ? 4 : 2}
          />
          
          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Selected ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageSelect}
                      className="hidden" 
                    />
                    <ImageIcon className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Ảnh</span>
                  </label>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Video className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">Video</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Vị trí</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Smile className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Cảm xúc</span>
                  </button>
                </div>
                
                {/* Privacy Selector */}
                <select 
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {privacyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsExpanded(false);
                    setContent('');
                    setSelectedImages([]);
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!content.trim() && selectedImages.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Đăng bài
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CreatePost;