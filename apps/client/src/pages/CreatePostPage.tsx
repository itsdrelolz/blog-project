import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('http://localhost:3000/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const result = await response.json();
            setImage(result.location);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/creator/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, image }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            // Reset form
            setTitle('');
            setContent('');
            setImage('');
            
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleImageUpload = async (blobInfo: { blob: () => Blob; filename: () => string }, success: (url: string) => void, failure: (error: string) => void) => {
        try {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());
            
            const response = await fetch('http://localhost:3000/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const result = await response.json();
            success(result.location);
        } catch (error) {
            console.error('Error uploading image:', error);
            failure('Image upload failed. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title (required)
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="featured-image" className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail 
                    </label>
                    <div className="flex items-center space-x-4">
                        <input

                            type="file"
                            id="featured-image"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <label

                            htmlFor="featured-image"

                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Choose Image
                        </label>
                        {image && (
                            <div className="flex items-center space-x-2">
                                <img src={image} alt="Preview" className="h-20 w-20 object-cover rounded" />
                                <button
                                    type="button"
                                    onClick={() => setImage('')}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <Editor
                        apiKey={import.meta.env.VITE_TINY_MCE_KEY} 
                        value={content}
                        onEditorChange={(newContent) => setContent(newContent)}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                                'image', 'imagetools'
                            ],
                            images_upload_handler: handleImageUpload,
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Publish
                </button>
            </form>
        </div>
    );
};

export default CreatePostPage;