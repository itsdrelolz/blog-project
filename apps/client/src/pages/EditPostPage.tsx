import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePost } from '../hooks/usePost';
import { updatePost } from '../hooks/postsApi';
import { buildApiUrl } from '../config/api';

const EditPostPage = () => {
  const { id } = useParams();
  const { post, loading, error } = usePost(id!);
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setThumbnail(post.thumbnail);
    }
  }, [post]);

  // Validation helper
  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.replace(/<[^>]*>/g, '').trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Unified image upload helper
  const uploadImageFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(buildApiUrl('/creator/upload-image'), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Image upload failed');
    }

    const { imageUrl } = await response.json();
    if (!imageUrl) throw new Error('No image URL returned');
    return imageUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return alert('Please select an image file');
    if (file.size > 2 * 1024 * 1024) return alert('Image must be under 2MB');

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file);
      setThumbnail(url);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditorImageUpload = async (
    blobInfo: any,
    progress?: (percent: number) => void
  ): Promise<string> => {
    try {
      const file = new File([blobInfo.blob()], blobInfo.filename(), { 
        type: blobInfo.blob().type 
      });
      
      if (progress) {
        progress(0);
      }
      
      const url = await uploadImageFile(file);
      
      if (progress) {
        progress(100);
      }
      
      return url;
    } catch (error) {
      throw new Error('Image upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await updatePost(Number(id), {
        title: title.trim(),
        content,
        thumbnail: thumbnail || undefined,
        published: post?.published || false
      });

      alert('Post updated successfully!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Update error');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: undefined }));
              }
            }}
            required
            className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Thumbnail */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor="thumbnail"
              className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? 'Uploading...' : 'Choose Thumbnail'}
            </label>
            <p className="text-sm text-gray-500">Max size: 2MB</p>
          </div>
          {thumbnail && (
            <div className="relative w-full max-w-2xl mt-4">
              <img src={thumbnail} alt="Thumbnail Preview" className="w-full h-auto rounded-lg shadow-md" />
              <button
                type="button"
                onClick={() => setThumbnail(null)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Remove thumbnail"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Content editor */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <Editor
            apiKey={import.meta.env.VITE_TINY_MCE_KEY}
            value={content}
            onEditorChange={(newContent: string) => {
              setContent(newContent);
              if (errors.content) {
                setErrors(prev => ({ ...prev, content: undefined }));
              }
            }}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table help wordcount imagetools'
              ],
              toolbar:
                'undo redo | formatselect | bold italic forecolor | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | removeformat | help',
              images_upload_handler: handleEditorImageUpload,
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
